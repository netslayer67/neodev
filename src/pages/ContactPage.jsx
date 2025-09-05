import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    PhoneCall,
    Mail,
    Instagram,
    Twitter,
    SendHorizonal,
    ChevronDown,
    MessageCircle,
} from "lucide-react";

// FAQ Data
const faqs = [
    { question: "Berapa lama pengiriman?", answer: "3-5 hari kerja." },
    { question: "Bisa ubah/batalin pesanan?", answer: "Bisa dalam 1 jam setelah order." },
    { question: "Kebijakan retur barang?", answer: "7 hari untuk barang belum dipakai." },
];

// Skeleton Loader
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
        <div className="relative min-h-screen px-6 py-20 text-white overflow-hidden bg-gradient-to-br from-[#0F0F1A] via-[#1E2A47] to-[#0F0F1A]">
            {/* Background Blobs */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{ duration: 2 }}
                className="absolute top-[-120px] left-[-100px] w-96 h-96 rounded-full bg-[#8A5CF6]/30 blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute bottom-[-120px] right-[-100px] w-96 h-96 rounded-full bg-[#1E2A47]/40 blur-3xl"
            />

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center max-w-2xl mx-auto mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                    Hubungi Kami
                </h1>
                <p className="mt-3 text-white/70 text-lg">
                    Butuh bantuan atau info lebih lanjut? Kirim pesan aja.
                </p>
            </motion.header>

            {/* Grid Layout */}
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg"
                >
                    <h2 className="text-2xl font-semibold mb-6">Kirim Pesan</h2>
                    <form className="space-y-6">
                        {["Nama Lengkap", "Email", "Pesan"].map((label, i) =>
                            loaded ? (
                                <div key={i} className="space-y-2">
                                    <label className="block text-sm text-white/70">{label}</label>
                                    {label === "Pesan" ? (
                                        <textarea
                                            rows={4}
                                            placeholder={`Tulis ${label.toLowerCase()}...`}
                                            className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#8A5CF6] transition"
                                        />
                                    ) : (
                                        <input
                                            type={label === "Email" ? "email" : "text"}
                                            placeholder={`Masukkan ${label.toLowerCase()}`}
                                            className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#8A5CF6] transition"
                                        />
                                    )}
                                </div>
                            ) : (
                                <Skeleton key={i} className="h-14 w-full" />
                            )
                        )}
                        <button
                            type="submit"
                            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#8A5CF6] to-[#1E2A47] font-semibold hover:scale-105 transition-transform duration-300"
                        >
                            <SendHorizonal className="h-5 w-5" />
                            Kirim
                        </button>
                    </form>
                </motion.div>

                {/* Contact Info + FAQs */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="space-y-10"
                >
                    {/* Info */}
                    <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Info Kontak</h3>
                        <div className="space-y-3 text-white/70">
                            <a
                                href="mailto:hello@luxury.com"
                                className="flex items-center gap-3 hover:text-white transition"
                            >
                                <Mail className="h-5 w-5" />
                                hello@luxury.com
                            </a>
                            <div className="flex items-center gap-3">
                                <PhoneCall className="h-5 w-5" />
                                +62 812 3456 7890
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <a className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">FAQ</h3>
                        <div className="divide-y divide-white/10">
                            {faqs.map((faq, i) => (
                                <Disclosure key={i} faq={faq} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Floating Dock */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                <button className="p-4 rounded-full shadow-lg bg-gradient-to-tr from-[#8A5CF6] to-[#1E2A47] hover:scale-110 transition">
                    <PhoneCall className="text-white w-5 h-5" />
                </button>
                <button className="p-4 rounded-full shadow-lg bg-gradient-to-tr from-[#1E2A47] to-[#0F0F1A] hover:scale-110 transition">
                    <Mail className="text-white w-5 h-5" />
                </button>
                <button className="p-4 rounded-full shadow-lg bg-gradient-to-tr from-[#8A5CF6] to-pink-500 hover:scale-110 transition">
                    <MessageCircle className="text-white w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// Disclosure Component (FAQ Accordion)
const Disclosure = ({ faq }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="py-3">
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
                    animate={{ height: "auto", opacity: 1 }}
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
