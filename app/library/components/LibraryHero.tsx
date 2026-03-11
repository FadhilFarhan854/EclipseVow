import FloatingParticles from "../../Components/FloatingParticles";

const LibraryHero = () => {
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
      <div className="absolute inset-0 bg-background/40" />
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider text-glow-strong text-primary mb-2">
          Eclipse Vow
        </h1>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wider text-foreground/80 mb-6">
          Library
        </h2>
        <div className="divider-glow w-48 mx-auto mb-6" />
        <p className="font-body text-lg md:text-xl text-foreground/60 italic tracking-wide leading-relaxed mb-4">
          &quot;Di balik setiap petualangan, ada pengetahuan yang terkumpul.&quot;
        </p>
        <p className="font-body text-sm md:text-base text-foreground/40 leading-relaxed">
          Para Vowbearer mengumpulkan catatan tentang setiap makhluk, setiap kristal, dan setiap senjata
          yang mereka temui dalam perjalanan mereka. Arsip ini adalah memori kolektif mereka — 
          bukti bahwa mereka pernah berjuang, pernah bertahan, dan pernah mengingat.
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default LibraryHero;
