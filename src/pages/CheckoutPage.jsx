import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/motion';
import { RadioGroup } from '@headlessui/react';
import { CheckCircle, Lock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { createOrder, clearOrderState } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

// Helper Component untuk Input Fields
const FormField = ({ id, label, ...props }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium text-neutral-400">{label}</Label>
        <Input id={id} {...props} className="bg-white/5 border-neutral-700 focus:border-white focus:bg-white/10 transition-colors duration-300 rounded-lg py-5" />
    </div>
);

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Mengambil data dari Redux
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
        phone: ''
    });

    const handleAddressChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.id]: e.target.value });
    };

    // Kalkulasi harga
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = cartItems.length > 0 ? 15000 : 0;
    const adminFee = 2500;
    const onlineDiscount = 3000;
    const total = subtotal + shippingFee + (paymentMethod === 'offline' ? adminFee : -onlineDiscount);

    const paymentOptions = [
        { id: 'online', name: `Online Payment (Discount Rp ${onlineDiscount.toLocaleString('id-ID')})`, description: 'Credit Card, Debit, or Digital Wallets' },
        { id: 'offline', name: `Manual Transfer / COD (+Rp ${adminFee.toLocaleString('id-ID')} Fee)`, description: 'Bank Transfer or Cash on Delivery' }
    ];

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        const orderData = {
            items: cartItems.map(item => ({ product: item._id, quantity: item.quantity })),
            shippingAddress: { ...shippingAddress, fullName: user.name },
            paymentMethod,
            itemsPrice: subtotal,
            shippingPrice: shippingFee,
            totalPrice: total,
        };

        try {
            const resultAction = await dispatch(createOrder(orderData)).unwrap();

            toast({
                title: "Order Placed!",
                description: `Your order #${resultAction.orderId} has been successfully created.`
            });

            dispatch(clearCart());
            dispatch(clearOrderState());

            // --- PERUBAHAN UTAMA DI SINI ---
            // Arahkan ke /profile dan kirim state untuk mengaktifkan tab 'orders'
            navigate('/profile', { state: { activeView: 'orders' } });

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Order Failed",
                description: error.message || "Something went wrong."
            });
        }
    };

    if (cartItems.length === 0) {
        navigate('/profile', { state: { activeView: 'orders' } });
        return null;
    }

    return (
        <motion.div
            initial="initial" animate="animate" exit="exit" variants={pageTransition}
            className="min-h-screen px-4 sm:px-6 lg:px-8 pt-32 pb-24 bg-gradient-to-br from-black via-gray-800 to-black text-white"
        >
            <Helmet>
                <title>Secure Checkout - Neo Dervish</title>
            </Helmet>

            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="container mx-auto max-w-7xl">
                <motion.div variants={fadeIn('down', 'tween', 0.2, 0.8)} className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-medium tracking-tight font-heading">Secure Checkout</h1>
                    <p className="text-neutral-400 mt-4 text-lg">Complete your purchase in just a few steps.</p>
                </motion.div>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-x-16 gap-y-12">
                    {/* Kolom Kiri */}
                    <motion.div layout className="lg:col-span-3 space-y-8">
                        {/* Shipping Info */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-medium tracking-tight text-white">Shipping Information</h2>
                                {activeSection !== 'shipping' && (
                                    <button type="button" onClick={() => setActiveSection('shipping')} className="text-sm text-neutral-300 hover:text-white transition">Edit</button>
                                )}
                            </div>
                            <AnimatePresence>
                                {activeSection === 'shipping' && (
                                    <motion.div key="shipping-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.5, type: 'spring' }} className="overflow-hidden">
                                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                            <FormField id="fullName" label="Full Name" placeholder="John Doe" defaultValue={user?.name || ''} readOnly />
                                            <FormField id="email" label="Email" placeholder="you@example.com" defaultValue={user?.email || ''} readOnly />
                                            <div className="sm:col-span-2">
                                                <FormField id="street" label="Address" placeholder="123 Fearless St, Apt 4B" value={shippingAddress.street} onChange={handleAddressChange} required />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <FormField id="phone" label="Phone" placeholder="08123456789" value={shippingAddress.phone} onChange={handleAddressChange} required />
                                            </div>
                                            <FormField id="city" label="City" placeholder="New York" value={shippingAddress.city} onChange={handleAddressChange} required />
                                            <FormField id="postalCode" label="ZIP Code" placeholder="10001" value={shippingAddress.postalCode} onChange={handleAddressChange} required />
                                        </div>
                                        <Button type="button" size="lg" onClick={() => setActiveSection('payment')} className="w-full font-bold rounded-lg py-6">Continue to Payment</Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* Payment Method */}
                        <div className={`bg-white/5 border rounded-2xl p-8 backdrop-blur-md transition-colors ${activeSection === 'payment' ? 'border-white/20' : 'border-white/10'}`}>
                            <h2 className={`text-2xl font-medium tracking-tight mb-6 transition-colors ${activeSection === 'payment' ? 'text-white' : 'text-neutral-500'}`}>Payment Method</h2>
                            <AnimatePresence>
                                {activeSection === 'payment' && (
                                    <motion.div key="payment-form" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }} className="space-y-6">
                                        <RadioGroup value={paymentMethod} onChange={setPaymentMethod} className="space-y-4 relative">
                                            {paymentOptions.map((option) => (
                                                <RadioGroup.Option key={option.id} value={option.id}>
                                                    {({ checked }) => (
                                                        <div className={`relative p-5 rounded-lg border cursor-pointer transition-all duration-300 ${checked ? 'bg-white/10 border-white ring-2 ring-white' : 'border-neutral-700 hover:border-neutral-400'}`}>
                                                            <span className="font-medium">{option.name}</span>
                                                            <p className="text-sm text-neutral-400 mt-1">{option.description}</p>
                                                            {checked && <motion.div layoutId="radio-check" className="absolute top-4 right-4 text-white"><CheckCircle /></motion.div>}
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

                    {/* Kolom Kanan */}
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: 'spring' }} className="lg:col-span-2 self-start sticky top-28">
                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                            <h2 className="text-2xl font-medium tracking-tight text-white mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <img className="w-16 h-16 object-cover rounded-lg" src={item.images?.[0]} alt={item.name} />
                                            <div>
                                                <p className="font-semibold text-white">{item.name}</p>
                                                <p className="text-sm text-neutral-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold font-mono text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 my-6" />
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-neutral-300"><span>Subtotal</span><span className="font-mono text-white">Rp {subtotal.toLocaleString('id-ID')}</span></div>
                                <div className="flex justify-between text-neutral-300"><span>Shipping</span><span className="font-mono text-white">Rp {shippingFee.toLocaleString('id-ID')}</span></div>
                                <AnimatePresence mode="wait">
                                    {paymentMethod === 'offline' && (
                                        <motion.div key="admin-fee" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-between text-neutral-300">
                                            <span>Admin Fee</span><span className="font-mono text-white">Rp {adminFee.toLocaleString('id-ID')}</span>
                                        </motion.div>
                                    )}
                                    {paymentMethod === 'online' && (
                                        <motion.div key="online-discount" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-between text-green-400">
                                            <span className="font-medium">Online Payment Discount</span><span className="font-mono">-Rp {onlineDiscount.toLocaleString('id-ID')}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="border-t border-white/10 my-6" />
                            <div className="flex justify-between text-white text-xl font-bold">
                                <span>Total</span><span className="font-mono">Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                            <Button type="submit" size="lg" disabled={activeSection !== 'payment' || orderStatus === 'loading'} className="w-full mt-8 bg-white text-black hover:bg-neutral-200 rounded-lg font-bold text-lg py-6 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed group">
                                <Lock className="mr-2 h-5 w-5" />
                                {orderStatus === 'loading' ? 'Processing...' : (paymentMethod === 'offline' ? 'Place Order' : 'Pay Now')}
                            </Button>
                        </div>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CheckoutPage;