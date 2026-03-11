// SPMADV SIMULATOR - FIXED FORMULA
// Formula referensi dari https://toramtools.github.io/xp.html
// EXP required = (level^4 / 40) + (level * 2)

import { MAIN_QUESTS, calculateQuestXP, type MainQuest } from "./questData";

// Re-export untuk kemudahan import
export { MAIN_QUESTS, type MainQuest };

export interface AdvCalculatorInput {
  currentLevel: number;
  currentPercent: number;
  targetLevel: number;
  episodeFrom: number;  // Changed from chapterFrom
  episodeTo: number;    // Changed from chapterTo
  spamMode: boolean;    // New: true = calculate runs, false = single run result
}

export interface AdvCalculatorResult {
  success: boolean;
  error?: string;
  runsNeeded?: number;
  startLevel: number;
  startPercent: number;
  targetLevel: number;
  questRange: string;
  totalQuestXP: number;
  progress: string[];
  reachedTarget: boolean;
  finalLevel: number;
  finalPercent: number;
  totalXPNeeded?: number;
}

const MAX_LEVEL = 315;
const MAX_SIMULATION_RUNS = 10000;

// Formula XP yang dibutuhkan per level (TORAM TOOLS)
export const needXP = (lvl: number): number => {
  if (lvl >= MAX_LEVEL) return Infinity;
  return Math.floor(Math.pow(lvl, 4) / 40 + lvl * 2);
};

// Calculate total XP needed from current level/percent to target level
export const calculateTotalXPNeeded = (
  currentLevel: number,
  currentPercent: number,
  targetLevel: number
): number => {
  if (currentLevel >= targetLevel) return 0;
  
  // XP remaining in current level
  const currentLevelXP = needXP(currentLevel);
  const currentXP = Math.floor((currentPercent / 100) * currentLevelXP);
  let remaining = currentLevelXP - currentXP;
  
  // XP for levels in between
  for (let lvl = currentLevel + 1; lvl < targetLevel; lvl++) {
    remaining += needXP(lvl);
  }
  
  return remaining;
};

export async function calculateAdvRuns(input: AdvCalculatorInput): Promise<AdvCalculatorResult> {
  try {
    const { currentLevel, currentPercent, episodeFrom, episodeTo, spamMode } = input;
    let { targetLevel } = input;

    // Get quest titles for display
    const fromQuest = MAIN_QUESTS.find(q => q.episode === episodeFrom);
    const toQuest = MAIN_QUESTS.find(q => q.episode === episodeTo);
    const questRange = fromQuest && toQuest 
      ? `Ep.${episodeFrom} "${fromQuest.title}" → Ep.${episodeTo} "${toQuest.title}"`
      : `Episode ${episodeFrom} - ${episodeTo}`;

    // Validasi input
    if (currentLevel < 1 || currentLevel > MAX_LEVEL) {
      return {
        success: false,
        error: `Level harus antara 1 - ${MAX_LEVEL}`,
        startLevel: currentLevel,
        startPercent: currentPercent,
        targetLevel: targetLevel,
        questRange,
        totalQuestXP: 0,
        progress: [],
        reachedTarget: false,
        finalLevel: currentLevel,
        finalPercent: currentPercent,
      };
    }

    if (currentLevel >= MAX_LEVEL) {
      return {
        success: false,
        error: `Level awal sudah mencapai max level (${MAX_LEVEL})`,
        startLevel: currentLevel,
        startPercent: currentPercent,
        targetLevel: targetLevel,
        questRange,
        totalQuestXP: 0,
        progress: [],
        reachedTarget: false,
        finalLevel: currentLevel,
        finalPercent: currentPercent,
      };
    }

    if (targetLevel > MAX_LEVEL) {
      targetLevel = MAX_LEVEL;
    }

    if (currentPercent < 0 || currentPercent >= 100) {
      return {
        success: false,
        error: "Persentase XP harus antara 0 - 99",
        startLevel: currentLevel,
        startPercent: currentPercent,
        targetLevel: targetLevel,
        questRange,
        totalQuestXP: 0,
        progress: [],
        reachedTarget: false,
        finalLevel: currentLevel,
        finalPercent: currentPercent,
      };
    }

    if (spamMode && targetLevel <= currentLevel) {
      return {
        success: false,
        error: "Target level harus lebih tinggi dari level awal!",
        startLevel: currentLevel,
        startPercent: currentPercent,
        targetLevel: targetLevel,
        questRange,
        totalQuestXP: 0,
        progress: [],
        reachedTarget: false,
        finalLevel: currentLevel,
        finalPercent: currentPercent,
      };
    }

    if (episodeFrom < 1 || episodeFrom > 122 || episodeTo < 1 || episodeTo > 122) {
      return {
        success: false,
        error: "Episode harus antara 1 - 122",
        startLevel: currentLevel,
        startPercent: currentPercent,
        targetLevel: targetLevel,
        questRange,
        totalQuestXP: 0,
        progress: [],
        reachedTarget: false,
        finalLevel: currentLevel,
        finalPercent: currentPercent,
      };
    }

    if (episodeFrom > episodeTo) {
      return {
        success: false,
        error: "Episode awal tidak boleh lebih besar dari episode akhir!",
        startLevel: currentLevel,
        startPercent: currentPercent,
        targetLevel: targetLevel,
        questRange,
        totalQuestXP: 0,
        progress: [],
        reachedTarget: false,
        finalLevel: currentLevel,
        finalPercent: currentPercent,
      };
    }

    // Calculate quest XP using imported function
    const questXP = calculateQuestXP(episodeFrom, episodeTo);

    if (questXP === 0) {
      return {
        success: false,
        error: "Tidak ada quest di range tersebut!",
        startLevel: currentLevel,
        startPercent: currentPercent,
        targetLevel: targetLevel,
        questRange,
        totalQuestXP: 0,
        progress: [],
        reachedTarget: false,
        finalLevel: currentLevel,
        finalPercent: currentPercent,
      };
    }

    let level = currentLevel;
    let currentXP = Math.floor((currentPercent / 100) * needXP(level));
    
    // ================= SINGLE RUN MODE (Non-Spam) =================
    if (!spamMode) {
      // Just calculate result after 1 run
      currentXP += questXP;
      
      // Level up as much as possible
      while (level < MAX_LEVEL && currentXP >= needXP(level)) {
        currentXP -= needXP(level);
        level++;
      }
      
      const finalPercent = level >= MAX_LEVEL 
        ? 100 
        : Math.min(99, Math.floor((currentXP / needXP(level)) * 100));
      
      return {
        success: true,
        runsNeeded: 1,
        startLevel: currentLevel,
        startPercent: currentPercent,
        targetLevel: targetLevel,
        questRange,
        totalQuestXP: questXP,
        progress: [`1x - Lv ${level} (${finalPercent}%)`],
        reachedTarget: level >= targetLevel,
        finalLevel: level,
        finalPercent,
      };
    }
    
    // ================= SPAM MODE (Multiple Runs) =================
    let runs = 0;
    const progress: string[] = [];
    const startLevel = level;
    const startPercent = currentPercent;
    
    // Calculate total XP needed for display
    const totalXPNeeded = calculateTotalXPNeeded(currentLevel, currentPercent, targetLevel);

    while (runs < MAX_SIMULATION_RUNS) {
      runs++;
      currentXP += questXP;

      // Level up — batas sampai targetLevel
      while (level < targetLevel && currentXP >= needXP(level)) {
        currentXP -= needXP(level);
        level++;
      }

      // Hitung persen berdasarkan level saat ini
      const pct =
        level >= targetLevel
          ? 100
          : Math.min(99, Math.floor((currentXP / needXP(level)) * 100));

      // Simpan progress setiap 10 runs atau run terakhir
      if (runs % 10 === 0 || level >= targetLevel || runs === MAX_SIMULATION_RUNS) {
        progress.push(`${runs}x - Lv ${level} (${pct}%)`);
      }

      // Stop begitu level sudah mencapai atau lewat target
      if (level >= targetLevel) break;
    }

    const reachedTarget = level >= targetLevel;
    const finalPercent = level >= targetLevel 
      ? 100 
      : Math.min(99, Math.floor((currentXP / needXP(level)) * 100));

    return {
      success: true,
      runsNeeded: runs,
      startLevel,
      startPercent,
      targetLevel,
      questRange,
      totalQuestXP: questXP,
      progress,
      reachedTarget,
      finalLevel: level,
      finalPercent,
      totalXPNeeded,
    };
  } catch (err) {
    console.error("Error in calculateAdvRuns:", err);
    return {
      success: false,
      error: "Terjadi kesalahan pada simulator!",
      startLevel: input.currentLevel,
      startPercent: input.currentPercent,
      targetLevel: input.targetLevel,
      questRange: `Episode ${input.episodeFrom} - ${input.episodeTo}`,
      totalQuestXP: 0,
      progress: [],
      reachedTarget: false,
      finalLevel: input.currentLevel,
      finalPercent: input.currentPercent,
    };
  }
}

// Interface untuk WhatsApp bot
interface WhatsAppSock {
  sendMessage: (chatId: string, message: { text: string }) => Promise<void>;
}

// Export untuk backward compatibility dengan format lama (WhatsApp bot)
export async function spmadv(sock: WhatsAppSock, chatId: string, msg: unknown, text: string) {
  try {
    const args = text.replace(".spmadv", "").trim();
    if (!args) {
      return sock.sendMessage(chatId, {
        text: "Format:\n.spmadv <level> <persen> <target level> <chapter dari> - <chapter sampai>\n\nContoh:\n.spmadv 175 20 180 6 - 6",
      });
    }

    const match = args.match(/(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*-\s*(\d+)/);
    if (!match) {
      return sock.sendMessage(chatId, {
        text: "Format:\n.spmadv <level> <persen> <target level> <chapter dari> - <chapter sampai>\n\nContoh:\n.spmadv 175 20 180 6 - 6",
      });
    }

    const input: AdvCalculatorInput = {
      currentLevel: parseInt(match[1]),
      currentPercent: parseInt(match[2]),
      targetLevel: parseInt(match[3]),
      episodeFrom: 1, // Legacy: default to episode 1
      episodeTo: 122, // Legacy: default to episode 122
      spamMode: true, // Legacy: always spam mode for WhatsApp bot
    };

    const result = await calculateAdvRuns(input);

    if (!result.success) {
      return sock.sendMessage(chatId, { text: result.error || "Error" });
    }

    const statusLine = result.reachedTarget
      ? `✅ Target Lv ${result.targetLevel} tercapai!`
      : `⚠️ Belum capai target setelah ${MAX_SIMULATION_RUNS}x run (Lv ${result.finalLevel})`;

    const responseText = `
*Spam Adv By Neura Sama*

Level Awal  : ${result.startLevel} (${result.startPercent}%)
Target Level: ${result.targetLevel}

Quest XP    : ${result.totalQuestXP.toLocaleString()} exp

Butuh Run   : ${result.runsNeeded}x
${statusLine}

Progress (setiap 10x):
${result.progress.join("\n")}

Level Akhir : ${result.finalLevel} (${result.finalPercent}%)

Referensi: Toram Tools`.trim();

    await sock.sendMessage(chatId, { text: responseText });
  } catch (err) {
    console.error(err);
    sock.sendMessage(chatId, {
      text: "Terjadi kesalahan pada SPMADV simulator!",
    });
  }
}