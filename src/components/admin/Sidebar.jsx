import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, ShieldCheck, Menu, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';


const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
];


const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 16,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const isMobile = useIsMobile();


  return (

    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition"
          >
            <Menu className="text-white w-5 h-5" />
          </button>
        </div>
      )}

      {/* --- Mobile Sidebar --- */}
      <AnimatePresence>
        {isMobile && (
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex lg:hidden"
          >
            {/* Overlay */}
            <div
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar Panel */}
            <div className="relative w-[80vw] max-w-sm h-full bg-gray-900/90 backdrop-blur-2xl border-r border-white/10 shadow-2xl z-10 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-gray-900/90 z-20">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-indigo-400" />
                  <h1 className="text-lg font-serif font-semibold text-white tracking-wider">NEO ADMIN</h1>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Navigation */}
              <motion.nav className="px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                  <motion.div key={link.name} variants={itemVariants}>
                    <NavLink
                      to={link.href}
                      end={link.href === '/admin'}
                      onClick={() => setIsOpen(false)}
                      className="relative group flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="active-pill"
                              className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"
                              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            />
                          )}
                          <div className="relative z-10 flex items-center gap-3">
                            <link.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`} />
                            <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                              {link.name}
                            </span>
                          </div>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* --- Desktop Sidebar --- */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className="hidden lg:flex flex-col h-screen w-64 bg-black/40 backdrop-blur-2xl border-r border-white/10 shadow-xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="p-6 border-b border-white/10 flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-indigo-400" />
          <div>
            <h1 className="text-xl font-serif font-bold text-white tracking-wide">NEO</h1>
            <p className="text-xs text-neutral-400 tracking-widest">ADMIN PANEL</p>
          </div>
        </motion.div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <motion.div key={link.name} variants={itemVariants}>
              <NavLink
                to={link.href}
                end={link.href === '/admin'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `relative group flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'text-neutral-400 hover:text-white'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{link.name}</span>
              </NavLink>

            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <motion.div variants={itemVariants} className="px-4 py-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <img
              src="https://i.pravatar.cc/40?u=jb"
              alt="Admin"
              className="h-10 w-10 rounded-full border border-white/10"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Jb</p>
              <p className="text-xs text-neutral-400">Administrator</p>
            </div>
            <NavLink to="/" className="text-neutral-400 hover:text-white transition">
              <LogOut className="h-5 w-5" />
            </NavLink>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
