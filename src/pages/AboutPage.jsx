import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkle, Heart, Leaf } from "lucide-react";
import { Scrollama, Step } from "react-scrollama";
import clsx from "clsx";
import CreativeTeam from "@/components/CreativeTeam";
import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.webm";

const FluidBackground = () => {
    const canvasRef = useRef();
    useEffect(() => {
        if (window?.initFluidSimulation) {
            window.initFluidSimulation(canvasRef.current);
        }
    }, []);
    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
};

const values = [
    {
        icon: <Sparkle className="w-8 h-8 text-white" />,
        title: "Refined Spirit",
        desc: "Every thread whispers clarity. We craft with intention, not noise.",
    },
    {
        icon: <Heart className="w-8 h-8 text-white" />,
        title: "Human Touch",
        desc: "Each garment is ritual. A quiet act of warmth and presence.",
    },
    {
        icon: <Leaf className="w-8 h-8 text-white" />,
        title: "Sacred Sustainability",
        desc: "Design in harmony. Luxury with responsibility.",
    },
];

const timeline = [
    { year: "2021", event: "Born in silence. Neo Dervish awakens — soulwear begins." },
    { year: "2022", event: "‘Whirl in Soul’ debuts. Ritual garments step into the now." },
    { year: "2023", event: "Istanbul to Tokyo. Craft transcends borders." },
    { year: "2024", event: "Eco-shift at 80%. Legacy, redefined in care." },
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
        <main className="relative font-sans text-white ">
            {/* Fluid WebGL Background */}
            <FluidBackground />

            {/* HERO */}
            <motion.section className="relative min-h-[100dvh] flex items-center justify-center px-6 text-center overflow-hidden">
                <div className="absolute inset-0 z-0 scale-110" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[8px] z-10" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-20 max-w-4xl"
                >
                    <h1 className="text-5xl md:text-7xl font-serif tracking-tight font-semibold">
                        Beyond Fabric, Into Ritual
                    </h1>
                    <p className="text-lg md:text-xl mt-6 text-white/80">
                        Neo Dervish channels motion, emotion, and intention into every silhouette.
                    </p>
                </motion.div>
            </motion.section>

            {/* PHILOSOPHY + VIDEO */}
            <section className="py-32 px-6 md:px-12">
                <div className="grid md:grid-cols-12 items-center max-w-7xl mx-auto gap-16">
                    <motion.div
                        className="md:col-span-6"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
                            Philosophy
                        </h2>
                        <p className="text-white/70 text-lg leading-loose">
                            We are not a brand. We are a slow revolution. Each piece is form and flow — soul first.
                        </p>
                    </motion.div>
                    <motion.div
                        className="md:col-span-6 aspect-square rounded-[3rem] border border-white/10 overflow-hidden shadow-xl backdrop-blur-xl relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        {loading ? (
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900" />
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="py-32 px-6 md:px-12 bg-white/5 backdrop-blur-[12px] rounded-t-[3rem]">
                <motion.h2
                    className="text-center text-4xl md:text-5xl font-serif font-semibold mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Core Ethos
                </motion.h2>
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                    {values.map((val, i) => (
                        <motion.div
                            key={i}
                            className="p-8 rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-2xl"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.8 }}
                        >
                            {val.icon}
                            <h3 className="text-2xl font-serif mt-4 mb-2">{val.title}</h3>
                            <p className="text-white/70">{val.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CREATIVE TEAM */}
            <CreativeTeam />

            {/* TIMELINE */}
            <section className="py-32 px-6 md:px-12">
                <motion.h2
                    className="text-center text-4xl md:text-5xl font-serif font-semibold mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    The Journey
                </motion.h2>
                <div className="max-w-4xl mx-auto">
                    <Scrollama onStepEnter={handleStepEnter} offset={0.6}>
                        {timeline.map((item, i) => (
                            <Step data={i} key={i}>
                                <div
                                    className={clsx(
                                        "pl-8 py-8 border-l-4 relative transition-all duration-500",
                                        currentStep === i
                                            ? "border-white/80 bg-white/5 backdrop-blur-md shadow-xl scale-[1.02]"
                                            : "border-white/10"
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            "absolute -left-2 top-4 h-3 w-3 rounded-full",
                                            currentStep === i ? "bg-white" : "bg-white/30"
                                        )}
                                    />
                                    <h4 className="text-2xl font-serif font-semibold">{item.year}</h4>
                                    <p className="text-white/70 mt-1">{item.event}</p>
                                </div>
                            </Step>
                        ))}
                    </Scrollama>
                </div>
            </section>

            {/* CTA */}
            <section className="relative px-6 py-40 text-center bg-black/90 rounded-t-[3rem] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f')] bg-cover bg-center opacity-30 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 max-w-3xl mx-auto space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-semibold">
                        Step Into the Ritual
                    </h2>
                    <p className="text-lg text-white/80">
                        Move with meaning. Dress the becoming.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-white text-black font-medium px-10 py-6 rounded-full text-base hover:bg-neutral-200 hover:scale-105 transition"
                    >
                        <Link to="/shop" className="group flex items-center">
                            Explore the Collection
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
                        </Link>
                    </Button>
                </motion.div>
            </section>
        </main>
    );
};

export default AboutPage;
