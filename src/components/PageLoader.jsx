import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/img/logo.png'; // Adjust path if needed

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center w-80 h-80 rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
      >
        {/* Animated Liquid Logo */}
        <motion.img
          src={logo}
          alt="Neo Dervish Logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-20 h-20 object-contain mb-6 drop-shadow-[0_0_15px_rgba(0,212,255,0.3)]"
        />

        {/* Premium Copy */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-center text-white/90 text-base sm:text-lg font-serif tracking-wide"
        >
          In soul we move...
        </motion.p>

        {/* Fallback shimmer */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="absolute bottom-6"
        >
          <Loader2 className="w-5 h-5 text-white/30" strokeWidth={1.25} />
        </motion.div>

        {/* Optional animated shimmer background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 80%)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default PageLoader;
