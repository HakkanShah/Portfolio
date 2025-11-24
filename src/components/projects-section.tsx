
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PROJECTS, type Project } from '@/lib/data';
import AnimatedDiv from './animated-div';
import Card3D from './3d-card';
import { Eye, ExternalLink, Github } from 'lucide-react';
import ProjectDetailsModal from './project-details-modal';
import FullScreenImageModal from './full-screen-image-modal';
import { motion } from 'framer-motion';

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [fullScreenProject, setFullScreenProject] = useState<Project | null>(null);

  const handleImageClick = (project: Project) => {
    setSelectedProject(null);
    setFullScreenProject(project);
  };

  return (
    <>
      <section id="projects" className="section-padding relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="section-container relative z-10">
          <AnimatedDiv className="text-center mb-8 sm:mb-12 md:mb-16" variant="scale">
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-wider">
              My Projects
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground px-4">
              A selection of my work, from full-stack applications to fun experiments.
            </p>
          </AnimatedDiv>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {PROJECTS.map((project, index) => (
              <AnimatedDiv key={project.title} delay={index * 100} variant="slide">
                <Card3D className="h-full" intensity={10}>
                  <motion.div 
                    className="h-full flex flex-col overflow-hidden bg-background border-4 border-foreground rounded-lg shadow-lg group"
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {/* Project Image */}
                    <div 
                      className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover border-b-4 border-foreground transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={project.aiHint}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* Shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <h3 className="font-headline text-lg sm:text-xl md:text-2xl text-white tracking-wide drop-shadow-lg line-clamp-1">
                          {project.title}
                        </h3>
                      </div>
                      
                      {/* View icon hint */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute top-3 right-3 bg-background/90 p-2 rounded-full border-2 border-foreground"
                      >
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>
                    </div>

                    {/* Project Content */}
                    <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
                      {/* Description */}
                      <p className="text-xs sm:text-sm text-foreground/80 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 flex-grow">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {project.tags.slice(0, 4).map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="border border-foreground/30 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 4 && (
                          <Badge 
                            variant="outline" 
                            className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 border-foreground/50"
                          >
                            +{project.tags.length - 4}
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-bold border-2 border-foreground text-xs sm:text-sm flex-1 h-8 sm:h-9"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Details
                        </Button>
                        <Link 
                          href={project.liveUrl || '#'} 
                          target="_blank" 
                          className="flex-1"
                        >
                          <Button 
                            size="sm" 
                            className="font-bold border-2 border-foreground text-xs sm:text-sm w-full h-8 sm:h-9" 
                            disabled={!project.liveUrl || project.liveUrl === '#'}
                          >
                            <ExternalLink className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Live Demo</span>
                            <span className="sm:hidden">Demo</span>
                          </Button>
                        </Link>
                      </div>

                      {/* GitHub Link (if available) */}
                      {project.repoUrl && project.repoUrl !== '#' && (
                        <Link 
                          href={project.repoUrl} 
                          target="_blank"
                          className="mt-2"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs border border-foreground/30 hover:border-foreground h-7 sm:h-8"
                          >
                            <Github className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            View Code
                          </Button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </Card3D>
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </section>
      
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onImageClick={handleImageClick}
      />
      <FullScreenImageModal 
        project={fullScreenProject}
        isOpen={!!fullScreenProject}
        onClose={() => setFullScreenProject(null)}
      />
    </>
  );
};

export default ProjectsSection;
