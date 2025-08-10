import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import bamBubble from '@/assets/bam-bubble.png';

const SkillsSection = () => {
  const skillCategories = [
    {
      title: "FRONTEND SUPERPOWERS",
      color: "primary",
      skills: [
        { name: "React", level: "MASTER", icon: "⚛️" },
        { name: "TypeScript", level: "EXPERT", icon: "📘" },
        { name: "JavaScript", level: "LEGENDARY", icon: "💛" },
        { name: "HTML/CSS", level: "ULTIMATE", icon: "🎨" },
        { name: "Tailwind CSS", level: "NINJA", icon: "🌊" },
        { name: "Next.js", level: "EXPERT", icon: "▲" }
      ]
    },
    {
      title: "BACKEND ABILITIES",
      color: "accent",
      skills: [
        { name: "Node.js", level: "MASTER", icon: "🟢" },
        { name: "Express", level: "EXPERT", icon: "🚀" },
        { name: "MongoDB", level: "PRO", icon: "🍃" },
        { name: "PostgreSQL", level: "EXPERT", icon: "🐘" },
        { name: "REST APIs", level: "MASTER", icon: "🔗" },
        { name: "GraphQL", level: "SKILLED", icon: "📊" }
      ]
    },
    {
      title: "HERO TOOLS & WEAPONS",
      color: "secondary",
      skills: [
        { name: "Git", level: "MASTER", icon: "🔀" },
        { name: "Docker", level: "EXPERT", icon: "🐳" },
        { name: "AWS", level: "SKILLED", icon: "☁️" },
        { name: "Jest", level: "PRO", icon: "🧪" },
        { name: "Figma", level: "ARTIST", icon: "🎨" },
        { name: "VS Code", level: "WIZARD", icon: "💻" }
      ]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "LEGENDARY": return "bg-accent text-accent-foreground";
      case "ULTIMATE": return "bg-primary text-primary-foreground";
      case "MASTER": return "bg-destructive text-destructive-foreground";
      case "EXPERT": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="skills" className="min-h-screen py-20 relative">
      {/* Floating Comic Effects */}
      <img 
        src={bamBubble} 
        alt="BAM!" 
        className="absolute top-20 left-8 w-28 h-28 animate-comic-float opacity-50" 
      />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-comic-hero text-5xl md:text-6xl text-primary mb-6">
            SUPERHERO ABILITIES
          </h2>
          <div className="speech-bubble bg-muted text-muted-foreground max-w-2xl mx-auto">
            <p className="font-comic text-lg">
              Every superhero needs an arsenal of powers! Here are my coding superpowers, 
              each earned through epic battles with bugs and late-night coding sessions! 💪⚡
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <Card 
              key={categoryIndex}
              className="comic-panel p-6 hover:comic-shake transition-all duration-300"
            >
              <div className="text-center mb-6">
                <h3 className="font-comic-hero text-2xl text-accent mb-4">
                  {category.title}
                </h3>
                <div className="w-full h-1 bg-gradient-to-r from-primary to-accent rounded"></div>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skillIndex}
                    className="flex items-center justify-between p-3 comic-panel-inset hover:zoom-pow transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="font-comic font-semibold text-card-foreground">
                        {skill.name}
                      </span>
                    </div>
                    
                    <Badge className={`font-comic-display text-xs ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Category Icon */}
              <div className="absolute top-2 right-2 comic-burst w-12 h-12 rounded-full flex items-center justify-center">
                <span className="font-comic-hero text-xs text-accent-foreground">
                  {categoryIndex + 1}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Power Level Indicator */}
        <div className="mt-16 text-center">
          <div className="comic-panel bg-primary text-primary-foreground p-8 max-w-2xl mx-auto">
            <h3 className="font-comic-hero text-3xl mb-4">OVERALL POWER LEVEL</h3>
            <div className="relative">
              <div className="bg-primary-foreground h-6 rounded-full overflow-hidden">
                <div 
                  className="bg-accent h-full rounded-full transition-all duration-1000 ease-out animate-burst-appear"
                  style={{ width: "92%" }}
                ></div>
              </div>
              <div className="absolute right-0 -top-8">
                <span className="font-comic-display text-2xl text-accent">92%</span>
              </div>
            </div>
            <p className="font-comic mt-4">
              "IT'S OVER 9000!" - Vegeta (probably talking about my commit count)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;