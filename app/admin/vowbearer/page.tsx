"use client";

import { useEffect, useState } from "react";
import { Sword, BookOpen } from "lucide-react";
import Link from "next/link";

interface Vowbearer {
  id: string;
  ign: string;
  aspect: "hunter" | "knowledge";
  date: string;
}

const ITEMS_PER_PAGE = 12;

export default function AdminVowbearerPage() {
  const [vowbearers, setVowbearers] = useState<Vowbearer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/vowbearer")
      .then((res) => res.json())
      .then((data) => {
        setVowbearers(data.reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(vowbearers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = vowbearers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hunterCount = vowbearers.filter((v) => v.aspect === "hunter").length;
  const knowledgeCount = vowbearers.filter((v) => v.aspect === "knowledge").length;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-glow text-primary mb-4 tracking-wider">
            Vowbearer Registry
          </h1>
          <div className="divider-glow w-64 mx-auto mb-6" />
          <p className="font-body text-muted-foreground text-lg">
            All souls who have taken the Eclipse Vow
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="font-display text-2xl text-primary text-glow">{vowbearers.length}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Total</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="font-display text-2xl text-primary text-glow">{hunterCount}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Hunters</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="font-display text-2xl text-primary text-glow">{knowledgeCount}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Knowledge</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground animate-pulse">Loading registry...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && vowbearers.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground text-lg">No vowbearers have taken the oath yet.</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && currentItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
            {currentItems.map((vb) => (
              <div
                key={vb.id}
                className="bg-card border border-border rounded-lg p-6 text-center box-glow-hover group cursor-default"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border group-hover:border-primary/50 transition-colors duration-500 ${
                    vb.aspect === "hunter"
                      ? "bg-secondary border-border"
                      : "bg-secondary border-border"
                  }`}
                >
                  {vb.aspect === "hunter" ? (
                    <Sword className="w-7 h-7 text-primary" />
                  ) : (
                    <BookOpen className="w-7 h-7 text-primary" />
                  )}
                </div>
                <h3 className="font-display text-sm tracking-wider text-foreground mb-1">
                  {vb.ign}
                </h3>
                <p className="text-xs text-muted-foreground font-body italic capitalize">
                  {vb.aspect} Aspect
                </p>
                <p className="text-xs text-muted-foreground/50 font-body mt-2">
                  {new Date(vb.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-sm transition-all duration-300 cursor-pointer ${
                  currentPage === page
                    ? "bg-primary text-background box-glow"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Page indicator */}
        {totalPages > 1 && (
          <p className="text-center text-muted-foreground text-sm mt-4 font-body">
            Page {currentPage} of {totalPages}
          </p>
        )}

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="font-display text-sm tracking-[0.15em] uppercase px-8 py-3 border border-primary/50 text-primary rounded-sm hover:bg-primary/10 transition-all duration-300 inline-block"
          >
            Return to Eclipse Vow
          </Link>
        </div>
      </div>
    </div>
  );
}
