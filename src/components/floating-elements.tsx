'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate random floating shapes
    const generatedShapes: FloatingShape[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as FloatingShape['type'],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setShapes(generatedShapes);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    // Only add mouse tracking on desktop
    if (window.innerWidth >= 768) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const renderShape = (shape: FloatingShape) => {
    const baseClasses = "absolute opacity-10 dark:opacity-5";
    const colorClasses = shape.id % 2 === 0 ? "bg-primary" : "bg-accent";

    switch (shape.type) {
      case 'circle':
        return (
          <div
            className={`${baseClasses} ${colorClasses} rounded-full`}
            style={{ width: shape.size, height: shape.size }}
          />
        );
      case 'square':
        return (
          <div
            className={`${baseClasses} ${colorClasses} rounded-lg rotate-45`}
            style={{ width: shape.size, height: shape.size }}
          />
        );
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
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          initial={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, shape.id % 2 === 0 ? 20 : -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "linear",
          }}
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {renderShape(shape)}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
