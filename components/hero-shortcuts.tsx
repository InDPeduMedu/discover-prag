"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Bicycle,
    Coffee,
    Heart,
    Camera,
    Sparkle,
    Ghost,
    CaretLeft,
    CaretRight,
    Plus
} from "@phosphor-icons/react";

interface Category {
    title: string;
    icon: any;
    examples: string[];
}

const CATEGORIES: Category[] = [
    {
        title: "Culture & Breakfast",
        icon: Coffee,
        examples: [
            "Historic writer's breakfast spot",
            "Authentic Czech dinner away from tourists",
            "Best jazz clubs in the Old Town",
            "Café Louvre: Einstein's favorite spot",
            "Street food at Naplavka market",
            "Underground medieval tavern dining",
            "Sip coffee in a Baroque library",
            "Late night guláš at a local pub",
            "Modern bistro lunch in Karlin"
        ]
    },
    {
        title: "Trips & Adventures",
        icon: Bicycle,
        examples: [
            "1 day bike trip along the Vltava",
            "Best walking tour for history buffs",
            "Day trip to Kutna Hora",
            "Hiking in Divoka Sarka",
            "River cruise with panoramic views",
            "Old-timer car tour of the city",
            "Visit the Bone Church (Ossuary)",
            "Evening ghost tour of Old Town",
            "Pilsen brewery tour from Prague"
        ]
    },
    {
        title: "Personal Vibes",
        icon: Ghost,
        examples: [
            "Best spot for an introvert in Prague",
            "Most romantic viewpoint at sunset",
            "Hidden gardens where locals hide",
            "Quiet library for reading",
            "Peaceful early morning stroll",
            "Modern art galleries away from crowds",
            "Meditative spots in Vysehrad",
            "Best places to watch the sunset",
            "Cozy bookstores with coffee"
        ]
    },
    {
        title: "Photography",
        icon: Camera,
        examples: [
            "If I want to take only one photo my whole trip...",
            "Best angle for Prague Castle at night",
            "Symmetric architecture for Instagram",
            "The narrowest street in Prague",
            "Charles Bridge at 5 AM",
            "Dancing House photo angles",
            "Metronome view of the bridges",
            "David Cerny's weirdest sculptures",
            "Old Town Square from a rooftop"
        ]
    }
];

// Mixed suggestions for the top row
const SUGGESTIONS = [
    "1 day bike trip along the Vltava",
    "Historic writer's breakfast spot",
    "Best spot for an introvert in Prague",
    "Charles Bridge at 5 AM for photos",
    "Modern bistro lunch in Karlin",
    "Hidden gardens where locals hide"
];

interface HeroShortcutsProps {
    onSelect: (text: string) => void;
    className?: string;
}

function ShortcutRow({
    title,
    icon: Icon,
    examples,
    onSelect
}: {
    title: string;
    icon: any;
    examples: string[];
    onSelect: (t: string) => void
}) {
    const [startIndex, setStartIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Number of items to show at once (responsive)
    const [itemsPerPage, setItemsPerPage] = useState(3);

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 640) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else setItemsPerPage(3);
        };
        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const handleNext = () => {
        setStartIndex((prev) => (prev + itemsPerPage >= examples.length ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setStartIndex((prev) => (prev === 0 ? examples.length - itemsPerPage : prev - 1));
    };

    const visibleExamples = examples.slice(startIndex, startIndex + itemsPerPage);
    // Pad if we're at the end and itemsPerPage is bigger (for smooth wrapping/looping feel)
    if (visibleExamples.length < itemsPerPage) {
        visibleExamples.push(...examples.slice(0, itemsPerPage - visibleExamples.length));
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between text-muted-foreground/80 px-1 border-b border-border/10 pb-2">
                <div className="flex items-center gap-2">
                    {Icon && <Icon weight="bold" className="h-4 w-4 text-primary" />}
                    <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePrev}
                        className="hover:text-primary transition-colors opacity-40 hover:opacity-100 p-1"
                    >
                        <CaretLeft weight="bold" className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="hover:text-primary transition-colors opacity-40 hover:opacity-100 p-1"
                    >
                        <CaretRight weight="bold" className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 transition-all duration-500 overflow-hidden">
                {visibleExamples.map((ex, idx) => (
                    <button
                        key={`${ex}-${idx}`}
                        onClick={() => onSelect(ex)}
                        className={cn(
                            "flex text-left p-5 rounded-2xl bg-background border border-border/50 hover:border-primary/50 hover:bg-secondary/30 transition-all duration-300 shadow-sm hover:shadow-md group",
                            "animate-in fade-in slide-in-from-right-2 fill-mode-both"
                        )}
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <span className="text-[15px] font-medium leading-snug group-hover:text-primary transition-colors">
                            {ex}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export function HeroShortcuts({ onSelect, className }: HeroShortcutsProps) {
    const [showAll, setShowAll] = useState(false);

    return (
        <div className={cn("w-full max-w-5xl mx-auto px-4 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300", className)}>
            <div className="space-y-12">
                {/* Top Section: Suggestions Carousel */}
                <ShortcutRow
                    title="Suggestions"
                    icon={Sparkle}
                    examples={SUGGESTIONS}
                    onSelect={onSelect}
                />

                {/* Expandable Section: Categorized Carousels */}
                {!showAll ? (
                    <div className="flex justify-center pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowAll(true)}
                            className="rounded-full px-8 h-12 border-primary/20 hover:bg-primary/5 text-primary font-semibold flex items-center gap-2 transition-all hover:scale-105"
                        >
                            <Plus weight="bold" className="h-4 w-4" />
                            See more suggestions
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
                        {CATEGORIES.map((category) => (
                            <ShortcutRow
                                key={category.title}
                                title={category.title}
                                icon={category.icon}
                                examples={category.examples}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-16 pt-8 border-t border-border/10 text-center">
                <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
                    Prague Travel AI • Personalized Itineraries • Local Secrets • Czech Republic Guide
                </p>
            </div>
        </div>
    );
}
