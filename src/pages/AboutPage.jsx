import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Feather, Eye, Wind, Moon, Sun } from "lucide-react";
import { Scrollama, Step } from "react-scrollama";
import clsx from "clsx";
import CreativeTeam from "@/components/CreativeTeam";
import { Button } from "@/components/ui/button";

// FLUID CANVAS SHADER COMPONENT
const FluidBackground = () => {
    const canvasRef = useRef();

    useEffect(() => {
        if (window && window.initFluidSimulation) {
            window.initFluidSimulation(canvasRef.current);
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="fluid-canvas"
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
};

const values = [
    {
        icon: <Feather className="w-8 h-8 text-white/90" />,
        title: "Authenticity",
        desc: "Artful integrity stitched into every seam. Rooted in spirit, radiating clarity.",
    },
    {
        icon: <Eye className="w-8 h-8 text-white/90" />,
        title: "Elegance",
        desc: "Minimal yet magnetic. Our craft dances between subtlety and statement.",
    },
    {
        icon: <Wind className="w-8 h-8 text-white/90" />,
        title: "Movement",
        desc: "Garments that breathe and flow. Designed to follow — and free — your rhythm.",
    },
];

const timeline = [
    { year: "2021", event: "Neo Dervish awakens — soulwear envisioned as sacred expression." },
    { year: "2022", event: "‘Whirl in Soul’ collection debuts — redefining fashion with presence." },
    { year: "2023", event: "From Istanbul to Tokyo — collaboration with mindful artisans begins." },
    { year: "2024", event: "80% sustainable shift. Beauty becomes breath, form meets responsibility." },
];

const AboutPage = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [currentStep, setCurrentStep] = useState(null);

    const toggleDarkMode = () => setDarkMode((prev) => !prev);
    const handleStepEnter = ({ data }) => setCurrentStep(data);

    return (
        <main className={clsx("transition-colors duration-700 ease-in-out", darkMode ? "bg-neutral-950 text-white" : "bg-white text-black")}>
            {/* Toggle */}
            {/* <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={toggleDarkMode}
                    className="rounded-full p-3 backdrop-blur-md bg-white/10 dark:bg-white/5 hover:scale-105 transition"
                >
                    {darkMode ? <Sun className="text-white w-5 h-5" /> : <Moon className="text-black w-5 h-5" />}
                </button>
            </div> */}

            {/* Hero */}
            <motion.section className="relative flex items-center justify-center h-screen px-6 text-center overflow-hidden">
                {/* Background image behind fluid */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center scale-110"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1570184637811-f1c88f539275)",
                    }}
                />

                {/* Fluid liquid distortion canvas (overlaid above image) */}
                <FluidBackground />

                {/* Dark overlay & blur for glassmorphism effect */}
                <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[6px]" />

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1.2 }}
                    className="relative z-20 max-w-3xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-extrabold leading-tight tracking-tight">
                        More Than Fashion — A State of Being
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl mt-6">
                        Neo Dervish sculpts soul into silhouette. Each thread, a whisper of intention.
                    </p>
                </motion.div>
            </motion.section>


            {/* Philosophy */}
            <section className="px-6 py-32 md:py-40">
                <div className="grid md:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
                    <motion.div
                        className="md:col-span-5"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">Our Philosophy</h2>
                        <p className="text-white/70 dark:text-black/70 text-lg leading-relaxed">
                            We don’t chase trends — we cultivate soul. Neo Dervish is motion. Is ritual. Is revelation in cloth.
                        </p>
                    </motion.div>
                    <motion.div
                        className="md:col-span-7 relative h-[600px] rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src="https://ik.imagekit.io/oidnycd6o/neo_products/1753110594579-ChatGPT_Image_Jul_20__2025__05_55_40_PM.webp"
                            alt="Philosophical fashion"
                            className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 py-32 md:py-40 bg-white/5 dark:bg-black/5 backdrop-blur-2xl rounded-t-[3rem]">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-semibold mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        Pillars of Our Essence
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {values.map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: i * 0.2, duration: 0.9 }}
                                className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-xl backdrop-blur-lg hover:-translate-y-2 transition-transform"
                            >
                                {val.icon}
                                <h3 className="text-2xl font-medium mb-4 font-serif">{val.title}</h3>
                                <p className="text-white/70 dark:text-black/70">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <CreativeTeam />

            {/* Timeline */}
            <section className="px-6 py-32 md:py-40">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif font-semibold mb-20 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        Our Journey
                    </motion.h2>
                    <Scrollama onStepEnter={handleStepEnter} offset={0.6}>
                        {timeline.map((item, i) => (
                            <Step data={i} key={i}>
                                <div
                                    className={clsx(
                                        "transition-all duration-500 pl-8 py-8 border-l-4 relative",
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
                                    <p className="text-white/70 dark:text-black/70 mt-1">{item.event}</p>
                                </div>
                            </Step>
                        ))}
                    </Scrollama>
                </div>
            </section>

            {/* CTA */}
            <section className="relative px-6 py-40 text-center bg-black/80 dark:bg-white/90 rounded-t-[2rem] overflow-hidden">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 scale-110"
                    style={{ backgroundImage: "url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 max-w-3xl mx-auto space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-semibold">Step Into The Current</h2>
                    <p className="text-lg text-white/80 dark:text-black/70">
                        Wear the story of your becoming. Flow into form, purpose, and poetic elegance.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-white text-black font-medium px-10 py-6 rounded-full text-base transition-all duration-300 hover:bg-neutral-200 hover:scale-105"
                    >
                        <Link to="/shop" className="group flex items-center">
                            Explore The Collection
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </motion.div>
            </section>
        </main>
    );
};

export default AboutPage;
