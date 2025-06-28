import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, ArrowRight } from 'lucide-react';
import { pageTransition } from '@/lib/motion';
import { products } from '@/data/products';

const CartPage = () => {
  const cartItems = [
    { ...products[0], quantity: 1 },
    { ...products[2], quantity: 2 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="container mx-auto px-6 pt-32 pb-16"
    >
      <Helmet>
        <title>Your Cart - Radiant Rage</title>
      </Helmet>
      
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-heading tracking-wider text-white">YOUR CART</h1>
      </div>
      
      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-6 p-4 glass-card">
                <img  class="w-24 h-24 object-cover rounded-lg" alt={item.name} src="https://images.unsplash.com/photo-1646193186132-7976c1670e81" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-neutral-400">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center border border-neutral-700 rounded-full">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><Minus size={14}/></Button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><Plus size={14}/></Button>
                </div>
                <p className="font-bold text-white text-lg w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white"><X size={20} /></Button>
              </div>
            ))}
          </div>

          <div className="glass-card p-8 self-start">
            <h2 className="text-2xl font-heading tracking-wider text-white mb-6">Order Summary</h2>
            <div className="space-y-4 text-neutral-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-neutral-700 my-4"></div>
              <div className="flex justify-between text-white text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button asChild size="lg" className="w-full mt-8 bg-white text-black hover:bg-neutral-300 rounded-full font-bold group">
                <Link to="/checkout">
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 glass-card">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty.</h2>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;