'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { motion, Variants } from 'framer-motion';

type AnimatedDivProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'fade' | 'slide' | 'scale' | 'slideLeft' | 'slideRight';
  duration?: number;
  as?: keyof JSX.IntrinsicElements;
};

const AnimatedDiv: React.FC<AnimatedDivProps> = ({ 
  children, 
  className, 
  delay = 0, 
  variant = 'slide',
  duration = 0.6,
  as = 'div' 
}) => {
  const variants: Record<string, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slide: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 },
    },
    slideRight: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  const MotionComponent = motion[as as keyof typeof motion] as any;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants[variant]}
      transition={{
        duration,
        delay: delay / 1000,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  );
};

export default AnimatedDiv;
