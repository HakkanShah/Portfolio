import { NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

async function getGeoInfo(ip: string) {
    try {
        // Skip local IPs
        if (ip === '::1' || ip === '127.0.0.1') return null;

        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Geo fetch failed:', error);
        return null;
    }
}

async function incrementVisitorCount() {
    try {
        const docRef = doc(db, "site_stats", "visitors");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, {
                count: increment(1)
            });
            return docSnap.data().count + 1;
        } else {
            // Initialize if not exists
            await setDoc(docRef, { count: 1 });
            return 1;
        }
    } catch (error) {
        console.error("Error updating visitor count:", error);
        return "Error";
    }
}

export async function POST(req: Request) {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('API Error: DISCORD_WEBHOOK_URL is not defined');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 1. Get Basic Headers
        const userAgentString = req.headers.get('user-agent') || 'Unknown';
        const refererHeader = req.headers.get('referer') || 'Direct';
        const ip = (req.headers.get('x-forwarded-for') || '::1').split(',')[0];

        // Parse body for custom source (e.g. from ?ref=)
        let customSource = '';
        try {
            const body = await req.json();
            customSource = body.source;
        } catch (e) {
            // Ignore JSON parse errors (body might be empty)
        }

        const finalSource = customSource || refererHeader;

        // 2. Parse Device Info
        const parser = new UAParser(userAgentString);
        const device = parser.getDevice();
        const os = parser.getOS();
        const browser = parser.getBrowser();

        const deviceString = `${browser.name || 'Unknown Browser'} on ${os.name || 'Unknown OS'} ${device.model ? `(${device.vendor} ${device.model})` : ''}`;

        // 3. Get Geolocation
        const geo = await getGeoInfo(ip);
        let locationString = 'Unknown Location';
        let mapsLink = '';
        let ispInfo = '';

        if (ip === '::1' || ip === '127.0.0.1') {
            locationString = '🏠 Local Development';
        } else if (geo) {
            locationString = `${geo.city}, ${geo.region}, ${geo.country_name}`;
            mapsLink = `[View on Maps](https://www.google.com/maps?q=${geo.latitude},${geo.longitude})`;
            ispInfo = `\n**ISP:** ${geo.org}`;
        } else {
            // Fallback to Vercel headers
            const city = req.headers.get('x-vercel-ip-city');
            const country = req.headers.get('x-vercel-ip-country');
            if (city && country) {
                locationString = `${city}, ${country}`;
            }
        }

        // 4. Increment Visitor Count
        const visitCount = await incrementVisitorCount();

        // 5. Time
        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'medium',
        });

        // 6. Construct Rich Payload
        const payload = {
            username: "Portfolio Visitor Bot",
            avatar_url: "https://github.com/HakkanShah.png",
            embeds: [
                {
                    title: `🚀 New Visitor Detected! (#${visitCount})`,
                    color: 0x00ff9d,
                    fields: [
                        {
                            name: "🕒 Time",
                            value: timestamp,
                            inline: false
                        },
                        {
                            name: "🌍 Location",
                            value: `${locationString}${ispInfo}\n${mapsLink}`,
                            inline: true
                        },
                        {
                            name: "💻 Device",
                            value: deviceString,
                            inline: true
                        },
                        {
                            name: "🔗 Source",
                            value: finalSource,
                            inline: true
                        },
                        {
                            name: "📊 Total Visits",
                            value: `**${visitCount}**`,
                            inline: true
                        }
                    ],
                    footer: {
                        text: `IP: ${ip} • Browser: ${browser.version}`
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Discord API responded with ${response.status}: ${errorText}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to send notification:', error);
        return NextResponse.json({ error: `Failed to send notification: ${error.message}` }, { status: 500 });
    }
}
