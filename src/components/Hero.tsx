import CookieConsent from './CookieConsent';
import React from 'react';

interface HeroProps {
  heading?: string;
  subheading?: string;
  videoUrl?: string;
}

const Hero = ({ 
  heading = "Building Great Businesses Through Strategic Partnership", 
  subheading = "A leading private investment firm with a proven track record of creating value through strategic partnerships and operational excellence.", 
  videoUrl = "https://thinkenergy.au/tasman/tasman_capital_landing.mp4" 
}: HeroProps) => {
  return (
    <div 
      className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden"
      data-sb-object-id="hero"
    >
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
            data-sb-field-path="videoUrl"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/10"></div>
      </div>
      
      <div className="relative w-full">
        <div className="container-xl">
          <h1 
            className="heading-xl mb-4 md:mb-8 max-w-4xl"
            data-sb-field-path="heading"
          >
            {heading.split(' ').map((word, index, array) => {
              // Insert line breaks after specific words to create 3 lines
              const shouldAddBreak = 
                (index === 1 && array.length > 5) || // After "Great"
                (index === 3 && array.length > 5);   // After "Through"
              
              return (
                <React.Fragment key={index}>
                  <div className="relative inline-block text-foreground px-1">
                    <span className="relative z-10">{word}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent blur-2xl transform -skew-y-6"></div>
                  </div>
                  {shouldAddBreak && <br />}
                </React.Fragment>
              );
            })}
          </h1>
          <p 
            className="text-xl md:text-2xl text-foreground leading-relaxed max-w-2xl mb-8 md:mb-10 px-1"
            data-sb-field-path="subheading"
          >
            {subheading}
          </p>
        </div>
      </div>
      <CookieConsent />
    </div>
  );
};

export default Hero;
