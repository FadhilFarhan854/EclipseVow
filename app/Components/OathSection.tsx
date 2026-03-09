const OathSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl text-glow text-primary mb-4 tracking-wider">
          The Vow
        </h2>
        <div className="divider-glow w-48 mx-auto mb-12" />

        <div className="space-y-6 font-body text-lg text-foreground/70 italic leading-relaxed">
          <p>
            &quot;We do not seek the light, nor do we worship the dark.
            We stand where they meet — in the silence of the eclipse.&quot;
          </p>
          <p>
            &quot;Our strength is not in numbers, but in the unbroken thread
            that binds each soul to the next. What one carries, all bear.&quot;
          </p>
          <p>
            &quot;To take the Vow is to become the boundary itself —
            a guardian of balance, a keeper of the unseen.&quot;
          </p>
        </div>

        <div className="mt-12 text-primary/40 font-display text-sm tracking-[0.3em]">
          — THE FIRST COVENANT —
        </div>
      </div>
    </section>
  );
};

export default OathSection;
