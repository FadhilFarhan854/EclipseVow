"use client";

import FloatingParticles from "../../Components/FloatingParticles";

const FestivalHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — using public/asset/Festival.webp */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/asset/Festival.webp)" }}
      />
      <div className="absolute inset-0 bg-background/50" />
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl lg:text-9xl font-bold tracking-wider text-glow-strong text-primary mb-2">
          Eclipse Festival
        </h1>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wider text-foreground/80 mb-6">
          The Grand Celebration
        </h2>
        <div className="divider-glow w-48 mx-auto mb-6" />
        <p className="font-body text-lg md:text-xl text-foreground/60 italic tracking-wide leading-relaxed mb-4">
          "When the stars align and the battlefield falls silent, the Vowbearers gather."
        </p>
        <p className="font-body text-sm md:text-base text-foreground/40 leading-relaxed max-w-2xl mx-auto">
          A grand spectacle where champions are born and legends are forged. Only the most valiant guilds dare to partake in these trials of strength, unity, and resilience. Prepare your weapons and raise your flags, for the festival of might has begun!
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
};

export default FestivalHero;
