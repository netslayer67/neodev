import React from 'react';
import { motion } from 'framer-motion';

export const PageLoader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="font-heading text-4xl text-white tracking-widest"
      >
        ND
      </motion.div>
    </div>
  );
};