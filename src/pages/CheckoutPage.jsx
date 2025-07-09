import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/motion'; // Asumsi motion variants ada di file ini
import { products } from '@/data/products';
import { RadioGroup } from '@headlessui/react';
import { CheckCircle, Lock } from 'lucide-react';

// Helper Component untuk Input Fields yang lebih rapi
const FormField = ({ id, label, ...props }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium text-neutral-400">{label}</Label>
        <Input id={id} {...props} className="bg-white/5 border-neutral-700 focus:border-white focus:bg-white/10 transition-colors duration-300 rounded-lg py-5" />
    </div>
);

const CheckoutPage = () => {
    // State untuk mengontrol langkah checkout yang aktif
    const [activeSection, setActiveSection] = useState('shipping'); // 'shipping' | 'payment'

    const cartItems = [
        { ...products[0], quantity: 1 },
        { ...products[2], quantity: 2 },
    ];

    const [paymentMethod, setPaymentMethod] = useState('online');
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 15.0; // Premium shipping fee
    const adminFee = 2.5;
    const onlineDiscount = 3.0;

    const total = subtotal + shipping + (paymentMethod === 'offline' ? adminFee : -onlineDiscount);

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="min-h-screen px-4 sm:px-6 lg:px-8 pt-32 pb-24 bg-gradient-to-br from-black via-gray-800 to-black text-white selection:bg-white/20"
        >
            <Helmet>
                <title>Secure Checkout - Radiant Rage</title>
            </Helmet>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="container mx-auto max-w-7xl"
            >
                {/* HEADING */}
                <motion.div variants={fadeIn('down', 'tween', 0.2, 0.8)} className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-medium tracking-tight font-heading">Secure Checkout</h1>
                    <p className="text-neutral-400 mt-4 text-lg">Complete your purchase in just a few steps.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-16 gap-y-12">

                    {/* Kolom Kiri: Form Checkout dengan Steps */}
                    <motion.div
                        layout
                        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                        className="lg:col-span-3 space-y-8"
                    >
                        {/* 1. SHIPPING INFORMATION */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-medium tracking-tight text-white">Shipping Information</h2>
                                {activeSection !== 'shipping' && (
                                    <button onClick={() => setActiveSection('shipping')} className="text-sm text-neutral-300 hover:text-white transition">Edit</button>
                                )}
                            </div>
                            <AnimatePresence>
                                {activeSection === 'shipping' && (
                                    <motion.form
                                        key="shipping-form"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.5, type: 'spring' }}
                                        className="overflow-hidden"
                                        onSubmit={(e) => { e.preventDefault(); setActiveSection('payment'); }}
                                    >
                                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                            <FormField id="firstName" label="First Name" placeholder="John" />
                                            <FormField id="lastName" label="Last Name" placeholder="Doe" />
                                            <div className="sm:col-span-2">
                                                <FormField id="address" label="Address" placeholder="123 Fearless St, Apt 4B" />
                                            </div>
                                            <FormField id="city" label="City" placeholder="New York" />
                                            <FormField id="zip" label="ZIP Code" placeholder="10001" />
                                        </div>
                                        <Button type="submit" size="lg" className="w-full font-bold rounded-lg py-6">Continue to Payment</Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 2. PAYMENT METHOD */}
                        <div className={`bg-white/5 border rounded-2xl p-8 backdrop-blur-md transition-colors ${activeSection === 'payment' ? 'border-white/20' : 'border-white/10'}`}>
                            <h2 className={`text-2xl font-medium tracking-tight mb-6 transition-colors ${activeSection === 'payment' ? 'text-white' : 'text-neutral-500'}`}>Payment Method</h2>
                            <AnimatePresence>
                                {activeSection === 'payment' && (
                                    <motion.div
                                        key="payment-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, transition: { delay: 0.3 } }}
                                        className="space-y-6"
                                    >
                                        <RadioGroup value={paymentMethod} onChange={setPaymentMethod} className="space-y-4 relative">
                                            <RadioGroup.Option value="online">
                                                {({ checked }) => (
                                                    <div className={`relative p-5 rounded-lg border cursor-pointer transition-all duration-300 ${checked ? 'bg-white/10 border-white' : 'border-neutral-700 hover:border-neutral-400'}`}>
                                                        <span className="font-medium">Online Payment (Discount ${onlineDiscount.toFixed(2)})</span>
                                                        <p className="text-sm text-neutral-400 mt-1">Credit Card, Debit, or Digital Wallets</p>
                                                        {checked && <motion.div layoutId="radio-check" className="absolute top-4 right-4 text-white"><CheckCircle /></motion.div>}
                                                    </div>
                                                )}
                                            </RadioGroup.Option>
                                            <RadioGroup.Option value="offline">
                                                {({ checked }) => (
                                                    <div className={`relative p-5 rounded-lg border cursor-pointer transition-all duration-300 ${checked ? 'bg-white/10 border-white' : 'border-neutral-700 hover:border-neutral-400'}`}>
                                                        <span className="font-medium">Manual Transfer / COD (+${adminFee.toFixed(2)} Fee)</span>
                                                        <p className="text-sm text-neutral-400 mt-1">Bank Transfer or Cash on Delivery</p>
                                                        {checked && <motion.div layoutId="radio-check" className="absolute top-4 right-4 text-white"><CheckCircle /></motion.div>}
                                                    </div>
                                                )}
                                            </RadioGroup.Option>
                                        </RadioGroup>
                                        <AnimatePresence>
                                            {paymentMethod === 'online' && (
                                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                                                    <div className="sm:col-span-2">
                                                        <FormField id="card-number" label="Card Number" placeholder="**** **** **** 1234" />
                                                    </div>
                                                    <FormField id="expiry" label="Expiry Date" placeholder="MM / YY" />
                                                    <FormField id="cvc" label="CVC" placeholder="123" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </motion.div>

                    {/* Kolom Kanan: Order Summary (Sticky) */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                        className="lg:col-span-2 self-start sticky top-28"
                    >
                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-black/20">
                            <h2 className="text-2xl font-medium tracking-tight text-white mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <img className="w-16 h-16 object-cover rounded-lg" src={item.images?.[0] ?? 'https://via.placeholder.com/64'} alt={item.name} loading="lazy" />
                                            <div>
                                                <p className="font-semibold text-white">{item.name}</p>
                                                <p className="text-sm text-neutral-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold font-mono text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 my-6" />
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-neutral-300"><span>Subtotal</span><span className="font-mono text-white">${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-neutral-300"><span>Shipping</span><span className="font-mono text-white">${shipping.toFixed(2)}</span></div>
                                <AnimatePresence>
                                    {paymentMethod === 'offline' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-between text-neutral-300">
                                            <span>Admin Fee</span><span className="font-mono text-white">${adminFee.toFixed(2)}</span>
                                        </motion.div>
                                    )}
                                    {paymentMethod === 'online' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-between text-green-400">
                                            <span className="font-medium">Online Payment Discount</span><span className="font-mono">-${onlineDiscount.toFixed(2)}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="border-t border-white/10 my-6" />
                            <div className="flex justify-between text-white text-xl font-bold">
                                <span>Total</span><span className="font-mono">${total.toFixed(2)}</span>
                            </div>
                            <Button
                                size="lg"
                                disabled={activeSection !== 'payment'}
                                className="w-full mt-8 bg-white text-black hover:bg-neutral-200 rounded-lg font-bold text-lg py-6 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed group"
                            >
                                <Lock className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                                {paymentMethod === 'offline' ? 'Place Order' : 'Pay Now'}
                            </Button>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </motion.div>
    );
};

export default CheckoutPage;