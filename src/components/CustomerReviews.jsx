import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/48?u=alex",
    review: "Kualitas FEARLESS HOODIE ini benar-benar gila. Pas di badan dan sepadan dengan harganya.",
    rating: 5,
    product: "FEARLESS HOODIE",
  },
  {
    name: "Samantha Bee",
    avatar: "https://i.pravatar.cc/48?u=samantha",
    review: "Akhirnya, brand yang mengerti. Desain minimalis dengan pesan yang kuat. ETERNAL TEE jadi andalan.",
    rating: 5,
    product: "ETERNAL TEE",
  },
  {
    name: "Mike P.",
    avatar: "https://i.pravatar.cc/48?u=mike",
    review: "Bahannya premium. Langsung terasa beda. Pasti beli lagi.",
    rating: 5,
    product: "REVENANT CARGO",
  },
  {
    name: "Jessica Wu",
    avatar: "https://i.pravatar.cc/48?u=jessica",
    review: "Estetik banget. Berani, clean, sesuai gaya gue. Pengiriman cepat.",
    rating: 4,
    product: "VOID CAP",
  },
  {
    name: "David Chen",
    avatar: "https://i.pravatar.cc/48?u=david",
    review: "'IN GOD WE FEAR.' Kalimat yang ngena. Bajunya bonus. Respect.",
    rating: 5,
    product: "FEARLESS HOODIE",
  },
  {
    name: "Emily Rose",
    avatar: "https://i.pravatar.cc/48?u=emily",
    review: "APEX JACKET pas buat kota. Ringan tapi tetap protektif. Keren.",
    rating: 5,
    product: "APEX JACKET",
  },
];

/** Review Card */
const ReviewCard = ({ review, variants }) => (
  <motion.div
    variants={variants}
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.32, ease: "easeOut" }}
    className="rounded-2xl p-[1px] bg-gradient-to-br from-accent/30 via-card/40 to-primary/30 backdrop-blur-xl shadow-md"
  >
    <div className="relative p-6 flex flex-col h-full bg-card/70 border border-border rounded-2xl">
      <Quote className="absolute top-5 right-5 h-7 w-7 text-muted/40 transition-transform duration-320 group-hover:rotate-3" />

      {/* Rating */}
      <div className="flex items-center mb-3 gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < review.rating
                ? "fill-accent text-accent"
                : "text-muted/40"
              }`}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-foreground/90 italic text-sm md:text-base leading-relaxed flex-grow mb-6">
        "{review.review}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
        <img
          src={review.avatar}
          alt={review.name}
          className="h-11 w-11 rounded-full border border-border/40"
        />
        <div>
          <p className="font-medium text-foreground text-sm">{review.name}</p>
          <p className="text-xs text-muted-foreground">Purchased: {review.product}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

/** Customer Reviews Section */
const CustomerReviews = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative py-16 sm:py-24 bg-background overflow-hidden">
      {/* Decorative Blobs */}
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 bg-primary/25 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/30 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl mx-auto mb-12 px-6"
      >
        <h2 className="text-3xl sm:text-5xl font-heading tracking-tight text-foreground">
          Voices of the Fearless
        </h2>
        <p className="text-muted-foreground mt-4 text-sm sm:text-base font-light">
          Suara nyata dari komunitas yang hidup dengan gaya & makna.
        </p>
      </motion.div>

      {/* Review Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6"
      >
        {reviews.map((review, idx) => (
          <ReviewCard key={idx} review={review} variants={itemVariants} />
        ))}
      </motion.div>
    </section>
  );
};

export default CustomerReviews;
