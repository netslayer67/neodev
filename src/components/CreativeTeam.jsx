// CreativeTeam.jsx

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// You can replace this with a more professional icon or user photos
const UserIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 text-white/20"
    >
        <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            clipRule="evenodd"
        />
    </svg>
);

const teamMembers = [
    { name: "Arif", role: "Art Director" },
    { name: "Nadia", role: "Fashion Lead" },
    { name: "Reza", role: "Brand Strategist" },
    { name: "Kinan", role: "Visual Designer" },
];

const CreativeTeam = () => {
    const targetRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    // Parallax for decorative lights
    const yLight1 = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    const yLight2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1], // A nice easing curve
            },
        },
    };

    return (
        <section
            ref={targetRef}
            className="relative py-28 md:py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden"
        >
            {/* Decorative Blur Lights with Parallax */}
            <motion.div
                style={{ y: yLight1 }}
                className="absolute top-[-150px] left-[-150px] w-56 h-56 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl"
            />
            <motion.div
                style={{ y: yLight2 }}
                className="absolute bottom-[-150px] right-[-150px] w-56 h-56 md:w-96 md:h-96 bg-pink-500/10 rounded-full blur-3xl"
            />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-start">
                {/* Left Column: Title and Description */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="lg:col-span-1 text-center lg:text-left"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight mb-4">
                        The Creative Minds Behind the Magic
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-md mx-auto lg:mx-0">
                        Our team blends artistic vision with strategic expertise to craft unforgettable brand experiences.
                    </p>
                </motion.div>

                {/* Right Column: Team Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8"
                >
                    {teamMembers.map((person) => (
                        <motion.div
                            key={person.name}
                            variants={itemVariants}
                            className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl transition-all duration-300 ease-in-out hover:bg-white/10"
                        >
                            {/* Subtle glow effect on hover */}
                            <div className="absolute -inset-px bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-md" />

                            <div className="relative flex flex-col items-center text-center p-8 space-y-6">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-inner">
                                    <UserIcon />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold tracking-tight text-white">{person.name}</h3>
                                    <p className="text-neutral-400 text-sm">{person.role}</p>
                                </div>
                                {/* Interactive element that appears on hover */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a href="#" className="text-sm text-pink-400 hover:text-pink-300">View Portfolio</a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default CreativeTeam;