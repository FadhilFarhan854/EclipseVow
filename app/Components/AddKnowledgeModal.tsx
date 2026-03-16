/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { X, Skull, Bug, Gem, Sword, Loader2, Plus, Trash2 } from "lucide-react";

interface BookOption {
  id: "boss" | "miniboss" | "crysta" | "equipment";
  title: string;
  icon: React.ReactNode;
  description: string;
}

const bookOptions: BookOption[] = [
  {
    id: "boss",
    title: "Boss Data",
    icon: <Skull className="w-6 h-6" />,
    description: "Add boss monster information",
  },
  {
    id: "miniboss",
    title: "Miniboss Data",
    icon: <Bug className="w-6 h-6" />,
    description: "Add miniboss monster information",
  },
  {
    id: "crysta",
    title: "Crysta Data",
    icon: <Gem className="w-6 h-6" />,
    description: "Add crysta item information",
  },
  {
    id: "equipment",
    title: "Equipment Data",
    icon: <Sword className="w-6 h-6" />,
    description: "Add equipment information",
  },
];

const AddKnowledgeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedBook, setSelectedBook] = useState<BookOption["id"] | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hasPrefilledBossId, setHasPrefilledBossId] = useState(false);

  const handleBookSelect = (bookId: BookOption["id"]) => {
    setSelectedBook(bookId);
    setFormData({});
    setError("");
    setHasPrefilledBossId(false);
  };

  const handleBack = () => {
    setSelectedBook(null);
    setFormData({});
    setError("");
    setHasPrefilledBossId(false);
  };

  const handleInputChange = (
    field: string,
    value: any,
    isArray: boolean = false
  ) => {
    if (isArray) {
      const arrayValue = typeof value === "string" ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];
      setFormData((prev) => ({ ...prev, [field]: arrayValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle key-value pairs (for stats, etc.)
  const handleKeyValueChange = (field: string, pairs: Array<{ key: string; value: string }>) => {
    // Convert pairs to object
    // Supports entries without value (e.g. "Tumble Unavailable", "ATK UP AGI(250%)")
    const obj: Record<string, number | string> = {};
    pairs.forEach((pair) => {
      if (pair.key.trim()) {
        if (pair.value.trim() === "") {
          // Special stat with no value — store as empty string
          obj[pair.key.trim()] = "";
        } else {
          const numVal = Number(pair.value);
          obj[pair.key.trim()] = isNaN(numVal) ? pair.value : numVal;
        }
      }
    });
    setFormData((prev) => ({ ...prev, [field]: obj }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      if (!selectedBook) {
        setError("Please select a book type");
        return;
      }

      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookType: selectedBook,
          data: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit data");
      }

      alert("Data submitted successfully!");
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset everything when closing the modal
  const handleClose = () => {
    setSelectedBook(null);
    setFormData({});
    setError("");
    setHasPrefilledBossId(false);
    onClose();
  };

  // Prefill next boss ID (last id + 1)
  useEffect(() => {
    let cancelled = false;

    const prefillBossId = async () => {
      if (selectedBook !== "boss" || hasPrefilledBossId) return;

      try {
        const res = await fetch("/api/library?type=boss", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!Array.isArray(data)) return;

        let maxId = 0;
        for (const item of data) {
          const rawId = (item as any).id ?? (item as any).ID ?? (item as any).Id;
          const n = parseInt(String(rawId), 10);
          if (!Number.isNaN(n) && n > maxId) {
            maxId = n;
          }
        }

        const nextId = String((maxId || 0) + 1);

        if (cancelled) return;

        setFormData((prev) => {
          if (prev.id) return prev;
          return {
            ...prev,
            id: nextId,
          };
        });

        setHasPrefilledBossId(true);
      } catch {
        // Ignore errors; allow manual ID entry
      }
    };

    prefillBossId();

    return () => {
      cancelled = true;
    };
  }, [selectedBook, hasPrefilledBossId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto box-glow scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border/40 bg-card/95 z-10">
          <h2 className="font-display text-xl md:text-2xl tracking-wider text-primary text-glow">
            {selectedBook ? "Add Entry" : "Add Knowledge"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary/40 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedBook ? (
            // Book Selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookOptions.map((book) => (
                <button
                  key={book.id}
                  onClick={() => handleBookSelect(book.id)}
                  className="p-4 border border-border rounded-lg hover:border-primary/60 hover:bg-primary/5 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-primary">{book.icon}</div>
                    <div>
                      <h3 className="font-display text-sm tracking-wider text-primary">
                        {book.title}
                      </h3>
                      <p className="font-body text-xs text-foreground/60 mt-1">
                        {book.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // Form
            <div className="space-y-4">
              {error && (
                <div className="p-4 rounded bg-red-900/20 border border-red-600/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <DynamicForm
                bookType={selectedBook}
                formData={formData}
                onInputChange={handleInputChange}
                onKeyValueChange={handleKeyValueChange}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded border border-border text-foreground/70 hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50 cursor-pointer font-body text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded bg-primary text-background hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer font-body text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Dynamic Form Component ── */
interface DynamicFormProps {
  bookType: "boss" | "miniboss" | "crysta" | "equipment";
  formData: Record<string, any>;
  onInputChange: (field: string, value: any, isArray?: boolean) => void;
  onKeyValueChange: (field: string, pairs: Array<{ key: string; value: string }>) => void;
}

const DynamicForm = ({
  bookType,
  formData,
  onInputChange,
  onKeyValueChange,
}: DynamicFormProps) => {
  const fields = getFormFields(bookType);

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="font-display text-xs tracking-widest uppercase text-primary/70 mb-1 block">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {field.hint && (
            <p className="font-body text-xs text-muted-foreground/60 mb-2 italic">
              {field.hint}
            </p>
          )}

          {field.type === "text" && (
            <input
              type="text"
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => onInputChange(field.name, e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-secondary/30 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          )}

          {field.type === "number" && (
            <input
              type="number"
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) =>
                onInputChange(field.name, e.target.value ? Number(e.target.value) : "")
              }
              className="w-full px-3 py-2 rounded border border-border bg-secondary/30 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          )}

          {field.type === "select" && (
            <select
              value={formData[field.name] || ""}
              onChange={(e) => onInputChange(field.name, e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-black text-primary font-body text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            >
              <option value="" className="bg-black text-primary/50">Select {field.label.toLowerCase()}</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt} className="bg-black text-primary">
                  {opt}
                </option>
              ))}
            </select>
          )}

          {field.type === "array" && (
            <ArrayInput
              field={field.name}
              placeholder={field.placeholder || "Separate with commas"}
              value={formData[field.name]}
              onInputChange={onInputChange}
            />
          )}

          {field.type === "checkbox" && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[field.name] || false}
                onChange={(e) => onInputChange(field.name, e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="font-body text-sm text-foreground/70">Yes</span>
            </label>
          )}

          {field.type === "keyvalue" && (
            <KeyValueInput
              field={field.name}
              value={formData[field.name] || {}}
              onChange={onKeyValueChange}
              keyPlaceholder={field.keyPlaceholder}
              valuePlaceholder={field.valuePlaceholder}
              suggestions={field.suggestions}
            />
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Array Input Component ── */
// Keeps a raw text buffer so commas aren't stripped while the user is typing.
// The old approach converted the value back via .join(", ") on every render,
// which removed trailing commas mid-typing.
const ArrayInput = ({
  field,
  placeholder,
  value,
  onInputChange,
}: {
  field: string;
  placeholder: string;
  value: any;
  onInputChange: (field: string, value: any, isArray?: boolean) => void;
}) => {
  const [raw, setRaw] = useState(
    Array.isArray(value) ? value.join(", ") : ""
  );

  // Reset raw text when the external value is cleared (e.g. form reset / back)
  useEffect(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      setRaw("");
    }
    // Only trigger on meaningful external resets, not on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!value || (Array.isArray(value) && value.length === 0)]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setRaw(text);
    const arrayValue = text
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    // Pass the parsed array directly (isArray = false so it skips the split logic in parent)
    onInputChange(field, arrayValue, false);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={raw}
      onChange={handleChange}
      className="w-full px-3 py-2 rounded border border-border bg-secondary/30 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
    />
  );
};

/* ── Key-Value Input Component ── */
interface KeyValueInputProps {
  field: string;
  value: Record<string, any>;
  onChange: (field: string, pairs: Array<{ key: string; value: string }>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  suggestions?: string[];
}

const KeyValueInput = ({
  field,
  value,
  onChange,
  keyPlaceholder = "Stat name",
  valuePlaceholder = "Value",
  suggestions = [],
}: KeyValueInputProps) => {
  // Convert object to array of pairs
  const initialPairs = Object.entries(value || {}).map(([k, v]) => ({
    key: k,
    value: String(v),
  }));
  
  const [pairs, setPairs] = useState<Array<{ key: string; value: string }>>(
    initialPairs.length > 0 ? initialPairs : [{ key: "", value: "" }]
  );

  const handlePairChange = (index: number, type: "key" | "value", newValue: string) => {
    const newPairs = [...pairs];
    newPairs[index][type] = newValue;
    setPairs(newPairs);
    onChange(field, newPairs);
  };

  const addRow = () => {
    const newPairs = [...pairs, { key: "", value: "" }];
    setPairs(newPairs);
  };

  const removeRow = (index: number) => {
    if (pairs.length <= 1) return;
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    onChange(field, newPairs);
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1fr_32px] gap-2">
        <span className="font-body text-xs text-muted-foreground/60 px-1">Stat Name</span>
        <span className="font-body text-xs text-muted-foreground/60 px-1">Value <span className="text-muted-foreground/40">(optional)</span></span>
        <span></span>
      </div>

      {/* Rows */}
      {pairs.map((pair, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder={keyPlaceholder}
              value={pair.key}
              onChange={(e) => handlePairChange(index, "key", e.target.value)}
              list={`suggestions-${field}-${index}`}
              className="w-full px-3 py-2 rounded border border-border bg-secondary/30 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
            {suggestions.length > 0 && (
              <datalist id={`suggestions-${field}-${index}`}>
                {suggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            )}
          </div>
          <input
            type="text"
            placeholder={valuePlaceholder}
            value={pair.value}
            onChange={(e) => handlePairChange(index, "value", e.target.value)}
            className="w-full px-3 py-2 rounded border border-border bg-secondary/30 text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
          />
          <button
            type="button"
            onClick={() => removeRow(index)}
            disabled={pairs.length <= 1}
            className="p-2 rounded border border-border text-foreground/40 hover:text-red-400 hover:border-red-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Add Row Button */}
      <button
        type="button"
        onClick={addRow}
        className="w-full py-2 rounded border border-dashed border-border hover:border-primary/40 text-foreground/50 hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-2 font-body text-sm"
      >
        <Plus className="w-4 h-4" />
        Add Row
      </button>
    </div>
  );
};

/* ── Form Fields Definition ── */
interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "array" | "checkbox" | "keyvalue";
  placeholder?: string;
  hint?: string;
  required?: boolean;
  options?: string[];
  // For keyvalue type
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  suggestions?: string[];
}

const getFormFields = (bookType: string): FormField[] => {
  switch (bookType) {
    case "boss":
      return [
        { name: "id", label: "ID", type: "text", required: true, placeholder: "e.g. 123" },
        { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Venena (Ultimate)" },
        { name: "type", label: "Type", type: "text", placeholder: "e.g. Boss" },
        {
          name: "difficulty",
          label: "Difficulty",
          type: "select",
          options: ["easy", "normal", "hard", "nightmare", "ultimate"],
          required: true,
        },
        { name: "level", label: "Level", type: "number", required: true, placeholder: "e.g. 250" },
        {
          name: "element",
          label: "Element",
          type: "select",
          options: ["Fire", "Water", "Earth", "Wind", "Light", "Dark", "Neutral"],
        },
        { name: "hp", label: "HP", type: "number", placeholder: "e.g. 50000000" },
        { name: "xp", label: "Experience", type: "number", placeholder: "e.g. 12000" },
        { name: "def", label: "DEF", type: "text", placeholder: "e.g. 1200 or 1200 Break Part: head -10" },
        { name: "mdef", label: "MDEF", type: "text", placeholder: "e.g. 1500 or 1500 Break Part: tail +5" },
        { name: "flee", label: "Flee", type: "number", placeholder: "e.g. 112" },
        { name: "guard", label: "Guard", type: "number", placeholder: "e.g. 0" },
        { name: "evade", label: "Evade", type: "number", placeholder: "e.g. 15" },
        { name: "proration_normal", label: "Proration Normal", type: "number", placeholder: "e.g. 10" },
        { name: "proration_phys", label: "Proration Physical", type: "number", placeholder: "e.g. 5" },
        { name: "proration_magic", label: "Proration Magic", type: "number", placeholder: "e.g. 20" },
        { name: "res_phys", label: "Physical Resistance", type: "number", placeholder: "e.g. 20" },
        { name: "res_magic", label: "Magic Resistance", type: "number", placeholder: "e.g. 25" },
        { name: "res_crit", label: "Crit Resistance", type: "number", placeholder: "e.g. 15" },
        { name: "location", label: "Location", type: "text", placeholder: "e.g. El Scaro Underground Waterway" },
        { 
          name: "drops", 
          label: "Drops", 
          type: "array", 
          placeholder: "e.g. Venena Gem, Dark Crystal, Shadow Blade",
          hint: "Separate multiple items with commas"
        },
      ];

    case "miniboss":
      return [
        { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Pino Bomb" },
        { name: "level", label: "Level", type: "number", required: true, placeholder: "e.g. 45" },
        { name: "type", label: "Type", type: "text", placeholder: "e.g. Miniboss" },
        { name: "hp", label: "HP", type: "number", placeholder: "e.g. 150000" },
        {
          name: "element",
          label: "Element",
          type: "select",
          options: ["Fire", "Water", "Earth", "Wind", "Light", "Dark", "Neutral"],
        },
        { name: "exp", label: "Experience", type: "number", placeholder: "e.g. 2500" },
        {
          name: "tamable",
          label: "Tamable",
          type: "checkbox",
          hint: "Can this monster be tamed as a pet?"
        },
        { name: "spawn_map", label: "Spawn Map", type: "text", placeholder: "e.g. Sofya City Outskirts" },
        { 
          name: "drops", 
          label: "Drops", 
          type: "array", 
          placeholder: "e.g. Bomb Fragment, Fire Crystal",
          hint: "Separate multiple items with commas"
        },
      ];

    case "crysta":
      return [
        { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. ATK+10% [Normal Crysta]" },
        { name: "type", label: "Type", type: "text", required: true, placeholder: "e.g. [Normal Crysta], [Enhancer Crysta (Purple)]" },
        { name: "sell_price", label: "Sell Price", type: "text", placeholder: "e.g. 1 Spina" },
        { name: "process", label: "Process", type: "text", placeholder: "e.g. 100 Mana" },
        { 
          name: "stats", 
          label: "Stats", 
          type: "keyvalue",
          hint: "Add stat bonuses provided by this crysta",
          keyPlaceholder: "e.g. ATK %",
          valuePlaceholder: "e.g. 10",
          suggestions: [
            "ATK", "ATK %", "MATK", "MATK %", "DEF", "DEF %", "MDEF", "MDEF %",
            "MaxHP", "MaxHP %", "MaxMP", "MaxMP %", "STR", "INT", "VIT", "AGI", "DEX",
            "Critical Rate", "Critical Damage", "Accuracy", "Dodge",
            "Physical Resistance %", "Magic Resistance %",
            "Fire Resistance %", "Water Resistance %", "Earth Resistance %", "Wind Resistance %",
            "Light Resistance %", "Dark Resistance %",
            "Damage to Fire %", "Damage to Water %", "Damage to Earth %", "Damage to Wind %",
            "Damage to Light %", "Damage to Dark %", "Damage to Neutral %",
            "Stability %", "Attack MP Recovery", "Attack Speed %",
            "Short Range Damage %", "Long Range Damage %",
            "Aggro %", "Ailment Resistance %", "Guard Rate %", "Guard Power %",
            "Tumble Unavailable", "Flinch Unavailable", "Stun Unavailable"
          ]
        },
      ];

    case "equipment":
      return [
        { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Daybreak Sword" },
        { name: "type", label: "Type", type: "text", required: true, placeholder: "e.g. One-Handed Sword, Staff, Armor" },
        { name: "sell_price", label: "Sell Price", type: "text", placeholder: "e.g. 5000 Spina" },
        { name: "process", label: "Process", type: "text", placeholder: "e.g. 250 Mana" },
        { 
          name: "stats", 
          label: "Stats", 
          type: "keyvalue",
          hint: "Add base stats of this equipment",
          keyPlaceholder: "e.g. ATK",
          valuePlaceholder: "e.g. 150",
          suggestions: [
            "ATK", "ATK %", "MATK", "MATK %", "DEF", "DEF %", "MDEF", "MDEF %",
            "MaxHP", "MaxHP %", "MaxMP", "MaxMP %", "STR", "INT", "VIT", "AGI", "DEX",
            "Stability", "Accuracy", "Critical Rate", "Critical Damage",
            "Attack Speed", "Cast Speed", "Physical Pierce", "Magic Pierce",
            "Unsheathe Attack", "Short Range Damage %", "Long Range Damage %",
            "Physical Resistance %", "Magic Resistance %",
            "Fire Resistance %", "Water Resistance %", "Earth Resistance %", "Wind Resistance %",
            "Light Resistance %", "Dark Resistance %",
            "Damage to Fire %", "Damage to Water %", "Damage to Earth %", "Damage to Wind %",
            "Damage to Light %", "Damage to Dark %", "Damage to Neutral %",
            "Guard Rate %", "Guard Power %", "Evasion Rate %",
            "Tumble Unavailable", "Flinch Unavailable", "Stun Unavailable"
          ]
        },
        { name: "source", label: "Source", type: "text", placeholder: "e.g. NPC Shop, Boss Drop" },
        { 
          name: "monsters", 
          label: "Drop Monsters", 
          type: "array", 
          placeholder: "e.g. Venena (Hard), Shadow Dragon",
          hint: "Monsters that drop this equipment"
        },
        { 
          name: "maps", 
          label: "Maps", 
          type: "array", 
          placeholder: "e.g. El Scaro Underground, Dark Castle",
          hint: "Maps where this can be obtained"
        },
      ];

    default:
      return [];
  }
};

export default AddKnowledgeModal;
