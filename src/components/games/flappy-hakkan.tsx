'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Trophy } from 'lucide-react';

const GRAVITY = 0.4; // Reduced from 0.6 for slower falling
const JUMP_STRENGTH = -7; // Reduced from -10 for gentler jumps
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 1500; // ms
const GAP_SIZE = 150;

const CODE_SNIPPETS = [
    'console.log(err)',
    'printf("Hello")',
    'while(true)',
    'if(bug) fix()',
    'return null',
    'git push -f',
    'sudo rm -rf /',
    'npm install',
    '<div></div>',
    'import React',
    'const x = 0',
    'await fetch()',
    '404 Not Found',
    'StackOverflow',
];

interface FlappyHakkanProps {
    onClose?: () => void;
}

export default function FlappyHakkan({ onClose }: FlappyHakkanProps) {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const scoreRef = useRef(0);

    // Game state refs for loop
    const birdY = useRef(200);
    const birdVelocity = useRef(0);
    const pipes = useRef<{ x: number; topHeight: number; passed: boolean; code: string }[]>([]);
    const lastPipeTime = useRef(0);
    const birdImage = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = 'https://github.com/HakkanShah.png';
        img.onload = () => {
            birdImage.current = img;
        };

        // Load high score
        const saved = localStorage.getItem('flappy-hakkan-highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const audioContextRef = useRef<AudioContext | null>(null);

    const playJumpSound = () => {
        if (typeof window === 'undefined') return;

        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const ctx = audioContextRef.current;

            // Resume context if suspended (common on browsers requiring user interaction)
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(300, ctx.currentTime);
            oscillator.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    const jump = useCallback((e?: React.SyntheticEvent | Event) => {
        if (e && e.type !== 'keydown') {
            e.preventDefault();
        }
        playJumpSound();
        if (gameState === 'playing') {
            birdVelocity.current = JUMP_STRENGTH;
        } else if (gameState === 'start') {
            setGameState('playing');
            birdVelocity.current = JUMP_STRENGTH;
            lastPipeTime.current = performance.now();
        }
    }, [gameState]);

    // Prevent Space key from scrolling the page
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && (gameState === 'playing' || gameState === 'start')) {
                e.preventDefault();
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, jump]);

    const resetGame = () => {
        birdY.current = 200;
        birdVelocity.current = 0;
        pipes.current = [];
        scoreRef.current = 0;
        setScore(0);
        setGameState('start');
    };

    const gameOver = () => {
        setGameState('gameover');
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('flappy-hakkan-highscore', scoreRef.current.toString());
        }
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw pipes
        pipes.current.forEach(pipe => {
            // Pipe style
            const pipeColor = '#1e1e1e';
            const borderColor = '#00ff9d';
            const textColor = 'rgba(0, 255, 157, 0.7)';

            // Top pipe
            ctx.fillStyle = pipeColor;
            ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x, 0, 50, pipe.topHeight);

            // Bottom pipe
            ctx.fillStyle = pipeColor;
            ctx.fillRect(pipe.x, pipe.topHeight + GAP_SIZE, 50, canvas.height - (pipe.topHeight + GAP_SIZE));
            ctx.strokeRect(pipe.x, pipe.topHeight + GAP_SIZE, 50, canvas.height - (pipe.topHeight + GAP_SIZE));

            // Draw vertical text
            ctx.save();
            ctx.fillStyle = textColor;
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Text for top pipe
            const topText = pipe.code;
            ctx.save();
            ctx.translate(pipe.x + 25, pipe.topHeight / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(topText, 0, 0);
            ctx.restore();

            // Text for bottom pipe
            const bottomPipeHeight = canvas.height - (pipe.topHeight + GAP_SIZE);
            const bottomPipeCenterY = (pipe.topHeight + GAP_SIZE) + (bottomPipeHeight / 2);

            ctx.save();
            ctx.translate(pipe.x + 25, bottomPipeCenterY);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(topText, 0, 0);
            ctx.restore();

            ctx.restore();
        });

        // Draw bird
        if (birdImage.current) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(50 + 15, birdY.current + 15, 15, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(birdImage.current, 50, birdY.current, 30, 30);
            ctx.restore();

            // Bird border
            ctx.beginPath();
            ctx.arc(50 + 15, birdY.current + 15, 15, 0, Math.PI * 2);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            ctx.fillStyle = '#ffbd2e';
            ctx.fillRect(50, birdY.current, 30, 30);
        }

        // Ground
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    }, []);

    const update = useCallback((time: number) => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Update bird
        birdVelocity.current += GRAVITY;
        birdY.current += birdVelocity.current;

        // Check boundaries
        if (birdY.current < 0) {
            birdY.current = 0;
            birdVelocity.current = 0;
        }
        if (birdY.current + 30 > canvas.height) { // 30 is bird size
            gameOver();
            return;
        }

        // Spawn pipes
        if (time - lastPipeTime.current > PIPE_SPAWN_RATE) {
            const minHeight = 50;
            const maxHeight = canvas.height - GAP_SIZE - minHeight;
            const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

            pipes.current.push({
                x: canvas.width,
                topHeight: height,
                passed: false,
                code: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
            });
            lastPipeTime.current = time;
        }

        // Update pipes
        pipes.current.forEach(pipe => {
            pipe.x -= PIPE_SPEED;
        });

        // Remove off-screen pipes
        if (pipes.current.length > 0 && pipes.current[0].x < -50) {
            pipes.current.shift();
        }

        // Collision detection
        const birdRect = { x: 50, y: birdY.current, width: 30, height: 30 };

        for (const pipe of pipes.current) {
            // Pipe collision
            if (
                birdRect.x < pipe.x + 50 &&
                birdRect.x + birdRect.width > pipe.x &&
                (birdRect.y < pipe.topHeight || birdRect.y + birdRect.height > pipe.topHeight + GAP_SIZE)
            ) {
                gameOver();
                return;
            }

            // Score update
            if (!pipe.passed && birdRect.x > pipe.x + 50) {
                pipe.passed = true;
                scoreRef.current += 1;
                setScore(scoreRef.current);
            }
        }

        draw();
        requestRef.current = requestAnimationFrame(update);
    }, [gameState, highScore, draw]);

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(update);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, update]);

    // Initial draw
    useEffect(() => {
        draw();
    }, [draw]);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-background/95 relative overflow-hidden">
            {/* Header - Moved to bottom left to avoid conflict with controls */}
            <div className="absolute bottom-2 left-2 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-foreground/20">
                <h2 className="font-headline text-base sm:text-xl font-bold text-primary">Flappy Hakkan</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Tap/Click or Space</p>
            </div>

            <div className="absolute top-2 left-2 z-10 text-left bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-foreground/20">
                <div className="text-sm sm:text-lg font-bold">Score: <span className="text-primary">{score}</span></div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Best: {highScore}</div>
            </div>

            <div className="relative w-full h-full flex items-center justify-center p-4">
                <div className="relative aspect-square max-h-full max-w-full">
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        onPointerDown={jump}
                        className="w-full h-full bg-gradient-to-b from-blue-900/20 to-blue-500/10 rounded-lg border-2 border-foreground cursor-pointer shadow-inner touch-none"
                    />
                </div>
            </div>

            {gameState === 'start' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center p-4"
                    >
                        <Play className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-3 animate-pulse" />
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready?</h3>
                        <p className="text-white/80 text-sm mb-4">Click or Press Space</p>
                        <Button onPointerDown={jump} className="font-bold px-6 py-2">
                            Start Game
                        </Button>
                    </motion.div>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-background border-2 border-foreground p-4 sm:p-6 rounded-xl text-center shadow-2xl max-w-xs w-[90%]"
                    >
                        <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mx-auto mb-3" />
                        <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-3">Game Over!</h3>
                        <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg mb-4">
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-muted-foreground uppercase">Score</p>
                                <p className="text-xl sm:text-2xl font-bold">{score}</p>
                            </div>
                            <div className="w-px h-10 bg-foreground/20"></div>
                            <div className="text-center flex-1">
                                <p className="text-[10px] text-muted-foreground uppercase">Best</p>
                                <p className="text-xl sm:text-2xl font-bold text-yellow-500">{highScore}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <Button onPointerDown={resetGame} className="flex-1">
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Retry
                            </Button>
                            {onClose && (
                                <Button variant="outline" onPointerDown={onClose} className="flex-1">
                                    Exit
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
