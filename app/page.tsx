export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="bg-map-pattern" />
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <main className="relative z-10 flex flex-col items-center text-center px-6">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground selection:bg-primary selection:text-primary-foreground">
                        DISCOVER<span className="text-primary italic">.</span>PRAG
                    </h1>

                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-border" />
                        <p className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-muted-foreground">
                            Coming Soon
                        </p>
                        <div className="h-[1px] w-12 bg-border" />
                    </div>
                </div>

                <div className="mt-12 group cursor-default">
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-[280px] md:max-w-none transition-colors duration-500 group-hover:text-foreground">
                        A new standard in digital excellence is being forged.
                    </p>
                </div>
            </main>

            {/* Decorative Footer Element */}
            <div className="absolute bottom-12 flex flex-col items-center opacity-40">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-transparent rounded-full" />
            </div>
        </div>
    );
}