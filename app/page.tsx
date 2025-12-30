export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="relative group">
                {/* Decorative background blur */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative px-8 py-12 bg-card border border-border rounded-xl shadow-2xl text-center max-w-md">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
                        In development
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium">
                        Stay tuned. Something amazing is coming.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary-foreground ring-1 ring-inset ring-primary/20">
                            Coming Soon
                        </span>
                    </div>
                </div>
            </div>

            {/* Subtle background pattern/elements */}
            <div className="fixed top-0 left-0 -z-10 h-full w-full">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
            </div>
        </div>
    );
}