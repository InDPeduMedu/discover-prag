"use client";

import { TelegramLogo, ArrowRight } from "@phosphor-icons/react";
import Link from 'next/link';

export function AnnouncementBar() {
  return (
    <div className="w-full bg-primary/5 border-b border-primary/10 py-2.5 px-4 animate-in fade-in slide-in-from-top-1 duration-500">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
            <TelegramLogo weight="fill" className="w-3.5 h-3.5" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Planning on the go? Chat with <span className="text-foreground font-bold">@DiscoverPragBot</span> on Telegram
          </p>
        </div>
        
        <Link 
          href="https://t.me/DiscoverPragBot" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
        >
          Open in Telegram
          <ArrowRight weight="bold" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
