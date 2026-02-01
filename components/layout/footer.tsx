"use client";

import Link from "next/link";
import { useContact } from "@/context/contact-context";

export function Footer() {
    const { openContact } = useContact();

    return (
        <footer className="w-full border-t bg-background py-6 md:py-0">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row md:px-6">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © {new Date().getFullYear()} Discover Prague. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <Link href="/about" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
                        About
                    </Link>
                    <button
                        onClick={openContact}
                        className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                        Contact
                    </button>
                    <Link href="/privacy-notice" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
                        Privacy Notice
                    </Link>
                    <Link href="/disclaimer-terms" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
                        Disclaimer & Terms of Use
                    </Link>
                    <Link href="/project" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
                        The Project
                    </Link>
                </div>
            </div>
        </footer>
    );
}
