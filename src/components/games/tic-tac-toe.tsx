'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, X, Circle } from 'lucide-react';

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

    const handleClick = (index: number) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    useEffect(() => {
        checkWinner();
    }, [board]);

    const checkWinner = () => {
        for (const combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinner(board[a]);
                return;
            }
        }

        if (!board.includes(null)) {
            setWinner('Draw');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-background p-2 sm:p-4">
            <div className="flex justify-between items-center w-full mb-3 sm:mb-6">
                <h2 className="font-headline text-lg sm:text-2xl font-bold text-primary">Tic Tac Toe</h2>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div className="mb-3 sm:mb-4 text-sm sm:text-lg font-bold text-center">
                {winner ? (
                    winner === 'Draw' ? (
                        <span className="text-yellow-500">It's a Draw!</span>
                    ) : (
                        <span className="text-green-500">Winner: {winner}</span>
                    )
                ) : (
                    <span>Next Player: <span className={isXNext ? 'text-blue-500' : 'text-red-500'}>{isXNext ? 'X' : 'O'}</span></span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-6 w-full aspect-square max-w-[280px] sm:max-w-[300px]">
                {board.map((cell, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleClick(index)}
                        className={`flex items-center justify-center text-3xl sm:text-4xl font-bold rounded-lg border-2 border-foreground/20 ${cell === 'X' ? 'bg-blue-500/10 text-blue-500' : cell === 'O' ? 'bg-red-500/10 text-red-500' : 'bg-muted/30 hover:bg-muted/50'
                            }`}
                    >
                        {cell === 'X' && <X className="w-10 h-10 sm:w-12 sm:h-12" />}
                        {cell === 'O' && <Circle className="w-8 h-8 sm:w-10 sm:h-10" />}
                    </motion.button>
                ))}
            </div>

            <Button onClick={resetGame} className="w-full max-w-[280px] sm:max-w-[300px]">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Game
            </Button>
        </div>
    );
}
