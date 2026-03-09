import HeroSection from "./Components/HeroSection";
import LoreSection from "./Components/LoreSection";
import MembersSection from "./Components/MembersSection";
import OathSection from "./Components/OathSection";
import ActivitiesSection from "./Components/ActivitiesSection";
import JoinSection from "./Components/JoinSection";
import GuildFooter from "./Components/GuildFooter";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <LoreSection />
      <div className="divider-glow max-w-md mx-auto" />
      <MembersSection />
      <div className="divider-glow max-w-md mx-auto" />
      <OathSection />
      <div className="divider-glow max-w-md mx-auto" />
      <ActivitiesSection />
      <div className="divider-glow max-w-md mx-auto" />
      <JoinSection />
      <GuildFooter />
    </div>
  );
}
