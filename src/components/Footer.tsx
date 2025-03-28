import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext';
import { Linkedin } from 'lucide-react';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="container-xl py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/">
              <img 
                src={theme === 'dark' 
                  ? "/images/logo-white.png"
                  : "/images/logo-black.png"
                }
                alt="Tasman Capital"
                className="h-8 md:h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A leading private investment firm focused on partnering with exceptional 
              management teams to build great businesses.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Company</h3>
            <div className="space-y-2.5">
              <Link to="/about" className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">About</Link>
              <Link to="/investments" className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Investments</Link>
              <Link to="/team" className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Team</Link>
              
              <Link to="/contact" className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Contact Us</h3>
            <div className="space-y-2.5">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                3603/60 Margaret St<br />
                Sydney NSW 2000<br />
                Australia
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <a href="mailto:enquiries@tasmancapital.com.au" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  enquiries@tasmancapital.com.au
                </a>
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <a 
                  href="https://www.linkedin.com/company/tasman-capital-partners/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  Follow us on LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Tasman Capital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;