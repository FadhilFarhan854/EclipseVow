"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, BookOpen, Sparkles, TrendingUp, Scroll } from "lucide-react";
import Link from "next/link";
import { calculateAdvRuns, type AdvCalculatorInput, type AdvCalculatorResult } from "../advcalculator/adv";
import { MAIN_QUESTS } from "../advcalculator/questData";

const ExpCalculatorPage = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentPercent, setCurrentPercent] = useState<number>(0);
  const [targetLevel, setTargetLevel] = useState<number>(315);
  const [questType, setQuestType] = useState<"main" | "npc">("main");
  const [episodeFrom, setEpisodeFrom] = useState<number>(1);
  const [episodeTo, setEpisodeTo] = useState<number>(122);
  const [spamMode, setSpamMode] = useState<boolean>(false);
  
  const [result, setResult] = useState<AdvCalculatorResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Get quest titles for dropdown
  const questOptions = useMemo(() => {
    return MAIN_QUESTS.map((q) => ({
      episode: q.episode,
      label: `Ep.${q.episode} - ${q.title}`,
      chapter: q.chapter,
    }));
  }, []);

  // Filter "To Episode" options based on selected "From Episode"
  const toEpisodeOptions = useMemo(() => {
    return questOptions.filter((q) => q.episode >= episodeFrom);
  }, [questOptions, episodeFrom]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    const input: AdvCalculatorInput = {
      currentLevel,
      currentPercent,
      targetLevel,
      episodeFrom,
      episodeTo,
      spamMode,
    };

    try {
      const calcResult = await calculateAdvRuns(input);
      setResult(calcResult);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult({
        success: false,
        error: "Terjadi kesalahan dalam perhitungan",
        startLevel: currentLevel,
        startPercent: currentPercent,
        targetLevel,
        questRange: `Episode ${episodeFrom} - ${episodeTo}`,
        totalQuestXP: 0,
        progress: [],
        reachedTarget: false,
        finalLevel: currentLevel,
        finalPercent: currentPercent,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getDifficultyColor = (percent: number) => {
    if (percent < 25) return "text-red-400";
    if (percent < 50) return "text-orange-400";
    if (percent < 75) return "text-yellow-400";
    if (percent < 100) return "text-green-400";
    return "text-emerald-400";
  };

  return (
    <section className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with lore */}
        <div className="mb-12">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-body text-sm">Return to Library</span>
          </Link>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scroll className="w-8 h-8 text-primary text-glow" />
              <h1 className="font-display text-4xl md:text-5xl tracking-wider text-primary text-glow">
                Experience Codex
              </h1>
            </div>
            <div className="divider-glow w-48 mx-auto mb-6" />
            <div className="max-w-2xl mx-auto space-y-3">
              <p className="font-body text-foreground/70 italic text-sm md:text-base leading-relaxed">
                &quot;In the ancient archives, scholars discovered the <span className="text-primary">Chrono Scrolls</span> — 
                mystical texts that reveal the path to power through the completion of sacred quests.&quot;
              </p>
              <p className="font-body text-foreground/60 italic text-xs md:text-sm">
                Using the <span className="text-yellow-400/80">Adventurer&apos;s Diary</span>, one can relive these trials, 
                accumulating experience far beyond mortal limits. Calculate thy journey wisely, traveler.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Calculator Form */}
          <div className="space-y-6">
            {/* Character Level Card */}
            <div className="relative rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm p-6 box-glow-hover">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400/80" />
                <h3 className="font-display text-xl tracking-wider text-primary">Current Status</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-xs text-foreground/60 mb-2 tracking-wider uppercase">
                      Level
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="315"
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 rounded border border-border/40 bg-card/80 text-foreground font-body text-lg focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-foreground/60 mb-2 tracking-wider uppercase">
                      Progress %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={currentPercent}
                      onChange={(e) => setCurrentPercent(Math.min(99, parseInt(e.target.value) || 0))}
                      className="w-full px-4 py-2 rounded border border-border/40 bg-card/80 text-foreground font-body text-lg focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Target Level - only show in spam mode */}
                {spamMode && (
                  <div>
                    <label className="block font-body text-xs text-foreground/60 mb-2 tracking-wider uppercase">
                      Target Level
                    </label>
                    <input
                      type="number"
                      min={currentLevel + 1}
                      max="315"
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(parseInt(e.target.value) || 315)}
                      className="w-full px-4 py-2 rounded border border-border/40 bg-card/80 text-foreground font-body text-lg focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quest Selection Card */}
            <div className="relative rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm p-6 box-glow-hover">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-400/80" />
                <h3 className="font-display text-xl tracking-wider text-primary">Quest Selection</h3>
              </div>

              <div className="space-y-4">
                {/* Quest Type Radio */}
                <div>
                  <label className="block font-body text-xs text-foreground/60 mb-3 tracking-wider uppercase">
                    Quest Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="questType"
                        checked={questType === "main"}
                        onChange={() => setQuestType("main")}
                        className="w-4 h-4 text-primary focus:ring-primary/50"
                      />
                      <span className="font-body text-sm text-foreground/70 group-hover:text-primary transition-colors">
                        Main Quest
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group opacity-50">
                      <input
                        type="radio"
                        name="questType"
                        checked={questType === "npc"}
                        onChange={() => setQuestType("npc")}
                        disabled
                        className="w-4 h-4 text-primary focus:ring-primary/50"
                      />
                      <span className="font-body text-sm text-foreground/70 group-hover:text-primary transition-colors">
                        NPC Quest (Coming Soon)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Episode Range - By Title */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-body text-xs text-foreground/60 mb-2 tracking-wider uppercase">
                      From Episode
                    </label>
                    <select
                      value={episodeFrom}
                      onChange={(e) => {
                        const newFrom = parseInt(e.target.value);
                        setEpisodeFrom(newFrom);
                        // Reset "to" if it's less than new "from"
                        if (episodeTo < newFrom) {
                          setEpisodeTo(newFrom);
                        }
                      }}
                      className="w-full px-4 py-2 rounded border border-border/40 bg-card/80 text-foreground font-body text-sm focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                    >
                      {questOptions.map((q) => (
                        <option key={q.episode} value={q.episode}>
                          {q.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-body text-xs text-foreground/60 mb-2 tracking-wider uppercase">
                      To Episode
                    </label>
                    <select
                      value={episodeTo}
                      onChange={(e) => setEpisodeTo(parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded border border-border/40 bg-card/80 text-foreground font-body text-sm focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                    >
                      {toEpisodeOptions.map((q) => (
                        <option key={q.episode} value={q.episode}>
                          {q.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={spamMode}
                      onChange={(e) => setSpamMode(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary/50 cursor-pointer"
                    />
                    <span className="font-body text-xs text-foreground/60 group-hover:text-foreground/80 transition-colors leading-relaxed">
                      Using Adventurer&apos;s Diary (Spam Mode)
                      <span className="block text-[10px] text-muted-foreground italic mt-0.5">
                        {spamMode 
                          ? "Calculate how many runs needed to reach target level" 
                          : "Calculate final level after 1 run"}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              disabled={isCalculating || (spamMode && currentLevel >= targetLevel) || currentLevel >= 315}
              className="w-full py-4 rounded-lg border border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary font-display text-lg tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed box-glow-hover flex items-center justify-center gap-3 group"
            >
              {isCalculating ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{spamMode ? "Calculate Runs Needed" : "Calculate Final Level"}</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Result Summary */}
                <div className="relative rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm p-6 box-glow-hover">
                  <h3 className="font-display text-xl tracking-wider text-primary mb-4 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                    Prophecy Results
                  </h3>

                  {result.success ? (
                    <div className="space-y-4">
                      {/* Different display based on spam mode */}
                      {spamMode ? (
                        // SPAM MODE - Show runs needed
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded border border-border/30 bg-secondary/20 p-4">
                              <div className="font-body text-[10px] tracking-widest uppercase text-foreground/50 mb-1">
                                Runs Needed
                              </div>
                              <div className="font-display text-3xl text-primary">
                                {result.runsNeeded}x
                              </div>
                            </div>
                            <div className="rounded border border-border/30 bg-secondary/20 p-4">
                              <div className="font-body text-[10px] tracking-widest uppercase text-foreground/50 mb-1">
                                XP per Run
                              </div>
                              <div className="font-display text-lg text-yellow-400">
                                {result.totalQuestXP.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="rounded border border-border/30 bg-secondary/20 p-4">
                            <div className="font-body text-[10px] tracking-widest uppercase text-foreground/50 mb-2">
                              Journey Progress
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-body text-sm text-foreground/70">
                                Lv {result.startLevel} ({result.startPercent}%)
                              </span>
                              <span className="text-primary/40">→</span>
                              <span className={`font-display text-xl ${getDifficultyColor(result.finalPercent)}`}>
                                Lv {result.finalLevel} ({result.finalPercent}%)
                              </span>
                            </div>
                          </div>

                          <div className="rounded border border-border/30 bg-secondary/20 p-4">
                            <div className="font-body text-[10px] tracking-widest uppercase text-foreground/50 mb-2">
                              Status
                            </div>
                            {result.reachedTarget ? (
                              <div className="flex items-center gap-2 text-green-400">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="font-body text-sm">Target level reached!</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-orange-400">
                                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                <span className="font-body text-sm">Max simulation runs reached</span>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        // SINGLE RUN MODE - Show final level after 1 run
                        <>
                          <div className="rounded border border-primary/30 bg-primary/5 p-6">
                            <div className="font-body text-[10px] tracking-widest uppercase text-foreground/50 mb-2 text-center">
                              After 1 ADV Run
                            </div>
                            <div className="text-center">
                              <span className="font-display text-4xl text-primary">
                                Level {result.finalLevel}
                              </span>
                              <span className={`font-display text-xl ml-2 ${getDifficultyColor(result.finalPercent)}`}>
                                ({result.finalPercent}%)
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded border border-border/30 bg-secondary/20 p-4">
                              <div className="font-body text-[10px] tracking-widest uppercase text-foreground/50 mb-1">
                                XP Gained
                              </div>
                              <div className="font-display text-lg text-yellow-400">
                                +{result.totalQuestXP.toLocaleString()}
                              </div>
                            </div>
                            <div className="rounded border border-border/30 bg-secondary/20 p-4">
                              <div className="font-body text-[10px] tracking-widest uppercase text-foreground/50 mb-1">
                                Levels Gained
                              </div>
                              <div className="font-display text-lg text-green-400">
                                +{result.finalLevel - result.startLevel}
                              </div>
                            </div>
                          </div>

                          <div className="rounded border border-border/30 bg-secondary/20 p-4">
                            <div className="font-body text-[10px] tracking-widest uppercase text-foreground/50 mb-2">
                              Starting Point
                            </div>
                            <div className="font-body text-sm text-foreground/70">
                              Level {result.startLevel} ({result.startPercent}%)
                            </div>
                          </div>
                        </>
                      )}

                      {/* Quest Range Info */}
                      <div className="rounded border border-border/30 bg-secondary/10 p-3">
                        <div className="font-body text-[10px] tracking-widest uppercase text-foreground/40 mb-1">
                          Quest Range
                        </div>
                        <div className="font-body text-xs text-foreground/60">
                          {result.questRange}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded border border-red-900/40 bg-red-950/20 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-400 text-xs">✕</span>
                        </div>
                        <div>
                          <div className="font-body text-sm text-red-400 mb-1">Calculation Failed</div>
                          <div className="font-body text-xs text-red-400/70">{result.error}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Timeline - Only in Spam Mode */}
                {result.success && spamMode && result.progress.length > 0 && (
                  <div className="relative rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm p-6 box-glow-hover">
                    <h3 className="font-display text-xl tracking-wider text-primary mb-4">
                      Progress Timeline
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                      {result.progress.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 py-2 px-3 rounded border border-border/20 bg-secondary/10 hover:bg-secondary/20 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                            <span className="font-display text-xs text-primary">
                              {idx + 1}
                            </span>
                          </div>
                          <span className="font-body text-sm text-foreground/80">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="relative rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm p-12 box-glow-hover">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center">
                    <Scroll className="w-8 h-8 text-primary/40" />
                  </div>
                  <p className="font-body text-foreground/50 italic">
                    Configure your parameters and calculate
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    The scrolls await your command...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lore Footer */}
        <div className="mt-12 text-center">
          <div className="divider-glow w-32 mx-auto mb-6" />
          <p className="font-body text-xs text-muted-foreground italic max-w-2xl mx-auto">
            &quot;The path to mastery is not linear, but circular — like the sacred diary that binds time itself. 
            Each journey completed adds to thy wisdom, though the quest remains eternal.&quot;
          </p>
          <p className="font-body text-[10px] text-muted-foreground/60 mt-4">
            — Ancient Toram Proverb
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};

export default ExpCalculatorPage;
