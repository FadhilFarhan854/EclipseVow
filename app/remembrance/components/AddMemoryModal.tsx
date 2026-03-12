"use client";

import { useState, useRef } from "react";
import { X, Upload, ImagePlus, Loader2 } from "lucide-react";

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMemoryModal = ({ isOpen, onClose, onSuccess }: AddMemoryModalProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setName("");
    setDate("");
    setDesc("");
    setFile(null);
    setPreview(null);
    setError("");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate file type
    if (!selected.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (selected.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB");
      return;
    }

    setFile(selected);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !date) {
      setError("Please fill in name, date, and select an image");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Step 1: Upload image to Cloudinary via our API
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json();
        throw new Error(uploadErr.message || "Failed to upload image");
      }

      const { url } = await uploadRes.json();

      // Step 2: Save metadata to npoint.io via our API
      const saveRes = await fetch("/api/remembrance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date, desc, url }),
      });

      if (!saveRes.ok) {
        const saveErr = await saveRes.json();
        throw new Error(saveErr.message || "Failed to save memory");
      }

      // Success
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display text-xl tracking-wider text-primary">
            Add Memory
          </h3>
          <button
            onClick={handleClose}
            className="text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block font-display text-sm tracking-wider text-foreground/60 mb-2">
              Photo *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-all overflow-hidden ${
                preview
                  ? "border-primary/40"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {preview ? (
                <div className="relative aspect-video">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-display tracking-wider">
                      Click to change
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-foreground/30">
                  <ImagePlus className="w-10 h-10 mb-3" />
                  <p className="font-display text-sm tracking-wider">
                    Click to select an image
                  </p>
                  <p className="text-xs mt-1 text-foreground/20">
                    JPG, PNG, WebP — max 10MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block font-display text-sm tracking-wider text-foreground/60 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name this memory..."
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/60 transition-colors font-body"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block font-display text-sm tracking-wider text-foreground/60 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition-colors font-body [color-scheme:dark]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-display text-sm tracking-wider text-foreground/60 mb-2">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tell the story behind this moment..."
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/60 transition-colors font-body resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm font-body bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || !file || !name || !date}
            className="w-full py-3 rounded-lg font-display tracking-wider text-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Save Memory
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryModal;
