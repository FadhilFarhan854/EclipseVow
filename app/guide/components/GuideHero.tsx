"use client";

import FloatingParticles from "@/app/Components/FloatingParticles";
import { Compass } from "lucide-react";

const GuideHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — responsive images */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url(/asset/library-mobile.webp)" }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: "url(/asset/eclipse-moon.jpg)" }}
      />
      <div className="absolute inset-0 bg-background/60" />
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto flex flex-col items-center mt-12">
        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] box-glow">
          <Compass className="w-12 h-12 text-primary animate-pulse" />
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-glow-strong text-primary mb-2">
          Guide Newbie
        </h1>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-wider text-foreground/80 mb-6 mt-2">
          Player Tutorial
        </h2>
        <div className="divider-glow w-48 mx-auto mb-6" />
        <p className="font-body text-lg md:text-xl text-foreground/60 italic tracking-wide leading-relaxed mb-4">
          &quot;Setiap Vowbearer hebat pernah memulai dari bawah.&quot;
        </p>
        <p className="font-body text-sm md:text-base text-foreground/40 leading-relaxed">
          Guide dibuat oleh player yang sudah bermain cukup lama, ini adalah cara paling efektif di earlygame diluar konsep economy building
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
};

export default GuideHero;
