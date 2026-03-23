"use client";

import { useState } from "react";
import FestivalHero from "./components/FestivalHero";
import FestivalSection from "./components/FestivalSection";
import FestivalFooter from "./components/FestivalFooter";


export default function FestivalPage() {
  const [activeTab, setActiveTab] = useState("mq"); // 'mq', 'boss', 'guild'

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col relative">
      <FestivalHero />
      <FestivalSection activeTab={activeTab} />
      <FestivalFooter activeTab={activeTab} onChangeTab={setActiveTab} />
    </main>
  );
}
