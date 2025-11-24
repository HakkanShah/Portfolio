
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, X } from 'lucide-react';
import AnimatedDiv from './animated-div';

interface FullScreenImageModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenImageModal = ({ project, isOpen, onClose }: FullScreenImageModalProps) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setShowButton(false);
      timer = setTimeout(() => {
        setShowButton(true);
      }, 1000); // 1 second delay
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideClose className="bg-transparent border-none shadow-none p-0 w-screen h-screen max-w-none flex items-center justify-center">
        <DialogTitle className="sr-only">{project.title}</DialogTitle>
        <div className="relative w-full h-full" onClick={onClose}>
            <Image
                src={project.thumbnail}
                alt={project.title}
                layout="fill"
                objectFit="contain"
            />
        </div>
        
        <DialogClose asChild>
            <Button
                variant="ghost"
                className="absolute top-4 right-4 h-12 w-12 p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
            >
                <X className="h-8 w-8" />
            </Button>
        </DialogClose>

        {showButton && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <AnimatedDiv
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            >
                <Link href={project.liveUrl || '#'} target="_blank" passHref>
                    <Button
                        variant="secondary"
                        size="lg"
                        className="font-bold border-2 border-foreground shadow-lg text-lg"
                        disabled={!project.liveUrl || project.liveUrl === '#'}
                    >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Visit Site
                    </Button>
                </Link>
            </AnimatedDiv>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageModal;
