'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decreaseQuantity, removeFromCart } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import {
  X,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
  MoveHorizontal,
  Trash2,
} from 'lucide-react';
import { pageTransition } from '@/lib/motion';

/* ---------- Small helpers ---------- */
const formatIDR = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

/* Accessible icon button */
const IconBtn = ({ icon: Icon, onClick, label, className = '', disabled }) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
    className={`h-10 w-10 rounded-full transition-all hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#8A5CF6] ${className}`}
  >
    <Icon size={18} aria-hidden="true" />
  </Button>
);

/* ---------- Page ---------- */
const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((s) => s.cart);
  const shouldReduceMotion = useReducedMotion();

  const { subtotal, shipping, total } = useMemo(() => {
    const sub = cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const ship = cartItems.length > 0 ? 15000 : 0;
    return { subtotal: sub, shipping: ship, total: sub + ship };
  }, [cartItems]);

  const handleRemove = (item) => dispatch(removeFromCart(item));
  const inc = (item) => dispatch(addToCart({ product: { ...item, size: item.size }, quantity: 1 }));
  const dec = (item) => dispatch(decreaseQuantity(item));

  /* Motion variants */
  const listVariants = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: shouldReduceMotion ? 0 : i * 0.04, type: 'spring', stiffness: 220, damping: 22 },
    }),
    exit: { opacity: 0, y: 30, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="relative min-h-screen text-white pt-24 pb-28"
      style={{
        background:
          'radial-gradient(1200px 600px at 10% -10%, rgba(138,92,246,0.12), transparent 60%), linear-gradient(180deg, #0F0F1A 10%, #1E2A47 120%)',
      }}
    >
      <Helmet>
        <title>Cart — Neo Dervish</title>
        <meta name="description" content="Review your picks. Smooth checkout, premium feel." />
      </Helmet>

      {/* Decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none">
        <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full blur-3xl opacity-70"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(138,92,246,0.35), transparent 60%)' }} />
        <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full blur-3xl opacity-60"
          style={{ background: 'radial-gradient(circle at 70% 70%, rgba(30,42,71,0.6), transparent 55%)' }} />
        {/* soft grid pattern */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: 'radial-gradient(#fff 0.6px, transparent 0.6px)',
            backgroundSize: '18px 18px'
          }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight">Your Cart</h1>
          <p className="mt-2 text-sm sm:text-base text-white/60">Good taste. Keep it going.</p>
        </div>

        {/* Content */}
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
            {/* Items */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              <AnimatePresence initial={false}>
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={`${item._id}-${item.size}`}
                    custom={idx}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    variants={listVariants}
                  >
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.18}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -120) handleRemove(item);
                      }}
                      className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6
                                 rounded-3xl p-5 sm:p-6
                                 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.3)]
                                 bg-[rgba(255,255,255,0.06)] backdrop-blur-xl"
                    >
                      {/* swipe hint mobile */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 sm:hidden flex items-center gap-1 text-[11px] text-white/50">
                        <MoveHorizontal size={14} /> swipe to remove
                      </div>

                      {/* remove desktop */}
                      <button
                        onClick={() => handleRemove(item)}
                        aria-label="Remove item"
                        className="hidden sm:block absolute top-3 right-3 rounded-full p-2 text-white/60 hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition"
                      >
                        <X size={18} />
                      </button>

                      {/* Image */}
                      <Link to={`/product/${item.slug}`} className="shrink-0 mx-auto sm:mx-0">
                        <motion.img
                          src={item.images?.[0]?.url || 'https://via.placeholder.com/128'}
                          alt={item.images?.[0]?.alt || item.name}
                          className="h-28 w-28 sm:h-32 sm:w-32 object-cover rounded-2xl"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                          transition={{ duration: 0.2 }}
                          loading="lazy"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex w-full flex-col gap-3 sm:gap-4">
                        <div className="text-center sm:text-left">
                          <Link to={`/product/${item.slug}`} className="inline-block">
                            <h3 className="text-base sm:text-lg font-serif font-semibold hover:text-white/85 transition">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-[11px] px-2 py-1 rounded-full border border-white/10 bg-white/10 text-white/70">
                              Size {item.size || '-'}
                            </span>
                            <span className="text-[11px] px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white/60">
                              {formatIDR(item.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          {/* Qty */}
                          <div
                            className="mx-auto sm:mx-0 flex items-center gap-2 rounded-full px-3 py-1.5
                                       bg-[rgba(255,255,255,0.07)] border border-white/10 backdrop-blur-lg"
                            role="group"
                            aria-label={`Quantity for ${item.name}`}
                          >
                            <IconBtn icon={Minus} onClick={() => dec(item)} label="Decrease quantity" />
                            <span className="w-8 text-center text-sm font-bold" aria-live="polite">
                              {item.quantity}
                            </span>
                            <IconBtn icon={Plus} onClick={() => inc(item)} label="Increase quantity" />
                          </div>

                          {/* Row right */}
                          <div className="flex items-center justify-center sm:justify-end gap-3">
                            <p className="text-lg font-bold">
                              {formatIDR(item.price * item.quantity)}
                            </p>
                            <IconBtn
                              icon={Trash2}
                              onClick={() => handleRemove(item)}
                              label="Remove item"
                              className="hidden sm:flex text-white/70 hover:text-[#ff6b6b]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <motion.aside
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="xl:sticky xl:top-24 self-start"
            >
              <div
                className="rounded-3xl p-6 sm:p-7 space-y-5
                           border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.35)]
                           bg-[rgba(255,255,255,0.07)] backdrop-blur-2xl"
              >
                <h2 className="text-xl sm:text-2xl font-serif font-semibold">Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70">
                    <span>Shipping</span>
                    <span className="font-mono text-white">{formatIDR(shipping)}</span>
                  </div>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex items-center justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="font-mono" style={{ color: '#8A5CF6' }}>
                      {formatIDR(total)}
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full font-bold transition
                             bg-[#8A5CF6] text-white hover:bg-[#8A5CF6]/90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8A5CF6] focus-visible:ring-offset-[#0F0F1A]"
                >
                  <Link to="/checkout" className="flex items-center justify-center">
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Link
                  to="/shop"
                  className="block text-center text-xs text-white/60 hover:text-white transition"
                >
                  or keep shopping
                </Link>
              </div>
            </motion.aside>
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-md text-center"
          >
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl
                         border border-white/10 bg-[rgba(255,255,255,0.06)] backdrop-blur-xl"
            >
              <ShoppingCart size={36} className="text-white/60" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold">Cart is empty</h2>
            <p className="mt-2 text-white/60 text-sm">Pick your favorites. Simple, solid, premium.</p>

            <Button
              asChild
              size="lg"
              className="mt-6 rounded-full font-bold bg-white text-black hover:bg-neutral-200"
            >
              <Link to="/shop">
                Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;
