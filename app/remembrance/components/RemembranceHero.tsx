"use client";

import { useState } from "react";
import FloatingParticles from "../../Components/FloatingParticles";
import { Camera } from "lucide-react";
import AddMemoryModal from "./AddMemoryModal";


interface RemembranceHeroProps {
  onMemoryAdded: () => void;
}

const RemembranceHero = ({ onMemoryAdded }: RemembranceHeroProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    onMemoryAdded();
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background — responsive images */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: "url(/asset/Remebrance.webp)" }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
          style={{ backgroundImage: "url(/asset/eclipse-moon.jpg)" }}
        />
        <div className="absolute inset-0 bg-background/50" />
        <FloatingParticles />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider text-glow-strong text-primary mb-2">
            Eclipse Vow
          </h1>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wider text-foreground/80 mb-6">
            Remembrance
          </h2>
          <div className="divider-glow w-48 mx-auto mb-6" />
          <p className="font-body text-lg md:text-xl text-foreground/60 italic tracking-wide leading-relaxed mb-4">
            &quot;Even we&apos;re not here anymore, the memories remain.&quot;
          </p>
          <p className="font-body text-sm md:text-base text-foreground/40 leading-relaxed">
            Para Vowbearer tak hanya bertempur bersama — mereka juga tertawa, berpetualang,
            dan menciptakan kenangan. Di galeri ini tersimpan fragmen-fragmen waktu yang mereka
            abadikan: bukti bahwa di balik setiap pertempuran, ada ikatan yang tak bisa dipatahkan.
            Sebuah sumpah bukan hanya soal kekuatan — tapi soal mengingat.
          </p>

          {/* Add Memory Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-12 px-6 py-3 rounded-lg border bg-[#2a2d3dbd] border-primary/40 hover:border-primary/80 hover:bg-primary/10 text-primary hover:text-primary/90 transition-all cursor-pointer flex items-center gap-2 mx-auto font-display tracking-wider text-sm md:text-base group hover:shadow-lg hover:shadow-primary/20"
          >
            <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add Memory
          </button>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
      </section>

      {/* Modal */}
      <AddMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default RemembranceHero;
