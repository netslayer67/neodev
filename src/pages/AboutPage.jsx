import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkle, Heart, Leaf, Circle } from "lucide-react";
import CreativeTeam from '@/components/CreativeTeam';

// Mock video source
const Logo = "https://via.placeholder.com/800x800";

const AboutPage = () => {
    const [loading, setLoading] = useState(true);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    // Kurangi efek scroll agar ringan
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timeout);
    }, []);

    const values = [
        { icon: <Sparkle className="w-5 h-5 md:w-6 md:h-6" />, title: "Refined", desc: "Clarity meets purpose" },
        { icon: <Heart className="w-5 h-5 md:w-6 md:h-6" />, title: "Crafted", desc: "Human touch matters" },
        { icon: <Leaf className="w-5 h-5 md:w-6 md:h-6" />, title: "Conscious", desc: "Future-forward design" }
    ];

    const timeline = [
        { year: "21", event: "Born from vision", color: "accent" },
        { year: "22", event: "First drop", color: "secondary" },
        { year: "23", event: "Global reach", color: "info" },
        { year: "24", event: "80% sustainable", color: "success" }
    ];

    return (
        <main className="relative overflow-hidden">
            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-[100dvh] flex items-center justify-center px-4 md:px-8"
            >
                {/* Background Blob dikurangi jadi 1 */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -top-40 -left-40 w-[80vw] h-[80vw] bg-accent/20 rounded-full blur-3xl"
                />

                <div className="relative z-10 max-w-3xl mx-auto text-center p-6 md:p-10 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-lg">
                    <Sparkle className="w-10 h-10 text-accent mx-auto mb-4" />
                    <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-br from-foreground via-accent to-secondary bg-clip-text text-transparent">
                        BEYOND FABRIC
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground/90">
                        Where ritual meets runway
                    </p>
                </div>
            </motion.section>

            {/* Philosophy Section */}
            <section className="py-16 md:py-24 px-4 md:px-8">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div>
                        <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-secondary bg-secondary/10 rounded-full border border-secondary/20">
                            PHILOSOPHY
                        </span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                            Movement with meaning
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">
                            Each piece balances flow & form. Designed for those who move with intention.
                        </p>
                        <a
                            href="/shop"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-accent to-info text-white rounded-xl hover:shadow-lg transition-all"
                        >
                            Discover <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Video with Fallback Image on Mobile */}
                    <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-card/40 backdrop-blur-xl border border-border/30 shadow-xl">
                        {loading ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-secondary/10 animate-pulse" />
                        ) : (
                            <>
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    poster="https://via.placeholder.com/800x800"
                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                >
                                    <source src={Logo} type="video/webm" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 md:py-24 px-4 md:px-8">
                <h2 className="text-center font-heading text-3xl md:text-5xl font-bold mb-12">
                    Core Values
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {values.map((val, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-card/30 border border-border/20 hover:border-accent/30 transition">
                            <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-xl bg-accent/10">
                                {val.icon}
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-2">{val.title}</h3>
                            <p className="text-sm text-muted-foreground/70">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Creative Team */}
            <CreativeTeam />

            {/* Timeline */}
            <section className="py-16 md:py-24 px-4 md:px-8">
                <h2 className="text-center font-heading text-3xl md:text-5xl font-bold mb-12">
                    Journey
                </h2>
                <div className="max-w-3xl mx-auto space-y-8">
                    {timeline.map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <Circle className={`w-5 h-5 text-${item.color}`} />
                            <div>
                                <span className={`text-3xl font-heading font-bold text-${item.color}`}>
                                    '{item.year}
                                </span>
                                <p className="text-base text-muted-foreground/80">{item.event}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 px-4 md:px-8 text-center">
                <div className="p-10 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-xl max-w-3xl mx-auto">
                    <h2 className="font-heading text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-accent to-secondary bg-clip-text text-transparent">
                        Ready to elevate?
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-muted-foreground/70 max-w-md mx-auto">
                        Join the movement. Wear the ritual.
                    </p>
                    <a
                        href="/shop"
                        className="inline-flex items-center gap-3 mt-6 px-8 py-4 bg-gradient-to-r from-accent via-info to-accent text-white rounded-full font-medium hover:shadow-2xl transition"
                    >
                        Shop Now <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;
