import FloatingParticles from "../Components/FloatingParticles";

const RULES = [
  {
    title: "jangan drama antar member",
    body: "Kalau ada masalah, selesaikan baik-baik. Jangan bawa drama ke guild.",
  },
  {
    title: "Guild santai, bukan competitive",
    body: "Kita main buat seru-seruan. Jadi minimalkan hal berikut:",
    bullets: [
      "Provokasi adu damage dan taunting lawan",
      "Diskriminasi class/job/build lain",
      "Saling menyalahkan kalau damage turun atau hal sejenis",
    ],
  },
  {
    title: "Chill aja, ga usah ribet",
    body: "Santai, nikmati progress. ga perlu buru buru atau pusingin meta. Yang penting kita enjoy bareng.",
  },
  {
    title: "Ga perlu haus validasi",
    body: "Gausa pura-pura gak ada damage padahal raja iblis. orang bakal tau sendiri kemampuan kita.",
  },
  {
    title: "Keluar-masuk guild itu biasa",
    body: "Ga masalah kalau keluar masuk guild. Kalau ada masalah, balik aja kesini.",
  },
];

const PENALTY = [
  {
    title: "Penalty",
    body: "Kalau melanggar aturan yang udah ada",
    bullets: ["Dikick dari guild."],
  },
];

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" />
        <div className="absolute inset-0 bg-background/70" />
        <FloatingParticles />

        <div className="relative z-10 px-4 py-24 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-display text-xs tracking-[0.35em] uppercase text-primary/60 mb-4">
              Eclipse Vow
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider text-primary text-glow mb-4">
              Rules
            </h1>
            <div className="divider-glow w-40 mx-auto mb-6" />
            <p className="font-body text-sm md:text-base text-foreground/55 italic leading-relaxed">
              &quot;Perlu lah aturan dikit,biar ga chaos.&quot;
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Rules */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mt-14 mb-10">
            <h2 className="font-display text-3xl md:text-4xl tracking-wider text-primary/90 text-glow">
              Oath of Conduct
            </h2>
            <p className="font-body text-sm md:text-base text-foreground/45 italic mt-3">
              Pedoman sederhana supaya guild tetap nyaman.
            </p>
            <div className="divider-glow w-28 mx-auto mt-6" />
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {RULES.map((r) => (
              <div
                key={r.title}
                className="rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm p-6 box-glow-hover"
              >
                <h3 className="font-display text-lg md:text-xl tracking-wider text-primary mb-2">
                  {r.title}
                </h3>
                <p className="font-body text-sm text-foreground/65 leading-relaxed">
                  {r.body}
                </p>
                {r.bullets && (
                  <ul className="mt-4 space-y-2">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                        <span className="font-body text-sm text-foreground/65 leading-relaxed">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm p-6 box-glow-hover">
              <h3 className="font-display text-xl tracking-wider text-primary mb-2">
                Penalty
              </h3>
              <p className="font-body text-sm text-foreground/65 leading-relaxed">
                Tidak suka menghukum, tapi perlu aturan biar semua nyaman.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {PENALTY.map((p) => (
                  <div
                    key={p.title}
                    className="rounded border border-red-900/30 bg-red-950/10 p-4"
                  >
                    <p className="font-display text-sm tracking-wider text-red-300/90 mb-2">
                      {p.title}
                    </p>
                    <p className="font-body text-sm text-foreground/60 leading-relaxed">
                      {p.body}
                    </p>
                    {p.bullets && (
                      <ul className="mt-3 space-y-2">
                        {p.bullets.map((b) => (
                          <li key={b} className="flex gap-2">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-400/70 flex-shrink-0" />
                            <span className="font-body text-sm text-foreground/70 leading-relaxed">
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                <div className="rounded border border-border/30 bg-secondary/10 p-4">
                  <p className="font-display text-sm tracking-wider text-primary/80 mb-2">
                    Reminder
                  </p>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed">
                    Kalau ada konflik, kita omongin semua. Tujuannya bukan cari siapa benar, tapi balikin suasana jadi enak.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 text-center">
            <div className="divider-glow w-24 mx-auto mb-6" />
            <p className="font-body text-xs text-muted-foreground italic max-w-2xl mx-auto">
              &quot;Yang kuat bukan yang paling keras suaranya—tapi yang paling mampu menjaga ruang tetap damai.&quot;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
