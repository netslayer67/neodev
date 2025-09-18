import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Shield, ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/64?u=alex",
    review: "Kualitas premium yang terasa sejak unboxing. Material berkelas, cutting presisi. Worth every penny.",
    rating: 5,
    product: "FEARLESS HOODIE",
    verified: true,
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Samantha Bee",
    avatar: "https://i.pravatar.cc/64?u=samantha",
    review: "Brand yang mengerti ekslusivitas. Desain bukan sekedar trend, tapi statement. ETERNAL TEE = signature piece.",
    rating: 5,
    product: "ETERNAL TEE",
    verified: true,
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Mike P.",
    avatar: "https://i.pravatar.cc/64?u=mike",
    review: "Bahannya langsung terasa beda. Investasi untuk wardrobe yang serius.",
    rating: 5,
    product: "REVENANT CARGO",
    verified: true,
    date: "3 days ago"
  },
  {
    id: 4,
    name: "Jessica Wu",
    avatar: "https://i.pravatar.cc/64?u=jessica",
    review: "Clean aesthetic meets bold statement. Shipping express, packaging luxury-level.",
    rating: 5,
    product: "VOID CAP",
    verified: true,
    date: "5 days ago"
  },
  {
    id: 5,
    name: "David Chen",
    avatar: "https://i.pravatar.cc/64?u=david",
    review: "'IN GOD WE FEAR.' Powerful message, premium execution. This is art you wear.",
    rating: 5,
    product: "FEARLESS HOODIE",
    verified: true,
    date: "1 week ago"
  },
  {
    id: 6,
    name: "Emily Rose",
    avatar: "https://i.pravatar.cc/64?u=emily",
    review: "APEX JACKET redefines urban armor. Lightweight engineering meets street luxury.",
    rating: 5,
    product: "APEX JACKET",
    verified: true,
    date: "4 days ago"
  },
];

// Input sanitization utility
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .trim()
    .slice(0, 500);
};

const validateInput = (input) => {
  const sanitized = sanitizeInput(input);
  const suspiciousPatterns = [
    /https?:\/\//i,
    /www\./i,
    /\.(com|net|org|io|co)/i,
    /script/i,
    /eval\(/i,
    /alert\(/i,
    /document\./i,
    /window\./i
  ];

  return !suspiciousPatterns.some(pattern => pattern.test(sanitized)) && sanitized.length >= 2;
};

/** Enhanced Review Card */
const ReviewCard = ({ review, index, isMobile }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, rotateY: -15 }}
    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      duration: 0.7,
      delay: index * 0.1,
      ease: [0.25, 0.4, 0.25, 1]
    }}
    whileHover={{
      scale: isMobile ? 1.02 : 1.05,
      y: -8,
      rotateY: 5,
      transition: { duration: 0.32, ease: "easeOut" }
    }}
    className="group relative"
  >
    {/* Glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-secondary/10 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

    {/* Glass card */}
    <div className="relative bg-card/40 backdrop-blur-2xl border border-border/30 rounded-3xl p-6 md:p-8 h-full hover:border-accent/50 transition-all duration-320 shadow-2xl">
      {/* Quote icon with animation */}
      <motion.div
        className="absolute top-4 right-4 text-accent/30 group-hover:text-accent/60 transition-colors duration-320"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Quote className="h-6 w-6 md:h-8 md:w-8" />
      </motion.div>

      {/* Verified badge */}
      {review.verified && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
          className="absolute top-4 left-4 bg-success/20 border border-success/30 rounded-full p-1.5 backdrop-blur-sm"
        >
          <Shield className="h-3 w-3 text-success fill-success/20" />
        </motion.div>
      )}

      {/* Rating with enhanced stars */}
      <div className="flex items-center mb-4 gap-1 mt-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 300 }}
          >
            <Star
              className={`h-4 w-4 md:h-5 md:w-5 transition-all duration-320 ${i < review.rating
                  ? "fill-warning text-warning group-hover:scale-110"
                  : "text-muted/30 group-hover:text-muted/50"
                }`}
            />
          </motion.div>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">{review.date}</span>
      </div>

      {/* Review text with premium typography */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-foreground/90 leading-relaxed flex-grow mb-6 font-light text-sm md:text-base group-hover:text-foreground transition-colors duration-320"
      >
        "{review.review}"
      </motion.p>

      {/* Author section with glass effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-4 pt-4 border-t border-border/20 group-hover:border-border/40 transition-colors duration-320"
      >
        <div className="relative">
          <img
            src={review.avatar}
            alt={review.name}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-accent/20 group-hover:border-accent/50 transition-all duration-320 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-1 border-2 border-background">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm md:text-base truncate group-hover:text-accent transition-colors duration-320">
            {review.name}
          </p>
          <p className="text-xs text-secondary font-medium tracking-wide">
            {review.product}
          </p>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

/** Mobile Carousel Component */
const MobileCarousel = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl">
        <motion.div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {reviews.map((review, idx) => (
            <div key={review.id} className="w-full flex-shrink-0 px-2">
              <ReviewCard review={review} index={idx} isMobile={true} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={prevSlide}
          className="p-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/30 hover:border-accent/50 hover:bg-accent/10 transition-all duration-320"
        >
          <ChevronLeft className="h-5 w-5 text-foreground/80" />
        </motion.button>

        {/* Dots indicator */}
        <div className="flex gap-2">
          {reviews.map((_, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-320 ${idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-muted/40 hover:bg-accent/60'
                }`}
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="p-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/30 hover:border-accent/50 hover:bg-accent/10 transition-all duration-320"
        >
          <ChevronRight className="h-5 w-5 text-foreground/80" />
        </motion.button>
      </div>
    </div>
  );
};

/** Main Component */
const CustomerReviews = () => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      },
    },
  };

  return (
    <section className="relative py-16 md:py-32 overflow-hidden">
      {/* Dynamic Background Blobs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-32 -left-24 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-40 -right-32 w-96 h-96 bg-secondary/25 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/15 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-24"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-accent font-medium text-sm tracking-wide">VERIFIED REVIEWS</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading tracking-tight text-foreground mb-6 bg-gradient-to-br from-foreground via-accent/80 to-secondary bg-clip-text text-transparent">
            Voices of Excellence
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Real experiences from those who understand true luxury and craftsmanship.
          </p>
        </motion.div>

        {/* Reviews Grid/Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {isMobile ? (
            <MobileCarousel reviews={reviews} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {reviews.map((review, idx) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={idx}
                  isMobile={false}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 md:mt-24"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-gradient-to-r from-accent via-accent/90 to-secondary text-accent-foreground font-semibold text-base md:text-lg tracking-wide shadow-xl hover:shadow-2xl transition-all duration-320 border border-accent/20 backdrop-blur-sm"
          >
            <Heart className="h-5 w-5 fill-current" />
            Join the Community
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;