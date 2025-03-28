import React, { useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { getContent, annotateContent } from '../lib/contentLoader';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events?: TimelineEvent[];
}

interface TimelineContent {
  type: string;
  title: string;
  description: string;
  events: TimelineEvent[];
}

const Timeline = (props: TimelineProps = {}) => {
  // Get content from JSON file
  const content = getContent<TimelineContent>('components/timeline-section');
  
  // Use props if provided, otherwise use content from JSON
  const events = props.events || content.events;
  
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
    <div 
      className="relative w-full overflow-hidden will-change-transform"
      {...annotateContent('components/timeline-section')}
    >
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
          {events && [...events, ...events].map((event, index) => (
            <div
              key={`${event.year}-${index}`}
              className="relative flex-none w-40 flex flex-col items-center group will-change-transform"
              data-sb-field-path={index < events.length ? `events.${index}` : `events.${index - events.length}`}
            >
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-primary transition-all duration-300 group-hover:scale-150 relative top-[5px] timeline-dot-pulse" />

              {/* Year */}
              <div 
                className="text-lg font-medium text-primary mt-2"
                data-sb-field-path=".year"
              >
                {event.year}
              </div>

              {/* Content */}
              <div className="text-center mt-6 px-2">
                <h3 
                  className="text-lg font-medium mb-2 text-foreground"
                  data-sb-field-path=".title"
                >
                  {event.title}
                </h3>
                <p 
                  className="text-base text-muted-foreground leading-snug"
                  data-sb-field-path=".description"
                >
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