'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  disableOnMobile?: boolean;
}

const Card3D = ({ children, className = '', intensity = 15, disableOnMobile = true }: Card3DProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    // Check if mobile and should disable
    if (disableOnMobile && window.innerWidth < 768) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  if (disableOnMobile && isMobile) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Shine effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none hidden md:block"
          style={{
            background: `radial-gradient(circle at ${(mouseXSpring.get() + 0.5) * 100}% ${(mouseYSpring.get() + 0.5) * 100}%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
            transform: 'translateZ(50px)',
          }}
        />
      )}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card3D;
