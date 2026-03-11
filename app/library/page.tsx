"use client";

import { useState, useEffect } from "react";
import LibraryHero from "./components/LibraryHero";
import BookShelf from "./components/BookShelf";
import GuildFooter from "../Components/GuildFooter";
import LibraryGate from "./components/LibraryGate";

const STORAGE_KEY = "eclipse-library-auth";

export default function LibraryPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LibraryGate onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div>
      <LibraryHero />
      <div className="divider-glow max-w-md mx-auto" />
      <BookShelf />
      <GuildFooter />
    </div>
  );
}
