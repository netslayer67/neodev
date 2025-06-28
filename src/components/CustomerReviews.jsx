import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Alex Johnson',
    review: "The FEARLESS HOODIE is next level. Quality is insane and the fit is perfect. Worth every penny.",
    rating: 5,
    product: "FEARLESS HOODIE"
  },
  {
    name: 'Samantha Bee',
    review: "Finally, a brand that gets it. Minimalist design with a powerful message. The ETERNAL TEE is my new daily driver.",
    rating: 5,
    product: "ETERNAL TEE"
  },
  {
    name: 'Mike P.',
    review: "The quality of the fabric is top-notch. You can feel the difference immediately. Will be buying more.",
    rating: 5,
    product: "REVENANT CARGO"
  },
  {
    name: 'Jessica Wu',
    review: "Obsessed with the aesthetic. It's bold, clean, and exactly my style. Shipping was fast too.",
    rating: 4,
    product: "VOID CAP"
  },
  {
    name: 'David Chen',
    review: "IN GOD WE FEAR. This resonates so much. The apparel is just a bonus. Keep up the great work.",
    rating: 5,
    product: "FEARLESS HOODIE"
  },
  {
    name: 'Emily Rose',
    review: "My APEX JACKET is perfect for the city. Lightweight but protects from the wind. Looks fire.",
    rating: 5,
    product: "APEX JACKET"
  },
];

const MarqueeItem = ({ review }) => (
  <div className="glass-card flex-shrink-0 w-[350px] p-6 mx-4 rounded-xl flex flex-col justify-between">
    <div>
      <div className="flex items-center mb-4">
        <div className="flex">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
          {[...Array(5 - review.rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-neutral-600" />
          ))}
        </div>
      </div>
      <p className="text-neutral-200 mb-4 text-md">"{review.review}"</p>
    </div>
    <div>
      <p className="font-bold text-white">{review.name}</p>
      <p className="text-sm text-neutral-400">Purchased: {review.product}</p>
    </div>
  </div>
);

const CustomerReviews = () => {
  const duplicatedReviews = [...reviews, ...reviews];

  const marqueeVariants = {
    animate: {
      x: [0, -2292],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear",
        },
      },
    },
  };

  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-heading tracking-wider text-white">VOICES OF THE FEARLESS</h2>
          <p className="text-neutral-400 mt-2">Hear what our community has to say.</p>
        </motion.div>
      </div>
      <motion.div
        className="flex"
        variants={marqueeVariants}
        animate="animate"
      >
        {duplicatedReviews.map((review, index) => (
          <MarqueeItem key={index} review={review} />
        ))}
      </motion.div>
    </section>
  );
};

export default CustomerReviews;