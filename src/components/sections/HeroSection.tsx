import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-comic.jpg';
import bamBubble from '@/assets/bam-bubble.png';
import wowBubble from '@/assets/wow-bubble.png';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Comic Effects */}
      <div className="absolute inset-0 halftone-pattern opacity-10"></div>
      
      {/* Floating Comic Bubbles */}
      <img 
        src={bamBubble} 
        alt="BAM!" 
        className="absolute top-20 left-10 w-24 h-24 animate-comic-float opacity-70" 
        style={{ animationDelay: '0s' }}
      />
      <img 
        src={wowBubble} 
        alt="WOW!" 
        className="absolute top-32 right-16 w-20 h-20 animate-comic-float opacity-70" 
        style={{ animationDelay: '1s' }}
      />

      <div className="container mx-auto px-4 text-center">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Hero Text */}
          <div className={`space-y-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="relative">
              <h1 className="font-comic-hero text-6xl md:text-8xl text-primary mb-4 drop-shadow-lg">
                HAKKAN
              </h1>
              <div className="absolute -right-8 -top-4 bg-accent text-accent-foreground px-4 py-2 rotate-12 transform comic-panel-inset">
                <span className="font-comic-display text-sm">FULL STACK</span>
              </div>
            </div>

            <div className="speech-bubble bg-secondary text-secondary-foreground max-w-md mx-auto">
              <p className="font-comic text-lg">
                🦸‍♂️ Coding superhero by day, debug detective by night! 
                Ready to save the web with React, Node.js, and epic coffee powers!
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="default" 
                size="lg" 
                onClick={scrollToAbout}
                className="font-comic-hero comic-burst zoom-pow"
              >
                MY ORIGIN STORY
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-comic-hero zoom-pow"
              >
                SEE MY ADVENTURES
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`relative ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="comic-panel overflow-hidden">
              <img 
                src={heroImage} 
                alt="Hakkan as Full Stack Hero" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Action Text Overlay */}
            <div className="absolute bottom-4 right-4 bg-accent text-accent-foreground px-3 py-1 rotate-3 transform">
              <span className="font-comic-display text-sm">FULL STACK HERO!</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToAbout}
            className="flex flex-col items-center gap-2 font-comic text-muted-foreground hover:text-foreground"
          >
            <span className="text-xs">SCROLL FOR MORE</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
