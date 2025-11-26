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

interface TerminalOutput {
  type: 'command' | 'success' | 'error' | 'info' | 'warning';
  content: string | React.ReactNode;
  timestamp: number;
}

const SECTIONS = ['home', 'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];

const COMMANDS = {
  help: {
    description: 'Display all available commands',
    usage: 'help'
  },
  cd: {
    description: 'Navigate to a section',
    usage: 'cd <section>'
  },
  ls: {
    description: 'List all available sections',
    usage: 'ls'
  },
  sections: {
    description: 'List all available sections (alias for ls)',
    usage: 'sections'
  },
  clear: {
    description: 'Clear terminal history',
    usage: 'clear'
  },
  whoami: {
    description: 'Display information about the portfolio owner',
    usage: 'whoami'
  },
  pwd: {
    description: 'Show current section',
    usage: 'pwd'
  },
  resume: {
    description: 'Open resume preview',
    usage: 'resume'
  },
  github: {
    description: 'Open GitHub profile',
    usage: 'github'
  },
  linkedin: {
    description: 'Open LinkedIn profile',
    usage: 'linkedin'
  },
  email: {
    description: 'Open email client',
    usage: 'email'
  },
  puzzle: {
    description: 'Start the jigsaw puzzle game',
    usage: 'puzzle'
  }
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

// Levenshtein distance for fuzzy matching
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const HeroSection = () => {
  // Terminal state
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalOutput, setTerminalOutput] = useState<TerminalOutput[]>([
    { type: 'info', content: 'Welcome to Hakkan\'s Portfolio Terminal! 🚀', timestamp: Date.now() },
    { type: 'info', content: 'Type "help" to see available commands.', timestamp: Date.now() + 1 }
  ]);
  const [currentSection, setCurrentSection] = useState('home');
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);

  // Terminal popup state
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);

  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll terminal output to bottom
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalOutput]);

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

  // Terminal command handlers
  const addOutput = (type: TerminalOutput['type'], content: string | React.ReactNode) => {
    setTerminalOutput(prev => [...prev, { type, content, timestamp: Date.now() }]);
    // Auto-scroll to bottom to show new output and input prompt
    setTimeout(() => {
      if (terminalOutputRef.current) {
        terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
      }
    }, 50);
  };

  const navigateToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setCurrentSection(section);
      return true;
    }
    return false;
  };

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add command to output
    addOutput('command', `$ ${trimmedInput}`);

    // Parse command
    const [command, ...args] = trimmedInput.toLowerCase().split(/\s+/);

    // Execute command
    switch (command) {
      case 'help':
        addOutput('info', '📚 Available Commands:');
        addOutput('info', '────────────────────────────────────────');

        const HelpItem = ({ cmd, desc }: { cmd: string, desc: string }) => (
          <div className="flex flex-col items-start sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-left">
            <span className="min-w-[150px] whitespace-nowrap">
              Run <span className="text-[#ffbd2e] font-bold">{cmd}</span>
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">- {desc}</span>
          </div>
        );

        addOutput('success', '🧭 Navigation:');
        addOutput('info', <HelpItem cmd="cd <section>" desc="Navigate to a section" />);
        addOutput('info', <HelpItem cmd="ls / sections" desc="List all available sections" />);
        addOutput('info', <HelpItem cmd="pwd" desc="Show current section" />);
        addOutput('info', '');

        addOutput('success', '🌐 Social & Contact:');
        addOutput('info', <HelpItem cmd="github" desc="Open GitHub profile" />);
        addOutput('info', <HelpItem cmd="linkedin" desc="Open LinkedIn profile" />);
        addOutput('info', <HelpItem cmd="email" desc="Send an email" />);
        addOutput('info', <HelpItem cmd="resume" desc="View resume" />);
        addOutput('info', '');

        addOutput('success', '🛠️  Utilities:');
        addOutput('info', <HelpItem cmd="help" desc="Show this help message" />);
        addOutput('info', <HelpItem cmd="clear" desc="Clear terminal history" />);
        addOutput('info', <HelpItem cmd="hakkan" desc="Display user info" />);
        addOutput('info', '');

        addOutput('success', '🎮 Fun:');
        addOutput('info', <HelpItem cmd="puzzle" desc="Play a game" />);
        addOutput('info', '────────────────────────────────────────');
        addOutput('warning', '💡 Tip: Use Tab for auto-completion, ↑↓ for history');
        break;

      case 'cd':
        if (args.length === 0) {
          addOutput('error', '❌ Error: Missing section name');
          addOutput('warning', '💡 Usage: cd <section>. Try "ls" to see available sections.');
        } else {
          const section = args[0];
          if (SECTIONS.includes(section)) {
            if (navigateToSection(section)) {
              addOutput('success', `✅ Navigated to ${section}`);
              // Auto-close terminal after navigation
              setTimeout(() => {
                setIsTerminalExpanded(false);
              }, 1000);
            } else {
              addOutput('error', `❌ Failed to navigate to ${section}`);
            }
          } else {
            // Fuzzy match for section
            const closestSection = SECTIONS.reduce((closest, curr) => {
              const dist = levenshteinDistance(section, curr);
              return dist < closest.dist ? { str: curr, dist } : closest;
            }, { str: '', dist: Infinity });

            if (closestSection.dist <= 2) {
              addOutput('error', `❌ Section "${section}" not found`);
              addOutput('warning', `💡 Did you mean "cd ${closestSection.str}"?`);
            } else {
              addOutput('error', `❌ Section "${section}" not found`);
              addOutput('warning', `💡 Available sections: ${SECTIONS.join(', ')}`);
              addOutput('warning', '💡 Try "ls" to see all sections');
            }
          }
        }
        break;

      case 'ls':
      case 'sections':
        addOutput('info', '📂 Available Sections:');
        addOutput('info', '');
        SECTIONS.forEach(section => {
          const indicator = section === currentSection ? '📍' : '  ';
          addOutput('info', `  ${indicator} ${section}`);
        });
        addOutput('info', '');
        addOutput('info', '💡 Use "cd <section>" to navigate');
        break;

      case 'clear':
        setTerminalOutput([]);
        break;

      case 'hakkan':
        addOutput('info', '👨‍💻 Hello There! I am Hakkan Parbej Shah');
        addOutput('info', '💼 Full Stack Developer — MERN & Next.js Specialist');
        addOutput('info', '🧠 Building scalable apps, debugging chaos, and shipping clean code');
        addOutput('info', '⚙️ Loves architecture planning, API design & smooth user experiences');
        addOutput('info', '🌐 Currently crafting modern web apps with speed + precision');
        addOutput('info', '📚 Always learning — performance, security, and production best practices');
        addOutput('info', '');
        addOutput('info', '📧 Want to connect? Try "cd contact"');
        break;

      case 'pwd':
        addOutput('info', `📍 Current section: ${currentSection}`);
        break;

      case 'resume':
        addOutput('success', '📄 Opening resume preview...');
        setIsResumeOpen(true);
        // Auto-close terminal
        setTimeout(() => {
          setIsTerminalExpanded(false);
        }, 1000);
        break;

      case 'github':
        addOutput('success', '🔗 Opening GitHub profile...');
        window.open('https://github.com/HakkanShah', '_blank');
        // Auto-close terminal
        setTimeout(() => {
          setIsTerminalExpanded(false);
        }, 1000);
        break;

      case 'linkedin':
        addOutput('success', '🔗 Opening LinkedIn profile...');
        window.open('https://www.linkedin.com/in/hakkan', '_blank');
        // Auto-close terminal
        setTimeout(() => {
          setIsTerminalExpanded(false);
        }, 1000);
        break;

      case 'email':
        addOutput('success', '📧 Opening email client...');
        window.location.href = 'mailto:hakkanparbej@gmail.com';
        // Auto-close terminal
        setTimeout(() => {
          setIsTerminalExpanded(false);
        }, 1000);
        break;

      case 'puzzle':
        addOutput('success', '🧩 Starting jigsaw puzzle game...');
        setIsPuzzleMode(true);
        initializePuzzle();
        // Auto-close terminal
        setTimeout(() => {
          setIsTerminalExpanded(false);
        }, 1000);
        break;

      default:
        // Check if input is a section name (shortcut for cd)
        if (SECTIONS.includes(command)) {
          addOutput('warning', `💡 Did you mean "cd ${command}"?`);
          break;
        }

        // Fuzzy match for commands
        const availableCommands = ['help', 'cd', 'ls', 'sections', 'clear', 'hakkan', 'pwd', 'resume', 'github', 'linkedin', 'email', 'puzzle'];
        const closestCommand = availableCommands.reduce((closest, curr) => {
          const dist = levenshteinDistance(command, curr);
          return dist < closest.dist ? { str: curr, dist } : closest;
        }, { str: '', dist: Infinity });

        if (closestCommand.dist <= 2) {
          addOutput('error', `❌ Command not found: ${command}`);
          addOutput('warning', `💡 Did you mean "${closestCommand.str}"?`);
        } else {
          // Check fuzzy match for sections as fallback (e.g. "contac" -> "cd contact")
          const closestSection = SECTIONS.reduce((closest, curr) => {
            const dist = levenshteinDistance(command, curr);
            return dist < closest.dist ? { str: curr, dist } : closest;
          }, { str: '', dist: Infinity });

          if (closestSection.dist <= 2) {
            addOutput('error', `❌ Command not found: ${command}`);
            addOutput('warning', `💡 Did you mean "cd ${closestSection.str}"?`);
          } else {
            addOutput('error', `❌ Command not found: ${command}`);
            addOutput('warning', '💡 Type "help" to see available commands');
          }
        }
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    // Execute command
    executeCommand(commandInput);

    // Add to history
    setCommandHistory(prev => [...prev, commandInput]);
    setHistoryIndex(-1);

    // Clear input
    setCommandInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);

      setHistoryIndex(newIndex);
      setCommandInput(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;

      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setCommandInput('');
      } else {
        setHistoryIndex(newIndex);
        setCommandInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const input = commandInput.toLowerCase().trim();

      // Auto-complete commands
      const matchingCommands = Object.keys(COMMANDS).filter(cmd => cmd.startsWith(input));
      if (matchingCommands.length === 1) {
        setCommandInput(matchingCommands[0] + ' ');
        return;
      }

      // Auto-complete sections for cd command
      const cdMatch = input.match(/^cd\s+(.*)$/);
      if (cdMatch) {
        const sectionPrefix = cdMatch[1];
        const matchingSections = SECTIONS.filter(s => s.startsWith(sectionPrefix));
        if (matchingSections.length === 1) {
          setCommandInput(`cd ${matchingSections[0]}`);
        }
      }
    } else if (e.key === 'Escape') {
      terminalInputRef.current?.blur();
    }
  };

  const handleTerminalClick = () => {
    terminalInputRef.current?.focus();
  };

  // Traffic light control handlers
  const handleRedButton = () => {
    setIsTerminalExpanded(false);
  };

  const handleYellowButton = () => {
    setIsTerminalExpanded(false);
  };

  const handleGreenButton = () => {
    setIsTerminalExpanded(false);
  };

  const expandTerminal = () => {
    setIsTerminalExpanded(true);
    // Small delay to ensure DOM is ready before focusing
    setTimeout(() => {
      terminalInputRef.current?.focus();
    }, 100);
  };
  // Mobile detection for performance
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ESC key handler for expanded terminal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTerminalExpanded) {
        handleRedButton();
      }
    };

    if (isTerminalExpanded) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isTerminalExpanded]);

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
            {/* Compact Terminal View */}
            <div
              onClick={expandTerminal}
              className="relative bg-black rounded-xl border-2 border-[#2d2d2d] shadow-[0_0_40px_rgba(0,255,157,0.15),0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_0_60px_rgba(0,255,157,0.3),0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden group hover:-translate-y-1 hover:scale-[1.02] hover:border-[#00ff9d] transition-all duration-300 cursor-pointer"
            >
              {/* CRT Scanlines Effect */}
              <div className="absolute inset-0 pointer-events-none z-10 animate-terminal-scanlines opacity-30" style={{
                background: 'repeating-linear-gradient(0deg, rgba(0,255,157,0.03) 0px, transparent 1px, transparent 2px, rgba(0,255,157,0.03) 3px)'
              }} />

              {/* Radial Vignette */}
              <div className="absolute inset-0 pointer-events-none z-[9]" style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
              }} />

              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-[#2d2d2d] to-[#1e1e1e] border-b-2 border-[rgba(0,255,157,0.2)] relative z-[11]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#ff6b5f] to-[#ff5f56] border border-[#e0443e] shadow-[0_2px_8px_rgba(255,95,86,0.4)]" />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#ffca3a] to-[#ffbd2e] border border-[#dea123] shadow-[0_2px_8px_rgba(255,189,46,0.4)]" />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#32d74b] to-[#27c93f] border border-[#1aab29] shadow-[0_2px_8px_rgba(39,201,63,0.4)]" />
                </div>
                <div className="ml-4 text-[10px] sm:text-xs text-gray-500 font-mono flex-1 text-center pr-12 tracking-wide">
                  portfolio.terminal
                </div>
              </div>

              {/* Compact Terminal Preview */}
              <div className="p-4 sm:p-6 font-mono text-sm sm:text-base min-h-[5rem] relative z-[11]">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-[#00ff9d] animate-terminal-arrow-glow">➜</span>
                  <span className="text-[#64b5f6]" style={{ textShadow: '0 0 8px rgba(100,181,246,0.4)' }}>~</span>
                  <span>$</span>
                  <span className="text-gray-500">Click to open terminal...</span>
                  <span className="inline-block w-2 h-4 bg-[#00ff9d] animate-pulse ml-2" />
                </div>
              </div>
            </div>
          </AnimatedDiv>

          {/* Expanded Terminal Popup Modal */}
          <AnimatePresence>
            {isTerminalExpanded && (
              <>
                {/* Backdrop - lighter blur on mobile for performance */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleRedButton}
                  className={`fixed inset-0 bg-black/60 z-[99998] ${isMobile ? '' : 'backdrop-blur-sm'}`}
                />

                {/* Terminal Window - Draggable only on desktop */}
                <motion.div
                  drag={!isMobile}
                  dragConstraints={{
                    left: -window.innerWidth / 2 + 200,
                    right: window.innerWidth / 2 - 200,
                    top: -window.innerHeight / 2 + 100,
                    bottom: window.innerHeight / 2 - 100,
                  }}
                  dragElastic={0}
                  dragMomentum={false}
                  initial={{ opacity: 0, scale: 0.95, y: 20, x: '-50%' }}
                  animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                  exit={{ opacity: 0, scale: 0.95, y: 20, x: '-50%' }}
                  transition={isMobile ? { duration: 0.2, ease: 'easeOut' } : {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                  className={`fixed top-1/2 left-1/2 z-[99999] ${isMobile
                    ? 'w-[95vw] h-[45vh]'
                    : 'w-[95vw] sm:w-[90vw] md:w-[800px] h-[45vh] sm:h-[65vh] md:h-[500px]'
                    }`}
                  style={{ x: '-50%', y: '-50%' }}
                >
                  <div className={`relative bg-black border-[#00ff9d] overflow-hidden h-full flex flex-col cursor-default no-custom-cursor ${isMobile
                    ? 'rounded-lg border shadow-lg'
                    : 'rounded-xl border-2 shadow-[0_0_60px_rgba(0,255,157,0.4),0_30px_100px_rgba(0,0,0,0.9)]'
                    }`}>
                    {/* Visual Effects - Desktop Only */}
                    {!isMobile && (
                      <>
                        <div className="absolute inset-0 pointer-events-none z-10 animate-terminal-scanlines opacity-30" style={{
                          background: 'repeating-linear-gradient(0deg, rgba(0,255,157,0.03) 0px, transparent 1px, transparent 2px, rgba(0,255,157,0.03) 3px)'
                        }} />
                        <div className="absolute inset-0 pointer-events-none z-[9]" style={{
                          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
                        }} />
                      </>
                    )}

                    {/* Terminal Header with Traffic Lights - Draggable Handle */}
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-b from-[#2d2d2d] to-[#1e1e1e] border-b-2 border-[rgba(0,255,157,0.2)] relative z-[11] cursor-move select-none">
                      <div className="flex gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* Red - Close */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRedButton();
                          }}
                          className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-[#ff6b5f] to-[#ff5f56] border border-[#e0443e] shadow-[0_2px_8px_rgba(255,95,86,0.4)] cursor-pointer transition-all hover:scale-125 active:scale-95 group/red"
                          title="Close terminal"
                        >
                          <div className="absolute inset-[-2px] rounded-full opacity-0 group-hover/red:opacity-100 group-hover/red:animate-[terminal-control-pulse_1.5s_ease-in-out_infinite]" style={{
                            background: 'radial-gradient(circle, rgba(255,95,86,0.6) 0%, transparent 70%)'
                          }} />
                        </button>

                        {/* Yellow - Minimize */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleYellowButton();
                          }}
                          className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-[#ffca3a] to-[#ffbd2e] border border-[#dea123] shadow-[0_2px_8px_rgba(255,189,46,0.4)] cursor-pointer transition-all hover:scale-125 active:scale-95 group/yellow"
                          title="Minimize terminal"
                        >
                          <div className="absolute inset-[-2px] rounded-full opacity-0 group-hover/yellow:opacity-100 group-hover/yellow:animate-[terminal-control-pulse_1.5s_ease-in-out_infinite]" style={{
                            background: 'radial-gradient(circle, rgba(255,189,46,0.6) 0%, transparent 70%)'
                          }} />
                        </button>

                        {/* Green - Close */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGreenButton();
                          }}
                          className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-[#32d74b] to-[#27c93f] border border-[#1aab29] shadow-[0_2px_8px_rgba(39,201,63,0.4)] cursor-pointer transition-all hover:scale-125 active:scale-95 group/green"
                          title="Close terminal"
                        >
                          <div className="absolute inset-[-2px] rounded-full opacity-0 group-hover/green:opacity-100 group-hover/green:animate-[terminal-control-pulse_1.5s_ease-in-out_infinite]" style={{
                            background: 'radial-gradient(circle, rgba(39,201,63,0.6) 0%, transparent 70%)'
                          }} />
                        </button>
                      </div>
                      <div className="ml-2 sm:ml-4 text-[10px] sm:text-xs text-gray-500 font-mono flex-1 text-center pr-8 sm:pr-12 tracking-wide truncate">
                        portfolio.terminal - {currentSection}
                      </div>
                    </div>

                    {/* Terminal Content - Traditional Style */}
                    <div
                      className="flex-1 p-3 sm:p-4 md:p-6 font-mono text-sm sm:text-base relative z-[11] overflow-hidden flex flex-col text-left cursor-text"
                      onClick={handleTerminalClick}
                    >
                      {/* Scrollable Container - Output + Current Input */}
                      <div
                        ref={terminalOutputRef}
                        className="flex-1 overflow-y-auto pr-2 scrollbar-thin"
                      >
                        {/* Previous Output */}
                        {terminalOutput.map((output, index) => (
                          <motion.div
                            key={`${output.timestamp}-${index}`}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`mb-1 ${output.type === 'command' ? 'text-gray-400' :
                              output.type === 'success' ? 'text-[#00ff9d]' :
                                output.type === 'error' ? 'text-[#ff6b5f]' :
                                  output.type === 'warning' ? 'text-[#ffbd2e]' :
                                    'text-gray-300'
                              }`}
                          >
                            {output.content}
                          </motion.div>
                        ))}

                        {/* Current Command Input - Appears After All Output */}
                        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-1">
                          <span className="text-[#00ff9d] animate-terminal-arrow-glow">➜</span>
                          <span className="text-[#64b5f6]" style={{ textShadow: '0 0 8px rgba(100,181,246,0.4)' }}>~</span>
                          <span className="text-gray-400">$</span>
                          <input
                            ref={terminalInputRef}
                            type="text"
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsTerminalFocused(true)}
                            onBlur={() => setIsTerminalFocused(false)}
                            className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-600 caret-[#00ff9d]"
                            placeholder="Type 'help' to get started..."
                            spellCheck={false}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                          />
                          <span
                            className={`inline-block w-2 h-4 bg-[#00ff9d] transition-opacity ${isTerminalFocused ? 'animate-pulse' : 'opacity-50'
                              }`}
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

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
                    className={`relative cursor-grab active:cursor-grabbing border-2 rounded-md overflow-hidden shadow-sm transition-shadow ${piece.currentPosition === piece.correctPosition
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



export default HeroSection;
