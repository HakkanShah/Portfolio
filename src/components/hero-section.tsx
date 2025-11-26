'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_LINKS } from '@/lib/data';
import AnimatedDiv from './animated-div';
import { Button } from './ui/button';
import { Download, RotateCcw, Trophy } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

import ResumePreviewModal from './resume-preview-modal';

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  row: number;
  col: number;
}

const HeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Turning Ideas into Reality – One Line of Code at a Time";
  const imageRef = useRef<HTMLDivElement>(null);
  const [isPuzzleMode, setIsPuzzleMode] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const gridSize = 3;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  });

  // Typing animation
  useEffect(() => {
    let index = 0;
    let timer: NodeJS.Timeout;
    
    // Start typing after 1.5s delay (wait for enter animation)
    const startTimer = setTimeout(() => {
      timer = setInterval(() => {
        if (index <= fullText.length) {
          setTypedText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 50);
    }, 1500);

    return () => {
      clearTimeout(startTimer);
      clearInterval(timer);
    };
  }, []);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || window.innerWidth < 768 || isPuzzleMode) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleImageMouseLeave = () => {
    if (!isPuzzleMode) {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const initializePuzzle = () => {
    const newPieces: PuzzlePiece[] = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      newPieces.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
        row: Math.floor(i / gridSize),
        col: i % gridSize,
      });
    }
    
    // Shuffle pieces
    const shuffled = [...newPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempPos = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = tempPos;
    }
    
    setPieces(shuffled);
    setIsComplete(false);
    setMoves(0);
    setIsPuzzleMode(true);
  };

  const handleImageClick = () => {
    if (!isPuzzleMode) {
      initializePuzzle();
    }
  };

  const handleDragStart = (pieceId: number) => {
    setDraggedPiece(pieceId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetPosition: number) => {
    if (draggedPiece === null) return;

    const newPieces = [...pieces];
    const draggedIndex = newPieces.findIndex(p => p.id === draggedPiece);
    const targetIndex = newPieces.findIndex(p => p.currentPosition === targetPosition);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const temp = newPieces[draggedIndex].currentPosition;
      newPieces[draggedIndex].currentPosition = newPieces[targetIndex].currentPosition;
      newPieces[targetIndex].currentPosition = temp;

      setPieces(newPieces);
      setMoves(prev => prev + 1);
      setDraggedPiece(null);

      checkCompletion(newPieces);
    }
  };

  const checkCompletion = (currentPieces: PuzzlePiece[]) => {
    const complete = currentPieces.every(
      piece => piece.currentPosition === piece.correctPosition
    );
    if (complete) {
      setIsComplete(true);
      playSuccessSound();
    }
  };

  const playSuccessSound = () => {
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        const now = audioContext.currentTime;
        const startTime = now + index * 0.15;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      });
    }
  };

  const getPieceStyle = (piece: PuzzlePiece) => {
    const pieceSize = 100 / gridSize;
    return {
      backgroundImage: `url(https://github.com/HakkanShah.png)`,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `${piece.col * pieceSize}% ${piece.row * pieceSize}%`,
    };
  };

  const resetPuzzle = () => {
    setIsPuzzleMode(false);
    setIsComplete(false);
    setPieces([]);
    setMoves(0);
  };

  const sortedPieces = [...pieces].sort((a, b) => a.currentPosition - b.currentPosition);

  return (
    <section id="home" className="section-padding border-b-4 border-foreground overflow-hidden relative">
      <div className="section-container grid md:grid-cols-2 gap-10 items-center min-h-[70vh]">
        <div className="text-center md:text-left">
          <AnimatedDiv variant="scale">
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-primary drop-shadow-[2px_2px_0_hsl(var(--foreground))]">
              Hakkan Parbej Shah
            </h1>
          </AnimatedDiv>
          <AnimatedDiv delay={200} variant="slideLeft">
            <p className="mt-4 font-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-accent">
              Full Stack Developer
            </p>
          </AnimatedDiv>
          <AnimatedDiv delay={400} className="mt-8 max-w-xl mx-auto md:mx-0">
            <div className="relative bg-[#1e1e1e] rounded-lg border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b-2 border-foreground/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                </div>
                <div className="ml-4 text-[10px] sm:text-xs text-gray-400 font-mono flex-1 text-center pr-12">
                  mission_statement.sh
                </div>
              </div>
              
              {/* Terminal Content */}
              <div className="p-4 sm:p-6 font-mono text-sm sm:text-base min-h-[5rem] sm:min-h-[6rem]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <span>$</span>
                    <span className="text-green-400">run</span>
                    <span>start-dev-journey</span>
                  </div>
                  <div className="flex flex-wrap text-gray-100">
                    <span className="text-green-400 mr-2">➜</span>
                    <span className="text-blue-400 mr-2">~</span>
                    <span>
                      {typedText}
                      <span className="inline-block w-2.5 h-5 bg-green-400 ml-1 animate-pulse align-middle shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedDiv>

          <AnimatedDiv delay={600} className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6">
            <MagneticButton>
              <Button 
                onClick={() => setIsResumeOpen(true)}
                className="font-headline text-lg sm:text-xl tracking-wider border-2 border-foreground shadow-md hover:shadow-xl transition-all"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                My Resume
              </Button>
            </MagneticButton>
            
            <ResumePreviewModal 
              isOpen={isResumeOpen} 
              onClose={() => setIsResumeOpen(false)} 
              resumeUrl="/Hakkan_Parbej_Shah_Resume.pdf" 
            />

            <div className="flex items-center space-x-3 sm:space-x-4">
              {SOCIAL_LINKS.map((social, index) => (
                <AnimatedDiv key={social.name} delay={700 + index * 100} variant="scale">
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <MagneticButton strength={0.3}>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        aria-label={social.name} 
                        className="border-2 border-foreground hover:bg-primary/10 transition-all hover:scale-110"
                      >
                        <social.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                    </MagneticButton>
                  </Link>
                </AnimatedDiv>
              ))}
            </div>
          </AnimatedDiv>
        </div>
        
        <AnimatedDiv delay={400} className="relative flex flex-col justify-center items-center gap-4">
          {/* Background Blur */}
          <div className="absolute bg-accent w-64 h-64 sm:w-80 sm:h-80 md:w-[30rem] md:h-[30rem] rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none"></div>

          {/* Puzzle Controls */}
          {isPuzzleMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-2"
            >
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-background border-2 border-foreground rounded-lg font-headline text-xs sm:text-sm">
                Moves: <span className="text-primary font-bold">{moves}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={initializePuzzle}
                className="border-2 border-foreground text-xs sm:text-sm"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                Shuffle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetPuzzle}
                className="border-2 border-foreground text-xs sm:text-sm"
              >
                Exit
              </Button>
            </motion.div>
          )}

          {/* How to Play Instructions */}
          {isPuzzleMode && !isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 text-center max-w-xs px-4"
            >
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                ℹ️ <span className="font-bold"></span> Drag pieces and solve the puzzle
              </p>
            </motion.div>
          )}

          
          {!isPuzzleMode ? (
            // Normal Image with 3D effect
            <motion.div
              ref={imageRef}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
              onClick={handleImageClick}
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-xl overflow-hidden border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-lg blur opacity-75 animate-gradient"></div>
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-background">
                <Image
                  src="https://github.com/HakkanShah.png"
                  alt="Hakkan Parbej Shah"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-white font-headline text-lg sm:text-xl md:text-2xl font-bold">
                      🧩 Click to Play
                    </p>
                    <p className="text-white/80 text-xs sm:text-sm mt-1">
                      Jigsaw Puzzle!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Puzzle Grid
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-muted/20 rounded-xl border-4 border-foreground overflow-hidden shadow-2xl"
            >
              <div className="grid grid-cols-3 gap-1 p-1 h-full bg-background/50 backdrop-blur-sm">
                {sortedPieces.map((piece) => (
                  <motion.div
                    key={piece.id}
                    layoutId={`piece-${piece.id}`}
                    draggable
                    onDragStart={() => handleDragStart(piece.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(piece.currentPosition)}
                    onTouchStart={() => handleDragStart(piece.id)}
                    className={`relative cursor-grab active:cursor-grabbing border-2 rounded-md overflow-hidden shadow-sm transition-shadow ${
                      piece.currentPosition === piece.correctPosition
                        ? 'border-green-500/50 z-0'
                        : 'border-white/20 hover:border-primary z-10 hover:z-20 hover:shadow-lg'
                    }`}
                    style={getPieceStyle(piece)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 400, 
                      damping: 25,
                      layout: { duration: 0.2 } 
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Tip for Green Pieces */}
          {isPuzzleMode && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative z-10 text-center max-w-xs"
            >
              <p className="text-sm text-green-500 font-semibold flex items-center justify-center gap-2">
                💡<span>Green pieces are in correct position</span>
              </p>
            </motion.div>
          )}

          {/* Success Message with Confetti */}
          <AnimatePresence>
            {isComplete && (
              <>
                {/* Confetti Animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
                >
                  {[...Array(50)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: '50%',
                        y: '50%',
                        scale: 0,
                        rotate: 0,
                      }}
                      animate={{
                        x: `${50 + (Math.random() - 0.5) * 200}%`,
                        y: `${50 + (Math.random() - 0.5) * 200}%`,
                        scale: [0, 1, 0.8],
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 1.5 + Math.random(),
                        ease: 'easeOut',
                      }}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][i % 6],
                      }}
                    />
                  ))}
                </motion.div>

                {/* Success Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg backdrop-blur-sm p-4 z-30"
                >
                  <div className="text-center p-4 sm:p-6 bg-background border-4 border-green-500 rounded-lg max-w-xs">
                    <motion.div
                      animate={{
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
                      }}
                      transition={{
                        duration: 0.6,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                      }}
                    >
                      <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-2 sm:mb-3" />
                    </motion.div>
                    <h3 className="font-headline text-xl sm:text-2xl font-bold text-green-500 mb-1 sm:mb-2">
                      🎉 Puzzle Complete!
                    </h3>
                    <p className="text-sm sm:text-base text-foreground/80 mb-3 sm:mb-4">
                      Solved in {moves} moves!
                    </p>
                    <Button onClick={resetPuzzle} className="border-2 border-foreground text-sm sm:text-base">
                      Play Again
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </AnimatedDiv>
      </div>
    </section>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, strength = 0.5 }: { children: React.ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || window.innerWidth < 768) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

export default HeroSection;
