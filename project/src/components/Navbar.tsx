import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import WaveAnimation from './WaveAnimation';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { theme } = useTheme();

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'backdrop-blur-md bg-background/80 border-b border-border/50' : ''
    }`}>
      <div className="container-xl px-3 sm:px-4">
        <div className="flex justify-between h-16 sm:h-20 md:h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center relative z-50">
              <img 
                src={theme === 'dark' 
                  ? "https://images.squarespace-cdn.com/content/v1/5cfb3b4c8dc2800001e3c051/1560212577657-1SDBN96G0K8QXMZX5IJ3/Tas+stacked+white.png"
                  : "https://thinkenergy.au/tasman/logo-black.png"
                }
                alt="Tasman Capital"
                className="h-8 sm:h-10 md:h-12 w-auto transition-opacity duration-300 hover:opacity-80"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-foreground/40 after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </Link>
            <Link 
              to="/investments" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-foreground/40 after:transition-all after:duration-300 hover:after:w-full"
            >
              Investments
            </Link>
            <Link 
              to="/team" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-foreground/40 after:transition-all after:duration-300 hover:after:w-full"
            >
              Team
            </Link>
            <Link 
              to="/contact"
              className="px-6 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-2xl transition-all duration-300 uppercase tracking-wider"
            >
              Contact
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground transition-colors relative z-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-md z-40 overflow-hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 w-full h-full flex flex-col bg-gradient-to-b from-white/5 to-transparent dark:from-white/10 dark:to-transparent"
            >
              
              <nav className="relative z-10 flex-1 pt-24">
                {[
                  { to: "/about", label: "About" },
                  { to: "/investments", label: "Investments" },
                  { to: "/team", label: "Team" },
                  { to: "/contact", label: "Contact" }
                ].map((link) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="block"
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between w-full px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-white/5 dark:hover:bg-white/10 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex items-center justify-between w-full">
                      <span>{link.label}</span>
                      <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 p-6 pb-24"
              >
                <div className="relative">
                  <p className="text-sm text-muted-foreground/60 mb-2">Get in touch</p>
                  <a
                    href="tel:+61289991090"
                    className="text-base font-medium text-foreground hover:text-primary transition-colors"
                  >
                    +61 2 8999 1090
                  </a>
                </div>
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 h-32">
                <WaveAnimation />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;