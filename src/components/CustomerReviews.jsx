import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

// Data ulasan (bisa dari API)
const reviews = [
  {
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/48?u=alex',
    review: "Kualitas FEARLESS HOODIE ini benar-benar gila. Pas di badan dan sangat sepadan dengan harganya. Kualitasnya level berikutnya.",
    rating: 5,
    product: 'FEARLESS HOODIE',
  },
  {
    name: 'Samantha Bee',
    avatar: 'https://i.pravatar.cc/48?u=samantha',
    review: "Akhirnya, sebuah brand yang mengerti. Desain minimalis dengan pesan yang kuat. ETERNAL TEE jadi andalan saya setiap hari.",
    rating: 5,
    product: 'ETERNAL TEE',
  },
  {
    name: 'Mike P.',
    avatar: 'https://i.pravatar.cc/48?u=mike',
    review: "Kualitas bahannya premium. Anda bisa langsung merasakan perbedaannya. Pasti akan membeli lagi dari sini.",
    rating: 5,
    product: 'REVENANT CARGO',
  },
  {
    name: 'Jessica Wu',
    avatar: 'https://i.pravatar.cc/48?u=jessica',
    review: "Terobsesi dengan estetikanya. Berani, bersih, dan sesuai dengan gaya saya. Pengirimannya juga cepat.",
    rating: 4,
    product: 'VOID CAP',
  },
  {
    name: 'David Chen',
    avatar: 'https://i.pravatar.cc/48?u=david',
    review: "'IN GOD WE FEAR.' Kalimat ini sangat berkesan bagi saya. Pakaiannya hanyalah bonus. Teruslah berkarya.",
    rating: 5,
    product: 'FEARLESS HOODIE',
  },
  {
    name: 'Emily Rose',
    avatar: 'https://i.pravatar.cc/48?u=emily',
    review: "Jaket APEX saya sempurna untuk di kota. Ringan tapi tetap melindungi dari angin. Kelihatan keren banget.",
    rating: 5,
    product: 'APEX JACKET',
  },
];

// --- Sub-Komponen untuk Clean Code: ReviewCard ---
const ReviewCard = ({ review, variants }) => (
  <motion.div
    variants={variants}
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    className="relative p-px overflow-hidden rounded-2xl bg-transparent h-full"
  >
    {/* Gradient Border */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent rounded-2xl" />
    <div className="relative flex flex-col h-full p-6 bg-gradient-to-b from-gray-900/70 to-gray-950/80 backdrop-blur-xl rounded-[15px] shadow-2xl">
      <Quote className="absolute top-4 right-4 h-12 w-12 text-white/10" />
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'}`} />
        ))}
      </div>
      <p className="text-neutral-200 italic mb-6 text-base flex-grow">"{review.review}"</p>
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
        <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full border-2 border-white/20" />
        <div>
          <p className="font-semibold text-white">{review.name}</p>
          <p className="text-sm text-neutral-400">Purchased: {review.product}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Komponen Utama CustomerReviews ---
const CustomerReviews = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  return (
    <section className="py-24 sm:py-32 overflow-hidden bg-black relative">
      {/* Background Gradient Aurora */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-radial from-indigo-800/40 via-purple-800/20 to-transparent blur-3xl rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            VOICES OF THE FEARLESS
          </h2>
          <p className="text-neutral-400 mt-4 text-lg">
            Dengar apa yang komunitas kami katakan tentang esensi dan kualitas.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} variants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;