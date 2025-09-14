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
    <div className={`animate-pulse bg-muted/30 rounded ${className}`} />
);

const ContactPage = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Basic sanitasi input (prevent script injection & URL spam)
    const sanitizeInput = (value) =>
        value.replace(/(<([^>]+)>)/gi, "").replace(/(https?:\/\/[^\s]+)/g, "");

    return (
        <div className="relative min-h-screen px-6 py-20 text-foreground overflow-hidden">
            {/* Blobs */}
            <motion.div

                className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl"
            />
            <motion.div

                className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
            />

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center max-w-2xl mx-auto mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-foreground via-secondary to-foreground bg-clip-text text-transparent">
                    Hubungi Kami
                </h1>
                <p className="mt-3 text-muted-foreground text-lg">
                    Ada pertanyaan? Tinggalkan pesan, tim kami siap bantu.
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
                    className="glass-card p-8 shadow-lg"
                >
                    <h2 className="text-2xl font-semibold mb-6">Kirim Pesan</h2>
                    <form className="space-y-6">
                        {["Nama Lengkap", "Email", "Pesan"].map((label, i) =>
                            loaded ? (
                                <div key={i} className="space-y-2">
                                    <label className="block text-sm text-muted-foreground">
                                        {label}
                                    </label>
                                    {label === "Pesan" ? (
                                        <textarea
                                            rows={4}
                                            required
                                            placeholder={`Tulis ${label.toLowerCase()}...`}
                                            onChange={(e) => (e.target.value = sanitizeInput(e.target.value))}
                                            className="w-full rounded-xl bg-input px-4 py-3 text-foreground placeholder-muted-foreground border border-border focus:ring-2 focus:ring-accent transition-all duration-320"
                                        />
                                    ) : (
                                        <input
                                            type={label === "Email" ? "email" : "text"}
                                            required
                                            placeholder={`Masukkan ${label.toLowerCase()}`}
                                            onChange={(e) => (e.target.value = sanitizeInput(e.target.value))}
                                            className="w-full rounded-xl bg-input px-4 py-3 text-foreground placeholder-muted-foreground border border-border focus:ring-2 focus:ring-accent transition-all duration-320"
                                        />
                                    )}
                                </div>
                            ) : (
                                <Skeleton key={i} className="h-14 w-full" />
                            )
                        )}
                        <button
                            type="submit"
                            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 rounded-xl btn-primary hover:scale-105 transition-transform duration-320"
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
                    <div className="glass-card p-6 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Info Kontak</h3>
                        <div className="space-y-3 text-muted-foreground">
                            <a
                                href="mailto:hello@luxury.com"
                                className="flex items-center gap-3 hover:text-foreground transition-colors duration-320"
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
                            <a className="p-2 rounded-full bg-muted/20 hover:bg-accent/20 transition duration-320">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a className="p-2 rounded-full bg-muted/20 hover:bg-accent/20 transition duration-320">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="glass-card p-6 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">FAQ</h3>
                        <div className="divide-y divide-border">
                            {faqs.map((faq, i) => (
                                <Disclosure key={i} faq={faq} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Floating Dock */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {[
                    { Icon: PhoneCall, bg: "btn-accent" },
                    { Icon: Mail, bg: "glass-card" },
                    { Icon: MessageCircle, bg: "btn-primary" },
                ].map(({ Icon, bg }, i) => (
                    <button
                        key={i}
                        className={`p-4 rounded-full shadow-lg ${bg} hover:scale-110 transition-transform duration-320`}
                    >
                        <Icon className="text-foreground w-5 h-5" />
                    </button>
                ))}
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
                className="flex justify-between items-center w-full text-left text-foreground/90 font-medium"
            >
                <span>{faq.question}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
            </button>
            {open && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 text-sm text-muted-foreground leading-relaxed"
                >
                    {faq.answer}
                </motion.div>
            )}
        </div>
    );
};

export default ContactPage;
