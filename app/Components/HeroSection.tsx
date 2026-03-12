import FloatingParticles from "./FloatingParticles";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/asset/eclipse-moon.jpg)' }}
      />
      <div className="absolute inset-0 bg-background/40" />
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider text-glow-strong text-primary mb-6">
          Eclipse Vow
        </h1>
        <div className="divider-glow w-48 mx-auto mb-6" />
        <p className="font-body text-xl md:text-2xl text-foreground/70 italic tracking-wide">
          Bound beneath the silent eclipse.
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
