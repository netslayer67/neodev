import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkle, Heart, Leaf } from "lucide-react";
import { Scrollama, Step } from "react-scrollama";
import clsx from "clsx";
import CreativeTeam from "@/components/CreativeTeam";
import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.webm";

const values = [
    {
        icon: <Sparkle className="w-8 h-8 text-[#8A5CF6]" />,
        title: "Refined Spirit",
        desc: "Clarity in every detail. Designed with purpose.",
    },
    {
        icon: <Heart className="w-8 h-8 text-[#8A5CF6]" />,
        title: "Human Touch",
        desc: "Made with care. Fashion that feels close.",
    },
    {
        icon: <Leaf className="w-8 h-8 text-[#8A5CF6]" />,
        title: "Sustainable Flow",
        desc: "Modern design, future-friendly choices.",
    },
];

const timeline = [
    { year: "2021", event: "The brand was born." },
    { year: "2022", event: "First collection launched." },
    { year: "2023", event: "Expanded globally." },
    { year: "2024", event: "Shifted to 80% eco materials." },
];

const AboutPage = () => {
    const [currentStep, setCurrentStep] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timeout);
    }, []);

    const handleStepEnter = ({ data }) => setCurrentStep(data);

    return (
        <main className="relative font-sans text-white bg-[#0F0F1A]">
            {/* Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-[#8A5CF6]/20 blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-[#1E2A47]/40 blur-3xl animate-pulse" />

            {/* HERO */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6"
            >
                <h1 className="text-4xl md:text-6xl font-serif font-semibold leading-tight">
                    Beyond Fabric, Into Ritual
                </h1>
                <p className="text-white/70 text-lg md:text-xl mt-6 max-w-2xl">
                    Motion, emotion, and intention in every piece.
                </p>
            </motion.section>

            {/* PHILOSOPHY + VIDEO */}
            <section className="py-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
                            Philosophy
                        </h2>
                        <p className="text-white/70 text-lg leading-relaxed">
                            We move with clarity. Each design balances flow, form, and soul.
                        </p>
                    </motion.div>

                    <motion.div
                        className="aspect-square rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9 }}
                        viewport={{ once: true }}
                    >
                        {loading ? (
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#1E2A47] to-[#0F0F1A]" />
                        ) : (
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source src={Logo} type="video/webm" />
                            </video>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="py-24 px-6 md:px-12 bg-white/5 backdrop-blur-lg rounded-t-[3rem]">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center text-3xl md:text-4xl font-serif font-semibold mb-16"
                >
                    Core Values
                </motion.h2>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {values.map((val, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.7 }}
                            className="p-8 rounded-3xl border border-white/10 bg-[#1E2A47]/40 backdrop-blur-xl shadow-xl"
                        >
                            {val.icon}
                            <h3 className="text-xl font-serif mt-4 mb-2">{val.title}</h3>
                            <p className="text-white/70">{val.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CREATIVE TEAM */}
            <CreativeTeam />

            {/* TIMELINE */}
            <section className="py-24 px-6 md:px-12">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center text-3xl md:text-4xl font-serif font-semibold mb-16"
                >
                    The Journey
                </motion.h2>

                <div className="max-w-3xl mx-auto">
                    <Scrollama onStepEnter={handleStepEnter} offset={0.6}>
                        {timeline.map((item, i) => (
                            <Step data={i} key={i}>
                                <div
                                    className={clsx(
                                        "pl-6 py-6 border-l-4 relative rounded-xl transition-all duration-500",
                                        currentStep === i
                                            ? "border-[#8A5CF6] bg-white/5 backdrop-blur-md shadow-lg"
                                            : "border-white/10"
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            "absolute -left-2 top-4 h-3 w-3 rounded-full",
                                            currentStep === i ? "bg-[#8A5CF6]" : "bg-white/40"
                                        )}
                                    />
                                    <h4 className="text-xl font-serif font-semibold">
                                        {item.year}
                                    </h4>
                                    <p className="text-white/70 mt-1">{item.event}</p>
                                </div>
                            </Step>
                        ))}
                    </Scrollama>
                </div>
            </section>

            {/* CTA */}
            <section className="relative px-6 py-32 text-center bg-[#1E2A47]/80 backdrop-blur-xl rounded-t-[3rem] overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className="relative z-10 max-w-3xl mx-auto space-y-6"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-semibold">
                        Step Into the Ritual
                    </h2>
                    <p className="text-white/70 text-lg">
                        Move with meaning. Dress with soul.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-[#8A5CF6] text-white font-medium px-8 py-5 rounded-full text-base hover:bg-[#7a4ee0] transition-all duration-300 shadow-xl"
                    >
                        <Link to="/shop" className="flex items-center justify-center gap-2">
                            Explore Collection
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </motion.div>
            </section>
        </main>
    );
};

export default AboutPage;
