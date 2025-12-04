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
  targetSize: number; // For elastic animation
  velocity: number;   // For elastic animation
  life: number;
  rotation: number;
  spokeAngles: number[]; // Random angles for organic look
  ringDistances: number[]; // Random distances for organic look
}

const CursorFollower = () => {
  // ... refs ...
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trail = useRef<Point[]>([]);
  const webs = useRef<SpiderWeb[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const glitchIntensity = useRef(0);
  const spiderSenseFrame = useRef(0);

  const touchStartPos = useRef({ x: 0, y: 0 });
  const isScrolling = useRef(false);
  const lastTouchTime = useRef(0);

  useEffect(() => {
    // ... setup ...
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
      const isMobile = window.innerWidth < 768;
      // Reduced sizes by ~30%
      const baseSize = isMobile ? 40 : 70;
      const randomSize = isMobile ? 15 : 30;
      const targetSize = baseSize + Math.random() * randomSize;

      // Generate organic structure
      const spokeCount = Math.floor(Math.random() * 5) + 8; // 8-12 spokes
      const spokeAngles = [];
      for (let i = 0; i < spokeCount; i++) {
        // Add jitter to perfect angles
        const baseAngle = (Math.PI * 2 / spokeCount) * i;
        const jitter = (Math.random() - 0.5) * 0.5; // +/- 0.25 radians
        spokeAngles.push(baseAngle + jitter);
      }

      const ringCount = 5;
      const ringDistances = [];
      for (let i = 1; i <= ringCount; i++) {
        // Non-uniform ring spacing
        const progress = i / ringCount;
        const variation = (Math.random() - 0.5) * 0.1;
        ringDistances.push(progress + variation);
      }

      webs.current.push({
        x,
        y,
        size: 0,
        targetSize,
        velocity: 0,
        life: 1.0,
        rotation: Math.random() * Math.PI * 2,
        spokeAngles,
        ringDistances,
      });
      glitchIntensity.current = 10;
    };

    const updateWebs = () => {
      for (let i = webs.current.length - 1; i >= 0; i--) {
        const w = webs.current[i];

        // Elastic spring animation
        const tension = 0.15;
        const damping = 0.75;
        const force = (w.targetSize - w.size) * tension;
        w.velocity += force;
        w.velocity *= damping;
        w.size += w.velocity;

        w.life -= 0.015;

        if (w.life <= 0) {
          webs.current.splice(i, 1);
        }
      }
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

      // Silk glow effect
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 0.8; // Thinner, more realistic lines

      // Draw organic spokes
      web.spokeAngles.forEach(angle => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * web.size, Math.sin(angle) * web.size);
        ctx.stroke();
      });

      // Draw organic spirals
      web.ringDistances.forEach(dist => {
        const radius = web.size * dist;
        ctx.beginPath();

        web.spokeAngles.forEach((angle, j) => {
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            // Quadratic curve for sag
            const prevAngle = web.spokeAngles[j - 1];
            const midAngle = (prevAngle + angle) / 2;

            // Calculate mid-point with sag
            const sagFactor = 0.85; // Less sag for tighter web
            const midRadius = radius * sagFactor;
            const cx = Math.cos(midAngle) * midRadius;
            const cy = Math.sin(midAngle) * midRadius;

            ctx.quadraticCurveTo(cx, cy, x, y);
          }
        });

        // Close the loop
        const firstAngle = web.spokeAngles[0];
        const lastAngle = web.spokeAngles[web.spokeAngles.length - 1];
        const midAngle = (lastAngle + firstAngle + Math.PI * 2) / 2;
        const radiusFirst = web.size * dist;
        const xFirst = Math.cos(firstAngle) * radiusFirst;
        const yFirst = Math.sin(firstAngle) * radiusFirst;

        const sagFactor = 0.85;
        const midRadius = radius * sagFactor;
        const cx = Math.cos(midAngle) * midRadius;
        const cy = Math.sin(midAngle) * midRadius;

        ctx.quadraticCurveTo(cx, cy, xFirst, yFirst);
        ctx.stroke();

        // Draw "nodes" (sticky glue points) at intersections
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        web.spokeAngles.forEach(angle => {
          const nx = Math.cos(angle) * radius;
          const ny = Math.sin(angle) * radius;
          ctx.beginPath();
          ctx.arc(nx, ny, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
      });

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

    const playWebSound = () => {
      try {
        const audio = new Audio('/sounds/thwip.mp3');
        audio.volume = 0.2; // Reduced volume
        audio.play().catch(e => {
          // Ignore autoplay errors
        });
      } catch (e) {
        // Ignore audio errors
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Prevent double firing from touch events
      if (Date.now() - lastTouchTime.current < 500) return;

      // Don't create effects if hidden
      if (canvasRef.current && canvasRef.current.style.opacity === '0') return;

      // Don't trigger in no-custom-cursor areas (Game Hub, Terminal)
      const target = e.target as HTMLElement;
      if (target.closest('.no-custom-cursor')) return;

      createWeb(mouse.current.x, mouse.current.y);
      playWebSound();
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
        const touch = e.touches[0];
        mouse.current.x = touch.clientX;
        mouse.current.y = touch.clientY;

        // Calculate distance moved
        const dx = touch.clientX - touchStartPos.current.x;
        const dy = touch.clientY - touchStartPos.current.y;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          isScrolling.current = true;
        }

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
        const touch = e.touches[0];
        mouse.current.x = touch.clientX;
        mouse.current.y = touch.clientY;

        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
        isScrolling.current = false;

        // Don't create effects if hidden
        if (canvasRef.current && canvasRef.current.style.opacity === '0') return;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isScrolling.current) {
        lastTouchTime.current = Date.now();

        // Don't trigger in no-custom-cursor areas
        const target = e.target as HTMLElement;
        if (target.closest('.no-custom-cursor')) return;

        // It was a tap, not a scroll
        if (canvasRef.current && canvasRef.current.style.opacity === '0') return;
        createWeb(mouse.current.x, mouse.current.y);
        playWebSound();
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mouseover', handleMouseOver);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
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
