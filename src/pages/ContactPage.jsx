import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, SendHorizonal, ChevronDown, Phone, Instagram, Twitter } from 'lucide-react';

// --- Data untuk FAQ ---
const faqs = [
    {
        question: 'Berapa lama waktu pengiriman?',
        answer: 'Waktu pengiriman standar kami adalah 3-5 hari kerja untuk wilayah Jabodetabek dan 5-10 hari kerja untuk luar Jabodetabek. Anda akan menerima email dengan nomor pelacakan setelah pesanan Anda dikirim.',
    },
    {
        question: 'Apakah saya bisa mengubah atau membatalkan pesanan?',
        answer: 'Pesanan dapat diubah atau dibatalkan dalam waktu 1 jam setelah pemesanan. Harap segera hubungi kami melalui email dengan subjek "URGENT: Perubahan Pesanan" dan sertakan ID pesanan Anda.',
    },
    {
        question: 'Bagaimana kebijakan pengembalian barang?',
        answer: 'Kami menerima pengembalian untuk barang yang belum dipakai dengan label masih terpasang dalam waktu 14 hari setelah diterima. Silakan kunjungi halaman Kebijakan Pengembalian kami untuk detail lebih lanjut.',
    },
];

// --- Sub-Komponen untuk Clean Code ---

// Komponen Input Form yang Ditingkatkan
const FormField = ({ id, label, type = 'text', placeholder, as = 'input' }) => {
    const InputComponent = as === 'textarea' ? 'textarea' : 'input';
    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-medium text-neutral-300 mb-2">
                {label}
            </label>
            <InputComponent
                id={id}
                type={type}
                placeholder={placeholder}
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-300"
                rows={as === 'textarea' ? 5 : undefined}
            />
        </div>
    );
};

// Komponen Accordion untuk FAQ
const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
            >
                <span className="font-medium text-white">{faq.question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-neutral-300 text-sm leading-relaxed">{faq.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- Komponen Utama Halaman Kontak ---
const ContactPage = () => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white py-24 px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">Get In Touch</h1>
                    <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
                        Punya pertanyaan, feedback, atau hanya ingin menyapa? Kami siap mendengar dari Anda.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="relative p-px overflow-hidden rounded-3xl bg-transparent">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl" />
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative p-8 md:p-12 bg-gray-950/60 backdrop-blur-2xl rounded-[23px] grid lg:grid-cols-2 gap-12"
                    >
                        {/* Kolom Kiri: Form */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h2 className="text-2xl font-semibold text-white">Send a Message</h2>
                            <form className="space-y-6">
                                <FormField id="name" label="Full Name" placeholder="Your Name" />
                                <FormField id="email" label="Email Address" type="email" placeholder="you@example.com" />
                                <FormField id="message" label="Message" placeholder="Tell us what's on your mind..." as="textarea" />
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-[1.02]"
                                >
                                    <SendHorizonal className="h-5 w-5" />
                                    Send Message
                                </button>
                            </form>
                        </motion.div>

                        {/* Kolom Kanan: Info & FAQ */}
                        <motion.div variants={itemVariants} className="space-y-10">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
                                <div className="space-y-4 text-neutral-300">
                                    <a href="mailto:support@radiant.com" className="flex items-center gap-3 group">
                                        <Mail className="h-5 w-5 text-neutral-400" />
                                        <span className="group-hover:text-white transition-colors">support@radiant.com</span>
                                    </a>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-neutral-400" />
                                        <span>+62 21 1234 5678</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-6">
                                    <a href="#" className="p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition-colors"><Twitter className="h-5 w-5" /></a>
                                    <a href="#" className="p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition-colors"><Instagram className="h-5 w-5" /></a>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Frequently Asked Questions</h3>
                                <div className="space-y-2">
                                    {faqs.map((faq, i) => (
                                        <FaqItem key={i} faq={faq} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactPage;