import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserCircle2, ArrowRight } from "lucide-react";

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

    const orb1 = useTransform(scrollYProgress, [0, 1], ["-10%", "25%"]);
    const orb2 = useTransform(scrollYProgress, [0, 1], ["20%", "-15%"]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative px-6 py-24 md:py-32 bg-[#0F0F1A] text-white overflow-hidden"
        >
            {/* Blobs */}
            <motion.div
                style={{ y: orb1 }}
                className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-[#8A5CF6]/20 blur-3xl"
            />
            <motion.div
                style={{ y: orb2 }}
                className="absolute bottom-[-80px] right-[-60px] w-72 h-72 rounded-full bg-[#1E2A47]/40 blur-3xl"
            />

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center space-y-16">
                {/* Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
                        Meet the Team
                    </h2>
                    <p className="text-white/70 text-lg">
                        The people shaping vision into wearable experiences.
                    </p>
                </motion.div>

                {/* Team Cards */}
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={member.name}
                            className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500"
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.15, duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#8A5CF6]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition duration-500" />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center px-6 py-10 space-y-6 text-center">
                                {loading ? (
                                    <div className="w-20 h-20 rounded-full bg-[#1E2A47]/50 animate-pulse" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-[#1E2A47]/60 border border-white/10 flex items-center justify-center">
                                        <UserCircle2 className="w-10 h-10 text-white/80" />
                                    </div>
                                )}

                                <div className="space-y-1">
                                    {loading ? (
                                        <div className="w-24 h-4 bg-white/20 rounded-full animate-pulse mx-auto" />
                                    ) : (
                                        <h3 className="text-lg font-semibold">{member.name}</h3>
                                    )}
                                    {loading ? (
                                        <div className="w-16 h-3 bg-white/10 rounded-full animate-pulse mx-auto" />
                                    ) : (
                                        <p className="text-sm text-white/60">{member.role}</p>
                                    )}
                                </div>

                                {!loading && (
                                    <div className="opacity-0 group-hover:opacity-100 transition duration-500">
                                        <button className="flex items-center gap-1 text-sm text-[#8A5CF6] hover:text-white transition">
                                            View Profile
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
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
