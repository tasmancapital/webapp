import React from 'react';
import { motion } from 'framer-motion';

const OperationalGear = () => {
  // Calculate gear ratios based on tooth count
  const mainGearTeeth = 16;
  const secondaryGearTeeth = 12;
  const thirdGearTeeth = 10;
  const mainSpeed = 10; // Base rotation speed in seconds
  const secondarySpeed = mainSpeed * (mainGearTeeth / secondaryGearTeeth);
  const thirdSpeed = mainSpeed * (mainGearTeeth / thirdGearTeeth);

  const mainGearRadius = 40;
  const secondaryGearRadius = (secondaryGearTeeth / mainGearTeeth) * mainGearRadius;
  const thirdGearRadius = (thirdGearTeeth / mainGearTeeth) * mainGearRadius;

  // Calculate tighter positions for proper meshing
  const meshingGap = 2; // Small gap for visual meshing
  const secondaryGearOffset = mainGearRadius + secondaryGearRadius - meshingGap;
  const thirdGearOffset = mainGearRadius + thirdGearRadius - meshingGap;

  return (
    <div className="absolute bottom-6 right-6 w-24 h-24 flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Main gear */}
        <motion.div 
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: mainSpeed,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              className="fill-zinc-100 dark:fill-zinc-800 stroke-zinc-900 dark:stroke-white" 
              strokeWidth="2"
            />
            {[...Array(mainGearTeeth)].map((_, i) => {
              const angle = (i * 360) / mainGearTeeth;
              const x1 = 50 + Math.cos((angle * Math.PI) / 180) * 40;
              const y1 = 50 + Math.sin((angle * Math.PI) / 180) * 40;
              const x2 = 50 + Math.cos((angle * Math.PI) / 180) * 48;
              const y2 = 50 + Math.sin((angle * Math.PI) / 180) * 48;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-zinc-900 dark:stroke-white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
            <circle 
              cx="50" 
              cy="50" 
              r="30" 
              className="fill-none stroke-zinc-900 dark:stroke-white" 
              strokeWidth="2"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="20" 
              className="fill-none stroke-zinc-900 dark:stroke-white" 
              strokeWidth="2"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="8" 
              className="fill-zinc-900 dark:fill-white"
            />
          </svg>
        </motion.div>

        {/* Secondary gear */}
        <motion.div
          className="absolute"
          style={{
            right: `-${secondaryGearRadius * 1.15}px`,
            top: `-${secondaryGearRadius * 1.45}px`,
            width: `${secondaryGearRadius * 2.4}px`,
            height: `${secondaryGearRadius * 2.4}px`,
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: secondarySpeed,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              className="fill-zinc-100 dark:fill-zinc-800 stroke-zinc-900 dark:stroke-white" 
              strokeWidth="2"
            />
            {[...Array(secondaryGearTeeth)].map((_, i) => {
              const angle = (i * 360) / secondaryGearTeeth;
              const x1 = 50 + Math.cos((angle * Math.PI) / 180) * 40;
              const y1 = 50 + Math.sin((angle * Math.PI) / 180) * 40;
              const x2 = 50 + Math.cos((angle * Math.PI) / 180) * 48;
              const y2 = 50 + Math.sin((angle * Math.PI) / 180) * 48;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-zinc-900 dark:stroke-white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
            <circle 
              cx="50" 
              cy="50" 
              r="25" 
              className="fill-none stroke-zinc-900 dark:stroke-white" 
              strokeWidth="2"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="6" 
              className="fill-zinc-900 dark:fill-white"
            />
          </svg>
        </motion.div>

        {/* Third gear */}
        <motion.div
          className="absolute"
          style={{
            left: `-${thirdGearRadius * 1.2}px`,
            bottom: `-${thirdGearRadius * 1.2}px`,
            width: `${thirdGearRadius * 2.4}px`,
            height: `${thirdGearRadius * 2.4}px`,
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: thirdSpeed,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              className="fill-zinc-100 dark:fill-zinc-800 stroke-zinc-900 dark:stroke-white" 
              strokeWidth="2"
            />
            {[...Array(thirdGearTeeth)].map((_, i) => {
              const angle = (i * 360) / thirdGearTeeth;
              const x1 = 50 + Math.cos((angle * Math.PI) / 180) * 40;
              const y1 = 50 + Math.sin((angle * Math.PI) / 180) * 40;
              const x2 = 50 + Math.cos((angle * Math.PI) / 180) * 48;
              const y2 = 50 + Math.sin((angle * Math.PI) / 180) * 48;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-zinc-900 dark:stroke-white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
            <circle 
              cx="50" 
              cy="50" 
              r="20" 
              className="fill-none stroke-zinc-900 dark:stroke-white" 
              strokeWidth="2"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="5" 
              className="fill-zinc-900 dark:fill-white"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default OperationalGear;