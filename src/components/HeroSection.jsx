import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayCircle, Youtube } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const HeroSection = () => {
  const { toast } = useToast();

  const handleActionClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 4000,
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover"
          alt="Latar belakang spiritual dengan ornamen islami dan cahaya lembut"
         src="https://images.unsplash.com/photo-1627383604558-9a480be78c57" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Meresapi Kedamaian — <br /> Lewat <span className="text-gold-gradient">Nada dan Dzikir</span> Na’am Grupo
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Temukan harmoni jiwa dalam alunan musik sufi yang menenangkan, membawa pesan cinta ilahi untuk hati yang merindu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              onClick={handleActionClick}
              size="lg"
              className="bg-gold-400 hover:bg-gold-500 text-gray-900 px-8 py-4 text-lg font-semibold rounded-full shadow-lg shadow-gold-500/20 transition-all duration-300 transform hover:scale-105 group"
            >
              <PlayCircle className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" />
              Dengarkan Sekarang
            </Button>

            <Button
              onClick={handleActionClick}
              variant="outline"
              size="lg"
              className="border-gold-200/50 text-gold-200 hover:bg-gold-200/10 hover:text-gold-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <Youtube className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" />
              Tonton di YouTube
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;