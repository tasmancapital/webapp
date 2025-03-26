import React, { useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const timelineEvents = [
  {
    year: '1999',
    title: 'Deutsche Bank Capital Partners',
    description: 'The core of the Tasman team commenced worked together at Deutsche Bank Capital Partners'
  },
  {
    year: '2006',
    title: 'Nikko Principal Investments',
    description: 'Team joins Nikko Principal Investments'
  },
  {
    year: '2007',
    title: 'Citigroup Acquisition',
    description: 'Citigroup acquired Nikko Cordial Corporation and decided to sell the Australian Operations'
  },
  {
    year: '2008',
    title: 'Tasman Capital Formation',
    description: 'Tasman Capital formed via an MBO of Nikko Citi'
  },
  {
    year: '2017',
    title: 'Serenitas Joint Venture',
    description: 'Tasman and GIC formed JV Serenitas for rollup of the RLLC sector – 1st Fund'
  },
  {
    year: '2019',
    title: 'Holiday Parks Venture',
    description: 'JV Tasman Holiday Parks formed for roll up of the industry in Australia / NZ – 2nd Fund'
  },
  {
    year: '2024',
    title: 'Serenitas Exit',
    description: 'Serenitas exited with Tasman retaining a 19.9% stake raised through a continuation fund'
  },
  {
    year: '2025',
    title: 'Mid-Market Fund Launch- Current',
    description: 'Tasman launch mid-market fund – Fund IV'
  }
];

const Timeline = () => {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      x: [0, -2070],
      transition: {
        duration: 60,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0
      }
    });
  }, []);

  return (
    <div className="relative w-full overflow-hidden will-change-transform">
      <div className="relative">
        {/* Main horizontal line */}
        <div className="absolute left-0 right-0 h-px bg-primary/40 top-6" />

        <motion.div 
          animate={controls}
          style={{ 
            width: "max-content",
            paddingLeft: "3rem",
            paddingRight: "3rem",
            willChange: "transform"
          }}
          className="flex flex-nowrap gap-12 py-4"
        >
          {[...timelineEvents, ...timelineEvents].map((event, index) => (
            <div
              key={`${event.year}-${index}`}
              className="relative flex-none w-40 flex flex-col items-center group will-change-transform"
            >
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-primary transition-all duration-300 group-hover:scale-150 relative top-[5px] timeline-dot-pulse" />

              {/* Year */}
              <div className="text-lg font-medium text-primary mt-2">
                {event.year}
              </div>

              {/* Content */}
              <div className="text-center mt-6 px-2">
                <h3 className="text-lg font-medium mb-2 text-foreground">
                  {event.title}
                </h3>
                <p className="text-base text-muted-foreground leading-snug">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
export default Timeline;