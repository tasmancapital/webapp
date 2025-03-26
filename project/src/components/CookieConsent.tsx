import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Temporarily disabled
const COOKIE_CONSENT_ENABLED = false;

const CookieConsent = () => {
  // Return null when disabled
  if (!COOKIE_CONSENT_ENABLED) return null;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="container-xl">
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/80 dark:bg-white/10 border border-zinc-200 dark:border-white/20 p-6 shadow-xl pointer-events-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-zinc-600 dark:text-zinc-200">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking "Accept", you consent to our use of cookies.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 text-sm font-medium text-zinc-900 dark:text-white bg-zinc-900/5 hover:bg-zinc-900/10 dark:bg-white/10 dark:hover:bg-white/20 rounded-lg transition-colors"
              >
                Accept
              </button>
            </div>
            <button
              onClick={handleDecline}
              className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;