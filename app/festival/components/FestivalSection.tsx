"use client";

import { useState, useRef } from "react";
import { Upload, FileVideo, Loader2, CheckCircle } from "lucide-react";

interface FestivalSectionProps {
  activeTab: string;
}

const FestivalSection = ({ activeTab }: FestivalSectionProps) => {
  const [ign, setIgn] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("video/")) {
      setError("Please select a video file!");
      return;
    }

    if (selected.size > 50 * 1024 * 1024) {
      setError("Ukuran file maksimal 50MB");
      return;
    }

    setFile(selected);
    setError("");
    
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !ign.trim()) {
      setError("Silakan isi IGN dan pilih file video bukti!");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      // 1. Dapatkan signature cloudinary dari API yang sudah ada
      const sigRes = await fetch("/api/upload");
      if (!sigRes.ok) throw new Error("Gagal mendapatkan signature upload");
      
      const { signature, timestamp, folder, apiKey, cloudName } = await sigRes.json();

      // 2. Upload ke Cloudinary dengan XMLHttpRequest untuk melacak progress
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", file);
      cloudinaryForm.append("folder", folder);
      cloudinaryForm.append("timestamp", timestamp.toString());
      cloudinaryForm.append("api_key", apiKey);
      cloudinaryForm.append("signature", signature);

      const uploadedUrl = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve(data.secure_url);
          } else {
            console.error("Cloudinary error:", xhr.responseText);
            reject(new Error("Gagal mengupload video ke Cloudinary"));
          }
        };

        xhr.onerror = () => reject(new Error("Terjadi kesalahan jaringan saat upload"));
        xhr.send(cloudinaryForm);
      });

      setProgress(100);

      // 3. Simpan data json status, url, ign ke npoint API khusus MQ
      const saveRes = await fetch("/api/festival/mq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ign, url: uploadedUrl, status: "unpaid" }),
      });

      if (!saveRes.ok) throw new Error("Gagal menyimpan data klaim MQ");

      // Berhasil, tampilkan modal success
      setShowSuccessModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui");
      setUploading(false);
    }
  };

  return (
    <section className="relative flex-1 py-16 md:py-24 px-4 md:px-8 bg-background flex flex-col items-center justify-center">
      {activeTab === "mq" ? (
        <div className="w-full max-w-4xl mx-auto border border-primary/20 bg-card/40 backdrop-blur-sm p-6 md:p-12 rounded-2xl shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
          <h3 className="font-display text-3xl md:text-5xl text-primary mb-6 capitalize text-center">
            MQ Progression
          </h3>
          <p className="font-body text-base md:text-lg text-foreground/80 mb-6 text-center">
            MQ penting buat pertumbuhan character kalian. Untuk player baru akan ada bonus dari guild ketika kalian pertama kali selesai menamatkan main quest.
          </p>

          <div className="bg-primary/20 border border-primary/50 rounded-xl p-6 text-center mb-8 box-glow transition-all">
            <h4 className="font-display text-2xl md:text-4xl text-primary font-bold tracking-wider">
              Reward 15.000.000 Spina
            </h4>
          </div>

          <div className="mb-8">
            <h5 className="font-display text-xl text-primary mb-3 decoration-primary underline decoration-2 underline-offset-4">Aturan Klaim:</h5>
            <ul className="list-decimal pl-5 space-y-2 font-body text-foreground/80">
              <li>1 orang hanya bisa claim sekali.</li>
              <li>Harus mengupload bukti menamatkan MQ. Syarat yang harus terlihat di video adalah <b>IGN di pojok kiri atas</b> dan bukti kalau quest sudah selesai.</li>
              <li>Bukti kalau sudah selesai dapat dilihat di menu <b>{`->`} Character {`->`} Quest</b>.</li>
            </ul>
          </div>

          <div className="mb-10 text-center">
            <h5 className="font-display text-xl text-primary mb-4">Contoh Video:</h5>
            <video 
              src="/asset/mq-progression.mp4" 
              controls 
              className="w-full max-w-2xl mx-auto rounded-lg border border-primary/40 shadow-lg"
            ></video>
          </div>

          <div className="divider-glow w-full mb-8" />

          <h5 className="font-display text-2xl text-primary mb-6 text-center">Form Klaim Reward</h5>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
            <div>
              <label className="block font-display text-sm tracking-wider text-foreground/60 mb-2">
                In Game Name (IGN) *
              </label>
              <input
                type="text"
                value={ign}
                disabled={uploading}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="Masukkan IGN yang valid..."
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/60 transition-colors font-body"
              />
            </div>
            
            <div>
              <label className="block font-display text-sm tracking-wider text-foreground/60 mb-2">
                Upload Video Bukti *
              </label>
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg transition-all overflow-hidden p-8 text-center ${
                  uploading ? "opacity-60 cursor-not-allowed border-primary/20" : "cursor-pointer"
                } ${
                  preview
                    ? "border-primary/40 bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {preview ? (
                  <div className="flex flex-col items-center">
                    <FileVideo className="w-12 h-12 text-primary mb-2" />
                    <p className="text-sm font-body text-foreground/80 truncate w-full px-4">{file?.name}</p>
                    {!uploading && <p className="text-xs text-primary/60 mt-2">Klik untuk mengganti video</p>}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-10 h-10 mb-3 text-foreground/40" />
                    <p className="font-display text-sm tracking-wider">
                      Klik untuk memilih video (MP4/WebM)
                    </p>
                    <p className="text-xs mt-1 text-foreground/30 text-center">
                      Maksimal 50MB
                    </p>
                  </div>
                )}
                {/* Progress Bar Overlay saat upload */}
                {uploading && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/50">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm font-body bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !file || !ign.trim()}
              className="w-full py-4 rounded-lg font-display tracking-wider text-base transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-primary/20 border border-primary/40 text-primary hover:bg-primary/40 hover:border-primary transition-all shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengunggah ({progress}%)...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Kirim Bukti MQ
                </>
              )}
            </button>
            <p className="text-center text-xs text-foreground/50 font-body">Status akan diatur sebagai <b>"Unpaid"</b> secara default hingga staff mengeceknya.</p>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto text-center border border-primary/20 bg-card/40 backdrop-blur-sm p-16 rounded-2xl shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
          <h3 className="font-display text-3xl md:text-5xl text-primary mb-6 capitalize">
            {activeTab === "boss" && "Boss Hunt"}
            {activeTab === "guild" && "Guild Quest"}
          </h3>
          <p className="font-body text-2xl md:text-3xl text-foreground/60 italic mb-8">Coming Soon</p>
          <div className="w-24 h-1 bg-primary/50 mx-auto rounded-full" />
          <p className="font-body text-sm md:text-base text-foreground/40 mt-6 leading-relaxed">
            The preparations are still underway. Gather your strength and sharpen your blades, for the gates will open shortly.
          </p>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-primary/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-display text-2xl text-primary mb-3">Berhasil!</h3>
            <p className="font-body text-foreground/70 mb-8 text-sm md:text-base">
              Bukti MQ Progression Anda telah sukses terkirim. Staff akan memproses status Anda.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl bg-primary text-background font-display tracking-widest hover:bg-primary/90 transition-colors shadow-lg font-bold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FestivalSection;
