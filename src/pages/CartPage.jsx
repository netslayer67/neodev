import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// 1. Import actions dari cartSlice
import { addToCart, decreaseQuantity, removeFromCart } from '../store/slices/cartSlice';

import { Button } from '@/components/ui/button';
import { X, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/motion';

// Helper component (tetap sama)
const IconBtn = ({ icon: Icon, onClick, className = '' }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className={`h-10 w-10 rounded-full transition-colors duration-300 ${className}`}
  >
    <Icon size={16} />
  </Button>
);

const CartPage = () => {
  const dispatch = useDispatch();
  // 2. Ambil data cartItems dari Redux store
  const { cartItems } = useSelector((state) => state.cart);

  // 3. Implementasikan handler untuk dispatch actions
  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleIncreaseQuantity = (item) => {
    // Menambah 1 item dengan dispatch addToCart
    dispatch(addToCart({ product: item, quantity: 1 }));
  };

  const handleDecreaseQuantity = (item) => {
    dispatch(decreaseQuantity(item));
  };

  // 4. Kalkulasi total berdasarkan data dari Redux
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 15.00 : 0; // Biaya pengiriman premium
  const total = subtotal + shipping;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen px-4 sm:px-6 lg:px-8 pt-32 pb-24 bg-gradient-to-br from-black via-gray-900 to-black text-white selection:bg-white/20"
    >
      <Helmet>
        <title>Shopping Cart - Neo Dervish</title>
      </Helmet>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="container mx-auto max-w-7xl"
      >
        <motion.div variants={fadeIn('down', 'tween', 0.2, 0.8)} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight font-heading">
            Shopping Cart
          </h1>
          <p className="text-neutral-400 mt-4 text-lg">
            Review your items and proceed to a secure checkout.
          </p>
        </motion.div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-12">
            <div className="lg:col-span-2 space-y-6">
              {/* 5. AnimatePresence untuk animasi keluar item */}
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className="flex items-center gap-6 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
                  >
                    <Link to={`/product/${item.slug}`}>
                      <motion.img
                        className="w-28 h-28 object-cover rounded-lg flex-shrink-0"
                        alt={item.name}
                        src={item.images?.[0] ?? 'https://via.placeholder.com/112'}
                        loading="lazy"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      />
                    </Link>
                    <div className="flex-grow grid grid-cols-3 items-center gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <h3 className="text-lg font-semibold text-white hover:text-neutral-300 transition-colors">
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </h3>
                        <p className="text-neutral-400 text-sm">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex items-center justify-center border border-neutral-700 bg-black/20 rounded-full">
                        <IconBtn icon={Minus} onClick={() => handleDecreaseQuantity(item)} className="hover:bg-white/10 text-neutral-400 hover:text-white" />
                        <span className="w-10 text-center font-bold text-sm select-none">{item.quantity}</span>
                        <IconBtn icon={Plus} onClick={() => handleIncreaseQuantity(item)} className="hover:bg-white/10 text-neutral-400 hover:text-white" />
                      </div>
                      <div className="flex items-center justify-end gap-4">
                        <p className="font-semibold text-white text-lg w-32 text-right hidden md:block">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                        <IconBtn icon={X} onClick={() => handleRemoveItem(item)} className="text-neutral-500 hover:bg-red-500/20 hover:text-red-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
              className="lg:col-span-1 self-start sticky top-28"
            >
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-black/20">
                <h2 className="text-2xl font-medium tracking-tight text-white mb-6">Order Summary</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-neutral-300">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Shipping</span>
                    <span className="font-mono text-white">Rp {shipping.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-white/10 my-4"></div>
                  <div className="flex justify-between text-lg text-white font-bold">
                    <span>Total</span>
                    <span className="font-mono">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <Button asChild size="lg" className="w-full mt-8 bg-white text-black hover:bg-neutral-200 rounded-full font-bold group transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] ring-2 ring-offset-4 ring-offset-black ring-transparent focus:ring-white/50">
                  <Link to="/checkout" className="flex items-center justify-center">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          // 6. Tampilan Profesional untuk Keranjang Kosong
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }}
            className="text-center py-24 flex flex-col items-center"
          >
            <ShoppingCart size={64} className="text-neutral-700 mb-6" strokeWidth={1} />
            <h2 className="text-3xl font-medium mb-3">Your cart is empty</h2>
            <p className="text-neutral-400 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Explore our collection to find something you'll love.
            </p>
            <Button asChild size="lg" className="rounded-full font-bold group bg-white text-black hover:bg-neutral-200">
              <Link to="/shop">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CartPage;