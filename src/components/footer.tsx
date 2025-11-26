'use client';

import { SOCIAL_LINKS } from '@/lib/data';
import Link from 'next/link';
import { ArrowUp, Terminal, Heart, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a0a0a] text-white border-t-4 border-foreground relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 z-20" />
      
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      <div className="section-container section-padding !py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-center">
          
          {/* Brand & Copyright */}
          <div className="text-center md:text-left space-y-5">
            <Link href="/" className="group inline-block">
              <h2 className="font-headline text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-white group-hover:to-primary transition-all duration-500">
                Hakkan
              </h2>
              <div className="h-1 w-0 group-hover:w-full bg-primary transition-all duration-500 rounded-full mt-1" />
            </Link>
            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-mono leading-relaxed">
                &copy; {currentYear} Hakkan Parbej Shah.<br />All rights reserved.
              </p>
              <p className="text-xs text-gray-500 font-body italic">
                "Turning coffee into code since 2022."
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center space-y-6">
            <p className="text-sm font-bold tracking-widest uppercase text-primary/80">
              Connect with me
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social, index) => (
                <motion.div 
                  key={social.name} 
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white relative z-10 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-xs text-gray-400 flex items-center gap-1.5 font-body">
                Made with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> & <Code size={12} className="text-blue-500" /> by Hakkan
              </p>
            </div>
          </div>

          {/* Back to Top */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                onClick={scrollToTop}
                variant="outline" 
                size="icon"
                className="h-14 w-14 rounded-full border-2 border-white/10 bg-white/5 hover:bg-primary hover:border-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.6)] text-gray-400 hover:text-white transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100" />
                <ArrowUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform relative z-10" />
              </Button>
            </motion.div>
            <p className="text-xs text-gray-500 font-body tracking-wider uppercase hidden md:block">
              Back to Top
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-black/50 backdrop-blur-md py-3 text-center border-t border-white/5 relative z-10">
        <p className="text-[10px] text-gray-600 font-mono tracking-[0.2em] uppercase hover:text-primary transition-colors cursor-default">
          Designed & Developed by Hakkan
        </p>
      </div>
    </footer>
  );
};

export default Footer;
