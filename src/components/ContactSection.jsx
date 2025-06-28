import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Pesan Terkirim (Simulasi)",
      description: "Terima kasih telah menghubungi kami. Kami akan segera merespon.",
      duration: 4000,
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Jalin <span className="text-gold-gradient">Silaturahmi</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Ingin berkolaborasi atau mengundang Na'am Grupo di acara Anda? Hubungi kami.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Kirim Pesan</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gold-200 mb-2">Nama Anda</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                  placeholder="Nama Lengkap"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gold-200 mb-2">Email Anda</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gold-200 mb-2">Pesan Anda</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all resize-none"
                  placeholder="Tuliskan pesan, undangan, atau pertanyaan Anda di sini..."
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gold-400 hover:bg-gold-500 text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 group"
              >
                <Send className="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" />
                Kirim Pesan
              </Button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Info Kontak</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-gold-300" />
                  <a href="mailto:info@naamgrupo.com" className="text-gray-300 hover:text-gold-200">info@naamgrupo.com</a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-gold-300" />
                  <span className="text-gray-300">+62 812 3456 7890 (Manajemen)</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Dukungan & Donasi</h3>
              <p className="text-gray-300 mb-4">
                Dukung karya kami untuk terus menyebarkan pesan kedamaian. Setiap dukungan Anda sangat berarti.
              </p>
              <Button
                onClick={() => toast({ title: "🚧 Fitur ini belum diimplementasikan" })}
                variant="outline"
                className="w-full border-gold-200/50 text-gold-200 hover:bg-gold-200/10 hover:text-gold-100"
              >
                Dukung Karya Kami
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;