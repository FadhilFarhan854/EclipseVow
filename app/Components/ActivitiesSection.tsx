import { Sword, Compass, Calendar, Trophy } from "lucide-react";

const activities = [
  {
    icon: Sword,
    title: "Raids",
    description: "We march into the abyss together, claiming victories from the jaws of ancient terrors.",
  },
  {
    icon: Compass,
    title: "Exploration",
    description: "Uncharted lands and forgotten ruins call to us. Every horizon hides a secret.",
  },
  {
    icon: Calendar,
    title: "Events",
    description: "From lunar festivals to shadow tournaments, our gatherings forge unbreakable bonds.",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "We chronicle every conquest, every milestone — proof that the Vow endures.",
  },
];

const ActivitiesSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center text-glow text-primary mb-4 tracking-wider">
          Paths We Walk
        </h2>
        <div className="divider-glow w-48 mx-auto mb-12" />

        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.title}
              className="bg-card border border-border rounded-lg p-8 box-glow-hover group cursor-default"
            >
              <activity.icon className="w-8 h-8 text-primary mb-4 group-hover:text-glow transition-all duration-500" />
              <h3 className="font-display text-lg tracking-wider text-foreground mb-3">
                {activity.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
