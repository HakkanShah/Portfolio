import { Card } from '@/components/ui/card';
import powBubble from '@/assets/pow-bubble.png';

const AboutSection = () => {
  const storyPanels = [
    {
      title: "CHAPTER 1: THE AWAKENING",
      content: "Once upon a time, in a world of endless possibilities, a young dreamer discovered the magical powers of code...",
      icon: "💻"
    },
    {
      title: "CHAPTER 2: THE TRAINING",
      content: "Through countless nights of debugging and learning, our hero mastered the ancient arts of JavaScript, React, and Node.js...",
      icon: "🎓"
    },
    {
      title: "CHAPTER 3: THE MISSION",
      content: "Now, armed with full-stack superpowers, Hakkan fights bugs, creates amazing web experiences, and helps businesses thrive online!",
      icon: "🚀"
    }
  ];

  return (
    <section id="about" className="min-h-screen py-20 relative">
      {/* Floating Comic Effect */}
      <img 
        src={powBubble} 
        alt="POW!" 
        className="absolute top-10 right-10 w-32 h-32 animate-comic-float opacity-60" 
      />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-comic-hero text-5xl md:text-6xl text-primary mb-6">
            MY ORIGIN STORY
          </h2>
          <div className="speech-bubble bg-muted text-muted-foreground max-w-2xl mx-auto">
            <p className="font-comic text-lg">
              Every superhero has an origin story. Here's how I became the Full-Stack Hero the web needs! 
              🦸‍♂️✨
            </p>
          </div>
        </div>

        {/* Comic Strip Style Story */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {storyPanels.map((panel, index) => (
            <Card 
              key={index} 
              className={`comic-panel p-6 hover:comic-shake transition-all duration-300 ${
                index === 1 ? 'md:-translate-y-4' : ''
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{panel.icon}</div>
                <h3 className="font-comic-display text-xl text-accent mb-3">
                  {panel.title}
                </h3>
              </div>
              <p className="font-comic text-card-foreground leading-relaxed">
                {panel.content}
              </p>
              
              {/* Panel Number */}
              <div className="absolute top-2 left-2 bg-foreground text-background w-8 h-8 rounded-full flex items-center justify-center">
                <span className="font-comic-hero text-sm">{index + 1}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Character Stats */}
        <div className="comic-panel bg-secondary text-secondary-foreground p-8 max-w-4xl mx-auto">
          <h3 className="font-comic-hero text-3xl text-center text-accent mb-8">
            HERO STATS & ABILITIES
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-comic-display text-xl mb-4 text-foreground">Personal Info:</h4>
              <ul className="font-comic space-y-2">
                <li><strong>Hero Name:</strong> The Full-Stack Defender</li>
                <li><strong>Real Identity:</strong> Hakkan Parbej Shah</li>
                <li><strong>Superpower:</strong> Transforming ideas into reality</li>
                <li><strong>Mission:</strong> Creating amazing web experiences</li>
                <li><strong>Base of Operations:</strong> The Code Cave</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-comic-display text-xl mb-4 text-foreground">Special Abilities:</h4>
              <ul className="font-comic space-y-2">
                <li>⚡ Lightning-fast React development</li>
                <li>🛡️ Bulletproof Node.js backends</li>
                <li>🎨 Pixel-perfect UI design</li>
                <li>🔍 Debug vision (finds bugs instantly)</li>
                <li>☕ Coffee-powered all-nighters</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <div className="bg-accent text-accent-foreground inline-block px-6 py-3 rotate-1 transform comic-panel-inset">
              <span className="font-comic-display">
                "WITH GREAT CODE COMES GREAT RESPONSIBILITY!"
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;