"use client";

import React from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useContact } from "@/context/contact-context";
import { MapPin, MessageSquare, BrainCircuit, CheckCircle2, AlertTriangle, Calendar, Navigation } from "lucide-react";

export default function AboutPage() {
    const { openContact } = useContact();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 px-4 md:py-32 bg-secondary/20">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            About Discover Prague
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Discover Prague is an AI‑powered travel companion focused entirely on helping you plan your time in Prague.
                            Describe what you like, and we turn it into a structured, realistic plan.
                        </p>
                    </div>
                </section>

                {/* What The App Does - Feature Grid */}
                <section className="py-16 md:py-24 px-4 bg-background">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">What the App Does</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard
                                icon={<Calendar className="h-10 w-10 text-primary" />}
                                title="Smart Itineraries"
                                description="Creates day plans based on your interests—history, architecture, views, or nature."
                            />
                            <FeatureCard
                                icon={<MapPin className="h-10 w-10 text-primary" />}
                                title="Curated Spots"
                                description="Suggests specific places with estimated visit durations so you can plan realistically."
                            />
                            <FeatureCard
                                icon={<Navigation className="h-10 w-10 text-primary" />}
                                title="Logical Routing"
                                description="Sequences your stops logically so you aren't zig-zagging across the city."
                            />
                            <FeatureCard
                                icon={<MessageSquare className="h-10 w-10 text-primary" />}
                                title="Adaptable"
                                description="Adapts to constraints like 'no crowds' or 'half-day' availability."
                            />
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 md:py-24 px-4 bg-secondary/10">
                    <div className="container mx-auto max-w-4xl">
                        <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">How It Works</h2>
                        <div className="space-y-12">
                            <div className="flex gap-6 items-start">
                                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                                    <MapPin className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Curated Database</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We use a curated database of places in Prague tagged with attributes like history, architecture, viewpoints, and unique "vibes".
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                                    <BrainCircuit className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Planning Engine</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        A smart engine looks at your available time and interests to intelligently choose and order your stops.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                                    <MessageSquare className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">AI Chat Layer</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        An AI chat interface turns that data into human‑readable plans, explains the choices, and refines them based on your feedback.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="py-16 md:py-24 px-4 bg-background">
                    <div className="container mx-auto max-w-4xl">
                        <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">Who Is This For?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <CheckItem text="You want to avoid hours researching blogs." />
                            <CheckItem text="You like describing preferences once and getting a plan." />
                            <CheckItem text="You enjoy experimenting with AI travel tools." />
                            <CheckItem text="You want a local-style guide, not a booking engine." />
                        </div>
                    </div>
                </section>

                {/* Constraints / Disclaimer */}
                <section className="py-16 px-4 bg-amber-50 dark:bg-amber-950/20 border-y border-amber-100 dark:border-amber-900/30">
                    <div className="container mx-auto max-w-4xl">
                        <div className="flex gap-4 items-start">
                            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500 shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Current Constraints</h3>
                                <ul className="space-y-3 text-amber-800 dark:text-amber-200/80">
                                    <li className="flex gap-2 items-start">• <span>Information may be out of date (hours, closures). Always double-check.</span></li>
                                    <li className="flex gap-2 items-start">• <span>No booking, tickets, or payment handling.</span></li>
                                    <li className="flex gap-2 items-start">• <span>No user accounts or cloud sync yet.</span></li>
                                    <li className="flex gap-2 items-start">• <span>Focused strictly on Prague, not the whole Czech Republic.</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-4 text-center">
                    <div className="container mx-auto max-w-2xl">
                        <h2 className="text-3xl font-bold mb-6">Feedback & Ideas</h2>
                        <p className="text-muted-foreground mb-8 text-lg">
                            If you have ideas for new features or spot something wrong, we'd love to hear from you. This project evolves based on what real travelers find useful.
                        </p>
                        <button
                            onClick={openContact}
                            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Contact Us
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}

function CheckItem({ text }: { text: string }) {
    return (
        <div className="flex gap-3 items-center p-4 rounded-xl border bg-card">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            <span className="font-medium">{text}</span>
        </div>
    );
}
