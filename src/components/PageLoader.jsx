import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Luxury PageLoader
 * A premium loading component with glassmorphism and subtle animations.
 */
const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center w-64 h-64 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="mb-6"
        >
          <Loader2 className="w-10 h-10 text-white/80" strokeWidth={1.25} />
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-white text-lg tracking-wide font-medium font-heading"
        >
          Preparing your experience...
        </motion.span>
      </motion.div>
    </div>
  );
};

export default PageLoader;
