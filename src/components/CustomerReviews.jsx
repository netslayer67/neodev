"use client";
import React, { useState, useCallback, useEffect, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Quote, Shield, ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";

// Static data (tidak berubah, aman untuk export terpisah)
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

/** ReviewCard optimized */
const ReviewCard = memo(({ review, index, isMobile }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={!isMobile ? { scale: 1.03, y: -6 } : {}}
      className="group relative"
    >
      <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

      <div className="relative bg-card/50 backdrop-blur-xl border border-border/20 rounded-3xl p-6 md:p-8 h-full transition-colors duration-300 shadow-lg">
        {/* Quote icon */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-4 right-4 text-accent/30"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Quote className="h-6 w-6 md:h-8 md:w-8" />
          </motion.div>
        )}

        {/* Verified */}
        {review.verified && (
          <div className="absolute top-4 left-4 bg-success/20 border border-success/30 rounded-full p-1.5">
            <Shield className="h-3 w-3 text-success" />
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center mb-4 gap-1 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 md:h-5 md:w-5 ${i < review.rating
                ? "fill-warning text-warning"
                : "text-muted/30"
                }`}
            />
          ))}
          <span className="ml-2 text-xs text-muted-foreground">{review.date}</span>
        </div>

        {/* Text */}
        <p className="text-foreground/90 leading-relaxed mb-6 font-light text-sm md:text-base">
          "{review.review}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/20">
          <div className="relative">
            <img
              src={review.avatar}
              alt={review.name}
              loading="lazy"
              decoding="async"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-accent/20 shadow"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm md:text-base truncate">{review.name}</p>
            <p className="text-xs text-secondary font-medium">{review.product}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/** Mobile carousel optimized */
const MobileCarousel = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((p) => (p + 1) % reviews.length);
  }, [reviews.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {reviews.map((review, idx) => (
            <div key={review.id} className="w-full flex-shrink-0 px-2">
              <ReviewCard review={review} index={idx} isMobile />
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={prevSlide} className="p-3 rounded-xl bg-card/60">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full ${idx === currentIndex ? "w-8 bg-accent" : "w-2 bg-muted/40"}`}
            />
          ))}
        </div>
        <button onClick={nextSlide} className="p-3 rounded-xl bg-card/60">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

/** Main component */
const CustomerReviews = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      {/* Background blob (simplified to reduce GPU) */}
      <div className="absolute -top-32 -left-24 w-80 h-80 bg-accent/15 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-secondary/20 rounded-full blur-2xl animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-accent font-medium text-sm">VERIFIED REVIEWS</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-heading tracking-tight mb-6">
            Voices of Excellence
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Real experiences from those who understand true luxury and craftsmanship.
          </p>
        </div>

        {/* Grid or Carousel */}
        {isMobile ? (
          <MobileCarousel reviews={reviews} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review, idx) => (
              <ReviewCard key={review.id} review={review} index={idx} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 md:mt-24">
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-gradient-to-r from-accent via-accent/90 to-secondary text-white font-semibold text-base md:text-lg shadow-lg"
          >
            <Heart className="h-5 w-5 fill-current" />
            Join the Community
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
