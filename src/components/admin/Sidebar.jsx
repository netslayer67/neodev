import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
];

const Sidebar = () => {
  const location = useLocation();

  // Varian animasi untuk container dan item
  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.aside
      className="h-screen w-64 hidden lg:flex flex-col bg-gray-950/50 backdrop-blur-xl border-r border-white/10"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header / Logo */}
      <motion.div variants={itemVariants} className="p-6 border-b border-white/10 flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-indigo-400" />
        <div>
          <h1 className="text-xl font-bold tracking-wider text-white">NEO</h1>
          <p className="text-xs text-neutral-500 tracking-widest">ADMIN PANEL</p>
        </div>
      </motion.div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <motion.div key={link.name} variants={itemVariants}>
            <NavLink
              to={link.href}
              end={link.href === '/admin'}
              className="relative group flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
            >
              {({ isActive }) => (
                <>
                  {/* Indikator Aktif yang Animatid */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg"
                      style={{ borderRadius: 8 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    />
                  )}

                  {/* Icon & Text */}
                  <div className="relative z-10 flex items-center gap-3">
                    <link.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`} />
                    <span className={`text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                      {link.name}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <motion.div variants={itemVariants} className="px-4 py-6 border-t border-white/10">
        <div className="p-2 flex items-center gap-3 rounded-lg hover:bg-white/5 transition-colors">
          <img
            src="https://i.pravatar.cc/40?u=jb" // Placeholder avatar
            alt="Admin"
            className="h-10 w-10 rounded-full border-2 border-white/20"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Jb</p>
            <p className="text-xs text-neutral-400">Administrator</p>
          </div>
          <NavLink to="/">
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-white/10">
              <LogOut className="h-5 w-5" />
            </Button>
          </NavLink>
        </div>
      </motion.div>
    </motion.aside>
  );
};

// Button component placeholder jika belum ada
const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    icon: "h-10 w-10",
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});


export default Sidebar;