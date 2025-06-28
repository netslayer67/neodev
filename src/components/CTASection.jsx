import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CTASection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const services = [
    'Social Media Content Creation',
    'Video Editing Profesional',
    'Copywriting & Caption Strategis',
    'Web Design Interaktif',
    'Konsultasi Strategi Digital',
    'Paket Lengkap (All Services)'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 4000,
    });
  };

  const handleWhatsAppClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 4000,
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow">
            Siap Memulai{' '}
            <span className="gradient-text">Transformasi</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Jangan biarkan kompetitor Anda unggul lebih jauh. 
            Mulai perjalanan digital transformation Anda hari ini!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-8"
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Konsultasi{' '}
              <span className="gradient-text">Gratis</span>
            </h3>
            <p className="text-gray-300 mb-8">
              Ceritakan goals bisnis Anda dan dapatkan strategi digital yang tepat sasaran.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    No. WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Layanan yang Diminati
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                  >
                    <option value="" className="bg-gray-800">Pilih layanan</option>
                    {services.map((service, index) => (
                      <option key={index} value={service} className="bg-gray-800">
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Ceritakan Project Anda
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 resize-none"
                  placeholder="Jelaskan goals, target audience, dan ekspektasi Anda..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-2xl hover-lift group"
              >
                <Send className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform" />
                Kirim Konsultasi Gratis
              </Button>
            </form>
          </motion.div>

          {/* Contact Info & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Quick WhatsApp CTA */}
            <div className="glass-effect rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Butuh Respon{' '}
                <span className="gradient-text">Cepat?</span>
              </h3>
              <p className="text-gray-300 mb-6">
                Chat langsung dengan tim kami di WhatsApp untuk konsultasi instan!
              </p>
              <Button
                onClick={handleWhatsAppClick}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover-lift pulse-glow group w-full"
              >
                <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Chat WhatsApp Sekarang
              </Button>
            </div>

            {/* Contact Information */}
            <div className="glass-effect rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Informasi{' '}
                <span className="gradient-text">Kontak</span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Telepon</div>
                    <div className="text-gray-300">+62 812-3456-7890</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-gray-300">hello@benerunpro.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Lokasi</div>
                    <div className="text-gray-300">Jakarta, Indonesia</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Jam Operasional</div>
                    <div className="text-gray-300">Senin - Jumat: 09:00 - 18:00</div>
                    <div className="text-gray-300">Sabtu: 09:00 - 15:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="glass-effect rounded-3xl p-6 text-center border border-green-400/30">
              <div className="text-green-400 font-bold text-lg mb-2">
                ✅ 100% Satisfaction Guarantee
              </div>
              <p className="text-gray-300 text-sm">
                Tidak puas dengan hasil? Kami akan revisi hingga Anda benar-benar puas!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Jangan Tunggu Lagi!{' '}
              <span className="gradient-text">Mulai Sekarang</span>
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Setiap hari yang terlewat adalah kesempatan yang hilang. 
              Kompetitor Anda mungkin sudah selangkah lebih maju.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={handleWhatsAppClick}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover-lift pulse-glow"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Konsultasi Gratis Sekarang
              </Button>
              <Button
                onClick={handleSubmit}
                variant="outline"
                size="lg"
                className="glass-effect border-blue-400/50 text-white hover:bg-blue-600/20 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover-lift"
              >
                Lihat Portfolio Lengkap
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;