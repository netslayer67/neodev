import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogIn,
  Sparkles,
  Crown,
  Shield,
  Star,
  Search,
  Heart
} from 'lucide-react';

// --- Utility: sanitize/validate small inputs (search) ---
const sanitizeSearch = (value) => {
  if (!value) return '';
  // remove control characters, tags, and suspicious protocols
  const cleaned = String(value)
    .replace(/<[^>]*>?/g, '') // strip tags
    .replace(/\s+/g, ' ') // normalize whitespace
    .slice(0, 64); // reasonable length cap

  // disallow urls & script-like snippets
  if (/https?:\/\//i.test(cleaned) || /javascript:/i.test(cleaned) || /\<script/i.test(value)) {
    return '';
  }

  return cleaned.trim();
};

// small, shared animation settings
const anim = {
  duration: 0.32,
  ease: [0.25, 0.46, 0.45, 0.94]
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  const [search, setSearch] = useState('');
  const location = useLocation();

  const { user } = useSelector((s) => s.auth || {});
  const { cartItems = [] } = useSelector((s) => s.cart || {});

  // memoized cart calculations
  const totalCartItems = useMemo(() => cartItems.reduce((t, i) => t + (i.quantity || 0), 0), [cartItems]);
  const cartValue = useMemo(() => cartItems.reduce((t, i) => t + ((i.price || 0) * (i.quantity || 0)), 0), [cartItems]);

  // responsive & scroll listeners
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    const onScroll = () => setIsScrolled(window.scrollY > 20);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onResize();
    onScroll();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // close menu on navigation
  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  // prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [isMenuOpen]);

  const isMobile = viewportWidth < 768;

  const navLinks = useMemo(() => [
    { name: 'Home', href: '/', icon: Crown, exclusive: true },
    { name: 'Collection', href: '/shop', icon: Sparkles },
    { name: 'About', href: '/about', icon: Shield },
    { name: 'Concierge', href: '/contact', icon: Star }
  ], []);

  const headerClass = isScrolled
    ? 'bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-2xl border-b border-border/50 shadow-lg'
    : 'bg-transparent';

  // debounced safe setter to avoid heavy renders
  const onChangeSearch = useCallback((value) => {
    const s = sanitizeSearch(value);
    setSearch(s);
  }, []);

  const onSubmitSearch = useCallback((e) => {
    e?.preventDefault();
    // do not allow empty or url-like search values
    if (!search) return;
    // route to search page, keeping header dumb (leave routing to parent)
    // example: /search?q=${encodeURIComponent(search)}
    window.location.href = `/search?q=${encodeURIComponent(search)}`;
  }, [search]);

  // compact/desktop variations
  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ...anim }}
        className={`fixed inset-x-0 top-0 z-[90] transition-all duration-320 ${headerClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${isMobile ? 'h-14' : 'h-20'}`}>

            {/* LEFT: logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 backdrop-blur-xl border border-accent/30 flex items-center justify-center transition-transform duration-320 group-hover:scale-105">
                    <Crown className="w-4 h-4 text-accent" />
                  </div>
                </div>

                <div className="hidden sm:block">
                  <h1 className="text-lg font-heading font-bold tracking-wider">NEO DERVISH</h1>
                  <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase">In Soul We Move</p>
                </div>
              </Link>
            </div>

            {/* CENTER: minimal nav (desktop) & search compact (tablet+) */}
            <div className="flex-1 flex items-center justify-center">
              {/* desktop nav */}
              <nav className="hidden lg:flex items-center gap-6">
                {navLinks.map((l) => (
                  <NavLink key={l.name} to={l.href} className={({ isActive }) => `relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-320 text-sm font-medium ${isActive ? 'text-accent bg-accent/10 shadow-sm' : 'text-foreground/80 hover:text-accent hover:bg-accent/5'}`}>
                    <l.icon className="w-4 h-4" />
                    <span>{l.name}</span>
                    {l.exclusive && <span className="ml-2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />}
                  </NavLink>
                ))}
              </nav>

            </div>

            {/* RIGHT: actions */}
            <div className="flex items-center gap-3">
              {/* cart */}
              <Link to="/cart" className="relative p-2 rounded-xl text-foreground/80 hover:text-accent hover:bg-accent/10 transition-all duration-320">
                <ShoppingBag className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-accent to-info text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </span>
                )}
              </Link>

              {/* account / login */}
              <div className="hidden md:block">
                {user ? (
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-accent/10 to-info/10 border border-accent/20 text-accent transition-all duration-320">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-info flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user.name?.split(' ')[0] || 'Account'}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground transition-all duration-320 shadow-sm">
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </Link>
                )}
              </div>

              {/* mobile menu toggle */}
              <button
                onClick={() => setIsMenuOpen((s) => !s)}
                aria-label="Open menu"
                className="lg:hidden p-2 rounded-xl text-foreground hover:text-accent hover:bg-accent/10 transition-transform duration-320"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}> <X className="w-6 h-6" /> </motion.div>
                    : <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}> <Menu className="w-6 h-6" /> </motion.div>}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile panel (full screen compact) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.36 }}
            className="fixed inset-0 z-[90] bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-lg"
            aria-modal="true"
            role="dialog"
          >
            <div className="min-h-screen flex flex-col items-center justify-start pt-20 px-6">

              {/* decorative blobs (token-based) */}
              <div className="pointer-events-none absolute -top-8 -right-8 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-12 left-4 w-36 h-36 rounded-full bg-secondary/8 blur-3xl" />

              <div className="w-full max-w-md">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-secondary/20 backdrop-blur-xl border border-accent/30 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">NEO DERVISH</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">In Soul We Move</p>
                </div>

                <nav className="space-y-4">
                  {navLinks.map((l) => (
                    <NavLink key={l.name} to={l.href} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-320 ${isActive ? 'bg-accent/10 text-accent border border-accent/30' : 'text-foreground/90 hover:bg-accent/5'}`}>
                      <div className="w-10 h-10 rounded-xl bg-card/60 backdrop-blur-lg flex items-center justify-center">
                        <l.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{l.name}</div>
                        {l.exclusive && <div className="text-xs text-accent">Exclusive</div>}
                      </div>
                      {l.exclusive && <Sparkles className="w-4 h-4 text-accent animate-pulse" />}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-6 space-y-4">
                  <Link to="/cart" className="flex items-center justify-between p-4 rounded-2xl bg-card/60 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-info/20 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-accent" />
                        {totalCartItems > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">{totalCartItems}</span>}
                      </div>
                      <div>
                        <div className="font-semibold">Shopping Bag</div>
                        <div className="text-xs text-muted-foreground">{totalCartItems ? `${totalCartItems} items • Rp ${cartValue.toLocaleString('id-ID')}` : 'Empty'}</div>
                      </div>
                    </div>
                    <div className="text-muted-foreground">→</div>
                  </Link>

                  {user ? (
                    <Link to="/profile" className="flex items-center gap-3 p-4 rounded-2xl bg-accent/8 border border-accent/20 text-accent">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
                      <div>
                        <div className="font-semibold">Welcome back</div>
                        <div className="text-xs text-muted-foreground">{user.name}</div>
                      </div>
                    </Link>
                  ) : (
                    <Link to="/login" className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm">
                      <LogIn className="w-5 h-5" />
                      <span className="font-semibold">Login</span>
                    </Link>
                  )}
                </div>

                <div className="mt-8 text-center text-xs text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-3 h-3" />
                    <span>Secured by premium encryption</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button onClick={() => setIsMenuOpen(false)} className="px-6 py-2 rounded-full bg-primary/80 text-primary-foreground transition-all duration-320">Close</button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(Header);
