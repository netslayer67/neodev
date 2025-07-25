import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserCircle2 } from "lucide-react";

const teamMembers = [
    { name: "Arif", role: "Art Director" },
    { name: "Nadia", role: "Fashion Lead" },
    { name: "Reza", role: "Brand Strategist" },
    { name: "Kinan", role: "Visual Designer" },
];

const CreativeTeam = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const shimmer = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);
    const orb1 = useTransform(scrollYProgress, [0, 1], ["-20%", "30%"]);
    const orb2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative px-6 py-32 md:py-40 bg-gradient-to-b from-neutral-950 via-black to-neutral-900 text-white overflow-hidden"
        >
            {/* Glass orbs */}
            <motion.div
                style={{ y: orb1 }}
                className="absolute top-[-100px] left-[-80px] w-80 h-80 bg-pink-400/20 blur-3xl rounded-full z-0"
            />
            <motion.div
                style={{ y: orb2 }}
                className="absolute bottom-[-100px] right-[-80px] w-80 h-80 bg-indigo-400/20 blur-3xl rounded-full z-0"
            />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center space-y-20">
                {/* Intro Text */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
                        The Creative Force
                    </h2>
                    <p className="text-white/70 text-lg">
                        A symphony of visionaries blending design, soul, and storytelling into wearable poetry.
                    </p>
                </motion.div>

                {/* Team Cards */}
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-2 md:px-4">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={member.name}
                            className="relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.15, duration: 0.9 }}
                            viewport={{ once: true }}
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-80 blur-xl transition-all duration-700 z-0" />

                            {/* Card Content */}
                            <div className="relative z-10 flex flex-col items-center px-6 py-10 text-center space-y-6">
                                {loading ? (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-700 animate-pulse" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                                        <UserCircle2 className="w-12 h-12 text-white/70" />
                                    </div>
                                )}

                                <div className="space-y-1">
                                    {loading ? (
                                        <div className="w-32 h-4 bg-white/20 rounded-full animate-pulse mx-auto" />
                                    ) : (
                                        <h3 className="text-xl font-serif font-semibold">{member.name}</h3>
                                    )}
                                    {loading ? (
                                        <div className="w-20 h-3 bg-white/10 rounded-full animate-pulse mx-auto" />
                                    ) : (
                                        <p className="text-sm text-white/60">{member.role}</p>
                                    )}
                                </div>

                                {!loading && (
                                    <div className="opacity-0 group-hover:opacity-100 transition duration-500">
                                        <a
                                            href="#"
                                            className="text-sm text-pink-400 hover:text-pink-300 transition"
                                        >
                                            View Portfolio →
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CreativeTeam;
