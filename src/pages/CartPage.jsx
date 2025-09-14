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

const formatIDR = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

/* Accessible IconBtn */
const IconBtn = ({ icon: Icon, onClick, label, className = '', disabled }) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
    className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-320 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-accent ${className}`}
  >
    <Icon size={18} aria-hidden="true" />
  </Button>
);

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
      className="relative min-h-screen pt-24 pb-28 text-foreground bg-background"
    >
      <Helmet>
        <title>Cart — Neo Dervish</title>
      </Helmet>

      {/* Blobs */}
      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-20 h-64 w-64 rounded-full blur-3xl bg-accent/20"
      />
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full blur-3xl bg-primary/30"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-heading font-semibold">Your Cart</h1>
          <p className="mt-2 text-sm text-muted-foreground">Refine your picks. Smooth checkout awaits.</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
            {/* Items */}
            <div className="xl:col-span-2 space-y-5 sm:space-y-6">
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
                      dragElastic={0.15}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -120) handleRemove(item);
                      }}
                      className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 glass-card p-5 sm:p-6"
                    >
                      {/* swipe hint mobile */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 sm:hidden flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MoveHorizontal size={14} /> swipe to remove
                      </div>

                      {/* remove desktop */}
                      <button
                        onClick={() => handleRemove(item)}
                        aria-label="Remove item"
                        className="hidden sm:block absolute top-3 right-3 rounded-full p-2 text-muted-foreground hover:text-error transition duration-320"
                      >
                        <X size={18} />
                      </button>

                      {/* Image */}
                      <Link to={`/product/${item.slug}`} className="shrink-0 mx-auto sm:mx-0">
                        <motion.img
                          src={item.images?.[0]?.url || 'https://via.placeholder.com/128'}
                          alt={item.name}
                          className="h-28 w-28 sm:h-32 sm:w-32 object-cover rounded-2xl"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                          transition={{ duration: 0.25 }}
                          loading="lazy"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex w-full flex-col gap-3 sm:gap-4">
                        <div className="text-center sm:text-left">
                          <Link to={`/product/${item.slug}`}>
                            <h3 className="text-base sm:text-lg font-semibold hover:text-foreground transition duration-320">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-[11px] px-2 py-1 rounded-full border border-border bg-muted text-muted-foreground">
                              Size {item.size || '-'}
                            </span>
                            <span className="text-[11px] px-2 py-1 rounded-full border border-border bg-card text-foreground/70">
                              {formatIDR(item.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          {/* Qty */}
                          <div className="mx-auto sm:mx-0 flex items-center gap-2 rounded-full px-3 py-1.5 bg-card border border-border backdrop-blur-sm">
                            <IconBtn icon={Minus} onClick={() => dec(item)} label="Decrease quantity" />
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <IconBtn icon={Plus} onClick={() => inc(item)} label="Increase quantity" />
                          </div>

                          {/* Price + Remove */}
                          <div className="flex items-center justify-center sm:justify-end gap-3">
                            <p className="text-lg font-bold">{formatIDR(item.price * item.quantity)}</p>
                            <IconBtn
                              icon={Trash2}
                              onClick={() => handleRemove(item)}
                              label="Remove item"
                              className="hidden sm:flex text-muted-foreground hover:text-error"
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
              transition={{ duration: 0.4 }}
              className="xl:sticky xl:top-24 self-start"
            >
              <div className="glass-card p-6 sm:p-7 space-y-5">
                <h2 className="text-xl sm:text-2xl font-heading font-semibold">Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-mono">{formatIDR(shipping)}</span>
                  </div>
                  <div className="h-px bg-border my-1" />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="font-mono text-accent">{formatIDR(total)}</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full rounded-full font-bold btn-primary transition duration-320">
                  <Link to="/checkout" className="flex items-center justify-center">
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Link to="/shop" className="block text-center text-xs text-muted-foreground hover:text-foreground transition duration-320">
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
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center glass-card">
              <ShoppingCart size={36} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold">Cart is empty</h2>
            <p className="mt-2 text-muted-foreground text-sm">Pick your favorites. Premium awaits.</p>

            <Button asChild size="lg" className="mt-6 rounded-full font-bold btn-accent">
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
