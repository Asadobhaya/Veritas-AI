import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veritas AI - Academic Integrity Platform",
  description: "Next-generation academic integrity, similarity detection, and originality improvement platform.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ShortsAI" />
        <meta property="og:title" content="ShortsAI — YouTube to Viral Shorts" />
        <meta property="og:description" content="AI-powered YouTube to Shorts converter. 5–7 vertical clips with captions, titles and hashtags in seconds." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className="bg-[#0A0A0F] text-[#F8F8FF] antialiased" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>
        {children}
      </body>
    </html>
  );
}
