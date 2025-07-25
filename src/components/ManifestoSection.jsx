import React, { useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import Vid from '../assets/vid.mp4';

/** Luxury staggered word animation */
const AnimatedText = ({ text, el: Wrapper = 'p', className, variants }) => {
    const defaultVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', damping: 12, stiffness: 100 },
        },
    };

    const words = text.split(' ');
    return (
        <Wrapper className={className}>
            <span className="sr-only">{text}</span>
            <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ staggerChildren: 0.06 }}
                aria-hidden
                className="inline-block"
            >
                {words.map((word, idx) => (
                    <motion.span key={idx} variants={variants || defaultVariants} className="inline-block">
                        {word}&nbsp;
                    </motion.span>
                ))}
            </motion.span>
        </Wrapper>
    );
};

/** Magnetic CTA button */
const MagneticButton = ({ children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 120, damping: 14 });
    const springY = useSpring(y, { stiffness: 120, damping: 14 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        const xPct = relX / rect.width - 0.5;
        const yPct = relY / rect.height - 0.5;

        x.set(xPct * rect.width * 0.3);
        y.set(yPct * rect.height * 0.3);
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
            className="relative z-10 px-8 py-3 md:px-12 md:py-4 font-semibold tracking-wide text-white uppercase text-sm border border-white/20 rounded-full backdrop-blur-md bg-white/5 hover:border-white/60 hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
            {children}
        </motion.button>
    );
};

/** Final Manifesto Section */
const ManifestoSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center text-white text-center overflow-hidden px-6 py-24">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    src={Vid}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90 backdrop-blur-sm z-10" />
            </div>

            {/* Manifesto Content */}
            <div className="relative z-20 max-w-3xl mx-auto space-y-12">
                <AnimatedText
                    text="IN SOUL WE MOVE"
                    el="h2"
                    className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading tracking-tight leading-tight"
                    variants={{
                        hidden: { opacity: 0, y: 40 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { type: 'spring', damping: 14, stiffness: 100 },
                        },
                    }}
                />

                <AnimatedText
                    text="More than fashion — NEO DERVISH is a canvas for the soul. A bold expression of inner truth through modern design, crafted for those who move with purpose."
                    el="p"
                    className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-prose mx-auto"
                />

                <div className="pt-4">
                    <MagneticButton>Discover Our Story</MagneticButton>
                </div>
            </div>
        </section>
    );
};

export default ManifestoSection;
