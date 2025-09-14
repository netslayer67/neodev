import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const shimmer =
    "bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-shimmer bg-[length:200%_100%]";

const CTASection = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative py-20 md:py-28 px-6 md:px-12 overflow-hidden text-foreground">
            {/* Background Layers */}
            {/* Blobs */}
            <motion.div

                className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl"
            />
            <motion.div

                className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
            />
            {/* <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-card/80 to-background opacity-95" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div> */}

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 items-center gap-12"
            >
                {/* Left Text */}
                <div className="space-y-6 text-center md:text-left">
                    {isLoaded ? (
                        <>
                            <h2 className="text-4xl md:text-5xl font-heading tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-accent to-secondary drop-shadow">
                                Step Into the Next Level
                            </h2>
                            <p className="text-muted-foreground text-base md:text-lg font-light max-w-lg mx-auto md:mx-0">
                                Gear up with pieces that define your style and elevate your presence.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={`h-[44px] md:h-[60px] w-3/4 rounded ${shimmer}`} />
                            <div className={`h-[20px] md:h-[28px] w-2/3 rounded ${shimmer}`} />
                        </>
                    )}

                    {/* CTA Button */}
                    <div className="pt-4">
                        {isLoaded ? (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    asChild
                                    size="lg"
                                    className="group px-8 py-4 rounded-full bg-card/40 backdrop-blur-xl border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-320 shadow-lg"
                                >
                                    <Link
                                        to="/shop"
                                        className="flex items-center gap-3 font-medium tracking-wide"
                                    >
                                        Explore Collection
                                        <ArrowRight className="h-5 w-5 transition-transform duration-320 group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </motion.div>
                        ) : (
                            <div className={`h-14 w-48 mx-auto md:mx-0 rounded-full ${shimmer}`} />
                        )}
                    </div>
                </div>

                {/* Right Visual */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-border bg-card/40 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                >
                    {isLoaded ? (
                        <img
                            src="https://images.unsplash.com/photo-1600185365673-43f63fe17826?auto=format&fit=crop&w=600&q=80"
                            alt="Collection Preview"
                            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className={`h-full w-full ${shimmer}`} />
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default CTASection;
