'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, RotateCcw, Trophy } from 'lucide-react';
import { Button } from './ui/button';

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
    <div className="w-full h-full flex flex-col p-1 sm:p-2">
      {/* Stats */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2 p-1.5 sm:p-2 bg-accent/10 rounded-lg border border-foreground shrink-0">
        <div className="text-[10px] sm:text-xs font-bold">
          Moves: <span className="text-primary">{moves}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={initializePuzzle}
          className="h-5 sm:h-6 text-[10px] sm:text-xs border border-foreground px-1.5 sm:px-2"
        >
          <RotateCcw className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
          Reset
        </Button>
      </div>

      {/* Puzzle Grid */}
      <div className="relative aspect-square w-full bg-muted/20 rounded-lg border-2 border-foreground overflow-hidden flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-0.5 p-0.5 h-full w-full max-h-full">
          {sortedPieces.map((piece) => (
            <motion.div
              key={piece.id}
              layout
              draggable
              onDragStart={() => handleDragStart(piece.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(piece.currentPosition)}
              className={`relative cursor-move border border-foreground rounded-sm overflow-hidden touch-none select-none ${piece.currentPosition === piece.correctPosition
                  ? 'ring-1 sm:ring-2 ring-green-500 z-10'
                  : ''
                }`}
              style={getPieceStyle(piece)}
              whileHover={{ scale: 1.05, zIndex: 20 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Piece number indicator */}
              <div className="absolute top-0 right-0 bg-foreground/80 text-background text-[8px] sm:text-[10px] px-0.5 sm:px-1 py-0 rounded-bl font-bold opacity-50 hover:opacity-100">
                {piece.id + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1.5 sm:mt-2 p-1.5 sm:p-2 bg-green-500/20 border border-green-500 rounded-lg text-center shrink-0"
          >
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mx-auto mb-0.5 sm:mb-1" />
            <h3 className="font-headline text-xs sm:text-sm font-bold text-green-500">
              🎉 Complete!
            </h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JigsawPuzzle;
