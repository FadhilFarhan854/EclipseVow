"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, BookOpen } from "lucide-react";
import FloatingParticles from "../../Components/FloatingParticles";

const LIBRARY_PASSWORD = process.env.LIBRARY_PASSWORD || "eclipsevow";
const STORAGE_KEY = "eclipse-library-auth";

export function useLibraryAuth() {
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(STORAGE_KEY) === "true";
    }
    return false;
  });
  const [checking, setChecking] = useState(false);

  const login = (password: string): boolean => {
    if (password.toLowerCase().trim() === LIBRARY_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
      return true;
    }
    return false;
  };

  return { authenticated, checking, login };
}

const LibraryGate = ({ onSuccess }: { onSuccess: () => void }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useLibraryAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — responsive images */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url(/asset/library-mobile.webp)" }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: "url(/asset/eclipse-moon.jpg)" }}
      />
      <div className="absolute inset-0 bg-background/70" />
      <FloatingParticles />

      {/* Gate content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-primary/30 bg-card/50 mb-6">
            <BookOpen className="w-7 h-7 text-primary/70" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wider text-primary text-glow mb-4">
            Arsip Terlarang
          </h1>
          <div className="divider-glow w-32 mx-auto mb-6" />
          <p className="font-body text-sm md:text-base text-foreground/50 italic leading-relaxed mb-2">
            &quot;Tidak semua pengetahuan dimaksudkan untuk dilihat oleh semua mata.
            Hanya mereka yang mengetahui sumpahnya yang boleh membuka arsip ini.&quot;
          </p>
          <p className="font-body text-xs text-foreground/30 mt-4">
            — Catatan pertama dalam Arsip Vowbearer
          </p>
        </div>

        {/* Password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`relative transition-transform ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          >
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Ucapkan sumpahmu..."
              autoFocus
              className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                error ? "border-red-500/60 bg-red-950/10" : "border-border bg-card/60"
              } text-foreground font-body placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="font-body text-sm text-red-400/80 text-center italic animate-[fadeIn_0.3s_ease-out]">
              Sumpah yang salah... Kau bukan Vowbearer.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg border border-primary/40 bg-primary/10 text-primary font-display text-sm tracking-wider hover:bg-primary/20 hover:border-primary/60 transition-all cursor-pointer"
          >
            Buka Arsip
          </button>
        </form>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="font-body text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors cursor-pointer"
          >
            ← Kembali ke halaman utama
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryGate;
