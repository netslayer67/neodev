import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pageTransition } from '@/lib/motion';
import { products } from '@/data/products';

const CheckoutPage = () => {
  const cartItems = [
    { ...products[0], quantity: 1 },
    { ...products[2], quantity: 2 },
  ];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5.00;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="container mx-auto px-6 pt-32 pb-16"
    >
      <Helmet>
        <title>Checkout - Radiant Rage</title>
      </Helmet>
      
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-heading tracking-wider text-white">CHECKOUT</h1>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-16">
        {/* Shipping & Payment Form */}
        <div className="glass-card p-8">
            <form>
                <section>
                    <h2 className="text-2xl font-heading tracking-wider text-white mb-6">Shipping Information</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="John" className="bg-neutral-800 border-neutral-700"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" className="bg-neutral-800 border-neutral-700"/>
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="123 Fearless St" className="bg-neutral-800 border-neutral-700"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="New York" className="bg-neutral-800 border-neutral-700"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" placeholder="10001" className="bg-neutral-800 border-neutral-700"/>
                        </div>
                    </div>
                </section>
                
                <div className="border-t border-neutral-700 my-8"></div>

                <section>
                    <h2 className="text-2xl font-heading tracking-wider text-white mb-6">Payment Details</h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input id="card-number" placeholder="**** **** **** 1234" className="bg-neutral-800 border-neutral-700"/>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM / YY" className="bg-neutral-800 border-neutral-700"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" className="bg-neutral-800 border-neutral-700"/>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </div>

        {/* Order Summary */}
        <div className="glass-card p-8 self-start">
            <h2 className="text-2xl font-heading tracking-wider text-white mb-6">Your Order</h2>
            <div className="space-y-4">
                {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img  class="w-16 h-16 object-cover rounded-md" alt={item.name} src="https://images.unsplash.com/photo-1580728371486-c17d7e73f619" />
                            <div>
                                <p className="font-semibold text-white">{item.name}</p>
                                <p className="text-sm text-neutral-400">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <div className="border-t border-neutral-700 my-6"></div>
            <div className="space-y-2 text-neutral-200">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(total - 5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$5.00</span>
                </div>
                <div className="border-t border-neutral-700 my-4"></div>
                <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            <Button size="lg" className="w-full mt-8 bg-white text-black hover:bg-neutral-300 rounded-full font-bold text-lg py-7">
                Pay Now
            </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;