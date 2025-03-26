import React from 'react';
import { motion } from 'framer-motion';

const RollUps = () => {
  // Define the size and positions for the building blocks
  const blockSize = 20;
  const gap = 4;
  const totalBlocks = 9;
  const rows = 3;
  const cols = 3;

  // Create array of block positions
  const blocks = Array.from({ length: totalBlocks }, (_, i) => ({
    id: i,
    row: Math.floor(i / cols),
    col: i % cols,
  }));

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full">
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            className="absolute bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-white rounded-sm"
            style={{
              width: blockSize,
              height: blockSize,
              left: block.col * (blockSize + gap),
              top: block.row * (blockSize + gap),
            }}
            initial={{ 
              scale: 0.5,
              opacity: 0,
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100,
              rotate: Math.random() * 360
            }}
            animate={{ 
              scale: 1,
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: block.id * 0.1,
              repeat: Infinity,
              repeatDelay: 2.5,
              duration: 0.5
            }}
            whileHover={{ scale: 1.1 }}
          >
            {/* Connector lines between blocks */}
            {block.col < cols - 1 && (
              <motion.div
                className="absolute top-1/2 -right-[6px] h-[2px] w-[6px] bg-zinc-900 dark:bg-white transform -translate-y-1/2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: block.id * 0.1 + 0.2,
                  duration: 0.2
                }}
              />
            )}
            {block.row < rows - 1 && (
              <motion.div
                className="absolute left-1/2 -bottom-[6px] w-[2px] h-[6px] bg-zinc-900 dark:bg-white transform -translate-x-1/2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: block.id * 0.1 + 0.2,
                  duration: 0.2
                }}
              />
            )}
          </motion.div>
        ))}

        {/* Central connecting circle */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-6 h-6 rounded-full bg-zinc-900 dark:bg-white transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: totalBlocks * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-zinc-900 dark:border-white"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default RollUps;