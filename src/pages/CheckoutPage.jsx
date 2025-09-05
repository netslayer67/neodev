import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@headlessui/react';
import { CheckCircle, Lock, HelpCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { createOrder, clearOrderState } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

// Animasi
const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const FormField = ({ id, label, tooltip, ...props }) => (
    <motion.div variants={fadeIn} className="space-y-2 relative group">
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
            className="bg-white/5 border border-white/10 focus:border-[#8A5CF6] focus:ring-2 focus:ring-[#8A5CF6]/40 text-white transition-all duration-300 rounded-2xl py-4 w-full"
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

    // Kalkulasi harga
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
        { id: 'online', name: `Online Payment (-Rp ${onlineDiscount.toLocaleString('id-ID')})`, desc: 'Virtual Account' },
        { id: 'offline', name: `Cash On Delivery (+Rp ${adminFee.toLocaleString('id-ID')})`, desc: 'Cash' },
    ];

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const orderData = {
            items: cartItems.map((item) => ({
                product: item._id,
                quantity: item.quantity,
                size: item.size,
            })),
            shippingAddress: { ...shippingAddress, fullName: user.name },
            paymentMethod,
            itemsPrice: subtotal,
            shippingPrice: shippingFee,
            totalPrice: total,
        };

        try {
            const result = await dispatch(createOrder(orderData)).unwrap();
            toast({ title: 'Order Placed', description: `#${result.order.orderId} created.` });
            dispatch(clearCart());
            dispatch(clearOrderState());
            navigate('/profile', { state: { activeView: 'orders' } });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed', description: error.message });
        }
    };

    useEffect(() => {
        if (cartItems.length === 0) navigate('/profile', { state: { activeView: 'orders' } });
    }, [cartItems]);

    return (
        <motion.div
            initial="hidden"
            animate="show"
            exit="hidden"
            className="min-h-screen px-4 pt-24 pb-20 sm:px-6 lg:px-10 font-sans"
            style={{
                background: 'linear-gradient(135deg, #0F0F1A 0%, #1E2A47 100%)',
            }}
        >
            <Helmet>
                <title>Checkout</title>
            </Helmet>

            <motion.div
                variants={fadeIn}
                className="max-w-6xl mx-auto"
            >
                <motion.div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
                        Checkout
                    </h1>
                    <p className="text-neutral-400 mt-2">Just a few steps left.</p>
                </motion.div>

                <form
                    onSubmit={handlePlaceOrder}
                    className="flex flex-col lg:grid lg:grid-cols-5 gap-10"
                >
                    {/* Left */}
                    <motion.div layout className="lg:col-span-3 space-y-10">
                        {/* Shipping */}
                        <div className="rounded-3xl p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Shipping</h2>
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
                                        <FormField id="fullName" label="Name" defaultValue={user?.name} readOnly />
                                        <FormField id="email" label="Email" defaultValue={user?.email} readOnly />
                                        <FormField id="street" label="Street" value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} required />
                                        <FormField id="phone" label="Phone" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} required />
                                        <FormField id="city" label="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} required />
                                        <FormField id="postalCode" label="Postal Code" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} required />
                                        <div className="sm:col-span-2 mt-6">
                                            <Button
                                                type="button"
                                                onClick={() => setActiveSection('payment')}
                                                className="w-full py-4 font-bold text-lg bg-[#8A5CF6] text-white hover:bg-[#7a4de0] rounded-2xl"
                                            >
                                                Continue to Payment
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Payment */}
                        <div className="rounded-3xl p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl">
                            <h2 className="text-xl font-semibold text-white mb-6">Payment</h2>
                            <AnimatePresence>
                                {activeSection === 'payment' && (
                                    <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <RadioGroup value={paymentMethod} onChange={setPaymentMethod} className="space-y-4">
                                            {paymentOptions.map((opt) => (
                                                <RadioGroup.Option key={opt.id} value={opt.id}>
                                                    {({ checked }) => (
                                                        <div
                                                            className={`rounded-2xl border px-5 py-4 cursor-pointer transition-all ${checked
                                                                    ? 'border-[#8A5CF6] ring-2 ring-[#8A5CF6]/60 bg-[#1E2A47]/60'
                                                                    : 'border-white/20 hover:border-white/40'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className="font-semibold text-white">{opt.name}</p>
                                                                    <p className="text-sm text-white/50">{opt.desc}</p>
                                                                </div>
                                                                {checked && (
                                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                                        <CheckCircle className="text-[#8A5CF6]" size={20} />
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

                    {/* Right */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 w-full self-start lg:sticky lg:top-24"
                    >
                        <div className="rounded-3xl p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl">
                            <h2 className="text-xl font-semibold text-white mb-6">Summary</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={`${item._id}-${item.size}`}
                                        className="flex items-start justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.images?.[0]?.url}
                                                alt={item.images?.[0]?.alt}
                                                className="w-14 h-14 object-cover rounded-lg"
                                            />
                                            <div>
                                                <p className="font-semibold text-white">{item.name}</p>
                                                <p className="text-xs text-white/50">Size: {item.size}</p>
                                                <p className="text-xs text-white/50">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-mono font-semibold text-white">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 my-6" />

                            <div className="space-y-3 text-sm text-white/70">
                                <div className="flex justify-between"><span>Subtotal</span><span className="font-mono text-white">Rp {subtotal.toLocaleString('id-ID')}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span className="font-mono text-white">Rp {shippingFee.toLocaleString('id-ID')}</span></div>
                                {paymentMethod === 'offline' && (
                                    <div className="flex justify-between"><span>Admin Fee</span><span className="font-mono text-white">Rp {adminFee.toLocaleString('id-ID')}</span></div>
                                )}
                                {paymentMethod === 'online' && (
                                    <div className="flex justify-between text-green-400"><span>Discount</span><span className="font-mono">-Rp {onlineDiscount.toLocaleString('id-ID')}</span></div>
                                )}
                            </div>

                            <div className="border-t border-white/10 my-6" />

                            <div className="flex justify-between font-bold text-lg text-white">
                                <span>Total</span>
                                <span className="font-mono">Rp {total.toLocaleString('id-ID')}</span>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={activeSection !== 'payment' || orderStatus === 'loading'}
                                className="w-full mt-8 py-4 font-bold text-lg bg-[#8A5CF6] text-white hover:bg-[#7a4de0] rounded-2xl transition disabled:opacity-50"
                            >
                                <Lock size={18} className="mr-2" />
                                {orderStatus === 'loading'
                                    ? 'Processing...'
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
