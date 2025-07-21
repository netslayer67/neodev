import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decreaseQuantity, removeFromCart } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, ArrowRight, ShoppingCart, MoveHorizontal } from 'lucide-react';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/motion';

const IconBtn = ({ icon: Icon, onClick, className = '' }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className={`h-10 w-10 rounded-full transition-all hover:scale-110 active:scale-95 ${className}`}
  >
    <Icon size={18} />
  </Button>
);

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cart);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 15000 : 0;
  const total = subtotal + shipping;

  const handleRemoveItem = (item) => dispatch(removeFromCart(item));
  const handleIncreaseQuantity = (item) => dispatch(addToCart({ product: item, quantity: 1 }));
  const handleDecreaseQuantity = (item) => dispatch(decreaseQuantity(item));

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-32 pb-28 px-4 sm:px-6 lg:px-10 font-sans"
    >
      <Helmet>
        <title>Cart - Neo Dervish</title>
      </Helmet>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={fadeIn('down')} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight">Your Cart</h1>
          <p className="text-neutral-400 mt-4 text-lg">Refined choices, curated just for you.</p>
        </motion.div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-8">
              <AnimatePresence>
                {cartItems.map(item => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 60 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, info) => {
                        if (info.offset.x < -100) handleRemoveItem(item);
                      }}
                      className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-4 shadow-xl"
                    >
                      {/* Swipe Hint (mobile only) */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 sm:hidden flex items-center text-white/30 text-xs gap-1">
                        <MoveHorizontal size={14} /> Swipe to remove
                      </div>

                      {/* Tombol Hapus (desktop) */}
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="hidden sm:block absolute top-4 right-4 p-2 rounded-full hover:bg-red-500/20 text-white/60 hover:text-red-400 transition"
                        aria-label="Remove item"
                      >
                        <X size={18} />
                      </button>

                      {/* Gambar */}
                      <Link to={`/product/${item.slug}`}>
                        <motion.img
                          src={item.images?.[0]?.url || 'https://via.placeholder.com/112'}
                          alt={item.images?.[0]?.alt}
                          loading="lazy"
                          className="w-32 h-32 object-cover rounded-2xl mx-auto sm:mx-0"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>

                      {/* Info & Kontrol */}
                      <div className="flex flex-col text-center sm:text-left sm:flex-1 sm:items-start gap-4 w-full">
                        <div>
                          <Link to={`/product/${item.slug}`}>
                            <h3 className="text-base sm:text-lg font-serif font-semibold hover:text-white/80 transition">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-white/50">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                          {/* Quantity */}
                          <div className="flex justify-center sm:justify-start items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-full sm:w-auto max-w-[220px] mx-auto sm:mx-0">
                            <IconBtn icon={Minus} onClick={() => handleDecreaseQuantity(item)} className="text-white/70 hover:text-white" />
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <IconBtn icon={Plus} onClick={() => handleIncreaseQuantity(item)} className="text-white/70 hover:text-white" />
                          </div>

                          {/* Harga Total */}
                          <p className="text-lg font-bold text-gold-400">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="sticky top-28 self-start"
            >
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
                <h2 className="text-2xl font-semibold font-serif">Order Summary</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span className="font-mono text-white">Rp {shipping.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-white/10" />
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="font-mono text-gold-400">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full bg-white text-black hover:bg-neutral-200 transition duration-300 font-bold shadow-lg"
                >
                  <Link to="/checkout" className="flex items-center justify-center">
                    Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-24"
          >
            {/* Ikon ditengah */}
            <div className="flex justify-center mb-6">
              <ShoppingCart size={64} className="text-white/30" strokeWidth={1} />
            </div>

            <h2 className="text-3xl font-semibold font-serif mb-3">Your cart is currently empty</h2>
            <p className="text-white/50 max-w-md mx-auto mb-8">
              Explore our curated collection and find pieces that speak to your soul.
            </p>

            <Button
              asChild
              size="lg"
              className="rounded-full font-bold bg-white text-black hover:bg-neutral-200"
            >
              <Link to="/shop">
                Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

        )}
      </motion.div>
    </motion.div>
  );
};

export default CartPage;
