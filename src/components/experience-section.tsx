'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE } from '@/lib/data';
import AnimatedDiv from './animated-div';
import { Briefcase, Sparkles, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ExperienceSection = () => {
  const [selectedOfferLetter, setSelectedOfferLetter] = useState<{ url: string; title: string } | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<typeof EXPERIENCE[0] | null>(null);
  const [isRealityMode, setIsRealityMode] = useState(false);

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="section-container">
        <AnimatedDiv className="text-center mb-12 sm:mb-16" variant="scale">
          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-wider mb-6">
            Experience
          </h2>
          
          {/* Resume vs Reality Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-bold transition-colors ${!isRealityMode ? 'text-primary' : 'text-muted-foreground'}`}>
              For Resume
            </span>
            <button
              onClick={() => setIsRealityMode(!isRealityMode)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                isRealityMode ? 'bg-rose-600' : 'bg-primary'
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isRealityMode ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-bold transition-colors ${isRealityMode ? 'text-rose-500 glitch-text' : 'text-muted-foreground'}`}>
              In Reality
            </span>
          </div>

          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {isRealityMode ? (
              <span className="text-rose-500 font-mono font-medium">Behind the scenes: The unfiltered developer experience.</span>
            ) : (
              "My professional journey and internships."
            )}
          </p>
        </AnimatedDiv>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-1 transform md:-translate-x-1/2 hidden md:block transition-colors duration-500 ${
            isRealityMode ? 'bg-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20'
          }`} />

          <div className="space-y-8 md:space-y-12">
            {EXPERIENCE.map((exp, index) => (
              <AnimatedDiv 
                key={index} 
                className={`flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
                delay={index * 200}
                variant="slide"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 border-background transform md:-translate-x-1/2 mt-6 hidden md:block z-10 transition-all duration-500 ${
                  isRealityMode 
                    ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.8)] scale-125' 
                    : 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]'
                }`} />

                {/* Content Card */}
                <div className="flex-1">
                  <motion.div 
                    className={`backdrop-blur-sm border-2 p-6 rounded-xl shadow-lg transition-all duration-500 group relative overflow-hidden ${
                      isRealityMode 
                        ? 'bg-rose-500/5 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)] hover:shadow-[0_0_50px_rgba(244,63,94,0.2)]' 
                        : 'bg-card/50 border-foreground/10 hover:shadow-xl hover:border-primary/50'
                    }`}
                    whileHover={{ y: -5, scale: isRealityMode ? 1.02 : 1 }}
                  >
                    {/* Hover Gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isRealityMode 
                        ? 'bg-gradient-to-br from-rose-500/10 to-transparent' 
                        : 'bg-gradient-to-br from-primary/5 to-transparent'
                    }`} />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className={`font-headline text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                            isRealityMode ? 'text-rose-500 font-mono tracking-tighter' : 'text-primary'
                          }`}>
                            {exp.role}
                          </h3>
                          
                          {/* Status Badge */}
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border transition-all duration-300 ${
                            isRealityMode 
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                              : exp.period === 'Present'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                : 'bg-muted border-foreground/10 text-muted-foreground'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isRealityMode 
                                ? 'bg-rose-500 animate-pulse' 
                                : exp.period === 'Present' 
                                  ? 'bg-emerald-500 animate-pulse' 
                                  : 'bg-muted-foreground'
                            }`} />
                            {exp.period}
                          </div>
                        </div>

                        {/* Company Name */}
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md transition-colors duration-300 ${
                            isRealityMode ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'
                          }`}>
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <span className={`font-bold text-base tracking-wide transition-colors duration-300 ${
                            isRealityMode ? 'text-foreground font-mono' : 'text-foreground/90'
                          }`}>
                            {exp.company}
                          </span>
                        </div>
                      </div>

                      <div className="relative min-h-[80px]">
                        <motion.p 
                          key={isRealityMode ? 'reality' : 'resume'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className={`mb-6 leading-relaxed ${
                            isRealityMode 
                              ? 'text-foreground font-mono text-sm border-l-2 border-rose-500 pl-4 italic' 
                              : 'text-foreground/80'
                          }`}
                        >
                          {/* @ts-ignore - reality exists in data but might not be in type definition yet */}
                          {isRealityMode ? exp.reality : exp.description}
                        </motion.p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`flex-1 sm:flex-none gap-2 font-bold transition-all duration-300 h-10 sm:h-9 py-2 sm:py-0 ${
                            isRealityMode 
                              ? 'border-rose-500/50 text-rose-500 hover:bg-rose-500/10' 
                              : 'border-primary/50 text-primary hover:bg-primary/10'
                          }`}
                          onClick={() => setSelectedDetails(exp)}
                        >
                          <Sparkles className="w-4 h-4" />
                          {isRealityMode ? "What I Actually Did" : "View Details"}
                        </Button>

                        <Button 
                          variant="default" 
                          size="sm" 
                          className={`flex-1 sm:flex-none gap-2 font-bold transition-all duration-300 h-10 sm:h-9 py-2 sm:py-0 ${
                            isRealityMode 
                              ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.6)] hover:shadow-[0_0_25px_rgba(244,63,94,0.8)]' 
                              : 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.6)] hover:shadow-[0_0_25px_rgba(var(--primary),0.8)]'
                          }`}
                          onClick={() => setSelectedOfferLetter({ url: exp.offerLetter, title: `${exp.company} Offer Letter` })}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {isRealityMode ? "Proof I Actually Did It" : "View Offer Letter"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Empty Space for Timeline Alignment */}
                <div className="flex-1 hidden md:block" />
              </AnimatedDiv>
            ))}
          </div>
        </div>
      </div>

      {/* Work Details Modal */}
      <Dialog open={!!selectedDetails} onOpenChange={() => setSelectedDetails(null)}>
        <DialogContent hideClose className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-foreground/20">
          <div className="relative">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-background/95 backdrop-blur-xl pb-4 border-b border-foreground/10 z-10">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl text-primary">
                  {selectedDetails?.role}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDetails?.company}
                </p>
              </DialogHeader>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDetails(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {selectedDetails?.details && (
              <div className="space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="font-headline text-lg font-bold text-primary mb-2 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    Project Overview
                  </h3>
                  <p className="text-foreground/80 leading-relaxed pl-3">
                    {selectedDetails.details.overview}
                  </p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className={`font-headline text-lg font-bold mb-3 flex items-center gap-2 ${
                    isRealityMode ? 'text-rose-500' : 'text-primary'
                  }`}>
                    <span className={`w-1 h-6 rounded-full ${
                      isRealityMode ? 'bg-rose-500' : 'bg-primary'
                    }`} />
                    {isRealityMode ? 'What I Actually Dealt With' : 'Key Responsibilities'}
                  </h3>
                  <ul className="space-y-2 pl-3">
                    {/* @ts-ignore - realityResponsibilities might not be in type definition yet */}
                    {(isRealityMode && selectedDetails.details.realityResponsibilities 
                      ? selectedDetails.details.realityResponsibilities 
                      : selectedDetails.details.responsibilities
                    ).map((item, idx) => (
                      <li key={idx} className={`flex items-start gap-3 ${
                        isRealityMode ? 'text-foreground/90 font-mono text-sm' : 'text-foreground/80'
                      }`}>
                        <span className={`mt-1.5 text-xs ${
                          isRealityMode ? 'text-rose-500' : 'text-primary'
                        }`}>▸</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="font-headline text-lg font-bold text-primary mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2 pl-3">
                    {selectedDetails.details.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className={`font-headline text-lg font-bold mb-3 flex items-center gap-2 ${
                    isRealityMode ? 'text-rose-500' : 'text-primary'
                  }`}>
                    <span className={`w-1 h-6 rounded-full ${
                      isRealityMode ? 'bg-rose-500' : 'bg-primary'
                    }`} />
                    {isRealityMode ? 'What I Actually Achieved' : 'Key Achievements'}
                  </h3>
                  <ul className="space-y-2 pl-3">
                    {/* @ts-ignore - realityAchievements might not be in type definition yet */}
                    {(isRealityMode && selectedDetails.details.realityAchievements 
                      ? selectedDetails.details.realityAchievements 
                      : selectedDetails.details.achievements
                    ).map((item, idx) => (
                      <li key={idx} className={`flex items-start gap-3 ${
                        isRealityMode ? 'text-foreground/90 font-mono text-sm' : 'text-foreground/80'
                      }`}>
                        <span className={`mt-1.5 ${
                          isRealityMode ? 'text-rose-500' : 'text-primary'
                        }`}>✓</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Offer Letter Preview Modal */}
      <Dialog open={!!selectedOfferLetter} onOpenChange={() => setSelectedOfferLetter(null)}>
        <DialogContent hideClose className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-background/95 backdrop-blur-xl border-foreground/20">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-foreground/10">
              <DialogHeader>
                <DialogTitle className="font-headline text-xl">
                  {selectedOfferLetter?.title}
                </DialogTitle>
              </DialogHeader>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOfferLetter(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 bg-muted/20 p-1 overflow-hidden">
              {selectedOfferLetter && (
                <iframe 
                  src={`${selectedOfferLetter.url}#toolbar=0`} 
                  className="w-full h-full rounded-md border border-foreground/10"
                  title="Offer Letter Preview"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <style jsx global>{`
        .glitch-text {
          position: relative;
          animation: glitch 1s linear infinite;
        }
        @keyframes glitch {
          2%, 64% { transform: translate(2px,0) skew(0deg); }
          4%, 60% { transform: translate(-2px,0) skew(0deg); }
          62% { transform: translate(0,0) skew(5deg); }
        }
      `}</style>
    </section>
  );
};

export default ExperienceSection;
