"use client";

import Link from "next/link";
import { Book } from "lucide-react";

export default function StoryLandingPage() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background — responsive images same as Library */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url(/asset/library-mobile.webp)" }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: "url(/asset/eclipse-moon.jpg)" }}
      />
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wider text-glow-strong text-primary mb-4 drop-shadow-xl">
          The Chronicles
        </h1>
        <p className="font-body text-lg md:text-xl text-foreground/80 italic tracking-wide mb-12">
          "Sebuah perjanjian yang membawa takdir seluruh kehidupan di dunia"
        </p>

        {/* Book Cover Element */}
        <Link 
          href="/book/eclipse-vow" 
          className="group relative flex flex-col items-center justify-center w-64 h-80 md:w-72 md:h-96 bg-[#1a1c29] border border-primary/30 rounded-r-2xl rounded-l-md shadow-2xl hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
          {/* Book Spine Simulation */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/60 to-transparent z-20 border-r border-primary/10" />
          
          {/* Book Cover Gradient & Style */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-black z-0" />
          
          {/* Ornate Borders */}
          <div className="absolute inset-2 border border-primary/20 rounded-r-xl rounded-l-sm z-10" />
          <div className="absolute inset-4 border border-primary/10 rounded-r-lg rounded-l-sm z-10" />

          {/* Book Content */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full p-6 text-center">
            <Book className="w-12 h-12 text-primary/80 mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-md" />
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-widest text-[#e2e8f0] drop-shadow-lg mb-4 leading-tight uppercase relative">
               Eclipse
               <span className="block text-primary text-2xl mt-2 drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]">Vow</span>
            </h2>
            <div className="divider-glow w-24 mx-auto my-4 opacity-50" />
            <p className="font-body text-xs text-foreground/50 tracking-widest uppercase mt-auto">
              Read the Novel
            </p>
          </div>
        </Link>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
