'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2, Puzzle, Bird, Grid3X3, Brain, Ghost, Circle, Hand, Hammer, Calculator, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JigsawPuzzle from './jigsaw-puzzle';
import FlappyHakkan from './flappy-hakkan';
import TicTacToe from './tic-tac-toe';
import MemoryMatch from './memory-match';
import Snake from './snake';

interface GameHubProps {
    isOpen: boolean;
    onClose: () => void;
}

type GameType = 'jigsaw' | 'flappy' | 'tictactoe' | 'memory' | 'snake' | 'pong' | 'rps' | 'whack' | '2048' | null;

const GAMES = [
    { id: 'jigsaw', name: 'Jigsaw Puzzle', icon: Puzzle, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' },
    { id: 'flappy', name: 'Flappy Hakkan', icon: Bird, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500' },
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: Circle, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500' },
    { id: 'memory', name: 'Memory Match', icon: Brain, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500' },
    { id: 'snake', name: 'Snake', icon: Ghost, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500' },
    { id: 'pong', name: 'Pong', icon: Gamepad2, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500' },
    { id: 'rps', name: 'Rock Paper Scissors', icon: Hand, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
    { id: 'whack', name: 'Whack-a-Hakkan', icon: Hammer, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500' },
    { id: '2048', name: '2048', icon: Calculator, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500' },
];

export default function GameHub({ isOpen, onClose }: GameHubProps) {
    const [activeGame, setActiveGame] = useState<GameType>(null);
    const [isMaximized, setIsMaximized] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Default to maximized on mobile
        if (window.innerWidth < 768) {
            setIsMaximized(true);
        }
        return () => setMounted(false);
    }, []);

    // Prevent scrolling when game is active
    useEffect(() => {
        if (activeGame) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Prevent keyboard scroll
            const handleKeyDown = (e: KeyboardEvent) => {
                if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                    e.preventDefault();
                }
            };

            window.addEventListener('keydown', handleKeyDown, { passive: false });

            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [activeGame]);

    const handleCloseGame = () => {
        setActiveGame(null);
    };

    if (!isOpen) return null;

    const content = (
        <div className={`w-full h-full bg-background flex flex-col overflow-hidden relative ${isMaximized ? 'rounded-xl border-2 border-[#00ff9d] shadow-[0_0_60px_rgba(0,255,157,0.4),0_30px_100px_rgba(0,0,0,0.9)]' : ''}`}>
            {/* Visual Effects - Only when maximized */}
            {isMaximized && (
                <>
                    <div className="absolute inset-0 pointer-events-none z-10 animate-terminal-scanlines opacity-30" style={{
                        background: 'repeating-linear-gradient(0deg, rgba(0,255,157,0.03) 0px, transparent 1px, transparent 2px, rgba(0,255,157,0.03) 3px)'
                    }} />
                    <div className="absolute inset-0 pointer-events-none z-[9]" style={{
                        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
                    }} />
                </>
            )}

            <AnimatePresence mode="wait">
                {!activeGame ? (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full h-full p-4 flex flex-col relative z-20"
                    >
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h2 className="font-headline text-xl font-bold text-primary flex items-center gap-2">
                                <Gamepad2 className="w-6 h-6" />
                                Game Hub
                            </h2>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMaximized(!isMaximized)}
                                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                    title={isMaximized ? "Minimize" : "Maximize"}
                                >
                                    {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1 pb-2 flex-1">
                            {GAMES.map((game) => (
                                <motion.button
                                    key={game.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveGame(game.id as GameType)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border ${game.border} ${game.bg} hover:bg-opacity-20 transition-all aspect-square`}
                                >
                                    <game.icon className={`w-8 h-8 ${game.color} mb-2`} />
                                    <span className="font-headline font-bold text-xs text-center text-foreground leading-tight">{game.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full h-full relative z-20"
                        style={{ touchAction: 'none' }}
                    >
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-[100] flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="bg-background/80 backdrop-blur-sm border border-foreground hover:bg-background h-7 w-7 sm:h-8 sm:w-8"
                                title={isMaximized ? "Minimize" : "Maximize"}
                            >
                                {isMaximized ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="bg-background/80 backdrop-blur-sm border border-foreground hover:bg-background h-7 w-7 sm:h-8 sm:w-8"
                            >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                        </div>

                        <div className="w-full h-full">
                            {activeGame === 'jigsaw' && (
                                <JigsawPuzzle
                                    imageUrl="https://github.com/HakkanShah.png"
                                    isOpen={true}
                                    onClose={handleCloseGame}
                                />
                            )}
                            {activeGame === 'flappy' && (
                                <FlappyHakkan onClose={handleCloseGame} />
                            )}
                            {activeGame === 'tictactoe' && (
                                <TicTacToe onClose={handleCloseGame} />
                            )}
                            {activeGame === 'memory' && (
                                <MemoryMatch onClose={handleCloseGame} />
                            )}
                            {activeGame === 'snake' && (
                                <Snake onClose={handleCloseGame} />
                            )}
                            {activeGame !== 'jigsaw' && activeGame !== 'flappy' && activeGame !== 'tictactoe' && activeGame !== 'memory' && activeGame !== 'snake' && (
                                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                    <Gamepad2 className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
                                    <h3 className="text-lg font-bold mb-2">Coming Soon!</h3>
                                    <Button onClick={handleCloseGame} size="sm">
                                        Back
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    if (isMaximized && mounted) {
        return createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-[95vw] sm:w-[90vw] md:w-[800px] h-[45vh] sm:h-[65vh] md:h-[500px] relative"
                >
                    {content}
                </motion.div>
            </div>,
            document.body
        );
    }

    return content;
}
