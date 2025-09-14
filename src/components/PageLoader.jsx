import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import logo from "@/assets/img/logo.png";

const PageLoader = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [lowEndMode, setLowEndMode] = useState(false);

  // detect low-end devices (super simple heuristic)
  useEffect(() => {
    const memory = navigator?.deviceMemory || 4; // default midrange
    const cores = navigator?.hardwareConcurrency || 4;
    if (memory <= 2 || cores <= 2) setLowEndMode(true);

    // fake full page render (simulate when data/assets done)
    const timer = setTimeout(() => setShowLoader(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Decorative blobs (skip on low-end mode) */}
          {!lowEndMode && (
            <>
              <motion.div
                className="absolute w-72 h-72 bg-accent/25 rounded-full blur-3xl"
                animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
                animate={{ x: [0, -40, 40, 0], y: [0, 25, -25, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute w-80 h-80 bg-muted/30 rounded-full blur-2xl"
                animate={{ x: [0, 25, -25, 0], y: [0, -30, 30, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}

          {/* Loader card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`relative flex flex-col items-center justify-center
              ${lowEndMode ? "w-40 h-40" : "w-64 h-64 sm:w-80 sm:h-80"}
              rounded-3xl border border-border bg-card/60 backdrop-blur-2xl
              shadow-[0_8px_32px_rgba(0,0,0,0.45)]
              overflow-hidden transition-all duration-320`}
            role="status"
            aria-label="Page is loading"
          >
            {/* Logo */}
            <motion.img
              src={logo}
              alt="Brand Logo"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={
                lowEndMode
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, scale: [1, 1.06, 1] }
              }
              transition={
                lowEndMode
                  ? { duration: 0.6 }
                  : {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
              }
              className={`object-contain mb-4 ${lowEndMode ? "w-12 h-12" : "w-16 h-16 sm:w-20 sm:h-20"
                } drop-shadow-[0_0_18px_hsl(var(--accent)/0.6)]`}
            />

            {/* Copy */}
            {!lowEndMode && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="text-center text-foreground/80 text-sm sm:text-base tracking-wide"
              >
                Loading your experience...
              </motion.p>
            )}

            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
              className="absolute bottom-6"
            >
              <Loader2
                className={`${lowEndMode ? "w-4 h-4" : "w-5 h-5"
                  } text-accent/70`}
                strokeWidth={1.8}
              />
            </motion.div>

            {/* Glow overlay */}
            {!lowEndMode && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }}
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, transparent 70%)",
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
