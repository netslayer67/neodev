import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkle, Heart, Leaf, Circle } from "lucide-react";
import CreativeTeam from '@/components/CreativeTeam'

// Mock components for demo
const Button = ({ children, className, asChild, size, ...props }) => {
    const baseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
    const sizeClass = size === "lg" ? "h-11 px-8" : "h-10 px-4 py-2";
    return (
        <button className={`${baseClass} ${sizeClass} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Link = ({ to, children, className, ...props }) => (
    <a href={to} className={className} {...props}>{children}</a>
);


// Mock video source
const Logo = "https://via.placeholder.com/800x800";

// Input sanitizer untuk keamanan
const sanitizeInput = (input) => {
    const dangerous = /<script|javascript:|onerror|onclick|<iframe|<embed|<object/gi;
    return input.replace(dangerous, '').trim();
};

const AboutPage = () => {
    const [loading, setLoading] = useState(true);
    const [activeValue, setActiveValue] = useState(0);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 320);
        return () => clearTimeout(timeout);
    }, []);

    const values = [
        {
            icon: <Sparkle className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Refined",
            desc: "Clarity meets purpose",
            gradient: "from-accent/40 to-info/30"
        },
        {
            icon: <Heart className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Crafted",
            desc: "Human touch matters",
            gradient: "from-error/40 to-warning/30"
        },
        {
            icon: <Leaf className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Conscious",
            desc: "Future-forward design",
            gradient: "from-success/40 to-secondary/30"
        }
    ];

    const timeline = [
        { year: "21", event: "Born from vision", color: "accent" },
        { year: "22", event: "First drop", color: "secondary" },
        { year: "23", event: "Global reach", color: "info" },
        { year: "24", event: "80% sustainable", color: "success" }
    ];

    return (
        <main className="relative overflow-hidden">
            {/* Liquid Glass Hero */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-[100dvh] flex items-center justify-center px-4 md:px-8"
            >
                {/* Premium Animated Blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 100, -100, 0],
                            y: [0, -100, 100, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] bg-gradient-to-br from-accent/20 via-transparent to-info/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -100, 100, 0],
                            y: [0, 100, -100, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] bg-gradient-to-br from-secondary/20 via-transparent to-warning/10 rounded-full blur-3xl"
                    />
                </div>

                {/* Glass Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 max-w-4xl mx-auto text-center"
                >
                    {/* iOS Glass Effect Card */}
                    <div className="relative p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-card/30 backdrop-blur-2xl border border-border/50 shadow-2xl">
                        {/* Gradient Border Effect */}
                        <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-accent/20 via-transparent to-secondary/20 opacity-60" />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 mb-6 rounded-full bg-gradient-to-br from-accent/30 to-info/30 backdrop-blur-xl border border-border/30"
                            >
                                <Sparkle className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                            </motion.div>

                            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-4 bg-gradient-to-br from-foreground via-accent to-secondary bg-clip-text text-transparent">
                                BEYOND FABRIC
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground/90 font-light">
                                Where ritual meets runway
                            </p>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-8 -right-8 md:-top-12 md:-right-12"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent/40 to-transparent backdrop-blur-xl border border-accent/20" />
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 rounded-full border-2 border-muted-foreground/30"
                    >
                        <div className="w-1 h-2 bg-accent rounded-full mx-auto mt-2" />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Philosophy Section - Luxury Grid */}
            <section className="relative py-16 md:py-24 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center"
                    >
                        {/* Text Content */}
                        <div className="order-2 lg:order-1">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="inline-block px-4 py-1.5 mb-4 text-xs md:text-sm font-medium text-secondary bg-secondary/10 rounded-full border border-secondary/20"
                            >
                                PHILOSOPHY
                            </motion.span>

                            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                Movement with meaning
                            </h2>

                            <p className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">
                                Each piece balances flow & form. Designed for those who move with intention.
                            </p>

                            {/* Mobile-optimized CTA */}
                            <Button
                                asChild
                                className="mt-6 bg-gradient-to-r from-accent to-info text-white border-0 hover:shadow-lg hover:shadow-accent/20 transition-all duration-320"
                            >
                                <Link to="/shop" className="flex items-center gap-2">
                                    Discover
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>

                        {/* Video Container - Premium Glass Effect */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2 relative aspect-square md:aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-2xl border border-border/30 shadow-2xl"
                        >
                            {loading ? (
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-secondary/10 animate-pulse" />
                            ) : (
                                <>
                                    <video
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    >
                                        <source src={Logo} type="video/webm" />
                                    </video>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Core Values - Luxury Cards */}
            <section className="relative py-16 md:py-24 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center font-heading text-3xl md:text-5xl font-bold mb-12 md:mb-16"
                    >
                        Core Values
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                        {values.map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                onHoverStart={() => setActiveValue(i)}
                                className="group relative"
                            >
                                <div className="relative h-full p-6 md:p-8 rounded-2xl md:rounded-3xl bg-card/40 backdrop-blur-xl border border-border/30 hover:border-accent/30 transition-all duration-320 overflow-hidden">
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${val.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-320`} />

                                    <div className="relative z-10">
                                        <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mb-4 rounded-2xl bg-gradient-to-br from-accent/10 to-info/10 group-hover:from-accent/20 group-hover:to-info/20 transition-all duration-320">
                                            {val.icon}
                                        </div>

                                        <h3 className="font-heading text-xl md:text-2xl font-bold mb-2 group-hover:text-accent transition-colors duration-320">
                                            {val.title}
                                        </h3>

                                        <p className="text-sm md:text-base text-muted-foreground/70">
                                            {val.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Creative Team */}
            <CreativeTeam />

            {/* Timeline - Minimal Luxury */}
            <section className="relative py-16 md:py-24 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center font-heading text-3xl md:text-5xl font-bold mb-12 md:mb-16"
                    >
                        Journey
                    </motion.h2>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/20 via-secondary/20 to-transparent md:-translate-x-1/2" />

                        <div className="space-y-8 md:space-y-12">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''
                                        }`}
                                >
                                    {/* Mobile Timeline Point */}
                                    <div className="absolute left-8 w-4 h-4 md:hidden">
                                        <Circle className={`w-4 h-4 text-${item.color} fill-current`} />
                                    </div>

                                    {/* Desktop Timeline Point */}
                                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            className={`w-4 h-4 rounded-full bg-${item.color} ring-4 ring-${item.color}/20`}
                                        />
                                    </div>

                                    {/* Content Card */}
                                    <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                                        }`}>
                                        <div className="inline-block">
                                            <span className={`text-4xl md:text-5xl font-heading font-bold bg-gradient-to-br from-${item.color} to-${item.color}/60 bg-clip-text text-transparent`}>
                                                '{item.year}
                                            </span>
                                            <p className="mt-2 text-base md:text-lg text-muted-foreground/80">
                                                {item.event}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Premium Glass */}
            <section className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -top-1/2 -right-1/2 w-[100vw] h-[100vw] bg-gradient-to-br from-accent/10 via-transparent to-secondary/10 rounded-full blur-3xl"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <div className="p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-2xl border border-border/30 text-center">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="font-heading text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-accent to-secondary bg-clip-text text-transparent">
                                Ready to elevate?
                            </h2>

                            <p className="text-base md:text-lg text-muted-foreground/70 max-w-md mx-auto">
                                Join the movement. Wear the ritual.
                            </p>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-accent via-info to-accent bg-[length:200%_100%] text-white border-0 px-8 md:px-12 py-5 md:py-6 rounded-full text-base md:text-lg font-medium hover:shadow-2xl hover:shadow-accent/30 transition-all duration-320 animate-gradient"
                                    onClick={() => window.location.href = '/shop'}
                                >
                                    <span className="flex items-center gap-3">
                                        Shop Now
                                        <motion.div
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </span>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
};

export default AboutPage;