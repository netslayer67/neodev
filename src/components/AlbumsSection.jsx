import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AlbumsSection = () => {
  const { toast } = useToast();

  const albums = [
    {
      title: 'Samudra Rindu',
      year: '2023',
      description: 'Album yang berisi lantunan syair kerinduan kepada Sang Khalik, dibalut musik etnik modern.',
      cover: 'Album cover for Samudra Rindu with ocean and calligraphy theme',
    },
    {
      title: 'Cahaya di Atas Cahaya',
      year: '2021',
      description: 'Kumpulan dzikir dan shalawat yang diaransemen dengan nuansa orkestra yang megah dan menenangkan.',
      cover: 'Album cover for Cahaya di Atas Cahaya with light rays and geometric patterns',
    },
    {
      title: 'Jalan Pulang',
      year: '2019',
      description: 'Debut album yang menandai perjalanan spiritual Na\'am Grupo dalam mencari makna hakiki.',
      cover: 'Album cover for Jalan Pulang with a path leading to a mosque silhouette',
    },
  ];

  const handleListenClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 4000,
    });
  };

  return (
    <section id="albums" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Diskografi <span className="text-gold-gradient">Karya Kami</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Setiap album adalah sebuah bab dari perjalanan spiritual kami, terukir dalam nada dan kata.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, index) => (
            <motion.div
              key={album.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="glass-card p-6 group flex flex-col"
            >
              <div className="relative mb-6">
                <img 
                  className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105"
                  alt={`Cover album ${album.title}`}
                 src="https://images.unsplash.com/photo-1664724195484-826ea9ee26a3" />
                <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {album.year}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold font-serif text-gold-200 mb-2">{album.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-6">{album.description}</p>
              </div>
              <Button
                onClick={handleListenClick}
                variant="outline"
                className="w-full mt-auto border-gold-200/50 text-gold-200 hover:bg-gold-200/10 hover:text-gold-100 transition-all duration-300 group-hover:border-gold-300"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Dengarkan Album
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlbumsSection;