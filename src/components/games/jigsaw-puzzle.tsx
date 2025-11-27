'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '../ui/button';

interface PuzzlePiece {
    id: number;
    currentPosition: number;
    correctPosition: number;
    row: number;
    col: number;
}

interface JigsawPuzzleProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

const JigsawPuzzle = ({ imageUrl, isOpen, onClose }: JigsawPuzzleProps) => {
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [moves, setMoves] = useState(0);
    const gridSize = 3; // 3x3 grid

    // Initialize puzzle pieces
    useEffect(() => {
        if (isOpen) {
            initializePuzzle();
        }
    }, [isOpen]);

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
    };

    const handleDragStart = (pieceId: number) => {
        setDraggedPiece(pieceId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const playSwapSound = () => {
        if (typeof window !== 'undefined') {
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

                // Create a satisfying "pop" sound
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.frequency.value = 800; // High pitch for a nice pop
                oscillator.type = 'sine';

                const now = audioContext.currentTime;

                // Quick attack and decay for a pop sound
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.start(now);
                oscillator.stop(now + 0.1);
            } catch (error) {
                console.log('Audio context error:', error);
            }
        }
    };

    const handleDrop = (targetPosition: number) => {
        if (draggedPiece === null) return;

        const newPieces = [...pieces];
        const draggedIndex = newPieces.findIndex(p => p.id === draggedPiece);
        const targetIndex = newPieces.findIndex(p => p.currentPosition === targetPosition);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            // Swap positions
            const temp = newPieces[draggedIndex].currentPosition;
            newPieces[draggedIndex].currentPosition = newPieces[targetIndex].currentPosition;
            newPieces[targetIndex].currentPosition = temp;

            setPieces(newPieces);
            setMoves(prev => prev + 1);
            setDraggedPiece(null);

            // Play swap sound
            playSwapSound();

            // Check if puzzle is complete
            checkCompletion(newPieces);
        }
    };

    const checkCompletion = (currentPieces: PuzzlePiece[]) => {
        const complete = currentPieces.every(
            piece => piece.currentPosition === piece.correctPosition
        );
        if (complete) {
            setIsComplete(true);
            // Play success sound
            playSuccessSound();
        }
    };

    const playSuccessSound = () => {
        if (typeof window !== 'undefined') {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Play a cheerful success melody
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
            backgroundPosition: `${piece.col * pieceSize}% ${piece.row * pieceSize}%`,
        };
    };

    const sortedPieces = [...pieces].sort((a, b) => a.currentPosition - b.currentPosition);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-background border-4 border-foreground rounded-lg p-4 sm:p-8 max-w-2xl w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-accent/10 rounded-lg border-2 border-foreground">
                            <div className="text-sm font-bold">
                                Moves: <span className="text-primary">{moves}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={initializePuzzle}
                                    className="border-2 border-foreground"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="border-2 border-foreground h-9 w-9"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Puzzle Grid */}
                        <div className="relative aspect-square w-full max-w-md mx-auto bg-muted/20 rounded-lg border-4 border-foreground overflow-hidden">
                            <div className="grid grid-cols-3 gap-1 p-1 h-full">
                                {sortedPieces.map((piece) => (
                                    <motion.div
                                        key={piece.id}
                                        layout
                                        draggable
                                        onDragStart={() => handleDragStart(piece.id)}
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(piece.currentPosition)}
                                        className={`relative cursor-move border-2 border-foreground rounded-sm overflow-hidden touch-none select-none ${piece.currentPosition === piece.correctPosition
                                            ? 'ring-2 ring-green-500'
                                            : ''
                                            }`}
                                        style={getPieceStyle(piece)}
                                        whileHover={{ scale: 1.05, zIndex: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Success Message */}
                        <AnimatePresence>
                            {isComplete && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-4 p-4 bg-green-500/20 border-2 border-green-500 rounded-lg text-center"
                                >
                                    <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                    <h3 className="font-headline text-xl font-bold text-green-500">
                                        🎉 Puzzle Complete!
                                    </h3>
                                    <p className="text-sm text-foreground/80 mt-1">
                                        Solved in {moves} moves!
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default JigsawPuzzle;
