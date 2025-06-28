import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, Users } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-black/20">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Tentang <span className="text-gold-gradient">Na'am Grupo</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Sebuah perjalanan musikal untuk menyentuh kalbu dan menyebarkan pesan kedamaian.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <img 
              className="rounded-2xl shadow-2xl w-full h-auto object-cover soft-glow"
              alt="Grup band Na'am Grupo sedang tampil di panggung dengan pencahayaan hangat"
             src="https://images.unsplash.com/photo-1694626657115-d847788e5f44" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-xl text-gray-200 leading-relaxed font-serif italic">
              "Musik kami adalah dzikir, setiap nada adalah doa. Kami percaya, harmoni dapat menyatukan hati dan membawa kita lebih dekat kepada Sang Pencipta."
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-400/10 rounded-full">
                  <Heart className="w-6 h-6 text-gold-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Filosofi Musik</h3>
                  <p className="text-gray-400">
                    Menggabungkan lirik-lirik sufistik yang mendalam dengan aransemen musik kontemporer yang menyentuh, menciptakan pengalaman spiritual yang relevan bagi semua kalangan.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-400/10 rounded-full">
                  <Music className="w-6 h-6 text-gold-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Visi Spiritual</h3>
                  <p className="text-gray-400">
                    Menjadi jembatan kedamaian melalui seni, menyebarkan pesan cinta universal, dan mengajak pendengar untuk merenungi keindahan ciptaan-Nya.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-400/10 rounded-full">
                  <Users className="w-6 h-6 text-gold-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Kontribusi Komunitas</h3>
                  <p className="text-gray-400">
                    Aktif dalam acara-acara dakwah musikal, workshop, dan kolaborasi untuk mendukung perkembangan seni religi dan memberdayakan komunitas.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;