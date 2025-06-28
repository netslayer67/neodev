import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const EventsSection = () => {
  const { toast } = useToast();

  const events = [
    {
      title: 'Konser Dzikir & Harmoni',
      date: '28 Juli 2025',
      location: 'Masjid Istiqlal, Jakarta',
      description: 'Sebuah malam penuh kedamaian dengan lantunan dzikir dan musik sufi kontemporer.',
      status: 'Akan Datang',
    },
    {
      title: 'Festival Musik Religi Nusantara',
      date: '15 Agustus 2025',
      location: 'Taman Ismail Marzuki, Jakarta',
      description: 'Na\'am Grupo akan tampil sebagai salah satu penampil utama dalam festival musik religi terbesar.',
      status: 'Akan Datang',
    },
    {
      title: 'Malam Cinta Rasul',
      date: '10 Juni 2025',
      location: 'Aula Pesantren Gontor, Ponorogo',
      description: 'Acara syukuran dan penggalangan dana yang diisi dengan shalawat dan musik religi.',
      status: 'Selesai',
    },
  ];

  const handleRSVPClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 4000,
    });
  };

  return (
    <section id="events" className="py-24 relative overflow-hidden bg-black/20">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Jadwal <span className="text-gold-gradient">Event</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Mari bergabung dan rasakan langsung harmoni nada kami dalam acara-acara mendatang.
          </p>
        </motion.div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 transition-all duration-300 hover:border-gold-400/50"
            >
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="text-3xl font-bold text-gold-300">{event.date.split(' ')[0]}</div>
                <div className="text-lg text-gray-300">{event.date.split(' ').slice(1).join(' ')}</div>
              </div>
              <div className="w-full md:w-px h-px md:h-24 bg-white/10"></div>
              <div className="flex-grow text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h3 className="text-2xl font-bold text-white">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'Akan Datang' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-3">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
                <p className="text-gray-300 mb-4">{event.description}</p>
              </div>
              {event.status === 'Akan Datang' && (
                <div className="flex-shrink-0">
                  <Button
                    onClick={handleRSVPClick}
                    className="bg-gold-400 hover:bg-gold-500 text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <Ticket className="w-5 h-5 mr-2" />
                    Info & RSVP
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;