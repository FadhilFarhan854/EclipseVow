"use client";

import { useState } from "react";
import { Target, Flag, Swords, Menu, X, Megaphone } from "lucide-react";

interface FestivalFooterProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const FestivalFooter = ({ activeTab, onChangeTab }: FestivalFooterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const tabs = [
    { id: "mq", label: "MQ Progression", icon: <Flag className="w-5 h-5" /> },
    { id: "boss", label: "Boss Hunt", icon: <Swords className="w-5 h-5" /> },
    { id: "guild", label: "Guild Quest", icon: <Target className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-24 left-6 z-50 flex flex-col items-start">
      {/* Menu Options */}
      <div
        className={`flex flex-col items-start gap-3 mb-3 transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onChangeTab(tab.id);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 justify-start group transition-all duration-300"
              title={tab.label}
            >
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 box-glow-hover flex-shrink-0 ${isActive
                  ? "bg-primary border-primary text-background"
                  : "bg-card border-border text-primary group-hover:bg-primary/20 group-hover:text-primary"
                }`}>
                {tab.icon}
              </div>
              <span className={`bg-card border border-border px-3 py-1.5 rounded-lg text-sm shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 transition-all font-display tracking-wider ${isActive ? "text-primary font-bold" : "text-foreground/70 group-hover:text-primary"
                }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={toggleMenu}
        className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 box-glow-hover group"
        aria-label="Festival Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Megaphone className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default FestivalFooter;
