
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PROJECTS, type Project } from '@/lib/data';
import AnimatedDiv from './animated-div';
import Card3D from './3d-card';
import { Eye } from 'lucide-react';
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
      <section id="projects" className="section-padding relative">
        <div className="section-container">
          <AnimatedDiv className="text-center mb-12 sm:mb-16" variant="scale">
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-wider">
              My Projects
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground px-4">
              A selection of my work, from full-stack applications to fun experiments.
            </p>
          </AnimatedDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {PROJECTS.map((project, index) => (
              <AnimatedDiv key={project.title} delay={index * 100} variant="slide">
                <Card3D className="h-full" intensity={10}>
                  <motion.div 
                    className="h-full flex flex-col overflow-hidden bg-background border-4 border-foreground rounded-lg group"
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div 
                      className="relative aspect-video overflow-hidden cursor-pointer"
                      onClick={() => setFullScreenProject(project)}
                    >
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover border-b-4 border-foreground transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={project.aiHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      {/* Shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <h3 className="font-headline text-xl sm:text-2xl text-white tracking-wide absolute bottom-2 left-4 p-2 drop-shadow-lg">
                        {project.title}
                      </h3>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-sm text-foreground/80 mt-2 flex-grow line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 my-4">
                        {project.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="border border-foreground/30 text-xs">{tag}</Badge>
                        ))}
                        {project.tags.length > 3 && <Badge variant="outline" className="text-xs">+{project.tags.length - 3}</Badge>}
                      </div>
                      <div className="flex justify-end gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-bold border-2 border-foreground text-xs sm:text-sm"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Details
                        </Button>
                        <Link href={project.liveUrl || '#'} target="_blank" passHref>
                          <Button 
                            size="sm" 
                            className="font-bold border-2 border-foreground text-xs sm:text-sm" 
                            disabled={!project.liveUrl || project.liveUrl === '#'}
                          >
                            Live Demo
                          </Button>
                        </Link>
                      </div>
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
