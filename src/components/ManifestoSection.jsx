import React, { useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import Vid from '../assets/vid.mp4';


// --- Sub-Komponen untuk Teks Animasi ---
const AnimatedText = ({ text, el: Wrapper = 'p', className, variants }) => {
    const defaultVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } },
    };

    const textArray = text.split(' ');

    return (
        <Wrapper className={className}>
            <span className="sr-only">{text}</span>
            <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ staggerChildren: 0.05 }}
                aria-hidden
            >
                {textArray.map((word, i) => (
                    <motion.span key={i} variants={variants || defaultVariants} className="inline-block">
                        {word}&nbsp;
                    </motion.span>
                ))}
            </motion.span>
        </Wrapper>
    );
};

// --- Sub-Komponen untuk Tombol Magnetik ---
const MagneticButton = ({ children }) => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct * width * 0.4);
        y.set(yPct * height * 0.4);
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
            className="relative rounded-full px-8 py-4 text-white border border-white/30 hover:border-white/80 transition-all duration-300 backdrop-blur-sm bg-black/20"
        >
            <span className="relative z-10 font-medium">{children}</span>
        </motion.button>
    );
};

// --- Komponen Utama Seksi Manifesto ---
const ManifestoSection = () => {
    return (
        <section className="relative min-h-screen h-full flex items-center justify-center text-center text-white overflow-hidden py-24 px-6">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/90 z-10" />
                <video
                    src={Vid}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </div>

            {/* Konten */}
            <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto space-y-10">
                <AnimatedText
                    text="IN SOUL WE MOVE"
                    el="h2"
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
                    variants={{
                        hidden: { opacity: 0, y: 40 },
                        visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 80 } },
                    }}
                />

                <AnimatedText
                    text="More than fashion — RADIANT is a canvas for the soul. A bold expression of inner truth through modern design, crafted for those who move with purpose."
                    el="p"
                    className="text-lg md:text-xl text-white/80 leading-relaxed max-w-prose"
                />

                <div className="pt-4">
                    <MagneticButton>Discover Our Story</MagneticButton>
                </div>
            </div>
        </section>
    );
};

export default ManifestoSection;