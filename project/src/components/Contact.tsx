import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/">
              <img 
                src={theme === 'dark' 
                  ? "https://images.squarespace-cdn.com/content/v1/5cfb3b4c8dc2800001e3c051/1560212577657-1SDBN96G0K8QXMZX5IJ3/Tas+stacked+white.png"
                  : "https://thinkenergy.au/tasman/logo-black.png"
                }
                alt="Tasman Capital"
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A leading private investment firm focused on partnering with exceptional 
              management teams to build great businesses.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Company</h3>
            <div className="space-y-3">
              <Link to="/about" className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">About Us</Link>
              <Link to="/team" className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Our Team</Link>
              <Link to="/investments" className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Investments</Link>
              <Link to="/contact" className="block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                3603/60 Margaret St<br />
                Sydney NSW 2000<br />
                Australia
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <a href="tel:+61289991090" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  +61 2 8999 1090
                </a>
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <a href="mailto:info@tasmancapital.com.au" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  info@tasmancapital.com.au
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

        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Tasman Capital. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-use" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;