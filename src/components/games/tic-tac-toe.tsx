'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, X } from 'lucide-react';

interface TicTacToeProps {
    onClose?: () => void;
}

type Player = 'X' | 'O';
type BoardState = (Player | null)[];

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function TicTacToe({ onClose }: TicTacToeProps) {
    const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<Player | 'Draw' | null>(null);

    const playMoveSound = () => {
        if (typeof window === 'undefined') return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // "Pop" sound
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // Ignore audio errors
        }
    };

    const handleClick = (index: number) => {
        // Prevent move if cell filled, game over, or it's computer's turn (X)
        if (board[index] || winner || isXNext) return;

        playMoveSound();
        const newBoard = [...board];
        newBoard[index] = 'O';
        setBoard(newBoard);
        setIsXNext(true); // Switch to Computer
    };

    // Computer Move (AI)
    useEffect(() => {
        if (isXNext && !winner && board.includes(null)) {
            // Small delay for realism
            const timer = setTimeout(() => {
                const bestMove = getBestMove(board);
                if (bestMove !== -1) {
                    playMoveSound();
                    const newBoard = [...board];
                    newBoard[bestMove] = 'X';
                    setBoard(newBoard);
                    setIsXNext(false); // Switch to User
                }
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, winner, board]);

    const getBestMove = (currentBoard: BoardState): number => {
        let bestScore = -Infinity;
        let move = -1;

        for (let i = 0; i < 9; i++) {
            if (!currentBoard[i]) {
                currentBoard[i] = 'X';
                const score = minimax(currentBoard, 0, false);
                currentBoard[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    const minimax = (currentBoard: BoardState, depth: number, isMaximizing: boolean): number => {
        const result = checkWinnerState(currentBoard);
        if (result === 'X') return 10 - depth;
        if (result === 'O') return depth - 10;
        if (result === 'Draw') return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!currentBoard[i]) {
                    currentBoard[i] = 'X';
                    const score = minimax(currentBoard, depth + 1, false);
                    currentBoard[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!currentBoard[i]) {
                    currentBoard[i] = 'O';
                    const score = minimax(currentBoard, depth + 1, true);
                    currentBoard[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const checkWinnerState = (currentBoard: BoardState): Player | 'Draw' | null => {
        for (const combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        if (!currentBoard.includes(null)) return 'Draw';
        return null;
    };

    useEffect(() => {
        const result = checkWinnerState(board);
        if (result) setWinner(result);
    }, [board]);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true); // Computer starts
        setWinner(null);
    };

    return (
        <div className="flex flex-col items-center w-full h-full bg-background p-4 relative overflow-hidden">
            <div className="flex flex-col items-center justify-center w-full shrink-0 z-20 mb-4">
                <div className="flex items-center justify-center w-full max-w-[320px] mb-2">
                    <h2 className="font-headline text-lg sm:text-xl font-bold text-primary">Tic Tac Toe</h2>
                </div>

                <div className="flex justify-between w-full max-w-[320px] mb-4 text-sm font-bold">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${isXNext ? 'bg-primary/10 ring-1 ring-primary shadow-[0_0_10px_rgba(0,255,157,0.2)]' : 'opacity-50 grayscale'}`}>
                        <div className="relative">
                            <img src="https://github.com/HakkanShah.png" alt="Me" className="w-6 h-6 rounded-full ring-2 ring-background" />
                            {isXNext && !winner && <motion.div layoutId="active-indicator" className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
                        </div>
                        <span>Me</span>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        {winner ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-sm font-bold px-3 py-1 rounded-full ${winner === 'X' ? 'bg-blue-500/20 text-blue-400' : winner === 'O' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
                            >
                                {winner === 'X' ? 'I Won!' : winner === 'O' ? 'You Won!' : 'Draw!'}
                            </motion.div>
                        ) : (
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">VS</span>
                        )}
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${!isXNext ? 'bg-primary/10 ring-1 ring-primary shadow-[0_0_10px_rgba(0,255,157,0.2)]' : 'opacity-50 grayscale'}`}>
                        <span>You</span>
                        <div className="relative">
                            <span className="text-xl leading-none">🤡</span>
                            {!isXNext && !winner && <motion.div layoutId="active-indicator" className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full flex items-center justify-center min-h-0 relative z-10">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[320px] h-full max-h-[320px]">
                    {board.map((cell, index) => (
                        <motion.button
                            key={index}
                            whileHover={!cell && !winner && !isXNext ? { scale: 1.02 } : {}}
                            whileTap={!cell && !winner && !isXNext ? { scale: 0.98 } : {}}
                            onClick={() => handleClick(index)}
                            className={`relative flex items-center justify-center rounded-xl border-2 transition-colors duration-300 ${cell === 'X'
                                ? 'bg-blue-500/10 border-blue-500/50'
                                : cell === 'O'
                                    ? 'bg-green-500/10 border-green-500/50'
                                    : 'bg-muted/20 border-transparent hover:bg-muted/30'
                                } ${!cell && !winner && !isXNext ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {cell === 'X' && (
                                <motion.img
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    src="https://github.com/HakkanShah.png"
                                    alt="Hakkan"
                                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-lg"
                                />
                            )}
                            {cell === 'O' && (
                                <motion.span
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="text-4xl sm:text-5xl drop-shadow-lg"
                                >
                                    🤡
                                </motion.span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-[320px] mt-4 z-20 shrink-0">
                <Button onClick={resetGame} className="w-full font-bold" variant={winner ? "default" : "secondary"}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {winner ? 'Play Again' : 'Reset Board'}
                </Button>
            </div>
        </div>
    );
}
