'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { SOCIAL_LINKS } from '@/lib/data';
import AnimatedDiv from './animated-div';
import { Button } from './ui/button';
import { Download, RotateCcw, Trophy } from 'lucide-react';
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiNextdotjs, SiTypescript } from 'react-icons/si';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Lazy load heavy components for better performance
const GameHub = dynamic(() => import('./games/game-hub'), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false
});

const ResumePreviewModal = dynamic(() => import('./resume-preview-modal'), {
  ssr: false
});



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
  game: {
    game: {
      description: 'Open Game Hub',
      usage: 'game'
    }
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

interface HeroVisualProps {
  isGameHubOpen: boolean;
  gameHubInitialMaximized: boolean;
  setIsGameHubOpen: (open: boolean) => void;
  setGameHubInitialMaximized: (maximized: boolean) => void;
  shouldReduceMotion: boolean | null;
  imageRef?: React.RefObject<HTMLDivElement>;
  handleImageMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleImageMouseLeave?: () => void;
  handleImageClick?: () => void;
  smoothRotateX?: any;
  smoothRotateY?: any;
  className?: string;
}

const HeroVisual = ({
  isGameHubOpen,
  gameHubInitialMaximized,
  setIsGameHubOpen,
  setGameHubInitialMaximized,
  shouldReduceMotion,
  imageRef,
  handleImageMouseMove,
  handleImageMouseLeave,
  handleImageClick,
  smoothRotateX,
  smoothRotateY,
  className = ""
}: HeroVisualProps) => {
  return (
    <AnimatedDiv delay={400} className={`relative flex flex-col justify-center items-center gap-4 ${className}`}>
      {/* Background Blur - disabled animation with reduced motion */}
      <div className={`absolute bg-accent w-64 h-64 sm:w-80 sm:h-80 md:w-[30rem] md:h-[30rem] rounded-full blur-3xl opacity-30 pointer-events-none ${shouldReduceMotion ? '' : 'animate-pulse'}`}></div>

      {/* Normal Image with 3D effect */}
      <motion.div
        ref={imageRef}
        onMouseMove={!isGameHubOpen && handleImageMouseMove ? handleImageMouseMove : undefined}
        onMouseLeave={handleImageMouseLeave}
        onClick={!isGameHubOpen && handleImageClick ? handleImageClick : undefined}
        style={{
          rotateX: isGameHubOpen || shouldReduceMotion || !smoothRotateX ? 0 : smoothRotateX,
          rotateY: isGameHubOpen || shouldReduceMotion || !smoothRotateY ? 0 : smoothRotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative z-10 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-xl overflow-hidden border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] ${!isGameHubOpen ? 'cursor-pointer group' : ''}`}
        whileHover={!isGameHubOpen ? { scale: 1.02 } : {}}
        whileTap={!isGameHubOpen ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {!isGameHubOpen ? (
            <motion.div
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
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
                      🎮 Click to Play
                    </p>
                    <p className="text-white/80 text-xs sm:text-sm mt-1">
                      Fun Minigames!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="gamehub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <GameHub
                isOpen={true}
                onClose={() => {
                  setIsGameHubOpen(false);
                  setGameHubInitialMaximized(false);
                }}
                initialMaximized={gameHubInitialMaximized}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatedDiv>
  );
};

const HeroSection = () => {
  const [terminalOutput, setTerminalOutput] = useState<TerminalOutput[]>([
    {
      type: 'success',
      content: (
        <>
          <div className="text-[#00ff9d] font-bold">Welcome to my portfolio! 🚀</div>
          <div className="text-gray-400 mt-1">Type <span className="text-[#64b5f6]">help</span> to see all available commands.</div>
        </>
      ),
      timestamp: Date.now(),
    }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentSection, setCurrentSection] = useState('home');
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isGameHubOpen, setIsGameHubOpen] = useState(false);
  const [gameHubInitialMaximized, setGameHubInitialMaximized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Cycling subtitle effect - smooth phrase switching
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const phraseData = [
    {
      text: "Full Stack Developer",
      icons: [
        { Icon: SiMongodb, color: "#47A248" },
        { Icon: SiExpress },
        { Icon: SiReact, color: "#61DAFB" },
        { Icon: SiNodedotjs, color: "#339933" },
      ]
    },
    {
      text: "Next.JS Developer",
      icons: [
        { Icon: SiNextdotjs },
        { Icon: SiTypescript, color: "#3178C6" },
      ]
    }
  ];

  useEffect(() => {
    // Wait for initial slide animation, then start cycling
    const initialDelay = setTimeout(() => {
      // Change to next phrase immediately
      setCurrentPhraseIndex(1);

      // Then continue cycling every 3 seconds
      const interval = setInterval(() => {
        setCurrentPhraseIndex(prev => (prev + 1) % phraseData.length);
      }, 3000);

      return () => clearInterval(interval);
    }, 2000); // Start cycling after initial reveal

    return () => clearTimeout(initialDelay);
  }, [phraseData.length]);

  // Typing effect for collapsed terminal
  const [typingText, setTypingText] = useState('');
  const fullText = "Click to open terminal OR (Press Ctrl+`)";

  // Reduced motion support
  const shouldReduceMotion = useReducedMotion();

  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  // Image interaction handlers
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || window.innerWidth < 768 || shouldReduceMotion) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    rotateX.set(((e.clientY - centerY) / rect.height) * 15);
    rotateY.set(((e.clientX - centerX) / rect.width) * 15);
  };

  const handleImageMouseLeave = () => {
    if (shouldReduceMotion) return;
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleImageClick = () => {
    setIsGameHubOpen(true);
  };

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
              Type <span className="text-[#ffbd2e] font-bold">{cmd}</span>
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
        addOutput('info', <HelpItem cmd="game" desc="Open Game Hub" />);
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

      case 'game':
      case 'game':
        addOutput('success', '🎮 Opening Game Hub...');
        setGameHubInitialMaximized(true);
        setIsGameHubOpen(true);
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
        const availableCommands = ['help', 'cd', 'ls', 'sections', 'clear', 'hakkan', 'pwd', 'resume', 'github', 'linkedin', 'email', 'game'];
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

  // Ctrl+` keyboard shortcut to toggle terminal
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      // Check for Ctrl+` or Cmd+` (backtick)
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsTerminalExpanded(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  // Typing effect for collapsed terminal placeholder
  useEffect(() => {
    if (isTerminalExpanded) {
      setTypingText('');
      return;
    }

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypingText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80); // Typing speed

    return () => clearInterval(typingInterval);
  }, [isTerminalExpanded]);

  return (
    <section id="home" className="section-padding border-b-4 border-foreground overflow-hidden relative">
      <div className="section-container grid md:grid-cols-2 gap-10 items-center min-h-[70vh]">
        <div className="text-center md:text-left flex flex-col">
          <motion.h1
            className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-primary drop-shadow-[2px_2px_0_hsl(var(--foreground))] flex flex-wrap justify-center md:justify-start gap-x-[0.2em] gap-y-2 order-1"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.2
                }
              }
            }}
          >
            {"Hakkan Parbej Shah".split(" ").map((word, i) => (
              <div key={i} className="flex whitespace-nowrap">
                {word.split("").map((char, j) => (
                  <motion.span
                    key={j}
                    variants={{
                      hidden: { opacity: 0, y: 50, rotateX: 90, filter: 'blur(10px)' },
                      visible: {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        filter: 'blur(0px)',
                        transition: {
                          type: "spring",
                          damping: 12,
                          stiffness: 100,
                          filter: { type: "tween", duration: 0.4, ease: "easeOut" }
                        }
                      }
                    }}
                    whileHover={{
                      y: -5,
                      color: '#ff0055',
                      textShadow: '0 0 8px rgba(255,0,85,0.5)',
                      transition: { duration: 0.1 }
                    }}
                    className="inline-block origin-bottom"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            ))}
          </motion.h1>

          {/* Cycling Subtitle with Tech Icons */}
          <div className="mt-4 flex items-center justify-center md:justify-start h-[40px] sm:h-[48px] md:h-[56px] order-2">
            <div className="overflow-hidden whitespace-nowrap relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhraseIndex}
                  initial={{ opacity: 0, y: 20, width: 0 }}
                  animate={{ opacity: 1, y: 0, width: "auto" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    width: { duration: 1.5, ease: "linear" }
                  }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <p className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-accent">
                    {phraseData[currentPhraseIndex].text}
                  </p>
                  {/* Arrow and Icons - hidden on mobile, visible from sm breakpoint */}
                  <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      className="text-primary"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                    {phraseData[currentPhraseIndex].icons.map((icon, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.3 }}
                      >
                        <icon.Icon
                          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                          style={{ color: icon.color }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 1 }}
              className="w-2 h-6 sm:h-8 md:h-10 bg-primary ml-1"
            />
          </div>

          {/* Hero Visual for Mobile - inserted between subtitle and terminal */}
          <HeroVisual
            isGameHubOpen={isGameHubOpen}
            gameHubInitialMaximized={gameHubInitialMaximized}
            setIsGameHubOpen={setIsGameHubOpen}
            setGameHubInitialMaximized={setGameHubInitialMaximized}
            shouldReduceMotion={shouldReduceMotion}
            handleImageClick={handleImageClick}
            className="block md:hidden my-8 order-3 mx-auto"
          />

          <AnimatedDiv delay={400} className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6 order-4 md:order-4">
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
                <AnimatedDiv key={social.name} delay={500 + index * 100} variant="scale">
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

          <AnimatedDiv delay={600} className="mt-10 max-w-xl mx-auto md:mx-0 order-5 md:order-3">
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
                  Portfolio Terminal
                </div>
              </div>

              {/* Compact Terminal Preview */}
              <div className="p-4 sm:p-6 font-mono text-sm sm:text-base min-h-[5rem] relative z-[11]">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-[#00ff9d] animate-terminal-arrow-glow">➜</span>
                  <span className="text-[#64b5f6]" style={{ textShadow: '0 0 8px rgba(100,181,246,0.4)' }}>~</span>
                  <span>$</span>
                  <span className="text-gray-500">{typingText}</span>
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
                        Portfolio Terminal - {currentSection}
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


        </div>

        {/* Hero Visual for Desktop - kept in second column */}
        <HeroVisual
          isGameHubOpen={isGameHubOpen}
          gameHubInitialMaximized={gameHubInitialMaximized}
          setIsGameHubOpen={setIsGameHubOpen}
          setGameHubInitialMaximized={setGameHubInitialMaximized}
          shouldReduceMotion={shouldReduceMotion}
          imageRef={imageRef}
          handleImageMouseMove={handleImageMouseMove}
          handleImageMouseLeave={handleImageMouseLeave}
          handleImageClick={handleImageClick}
          smoothRotateX={smoothRotateX}
          smoothRotateY={smoothRotateY}
          className="hidden md:flex order-2"
        />
      </div >
    </section >
  );
};



export default HeroSection;
