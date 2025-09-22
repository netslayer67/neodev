"use client"
import React, { useState, useCallback, useEffect, memo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Star, Quote, Shield, ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react"

// ✅ Reviews data (static)
const reviews = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/64?u=alex",
    review: "Kualitas premium yang terasa sejak unboxing. Material berkelas, cutting presisi. Worth every penny.",
    rating: 5,
    product: "FEARLESS HOODIE",
    verified: true,
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Samantha Bee",
    avatar: "https://i.pravatar.cc/64?u=samantha",
    review: "Brand yang mengerti ekslusivitas. Desain bukan sekedar trend, tapi statement. ETERNAL TEE = signature piece.",
    rating: 5,
    product: "ETERNAL TEE",
    verified: true,
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Mike P.",
    avatar: "https://i.pravatar.cc/64?u=mike",
    review: "Bahannya langsung terasa beda. Investasi untuk wardrobe yang serius.",
    rating: 5,
    product: "REVENANT CARGO",
    verified: true,
    date: "3 days ago",
  },
  {
    id: 4,
    name: "Jessica Wu",
    avatar: "https://i.pravatar.cc/64?u=jessica",
    review: "Clean aesthetic meets bold statement. Shipping express, packaging luxury-level.",
    rating: 5,
    product: "VOID CAP",
    verified: true,
    date: "5 days ago",
  },
]

// ✅ Secure sanitize (prevent XSS)
const sanitizeText = (txt) =>
  typeof txt === "string"
    ? txt.replace(/<\/?[^>]+(>|$)/g, "").replace(/(javascript:|data:)/gi, "")
    : ""

// ✅ ReviewCard
const ReviewCard = memo(({ review, index, isMobile }) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={!isMobile ? { scale: 1.03, y: -4 } : {}}
      className="group relative"
    >
      {/* glow hover */}
      <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-[320ms]" />

      {/* card */}
      <div className="relative liquid-glass-card p-6 md:p-8 h-full transition-shadow duration-[320ms] group-hover:shadow-xl">
        {/* floating quote */}
        {!reduceMotion && (
          <motion.div
            className="absolute top-4 right-4 text-accent/40"
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Quote className="h-6 w-6 md:h-8 md:w-8" />
          </motion.div>
        )}

        {/* verified */}
        {review.verified && (
          <div className="absolute top-4 left-4 bg-success/20 border border-success/30 rounded-full p-1.5">
            <Shield className="h-3 w-3 text-success" />
          </div>
        )}

        {/* rating */}
        <div className="flex items-center gap-1 mb-4 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 md:h-5 md:w-5 ${i < review.rating ? "fill-warning text-warning" : "text-muted/40"
                }`}
            />
          ))}
          <span className="ml-2 text-xs text-muted-foreground">{sanitizeText(review.date)}</span>
        </div>

        {/* review text */}
        <p className="text-foreground/90 leading-relaxed mb-6 font-light text-sm md:text-base">
          "{sanitizeText(review.review)}"
        </p>

        {/* author */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/20">
          <img
            src={review.avatar}
            alt={sanitizeText(review.name)}
            loading="lazy"
            decoding="async"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-accent/20 shadow"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm md:text-base truncate">{sanitizeText(review.name)}</p>
            <p className="text-xs text-secondary font-medium">{sanitizeText(review.product)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

// ✅ Mobile carousel
const MobileCarousel = ({ reviews }) => {
  const [current, setCurrent] = useState(0)
  const next = useCallback(() => setCurrent((p) => (p + 1) % reviews.length), [reviews.length])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + reviews.length) % reviews.length), [reviews.length])

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-[320ms] ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {reviews.map((r, idx) => (
            <div key={r.id} className="w-full flex-shrink-0 px-2">
              <ReviewCard review={r} index={idx} isMobile />
            </div>
          ))}
        </div>
      </div>

      {/* nav */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={prev} className="p-2 rounded-xl bg-card/60 hover:bg-card/80 transition-colors duration-[320ms]">
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex gap-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-[320ms] ${idx === current ? "w-8 bg-accent" : "w-2 bg-muted"
                }`}
            />
          ))}
        </div>
        <button onClick={next} className="p-2 rounded-xl bg-card/60 hover:bg-card/80 transition-colors duration-[320ms]">
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </div>
  )
}

// ✅ Main component
const CustomerReviews = () => {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const handler = (e) => setIsMobile(e.matches)
    handler(mql)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      {/* blobs */}
      <motion.div
        className="absolute -top-32 -left-24 w-80 h-80 bg-accent/15 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-32 -right-28 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-accent font-medium text-sm">VERIFIED REVIEWS</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-heading tracking-tight mb-4">Voices of Excellence</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Experience shared by those who value true luxury and craftsmanship.
          </p>
        </div>

        {/* grid or carousel */}
        {isMobile ? (
          <MobileCarousel reviews={reviews} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((r, idx) => (
              <ReviewCard key={r.id} review={r} index={idx} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 md:mt-24">
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 rounded-2xl liquid-glass transition-shadow duration-[320ms] hover:shadow-xl"
          >
            <Heart className="h-5 w-5 text-secondary" />
            <span className="font-medium">Join the Community</span>
          </motion.button>
        </div>
      </div>
    </section>
  )
}

export default CustomerReviews
