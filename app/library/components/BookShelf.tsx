"use client";

import { useState } from "react";
import { Skull, Bug, Gem, Sword, Scroll } from "lucide-react";
import Link from "next/link";
import BookViewer from "./BookViewer";

type BookId = "boss" | "miniboss" | "crysta" | "equipment";

interface BookDef {
  id: BookId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconName: string;
  color: string;
  spineColor: string;
  file: string;
}

const books: BookDef[] = [
  {
    id: "boss",
    title: "Boss",
    subtitle: "Powerful foes",
    icon: <Skull className="w-8 h-8" />,
    iconName: "skull",
    color: "from-blue-950/60 via-blue-900/30 to-transparent",
    spineColor: "bg-blue-800/80",
    file: "/asset/bos.json",
  },
  {
    id: "miniboss",
    title: "Mini Boss",
    subtitle: "Lesser threats",
    icon: <Bug className="w-8 h-8" />,
    iconName: "bug",
    color: "from-blue-900/60 via-blue-950/30 to-transparent",
    spineColor: "bg-blue-700/80",
    file: "/asset/miniboss.json",
  },
  {
    id: "crysta",
    title: "Crysta",
    subtitle: "Ancient gems",
    icon: <Gem className="w-8 h-8" />,
    iconName: "gem",
    color: "from-indigo-900/60 via-indigo-950/30 to-transparent",
    spineColor: "bg-indigo-700/80",
    file: "/asset/crysta.json",
  },
  {
    id: "equipment",
    title: "Equipment",
    subtitle: "Arms & armor",
    icon: <Sword className="w-8 h-8" />,
    iconName: "sword",
    color: "from-sky-900/60 via-sky-950/30 to-transparent",
    spineColor: "bg-sky-700/80",
    file: "/asset/eq.json",
  },
];

const BookShelf = () => {
  const [openBook, setOpenBook] = useState<BookDef | null>(null);

  if (openBook) {
    return <BookViewer book={openBook} onClose={() => setOpenBook(null)} />;
  }

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl tracking-wider text-primary text-glow mb-4">
            The Archives
          </h2>
          <p className="font-body text-lg text-foreground/50 italic">
            Choose a tome to begin your research.
          </p>
          <div className="divider-glow w-32 mx-auto mt-6" />
        </div>

        {/* Book grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-3xl lg:max-w-5xl mx-auto">
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => setOpenBook(book)}
              className="group relative cursor-pointer"
            >
              {/* Book — 3:4 aspect ratio */}
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden border border-border/40 bg-card/90 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
                {/* Book spine (left edge) */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-2.5 ${book.spineColor} z-20 transition-all duration-500`}
                >
                  {/* Spine ridges */}
                  <div className="absolute top-4 left-0 right-0 h-px bg-white/10" />
                  <div className="absolute top-6 left-0 right-0 h-px bg-white/10" />
                  <div className="absolute bottom-4 left-0 right-0 h-px bg-white/10" />
                  <div className="absolute bottom-6 left-0 right-0 h-px bg-white/10" />
                </div>

                {/* Cover gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${book.color} z-10`}
                />

                {/* Texture overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.03)_0%,transparent_70%)] z-10" />

                {/* Cover content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pl-6">
                  {/* Decorative top line */}
                  <div className="w-8 h-px bg-primary/30 mb-4 group-hover:w-12 group-hover:bg-primary/60 transition-all duration-500" />

                  {/* Icon */}
                  <div className="text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all duration-500 mb-4">
                    {book.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-sm md:text-base lg:text-lg tracking-[0.2em] text-foreground/90 group-hover:text-primary transition-colors duration-300 text-center leading-tight mb-1.5">
                    {book.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="font-body text-[10px] md:text-xs text-muted-foreground/60 italic text-center">
                    {book.subtitle}
                  </p>

                  {/* Decorative bottom line */}
                  <div className="w-8 h-px bg-primary/30 mt-4 group-hover:w-12 group-hover:bg-primary/60 transition-all duration-500" />

                  {/* Open indicator at bottom */}
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="font-body text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-primary/0 group-hover:text-primary/70 transition-all duration-500">
                      Open
                    </span>
                  </div>
                </div>

                {/* Edge shadow (book depth) */}
                <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/20 to-transparent z-10" />

                {/* Top/bottom edge lines */}
                <div className="absolute top-0 left-2.5 right-0 h-px bg-white/5 z-10" />
                <div className="absolute bottom-0 left-2.5 right-0 h-px bg-white/5 z-10" />

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0">
                  <div className="absolute inset-0 bg-primary/5" />
                </div>
              </div>

              {/* Book shadow on shelf */}
              <div className="h-2 mx-2 rounded-b-full bg-black/30 group-hover:bg-black/50 group-hover:mx-1 transition-all duration-500 blur-sm" />
            </button>
          ))}
        </div>

        {/* Shelf line */}
        <div className="max-w-3xl lg:max-w-5xl mx-auto mt-1 mb-12">
          <div className="h-1 bg-gradient-to-r from-transparent via-border/60 to-transparent rounded-full" />
          <div className="h-0.5 bg-gradient-to-r from-transparent via-border/30 to-transparent rounded-full mt-0.5" />
        </div>

        {/* Special Scrolls Section - EXP Calculator */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-950/80 via-blue-900/60 to-slate-950/80 border border-blue-500/30">
                <Scroll className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h3 className="font-display text-2xl md:text-3xl tracking-wider text-primary/80 text-glow mb-3">
              Sacred Scrolls
            </h3>
            <p className="font-body text-sm text-foreground/40 italic">
              Ancient tools for calculating thy path to power
            </p>
            <div className="divider-glow w-24 mx-auto mt-4" />
          </div>

          {/* EXP Calculator Card - Blue-Black Theme */}
          <Link
            href="/library/expcalculator"
            className="group block relative"
          >
            <div className="relative rounded-lg border border-blue-900/50 bg-gradient-to-br from-slate-950/90 via-blue-950/40 to-slate-950/90 backdrop-blur-sm p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.25)] hover:border-blue-700/50">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-600/30 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-600/30 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-600/30 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-600/30 rounded-br-lg" />

              <div className="flex items-center gap-5">
                {/* Content */}
                <div className="flex-1">
                  <h4 className="font-display text-xl md:text-2xl tracking-wider text-blue-300 group-hover:text-blue-200 transition-all duration-300 mb-2">
                    Experience Codex
                  </h4>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed mb-3">
                    Harness the power of the <span className="text-yellow-400/80">Adventurer&apos;s Diary</span> to calculate 
                    the exact number of quest runs needed to reach your desired level. 
                    Plan your journey through the chapters wisely.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-body text-blue-400/70 group-hover:text-blue-300 transition-colors">
                    <span className="tracking-wider uppercase">Calculate Now</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* Badge */}
                <div className="flex-shrink-0">
                  <div className="px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-600/30">
                    <span className="font-body text-[10px] tracking-wider uppercase text-blue-400">
                      Tool
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/0 group-hover:to-blue-500/5 transition-all duration-700 pointer-events-none" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookShelf;
