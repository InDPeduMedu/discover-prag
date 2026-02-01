import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    {/* Logo Placeholder */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight">discoverPrague</span>
                    </Link>
                </div>

                <nav className="flex items-center gap-4">
                    <Button variant="ghost" asChild className="text-sm font-medium">
                        <Link href="/about">About</Link>
                    </Button>
                    <Button variant="ghost" asChild className="text-sm font-medium">
                        <Link href="/contact">Contact</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
