"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useContact } from "@/context/contact-context";

export default function PrivacyPage() {
    const { openContact } = useContact();

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto max-w-3xl px-4 py-8 md:py-16">
                <article className="max-w-none">
                    <h2 className="text-3xl font-bold tracking-tight mb-6">Privacy Notice</h2>
                    <p className="text-muted-foreground mb-4"><strong>Last updated: February 19, 2026</strong></p>
                    <p className="text-muted-foreground leading-relaxed mb-8">DiscoverPrague.com is a personal AI travel planning demo for Prague. This notice explains what happens when you visit.</p>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">What we collect</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                        <li><strong>Server logs</strong> (automatic by Vercel): IP address, timestamp, user‑agent (browser/device) for technical purposes. These are kept for a short period and not used for tracking.</li>
                        <li><strong>Google Analytics (Opt-in)</strong>: usage data (pages visited, time spent, approximate location) to see how visitors use the site. Tracking is disabled by default and only activates if you click &quot;Accept&quot; on our cookie banner. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">Google Privacy Policy</a>.</li>
                        <li><strong>Chat messages</strong>: your inputs are sent to Google Gemini (Google servers) to generate travel suggestions. See <a href="https://ai.google/responsibility/principles/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">Google AI Privacy</a>.</li>
                        <li><strong>Contact email</strong>: if you use the contact button, your name, email and message are sent directly to the site owner’s email.</li>
                    </ul>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">Cookie Policy</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        We use Google Analytics cookies to improve our site. You can choose to accept or decline tracking. If you change your mind, you can clear your browser cookies to see the consent banner again.
                    </p>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">What we do NOT do</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6 text-muted-foreground">
                        <li>No user accounts, logins or personal data storage.</li>
                        <li>No newsletter, no payments, no affiliate links.</li>
                        <li>No selling your data. No tracking across other websites.</li>
                    </ul>

                    <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">Your rights</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">You can contact the site owner at <button onClick={openContact} className="text-primary font-medium hover:underline underline-offset-4">Contact Support</button> to ask about data or request deletion. As a Serbia‑based site, Serbian data protection laws apply.</p>
                </article>
            </main>
            <Footer />
        </div>
    );
}
