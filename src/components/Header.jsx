import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, User } from 'lucide-react';

// Konfigurasi untuk animasi Framer Motion
const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // Kurva easing yang lebih smooth
    },
  },
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      when: "afterChildren",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.08, // Efek stagger untuk setiap link
    },
  },
};

const mobileLinkVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Efek untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efek untuk lock scroll saat menu mobile terbuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
        style={{
          background: isScrolled
            ? 'rgba(10, 10, 10, 0.7)' // Lebih gelap saat di-scroll
            : 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        }}
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold tracking-wider text-white uppercase hover:opacity-80 transition-opacity">
            NEO DERVISH
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.href} className="relative text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-300 tracking-wide group">
                {link.name}
                <span className="absolute bottom-[-6px] left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
              </NavLink>
            ))}
          </nav>

          {/* Ikon */}
          <div className="flex items-center gap-6">
            <Link to="/cart" className="text-neutral-200 hover:text-white relative transition-colors">
              <ShoppingBag size={22} strokeWidth={1.5} />
              <div className="absolute -top-2 -right-2 bg-sky-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold">
                3
              </div>
            </Link>

            <Link to="/login" className="hidden md:block text-neutral-200 hover:text-white transition-colors">
              <User size={22} strokeWidth={1.5} />
            </Link>

            {/* Tombol Menu Mobile */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white z-50">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Navigasi Mobile Full-Screen */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.nav className="flex flex-col items-center gap-10">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={mobileLinkVariants}>
                  <NavLink
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl font-medium text-neutral-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div variants={mobileLinkVariants}>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  Login
                </NavLink>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;