'use client';

import { SKILLS } from '@/lib/data';
import AnimatedDiv from './animated-div';
import { motion } from 'framer-motion';
import { playSkillSound } from '@/lib/sound';
import { useState } from 'react';

const SkillsSection = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSkillHover = (categoryIndex: number, skillIndex: number) => {
    if (!soundEnabled) return;
    
    // Calculate a unique index for each skill across all categories
    let globalIndex = 0;
    for (let i = 0; i < categoryIndex; i++) {
      globalIndex += SKILLS[i].skills.length;
    }
    globalIndex += skillIndex;
    
    playSkillSound(globalIndex);
  };

  return (
    <section id="skills" className="section-padding bg-muted/30 dark:bg-muted/10 border-y-4 border-foreground">
      <div className="section-container">
        <AnimatedDiv className="text-center mb-12" variant="scale">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-wider">
              My Arsenal
            </h2>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-2xl hover:scale-110 transition-transform"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground px-4">
            Powers and tools I use to build amazing things.
            <span className="block text-sm mt-2 text-accent">
              {soundEnabled ? '🎵 Hover over skills to hear marimba notes!' : ''}
            </span>
          </p>
        </AnimatedDiv>

        <div className="space-y-12">
          {SKILLS.map((category, categoryIndex) => (
            <AnimatedDiv key={category.name} delay={categoryIndex * 100} variant="slide">
              <h3 className="font-headline text-2xl sm:text-3xl text-accent tracking-wider mb-6 text-center">
                {category.name}
              </h3>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {category.skills.map((skill: any, skillIndex: number) => {
                  const IconComponent = skill.icon;
                  
                  // Skip if icon is undefined
                  if (!IconComponent) {
                    console.warn(`Missing icon for skill: ${skill.name}`);
                    return null;
                  }

                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: skillIndex * 0.05,
                        duration: 0.4,
                        ease: 'easeOut',
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.1,
                        transition: { type: 'spring', stiffness: 400, damping: 10 },
                      }}
                      onMouseEnter={() => handleSkillHover(categoryIndex, skillIndex)}
                      className="flex flex-col items-center justify-center gap-2 text-center w-20 h-20 sm:w-24 sm:h-24 bg-background p-2 rounded-lg border-2 border-foreground shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <IconComponent className="h-7 w-7 sm:h-8 sm:w-8 text-foreground/80 group-hover:text-primary transition-colors" />
                      </motion.div>
                      <span className="text-[10px] sm:text-xs font-bold text-foreground leading-tight">
                        {skill.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
