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
    <footer className="bg-[#1a1a1a] text-white border-t-4 border-foreground relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />

      <div className="section-container section-padding !py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Brand & Copyright */}
          <div className="text-center md:text-left space-y-4">
            <Link href="/" className="font-headline text-2xl font-bold tracking-wider text-primary hover:text-white transition-colors">
              Hakkan
            </Link>
            <p className="text-sm text-gray-400 font-mono">
              &copy; {currentYear} Hakkan Parbej Shah.<br />All rights reserved.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-500 font-body">
              <span>Building digital experiences with passion.</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              {SOCIAL_LINKS.map((social, index) => (
                <motion.div key={social.name} whileHover={{ y: -5 }}>
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <div className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-primary hover:border-primary transition-all duration-300 group">
                      <social.icon className="h-5 w-5 text-gray-300 group-hover:text-white" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1 font-body">
              Made with <Heart size={10} className="text-red-500 fill-red-500" /> & <Code size={10} className="text-blue-500" />
            </p>
          </div>

          {/* Back to Top */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <Button 
              onClick={scrollToTop}
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-full border-2 border-white/20 bg-white/5 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
            >
              <ArrowUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
            </Button>
            <p className="text-xs text-gray-500 font-body">
              Back to Top
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-black py-2 text-center">
        <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
          Designed & Developed by Hakkan
        </p>
      </div>
    </footer>
  );
};

export default Footer;
