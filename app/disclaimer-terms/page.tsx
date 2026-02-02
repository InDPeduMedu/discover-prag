"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useContact } from "@/context/contact-context";

export default function DisclaimerPage() {
    const { openContact } = useContact();

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto max-w-3xl px-4 py-8 md:py-16">
                <article className="max-w-none">
                    <h2 className="text-3xl font-bold tracking-tight mb-6">Disclaimer & Terms of Use</h2>
                    <p className="text-muted-foreground mb-8"><strong>Last updated: February 1, 2026</strong></p>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">About this site</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">DiscoverPrague.com is an <strong>AI demo</strong> to showcase travel planning for Prague. It’s a personal project with no commercial purpose.</p>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">What you get</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">The AI generates general itinerary suggestions based on your chat inputs. There are no bookings, tours or services provided.</p>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">Important warnings</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                        <li><strong>AI content may be inaccurate, incomplete or outdated</strong>. Always verify details (opening hours, prices, safety, transport) yourself before relying on suggestions.</li>
                        <li>This is <strong>not professional advice</strong> (legal, medical, financial, travel).</li>
                        <li>No liability for decisions you make based on this site.</li>
                    </ul>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">Your responsibilities</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                        <li>Use the site responsibly and legally.</li>
                        <li>Don’t try to hack, scrape or misuse the site.</li>
                        <li>Contact <button onClick={openContact} className="text-primary font-medium hover:underline underline-offset-4">Contact Support</button> for issues or feedback.</li>
                    </ul>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">Changes</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">The site owner can change, pause or stop the site at any time without notice.</p>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">Governing law</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">Serbian law applies. Serbian courts have jurisdiction.</p>
                </article>
            </main>
            <Footer />
        </div>
    );
}
