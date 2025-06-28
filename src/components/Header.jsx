import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Menu, X, User } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
  ];

  const activeLinkStyle = {
    color: 'white',
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-black/50 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-heading tracking-widest text-white">
          RADIANT RAGE
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="text-neutral-400 hover:text-white transition-colors duration-300"
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
            <Link to="/cart" className="text-neutral-300 hover:text-white transition-colors relative">
                <ShoppingBag size={22} />
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
            </Link>
            <Link to="/login" className="hidden md:block text-neutral-300 hover:text-white transition-colors">
                <User size={22} />
            </Link>
            <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            </div>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden"
        >
          <nav className="flex flex-col items-center space-y-6 py-6 border-t border-white/10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="text-neutral-300 hover:text-white transition-colors duration-300 text-lg"
              >
                {link.name}
              </NavLink>
            ))}
             <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="text-neutral-300 hover:text-white transition-colors duration-300 text-lg"
              >
                Login
              </NavLink>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;