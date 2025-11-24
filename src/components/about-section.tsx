'use client';

import { ABOUT_ME } from '@/lib/data';
import AnimatedDiv from './animated-div';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-accent/10 dark:bg-accent/5 border-y-4 border-foreground relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 sm:w-40 sm:h-40 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 sm:w-48 sm:h-48 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <div className="section-container text-center relative z-10">
        <AnimatedDiv className="relative max-w-4xl mx-auto p-6 sm:p-8 bg-background rounded-lg border-4 border-foreground shadow-lg" variant="scale">
          <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 bg-primary text-primary-foreground px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg border-2 border-foreground transform -rotate-6">
            <h2 className="font-headline text-2xl sm:text-3xl tracking-wider">About Me</h2>
          </div>
          <motion.p
            className="mt-6 text-base sm:text-lg text-foreground/90 leading-relaxed text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {ABOUT_ME}
          </motion.p>
        </AnimatedDiv>
      </div>
    </section>
  );
};

export default AboutSection;
