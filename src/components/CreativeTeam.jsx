import React, { useState, useEffect, useRef } from "react";
import { UserCircle2, ArrowRight, Mail, Linkedin, Instagram, Sparkles, Users, Award } from "lucide-react";

// Enhanced security sanitization for user inputs
const sanitizeInput = (value = "", maxLength = 50) => {
    return String(value)
        .slice(0, maxLength)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<[^>]*>?/g, '')
        .replace(/https?:\/\/(?![\w.-]+\.(jpg|jpeg|png|gif|webp|svg))/gi, '')
        .replace(/mailto:/gi, '')
        .replace(/[<>"'`\\{}]/g, '')
        .replace(/\b(?:DROP|DELETE|INSERT|UPDATE|SELECT|UNION|EXEC|EXECUTE)\b/gi, '')
        .trim();
};

// Decorative animated blob component
const DecorativeBlob = ({ className = "", delay = 0, size = "w-80 h-80" }) => (
    <div
        className={`absolute pointer-events-none ${size} ${className}`}
        style={{
            animationDelay: `${delay}s`,
            background: 'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--secondary)) 30%, hsl(var(--info)) 70%, hsl(var(--warning)) 100%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            opacity: 0.08,
            filter: 'blur(60px)',
            animation: 'blob 25s ease-in-out infinite'
        }}
    />
);

// Premium member card with enhanced interactivity
const MemberCard = ({ member, index, isLoading }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const cardRef = useRef(null);

    // Mouse tracking for subtle 3D effect
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
        setIsHovered(false);
    };

    if (isLoading) {
        return (
            <div className="group relative">
                <div className="glass-card p-8 rounded-3xl animate-pulse">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted/30" />
                        <div className="space-y-3 text-center w-full">
                            <div className="h-4 bg-muted/20 rounded-full w-3/4 mx-auto" />
                            <div className="h-3 bg-muted/10 rounded-full w-1/2 mx-auto" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={cardRef}
            className="group relative transition-all duration-320 ease-out"
            style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 800ms ease-out forwards'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-secondary/20 to-info/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

            {/* Card content */}
            <div className="relative glass-card p-6 md:p-8 rounded-3xl border-2 border-border/30 group-hover:border-accent/40 transition-all duration-320 overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-foreground/5 to-transparent skew-x-12" />

                <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
                    {/* Avatar with status indicator */}
                    <div className="relative">
                        <div className={`
              w-20 h-20 md:w-24 md:h-24 rounded-full transition-all duration-320
              ${isHovered
                                ? 'bg-gradient-to-br from-accent/20 to-secondary/20 shadow-lg shadow-accent/25'
                                : 'bg-card/80 border-2 border-border/50'
                            }
              flex items-center justify-center group-hover:scale-110
            `}>
                            <UserCircle2 className={`
                w-10 h-10 md:w-12 md:h-12 transition-all duration-320
                ${isHovered ? 'text-accent' : 'text-muted-foreground'}
              `} />
                        </div>

                        {/* Online status dot */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-3 border-background flex items-center justify-center">
                            <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />
                        </div>

                        {/* Sparkle effect */}
                        <Sparkles className={`
              absolute -top-2 -right-2 w-5 h-5 text-warning transition-all duration-320
              ${isHovered ? 'opacity-100 rotate-12 scale-110' : 'opacity-0'}
            `} />
                    </div>

                    {/* Member info */}
                    <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-320">
                            {sanitizeInput(member.name)}
                        </h3>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-320 font-medium">
                            {sanitizeInput(member.role)}
                        </p>

                        {/* Specialty tags */}
                        {member.specialties && (
                            <div className="flex flex-wrap gap-1 justify-center mt-3">
                                {member.specialties.slice(0, 2).map((specialty, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent border border-accent/20"
                                    >
                                        {sanitizeInput(specialty, 15)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Interaction buttons */}
                    <div className={`
            flex items-center gap-3 transition-all duration-320
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}>
                        <button
                            className="p-2 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 hover:scale-110 transition-all duration-320"
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            <Mail size={16} />
                        </button>
                        <button className="p-2 rounded-xl bg-info/10 text-info hover:bg-info/20 hover:scale-110 transition-all duration-320">
                            <Linkedin size={16} />
                        </button>
                        <button className="p-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 hover:scale-110 transition-all duration-320">
                            <Instagram size={16} />
                        </button>
                    </div>

                    {/* View profile button */}
                    <button
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold
              transition-all duration-320 group/btn
              ${isHovered
                                ? 'bg-accent/20 text-accent border-2 border-accent/30'
                                : 'bg-muted/20 text-muted-foreground border-2 border-transparent'
                            }
              hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:shadow-accent/25
            `}
                    >
                        View Profile
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-320" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Enhanced team statistics
const TeamStats = () => (
    <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-16">
        {[
            { icon: Users, value: "4+", label: "Experts" },
            { icon: Award, value: "50+", label: "Projects" },
            { icon: Sparkles, value: "5", label: "Years" }
        ].map((stat, i) => (
            <div
                key={i}
                className="text-center group"
                style={{ animationDelay: `${i * 100}ms` }}
            >
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-320">
                    <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</div>
            </div>
        ))}
    </div>
);

const CreativeTeam = () => {
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const sectionRef = useRef(null);

    // Enhanced team data with more details
    const teamMembers = [
        {
            name: "Arif Rahman",
            role: "Creative Director",
            specialties: ["Branding", "Strategy"],
            experience: "8+ years",
            avatar: null
        },
        {
            name: "Nadia Sari",
            role: "Fashion Designer",
            specialties: ["Couture", "Textile"],
            experience: "6+ years",
            avatar: null
        },
        {
            name: "Reza Pratama",
            role: "Brand Strategist",
            specialties: ["Marketing", "Growth"],
            experience: "5+ years",
            avatar: null
        },
        {
            name: "Kinan Wijaya",
            role: "Visual Artist",
            specialties: ["Photography", "Digital"],
            experience: "4+ years",
            avatar: null
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Intersection Observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style jsx>{`
        @keyframes blob {
          0%, 100% { 
            transform: translate(0px, 0px) scale(1) rotate(0deg);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          25% { 
            transform: translate(20px, -30px) scale(1.1) rotate(90deg);
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          50% { 
            transform: translate(-25px, 20px) scale(0.9) rotate(180deg);
            border-radius: 70% 30% 40% 60% / 40% 50% 60% 30%;
          }
          75% { 
            transform: translate(15px, 10px) scale(1.05) rotate(270deg);
            border-radius: 40% 70% 60% 30% / 70% 40% 50% 60%;
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .glass-morphism {
          background: rgba(var(--card), 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

            <section
                ref={sectionRef}
                className="relative px-4 py-20 md:py-32 text-foreground overflow-hidden bg-gradient-to-br from-background via-background to-card/20"
                data-animate
            >
                {/* Enhanced decorative blobs */}
                <DecorativeBlob className="-top-40 -left-40" size="w-96 h-96" />
                <DecorativeBlob className="top-1/3 -right-32" size="w-80 h-80" delay={8} />
                <DecorativeBlob className="-bottom-32 left-1/4" size="w-72 h-72" delay={16} />

                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="relative z-10 max-w-6xl mx-auto">
                    {/* Enhanced header section */}
                    <div className="text-center mb-16 space-y-6" data-animate>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-6">
                            <Users size={16} />
                            Meet Our Visionaries
                        </div>

                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-foreground via-accent to-secondary bg-clip-text text-transparent">
                                Creative Minds
                            </span>
                            <br />
                            <span className="text-foreground/80">Behind the Brand</span>
                        </h2>

                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Passionate creators crafting extraordinary experiences through innovative design and strategic thinking.
                        </p>
                    </div>

                    {/* Team statistics */}
                    <TeamStats />

                    {/* Team grid with enhanced layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {teamMembers.map((member, index) => (
                            <MemberCard
                                key={member.name}
                                member={member}
                                index={index}
                                isLoading={loading}
                            />
                        ))}
                    </div>

                    {/* Call to action section */}
                    <div className="mt-20 text-center" data-animate>
                        <div className="glass-card p-8 md:p-12 rounded-3xl max-w-2xl mx-auto border-2 border-border/30">
                            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                                Join Our Creative Journey
                            </h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Ready to collaborate? Let's create something extraordinary together.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 rounded-2xl font-semibold transition-all duration-320 bg-gradient-to-r from-accent to-info text-accent-foreground hover:shadow-lg hover:shadow-accent/25 hover:scale-105 group">
                                    <span className="flex items-center gap-2">
                                        Start a Project
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-320" />
                                    </span>
                                </button>

                                <button className="px-8 py-4 rounded-2xl font-semibold border-2 border-border/50 text-foreground hover:border-accent/50 hover:bg-accent/10 transition-all duration-320">
                                    View Portfolio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CreativeTeam;