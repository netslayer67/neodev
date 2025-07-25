import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    PhoneCall,
    MailOpen,
    Instagram,
    Twitter,
    SendHorizonal,
    ChevronDown,
    Mail,
    MessageCircle
} from 'lucide-react';

const faqs = [
    {
        question: 'Berapa lama waktu pengiriman?',
        answer: 'Waktu pengiriman standar kami adalah 3-5 hari kerja.',
    },
    {
        question: 'Apakah saya bisa mengubah atau membatalkan pesanan?',
        answer: 'Pesanan dapat diubah atau dibatalkan dalam waktu 1 jam setelah pemesanan.',
    },
    {
        question: 'Bagaimana kebijakan pengembalian barang?',
        answer: 'Kami menerima pengembalian untuk barang yang belum dipakai dalam 7 hari.',
    },
];

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-white/10 rounded ${className}`} />
);

const ContactPage = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white px-6 py-24 relative">
            {/* Glass Top Header */}
            <motion.header
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-2xl mx-auto mb-20"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
                    Get in Touch
                </h1>
                <p className="mt-4 text-white/60 text-lg">
                    Our team is ready to assist you. Whether it’s feedback, support, or partnership, we’re just one message away.
                </p>
            </motion.header>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl p-8"
                >
                    <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
                    <form className="space-y-6">
                        {['Full Name', 'Email', 'Message'].map((label, idx) =>
                            loaded ? (
                                <div key={idx} className="space-y-2">
                                    <label className="block text-white/70 text-sm">{label}</label>
                                    {label === 'Message' ? (
                                        <textarea
                                            rows={5}
                                            className="w-full rounded-xl bg-white/10 backdrop-blur px-4 py-3 text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-emerald-500 transition"
                                            placeholder={`Your ${label.toLowerCase()}...`}
                                        />
                                    ) : (
                                        <input
                                            type={label === 'Email' ? 'email' : 'text'}
                                            className="w-full rounded-xl bg-white/10 backdrop-blur px-4 py-3 text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-emerald-500 transition"
                                            placeholder={`Your ${label.toLowerCase()}`}
                                        />
                                    )}
                                </div>
                            ) : (
                                <Skeleton key={idx} className="h-14 w-full" />
                            )
                        )}
                        <button
                            type="submit"
                            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-semibold hover:scale-105 transition-transform duration-300"
                        >
                            <SendHorizonal className="h-5 w-5" />
                            Send Message
                        </button>
                    </form>
                </motion.div>

                {/* Info + FAQs */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    {/* Contact Info */}
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
                        <div className="space-y-4 text-white/70">
                            <a href="mailto:hello@luxury.com" className="flex items-center gap-3 hover:text-white transition">
                                <MailOpen className="h-5 w-5" />
                                hello@luxury.com
                            </a>
                            <div className="flex items-center gap-3">
                                <PhoneCall className="h-5 w-5" />
                                +62 812 3456 7890
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* FAQs */}
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">FAQs</h3>
                        <div className="divide-y divide-white/10">
                            {faqs.map((faq, index) => (
                                <Disclosure key={index} faq={faq} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Floating Dock */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                <button className="bg-gradient-to-tr from-emerald-500 to-indigo-500 p-4 rounded-full shadow-lg hover:scale-110 transition">
                    <PhoneCall className="text-white w-5 h-5" />
                </button>
                <button className="bg-gradient-to-tr from-purple-500 to-pink-500 p-4 rounded-full shadow-lg hover:scale-110 transition">
                    <Mail className="text-white w-5 h-5" />
                </button>
                <button className="bg-gradient-to-tr from-yellow-400 to-red-500 p-4 rounded-full shadow-lg hover:scale-110 transition">
                    <MessageCircle className="text-white w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

const Disclosure = ({ faq }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="py-4">
            <button
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center w-full text-left text-white/90 font-medium"
            >
                <span>{faq.question}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-white/60" />
                </motion.div>
            </button>
            {open && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 text-sm text-white/60 leading-relaxed"
                >
                    {faq.answer}
                </motion.div>
            )}
        </div>
    );
};

export default ContactPage;
