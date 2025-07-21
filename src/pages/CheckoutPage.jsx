import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/motion';
import { RadioGroup } from '@headlessui/react';
import { CheckCircle, Lock, HelpCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { createOrder, clearOrderState } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

const FormField = ({ id, label, tooltip, ...props }) => (
    <motion.div variants={fadeIn('up')} className="space-y-2 relative group">
        <Label htmlFor={id} className="text-sm font-medium text-white/80 flex items-center gap-1">
            {label}
            {tooltip && (
                <HelpCircle
                    size={14}
                    className="text-white/40 group-hover:text-white transition"
                    title={tooltip}
                />
            )}
        </Label>
        <Input
            id={id}
            {...props}
            className="bg-white/5 border-white/10 focus:border-gold/30 focus:ring-2 focus:ring-gold/50 text-white transition-all duration-300 rounded-2xl py-5 w-full"
        />
    </motion.div>
);

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const { status: orderStatus } = useSelector((state) => state.orders);

    const [activeSection, setActiveSection] = useState('shipping');
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: 'Indonesia',
        phone: '',
    });

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shippingFee = cartItems.length > 0 ? 15000 : 0;
    const adminFee = 2500;
    const onlineDiscount = 3000;
    const total =
        subtotal + shippingFee + (paymentMethod === 'offline' ? adminFee : -onlineDiscount);

    const paymentOptions = [
        {
            id: 'online',
            name: `Online Payment (-Rp ${onlineDiscount.toLocaleString('id-ID')})`,
            description: 'Virtual Account',
        },
        {
            id: 'offline',
            name: `Cash On Delivery (+Rp ${adminFee.toLocaleString('id-ID')})`,
            description: 'Cash',
        },
    ];

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const orderData = {
            items: cartItems.map((item) => ({
                product: item._id,
                quantity: item.quantity,
            })),
            shippingAddress: { ...shippingAddress, fullName: user.name },
            paymentMethod,
            itemsPrice: subtotal,
            shippingPrice: shippingFee,
            totalPrice: total,
        };
        try {
            const result = await dispatch(createOrder(orderData)).unwrap();
            if (paymentMethod === 'online' && result.paymentUrl) {
                window.location.href = result.paymentUrl;
            } else {
                toast({
                    title: 'Order Placed',
                    description: `#${result.order.orderId} created successfully.`,
                });
                dispatch(clearCart());
                dispatch(clearOrderState());
                navigate('/profile', { state: { activeView: 'orders' } });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: error.message,
            });
        }
    };

    if (cartItems.length === 0) {
        navigate('/profile', { state: { activeView: 'orders' } });
        return null;
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white pt-24 pb-24 px-4 sm:px-6 lg:px-10 font-sans"
        >
            <Helmet>
                <title>Checkout - Neo Dervish</title>
            </Helmet>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto"
            >
                <motion.div variants={fadeIn('down')} className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-display tracking-tight">
                        Complete Your Elegance
                    </h1>
                    <p className="text-neutral-400 mt-4 text-lg">
                        Your refined essentials, securely delivered.
                    </p>
                </motion.div>

                <form
                    onSubmit={handlePlaceOrder}
                    className="flex flex-col lg:grid lg:grid-cols-5 gap-12"
                >
                    <motion.div layout className="lg:col-span-3 space-y-10 w-full">
                        {/* Shipping */}
                        <div className="w-full relative rounded-3xl p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl sm:text-2xl font-semibold text-white">Shipping Information</h2>
                                {activeSection !== 'shipping' && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection('shipping')}
                                        className="text-sm text-white/50 hover:text-white transition"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            <AnimatePresence>
                                {activeSection === 'shipping' && (
                                    <motion.div
                                        key="shipping"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="grid sm:grid-cols-2 gap-6"
                                    >
                                        <FormField id="fullName" label="Full Name" defaultValue={user?.name} readOnly />
                                        <FormField id="email" label="Email" defaultValue={user?.email} readOnly />
                                        <FormField id="street" label="Street Address" value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} required />
                                        <FormField id="phone" label="Phone Number" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} required />
                                        <FormField id="city" label="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} required />
                                        <FormField id="postalCode" label="Postal Code" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} required />
                                        <div className="sm:col-span-2 mt-6">
                                            <Button type="button" onClick={() => setActiveSection('payment')} className="w-full py-5 font-bold text-lg bg-white text-black hover:bg-neutral-200 rounded-2xl">
                                                Continue to Payment
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Payment */}
                        <div className="w-full relative rounded-3xl p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
                            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white">Payment Method</h2>
                            <AnimatePresence>
                                {activeSection === 'payment' && (
                                    <motion.div
                                        key="payment"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-5"
                                    >
                                        <RadioGroup value={paymentMethod} onChange={setPaymentMethod} className="space-y-4">
                                            {paymentOptions.map((opt) => (
                                                <RadioGroup.Option key={opt.id} value={opt.id}>
                                                    {({ checked }) => (
                                                        <div className={`rounded-2xl border px-5 py-4 transition-all cursor-pointer relative overflow-hidden ${checked ? 'border-gold/60 ring-2 ring-gold/80 bg-gradient-to-br from-gold/10 via-black to-gold/5' : 'border-white/20 hover:border-white/40'}`}>
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className="font-semibold text-white">{opt.name}</p>
                                                                    <p className="text-sm text-white/50">{opt.description}</p>
                                                                </div>
                                                                {checked && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                                    >
                                                                        <CheckCircle className="text-gold" size={20} />
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </RadioGroup.Option>
                                            ))}
                                        </RadioGroup>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 w-full self-start lg:sticky lg:top-28"
                    >
                        <div className="w-full relative rounded-3xl p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
                            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={item.images?.[0]?.url}
                                                alt={item.images?.[0]?.alt}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex flex-col">
                                                <p className="font-semibold text-white leading-tight">{item.name}</p>
                                                <p className="text-sm text-white/50">Qty: {item.quantity}</p>
                                                <p className="sm:hidden font-mono font-semibold text-white mt-1">
                                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="hidden sm:block font-mono font-semibold text-white">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 my-6" />
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-white/70">
                                    <span>Subtotal</span>
                                    <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-white/70">
                                    <span>Shipping</span>
                                    <span className="font-mono">Rp {shippingFee.toLocaleString('id-ID')}</span>
                                </div>
                                <AnimatePresence mode="wait">
                                    {paymentMethod === 'offline' && (
                                        <motion.div
                                            key="admin"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex justify-between text-white/70"
                                        >
                                            <span>Admin Fee</span>
                                            <span className="font-mono">Rp {adminFee.toLocaleString('id-ID')}</span>
                                        </motion.div>
                                    )}
                                    {paymentMethod === 'online' && (
                                        <motion.div
                                            key="discount"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex justify-between text-green-400"
                                        >
                                            <span>Online Discount</span>
                                            <span className="font-mono">-Rp {onlineDiscount.toLocaleString('id-ID')}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="border-t border-white/10 my-6" />
                            <div className="flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span className="font-mono">Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={activeSection !== 'payment' || orderStatus === 'loading'}
                                className="w-full mt-8 py-5 font-bold text-lg bg-white text-black hover:bg-neutral-200 rounded-2xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Lock size={20} className="mr-2" />
                                {orderStatus === 'loading'
                                    ? 'Finalizing Elegance...'
                                    : paymentMethod === 'offline'
                                        ? 'Place Order'
                                        : 'Pay Now'}
                            </Button>
                        </div>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CheckoutPage;