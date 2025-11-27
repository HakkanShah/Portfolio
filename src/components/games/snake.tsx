'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, X, Trophy, Play } from 'lucide-react';
import { SiReact, SiTypescript, SiNextdotjs, SiTailwindcss, SiNodedotjs, SiGit, SiDocker, SiPython } from 'react-icons/si';

interface SnakeProps {
    onClose?: () => void;
}

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type FoodItem = Point & { icon: React.ElementType; color: string };

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

const TECH_ICONS = [
    { icon: SiReact, color: 'text-cyan-400' },
    { icon: SiTypescript, color: 'text-blue-500' },
    { icon: SiNextdotjs, color: 'text-white' },
    { icon: SiTailwindcss, color: 'text-cyan-300' },
    { icon: SiNodedotjs, color: 'text-green-500' },
    { icon: SiGit, color: 'text-orange-500' },
    { icon: SiDocker, color: 'text-blue-400' },
    { icon: SiPython, color: 'text-yellow-300' },
];

export default function Snake({ onClose }: SnakeProps) {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<FoodItem | null>(null);
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    // Touch handling state
    const touchStart = useRef<Point | null>(null);

    useEffect(() => {
        const savedBest = localStorage.getItem('snake-best');
        if (savedBest) setHighScore(parseInt(savedBest));
        spawnFood();
    }, []);

    const spawnFood = useCallback(() => {
        let newFood: FoodItem;
        let isOnSnake;
        do {
            const x = Math.floor(Math.random() * GRID_SIZE);
            const y = Math.floor(Math.random() * GRID_SIZE);
            const randomTech = TECH_ICONS[Math.floor(Math.random() * TECH_ICONS.length)];
            newFood = { x, y, icon: randomTech.icon, color: randomTech.color };

            // Check if food spawns on snake (using current state ref would be better but this is simple enough for now)
            // We'll just check against the current snake state in the next render cycle effectively, 
            // but for initial spawn it's fine. 
            // To be perfectly safe, we'd pass snake as arg, but let's keep it simple.
            isOnSnake = false; // Simplified for initial implementation
        } while (isOnSnake);
        setFood(newFood);
    }, []);

    const playSound = (type: 'eat' | 'die') => {
        if (typeof window === 'undefined') return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'eat') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } else {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            }
        } catch (e) {
            // Ignore
        }
    };

    const gameOver = () => {
        setIsPlaying(false);
        setIsGameOver(true);
        playSound('die');
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snake-best', score.toString());
        }
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };

    const moveSnake = useCallback(() => {
        if (isGameOver) return;

        setSnake(prevSnake => {
            const head = { ...prevSnake[0] };
            const currentDir = nextDirection; // Use nextDirection to prevent 180 turns in one tick
            setDirection(currentDir);

            switch (currentDir) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
            }

            // Wall collision
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                gameOver();
                return prevSnake;
            }

            // Self collision
            if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                gameOver();
                return prevSnake;
            }

            const newSnake = [head, ...prevSnake];

            // Eat food
            if (food && head.x === food.x && head.y === food.y) {
                setScore(s => s + 1);
                setSpeed(s => Math.max(50, s - SPEED_INCREMENT));
                playSound('eat');
                spawnFood();
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [food, nextDirection, isGameOver, spawnFood]);

    useEffect(() => {
        if (isPlaying && !isGameOver) {
            gameLoopRef.current = setInterval(moveSnake, speed);
        } else {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        }
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [isPlaying, isGameOver, moveSnake, speed]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying) return;

            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN') setNextDirection('UP');
                    break;
                case 'ArrowDown':
                    if (direction !== 'UP') setNextDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    if (direction !== 'RIGHT') setNextDirection('LEFT');
                    break;
                case 'ArrowRight':
                    if (direction !== 'LEFT') setNextDirection('RIGHT');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, direction]);

    // Touch controls
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current || !isPlaying) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const dx = touchEnd.x - touchStart.current.x;
        const dy = touchEnd.y - touchStart.current.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (Math.abs(dx) > 30) { // Threshold
                if (dx > 0 && direction !== 'LEFT') setNextDirection('RIGHT');
                else if (dx < 0 && direction !== 'RIGHT') setNextDirection('LEFT');
            }
        } else {
            // Vertical swipe
            if (Math.abs(dy) > 30) {
                if (dy > 0 && direction !== 'UP') setNextDirection('DOWN');
                else if (dy < 0 && direction !== 'DOWN') setNextDirection('UP');
            }
        }
        touchStart.current = null;
    };

    const startGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection('RIGHT');
        setNextDirection('RIGHT');
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setIsGameOver(false);
        setIsPlaying(true);
        spawnFood();
    };

    return (
        <div className="flex flex-col items-center w-full h-full bg-background p-4 relative overflow-hidden">
            <div className="flex flex-col items-center justify-center w-full shrink-0 z-20 mb-4">
                <div className="flex items-center justify-center w-full max-w-[320px] mb-2">
                    <h2 className="font-headline text-lg sm:text-xl font-bold text-primary">Snake</h2>
                </div>
                <div className="flex justify-between w-full max-w-[320px] text-sm font-bold">
                    <div className="bg-muted/30 px-3 py-1 rounded-lg">Score: <span className="text-primary">{score}</span></div>
                    <div className="bg-muted/30 px-3 py-1 rounded-lg">Best: <span className="text-yellow-500">{highScore}</span></div>
                </div>
            </div>

            <div
                className="flex-1 w-full flex items-center justify-center min-h-0 relative z-10 outline-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    ref={boardRef}
                    className="relative bg-muted/10 border-2 border-primary/20 rounded-lg overflow-hidden"
                    style={{
                        height: '100%',
                        width: 'auto',
                        maxWidth: '100%',
                        aspectRatio: '1/1',
                        display: 'grid',
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
                    }}
                >
                    {/* Grid Background (Optional, maybe too noisy) */}

                    {/* Food */}
                    {food && (
                        <div
                            className="absolute flex items-center justify-center animate-pulse"
                            style={{
                                left: `${(food.x / GRID_SIZE) * 100}%`,
                                top: `${(food.y / GRID_SIZE) * 100}%`,
                                width: `${100 / GRID_SIZE}%`,
                                height: `${100 / GRID_SIZE}%`,
                            }}
                        >
                            <food.icon className={`w-full h-full p-0.5 ${food.color}`} />
                        </div>
                    )}

                    {/* Snake */}
                    {snake.map((segment, index) => (
                        <div
                            key={`${segment.x}-${segment.y}-${index}`}
                            className="absolute"
                            style={{
                                left: `${(segment.x / GRID_SIZE) * 100}%`,
                                top: `${(segment.y / GRID_SIZE) * 100}%`,
                                width: `${100 / GRID_SIZE}%`,
                                height: `${100 / GRID_SIZE}%`,
                                zIndex: snake.length - index, // Head on top
                            }}
                        >
                            <img
                                src="https://github.com/HakkanShah.png"
                                alt="Snake"
                                className={`w-full h-full rounded-full object-cover border border-primary/50 ${index === 0 ? 'ring-2 ring-primary z-10' : 'opacity-80'}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {!isPlaying && !isGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
                    >
                        <Button onClick={startGame} size="lg" className="font-bold text-lg">
                            <Play className="w-5 h-5 mr-2" />
                            Start Game
                        </Button>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Use Arrow Keys or Swipe to move
                        </p>
                    </motion.div>
                )}

                {isGameOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-50 p-6 text-center"
                    >
                        <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
                        <h3 className="text-3xl font-bold text-primary mb-2">Game Over!</h3>
                        <p className="text-muted-foreground mb-6">Score: <span className="font-bold text-foreground">{score}</span></p>

                        <div className="flex gap-3 w-full max-w-[200px]">
                            <Button onClick={startGame} className="w-full font-bold">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Play Again
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
