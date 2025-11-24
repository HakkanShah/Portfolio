
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Maximize2, X } from 'lucide-react';
import type { Project } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onImageClick: (project: Project) => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose, onImageClick }: ProjectDetailsModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-[95vw] sm:w-full p-0 border-4 border-foreground bg-background max-h-[90vh] overflow-hidden"
        hideClose={true}
      >
        <div className="flex flex-col h-full">
          {/* Header with Custom Close Button */}
          <div className="relative p-4 sm:p-6 border-b-4 border-foreground bg-muted/30">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl sm:text-3xl md:text-4xl text-primary tracking-wider pr-12">
                {project.title}
              </DialogTitle>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 border-2 border-foreground hover:bg-destructive/10 hover:border-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row overflow-y-auto flex-1 min-h-0">
            {/* Project Image */}
            <motion.div 
              className="lg:w-2/5 relative h-64 sm:h-80 lg:h-auto cursor-pointer group"
              onClick={() => onImageClick(project)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover border-b-4 lg:border-b-0 lg:border-r-4 border-foreground"
                data-ai-hint={project.aiHint}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* Overlay hint */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center">
                  <Maximize2 className="h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto mb-2" />
                  <p className="text-white font-headline text-sm sm:text-base">
                    Click to Enlarge
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Project Details */}
            <div className="lg:w-3/5 p-4 sm:p-6 flex flex-col">
              <div className="space-y-4 sm:space-y-6 flex-1 pr-2">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-bold text-accent font-headline tracking-wide text-lg sm:text-xl mb-2 flex items-center gap-2">
                    📝 Description
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                    {project.longDescription}
                  </p>
                </motion.div>

                {/* Why I Built This */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="font-bold text-accent font-headline tracking-wide text-lg sm:text-xl mb-2 flex items-center gap-2">
                    💡 Why I Built This
                  </h4>
                  <p className="text-sm sm:text-base italic leading-relaxed text-foreground/80 bg-muted/30 p-3 sm:p-4 rounded-lg border-2 border-foreground/20">
                    {project.why}
                  </p>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-bold text-accent font-headline tracking-wide text-lg sm:text-xl mb-3 flex items-center gap-2">
                    🛠️ Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="border-2 border-foreground/30 text-xs sm:text-sm px-2 sm:px-3 py-1 hover:border-foreground hover:scale-105 transition-all"
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 sm:pt-6 border-t-2 border-foreground/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link 
                  href={project.liveUrl || '#'} 
                  target="_blank" 
                  className="flex-1"
                >
                  <Button 
                    variant="default" 
                    className="w-full font-bold border-2 border-foreground text-sm sm:text-base h-11 sm:h-12 shadow-md hover:shadow-lg transition-shadow" 
                    disabled={!project.liveUrl || project.liveUrl === '#'}
                  >
                    <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Live Demo
                  </Button>
                </Link>
                <Link 
                  href={project.repoUrl || '#'} 
                  target="_blank" 
                  className="flex-1"
                >
                  <Button 
                    variant="outline" 
                    className="w-full font-bold border-2 border-foreground text-sm sm:text-base h-11 sm:h-12 hover:bg-muted/50" 
                    disabled={!project.repoUrl || project.repoUrl === '#'}
                  >
                    <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    View Code
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
