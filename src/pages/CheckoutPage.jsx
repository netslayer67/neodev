'use client';

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
import { useMidtransSnap } from "@/hooks/useMidtransSnap";


// motion presets
const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const FormField = ({ id, label, tooltip, ...props }) => (
    <motion.div variants={fadeIn} className="space-y-2 relative group">
        <Label htmlFor={id} className="text-sm font-medium text-foreground/80 flex items-center gap-1">
            {label}
            {tooltip && (
                <HelpCircle
                    size={14}
                    className="text-muted-foreground group-hover:text-foreground transition duration-320"
                    title={tooltip}
                />
            )}
        </Label>
        <Input
            id={id}
            {...props}
            className="bg-card/60 border border-border focus:border-accent focus:ring-2 focus:ring-accent/40 text-foreground transition duration-320 rounded-xl py-3 w-full"
        />
    </motion.div>
);

const CheckoutPage = () => {
    const { isLoaded } = useMidtransSnap(); // <- pakai hook
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useSelector((s) => s.auth);
    const { cartItems } = useSelector((s) => s.cart);
    const { status: orderStatus } = useSelector((s) => s.orders);

    const [activeSection, setActiveSection] = useState('shipping');
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: 'Indonesia',
        phone: '',
    });

    // price calc
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = cartItems.length > 0 ? 15000 : 0;
    const adminFee = 2500;
    const onlineDiscount = 3000;
    const total =
        subtotal + shippingFee + (paymentMethod === 'offline' ? adminFee : -onlineDiscount);

    const paymentOptions = [
        { id: 'online', name: `Online Payment (-Rp ${onlineDiscount.toLocaleString('id-ID')})`, desc: 'Virtual Account / E-Wallet' },
        { id: 'offline', name: `Cash On Delivery (+Rp ${adminFee.toLocaleString('id-ID')})`, desc: 'Pay with cash' },
    ];

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        const orderData = {
            items: cartItems.map((i) => ({
                product: i._id,
                quantity: i.quantity,
                size: i.size
            })),
            shippingAddress: { ...shippingAddress, fullName: user.name },
            paymentMethod,
            itemsPrice: subtotal,
            shippingPrice: shippingFee,
            totalPrice: total,
        };

        try {
            const result = await dispatch(createOrder(orderData)).unwrap();

            if (paymentMethod === "online") {
                if (isLoaded && window.snap && result.midtransSnapToken) {
                    window.snap.pay(result.midtransSnapToken, {
                        onSuccess: () => {
                            toast({ title: "Payment Success 🎉", description: `#${result.order.orderId}` });
                            dispatch(clearCart());
                            dispatch(clearOrderState());
                            navigate("/profile", { state: { activeView: "orders" } });
                        },
                        onPending: () => {
                            toast({ title: "Payment Pending ⏳", description: `#${result.order.orderId}` });
                            navigate("/profile", { state: { activeView: "orders" } });
                        },
                        onError: (err) => {
                            toast({ variant: "destructive", title: "Payment Failed", description: err.message });
                        },
                        onClose: () => {
                            toast({ title: "Payment Cancelled", description: "You closed the payment popup." });
                        },
                    });
                } else {
                    toast({ variant: "destructive", title: "Snap not loaded", description: "Midtrans Snap.js not ready" });
                }
            } else {
                toast({ title: "Order Confirmed 🎉", description: `#${result.order.orderId}` });
                dispatch(clearCart());
                dispatch(clearOrderState());
                navigate("/profile", { state: { activeView: "orders" } });
            }
        } catch (err) {
            toast({ variant: "destructive", title: "Failed", description: err.message });
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
            className="relative min-h-screen px-4 pt-24 pb-20 sm:px-6 lg:px-10 font-sans text-foreground"
        >
            <Helmet><title>Checkout</title></Helmet>

            {/* Blobs */}
            <motion.div

                className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl"
            />
            <motion.div

                className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
            />

            <motion.div variants={fadeIn} className="relative z-10 max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold">Checkout</h1>
                    <p className="mt-2 text-muted-foreground">Almost there. Secure your order.</p>
                </div>

                <form onSubmit={handlePlaceOrder} className="flex flex-col lg:grid lg:grid-cols-5 gap-8">
                    {/* LEFT */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Shipping */}
                        <div className="glass-card p-5 sm:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold">Shipping</h2>
                                {activeSection !== 'shipping' && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection('shipping')}
                                        className="text-xs text-muted-foreground hover:text-foreground transition duration-320"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {activeSection === 'shipping' ? (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField id="fullName" label="Name" defaultValue={user?.name} readOnly />
                                    <FormField id="email" label="Email" defaultValue={user?.email} readOnly />
                                    <FormField id="street" label="Street" value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} required />
                                    <FormField id="phone" label="Phone" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} required />
                                    <FormField id="city" label="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} required />
                                    <FormField id="postalCode" label="Postal Code" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} required />
                                    <div className="sm:col-span-2 mt-4">
                                        <Button
                                            type="button"
                                            onClick={() => setActiveSection('payment')}
                                            className="w-full rounded-full font-bold btn-primary py-3"
                                        >
                                            Continue to Payment
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>{user?.name} — {user?.email}</p>
                                    <p>{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.postalCode}</p>
                                    <p>{shippingAddress.phone}</p>
                                </div>
                            )}
                        </div>

                        {/* Payment */}
                        <div className="glass-card p-5 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">Payment</h2>
                            {activeSection === 'payment' && (
                                <RadioGroup value={paymentMethod} onChange={setPaymentMethod} className="space-y-3">
                                    {paymentOptions.map((opt) => (
                                        <RadioGroup.Option key={opt.id} value={opt.id}>
                                            {({ checked }) => (
                                                <div
                                                    className={`rounded-xl border px-5 py-4 transition duration-320 cursor-pointer ${checked ? 'border-accent ring-2 ring-accent/50 bg-card' : 'border-border hover:border-foreground/40'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold">{opt.name}</p>
                                                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                                        </div>
                                                        {checked && <CheckCircle className="text-accent" size={20} />}
                                                    </div>
                                                </div>
                                            )}
                                        </RadioGroup.Option>
                                    ))}
                                </RadioGroup>
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
                        <div className="glass-card p-5 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">Summary</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={`${item._id}-${item.size}`} className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <img src={item.images?.[0]?.url} alt={item.name} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg" />
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">Size {item.size} · Qty {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-mono font-semibold">{`Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border my-5" />

                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex justify-between"><span>Subtotal</span><span className="font-mono text-foreground">{`Rp ${subtotal.toLocaleString('id-ID')}`}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span className="font-mono text-foreground">{`Rp ${shippingFee.toLocaleString('id-ID')}`}</span></div>
                                {paymentMethod === 'offline' && (
                                    <div className="flex justify-between"><span>Admin Fee</span><span className="font-mono text-foreground">{`Rp ${adminFee.toLocaleString('id-ID')}`}</span></div>
                                )}
                                {paymentMethod === 'online' && (
                                    <div className="flex justify-between text-success"><span>Discount</span><span className="font-mono">-Rp {onlineDiscount.toLocaleString('id-ID')}</span></div>
                                )}
                            </div>

                            <div className="border-t border-border my-5" />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="font-mono text-accent">{`Rp ${total.toLocaleString('id-ID')}`}</span>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={activeSection !== 'payment' || orderStatus === 'loading'}
                                className="w-full mt-6 rounded-full font-bold btn-primary py-3 disabled:opacity-50"
                            >
                                <Lock size={18} className="mr-2" />
                                {orderStatus === 'loading' ? 'Processing...' : paymentMethod === 'offline' ? 'Place Order' : 'Pay Now'}
                            </Button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CheckoutPage;
