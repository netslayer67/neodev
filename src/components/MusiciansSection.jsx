import React from 'react';
import { motion } from 'framer-motion';

const MusiciansSection = () => {
  const musicians = [
    {
      name: 'Fulan Al-Maqami',
      role: 'Vokalis & Pemain Oud',
      bio: '"Suara adalah jembatan antara hati dan Arsy. Setiap senandung adalah upaya menggapai-Nya."',
      image: 'Portrait of a male vocalist and oud player with a serene expression',
    },
    {
      name: 'Aisyah An-Nayyira',
      role: 'Pemain Ney & Daf',
      bio: '"Tiupan ney adalah rintihan jiwa yang merindukan asalnya. Irama daf adalah detak jantung alam semesta."',
      image: 'Portrait of a female musician playing a ney flute with eyes closed',
    },
    {
      name: 'Zayn Al-Qanuni',
      role: 'Pemain Qanun',
      bio: '"Setiap dawai qanun menceritakan kisah para pencari. Getarannya adalah gema dzikir yang tak pernah henti."',
      image: 'Portrait of a male musician skillfully playing the qanun instrument',
    },
    {
      name: 'Rumi Al-Banjari',
      role: 'Perkusionis & Rebana',
      bio: '"Dalam pukulan rebana, kutemukan ritme penyerahan diri. Sebuah ketukan yang menyatukan semua ciptaan."',
      image: 'Portrait of a percussionist playing a rebana with joyful energy',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 10,
      },
    },
  };

  return (
    <section id="musicians" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Para <span className="text-gold-gradient">Musisi Jiwa</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Individu-individu yang menyatukan hati dan keahlian mereka untuk menciptakan harmoni ilahi.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {musicians.map((musician, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  className="w-full h-96 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  alt={`Potret ${musician.name}`}
                  src="https://images.unsplash.com/photo-1519501025264-65ba15a82390"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold font-serif text-gold-200 mb-1">{musician.name}</h3>
                <p className="text-md font-semibold text-white mb-4">{musician.role}</p>
                <div className="h-px bg-gold-200/20 mb-4"></div>
                <p className="text-sm text-gray-300 italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto">
                  {musician.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MusiciansSection;