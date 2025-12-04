'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/lib/data';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import AnimatedHamburgerIcon from './animated-hamburger-icon';
import AnimatedTitle from './animated-title';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionIds = NAV_LINKS.map(link => link.href);
  const activeId = useScrollSpy(sectionIds, { rootMargin: '-50% 0px -50% 0px' });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 border-b-4 border-foreground',
        isScrolled ? 'bg-background/80 backdrop-blur-sm' : 'bg-transparent'
      )}
    >
      <div className="section-container flex h-20 items-center justify-between">
        <Link href="/" className="block">
          <AnimatedTitle />
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  'font-headline text-lg tracking-wide transition-colors hover:text-primary',
                  activeId === link.href.substring(1)
                    ? 'text-primary'
                    : 'text-foreground/80'
                )}
              >
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="#contact">
            <Button variant="default" className="font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              Contact Me
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={toggleMenu} variant="ghost" size="icon" aria-label="Toggle Menu">
            <AnimatedHamburgerIcon isOpen={isOpen} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b-4 border-foreground overflow-hidden"
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="flex flex-col items-center space-y-2 py-4"
            >
              {NAV_LINKS.map(link => (
                <motion.div
                  key={link.href}
                  variants={{
                    open: { y: 0, opacity: 1 },
                    closed: { y: -20, opacity: 0 }
                  }}
                  className="w-full"
                >
                  <Link href={link.href} passHref>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full text-xl font-headline tracking-wider',
                        activeId === link.href.substring(1)
                          ? 'text-primary'
                          : 'text-foreground/80'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Button>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  open: { y: 0, opacity: 1 },
                  closed: { y: -20, opacity: 0 }
                }}
                className="w-full px-4 pt-2"
              >
                <Link href="#contact">
                  <Button
                    variant="default"
                    className="w-full font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact Me
                  </Button>
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
