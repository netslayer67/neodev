import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import logo from "@/assets/img/logo.png";

const PageLoader = ({ loading }) => {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--background))]"
        >
          {/* Animated Blobs */}
          <motion.div
            className="absolute w-72 h-72 bg-accent/25 rounded-full blur-3xl"
            animate={{ x: [0, 35, -35, 0], y: [0, -20, 20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-96 h-96 bg-secondary/25 rounded-full blur-3xl"
            animate={{ x: [0, -40, 40, 0], y: [0, 25, -25, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-80 h-80 bg-muted/25 rounded-full blur-2xl"
            animate={{ x: [0, 25, -25, 0], y: [0, -30, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Loader Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center
                       w-56 h-56 sm:w-72 sm:h-72
                       rounded-3xl border border-border
                       bg-card/60 backdrop-blur-2xl
                       shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                       overflow-hidden"
          >
            {/* Logo */}
            <motion.img
              src={logo}
              alt="Brand Logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: [1, 1.05, 1] }}
              transition={{
                duration: 2.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-3
                         drop-shadow-[0_0_14px_hsl(var(--accent)/0.5)]"
            />

            {/* Text */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-center text-foreground/80 
                         text-xs sm:text-sm font-medium tracking-wide"
            >
              Loading your experience...
            </motion.p>

            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
              className="absolute bottom-6"
            >
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent/70" strokeWidth={2} />
            </motion.div>

            {/* Glow overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, transparent 70%)",
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Cinematic Exit Overlay */}
      {!loading && (
        <motion.div
          key="cinematic-exit"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.83, 0, 0.17, 1], // Apple-like curve
          }}
          className="fixed inset-0 z-40"
          style={{
            background: "linear-gradient(180deg, hsl(var(--accent)) 0%, hsl(var(--gradient-accent)) 100%)",
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
