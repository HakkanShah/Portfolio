'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, X, Trophy } from 'lucide-react';
import { SiReact, SiTypescript, SiNextdotjs, SiTailwindcss, SiNodedotjs, SiGit, SiDocker, SiPython } from 'react-icons/si';

interface MemoryMatchProps {
    onClose?: () => void;
}

type Card = {
    id: number;
    icon: React.ElementType;
    isFlipped: boolean;
    isMatched: boolean;
    color: string;
};

const ICONS = [
    { icon: SiReact, color: 'text-cyan-400' },
    { icon: SiTypescript, color: 'text-blue-500' },
    { icon: SiNextdotjs, color: 'text-white' },
    { icon: SiTailwindcss, color: 'text-cyan-300' },
    { icon: SiNodedotjs, color: 'text-green-500' },
    { icon: SiGit, color: 'text-orange-500' },
    { icon: SiDocker, color: 'text-blue-400' },
    { icon: SiPython, color: 'text-yellow-300' },
];

export default function MemoryMatch({ onClose }: MemoryMatchProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        initializeGame();
        const savedBest = localStorage.getItem('memory-match-best');
        if (savedBest) setBestScore(parseInt(savedBest));
    }, []);

    const initializeGame = () => {
        const duplicatedIcons = [...ICONS, ...ICONS];
        const shuffled = duplicatedIcons
            .sort(() => Math.random() - 0.5)
            .map((item, index) => ({
                id: index,
                icon: item.icon,
                color: item.color,
                isFlipped: false,
                isMatched: false,
            }));

        setCards(shuffled);
        setFlippedCards([]);
        setMoves(0);
        setMatches(0);
        setIsProcessing(false);
    };

    const playFlipSound = () => {
        if (typeof window === 'undefined') return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Soft "thwip" sound
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            // Ignore audio errors
        }
    };

    const handleCardClick = (id: number) => {
        if (isProcessing || cards[id].isFlipped || cards[id].isMatched) return;

        playFlipSound();
        const newCards = [...cards];
        newCards[id].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setIsProcessing(true);
            setMoves(prev => prev + 1);
            checkForMatch(newFlipped);
        }
    };

    const checkForMatch = (flipped: number[]) => {
        const [first, second] = flipped;
        const isMatch = cards[first].icon === cards[second].icon;

        if (isMatch) {
            setTimeout(() => {
                setCards(prev => prev.map(card =>
                    flipped.includes(card.id) ? { ...card, isMatched: true } : card
                ));
                setMatches(prev => {
                    const newMatches = prev + 1;
                    if (newMatches === 8) {
                        handleGameOver();
                    }
                    return newMatches;
                });
                setFlippedCards([]);
                setIsProcessing(false);
            }, 800); // Increased delay to match slower animation
        } else {
            setTimeout(() => {
                setCards(prev => prev.map(card =>
                    flipped.includes(card.id) ? { ...card, isFlipped: false } : card
                ));
                setFlippedCards([]);
                setIsProcessing(false);
            }, 1200); // Increased delay to match slower animation
        }
    };

    const handleGameOver = () => {
        const currentScore = moves + 1; // +1 because moves updates after check
        if (bestScore === 0 || currentScore < bestScore) {
            setBestScore(currentScore);
            localStorage.setItem('memory-match-best', currentScore.toString());
        }
    };

    const isGameOver = matches === 8;

    return (
        <div className="flex flex-col items-center w-full h-full bg-background p-4 relative overflow-hidden">
            <div className="flex flex-col items-center justify-center w-full shrink-0 z-20 mb-4">
                <h2 className="font-headline text-lg sm:text-xl font-bold text-primary">Memory Match</h2>
                <p className="text-xs text-muted-foreground mb-2">Click to flip the card</p>
                <div className="flex justify-between w-full max-w-[320px] text-sm font-bold">
                    <div className="bg-muted/30 px-3 py-1 rounded-lg">Moves: <span className="text-primary">{moves}</span></div>
                    <div className="bg-muted/30 px-3 py-1 rounded-lg">Best: <span className="text-yellow-500">{bestScore || '-'}</span></div>
                </div>
            </div>

            <div className="flex-1 w-full flex items-center justify-center min-h-0 relative z-10">
                <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-[320px] h-full max-h-[320px]">
                    {cards.map((card) => (
                        <motion.button
                            key={card.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCardClick(card.id)}
                            className="relative w-full h-full"
                            style={{ perspective: '1000px' }}
                        >
                            <motion.div
                                className="w-full h-full relative"
                                style={{ transformStyle: 'preserve-3d' }}
                                animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                {/* Front (Cover) */}
                                <div
                                    className="absolute inset-0 rounded-lg overflow-hidden border-2 border-primary/20 bg-muted/20"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <img
                                        src="https://github.com/HakkanShah.png"
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Back (Icon) */}
                                <div
                                    className={`absolute inset-0 rounded-lg flex items-center justify-center border-2 border-primary bg-background ${card.isMatched ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-background' : ''}`}
                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                >
                                    <card.icon className={`w-1/2 h-1/2 ${card.color}`} />
                                </div>
                            </motion.div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {isGameOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-50 p-6 text-center"
                    >
                        <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
                        <h3 className="text-3xl font-bold text-primary mb-2">You Won!</h3>
                        <p className="text-muted-foreground mb-6">Completed in <span className="font-bold text-foreground">{moves}</span> moves</p>

                        <div className="flex gap-3 w-full max-w-[200px]">
                            <Button onClick={initializeGame} className="w-full font-bold">
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
