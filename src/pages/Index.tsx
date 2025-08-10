import ComicNavigation from '@/components/ComicNavigation';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';

const Index = () => {
  return (
    <div className="relative">
      {/* Comic Navigation */}
      <ComicNavigation />
      
      {/* Page Sections */}
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Comic Footer */}
      <footer className="comic-panel bg-foreground text-background py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="font-comic mb-2">
            © 2024 Hakkan Parbej Shah - The Full-Stack Hero
          </p>
          <div className="font-comic-display text-sm text-accent">
            "With great code comes great responsibility!" 🦸‍♂️
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;