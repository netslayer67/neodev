import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import logo from "@/assets/img/logo.png";

const decorativeBlobs = [
  { w: 72, h: 72, color: "accent/25", duration: 14, x: [0, 30, -30, 0], y: [0, -20, 20, 0] },
  { w: 96, h: 96, color: "secondary/20", duration: 18, x: [0, -40, 40, 0], y: [0, 25, -25, 0] },
  { w: 80, h: 80, color: "muted/30", duration: 20, x: [0, 25, -25, 0], y: [0, -30, 30, 0] },
];

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">

      {/* Animated decorative blobs */}
      {decorativeBlobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl w-[${blob.w}rem] h-[${blob.h}rem] bg-${blob.color}`}
          animate={{ x: blob.x, y: blob.y, scale: [1, 1.05, 1] }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      ))}

      {/* Liquid glass loader card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center justify-center 
                   w-64 h-64 sm:w-80 sm:h-80 
                   rounded-3xl border border-border bg-card/60 backdrop-blur-glass
                   shadow-glass overflow-hidden transition-all duration-[320ms]"
        role="status"
        aria-label="Page is loading"
      >
        {/* Logo with gentle animation */}
        <motion.img
          src={logo}
          alt="Brand Logo"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: [1, 1.06, 1] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-4 drop-shadow"
        />

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="text-center text-foreground/80 text-sm sm:text-base tracking-wide"
        >
          Loading your experience...
        </motion.p>

        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          className="absolute bottom-6"
        >
          <Loader2 className="w-5 h-5 text-accent/60" strokeWidth={1.8} />
        </motion.div>

        {/* Glow overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default PageLoader;
