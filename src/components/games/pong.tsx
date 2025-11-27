// 'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Trophy, Play } from 'lucide-react';

interface PongProps {
    onClose?: () => void;
}

type Point = { x: number; y: number };

type Direction = 'UP' | 'DOWN';

const BOARD_SIZE = 400; // px square board
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 12;
const INITIAL_SPEED = 4; // pixels per frame

export default function Pong({ onClose }: PongProps) {
    const [playerY, setPlayerY] = useState(BOARD_SIZE / 2 - PADDLE_HEIGHT / 2);
    const [aiY, setAiY] = useState(BOARD_SIZE / 2 - PADDLE_HEIGHT / 2);
    const [ballPos, setBallPos] = useState<Point>({ x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 });
    const [ballDir, setBallDir] = useState<Point>({ x: INITIAL_SPEED, y: INITIAL_SPEED });
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const requestRef = useRef<number | null>(null);

    const resetGame = useCallback(() => {
        setPlayerY(BOARD_SIZE / 2 - PADDLE_HEIGHT / 2);
        setAiY(BOARD_SIZE / 2 - PADDLE_HEIGHT / 2);
        setBallPos({ x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 });
        setBallDir({ x: INITIAL_SPEED * (Math.random() > 0.5 ? 1 : -1), y: INITIAL_SPEED * (Math.random() > 0.5 ? 1 : -1) });
        setPlayerScore(0);
        setAiScore(0);
        setIsPlaying(false);
    }, []);

    const startGame = () => {
        setIsPlaying(true);
    };

    // Game loop using requestAnimationFrame
    const update = useCallback(() => {
        if (!isPlaying) return;
        // Move ball
        setBallPos(prev => {
            let newX = prev.x + ballDir.x;
            let newY = prev.y + ballDir.y;

            // Top / bottom collision
            if (newY <= 0 || newY + BALL_SIZE >= BOARD_SIZE) {
                setBallDir(d => ({ ...d, y: -d.y }));
                newY = prev.y + -ballDir.y; // reflect
            }

            // Left paddle collision
            if (
                newX <= PADDLE_WIDTH &&
                newY + BALL_SIZE >= playerY &&
                newY <= playerY + PADDLE_HEIGHT
            ) {
                setBallDir(d => ({ ...d, x: -d.x }));
                newX = prev.x + -ballDir.x;
            }

            // Right paddle (AI) collision
            if (
                newX + BALL_SIZE >= BOARD_SIZE - PADDLE_WIDTH &&
                newY + BALL_SIZE >= aiY &&
                newY <= aiY + PADDLE_HEIGHT
            ) {
                setBallDir(d => ({ ...d, x: -d.x }));
                newX = prev.x + -ballDir.x;
            }

            // Scoring
            if (newX < 0) {
                // AI scores
                setAiScore(s => s + 1);
                setBallPos({ x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 });
                setBallDir({ x: INITIAL_SPEED, y: INITIAL_SPEED });
                return { x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 };
            }
            if (newX + BALL_SIZE > BOARD_SIZE) {
                // Player scores
                setPlayerScore(s => s + 1);
                setBallPos({ x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 });
                setBallDir({ x: -INITIAL_SPEED, y: -INITIAL_SPEED });
                return { x: BOARD_SIZE / 2, y: BOARD_SIZE / 2 };
            }

            return { x: newX, y: newY };
        });

        // Simple AI: follow ball Y with some lag
        setAiY(prev => {
            const target = ballPos.y - PADDLE_HEIGHT / 2 + BALL_SIZE / 2;
            const diff = target - prev;
            const step = diff * 0.07; // smooth follow
            let newY = prev + step;
            if (newY < 0) newY = 0;
            if (newY + PADDLE_HEIGHT > BOARD_SIZE) newY = BOARD_SIZE - PADDLE_HEIGHT;
            return newY;
        });

        requestRef.current = requestAnimationFrame(update);
    }, [isPlaying, ballDir, playerY, aiY, ballPos]);

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(update);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, update]);

    // Keyboard controls for player paddle
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!isPlaying) return;
            if (e.key === 'ArrowUp') {
                setPlayerY(p => Math.max(0, p - 20));
            } else if (e.key === 'ArrowDown') {
                setPlayerY(p => Math.min(BOARD_SIZE - PADDLE_HEIGHT, p + 20));
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isPlaying]);

    return (
        <div className="flex flex-col items-center w-full h-full bg-background p-4 relative overflow-hidden">
            <div className="flex items-center justify-between w-full max-w-[420px] mb-2 text-sm font-bold">
                <div className="bg-muted/30 px-3 py-1 rounded-lg">You: <span className="text-primary">{playerScore}</span></div>
                <div className="bg-muted/30 px-3 py-1 rounded-lg">AI: <span className="text-primary">{aiScore}</span></div>
            </div>
            <div className="relative" style={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
                {/* Paddles */}
                <div
                    className="absolute left-0 w-2 bg-primary rounded"
                    style={{ height: PADDLE_HEIGHT, top: playerY }}
                />
                <div
                    className="absolute right-0 w-2 bg-primary rounded"
                    style={{ height: PADDLE_HEIGHT, top: aiY }}
                />
                {/* Ball */}
                <div
                    className="absolute bg-primary rounded-full"
                    style={{ width: BALL_SIZE, height: BALL_SIZE, left: ballPos.x, top: ballPos.y }}
                />
                {/* Overlays */}
                <AnimatePresence>
                    {!isPlaying && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10"
                        >
                            <Button onClick={startGame} size="lg" className="font-bold text-lg">
                                <Play className="w-5 h-5 mr-2" />
                                Start Pong
                            </Button>
                            <p className="mt-4 text-sm text-muted-foreground">Use Arrow Up / Down to move your paddle</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Top‑right controls (close / maximize) */}
            <div className="absolute top-1 right-1 z-[100] flex gap-2">
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
