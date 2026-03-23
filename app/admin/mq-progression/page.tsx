"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, Clock } from "lucide-react";

interface MQData {
  ign: string;
  url: string;
  status: string;
  timestamp: string;
}

export default function AdminMQProgression() {
  const [data, setData] = useState<MQData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/festival/mq");
      if (!res.ok) throw new Error("Gagal mengambil data dari API.");
      const json = await res.json();
      
      // Sort dari yang paling baru (descending timestamp)
      const sorted = Array.isArray(json) 
        ? json.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        : [];
        
      setData(sorted);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (item: MQData) => {
    const newStatus = item.status === "unpaid" ? "paid" : "unpaid";
    try {
      const res = await fetch("/api/festival/mq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp: item.timestamp, status: newStatus }),
      });
      if (!res.ok) throw new Error("Gagal mengupdate status");
      
      // Update local state
      setData(prev => prev.map(d => d.timestamp === item.timestamp ? { ...d, status: newStatus } : d));
    } catch (err) {
      alert("Gagal merubah status video ini.");
    }
  };

  // Logic Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
        <p className="text-red-400 border border-red-500/20 bg-red-500/10 px-6 py-4 rounded-lg">{error}</p>
        <button onClick={fetchData} className="px-4 py-2 border border-primary/40 text-primary hover:bg-primary/20 rounded-md">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 md:px-8 pb-32">
      <h1 className="text-3xl md:text-4xl font-display text-primary mb-12 font-bold text-center tracking-wider">
        Kelola MQ Progression
      </h1>
      
      {data.length === 0 ? (
        <div className="text-center py-20 border border-border rounded-xl bg-card">
          <p className="text-foreground/60 font-body text-lg">Belum ada pemain yang submit klaim.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {currentData.map((item, index) => (
              <div key={index} className="border border-border bg-card rounded-xl overflow-hidden flex flex-col shadow-md hover:border-primary/40 transition-all group">
                {/* Video section */}
                <div className="aspect-video bg-black relative border-b border-border">
                  <video src={item.url} controls className="w-full h-full object-contain" />
                </div>
                
                {/* Info section */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h2 className="text-2xl font-display font-bold text-foreground/90 truncate flex-1">{item.ign}</h2>
                    <span 
                      className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 shrink-0 ${
                        item.status === "paid" 
                        ? "bg-green-500/10 text-green-400 border border-green-500/30" 
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {item.status === "paid" ? <CheckCircle className="w-3.5 h-3.5"/> : <Clock className="w-3.5 h-3.5"/>}
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-foreground/40 font-body mb-6 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
                  </p>
                  
                  {/* Action button */}
                  <div className="mt-auto pt-2">
                    <button 
                      onClick={() => handleUpdateStatus(item)}
                      className={`w-full py-3 rounded-lg font-display text-sm md:text-base tracking-widest transition-all ${
                        item.status === "paid" 
                        ? "bg-card border border-border text-foreground/50 hover:bg-background hover:text-foreground hover:border-foreground/30" 
                        : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/60 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]"
                      }`}
                    >
                      {item.status === "paid" ? "TANDAI BELUM DIBAYAR" : "TANDAI SELESAI"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
             <div className="flex justify-center items-center gap-4 mt-16 max-w-7xl mx-auto">
               <button
                 disabled={currentPage === 1}
                 onClick={() => {
                   setCurrentPage(prev => prev - 1);
                   window.scrollTo({ top: 0, behavior: "smooth" });
                 }}
                 className="px-5 py-2.5 rounded-lg border border-border bg-card hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-body font-semibold text-sm"
               >
                 Sekelumnya
               </button>
               
               <div className="flex items-center gap-2">
                 {[...Array(totalPages)].map((_, i) => (
                   <button
                     key={i}
                     onClick={() => {
                       setCurrentPage(i + 1);
                       window.scrollTo({ top: 0, behavior: "smooth" });
                     }}
                     className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-bold transition-colors ${
                       currentPage === i + 1 
                       ? "bg-primary text-background" 
                       : "bg-card border border-border text-foreground/70 hover:bg-primary/10 hover:border-primary/30"
                     }`}
                   >
                     {i + 1}
                   </button>
                 ))}
               </div>
               
               <button
                 disabled={currentPage === totalPages}
                 onClick={() => {
                   setCurrentPage(prev => prev + 1);
                   window.scrollTo({ top: 0, behavior: "smooth" });
                 }}
                 className="px-5 py-2.5 rounded-lg border border-border bg-card hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-body font-semibold text-sm"
               >
                 Selanjutnya
               </button>
             </div>
          )}
        </>
      )}
    </div>
  );
}
