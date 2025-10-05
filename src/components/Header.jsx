import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
  startTransition
} from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useSelector } from 'react-redux'

// selective icons to keep bundle small
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
} from 'lucide-react'

/**
 * Header.refactor.jsx
 * - Compact, performant Header with luxury "liquid glass" feel
 * - Uses your Tailwind tokens (no hardcoded colors)
 * - Smooth transitions (~320ms), reduced-motion friendly
 * - Mobile compact layout + desktop variant
 * - Lightweight search sanitization to block scripts/links
 * - Decorative, token-driven blobs
 */

const SCROLL_THRESHOLD = 18
const RESIZE_DEBOUNCE_MS = 140
const MOBILE_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1024

// LRU-ish cache for sanitized inputs
const sanitizeCache = new Map()
const SANITIZE_CACHE_LIMIT = 80

const sanitizeSearch = (value = '') => {
  const raw = String(value)
  if (!raw) return ''
  if (sanitizeCache.has(raw)) return sanitizeCache.get(raw)

  // remove tags, collapse whitespace, cap length
  let cleaned = raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').slice(0, 80).trim()

  // block obvious link patterns / javascript schemes
  if (/https?:\/\//i.test(cleaned) || /javascript:/i.test(cleaned) || /data:/i.test(cleaned)) {
    cleaned = ''
  }

  if (sanitizeCache.size >= SANITIZE_CACHE_LIMIT) {
    const first = sanitizeCache.keys().next().value
    sanitizeCache.delete(first)
  }
  sanitizeCache.set(raw, cleaned)
  return cleaned
}

const useDevice = () => {
  const [device, setDevice] = useState(() => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isDesktop: true }
    const w = window.innerWidth
    return { isMobile: w < MOBILE_BREAKPOINT, isTablet: w >= MOBILE_BREAKPOINT && w < DESKTOP_BREAKPOINT, isDesktop: w >= DESKTOP_BREAKPOINT }
  })

  const t = useRef(null)
  useEffect(() => {
    const onResize = () => {
      if (t.current) clearTimeout(t.current)
      t.current = setTimeout(() => {
        const w = window.innerWidth
        setDevice(prev => {
          const next = { isMobile: w < MOBILE_BREAKPOINT, isTablet: w >= MOBILE_BREAKPOINT && w < DESKTOP_BREAKPOINT, isDesktop: w >= DESKTOP_BREAKPOINT }
          if (prev.isMobile === next.isMobile && prev.isTablet === next.isTablet && prev.isDesktop === next.isDesktop) return prev
          return next
        })
      }, RESIZE_DEBOUNCE_MS)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return device
}

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false)
  const raf = useRef(null)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset
        if (Math.abs(y - lastY.current) > 6) {
          const next = y > SCROLL_THRESHOLD
          if (next !== scrolled) startTransition(() => setScrolled(next))
          lastY.current = y
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [scrolled])

  return scrolled
}

const Logo = memo(function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label="Brand">
      <div className="relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 backdrop-blur-glass border border-accent/25 flex items-center justify-center transition-transform duration-[320ms] group-hover:scale-105">
          <Crown className="w-4 h-4 text-accent" />
        </div>
      </div>
      <div className="hidden sm:flex flex-col leading-none">
        <span className="text-base font-heading font-bold tracking-tight">NEO DERVISH</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">In Soul We Move</span>
      </div>
    </Link>
  )
})
Logo.displayName = 'Logo'

const NavLinks = memo(function NavLinks() {
  const links = useMemo(() => [
    { name: 'Home', href: '/', icon: Crown, exclusive: true },
    { name: 'Collection', href: '/shop', icon: Sparkles },
    { name: 'Preorder', href: '/preorder', icon: Sparkles, preorder: true },
    { name: 'About', href: '/about', icon: Shield },
    { name: 'Concierge', href: '/contact', icon: Star }
  ], [])

  return (
    <nav className="hidden lg:flex items-center gap-5">
      {links.map(l => (
        <NavLink key={l.name} to={l.href} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-[320ms] text-sm font-medium ${isActive ? (l.preorder ? 'text-warning bg-warning/8 shadow-sm' : 'text-accent bg-accent/8 shadow-sm') : (l.preorder ? 'text-foreground/80 hover:text-warning hover:bg-warning/5' : 'text-foreground/80 hover:text-accent hover:bg-accent/5')}`}>
          <l.icon className="w-4 h-4" />
          <span>{l.name}</span>
          {l.exclusive && <span className="ml-2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />}
          {l.preorder && <span className="ml-2 w-1.5 h-1.5 bg-warning rounded-full animate-pulse" />}
        </NavLink>
      ))}
    </nav>
  )
})
NavLinks.displayName = 'NavLinks'

const Cart = memo(function Cart() {
  const cart = useSelector(s => s.cart?.cartItems || [])
  const count = useMemo(() => cart.reduce((t, it) => t + (it.quantity || 0), 0), [cart])
  return (
    <Link to="/cart" aria-label={`Cart with ${count} items`} className="relative p-2 rounded-xl text-foreground/80 hover:text-accent hover:bg-accent/10 transition-all duration-[320ms]">
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-accent to-info text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">{count > 99 ? '99+' : count}</span>
      )}
    </Link>
  )
})
Cart.displayName = 'Cart'

const Account = memo(function Account() {
  const user = useSelector(s => s.auth?.user)
  if (user) {
    return (
      <Link to="/profile" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-accent/8 to-info/8 border border-accent/20 text-accent transition-all duration-[320ms]">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-info flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-medium">{user.name?.split(' ')[0] || 'Account'}</span>
      </Link>
    )
  }

  return (
    <Link to="/login" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground transition-all duration-[320ms] shadow-sm">
      <LogIn className="w-4 h-4" />
      <span className="text-sm font-medium">Login</span>
    </Link>
  )
})
Account.displayName = 'Account'

function MobilePanel({ onClose }) {
  const user = useSelector(s => s.auth?.user)
  const cart = useSelector(s => s.cart?.cartItems || [])
  const { total, value } = useMemo(() => {
    const t = cart.reduce((s, i) => s + (i.quantity || 0), 0)
    const v = cart.reduce((s, i) => s + ((i.price || 0) * (i.quantity || 0)), 0)
    return { total: t, value: v }
  }, [cart])

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-16 px-4">
      {/* smaller blobs */}
      <div className="pointer-events-none absolute -top-6 -right-4 w-24 h-24 rounded-full bg-accent/12 blur-2xl" />
      <div className="pointer-events-none absolute bottom-6 left-4 w-20 h-20 rounded-full bg-secondary/10 blur-2xl" />

      {/* sticky close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/60 backdrop-blur-lg border border-border/30 hover:bg-background/80 transition-all"
        aria-label="Close menu"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md mt-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-heading font-bold text-foreground">NEO DERVISH</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">In Soul We Move</p>
        </div>

        <nav className="space-y-2">
          {[
            { name: 'Home', href: '/', icon: Crown, exclusive: true },
            { name: 'Collection', href: '/shop', icon: Sparkles },
            { name: 'Preorder', href: '/preorder', icon: Sparkles, preorder: true },
            { name: 'About', href: '/about', icon: Shield },
            { name: 'Concierge', href: '/contact', icon: Star }
          ].map(l => (
            <NavLink
              key={l.name}
              to={l.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300
                 ${isActive ? (l.preorder ? 'bg-warning/8 text-warning border border-warning/30' : 'bg-accent/8 text-accent border border-accent/30') :
                  (l.preorder ? 'text-foreground/90 hover:bg-warning/5' : 'text-foreground/90 hover:bg-accent/5')}`
              }
            >
              <div className="w-8 h-8 rounded-lg bg-card/60 backdrop-blur-lg flex items-center justify-center">
                <l.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{l.name}</div>
                {l.exclusive && <div className="text-[10px] text-accent">Exclusive</div>}
                {l.preorder && <div className="text-[10px] text-warning">Preorder</div>}
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="mt-3 space-y-3">
          <Link to="/cart" className="flex items-center justify-between p-4 rounded-2xl bg-card/60 border border-border/50" onClick={onClose}>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-info/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-accent" />
                {total > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">{total}</span>}
              </div>
              <div>
                <div className="font-semibold">Shopping Bag</div>
                <div className="text-xs text-muted-foreground">{total ? `${total} items • Rp ${value.toLocaleString('id-ID')}` : 'Empty'}</div>
              </div>
            </div>
            <div className="text-muted-foreground">→</div>
          </Link>

          {user ? (
            <Link to="/profile" className="flex items-center gap-3 p-4 rounded-2xl bg-accent/8 border border-accent/20 text-accent" onClick={onClose}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">Welcome back</div>
                <div className="text-xs text-muted-foreground">{user.name}</div>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm" onClick={onClose}>
              <LogIn className="w-5 h-5" />
              <span className="font-semibold">Login</span>
            </Link>
          )}
        </div>

        <div className="mt-6 text-center text-[10px] text-muted-foreground flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" />
          <span>Secured by premium encryption</span>
        </div>
      </div>
    </div>
  )
}


const Header = memo(function Header() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  const device = useDevice()
  const scrolled = useScrolled()
  const prefersReducedMotion = useReducedMotion()

  const animations = useMemo(() => ({
    header: {
      initial: prefersReducedMotion ? { opacity: 1 } : { y: -18, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: prefersReducedMotion ? 0.12 : 0.45, ease: [0.22, 0.9, 0.2, 1] }
    },
    mobile: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.28 } }
  }), [prefersReducedMotion])

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  const headerClass = useMemo(() => {
    const base = 'fixed inset-x-0 top-0 z-[90] transition-all duration-[320ms]'
    const sc = scrolled ? 'bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-2xl border-b border-border/50 shadow-lg' : 'bg-transparent'
    return `${base} ${sc}`
  }, [scrolled])

  const toggle = useCallback(() => startTransition(() => setOpen(v => !v)), [])
  const close = useCallback(() => startTransition(() => setOpen(false)), [])

  // search handling with sanitization
  const onSearchChange = useCallback((e) => {
    const raw = e.target.value
    const cleaned = sanitizeSearch(raw)
    setQuery(cleaned)
  }, [])

  const onSearchSubmit = useCallback((e) => {
    e.preventDefault()
    if (!query) return
    // lightweight: navigation handled externally to keep Header tiny
    // example: router.navigate(`/search?q=${encodeURIComponent(query)}`)
  }, [query])

  return (
    <>
      <motion.header {...animations.header} className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${device.isMobile ? 'h-14' : 'h-20'}`}>

            <div className="flex items-center gap-4">
              <Logo />
            </div>

            <div className="flex-1 flex items-center justify-center">
              <NavLinks />
            </div>

            <div className="flex items-center gap-3">
              <Cart />

              <Account />

              {/* compact mobile toggle */}
              <button onClick={toggle} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="lg:hidden p-2 rounded-xl text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-[320ms]">
                <AnimatePresence mode="wait">
                  {open ? (
                    <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div {...animations.mobile} className="fixed inset-0 z-[90] bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-lg" aria-modal="true" role="dialog">
            <MobilePanel onClose={close} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})

Header.displayName = 'Header'
export default Header
