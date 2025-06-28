import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video } from 'lucide-react';

const GallerySection = () => {
  const galleryItems = [
    { type: 'image', src: 'Naam Grupo performing live at a grand mosque', alt: 'Na\'am Grupo live performance at a grand mosque' },
    { type: 'video', src: 'Behind the scenes of a music video shoot', alt: 'Behind the scenes of a music video shoot' },
    { type: 'image', src: 'Close-up shot of a band member playing an oud', alt: 'Close-up of an oud instrument being played' },
    { type: 'image', src: 'Audience with lights during a concert', alt: 'Audience enjoying a spiritual concert' },
    { type: 'video', src: 'Acoustic session in a serene garden', alt: 'Acoustic session in a serene garden' },
    { type: 'image', src: 'Naam Grupo in a recording studio', alt: 'Na\'am Grupo in a recording studio' },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Galeri <span className="text-gold-gradient">Momen</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Cuplikan perjalanan kami dalam menyebarkan harmoni melalui nada.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              className={`relative rounded-lg overflow-hidden group cursor-pointer ${
                index === 1 || index === 4 ? 'col-span-2 row-span-2' : ''
              }`}
              variants={itemVariants}
            >
              <img 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={item.alt}
               src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4">
                {item.type === 'video' ? (
                  <Video className="w-8 h-8 text-white" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;