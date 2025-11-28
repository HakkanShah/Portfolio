'use client';

import { SKILLS } from '@/lib/data';
import AnimatedDiv from './animated-div';
import { motion, AnimatePresence } from 'framer-motion';
import { playSkillSound } from '@/lib/sound';
import { useState } from 'react';
import { Music, Music2, Music3, Music4 } from 'lucide-react';

const SkillsSection = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [musicNotes, setMusicNotes] = useState<{ id: number; icon: any; x: number; y: number }[]>([]);
  const [noteId, setNoteId] = useState(0);

  const musicIcons = [Music, Music2, Music3, Music4];

  const handleSkillHover = (categoryIndex: number, skillIndex: number, skillName: string) => {
    setHoveredSkill(skillName);

    if (!soundEnabled) return;

    // Calculate a unique index for each skill across all categories
    let globalIndex = 0;
    for (let i = 0; i < categoryIndex; i++) {
      globalIndex += SKILLS[i].skills.length;
    }
    globalIndex += skillIndex;

    playSkillSound(globalIndex);

    // Generate ONE music note
    const newNote = {
      id: noteId,
      icon: musicIcons[Math.floor(Math.random() * musicIcons.length)],
      x: Math.random() * 40 - 20, // Random x offset between -20 and 20
      y: 0,
    };

    setMusicNotes(prev => [...prev, newNote]);
    setNoteId(prev => prev + 1);

    // Remove note after animation (3.5 seconds)
    setTimeout(() => {
      setMusicNotes(prev => prev.filter(note => note.id !== newNote.id));
    }, 3500);
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
                      onMouseEnter={() => handleSkillHover(categoryIndex, skillIndex, skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="flex flex-col items-center justify-center gap-2 text-center w-20 h-20 sm:w-24 sm:h-24 bg-background p-2 rounded-lg border-2 border-foreground shadow-md hover:shadow-xl transition-shadow cursor-pointer group relative overflow-visible"
                    >
                      {/* Floating Music Note - Realistic Animation */}
                      <AnimatePresence>
                        {hoveredSkill === skill.name && musicNotes
                          .filter(note => hoveredSkill === skill.name)
                          .slice(-1)
                          .map((note) => {
                            const NoteIcon = note.icon;
                            return (
                              <motion.div
                                key={note.id}
                                initial={{
                                  opacity: 0,
                                  y: 0,
                                  x: 0,
                                  scale: 0.3,
                                  rotate: -20
                                }}
                                animate={{
                                  opacity: [0, 1, 1, 1, 0],
                                  y: [-10, -30, -60, -90, -120],
                                  x: [0, note.x * 0.3, note.x * 0.6, note.x * 0.8, note.x],
                                  scale: [0.3, 0.8, 1.1, 1.2, 0.9],
                                  rotate: [-20, 0, 10, 5, 15]
                                }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{
                                  duration: 3.5,
                                  ease: [0.25, 0.46, 0.45, 0.94],
                                  opacity: {
                                    times: [0, 0.1, 0.5, 0.8, 1],
                                    ease: "easeInOut"
                                  },
                                  y: {
                                    ease: [0.33, 1, 0.68, 1],
                                  },
                                  x: {
                                    ease: "easeInOut"
                                  },
                                  scale: {
                                    times: [0, 0.2, 0.5, 0.7, 1],
                                    ease: "easeOut"
                                  },
                                  rotate: {
                                    ease: "easeInOut"
                                  }
                                }}
                                className="absolute pointer-events-none z-50"
                                style={{
                                  left: '50%',
                                  top: '50%',
                                  color: skill.color || 'var(--primary)',
                                  filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.4))',
                                  transformOrigin: 'center'
                                }}
                              >
                                <NoteIcon className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
                              </motion.div>
                            );
                          })}
                      </AnimatePresence>

                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <IconComponent
                          className="h-7 w-7 sm:h-8 sm:w-8 transition-colors"
                          style={{ color: skill.color }}
                        />
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
