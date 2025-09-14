import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { ShoppingBag, Menu, X, User, LogIn } from "lucide-react";

// Variants
const navVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const mobileLinkVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const totalCartItems = cartItems.reduce((t, i) => t + i.quantity, 0);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* 🌐 Navbar */}
      <motion.header
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-320 ${isScrolled
          ? "bg-card/70 backdrop-blur-2xl border-b border-border"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-heading tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-320"
          >
            NEO DERVISH
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className="relative text-sm font-medium text-foreground/80 hover:text-accent transition-colors duration-320 group"
              >
                {link.name}
                <span className="absolute bottom-[-6px] left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-320"></span>
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <Link
              to="/cart"
              className="text-foreground/80 hover:text-accent relative transition-colors duration-320"
            >
              <ShoppingBag size={22} strokeWidth={1.6} />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            <div className="hidden md:flex items-center">
              {user ? (
                <Link
                  to="/profile"
                  className="text-foreground/80 hover:text-accent transition-colors duration-320"
                >
                  <User size={22} strokeWidth={1.6} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-foreground/80 hover:text-accent transition-colors duration-320"
                >
                  <LogIn size={22} strokeWidth={1.6} />
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-foreground hover:text-accent transition-colors duration-320"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* 📱 Mobile nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-40 bg-card/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10"
          >
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={mobileLinkVariants}>
                <NavLink
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-heading text-foreground/90 hover:text-accent transition-colors duration-320"
                >
                  {link.name}
                </NavLink>
              </motion.div>
            ))}

            {/* Profile/Login in mobile */}
            <motion.div variants={mobileLinkVariants}>
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl font-sans text-foreground/90 hover:text-accent transition-colors duration-320 flex items-center gap-2"
                >
                  <User size={24} /> Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl font-sans text-foreground/90 hover:text-accent transition-colors duration-320 flex items-center gap-2"
                >
                  <LogIn size={24} /> Login
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
