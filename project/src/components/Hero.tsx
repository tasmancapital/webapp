import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CookieConsent from './CookieConsent';

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          <video
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 w-[180%] h-[180%] md:w-[150%] md:h-[150%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90 will-change-transform object-cover"
            style={{
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          >
            <source src="https://thinkenergy.au/tasman/tasman_capital_landing.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/10"></div>
      </div>
      
      <div className="relative w-full">
        <div className="container-xl">
          <h1 className="heading-xl mb-4 md:mb-8 max-w-5xl">
            <div className="relative inline-block text-foreground px-1">
              <span className="relative z-10">Building Great</span>
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent blur-2xl transform -skew-y-6"></div>
            </div><br />
            <div className="relative inline-block text-foreground px-1">
              <span className="relative z-10">Businesses Through</span>
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent blur-2xl transform -skew-y-6"></div>
            </div><br />
            <div className="relative inline-block text-foreground px-1">
              <span className="relative z-10">Strategic Partnership</span>
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent blur-2xl transform -skew-y-6"></div>
            </div>
          </h1>
          <p className="text-xl md:text-2xl text-foreground leading-relaxed max-w-2xl mb-8 md:mb-10 px-1">
            A leading private investment firm with a proven track record of 
            creating value through strategic partnerships and operational excellence.
          </p>
        </div>
      </div>
      <CookieConsent />
    </div>
  );
};

export default Hero;