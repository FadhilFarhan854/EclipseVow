"use client";

import { useState, useEffect, useCallback } from "react";
import RemembranceHero from "./components/RemembranceHero";
import GalleryGrid from "./components/GalleryGrid";
import GuildFooter from "../Components/GuildFooter";

interface MemoryItem {
  name: string;
  date: string;
  desc: string;
  url: string;
  timestamp?: string;
}

export default function RemembrancePage() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMemories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/remembrance");
      if (res.ok) {
        const data = await res.json();
        setMemories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch memories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  return (
    <div>
      <RemembranceHero onMemoryAdded={fetchMemories} />
      <div className="divider-glow max-w-md mx-auto" />
      <GalleryGrid memories={memories} loading={loading} />
      <GuildFooter />
    </div>
  );
}
