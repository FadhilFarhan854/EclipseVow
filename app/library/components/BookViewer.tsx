"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Skull, Bug, Gem, Sword,
  ArrowLeft, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, Loader2, MapPin, Swords,
} from "lucide-react";

/* ── Types for all 4 data shapes ── */
interface BossEntry {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  level: string;
  element: string;
  hp: string;
  xp: string;
  def: string;
  mdef: string;
  flee: string;
  guard: string;
  evade: string;
  proration_normal: string;
  proration_phys: string;
  proration_magic: string;
  res_phys: string;
  res_magic: string;
  res_crit: string;
  picture: string | null;
  drops: string[];
  location?: string;
}
interface MinibossEntry {
  name: string;
  level: number;
  type: string;
  hp: number;
  element: string;
  exp: number;
  tamable: boolean;
  spawn: { map: string; link: string };
  drops: { category: string; name: string; link: string }[];
}
interface CrystaEntry {
  name: string;
  type: string;
  sell_price: string;
  process: string;
  stats: Record<string, number | string>;
  restriction?: { condition: string; stat: string; value: number };
  upgrade_for?: { name: string; link: string };
}
interface EquipmentEntry {
  name: string;
  type: string;
  sell_price: string;
  process: string;
  stats: Record<string, number | string>;
  obtained_from?: {
    source?: string;
    source_type?: string;
    dye?: string[];
    info_3?: string;
    monsters?: string[];
    maps?: string[];
    difficulty?: string;
    materials?: string[];
  };
}

type AnyEntry = BossEntry | MinibossEntry | CrystaEntry | EquipmentEntry;

interface BookDef {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconName: string;
  color: string;
  spineColor: string;
  file: string;
}

const bookIcons: Record<string, React.ReactNode> = {
  skull: <Skull className="w-6 h-6" />,
  bug: <Bug className="w-6 h-6" />,
  gem: <Gem className="w-6 h-6" />,
  sword: <Sword className="w-6 h-6" />,
};

/* ── Main Component ── */
const BookViewer = ({
  book,
  onClose,
}: {
  book: BookDef;
  onClose: () => void;
}) => {
  const [data, setData] = useState<AnyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(book.file)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [book.file]);

  const getName = useCallback(
    (entry: AnyEntry) => {
      if (book.id === "boss") return (entry as BossEntry).name;
      return (entry as MinibossEntry | CrystaEntry | EquipmentEntry).name;
    },
    [book.id]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((e) => {
      // Search by name
      const nameMatch = getName(e).toLowerCase().includes(q);
      if (nameMatch) return true;
      
      // For boss entries, also search by drops
      if (book.id === "boss") {
        const bossEntry = e as BossEntry;
        if (bossEntry.drops && bossEntry.drops.length > 0) {
          return bossEntry.drops.some(drop => drop.toLowerCase().includes(q));
        }
      }
      
      // For miniboss entries, also search by drops
      if (book.id === "miniboss") {
        const minibossEntry = e as MinibossEntry;
        if (minibossEntry.drops && minibossEntry.drops.length > 0) {
          return minibossEntry.drops.some(drop => drop.name.toLowerCase().includes(q));
        }
      }
      
      return false;
    });
  }, [data, search, getName, book.id]);

  const totalPages = filtered.length;
  const current = filtered[page] as AnyEntry | undefined;

  const goTo = (p: number) => {
    if (p >= 0 && p < totalPages) setPage(p);
  };

  useEffect(() => {
    setPage(0);
  }, [search]);

  /* ── Keyboard nav ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(page + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(page - 1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, totalPages]);

  return (
    <section className="py-8 md:py-12 px-3 md:px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={onClose}
            className="font-display text-xs md:text-sm tracking-wider text-primary/70 hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Archives</span>
            <span className="sm:hidden">Back</span>
          </button>
          <h2 className="font-display text-lg md:text-3xl tracking-wider text-primary text-glow flex items-center gap-2 md:gap-3">
            {bookIcons[book.iconName]} {book.title}
          </h2>
          <div className="w-12 md:w-32" />
        </div>

        {/* Search */}
        <div className="mb-5 md:mb-6 relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder={book.id === "boss" || book.id === "miniboss" ? `Search by name or drops...` : `Search ${book.title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card/60 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
          />
        </div>

        {loading ? (
          <div className="text-center py-32">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="mt-4 font-body text-muted-foreground italic">
              Opening the tome...
            </p>
          </div>
        ) : totalPages === 0 ? (
          <div className="text-center py-32">
            <p className="font-body text-xl text-muted-foreground italic">
              No entries found.
            </p>
          </div>
        ) : (
          <>
            {/* The Book Page */}
            {current && (
              <div className="relative rounded-lg border border-border/60 bg-card/80 backdrop-blur-sm box-glow overflow-hidden">
                {/* Spine accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/30" />

                <div className="p-5 pl-7 md:p-10 md:pl-14">
                  {/* Entry title */}
                  <h3 className="font-display text-xl md:text-3xl tracking-wider text-primary text-glow mb-1 break-words">
                    {getName(current)}
                  </h3>
                  <div className="divider-glow w-full max-w-xs mb-6 md:mb-8" />

                  {/* Render by type */}
                  {book.id === "boss" && <BossPage entry={current as BossEntry} />}
                  {book.id === "miniboss" && <MinibossPage entry={current as MinibossEntry} />}
                  {book.id === "crysta" && <CrystaPage entry={current as CrystaEntry} />}
                  {book.id === "equipment" && <EquipmentPage entry={current as EquipmentEntry} />}
                </div>

                {/* Page curl decorative corner */}
                <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-background/80 to-transparent" />
                </div>
              </div>
            )}

            {/* Navigation — compact mobile-friendly */}
            <div className="mt-6 md:mt-8 flex flex-col items-center gap-3">
              {/* Page indicator + jump */}
              <div className="flex items-center gap-2">
                <span className="font-body text-xs text-muted-foreground">Page</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={page + 1}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v)) goTo(v - 1);
                  }}
                  className="w-14 text-center px-1 py-1 rounded border border-border bg-card/60 text-foreground font-body text-sm focus:outline-none focus:border-primary/50"
                />
                <span className="font-body text-xs text-muted-foreground">
                  of {totalPages}
                </span>
              </div>

              {/* Nav buttons row */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goTo(0)}
                  disabled={page <= 0}
                  className="p-2 rounded border border-border text-foreground/50 hover:text-primary hover:border-primary/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="First"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goTo(page - 1)}
                  disabled={page <= 0}
                  className="px-3 py-2 rounded border border-border text-foreground/60 hover:text-primary hover:border-primary/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-display text-xs md:text-sm"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
                <button
                  onClick={() => goTo(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-2 rounded border border-border text-foreground/60 hover:text-primary hover:border-primary/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 font-display text-xs md:text-sm"
                  title="Next"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goTo(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded border border-border text-foreground/50 hover:text-primary hover:border-primary/40 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Last"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BookViewer;

/* ═══════════════════════════════════════════
   Page renderers per data type
   ═══════════════════════════════════════════ */

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="font-display text-xs tracking-widest uppercase text-primary/60">
    {children}
  </span>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <span className="font-body text-foreground/90">{children}</span>
);

const StatRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between py-1.5 border-b border-border/30 last:border-b-0">
    <span className="font-body text-sm text-foreground/60">{label}</span>
    <span className="font-body text-sm text-foreground">{String(value)}</span>
  </div>
);

const Tag = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "primary" | "gold" }) => {
  const colors = {
    default: "bg-secondary/60 text-foreground/70 border-border/40",
    primary: "bg-primary/10 text-primary border-primary/30",
    gold: "bg-yellow-900/20 text-yellow-400/80 border-yellow-600/30",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-body border ${colors[variant]}`}>
      {children}
    </span>
  );
};

/* ── Helper: Get difficulty color ── */
const getDifficultyColor = (difficulty: string) => {
  const d = difficulty.toLowerCase();
  if (d === "easy") return "text-green-400";
  if (d === "normal") return "text-blue-400";
  if (d === "hard") return "text-yellow-400";
  if (d === "nightmare") return "text-orange-400";
  if (d === "ultimate") return "text-red-400";
  return "text-foreground/70";
};

/* ── Boss Page ── */
const BossPage = ({ entry }: { entry: BossEntry }) => (
  <div className="space-y-6">
    {/* Basic Info */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <Label>Level</Label>
        <div><Value>{entry.level}</Value></div>
      </div>
      <div>
        <Label>Difficulty</Label>
        <div><span className={`font-body capitalize ${getDifficultyColor(entry.difficulty)}`}>{entry.difficulty}</span></div>
      </div>
      <div>
        <Label>Element</Label>
        <div><Value>{entry.element}</Value></div>
      </div>
      <div>
        <Label>Type</Label>
        <div><Tag variant="primary">{entry.type}</Tag></div>
      </div>
    </div>

    {/* Combat Stats */}
    <div>
      <Label>Combat Stats</Label>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded border border-border/40 px-3 py-2">
          <div className="font-display text-[10px] tracking-widest uppercase text-red-400/70">HP</div>
          <div className="font-body text-lg text-foreground">{entry.hp}</div>
        </div>
        <div className="rounded border border-border/40 px-3 py-2">
          <div className="font-display text-[10px] tracking-widest uppercase text-yellow-400/70">EXP</div>
          <div className="font-body text-lg text-foreground">{entry.xp}</div>
        </div>
        <div className="rounded border border-border/40 px-3 py-2">
          <div className="font-display text-[10px] tracking-widest uppercase text-blue-400/70">DEF</div>
          <div className="font-body text-lg text-foreground">{entry.def}</div>
        </div>
        <div className="rounded border border-border/40 px-3 py-2">
          <div className="font-display text-[10px] tracking-widest uppercase text-purple-400/70">MDEF</div>
          <div className="font-body text-lg text-foreground">{entry.mdef}</div>
        </div>
      </div>
    </div>

    {/* Defensive Stats */}
    <div>
      <Label>Defensive Stats</Label>
      <div className="mt-2 rounded border border-border/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/40">
              <th className="px-3 py-2 text-left font-display text-xs tracking-wider text-primary/70">Stat</th>
              <th className="px-3 py-2 text-right font-display text-xs tracking-wider text-primary/70">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border/20 hover:bg-secondary/20">
              <td className="px-3 py-2 font-body text-foreground/80">Flee</td>
              <td className="px-3 py-2 text-right font-body text-foreground/70">{entry.flee}</td>
            </tr>
            <tr className="border-t border-border/20 hover:bg-secondary/20">
              <td className="px-3 py-2 font-body text-foreground/80">Guard</td>
              <td className="px-3 py-2 text-right font-body text-foreground/70">{entry.guard}</td>
            </tr>
            <tr className="border-t border-border/20 hover:bg-secondary/20">
              <td className="px-3 py-2 font-body text-foreground/80">Evade</td>
              <td className="px-3 py-2 text-right font-body text-foreground/70">{entry.evade}</td>
            </tr>
            <tr className="border-t border-border/20 hover:bg-secondary/20">
              <td className="px-3 py-2 font-body text-foreground/80">Phys Resist</td>
              <td className="px-3 py-2 text-right font-body text-foreground/70">{entry.res_phys}</td>
            </tr>
            <tr className="border-t border-border/20 hover:bg-secondary/20">
              <td className="px-3 py-2 font-body text-foreground/80">Magic Resist</td>
              <td className="px-3 py-2 text-right font-body text-foreground/70">{entry.res_magic}</td>
            </tr>
            <tr className="border-t border-border/20 hover:bg-secondary/20">
              <td className="px-3 py-2 font-body text-foreground/80">Crit Resist</td>
              <td className="px-3 py-2 text-right font-body text-foreground/70">{entry.res_crit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Location */}
    {entry.location && (
      <div>
        <Label>Location</Label>
        <div className="mt-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-400/80" />
          <Value>{entry.location}</Value>
        </div>
      </div>
    )}

    {/* Drops */}
    <div>
      <Label>Monster Drops</Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {entry.drops && entry.drops.length > 0 ? (
          entry.drops.map((drop, i) => (
            <Tag key={i} variant="default">
              {drop}
            </Tag>
          ))
        ) : (
          <span className="font-body text-sm text-muted-foreground italic">No drops recorded.</span>
        )}
      </div>
    </div>
  </div>
);

/* ── Mini Boss Page ── */
const MinibossPage = ({ entry }: { entry: MinibossEntry }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <Label>Level</Label>
        <div><Value>{entry.level}</Value></div>
      </div>
      <div>
        <Label>Element</Label>
        <div><Value>{entry.element}</Value></div>
      </div>
      <div>
        <Label>HP</Label>
        <div><Value>{entry.hp.toLocaleString()}</Value></div>
      </div>
      <div>
        <Label>EXP</Label>
        <div><Value>{entry.exp.toLocaleString()}</Value></div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div>
        <Label>Type</Label>
        <div><Value>{entry.type}</Value></div>
      </div>
      <div>
        <Label>Tamable</Label>
        <div><Value>{entry.tamable ? "Yes" : "No"}</Value></div>
      </div>
      <div>
        <Label>Spawn</Label>
        <div><Value>{entry.spawn?.map || "Unknown"}</Value></div>
      </div>
    </div>

    <div>
      <Label>Drops</Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {entry.drops?.map((d, i) => (
          <Tag key={i} variant={d.category === "Additional" || d.category?.includes("Crysta") ? "gold" : "default"}>
            {d.name}
            {d.category && <span className="ml-1 opacity-60">[{d.category}]</span>}
          </Tag>
        )) || <span className="font-body text-sm text-muted-foreground italic">No drops recorded.</span>}
      </div>
    </div>
  </div>
);

/* ── Crysta Page ── */
const CrystaPage = ({ entry }: { entry: CrystaEntry }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div>
        <Label>Type</Label>
        <div><Tag variant="primary">{entry.type}</Tag></div>
      </div>
      <div>
        <Label>Sell Price</Label>
        <div><Value>{entry.sell_price}</Value></div>
      </div>
      <div>
        <Label>Process</Label>
        <div><Value>{entry.process}</Value></div>
      </div>
    </div>

    <div>
      <Label>Stats</Label>
      <div className="mt-2 rounded border border-border/40 overflow-hidden px-4 py-2">
        {Object.entries(entry.stats || {}).map(([k, v]) => (
          <StatRow key={k} label={k} value={v} />
        ))}
      </div>
    </div>

    {entry.restriction && (
      <div>
        <Label>Restriction</Label>
        <div className="mt-2 rounded border border-yellow-600/20 bg-yellow-900/10 px-4 py-3">
          <p className="font-body text-sm text-yellow-400/80">{entry.restriction.condition}</p>
          <p className="font-body text-sm text-foreground/70">
            {entry.restriction.stat}: +{entry.restriction.value}
          </p>
        </div>
      </div>
    )}

    {entry.upgrade_for && (
      <div>
        <Label>Upgrade For</Label>
        <div className="mt-1"><Tag variant="gold">{entry.upgrade_for.name}</Tag></div>
      </div>
    )}
  </div>
);

/* ── Equipment Page ── */
const EquipmentPage = ({ entry }: { entry: EquipmentEntry }) => {
  const ob = entry.obtained_from;
  const hasMonsters = ob?.monsters && ob.monsters.length > 0 && ob.monsters[0] !== "-";
  const hasMaps = ob?.maps && ob.maps.length > 0 && ob.maps[0] !== "-";
  const hasSource = ob?.source && ob.source !== "-";
  const hasDye = ob?.dye && ob.dye.length > 0 && ob.dye[0] !== "-";
  const hasMaterials = ob?.materials && ob.materials.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label>Type</Label>
          <div><Tag variant="primary">{entry.type}</Tag></div>
        </div>
        <div>
          <Label>Sell Price</Label>
          <div><Value>{entry.sell_price}</Value></div>
        </div>
        <div>
          <Label>Process</Label>
          <div><Value>{entry.process}</Value></div>
        </div>
      </div>

      <div>
        <Label>Stats</Label>
        <div className="mt-2 rounded border border-border/40 overflow-hidden px-4 py-2">
          {Object.entries(entry.stats || {}).map(([k, v]) => (
            <StatRow key={k} label={k} value={v} />
          ))}
        </div>
      </div>

      {/* Obtained From — full detail */}
      {ob && (hasMonsters || hasMaps || hasSource || hasMaterials) && (
        <div>
          <Label>Obtained From</Label>
          <div className="mt-2 space-y-3">
            {/* Source (NPC/Player/etc) */}
            {hasSource && (
              <div className="rounded border border-border/40 px-4 py-3">
                <p className="font-body text-sm text-foreground/80">
                  {ob.source}
                </p>
              </div>
            )}

            {/* Monsters */}
            {hasMonsters && (
              <div className="rounded border border-border/40 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Swords className="w-3.5 h-3.5 text-red-400/80" />
                  <span className="font-display text-xs tracking-widest uppercase text-red-400/70">Monsters</span>
                </div>
                <ul className="space-y-1">
                  {ob.monsters!.map((m, i) => (
                    <li key={i} className="font-body text-sm text-foreground/70 flex items-start gap-2">
                      <span className="text-red-400/50 mt-0.5">•</span>{m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Maps */}
            {hasMaps && (
              <div className="rounded border border-border/40 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-green-400/80" />
                  <span className="font-display text-xs tracking-widest uppercase text-green-400/70">Maps</span>
                </div>
                <ul className="space-y-1">
                  {ob.maps!.map((m, i) => (
                    <li key={i} className="font-body text-sm text-foreground/70 flex items-start gap-2">
                      <span className="text-green-400/50 mt-0.5">•</span>{m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Materials */}
            {hasMaterials && (
              <div className="rounded border border-border/40 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Gem className="w-3.5 h-3.5 text-purple-400/80" />
                  <span className="font-display text-xs tracking-widest uppercase text-purple-400/70">Materials</span>
                </div>
                <ul className="space-y-1">
                  {ob.materials!
                    .filter((m) => m.startsWith("- "))
                    .map((m, i) => (
                      <li key={i} className="font-body text-sm text-foreground/70 flex items-start gap-2">
                        <span className="text-purple-400/50 mt-0.5">•</span>{m.replace(/^- /, "")}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Dye */}
            {hasDye && (
              <div className="flex gap-2 items-center">
                <span className="font-display text-xs tracking-widest uppercase text-primary/60">Dye:</span>
                {ob.dye!.map((d, i) => (
                  <Tag key={i}>{d}</Tag>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
