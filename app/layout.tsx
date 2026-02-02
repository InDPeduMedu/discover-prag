import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ContactProvider } from "@/context/contact-context";
import { ContactModal } from "@/components/contact-modal";

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
  title: "Discover Prague | AI Travel Companion",
  description: "Your personal AI guide to the Heart of Europe. Plan your perfect trip to Prague with local insights.",
  openGraph: {
    title: "Discover Prague",
    description: "Your personal AI guide to the Heart of Europe.",
    url: "https://discoverprague.com",
    siteName: "Discover Prague",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Prague",
    description: "Your personal AI guide to the Heart of Europe.",
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
        <ContactProvider>
          {children}
          <ContactModal />
        </ContactProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""} />
    </html>
  );
}
