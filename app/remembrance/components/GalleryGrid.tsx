"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, Calendar, ImageOff, Loader2 } from "lucide-react";

interface MemoryItem {
  name: string;
  date: string;
  desc: string;
  url: string;
  timestamp?: string;
}

interface GalleryGridProps {
  memories: MemoryItem[];
  loading: boolean;
}

const ITEMS_PER_PAGE = 10;

const GalleryGrid = ({ memories, loading }: GalleryGridProps) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sort by timestamp descending (newest first), fallback to date
  const sorted = [...memories].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : new Date(a.date).getTime();
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : new Date(b.date).getTime();
    return timeB - timeA;
  });

  const visibleMemories = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  // Reset visible count when memories change (e.g. after adding new memory)
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [memories.length]);

  // Infinite scroll with IntersectionObserver
  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sorted.length));
    }
  }, [hasMore, sorted.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl bg-card border border-border animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (memories.length === 0) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-md mx-auto text-center">
          <ImageOff className="w-16 h-16 text-foreground/15 mx-auto mb-6" />
          <h3 className="font-display text-xl tracking-wider text-foreground/40 mb-3">
            No Memories Yet
          </h3>
          <p className="font-body text-foreground/25 text-sm leading-relaxed">
            Galeri ini masih kosong. Jadilah yang pertama mengabadikan momen
            bersama Eclipse Vow.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-12">
            <h3 className="font-display text-2xl md:text-3xl tracking-wider text-foreground/70 mb-3">
              Fragments of Time
            </h3>
            <div className="divider-glow w-32 mx-auto mb-4" />
            <p className="font-body text-sm text-foreground/30">
              {memories.length} {memories.length === 1 ? "memory" : "memories"} captured
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleMemories.map((memory, idx) => (
              <div
                key={memory.timestamp || idx}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 cursor-pointer hover:shadow-lg hover:shadow-primary/5 section-fade-in"
                onClick={() => setSelectedMemory(memory)}
                style={{ animationDelay: `${(idx % ITEMS_PER_PAGE) * 80}ms` }}
              >
                {/* Image */}
                <Image
                  src={memory.url}
                  alt={memory.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="font-display text-base tracking-wider text-white mb-1 truncate">
                    {memory.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-white/50 text-xs font-body">
                    <Calendar className="w-3 h-3" />
                    {formatDate(memory.date)}
                  </div>
                  {memory.desc && (
                    <p className="font-body text-xs text-white/40 mt-1.5 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {memory.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Infinite scroll sentinel + loading indicator */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 text-primary/40 animate-spin" />
              <span className="ml-3 font-body text-sm text-foreground/30">
                Loading more memories...
              </span>
            </div>
          )}

          {/* End of gallery indicator */}
          {!hasMore && memories.length > ITEMS_PER_PAGE && (
            <div className="text-center py-12">
              <div className="divider-glow w-24 mx-auto mb-4" />
              <p className="font-body text-xs text-foreground/20 italic">
                All memories have been revealed
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative w-full rounded-t-xl overflow-hidden bg-black flex items-center justify-center" style={{ maxHeight: "70vh" }}>
              <img
                src={selectedMemory.url}
                alt={selectedMemory.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Info */}
            <div className="bg-card border border-t-0 border-border rounded-b-xl p-5">
              <h3 className="font-display text-xl tracking-wider text-primary mb-1">
                {selectedMemory.name}
              </h3>
              <div className="flex items-center gap-1.5 text-foreground/40 text-sm font-body mb-3">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(selectedMemory.date)}
              </div>
              {selectedMemory.desc && (
                <p className="font-body text-foreground/50 text-sm leading-relaxed">
                  {selectedMemory.desc}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
