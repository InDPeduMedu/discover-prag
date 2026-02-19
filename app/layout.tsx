import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ContactProvider } from "@/context/contact-context";
import { ContactModal } from "@/components/contact-modal";
import { CookieConsent } from "@/components/ui/cookie-consent";
import Script from "next/script";

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Discover Prague | AI Travel Companion & Local Guide",
  description: "Plan your perfect trip to Prague with our AI guide. Discover hidden gems, authentic Czech food, historic spots, and personalized itineraries tailored to you.",
  keywords: ["Prague travel", "AI travel guide", "Prague itinerary", "Czech Republic tourism", "Prague hidden gems", "best restaurants Prague", "Prague castle guide"],
  authors: [{ name: "Discover Prague AI" }],
  creator: "Discover Prague",
  openGraph: {
    title: "Discover Prague | AI Travel Companion",
    description: "Your personal AI guide to the Heart of Europe. Experience Prague like a local with personalized itineraries.",
    url: "https://discoverprague.com",
    siteName: "Discover Prague",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists or is a placeholder
        width: 1200,
        height: 630,
        alt: "Discover Prague AI Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Prague | AI Travel Companion",
    description: "Your personal AI guide to the Heart of Europe. Plan your dream trip today.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Initialize consent with a default state of 'denied'
            if (!localStorage.getItem('cookie-consent')) {
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
              });
            } else {
              const consent = localStorage.getItem('cookie-consent');
              const value = consent === 'accepted' ? 'granted' : 'denied';
              gtag('consent', 'default', {
                'ad_storage': value,
                'ad_user_data': value,
                'ad_personalization': value,
                'analytics_storage': value
              });
            }
          `}
        </Script>
        <ContactProvider>
          {children}
          <ContactModal />
          <CookieConsent />
        </ContactProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""} />
    </html>
  );
}
