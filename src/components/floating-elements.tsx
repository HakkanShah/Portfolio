'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';

interface FloatingShape {
  id: number;
  type: 'circle' | 'square' | 'triangle';
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const FloatingElements = () => {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  // Optimized parallax transform - disabled for reduced motion
  const x = useTransform(mouseX, [-1, 1], shouldReduceMotion ? [0, 0] : [-20, 20]);
  const y = useTransform(mouseY, [-1, 1], shouldReduceMotion ? [0, 0] : [-20, 20]);

  useEffect(() => {
    // Reduce shape count on mobile for performance
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 6 : 15;

    const generatedShapes: FloatingShape[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as FloatingShape['type'],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (isMobile ? 40 : 60) + 20,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setShapes(generatedShapes);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position from -1 to 1
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseX, mouseY]);

  const renderShape = (shape: FloatingShape) => {
    const baseClasses = "absolute opacity-10 dark:opacity-5";
    const colorClasses = shape.id % 2 === 0 ? "bg-primary" : "bg-accent";
    const style = { width: shape.size, height: shape.size };

    switch (shape.type) {
      case 'circle':
        return <div className={`${baseClasses} ${colorClasses} rounded-full`} style={style} />;
      case 'square':
        return <div className={`${baseClasses} ${colorClasses} rounded-lg rotate-45`} style={style} />;
      case 'triangle':
        return (
          <div
            className={`${baseClasses} ${colorClasses}`}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid currentColor`,
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute inset-0"
        style={{ x, y }}
      >
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={shouldReduceMotion ? "absolute" : "absolute animate-float will-change-transform"}
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              animationDuration: `${shape.duration}s`,
              animationDelay: `${shape.delay}s`,
            }}
          >
            <div
              className={shouldReduceMotion ? "" : "animate-rotate-slow"}
              style={{ animationDuration: `${shape.duration * 1.5}s` }}
            >
              {renderShape(shape)}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FloatingElements;
