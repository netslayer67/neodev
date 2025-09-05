import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/48?u=alex",
    review:
      "Kualitas FEARLESS HOODIE ini benar-benar gila. Pas di badan dan sepadan dengan harganya.",
    rating: 5,
    product: "FEARLESS HOODIE",
  },
  {
    name: "Samantha Bee",
    avatar: "https://i.pravatar.cc/48?u=samantha",
    review:
      "Akhirnya, brand yang mengerti. Desain minimalis dengan pesan yang kuat. ETERNAL TEE jadi andalan.",
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
    transition={{ type: "spring", stiffness: 150, damping: 14 }}
    className="relative p-[1px] rounded-3xl shadow-xl bg-gradient-to-br from-[#8A5CF6]/30 via-[#1E2A47]/30 to-[#0F0F1A]/50 backdrop-blur-xl"
  >
    <div className="relative p-6 flex flex-col h-full bg-[#0F0F1A]/80 rounded-3xl overflow-hidden">
      <Quote className="absolute top-5 right-5 h-8 w-8 text-white/10 group-hover:rotate-3 transition-transform duration-500" />
      {/* Rating */}
      <div className="flex items-center mb-3 gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < review.rating
                ? "fill-[#8A5CF6] text-[#8A5CF6]"
                : "text-white/20"
              }`}
          />
        ))}
      </div>
      {/* Review Text */}
      <p className="text-white/90 italic text-base leading-relaxed flex-grow mb-6">
        "{review.review}"
      </p>
      {/* Author */}
      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
        <img
          src={review.avatar}
          alt={review.name}
          className="h-11 w-11 rounded-full border-2 border-white/10"
        />
        <div>
          <p className="font-semibold text-white text-sm">{review.name}</p>
          <p className="text-sm text-white/50">Purchased: {review.product}</p>
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
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <section className="relative py-20 sm:py-32 bg-gradient-to-b from-[#0F0F1A] via-[#1E2A47] to-[#0F0F1A] overflow-hidden">
      {/* Animated Blobs */}
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 bg-[#8A5CF6]/20 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#1E2A47]/40 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-2xl mx-auto mb-16 px-6"
      >
        <h2 className="text-3xl sm:text-5xl font-heading tracking-tight text-white">
          Voices of the Fearless
        </h2>
        <p className="text-white/70 mt-4 text-base sm:text-lg font-light">
          Cerita nyata dari komunitas yang hidup dengan gaya dan makna.
        </p>
      </motion.div>

      {/* Review Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6"
      >
        {reviews.map((review, idx) => (
          <ReviewCard key={idx} review={review} variants={itemVariants} />
        ))}
      </motion.div>
    </section>
  );
};

export default CustomerReviews;
