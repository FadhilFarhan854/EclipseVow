"use client";

import { useState } from "react";
import { Sword, BookOpen } from "lucide-react";

const JoinSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [ign, setIgn] = useState("");
  const [aspect, setAspect] = useState<"hunter" | "knowledge" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!ign.trim()) {
      setError("Please enter your IGN.");
      return;
    }
    if (!aspect) {
      setError("Please choose your Aspect.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/vowbearer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ign: ign.trim(),
          aspect,
          date: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      setIgn("");
      setAspect("");
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
    setError("");
    setIgn("");
    setAspect("");
  };

  return (
    <>
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-glow text-primary mb-4 tracking-wider">
            Walk Beneath the Eclipse
          </h2>
          <div className="divider-glow w-48 mx-auto mb-8" />

          <p className="font-body text-lg text-foreground/70 mb-10 leading-relaxed">
            The Eclipse does not call to many — but if you hear its silence,
            you already belong. Step forward and take the Vow.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="inline-block font-display text-sm tracking-[0.2em] uppercase px-10 py-4 border border-primary/50 text-primary rounded-sm box-glow-hover hover:bg-primary/10 transition-all duration-500 cursor-pointer"
          >
            Apply to Eclipse Vow
          </button>

          <p className="mt-6 text-muted-foreground text-sm font-body">
            or find us on{" "}
            <a
              href="#"
              className="text-primary hover:text-glow transition-all duration-300 underline underline-offset-4"
            >
              Discord
            </a>
          </p>
        </div>
      </section>

      {/* Modal Overlay */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-8 relative overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-primary/30" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-primary/30" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-primary/30" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-primary/30" />

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {submitted ? (
              /* Success State */
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-primary text-glow tracking-wider mb-3">
                  Vow Received
                </h3>
                <p className="font-body text-foreground/70 mb-6">
                  The Eclipse has heard your oath. Walk in shadow, Vowbearer.
                </p>
                <button
                  onClick={closeModal}
                  className="font-display text-sm tracking-[0.15em] uppercase px-8 py-3 border border-primary/50 text-primary rounded-sm hover:bg-primary/10 transition-all duration-300 cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Form State */
              <>
                <h3 className="font-display text-2xl text-center text-primary text-glow tracking-wider mb-2">
                  Take the Vow
                </h3>
                <p className="font-body text-sm text-center text-muted-foreground mb-8">
                  Declare your name and choose your path
                </p>

                {/* IGN Input */}
                <div className="mb-6">
                  <label className="block font-display text-xs tracking-wider text-foreground/80 mb-2 uppercase">
                    In-Game Name (IGN)
                  </label>
                  <input
                    type="text"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    placeholder="Enter your IGN..."
                    className="w-full bg-background border border-border rounded px-4 py-3 font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
                  />
                </div>

                {/* Aspect Selection */}
                <div className="mb-6">
                  <label className="block font-display text-xs tracking-wider text-foreground/80 mb-3 uppercase">
                    Choose Your Aspect
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Hunter Aspect */}
                    <button
                      onClick={() => setAspect("hunter")}
                      className={`p-4 rounded-lg border text-left transition-all duration-300 cursor-pointer ${
                        aspect === "hunter"
                          ? "border-primary bg-primary/10 box-glow"
                          : "border-border hover:border-primary/40 bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sword className={`w-5 h-5 ${aspect === "hunter" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`font-display text-sm tracking-wider ${aspect === "hunter" ? "text-primary" : "text-foreground"}`}>
                          Hunter
                        </span>
                      </div>
                      <p className="text-xs font-body text-muted-foreground leading-relaxed">
                        Memburu monster dan boss di medan pertempuran
                      </p>
                    </button>

                    {/* Knowledge Aspect */}
                    <button
                      onClick={() => setAspect("knowledge")}
                      className={`p-4 rounded-lg border text-left transition-all duration-300 cursor-pointer ${
                        aspect === "knowledge"
                          ? "border-primary bg-primary/10 box-glow"
                          : "border-border hover:border-primary/40 bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className={`w-5 h-5 ${aspect === "knowledge" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`font-display text-sm tracking-wider ${aspect === "knowledge" ? "text-primary" : "text-foreground"}`}>
                          Knowledge
                        </span>
                      </div>
                      <p className="text-xs font-body text-muted-foreground leading-relaxed">
                        Mencatat pengetahuan dan lore ke dalam Codex
                      </p>
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-destructive text-sm font-body mb-4 text-center">{error}</p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full font-display text-sm tracking-[0.15em] uppercase px-8 py-3 border border-primary/50 text-primary rounded-sm box-glow-hover hover:bg-primary/10 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Seal the Vow"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default JoinSection;
