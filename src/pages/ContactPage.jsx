/*
  ✅ Luxury Redesign of ContactPage.jsx
  - Glassmorphism, dark neon gradients, 3D transforms
  - Fully responsive, split-screen layout, fluid UX
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, SendHorizonal, ChevronDown, Phone, Instagram, Twitter, MessageCircle, PhoneCall, MailOpen } from 'lucide-react';

const faqs = [
    {
        question: 'Berapa lama waktu pengiriman?',
        answer: 'Waktu pengiriman standar kami adalah 3-5 hari kerja...'
    },
    {
        question: 'Apakah saya bisa mengubah atau membatalkan pesanan?',
        answer: 'Pesanan dapat diubah atau dibatalkan dalam waktu 1 jam...'
    },
    {
        question: 'Bagaimana kebijakan pengembalian barang?',
        answer: 'Kami menerima pengembalian untuk barang yang belum dipakai...'
    },
];

const FormField = ({ id, label, type = 'text', placeholder, as = 'input' }) => {
    const InputComponent = as === 'textarea' ? 'textarea' : 'input';
    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-medium text-white/70 mb-2">{label}</label>
            <InputComponent
                id={id}
                type={type}
                placeholder={placeholder}
                required
                rows={as === 'textarea' ? 5 : undefined}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
            />
        </div>
    );
};

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10">
            <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between w-full py-4">
                <span className="font-semibold text-white/90 text-left">{faq.question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="h-5 w-5 text-white/50" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-sm text-white/60 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ContactPage = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white px-6 py-28">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto">
                <header className="text-center mb-20">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">Let’s Connect</h1>
                    <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">We’re here to help — reach out for support, feedback, or collaboration.</p>
                </header>

                <div className="grid lg:grid-cols-2 gap-12">
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card p-8 rounded-2xl">
                        <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                        <form className="space-y-6">
                            <FormField id="name" label="Full Name" placeholder="Your Name" />
                            <FormField id="email" label="Email" type="email" placeholder="you@example.com" />
                            <FormField id="message" label="Message" as="textarea" placeholder="Tell us how we can help you..." />
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                <SendHorizonal className="h-5 w-5" />
                                Send Message
                            </button>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-12">
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
                            <div className="space-y-4 text-white/70">
                                <a href="mailto:hello@luxury.com" className="flex items-center gap-3 hover:text-white"><MailOpen className="h-5 w-5" /> hello@luxury.com</a>
                                <div className="flex items-center gap-3"><PhoneCall className="h-5 w-5" /> +62 812 3456 7890</div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20"><Twitter className="h-5 w-5" /></a>
                                <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20"><Instagram className="h-5 w-5" /></a>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold mb-4">FAQs</h3>
                            <div className="space-y-2">
                                {faqs.map((faq, index) => (
                                    <FaqItem key={index} faq={faq} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Contact Action Button */}
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="flex flex-col gap-3">
                        <button className="bg-gradient-to-tr from-emerald-500 to-indigo-500 p-4 rounded-full shadow-lg hover:scale-110 transition"><PhoneCall className="text-white w-5 h-5" /></button>
                        <button className="bg-gradient-to-tr from-purple-500 to-pink-500 p-4 rounded-full shadow-lg hover:scale-110 transition"><Mail className="text-white w-5 h-5" /></button>
                        <button className="bg-gradient-to-tr from-yellow-400 to-red-500 p-4 rounded-full shadow-lg hover:scale-110 transition"><MessageCircle className="text-white w-5 h-5" /></button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactPage;