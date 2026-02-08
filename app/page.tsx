"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { PaperPlaneRight, Spinner } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { sendMessage } from "@/app/actions/chat";
import { sendGAEvent } from "@next/third-parties/google";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
    role: "user" | "model";
    text: string;
};

export default function ChatPage() {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isChatStarted = messages.length > 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue("");

        // Optimistic UI: Add user message immediately
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        // Log the inquiry to Google Analytics
        sendGAEvent({ event: 'chat_inquiry', value: userMessage });

        try {
            const response = await sendMessage(userMessage);

            if (response.error) {
                console.error(response.error);
                setMessages((prev) => [...prev, { role: "model", text: `Error: ${response.error}` }]);
            } else if (response.text) {
                setMessages((prev) => [...prev, { role: "model", text: response.text }]);
            }
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div className="bg-map-pattern" />
            <Header />

            <main className={`flex-1 flex flex-col relative overflow-hidden ${isChatStarted ? "bg-background/95 backdrop-blur-sm" : "bg-transparent"}`}>
                {!isChatStarted ? (
                    /* Hero Mode: Centered Layout */
                    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                        <div className="mb-12 space-y-6">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent break-words max-w-full">
                                Discover Prague
                                <br className="hidden md:inline" />
                                <span className="text-primary italic block md:inline mt-2 md:mt-0">Tailored to YOU</span>
                            </h1>
                            <p className="text-lg text-muted-foreground md:text-2xl max-w-[800px] mx-auto">
                                Your personal AI guide to the Heart of Europe.
                            </p>
                        </div>

                        {/* Hero Input */}
                        <div className="w-full max-w-2xl">
                            <div className="relative flex items-center w-full rounded-2xl bg-background border border-border/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Describe your ideal trip..."
                                    className="w-full min-h-[60px] p-5 pr-14 text-lg bg-transparent border-none focus:outline-none resize-none placeholder:text-muted-foreground/70"
                                    style={{ fieldSizing: "content" } as any}
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSend}
                                    className="absolute right-3 bottom-3 h-10 w-10 rounded-xl shrink-0 transition-all shadow-sm"
                                    disabled={!inputValue.trim() || isLoading}
                                >
                                    <PaperPlaneRight weight="fill" className="h-5 w-5" />
                                    <span className="sr-only">Send message</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Chat Mode: Scrollable Messages + Fixed Bottom Input */
                    <>
                        {/* Scrollable Message Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
                            <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-32">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}>
                                        <div
                                            className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-6 py-4 text-lg shadow-sm ${msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary/40 border border-border/50 backdrop-blur"
                                                }`}
                                        >
                                            {msg.role === "user" ? (
                                                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                            ) : (
                                                <div className="prose prose-lg dark:prose-invert max-w-none break-words leading-relaxed">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                                                            h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                                            h3: ({ node, ...props }: any) => <h3 className="text-md font-bold mt-3 mb-1" {...props} />,
                                                            ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-1 mb-3" {...props} />,
                                                            ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-1 mb-3" {...props} />,
                                                            li: ({ node, ...props }: any) => <li className="mb-0.5" {...props} />,
                                                            p: ({ node, ...props }: any) => <p className="mb-3 last:mb-0" {...props} />,
                                                            strong: ({ node, ...props }: any) => <strong className="font-bold" {...props} />,
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex w-full justify-start animate-in fade-in">
                                        <div className="rounded-2xl px-6 py-4 bg-secondary/40 text-muted-foreground animate-pulse flex items-center gap-2">
                                            <Spinner className="h-5 w-5 animate-spin" />
                                            Thinking...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Fixed Bottom Input Area */}
                        <div className="w-full bg-background/80 backdrop-blur-lg border-t p-4 pb-8 z-10">
                            <div className="max-w-4xl mx-auto relative">
                                <div className="relative flex items-center w-full rounded-2xl bg-background border border-border/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Reply to Discover Prague..."
                                        className="w-full min-h-[50px] max-h-[200px] py-4 pl-5 pr-14 text-base bg-transparent border-none focus:outline-none resize-none placeholder:text-muted-foreground/70"
                                        style={{ fieldSizing: "content" } as any}
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSend}
                                        className="absolute right-2 bottom-2 h-9 w-9 rounded-lg shrink-0 transition-all"
                                        disabled={!inputValue.trim() || isLoading}
                                    >
                                        <PaperPlaneRight weight="fill" className="h-4 w-4" />
                                        <span className="sr-only">Send message</span>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground text-center mt-3">
                                    AI can make mistakes. Check important info.
                                </p>
                            </div>
                        </div>
                    </>
                )
                }
            </main>

            {!isChatStarted && <Footer />}
        </div>
    );
}
