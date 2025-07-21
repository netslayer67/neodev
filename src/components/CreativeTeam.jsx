import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserCircle2 } from "lucide-react"; // Lucide icon
import { cn } from "@/lib/utils"; // Optional if you use clsx/cn for classnames

const teamMembers = [
    { name: "Arif", role: "Art Director" },
    { name: "Nadia", role: "Fashion Lead" },
    { name: "Reza", role: "Brand Strategist" },
    { name: "Kinan", role: "Visual Designer" },
];

const CreativeTeam = () => {
    const sectionRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const yGlow1 = useTransform(scrollYProgress, [0, 1], ["-30%", "10%"]);
    const yGlow2 = useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.15,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
    };

    return (
        <section
            ref={sectionRef}
            className="relative py-28 md:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-neutral-950 via-black to-neutral-900 text-white"
        >
            {/* Floating light orbs */}
            <motion.div
                style={{ y: yGlow1 }}
                className="absolute top-[-150px] left-[-100px] w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-60"
            />
            <motion.div
                style={{ y: yGlow2 }}
                className="absolute bottom-[-150px] right-[-100px] w-72 h-72 bg-pink-500/20 rounded-full blur-3xl opacity-60"
            />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24 items-start z-10 relative">
                {/* Text Intro */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1 }}
                    className="lg:col-span-1 text-center lg:text-left"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-semibold leading-tight mb-6">
                        Meet the Visionaries
                    </h2>
                    <p className="text-white/70 text-lg max-w-md mx-auto lg:mx-0">
                        Artisans of presence. Our team weaves emotion, philosophy, and precision into every piece.
                    </p>
                </motion.div>

                {/* Team Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={member.name}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInUp}
                            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:shadow-2xl"
                        >
                            {/* Glowing border on hover */}
                            <div className="absolute -inset-px z-0 bg-gradient-to-tr from-purple-600/20 via-pink-600/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 blur-2xl" />

                            <div className="relative z-10 flex flex-col items-center text-center px-6 py-10 space-y-6">
                                <div className="w-24 h-24 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                                    <UserCircle2 className="w-12 h-12 text-white/70" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium font-serif">{member.name}</h3>
                                    <p className="text-sm text-white/60 mt-1">{member.role}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition duration-300">
                                    <a href="#" className="text-sm text-pink-400 hover:text-pink-300">
                                        View Portfolio →
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CreativeTeam;
