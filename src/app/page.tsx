import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import ProjectsSection from '@/components/projects-section';
import ExperienceSection from '@/components/experience-section';
import SkillsSection from '@/components/skills-section';
import EducationSection from '@/components/education-section';
import CertificationsSection from '@/components/certifications-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';
import FloatingElements from '@/components/floating-elements';
import ScrollProgress from '@/components/scroll-progress';
import CursorFollower from '@/components/cursor-follower';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      <FloatingElements />
      <ScrollProgress />
      <CursorFollower />
      <Header />
      <main className="flex-1 relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
