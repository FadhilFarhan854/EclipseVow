"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, BookOpen, ListTree, Lock } from "lucide-react";
import Link from "next/link";
import storyData from "../../../story.json";

// Flatten the story into a list of pages (subchapters)
export default function BookReader() {
  const router = useRouter();
  const params = useParams();

  // Create a flat array of all subchapters to navigate through
  const pages = useMemo(() => {
    const flatPages: any[] = [];
    let previousQuestIncomplete = false;

    storyData.chapters.forEach((chapter) => {
      chapter.sub_chapters.forEach((sub: any) => {
        flatPages.push({
          chapterTitle: chapter.chapter_title,
          subchapterTitle: sub.title.replace(/^\d+\.\d+\s*/, ""),
          content: sub.content,
          quest: sub.quest || null,
          completed: sub.completed !== false,
          chapterId: chapter.chapter_id,
          subId: sub.sub_id,
          isLocked: previousQuestIncomplete,
        });

        // If this page has a quest that is not completed, lock subsequent pages
        if (sub.quest && sub.completed === false) {
          previousQuestIncomplete = true;
        }
      });
    });
    return flatPages;
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [isSelecting, setIsSelecting] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (isSelecting) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isSelecting) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (isSelecting || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, isSelecting]);

  if (!pages || pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Story data not found.</p>
      </div>
    );
  }

  const currentData = pages[currentPage];
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pages.length - 1;

  const handleNext = () => {
    if (!isLastPage && !pages[currentPage + 1].isLocked) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirstPage) setCurrentPage((prev) => prev - 1);
  };

  const handleSelectPage = (index: number) => {
    setCurrentPage(index);
    setIsSelecting(false);
  };

  return (
    <main
      className="min-h-screen bg-[#0d0f17] text-[#e2e8f0] font-body selection:bg-primary/30"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0d0f17]/90 backdrop-blur-md border-b border-primary/20 p-4 shadow-lg shadow-black/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/story"
            className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors text-sm uppercase tracking-widest"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Library</span>
            <span className="sm:hidden">Back</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary/60" />
            <span className="font-display font-semibold tracking-wider hidden sm:inline-block">
              {storyData.book_title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isSelecting && (
              <button
                onClick={() => setIsSelecting(true)}
                className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors text-sm uppercase tracking-widest"
              >
                <ListTree className="w-5 h-5" />
                <span className="hidden md:inline text-xs">Chapters</span>
              </button>
            )}
            
            {/* Progress indicator */}
            {!isSelecting && (
              <div className="text-xs font-mono text-foreground/40 min-w-[3rem] text-right">
                {currentPage + 1} / {pages.length}
              </div>
            )}
          </div>
        </div>
      </nav>

      {isSelecting ? (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-700">
          <header className="mb-16 text-center">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 drop-shadow-sm mb-6">
              Daftar Isi
            </h1>
            <p className="text-primary/70 tracking-[0.2em] text-sm uppercase font-semibold">
              Pilih Bab Untuk Mulai Membaca
            </p>
            <div className="divider-glow w-32 mx-auto mt-8 opacity-60" />
          </header>

          <div className="grid gap-8">
            {storyData.chapters.map((chapter) => (
              <div 
                key={chapter.chapter_id} 
                className="bg-[#1a1c29]/30 border border-primary/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:border-primary/20 transition-all duration-500"
              >
                <h2 className="font-display text-2xl font-bold text-gray-300 mb-6 border-b border-primary/10 pb-4">
                  {chapter.chapter_title}
                </h2>
                <div className="grid gap-3">
                  {chapter.sub_chapters.map((sub) => {
                    // Find global index for navigation
                    let globalIndex = 0;
                    let found = false;
                    for (const c of storyData.chapters) {
                      for (const s of c.sub_chapters) {
                        if (c.chapter_id === chapter.chapter_id && s.sub_id === sub.sub_id) {
                          found = true;
                          break;
                        }
                        globalIndex++;
                      }
                      if (found) break;
                    }

                    const pageData = pages[globalIndex];
                    const isLocked = pageData.isLocked;

                    return (
                      <button
                        key={sub.sub_id}
                        onClick={() => !isLocked && handleSelectPage(globalIndex)}
                        disabled={isLocked}
                        className={`flex items-center justify-between group p-4 rounded-xl border border-transparent transition-all duration-300 text-left ${
                          isLocked 
                            ? "opacity-50 cursor-not-allowed bg-background/20" 
                            : "bg-background/40 hover:border-primary/30 hover:bg-primary/5"
                        }`}
                      >
                        <span className={`font-body tracking-wide ${isLocked ? "text-gray-500" : "text-gray-400 group-hover:text-gray-100 transition-colors"}`}>
                          {sub.title.replace(/^\d+\.\d+\s*/, "")}
                        </span>
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center opacity-40 italic font-body text-sm">
            {storyData.book_description}
          </div>
        </div>
      ) : (
        /* Novel Content Area */
        <article className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Chapter Header */}
          <header className="mb-16 text-center">
            <p className="text-primary/70 tracking-[0.2em] text-sm uppercase mb-4 font-semibold">
              {currentData.chapterTitle}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 drop-shadow-sm mb-6">
              {currentData.subchapterTitle}
            </h1>
            <div className="divider-glow w-32 mx-auto opacity-60" />
          </header>

          {/* Story Text */}
          <div className="prose prose-invert prose-lg max-w-none prose-p:leading-[2.2] prose-p:text-gray-300 prose-p:mb-8 md:prose-p:text-lg">
            {currentData.content.map((p: string, pIndex: number) => (
              <p key={pIndex} className="text-justify indent-8 tracking-wide">
                {p}
              </p>
            ))}
          </div>

          {/* End of chapter mark */}
          <div className="flex items-center justify-center gap-4 my-20 opacity-30">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
            <div className="w-2 h-2 rotate-45 bg-primary" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
          </div>

          {/* Quest UI */}
          {currentData.quest && !currentData.completed && (
            <div className="my-12 p-6 md:p-8 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-sm shadow-[0_0_30px_rgba(var(--primary),0.1)]">
              <h3 className="font-display text-2xl text-primary mb-6 font-bold border-b border-primary/10 pb-4">
                Quest: Selesaikan Tantangan!
              </h3>
              
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3 uppercase tracking-widest font-semibold">Tugas</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {currentData.quest.task.map((t: string, idx: number) => (
                    <li key={idx} className="tracking-wide">{t}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-400 mb-3 uppercase tracking-widest font-semibold">Anggota Terlibat</p>
                <div className="flex flex-wrap gap-2">
                  {currentData.quest.member.map((m: string, idx: number) => (
                    <span key={idx} className="px-4 py-1.5 bg-background/50 text-gray-300 rounded-full text-sm border border-primary/20 shadow-sm">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 border-t border-primary/20 pt-6 gap-6">
                <div className="text-gray-300">
                  <span className="text-sm text-gray-500 uppercase tracking-widest block mb-1">Hadiah (Coin)</span>
                  <span className="font-display text-3xl text-yellow-500 font-bold drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    {Number(currentData.quest.reward).toLocaleString('id-ID')}
                  </span>
                </div>
                
                <button
                  onClick={async () => {
                    const pwd = window.prompt("Masukkan password untuk menyelesaikan quest:");
                    if (pwd === "123321") {
                      try {
                        const res = await fetch("/api/complete-quest", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ chapterId: currentData.chapterId, subId: currentData.subId }),
                        });
                        if (res.ok) {
                          alert("Quest berhasil diselesaikan! Halaman selanjutnya terbuka.");
                          window.location.reload();
                        } else {
                          alert("Gagal memperbarui status quest.");
                        }
                      } catch (err) {
                        alert("Terjadi kesalahan.");
                      }
                    } else if (pwd !== null) {
                      alert("Password salah!");
                    }
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/40 rounded-xl transition-all duration-300 font-bold tracking-wide uppercase shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)]"
                >
                  Selesaikan Quest
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation - Hidden on Mobile, Flex on Desktop */}
          <nav className="hidden sm:grid grid-cols-2 gap-4 border-t border-primary/20 pt-8 mt-12 pb-24 relative">
            <button
              onClick={handlePrev}
              disabled={isFirstPage}
              className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-4 px-4 py-4 sm:px-6 rounded-xl border border-primary/10 bg-[#1a1c29]/50 backdrop-blur transition-all duration-300 ${isFirstPage
                  ? "opacity-0 pointer-events-none"
                  : "hover:bg-primary/20 hover:border-primary/40 active:scale-95 cursor-pointer text-gray-300 group"
                }`}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left hidden sm:block">
                <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">Previous</p>
                <p className="font-display truncate max-w-[150px]">
                  {!isFirstPage && pages[currentPage - 1].subchapterTitle}
                </p>
              </div>
              <span className="sm:hidden font-display text-sm tracking-wider block w-full text-center">Prev</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isLastPage || pages[currentPage + 1]?.isLocked}
              className={`flex items-center justify-center sm:justify-end gap-2 sm:gap-4 px-4 py-4 sm:px-6 rounded-xl border border-primary/10 bg-[#1a1c29]/50 backdrop-blur transition-all duration-300 ${isLastPage || pages[currentPage + 1]?.isLocked
                  ? "opacity-30 pointer-events-none"
                  : "hover:bg-primary/20 hover:border-primary/40 active:scale-95 cursor-pointer text-gray-300 group"
                }`}
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">
                  {pages[currentPage + 1]?.isLocked ? "Terkunci" : "Next Page"}
                </p>
                <p className="font-display truncate max-w-[150px]">
                  {!isLastPage && pages[currentPage + 1].subchapterTitle}
                </p>
              </div>
              <span className="sm:hidden font-display text-sm tracking-wider block w-full text-center">
                {pages[currentPage + 1]?.isLocked ? "Terkunci" : "Next"}
              </span>
              {pages[currentPage + 1]?.isLocked ? (
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 shrink-0" />
              ) : (
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </nav>

          {/* Mobile Swipe Hint */}
          <div className="sm:hidden text-center opacity-30 animate-pulse pb-10">
            <p className="text-xs uppercase tracking-[0.3em]">geser untuk ke halaman selanjutnya</p>
          </div>
        </article>
      )}
    </main>
  );
}
