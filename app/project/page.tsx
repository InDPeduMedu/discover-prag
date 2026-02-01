"use client";

import React from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useContact } from "@/context/contact-context";
import { Sparkles, Code2, LineChart, Handshake } from "lucide-react";

export default function ProjectPage() {
    const { openContact } = useContact();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 px-4 md:py-32 bg-secondary/10">
                    <div className="container mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-6">
                            Experiment
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            About The Project
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            A personal passion project exploring what it looks like to build an "AI-first" travel planner from day one.
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-16 md:py-24 px-4 bg-background">
                    <div className="container mx-auto max-w-3xl space-y-16">

                        {/* The Motivation */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <h2 className="text-3xl font-bold tracking-tight mb-6">The Experiment</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                As an experienced product designer, I’m more technical than the average person but definitely not a full‑time engineer. That mix made this project especially interesting: I approached it like a design and product challenge, then relied heavily on AI to help with data, structure, copy, and logic.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                The whole process has been surprisingly insightful, fun, and honestly pretty exciting. It's an exploration of how far you can go with modern AI tools and minimal coding knowledge while still creating something genuinely useful.
                            </p>
                        </div>

                        {/* What we're testing */}
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
                                <MessageSquareIcon className="h-8 w-8 text-primary mb-4" />
                                <h3 className="font-semibold text-lg mb-2">AI-First UX</h3>
                                <p className="text-sm text-muted-foreground">Letting a chat interface be the primary way people interact with a travel planner.</p>
                            </div>
                            <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
                                <Code2 className="h-8 w-8 text-primary mb-4" />
                                <h3 className="font-semibold text-lg mb-2">AI Plumbing</h3>
                                <p className="text-sm text-muted-foreground">Seeing how much of the content, logic, and code can be accelerated by AI.</p>
                            </div>
                            <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
                                <Sparkles className="h-8 w-8 text-primary mb-4" />
                                <h3 className="font-semibold text-lg mb-2">Human Curation</h3>
                                <p className="text-sm text-muted-foreground">Learning where human judgment and unique "vibe" data still matter most.</p>
                            </div>
                        </div>

                        {/* Domain / Business Angle */}
                        <div className="rounded-3xl bg-secondary/20 p-8 md:p-12">
                            <div className="flex gap-4 items-start">
                                <Handshake className="h-8 w-8 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">The Practical Angle</h3>
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        This project is also a way to explore a different approach to selling a domain name. Instead of listing an empty domain on a marketplace, I wanted to show what <strong>discoverprague.com</strong> could become with a bit of vision.
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed mb-8">
                                        Because of that, I’m very much open to offers or conversations about partnering around or acquiring this domain and project.
                                    </p>
                                    <button
                                        onClick={openContact}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                    >
                                        Get in Touch
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}
