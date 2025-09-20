import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { UserCircle2, ArrowRight, Mail, Linkedin, Instagram, Sparkles, Users, Award } from "lucide-react";

// Optimized sanitization with memoization
const sanitizeInput = (value = "", maxLength = 50) => {
    const cleanValue = String(value).slice(0, maxLength).trim();
    return cleanValue
        .replace(/<[^>]*>/g, '')
        .replace(/[<>"'`\\{}]/g, '');
};

// Memoized decorative blob - static positioning untuk mengurangi reflow
const DecorativeBlob = memo(({ className = "", delay = 0, size = "w-80 h-80" }) => (
    <div
        className={`absolute pointer-events-none ${size} ${className} animate-blob opacity-5`}
        style={{
            animationDelay: `${delay}s`,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 30%, #06b6d4 70%, #f59e0b 100%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            filter: 'blur(40px)', // Reduced blur for better performance
            willChange: 'transform'
        }}
    />
));

// Optimized member card with better performance
const MemberCard = memo(({ member, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const rafRef = useRef(null);

    // Throttled mouse move handler using RAF
    const handleMouseMove = useCallback((e) => {
        if (rafRef.current) return;

        rafRef.current = requestAnimationFrame(() => {
            if (!cardRef.current) {
                rafRef.current = null;
                return;
            }

            const rect = cardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30; // Reduced sensitivity
            const rotateY = (centerX - x) / 30;

            cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
            rafRef.current = null;
        });
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
        setIsHovered(false);
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // Memoized sanitized values
    const sanitizedName = useMemo(() => sanitizeInput(member.name), [member.name]);
    const sanitizedRole = useMemo(() => sanitizeInput(member.role), [member.role]);

    return (
        <div
            ref={cardRef}
            className={`
        group relative transition-all duration-300 ease-out transform-gpu
        ${index === 0 ? 'animate-fade-in-up' : ''}
      `}
            style={{
                animationDelay: `${index * 100}ms`,
                willChange: 'transform'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Simplified glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />

            {/* Optimized card content */}
            <div className="relative bg-white/5 backdrop-blur-sm p-6 md:p-7 rounded-3xl border border-white/10 group-hover:border-blue-500/20 transition-all duration-300 overflow-hidden">
                {/* Simplified background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col items-center space-y-5 text-center">
                    {/* Optimized avatar */}
                    <div className="relative">
                        <div className={`
              w-18 h-18 md:w-20 md:h-20 rounded-full transition-all duration-300 transform-gpu
              ${isHovered
                                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg scale-105'
                                : 'bg-white/10 border-2 border-white/20'
                            }
              flex items-center justify-center
            `}>
                            <UserCircle2 className={`
                w-9 h-9 md:w-10 md:h-10 transition-colors duration-300
                ${isHovered ? 'text-blue-400' : 'text-gray-400'}
              `} />
                        </div>

                        {/* Online status - simplified */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900">
                            <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>

                        {/* Conditional sparkle */}
                        {isHovered && (
                            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 transition-all duration-300 rotate-12" />
                        )}
                    </div>

                    {/* Member info */}
                    <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                            {sanitizedName}
                        </h3>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">
                            {sanitizedRole}
                        </p>

                        {/* Simplified specialty tags */}
                        {member.specialties && (
                            <div className="flex flex-wrap gap-1 justify-center mt-3">
                                {member.specialties.slice(0, 2).map((specialty, i) => (
                                    <span
                                        key={`${member.name}-${i}`}
                                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                    >
                                        {sanitizeInput(specialty, 15)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Interaction buttons - show on hover only */}
                    <div className={`
            flex items-center gap-2 transition-all duration-300 transform-gpu
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}>
                        <button className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all duration-200">
                            <Mail size={14} />
                        </button>
                        <button className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-200">
                            <Linkedin size={14} />
                        </button>
                        <button className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:scale-110 transition-all duration-200">
                            <Instagram size={14} />
                        </button>
                    </div>

                    {/* Simplified view profile button */}
                    <button className={`
            flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold
            transition-all duration-300 group/btn transform-gpu
            ${isHovered
                            ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-500/30'
                            : 'bg-white/5 text-gray-400 border-2 border-transparent'
                        }
            hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/25
          `}>
                        View Profile
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                </div>
            </div>
        </div>
    );
});

// Optimized team statistics with memoization
const TeamStats = memo(() => {
    const stats = useMemo(() => [
        { icon: Users, value: "4+", label: "Experts" },
        { icon: Award, value: "50+", label: "Projects" },
        { icon: Sparkles, value: "5", label: "Years" }
    ], []);

    return (
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-16">
            {stats.map((stat, i) => (
                <div
                    key={stat.label}
                    className="text-center group"
                    style={{ animationDelay: `${i * 50}ms` }}
                >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300">
                        <stat.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
                </div>
            ))}
        </div>
    );
});

const CreativeTeam = () => {
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);

    // Optimized team data with memoization
    const teamMembers = useMemo(() => [
        {
            name: "Arif Rahman",
            role: "Creative Director",
            specialties: ["Branding", "Strategy"],
            experience: "8+ years"
        },
        {
            name: "Nadia Sari",
            role: "Fashion Designer",
            specialties: ["Couture", "Textile"],
            experience: "6+ years"
        },
        {
            name: "Reza Pratama",
            role: "Brand Strategist",
            specialties: ["Marketing", "Growth"],
            experience: "5+ years"
        },
        {
            name: "Kinan Wijaya",
            role: "Visual Artist",
            specialties: ["Photography", "Digital"],
            experience: "4+ years"
        }
    ], []);

    // Optimized loading effect
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800); // Reduced loading time
        return () => clearTimeout(timer);
    }, []);

    // Simplified intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in-up');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (sectionRef.current) {
            const elements = sectionRef.current.querySelectorAll('[data-animate]');
            elements.forEach((el) => observer.observe(el));
        }

        return () => observer.disconnect();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Optimized CSS animations */}
            <style jsx>{`
        @keyframes blob {
          0%, 100% { 
            transform: translate(0px, 0px) scale(1);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          33% { 
            transform: translate(15px, -15px) scale(1.05);
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          66% { 
            transform: translate(-15px, 15px) scale(0.95);
            border-radius: 70% 30% 40% 60% / 40% 50% 60% 30%;
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 20s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-blob {
            animation-duration: 15s;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-blob,
          .animate-fade-in-up,
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

            <section
                ref={sectionRef}
                className="relative px-4 py-16 md:py-24 text-white overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"
            >
                {/* Optimized decorative blobs - fewer and simpler */}
                <DecorativeBlob className="-top-32 -left-32" size="w-80 h-80" />
                <DecorativeBlob className="top-1/2 -right-24" size="w-64 h-64" delay={10} />

                {/* Simplified grid overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }}
                />

                <div className="relative z-10 max-w-6xl mx-auto">
                    {/* Optimized header section */}
                    <div className="text-center mb-16 space-y-6" data-animate>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold mb-6">
                            <Users size={16} />
                            Meet Our Visionaries
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                                Creative Minds
                            </span>
                            <br />
                            <span className="text-white/80">Behind the Brand</span>
                        </h2>

                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Passionate creators crafting extraordinary experiences through innovative design and strategic thinking.
                        </p>
                    </div>

                    {/* Team statistics */}
                    <TeamStats />

                    {/* Optimized team grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {teamMembers.map((member, index) => (
                            <MemberCard
                                key={member.name}
                                member={member}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Simplified call to action */}
                    <div className="mt-20 text-center" data-animate>
                        <div className="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-3xl max-w-2xl mx-auto border border-white/10">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Join Our Creative Journey
                            </h3>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Ready to collaborate? Let's create something extraordinary together.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 group">
                                    <span className="flex items-center gap-2">
                                        Start a Project
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                    </span>
                                </button>

                                <button className="px-8 py-4 rounded-2xl font-semibold border-2 border-white/20 text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300">
                                    View Portfolio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CreativeTeam;