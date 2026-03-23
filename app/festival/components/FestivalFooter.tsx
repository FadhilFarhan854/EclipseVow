"use client";

interface FestivalFooterProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const FestivalFooter = ({ activeTab, onChangeTab }: FestivalFooterProps) => {
  const tabs = [
    { id: "mq", label: "MQ Progression" },
    { id: "boss", label: "Boss Hunt" },
    { id: "guild", label: "Guild Quest" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-primary/20 z-40">
      <div className="max-w-4xl mx-auto flex justify-around items-center h-20 px-2 md:px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
                isActive ? "text-primary scale-105 md:scale-110" : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              <div className={`h-1 w-8 md:w-16 rounded-full transition-all duration-300 ${isActive ? "bg-primary" : "bg-transparent"}`} />
              <span className="font-display text-xs md:text-sm tracking-widest uppercase font-bold text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FestivalFooter;
