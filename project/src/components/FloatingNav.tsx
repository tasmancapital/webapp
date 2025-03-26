import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const FloatingNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // If no user, don't render anything
  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <MoreVertical className="w-5 h-5" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-2 min-w-[160px]"
            >
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FloatingNav;