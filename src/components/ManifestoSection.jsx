import React, { useRef } from "react";
import {
    motion,
    useSpring,
    useMotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Vid from "../assets/vid.mp4";

/** 🔒 Sanitizer biar text aman */
const sanitizeText = (text) => {
    return text.replace(/<[^>]*>?/gm, "").replace(/(https?:\/\/[^\s]+)/g, "");
};

/** ✨ Word Stagger Animation */
const AnimatedText = ({ text, el: Wrapper = "p", className, variants }) => {
    const safeText = sanitizeText(text);

    const defaultVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 18, stiffness: 120 },
        },
    };

    const words = safeText.split(" ");
    return (
        <Wrapper className={className}>
            <span className="sr-only">{safeText}</span>
            <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ staggerChildren: 0.07 }}
                aria-hidden
                className="inline-block"
            >
                {words.map((word, idx) => (
                    <motion.span
                        key={idx}
                        variants={variants || defaultVariants}
                        className="inline-block"
                    >
                        {word}&nbsp;
                    </motion.span>
                ))}
            </motion.span>
        </Wrapper>
    );
};

/** 🧲 Magnetic Button CTA */
const MagneticButton = ({ children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 140, damping: 16 });
    const springY = useSpring(y, { stiffness: 140, damping: 16 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        const xPct = relX / rect.width - 0.5;
        const yPct = relY / rect.height - 0.5;
        x.set(xPct * rect.width * 0.25);
        y.set(yPct * rect.height * 0.25);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className="relative z-10 px-8 py-3 md:px-12 md:py-4 rounded-full font-medium tracking-wide 
                 bg-card/60 backdrop-blur-xl border border-border shadow-xl
                 text-foreground text-sm md:text-base
                 transition-all duration-320 ease-out
                 hover:bg-accent/20 hover:border-accent hover:text-accent-foreground
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
            {children}
            <ArrowRight className="ml-2 w-4 h-4 inline-block" />
        </motion.button>
    );
};

/** 📖 Manifesto Section */
const ManifestoSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-6 py-20 md:py-32">
            {/* Blobs */}
            <motion.div

                className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl"
            />
            <motion.div

                className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
            />

            {/* 🎥 Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    src={Vid}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-overlay backdrop-blur-sm z-10" />
            </div>

            {/* ✨ Manifesto Content */}
            <div className="relative z-20 max-w-3xl mx-auto space-y-8 md:space-y-12">
                <AnimatedText
                    text="IN SOUL WE MOVE"
                    el="h2"
                    className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading tracking-tight leading-tight text-foreground drop-shadow"
                />

                <AnimatedText
                    text="Not just fashion. Neo Dervish is movement, identity, and style — built for those who move with intent."
                    el="p"
                    className="text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-prose mx-auto"
                />

                <div className="pt-6">
                    <MagneticButton>Discover Our Story</MagneticButton>
                </div>
            </div>
        </section>
    );
};

export default ManifestoSection;
