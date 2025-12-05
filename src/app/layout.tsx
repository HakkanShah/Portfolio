import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono, Bangers, Comic_Neue } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import VisitorTracker from '@/components/visitor-tracker';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bangers',
});

const comicNeue = Comic_Neue({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-comic-neue',
  style: ['normal', 'italic'],
});

export const viewport: Viewport = {
  themeColor: "#00ffff",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://hakkan.is-a.dev'),
  title: "Hakkan - Full Stack Developer",
  description:
    "Hakkan Parbej Shah is a Full Stack Developer skilled in building modern, scalable, and efficient web applications. Passionate about clean code, seamless user experiences, and turning ideas into impactful digital products.",
  manifest: "/manifest.webmanifest",
  keywords: [
    "Hakkan",
    "Hakkan Parbej Shah",
    "Hakkan Shah",
    "Full Stack Developer",
    "MERN Stack Developer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "Node.js Developer",
    "JavaScript Developer",
    "Developer Portfolio",
    "Software Engineer",
    "Web Application Developer",
    "Clean Code",
    "User Experience",
    "hakkan.is-a.dev",
    "Hakkan Portfolio"
  ],
  authors: [{ name: "Hakkan Parbej Shah" }],
  creator: "Hakkan Parbej Shah",
  category: "Personal Portfolio / Web Development",
  applicationName: "Hakkan Portfolio",
  robots: "index, follow",
  openGraph: {
    title: "Hakkan Parbej Shah - Full Stack Developer",
    description:
      "Explore the portfolio of Hakkan Parbej Shah — a Full Stack Developer dedicated to crafting clean, efficient, and high-quality web applications with modern technologies.",
    url: "https://hakkan.is-a.dev/",
    siteName: "Hakkan Parbej Shah Portfolio",
    images: [
      {
        url: "https://hakkan.is-a.dev/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Hakkan Parbej Shah Full Stack Portfolio"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkan Parbej Shah - Full Stack Developer",
    description:
      "Full Stack Developer passionate about building scalable, modern, and user-focused web applications. Explore my portfolio and projects.",
    creator: "@HakkanShah",
    images: ["https://hakkan.is-a.dev/profile.jpg"]
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'google-site-verification-code', // Replace with your actual code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} ${comicNeue.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <VisitorTracker />
          </Suspense>
          {children}
          <Toaster />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Hakkan Parbej Shah",
              "url": "https://hakkan.is-a.dev",
              "image": "https://hakkan.is-a.dev/profile.jpg",
              "sameAs": [
                "https://github.com/HakkanShah",
                "https://www.linkedin.com/in/hakkan/",
                "https://g.dev/hakkan"
              ],
              "jobTitle": "Full Stack Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Self-Employed"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
