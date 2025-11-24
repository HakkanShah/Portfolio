'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedTitle = () => {
  const title = "Hakkan";
  const [displayText, setDisplayText] = useState(title);
  const [isHovered, setIsHovered] = useState(false);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovered) {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText(prev => 
          title
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return title[index];
              }
              return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("")
        );

        if (iteration >= title.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    } else {
      setDisplayText(title);
    }

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <motion.div
      className="relative cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Main Text */}
        <h1 className="font-headline text-3xl font-bold tracking-wider text-primary relative z-10">
          {displayText}
        </h1>
        
        {/* Glitch Layers (Visible on Hover) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-100">
          <h1 className="font-headline text-3xl font-bold tracking-wider text-red-500 absolute top-0 left-[2px] opacity-70 animate-pulse">
            {displayText}
          </h1>
          <h1 className="font-headline text-3xl font-bold tracking-wider text-blue-500 absolute top-0 -left-[2px] opacity-70 animate-pulse delay-75">
            {displayText}
          </h1>
        </div>

        {/* Underline Animation */}
        <motion.div 
          className="absolute -bottom-1 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300 ease-out"
        />
      </div>
    </motion.div>
  );
};

export default AnimatedTitle;
