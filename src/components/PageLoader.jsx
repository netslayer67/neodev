import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import logo from "@/assets/img/logo.png";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F1A]">
      {/* Floating blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-[#8A5CF6]/30 rounded-full blur-3xl"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-[#1E2A47]/40 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 25, -25, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Loader Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center justify-center w-72 sm:w-80 h-72 sm:h-80 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
        role="status"
        aria-label="Page is loading"
      >
        {/* Logo */}
        <motion.img
          src={logo}
          alt="Neo Dervish Logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-20 h-20 object-contain mb-4 drop-shadow-[0_0_15px_rgba(138,92,246,0.5)]"
        />

        {/* Copy */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center text-white/90 text-base sm:text-lg tracking-wide"
        >
          Loading your space...
        </motion.p>

        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute bottom-6"
        >
          <Loader2 className="w-5 h-5 text-white/40" strokeWidth={1.5} />
        </motion.div>

        {/* Glow overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default PageLoader;
