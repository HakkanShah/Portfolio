'use client';

import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  life: number;
  vx: number; // Velocity X for glitch
  vy: number; // Velocity Y for glitch
}

interface SpiderWeb {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  life: number;
  rotation: number;
}

const CursorFollower = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trail = useRef<Point[]>([]);
  const webs = useRef<SpiderWeb[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const glitchIntensity = useRef(0);
  const spiderSenseFrame = useRef(0);

  useEffect(() => {
    // Run on all devices


    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createWeb = (x: number, y: number) => {
      // Smaller web on mobile devices
      const isMobile = window.innerWidth < 768;
      const baseSize = isMobile ? 60 : 100;
      const randomSize = isMobile ? 20 : 50;

      webs.current.push({
        x,
        y,
        size: 0,
        maxSize: baseSize + Math.random() * randomSize,
        life: 1.0,
        rotation: Math.random() * Math.PI * 2,
      });
      // Trigger glitch on click
      glitchIntensity.current = 10;
    };

    const updateTrail = () => {
      trail.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        life: 1.0,
        vx: (Math.random() - 0.5) * glitchIntensity.current,
        vy: (Math.random() - 0.5) * glitchIntensity.current
      });

      for (let i = trail.current.length - 1; i >= 0; i--) {
        const p = trail.current[i];
        p.life -= 0.05;
        if (p.life <= 0) {
          trail.current.splice(i, 1);
        }
      }
    };

    const updateWebs = () => {
      for (let i = webs.current.length - 1; i >= 0; i--) {
        const w = webs.current[i];
        w.size += (w.maxSize - w.size) * 0.1; // Ease out expansion
        w.life -= 0.015;

        if (w.life <= 0) {
          webs.current.splice(i, 1);
        }
      }
    };

    const drawSpiderSense = (x: number, y: number) => {
      if (!isHovering.current) return;

      spiderSenseFrame.current += 0.2;
      const count = 5;
      const radius = 30;

      ctx.save();
      ctx.translate(x, y);

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.sin(spiderSenseFrame.current) * 0.5;
        const wiggle = Math.sin(spiderSenseFrame.current * 2 + i) * 5;

        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        ctx.lineTo(Math.cos(angle) * (radius + 15 + wiggle), Math.sin(angle) * (radius + 15 + wiggle));
        ctx.strokeStyle = '#E23636';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawWeb = (web: SpiderWeb) => {
      ctx.save();
      ctx.translate(web.x, web.y);
      ctx.rotate(web.rotation);
      ctx.globalAlpha = web.life;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;

      // Draw radials (spokes)
      const spokes = 8;
      for (let i = 0; i < spokes; i++) {
        const angle = (Math.PI * 2 / spokes) * i;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * web.size, Math.sin(angle) * web.size);
        ctx.stroke();
      }

      // Draw spirals
      const rings = 5;
      for (let i = 1; i <= rings; i++) {
        const radius = (web.size / rings) * i;
        ctx.beginPath();
        for (let j = 0; j <= spokes; j++) {
          const angle = (Math.PI * 2 / spokes) * j;
          // Add slight curve/sag to web
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (j === 0) ctx.moveTo(x, y);
          else {
            // Quadratic curve for sag
            const prevAngle = (Math.PI * 2 / spokes) * (j - 1);
            const midAngle = (prevAngle + angle) / 2;
            const sagFactor = 0.8; // How much the web sags inwards
            const midRadius = radius * sagFactor;
            const cx = Math.cos(midAngle) * midRadius;
            const cy = Math.sin(midAngle) * midRadius;
            ctx.quadraticCurveTo(cx, cy, x, y);
          }
        }
        ctx.stroke();
      }

      ctx.restore();
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Reduce glitch intensity over time
      if (glitchIntensity.current > 0) {
        glitchIntensity.current *= 0.9;
      }

      // Draw Webs (Behind everything)
      webs.current.forEach(drawWeb);

      // Helper to draw trail with offset (RGB Split)
      const drawTrailLayer = (offsetX: number, offsetY: number, color: string) => {
        if (trail.current.length > 1) {
          ctx.beginPath();
          ctx.moveTo(trail.current[0].x + offsetX, trail.current[0].y + offsetY);

          for (let i = 1; i < trail.current.length; i++) {
            const p = trail.current[i];
            // Apply glitch jitter
            const jitterX = (Math.random() - 0.5) * glitchIntensity.current;
            const jitterY = (Math.random() - 0.5) * glitchIntensity.current;

            ctx.lineTo(p.x + offsetX + jitterX, p.y + offsetY + jitterY);
          }

          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      };

      // Draw RGB Split Trails
      ctx.globalCompositeOperation = 'screen'; // Blend mode for RGB addition
      drawTrailLayer(-2, 0, 'rgba(255, 0, 0, 0.5)'); // Red offset
      drawTrailLayer(2, 0, 'rgba(0, 255, 255, 0.5)'); // Cyan offset
      drawTrailLayer(0, 0, 'rgba(255, 255, 255, 0.8)'); // Main white trail
      ctx.globalCompositeOperation = 'source-over'; // Reset blend mode

      // Spider-Sense Animation
      drawSpiderSense(mouse.current.x, mouse.current.y);
    };

    const animate = () => {
      updateTrail();
      updateWebs();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Check if hovering over terminal (or any element with no-custom-cursor class)
      const target = e.target as HTMLElement;
      if (target.closest('.no-custom-cursor')) {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = '0';
        }
      } else {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = '1';
        }
      }
    };

    const handleMouseDown = () => {
      // Don't create effects if hidden
      if (canvasRef.current && canvasRef.current.style.opacity === '0') return;

      createWeb(mouse.current.x, mouse.current.y);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer')
      ) {
        isHovering.current = true;
      } else {
        isHovering.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;

        // Check for terminal on mobile too
        const target = e.target as HTMLElement;
        if (target.closest('.no-custom-cursor')) {
          if (canvasRef.current) canvasRef.current.style.opacity = '0';
        } else {
          if (canvasRef.current) canvasRef.current.style.opacity = '1';
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;

        // Don't create effects if hidden
        if (canvasRef.current && canvasRef.current.style.opacity === '0') return;

        createWeb(mouse.current.x, mouse.current.y);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('mouseover', handleMouseOver);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] block transition-opacity duration-200"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default CursorFollower;
