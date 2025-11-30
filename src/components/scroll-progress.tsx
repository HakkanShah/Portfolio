'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-[100] pointer-events-none">
      <motion.div
        className="absolute top-0 left-0 bottom-0 w-full origin-left bg-gradient-to-r from-[#013871] via-[#E23636] to-[#013871]"
        style={{ scaleX }}
      />
    </div>
  );
};

export default ScrollProgress;
