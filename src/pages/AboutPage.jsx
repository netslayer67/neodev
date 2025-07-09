import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Feather, Eye, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreativeTeam from "@/components/CreativeTeam";

// Helper component for staggered list animations
const AnimatedListItem = ({ children, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
        className="relative pl-8"
    >
        <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-white/80 shadow-md ring-4 ring-white/10" />
        {children}
    </motion.div>
);

const AboutPage = () => {
    // Animation variants for smooth orchestration
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const valueCards = [
        {
            icon: <Feather className="w-8 h-8 mb-4 text-white/80" />,
            title: "Authenticity",
            desc: "True to the soul. Fashion that reflects your inner journey and fearless identity."
        },
        {
            icon: <Eye className="w-8 h-8 mb-4 text-white/80" />,
            title: "Elegance",
            desc: "Minimal but bold. Every cut, fabric, and line is curated with profound meaning."
        },
        {
            icon: <Wind className="w-8 h-8 mb-4 text-white/80" />,
            title: "Movement",
            desc: "Inspired by mystic flow. Designed to follow your rhythm and conscious expression."
        },
    ];

    const timelineEvents = [
        { year: "2021", event: "Neo Dervish was born from a vision to blend spiritual concepts with modern apparel." },
        { year: "2022", event: "Launched our first signature collection, ‘Whirl in Soul’, gaining immediate traction." },
        { year: "2023", event: "Featured in Urban Fashion Week and initiated pivotal global collaborations." },
        { year: "2024", event: "Expanded our sustainable fabric sourcing, reinforcing our commitment to conscious creation." },
    ];

    return (
        <main className="bg-gradient-to-b from-black via-gray-800 to-black text-white antialiased overflow-x-hidden">

            {/* Hero Section */}
            <motion.section
                className="relative flex items-center justify-center h-screen px-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />
                <motion.div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1570184637811-f1c88f539275)' }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: "easeInOut" }}
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-20 max-w-4xl mx-auto"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight"
                    >
                        Where Soul Meets Style
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-white/80 mt-6 max-w-2xl mx-auto"
                    >
                        Neo Dervish is more than fashion — it's a movement of conscious expression. Crafted with meaning, worn with purpose.
                    </motion.p>
                </motion.div>
            </motion.section>

            {/* Philosophy Section */}
            <section className="px-6 py-32 md:py-40">
                <div className="grid md:grid-cols-12 gap-8 items-center max-w-7xl mx-auto">
                    <motion.div
                        className="md:col-span-5"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Philosophy</h2>
                        <p className="text-lg text-white/70 leading-relaxed">
                            We believe in clothing that honors both individuality and soul. Drawing from the mystic motion of dervishes, Neo Dervish merges ancient tradition with modern elegance. Each piece is a statement of fearless identity and a testament to conscious living.
                        </p>
                    </motion.div>
                    <motion.div
                        className="md:col-span-7 relative h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1542841791-1925b03a234f" // A more dynamic image
                            alt="Neo Dervish Model"
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* Brand Values Section */}
            <section className="px-6 py-32 md:py-40 bg-black/20 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1 }}
                    >
                        The Pillars of Our Craft
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {valueCards.map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
                                className="bg-white/5 p-8 rounded-xl border border-white/10 shadow-lg backdrop-blur-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2"
                            >
                                {card.icon}
                                <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
                                <p className="text-white/70 leading-relaxed">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Creative Team Section */}
            <CreativeTeam />

            {/* Timeline Section */}
            <section className="px-6 py-32 md:py-40">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-20 text-center tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1 }}
                    >
                        Our Journey
                    </motion.h2>
                    <div className="space-y-12 border-l-2 border-white/10">
                        {timelineEvents.map((item, i) => (
                            <AnimatedListItem key={i} index={i}>
                                <h4 className="text-2xl font-semibold text-white">{item.year}</h4>
                                <p className="text-white/70 mt-1 leading-relaxed">{item.event}</p>
                            </AnimatedListItem>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative px-6 py-40 text-center bg-gray-900/50">
                <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 max-w-3xl mx-auto space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Join the Movement
                    </h2>
                    <p className="text-lg text-white/80">
                        Express your soul through timeless fashion. Bold, meaningful, and uniquely yours.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-white text-black font-semibold px-10 py-7 rounded-full text-base group transition-all duration-300 ease-in-out hover:bg-neutral-200 hover:scale-105 active:scale-100"
                    >
                        <Link to="/shop">
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