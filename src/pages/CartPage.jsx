// CartPage.jsx (Luxury UI v2 - Premium Cart Redesign)
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decreaseQuantity, removeFromCart } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
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
      className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white pt-32 pb-28 px-4 sm:px-6 lg:px-10"
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
          <h1 className="text-5xl md:text-6xl font-heading tracking-tight">Your Cart</h1>
          <p className="text-neutral-400 mt-4 text-lg">Elegance in every item. Ready for checkout.</p>
        </motion.div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Left */}
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
                    className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-6"
                  >
                    <Link to={`/product/${item.slug}`}>
                      <motion.img
                        src={item.images?.[0] || 'https://via.placeholder.com/112'}
                        alt={item.name}
                        loading="lazy"
                        className="w-28 h-28 object-cover rounded-xl"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                    <div className="flex-grow grid grid-cols-3 md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <Link to={`/product/${item.slug}`}>
                          <h3 className="text-lg font-semibold hover:text-white/80 transition-colors">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-white/50">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="col-span-2 md:col-span-2 flex items-center justify-center gap-2 bg-white/10 border border-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                        <IconBtn icon={Minus} onClick={() => handleDecreaseQuantity(item)} className="text-white/70 hover:text-white" />
                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                        <IconBtn icon={Plus} onClick={() => handleIncreaseQuantity(item)} className="text-white/70 hover:text-white" />
                      </div>
                      <div className="hidden md:block text-right space-y-2">
                        <p className="text-lg font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                        <IconBtn icon={X} onClick={() => handleRemoveItem(item)} className="hover:bg-red-500/20 hover:text-red-400 text-neutral-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="sticky top-28 self-start"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold">Order Summary</h2>
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
                    <span className="font-mono">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <Button asChild size="lg" className="w-full rounded-full bg-white text-black hover:bg-neutral-200 transition duration-300 font-bold">
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
            {/* <ShoppingCart size={64} className="text-white/30 mb-6" strokeWidth={1} /> */}
            <h2 className="text-3xl font-semibold mb-3">Your cart is empty</h2>
            <p className="text-white/50 max-w-md mx-auto mb-8">
              Looks like you haven’t added anything to your cart yet. Explore our collection to find pieces you’ll love.
            </p>
            <Button asChild size="lg" className="rounded-full font-bold bg-white text-black hover:bg-neutral-200">
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