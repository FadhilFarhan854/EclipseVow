import GuideHero from "./components/GuideHero";
import GuideContent from "./components/GuideContent";
import GuildFooter from "@/app/Components/GuildFooter";

export default function GuidePage() {
  return (
    <div>
      <GuideHero />
      <div className="divider-glow max-w-md mx-auto" />
      <GuideContent />
      <GuildFooter />
    </div>
  );
}
