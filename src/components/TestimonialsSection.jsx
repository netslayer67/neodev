import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Ustadz H. Abdullah Gymnastiar',
      position: 'Tokoh Agama',
      text: 'Musik Na\'am Grupo adalah oase di tengah hiruk pikuk dunia. Menenangkan, mengingatkan, dan membawa kita pada perenungan yang dalam. Sangat direkomendasikan.',
      image: 'Portrait of a respected religious figure, Ustadz H. Abdullah Gymnastiar',
    },
    {
      name: 'Rina Setyawati',
      position: 'Pendengar Setia',
      text: 'Setiap kali saya mendengarkan lagu-lagu Na\'am Grupo, hati saya terasa lebih damai. Liriknya sangat menyentuh dan musiknya indah. Terima kasih telah menciptakan karya seindah ini.',
      image: 'Portrait of a loyal female fan, Rina Setyawati',
    },
    {
      name: 'Dr. Irfan Al-Faruqi',
      position: 'Pemerhati Seni Islam',
      text: 'Na\'am Grupo berhasil memadukan tradisi sufi dengan modernitas secara elegan. Mereka adalah bukti bahwa musik religi bisa relevan dan berkualitas tinggi di era sekarang.',
      image: 'Portrait of an Islamic art scholar, Dr. Irfan Al-Faruqi',
    },
  ];

  const nextTestimonial = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setTimeout(nextTestimonial, 7000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-black/20">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Gema <span className="text-gold-gradient">Dari Hati</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Apa kata mereka yang telah tersentuh oleh alunan nada kami.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 md:p-12 text-center"
            >
              <Quote className="w-12 h-12 text-gold-400/30 mx-auto mb-6" />
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 font-serif italic">
                "{testimonials[currentIndex].text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img 
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold-300/50"
                  alt={`Foto ${testimonials[currentIndex].name}`}
                 src="https://images.unsplash.com/photo-1644424235476-295f24d503d9" />
                <div>
                  <h4 className="text-xl font-bold text-white">{testimonials[currentIndex].name}</h4>
                  <p className="text-gold-200">{testimonials[currentIndex].position}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <Button
            onClick={prevTestimonial}
            variant="outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-16 rounded-full border-gold-200/50 text-gold-200 hover:bg-gold-200/10"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={nextTestimonial}
            variant="outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-16 rounded-full border-gold-200/50 text-gold-200 hover:bg-gold-200/10"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;