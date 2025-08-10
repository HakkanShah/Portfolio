import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const ComicNavigation = () => {
  const [activeSection, setActiveSection] = useState('home');

  const sections = [
    { id: 'home', label: 'HOME', bubble: 'HERO!' },
    { id: 'about', label: 'ABOUT', bubble: 'STORY!' },
    { id: 'skills', label: 'SKILLS', bubble: 'POWERS!' },
    { id: 'projects', label: 'PROJECTS', bubble: 'WORK!' },
    { id: 'contact', label: 'CONTACT', bubble: 'TEAM UP!' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 comic-panel bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 p-2">
        {sections.map((section) => (
          <div key={section.id} className="relative group">
            <Button
              variant={activeSection === section.id ? "default" : "secondary"}
              size="sm"
              onClick={() => scrollToSection(section.id)}
              className={`
                font-comic-hero text-xs transition-all duration-300 zoom-pow
                ${activeSection === section.id ? 'comic-burst' : ''}
              `}
            >
              {section.label}
            </Button>
            
            {/* Speech Bubble on Hover */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="speech-bubble bg-secondary text-secondary-foreground text-xs font-comic-display px-2 py-1 whitespace-nowrap">
                {section.bubble}
              </div>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default ComicNavigation;