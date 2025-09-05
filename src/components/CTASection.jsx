import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const shimmer =
    "bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer bg-[length:200%_100%]";

const CTASection = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative py-24 px-6 md:px-12 overflow-hidden bg-[#0F0F1A] text-white">
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F1A] via-[#1E2A47]/80 to-[#0F0F1A] opacity-95" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />

                {/* Animated Blob */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -right-20 w-80 h-80 bg-[#8A5CF6]/30 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 items-center gap-14"
            >
                {/* Left Content */}
                <div className="space-y-6 text-center md:text-left">
                    {isLoaded ? (
                        <>
                            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#8A5CF6] to-white">
                                Step Into the Next Level
                            </h2>
                            <p className="text-white/70 text-lg md:text-xl font-light max-w-lg mx-auto md:mx-0">
                                Gear up with pieces that define your style and elevate your
                                presence.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={`h-[44px] md:h-[60px] w-3/4 rounded ${shimmer}`} />
                            <div className={`h-[20px] md:h-[28px] w-2/3 rounded ${shimmer}`} />
                        </>
                    )}

                    {/* Button */}
                    <div className="pt-4">
                        {isLoaded ? (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    asChild
                                    size="lg"
                                    className="group px-8 py-4 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-xl hover:bg-[#8A5CF6] hover:text-white transition-all duration-300 shadow-lg"
                                >
                                    <Link
                                        to="/shop"
                                        className="flex items-center gap-3 font-medium tracking-wide"
                                    >
                                        Explore Collection
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                >
                    {isLoaded ? (
                        <img
                            src="https://images.unsplash.com/photo-1600185365673-43f63fe17826?auto=format&fit=crop&w=600&q=80"
                            alt="Collection Preview"
                            className="w-full h-full object-cover"
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
