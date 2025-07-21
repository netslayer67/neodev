import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice'; // 1. Import action logout
import { ShoppingBag, Menu, X, User, LogIn, LogOut } from 'lucide-react';

// Konfigurasi animasi (tetap sama)
const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], when: "afterChildren" } },
  visible: { opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], when: "beforeChildren", staggerChildren: 0.08 } },
};

const mobileLinkVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. Setup Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 3. Ambil data dari Redux store
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // 4. Kalkulasi jumlah total item di keranjang
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Efek untuk scroll (tetap sama)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efek untuk lock scroll (tetap sama)
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  // 5. Handler untuk logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false); // Tutup menu mobile jika terbuka
  };

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
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        }}
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center h-20">
          <Link to="/" className="text-xl font-semibold tracking-wider text-white uppercase hover:opacity-80 transition-opacity">
            NEO DERVISH
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.href} className="relative text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-300 tracking-wide group">
                {link.name}
                <span className="absolute bottom-[-6px] left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            {/* 6. Ikon keranjang dengan jumlah item dinamis */}
            <Link to="/cart" className="text-neutral-200 hover:text-white relative transition-colors">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {totalCartItems > 0 && (
                <div className="absolute -top-2 -right-2 bg-sky-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold">
                  {totalCartItems}
                </div>
              )}
            </Link>

            {/* 7. Tampilan dinamis untuk Auth di Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/profile" className="text-neutral-200 hover:text-white transition-colors">
                    <User size={22} strokeWidth={1.5} />
                  </Link>
                  <button onClick={handleLogout} className="text-neutral-200 hover:text-white transition-colors">
                    <LogOut size={22} strokeWidth={1.5} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-neutral-200 hover:text-white transition-colors">
                  <LogIn size={22} strokeWidth={1.5} />
                </Link>
              )}
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white z-50">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* 8. Navigasi Mobile dengan logika Auth */}
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
                  <NavLink to={link.href} onClick={() => setIsMenuOpen(false)} className="text-3xl font-medium text-neutral-300 hover:text-white transition-colors">
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div variants={mobileLinkVariants}>
                {user ? (
                  <button onClick={handleLogout} className="text-3xl font-medium text-neutral-300 hover:text-white transition-colors">Logout</button>
                ) : (
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="text-3xl font-medium text-neutral-300 hover:text-white transition-colors">Login</NavLink>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;