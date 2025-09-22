import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, Mail, ArrowRight, Sparkles, Star, Shield, Crown, Gem, Zap, Rocket
} from "lucide-react";

const TRANS_DUR = 0.32;
const TARGET_ISO = "2025-12-01T00:00:00";

// 🕒 Countdown Hook
function useCountdown(targetIso) {
    const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
    const [time, setTime] = useState(() => calcTimeLeft(target));

    useEffect(() => {
        if (!target || Number.isNaN(target)) return;
        let frameId;

        const tick = () => {
            setTime(calcTimeLeft(target));
            frameId = requestAnimationFrame(tick);
        };

        tick();
        return () => cancelAnimationFrame(frameId);
    }, [target]);

    return time;
}

function calcTimeLeft(target) {
    const diff = Math.max(0, target - Date.now());
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        done: diff === 0
    };
}

// ✨ Security Input
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
function sanitizeInput(input = "", maxLen = 254) {
    return String(input || "")
        .slice(0, maxLen)
        .replace(/<[^>]*>/g, "")
        .replace(/https?:\/\/[^\s]+/gi, "")
        .replace(/javascript:|data:|vbscript:/gi, "")
        .replace(/on\w+=/gi, "")
        .replace(/script/gi, "")
        .replace(/[\x00-\x1F\x7F]+/g, "")
        .trim();
}

// 🌈 Decorative Animated Blobs
const DecorativeBlob = ({ className, delay = 0, intensity = "low" }) => {
    const intensityMap = { low: "opacity-10", medium: "opacity-20", high: "opacity-30" };
    return (
        <motion.div
            className={`absolute rounded-full blur-3xl pointer-events-none ${intensityMap[intensity]} ${className}`}
            animate={{ scale: [1, 1.3, 0.8, 1], rotate: [0, 90, 180, 270, 360], x: [0, 30, -20, 10, 0], y: [0, -20, 25, -10, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay }}
            style={{ background: "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--secondary)) 50%, transparent 100%)" }}
        />
    );
};

// ⏱ Countdown Unit
const CountdownUnit = ({ value, label, index, isMobile }) => (
    <motion.div initial={{ opacity: 0, y: 40, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.8, delay: index * 0.15, type: "spring", stiffness: 200, damping: 20 }} className="group perspective-1000">
        <div className="relative transform-gpu">
            <motion.div
                className="absolute -inset-2 rounded-3xl blur-xl"
                style={{ background: "linear-gradient(135deg, hsl(var(--accent)/0.3), hsl(var(--secondary)/0.3))" }}
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
            />
            <motion.div
                whileHover={{ scale: 1.05, rotateY: 5, transition: { duration: TRANS_DUR } }}
                className="relative glass-card border-accent/30 hover:border-accent/60 transition-all duration-320"
                style={{ padding: isMobile ? "1.25rem 1rem" : "2rem 1.5rem", minWidth: isMobile ? "80px" : "120px" }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={value}
                        initial={{ y: -30, opacity: 0, rotateX: 90 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: 30, opacity: 0, rotateX: -90 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                        className={`font-heading font-bold text-transparent bg-clip-text ${isMobile ? "text-3xl" : "text-5xl"}`}
                        style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--accent)), hsl(var(--secondary)))" }}
                    >
                        {String(value).padStart(2, "0")}
                    </motion.div>
                </AnimatePresence>
                <motion.div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-accent" animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }} />
            </motion.div>
        </div>
        <motion.div className="text-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.15 + 0.5 }}>
            <div className={`font-medium text-muted-foreground tracking-widest ${isMobile ? "text-xs" : "text-sm"}`}>{label}</div>
        </motion.div>
    </motion.div>
);

// 🎨 Preview Card
const PreviewCard = ({ index, isMobile }) => {
    const designs = [
        { title: "Ethereal Flow", concept: "Liquid dynamics meets structured form", rarity: "Ultra Rare", status: "90%", icon: Crown },
        { title: "Shadow Weave", concept: "Dark luxury with golden accents", rarity: "Limited", status: "85%", icon: Gem },
        { title: "Neon Genesis", concept: "Future-forward streetwear essence", rarity: "Exclusive", status: "95%", icon: Zap },
        { title: "Minimal Reign", concept: "Clean lines, maximum impact", rarity: "Signature", status: "80%", icon: Shield },
        { title: "Urban Mystic", concept: "Street meets spiritual journey", rarity: "Collector", status: "88%", icon: Sparkles },
        { title: "Void Walker", concept: "Beyond dimensions fashion", rarity: "Legendary", status: "92%", icon: Rocket }
    ];
    const design = designs[index] || designs[0];
    const IconComponent = design.icon;
    return (
        <motion.article initial={{ opacity: 0, y: 60, rotateX: -15 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} whileHover={{ y: -12, scale: 1.02, rotateY: 2, transition: { duration: TRANS_DUR, ease: "easeOut" } }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.7, delay: index * 0.15, type: "spring", stiffness: 200 }} className="group cursor-pointer transform-gpu">
            <div className="relative">
                <motion.div className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-320" style={{ background: "linear-gradient(135deg, hsl(var(--accent)/0.4), hsl(var(--secondary)/0.4))" }} />
                <div className="relative glass-card border-border/40 group-hover:border-accent/50 transition-all duration-320 overflow-hidden">
                    <div className="relative overflow-hidden" style={{ height: isMobile ? "200px" : "280px" }}>
                        <motion.div className="absolute inset-0 opacity-60" style={{ background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)/0.8), hsl(var(--card)))" }} animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="mx-auto w-16 h-16 rounded-2xl p-0.5" style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))" }}>
                                    <div className="w-full h-full rounded-2xl bg-card/80 backdrop-blur-sm flex items-center justify-center">
                                        <IconComponent className="w-7 h-7 text-accent" />
                                    </div>
                                </motion.div>
                                <div className="space-y-2">
                                    <div className="font-heading text-lg text-accent tracking-wide">PREVIEW</div>
                                    <div className="text-xs text-muted-foreground font-medium">Design {index + 1}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-5">
                        <h3 className="font-heading text-xl text-foreground group-hover:text-accent transition-colors duration-320 tracking-wide">{design.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{design.concept}</p>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

// 🚀 Main Page
export default function UpcomingPage({ targetIso = TARGET_ISO }) {
    const timeLeft = useCountdown(targetIso);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState({ ok: null, msg: "" });
    const [submitting, setSubmitting] = useState(false);
    const [lastSubmit, setLastSubmit] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleChange = useCallback((e) => {
        setEmail(sanitizeInput(e.target.value));
        if (status.msg) setStatus({ ok: null, msg: "" });
    }, [status.msg]);

    const handleSubscribe = useCallback((e) => {
        e?.preventDefault();
        if (submitting) return;

        const now = Date.now();
        if (now - lastSubmit < 5000) {
            setStatus({ ok: false, msg: "Please wait before trying again" });
            return;
        }

        const cleanEmail = sanitizeInput(email);
        if (!cleanEmail) return setStatus({ ok: false, msg: "Please enter your email" });
        if (!EMAIL_RE.test(cleanEmail)) return setStatus({ ok: false, msg: "Invalid email address" });

        setSubmitting(true);
        setLastSubmit(now);

        setTimeout(() => {
            setSubmitting(false);
            setStatus({ ok: true, msg: "Welcome to the exclusive list!" });
            setEmail("");
        }, 1500);
    }, [email, lastSubmit, submitting]);

    return (
        <div className="relative min-h-screen overflow-hidden">
            <DecorativeBlob className="w-[400px] h-[400px] -top-48 -left-48" delay={0} intensity="low" />
            <DecorativeBlob className="w-[500px] h-[500px] -bottom-60 -right-60" delay={3} intensity="medium" />
            <DecorativeBlob className="w-[300px] h-[300px] top-1/4 -left-32" delay={6} intensity="low" />
            <DecorativeBlob className="w-[200px] h-[200px] top-3/4 right-1/4" delay={9} intensity="high" />

            <main className="relative container mx-auto px-4 lg:px-8 py-8 sm:py-16">
                {/* HERO */}
                <section className="text-center space-y-8 sm:space-y-12 mb-16 sm:mb-24">
                    <motion.h1 className="font-heading text-transparent bg-clip-text text-[clamp(4rem,12vw,8rem)]" style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--accent)), hsl(var(--secondary)))" }}>
                        COMING <br /> SOON
                    </motion.h1>
                    <motion.p className={`text-muted-foreground ${isMobile ? "text-base" : "text-xl"}`}>
                        Eksklusif <span className="font-bold text-secondary">Neo Dervish</span> Collection
                    </motion.p>
                </section>

                {/* COUNTDOWN GRID */}
                <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 mb-20">
                    <div className="xl:col-span-2 flex flex-wrap justify-center gap-4">
                        {["days", "hours", "minutes", "seconds"].map((unit, idx) => (
                            <CountdownUnit key={unit} value={timeLeft[unit]} label={unit.toUpperCase()} index={idx} isMobile={isMobile} />
                        ))}
                    </div>

                    {/* WAITLIST */}
                    <div className="xl:col-span-1">
                        <div className="relative glass-card border-secondary/30 p-6 flex flex-col gap-4">
                            <h3 className="font-heading text-2xl text-foreground text-center">Join Waitlist</h3>
                            <p className="text-sm text-muted-foreground text-center">Early access & exclusive updates</p>
                            <div className="flex items-center gap-4 p-3 rounded-2xl border border-border bg-card/80 backdrop-blur-glass">
                                <Mail className="w-5 h-5 text-accent" />
                                <input type="email" placeholder="your@email.com" value={email} onChange={handleChange} maxLength={254} className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground" />
                            </div>
                            <button onClick={handleSubscribe} disabled={submitting || !email.trim()} className="btn-primary w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2">
                                {submitting ? "Joining..." : "Get Notified"} <ArrowRight className="w-4 h-4" />
                            </button>
                            {status.msg && <p className={`text-center text-sm p-2 rounded-lg ${status.ok ? "text-success bg-success/10" : "text-error bg-error/10"}`}>{status.msg}</p>}
                        </div>
                    </div>
                </section>

                {/* PREVIEW GRID */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, idx) => <PreviewCard key={idx} index={idx} isMobile={isMobile} />)}
                </section>
            </main>
        </div>
    );
}
