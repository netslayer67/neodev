import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
    return (
        <section className="relative py-32 md:py-48 px-6 text-center overflow-hidden bg-black">
            {/* Subtle backdrop gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black backdrop-blur-xl z-0" />

            {/* Ambient background image */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80)',
                }}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'easeOut' }}
            />

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-3xl mx-auto space-y-6"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1 }}
            >
                <h2 className="text-5xl md:text-7xl font-heading tracking-tight text-white leading-tight">
                    OWN YOUR <span className="text-gold">MOVEMENT</span>
                </h2>
                <p className="text-lg text-white/70 font-light max-w-xl mx-auto">
                    A statement of soul through refined design. Explore a collection that moves with purpose.
                </p>

                <Button
                    asChild
                    size="lg"
                    className="group bg-white/10 text-white backdrop-blur-lg hover:bg-gold hover:text-black border border-white/20 hover:border-gold transition-all duration-300 rounded-full font-medium px-10 py-5 shadow-2xl"
                >
                    <Link to="/shop" className="flex items-center gap-2">
                        Shop The Full Collection
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 group-hover:rotate-6 transition-transform" />
                    </Link>
                </Button>
            </motion.div>
        </section>
    );
};

export default CTASection;
