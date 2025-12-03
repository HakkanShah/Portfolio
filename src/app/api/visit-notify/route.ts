import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('API Error: DISCORD_WEBHOOK_URL is not defined');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Get visitor details
        const userAgent = req.headers.get('user-agent') || 'Unknown';
        const referer = req.headers.get('referer') || 'Direct';

        // In production (Vercel/Netlify), these headers give IP and Geo info
        const ip = req.headers.get('x-forwarded-for') || 'Unknown IP';
        const country = req.headers.get('x-vercel-ip-country') || 'Unknown Location';
        const city = req.headers.get('x-vercel-ip-city') || '';

        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata', // Default to IST as requested, or use UTC
            dateStyle: 'full',
            timeStyle: 'medium',
        });

        const payload = {
            username: "Portfolio Visitor Bot",
            avatar_url: "https://github.com/HakkanShah.png",
            embeds: [
                {
                    title: "🚀 New Visitor Detected!",
                    color: 0x00ff9d, // Neon green to match portfolio theme
                    fields: [
                        {
                            name: "🕒 Time",
                            value: timestamp,
                            inline: true
                        },
                        {
                            name: "🌍 Location",
                            value: `${city ? city + ', ' : ''}${country}`,
                            inline: true
                        },
                        {
                            name: "🔗 Source",
                            value: referer,
                            inline: false
                        },
                        {
                            name: "📱 Device",
                            value: userAgent,
                            inline: false
                        }
                    ],
                    footer: {
                        text: `IP: ${ip.split(',')[0]}` // Show only first IP if multiple
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Discord API Error:', response.status, errorText);
            throw new Error(`Discord API responded with ${response.status}: ${errorText}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to send notification:', error);
        return NextResponse.json({ error: `Failed to send notification: ${error.message}` }, { status: 500 });
    }
}
