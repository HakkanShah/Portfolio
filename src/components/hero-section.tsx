'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_LINKS } from '@/lib/data';
import AnimatedDiv from './animated-div';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const HeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Turning Ideas into Reality – One Line of Code at a Time";
  const imageRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  });

  // Typing animation
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || window.innerWidth < 768) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleImageMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="home" className="section-padding border-b-4 border-foreground overflow-hidden relative">
      <div className="section-container grid md:grid-cols-2 gap-10 items-center min-h-[70vh]">
        <div className="text-center md:text-left">
          <AnimatedDiv variant="scale">
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-primary drop-shadow-[2px_2px_0_hsl(var(--foreground))]">
              Hakkan Parbej Shah
            </h1>
          </AnimatedDiv>
          <AnimatedDiv delay={200} variant="slideLeft">
            <p className="mt-4 font-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-accent">
              Full Stack Developer
            </p>
          </AnimatedDiv>
          <AnimatedDiv delay={400} className="mt-8 max-w-xl mx-auto md:mx-0">
            <div className="relative p-4 sm:p-6 bg-background rounded-lg border-2 border-foreground shadow-lg">
              <p className="text-base sm:text-lg text-foreground/90 italic min-h-[3rem] sm:min-h-[4rem]">
                "{typedText}
                <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse" />
                "
              </p>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-background border-l-2 border-t-2 border-foreground transform rotate-45 md:left-8"></div>
            </div>
          </AnimatedDiv>
          <AnimatedDiv delay={600} className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6">
            <Link href="/Hakkan_Parbej_Shah_Resume.pdf" download="Hakkan_Parbej_Shah_Resume.pdf" passHref>
              <MagneticButton>
                <Button className="font-headline text-lg sm:text-xl tracking-wider border-2 border-foreground shadow-md hover:shadow-xl transition-all">
                  <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  My Resume
                </Button>
              </MagneticButton>
            </Link>
            <div className="flex items-center space-x-3 sm:space-x-4">
              {SOCIAL_LINKS.map((social, index) => (
                <AnimatedDiv key={social.name} delay={700 + index * 100} variant="scale">
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <MagneticButton strength={0.3}>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        aria-label={social.name} 
                        className="border-2 border-foreground hover:bg-primary/10 transition-all hover:scale-110"
                      >
                        <social.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                    </MagneticButton>
                  </Link>
                </AnimatedDiv>
              ))}
            </div>
          </AnimatedDiv>
        </div>
        <AnimatedDiv delay={400} className="relative hidden md:flex justify-center items-center">
          <div className="absolute bg-accent w-60 h-60 sm:w-80 sm:h-80 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <motion.div
            ref={imageRef}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-lg overflow-hidden border-4 border-foreground shadow-2xl cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-lg blur opacity-75 animate-gradient"></div>
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-background">
              <Image
                src="https://github.com/HakkanShah.png"
                alt="Hakkan Parbej Shah"
                width={320}
                height={320}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </motion.div>
        </AnimatedDiv>
      </div>
    </section>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, strength = 0.5 }: { children: React.ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || window.innerWidth < 768) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

export default HeroSection;
