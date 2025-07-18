// CustomerReviews.jsx (Refactored for Luxury-Grade Design)
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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

const ReviewCard = ({ review, variants }) => (
  <motion.div
    variants={variants}
    whileHover={{ scale: 1.025 }}
    transition={{ type: 'spring', stiffness: 180, damping: 14 }}
    className="group relative p-[1px] rounded-3xl glass-card shadow-xl will-change-transform"
  >
    <div className="relative p-6 flex flex-col h-full bg-gradient-to-br from-gray-900/80 to-gray-950/90 backdrop-blur-xl rounded-3xl overflow-hidden">
      <Quote className="absolute top-5 right-5 h-10 w-10 text-white/10 group-hover:rotate-3 transition-transform duration-500" />
      <div className="flex items-center mb-4 gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 transition-colors ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'}`} />
        ))}
      </div>
      <p className="text-white/90 italic text-base leading-relaxed flex-grow mb-6">"{review.review}"</p>
      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
        <img src={review.avatar} alt={review.name} className="h-11 w-11 rounded-full border-2 border-white/10" />
        <div>
          <p className="font-semibold text-white text-sm">{review.name}</p>
          <p className="text-sm text-white/50">Purchased: {review.product}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

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
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 12 },
    },
  };

  useEffect(() => {
    const tiltCards = document.querySelectorAll('.glass-card');
    const isTouch = window.matchMedia('(hover: none)').matches;

    if (!isTouch) {
      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
      });
    }
  }, []);

  return (
    <section className="relative py-24 sm:py-32 bg-black overflow-hidden">
      {/* Luxury Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900/20 via-black to-indigo-900/20 blur-2xl" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading tracking-tight text-white">VOICES OF THE FEARLESS</h2>
          <p className="text-neutral-400 mt-4 text-lg">Kisah nyata dari komunitas kami yang hidup dalam gerakan dan makna.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
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