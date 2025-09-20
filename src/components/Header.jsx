import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
  startTransition
} from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useSelector } from 'react-redux';

// Import selective icons untuk mengurangi bundle size
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogIn,
  Sparkles,
  Crown,
  Shield,
  Star
} from 'lucide-react';

// Constants untuk optimasi
const SCROLL_THRESHOLD = 20;
const RESIZE_DEBOUNCE_MS = 150;
const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

// Optimized sanitization dengan memoization
const sanitizeSearchCache = new Map();
const MAX_CACHE_SIZE = 50;

const sanitizeSearch = (value) => {
  if (!value) return '';

  // Check cache first
  if (sanitizeSearchCache.has(value)) {
    return sanitizeSearchCache.get(value);
  }

  const cleaned = String(value)
    .replace(/<[^>]*>?/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 64);

  if (/https?:\/\//i.test(cleaned) || /javascript:/i.test(cleaned) || /\<script/i.test(value)) {
    return '';
  }

  const result = cleaned.trim();

  // Maintain cache size
  if (sanitizeSearchCache.size >= MAX_CACHE_SIZE) {
    const firstKey = sanitizeSearchCache.keys().next().value;
    sanitizeSearchCache.delete(firstKey);
  }

  sanitizeSearchCache.set(value, result);
  return result;
};

// Optimized animation variants
const createAnimationVariants = (prefersReducedMotion) => ({
  header: {
    initial: prefersReducedMotion ? { opacity: 1 } : { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: prefersReducedMotion ? 0.1 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  menuIcon: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 }
  },
  mobileMenu: {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 },
    exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    transition: { duration: prefersReducedMotion ? 0.2 : 0.32 }
  }
});

// Optimized device detection hook
const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isTablet: false, isDesktop: true };
    }

    const width = window.innerWidth;
    return {
      isMobile: width < MOBILE_BREAKPOINT,
      isTablet: width >= MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT,
      isDesktop: width >= DESKTOP_BREAKPOINT
    };
  });

  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        const width = window.innerWidth;
        const newInfo = {
          isMobile: width < MOBILE_BREAKPOINT,
          isTablet: width >= MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT,
          isDesktop: width >= DESKTOP_BREAKPOINT
        };

        setDeviceInfo(prev => {
          if (prev.isMobile !== newInfo.isMobile ||
            prev.isTablet !== newInfo.isTablet ||
            prev.isDesktop !== newInfo.isDesktop) {
            return newInfo;
          }
          return prev;
        });
      }, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return deviceInfo;
};

// Optimized scroll detection hook
const useScrollDetection = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const rafRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Only update if there's a significant change
        if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
          const shouldBeScrolled = currentScrollY > SCROLL_THRESHOLD;

          if (shouldBeScrolled !== isScrolled) {
            startTransition(() => {
              setIsScrolled(shouldBeScrolled);
            });
          }

          lastScrollY.current = currentScrollY;
        }
      });
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isScrolled]);

  return isScrolled;
};

// Memoized Logo Component
const Logo = memo(() => (
  <div className="flex items-center gap-3">
    <Link to="/" className="flex items-center gap-3 group">
      <div className="relative">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 backdrop-blur-xl border border-accent/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <Crown className="w-4 h-4 text-accent" />
        </div>
      </div>
      <div className="hidden sm:block">
        <h1 className="text-lg font-heading font-bold tracking-wider">NEO DERVISH</h1>
        <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase">In Soul We Move</p>
      </div>
    </Link>
  </div>
));

// Memoized Navigation Links
const NavigationLinks = memo(() => {
  const navLinks = useMemo(() => [
    { name: 'Home', href: '/', icon: Crown, exclusive: true },
    { name: 'Collection', href: '/shop', icon: Sparkles },
    { name: 'About', href: '/about', icon: Shield },
    { name: 'Concierge', href: '/contact', icon: Star }
  ], []);

  return (
    <nav className="hidden lg:flex items-center gap-6">
      {navLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.href}
          className={({ isActive }) => `
            relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-sm font-medium
            ${isActive
              ? 'text-accent bg-accent/10 shadow-sm'
              : 'text-foreground/80 hover:text-accent hover:bg-accent/5'
            }
          `}
        >
          <link.icon className="w-4 h-4" />
          <span>{link.name}</span>
          {link.exclusive && (
            <span className="ml-2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          )}
        </NavLink>
      ))}
    </nav>
  );
});

// Memoized Cart Button
const CartButton = memo(() => {
  const cartItems = useSelector(state => state.cart?.cartItems || []);

  const totalCartItems = useMemo(() =>
    cartItems.reduce((total, item) => total + (item.quantity || 0), 0),
    [cartItems]
  );

  return (
    <Link
      to="/cart"
      className="relative p-2 rounded-xl text-foreground/80 hover:text-accent hover:bg-accent/10 transition-all duration-300"
      aria-label={`Shopping cart with ${totalCartItems} items`}
    >
      <ShoppingBag className="w-5 h-5" />
      {totalCartItems > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-accent to-info text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
          {totalCartItems > 99 ? '99+' : totalCartItems}
        </span>
      )}
    </Link>
  );
});

// Memoized User Account Section
const UserAccount = memo(() => {
  const user = useSelector(state => state.auth?.user);

  if (user) {
    return (
      <Link
        to="/profile"
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-accent/10 to-info/10 border border-accent/20 text-accent transition-all duration-300"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-info flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium">
          {user.name?.split(' ')[0] || 'Account'}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to="/login"
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground transition-all duration-300 shadow-sm"
    >
      <LogIn className="w-4 h-4" />
      <span className="text-sm font-medium">Login</span>
    </Link>
  );
});

// Memoized Mobile Menu Content
const MobileMenuContent = memo(({ onClose, deviceInfo }) => {
  const user = useSelector(state => state.auth?.user);
  const cartItems = useSelector(state => state.cart?.cartItems || []);

  const navLinks = useMemo(() => [
    { name: 'Home', href: '/', icon: Crown, exclusive: true },
    { name: 'Collection', href: '/shop', icon: Sparkles },
    { name: 'About', href: '/about', icon: Shield },
    { name: 'Concierge', href: '/contact', icon: Star }
  ], []);

  const { totalCartItems, cartValue } = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const value = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    return { totalCartItems: total, cartValue: value };
  }, [cartItems]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 px-6">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-8 -right-8 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 left-4 w-36 h-36 rounded-full bg-secondary/8 blur-3xl" />

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">NEO DERVISH</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">In Soul We Move</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300
                ${isActive
                  ? 'bg-accent/10 text-accent border border-accent/30'
                  : 'text-foreground/90 hover:bg-accent/5'
                }
              `}
            >
              <div className="w-10 h-10 rounded-xl bg-card/60 backdrop-blur-lg flex items-center justify-center">
                <link.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{link.name}</div>
                {link.exclusive && <div className="text-xs text-accent">Exclusive</div>}
              </div>
              {link.exclusive && <Sparkles className="w-4 h-4 text-accent animate-pulse" />}
            </NavLink>
          ))}
        </nav>

        {/* Cart and Account Section */}
        <div className="mt-6 space-y-4">
          <Link
            to="/cart"
            className="flex items-center justify-between p-4 rounded-2xl bg-card/60 border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-info/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-accent" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <div>
                <div className="font-semibold">Shopping Bag</div>
                <div className="text-xs text-muted-foreground">
                  {totalCartItems ? `${totalCartItems} items • Rp ${cartValue.toLocaleString('id-ID')}` : 'Empty'}
                </div>
              </div>
            </div>
            <div className="text-muted-foreground">→</div>
          </Link>

          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-3 p-4 rounded-2xl bg-accent/8 border border-accent/20 text-accent"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">Welcome back</div>
                <div className="text-xs text-muted-foreground">{user.name}</div>
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-semibold">Login</span>
            </Link>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" />
            <span>Secured by premium encryption</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-primary/80 text-primary-foreground transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

// Main Header Component
const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const deviceInfo = useDeviceInfo();
  const isScrolled = useScrollDetection();
  const prefersReducedMotion = useReducedMotion();

  // Memoized animation variants
  const animations = useMemo(() =>
    createAnimationVariants(prefersReducedMotion),
    [prefersReducedMotion]
  );

  // Close menu pada navigation change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Body overflow management yang dioptimasi
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMenuOpen]);

  // Memoized header classes
  const headerClasses = useMemo(() => {
    const baseClasses = 'fixed inset-x-0 top-0 z-[90] transition-all duration-300';
    const scrolledClasses = isScrolled
      ? 'bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-2xl border-b border-border/50 shadow-lg'
      : 'bg-transparent';

    return `${baseClasses} ${scrolledClasses}`;
  }, [isScrolled]);

  // Optimized menu toggle handler
  const handleMenuToggle = useCallback(() => {
    startTransition(() => {
      setIsMenuOpen(prev => !prev);
    });
  }, []);

  const handleMenuClose = useCallback(() => {
    startTransition(() => {
      setIsMenuOpen(false);
    });
  }, []);

  return (
    <>
      <motion.header
        {...animations.header}
        className={headerClasses}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${deviceInfo.isMobile ? 'h-14' : 'h-20'
            }`}>

            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="flex-1 flex items-center justify-center">
              <NavigationLinks />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <CartButton />

              <div className="hidden md:block">
                <UserAccount />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={handleMenuToggle}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="lg:hidden p-2 rounded-xl text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div key="close" {...animations.menuIcon}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" {...animations.menuIcon}>
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            {...animations.mobileMenu}
            className="fixed inset-0 z-[90] bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-lg"
            aria-modal="true"
            role="dialog"
          >
            <MobileMenuContent onClose={handleMenuClose} deviceInfo={deviceInfo} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

// Set display names untuk debugging
Header.displayName = 'Header';
Logo.displayName = 'Logo';
NavigationLinks.displayName = 'NavigationLinks';
CartButton.displayName = 'CartButton';
UserAccount.displayName = 'UserAccount';
MobileMenuContent.displayName = 'MobileMenuContent';

export default Header;