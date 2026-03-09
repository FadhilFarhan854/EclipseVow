"use client";

import { useEffect, useState } from "react";
import { Sword, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface Vowbearer {
  id: string;
  ign: string;
  aspect: "hunter" | "knowledge";
  date: string;
}

const MembersSection = () => {
  const [vowbearers, setVowbearers] = useState<Vowbearer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Fetch data
    fetch("/api/vowbearer")
      .then((res) => res.json())
      .then((data) => {
        setVowbearers(data.reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 4 : 8;
  const totalPages = Math.ceil(vowbearers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = vowbearers.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center text-glow text-primary mb-4 tracking-wider">
          The Sworn
        </h2>
        <div className="divider-glow w-48 mx-auto mb-12" />

        {loading ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground animate-pulse">Loading vowbearers...</p>
          </div>
        ) : vowbearers.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">No vowbearers yet. Be the first to take the vow.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {currentItems.map((member) => (
                <div
                  key={member.id}
                  className="bg-card border border-border rounded-lg p-6 text-center box-glow-hover group cursor-default"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors duration-500">
                    {member.aspect === "hunter" ? (
                      <Sword className="w-6 h-6 text-primary" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <h3 className="font-display text-sm tracking-wider text-foreground mb-1">
                    {member.ign}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body italic capitalize">
                    {member.aspect}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="font-body text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MembersSection;
