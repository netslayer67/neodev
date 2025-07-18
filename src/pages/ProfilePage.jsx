// Revamped ProfilePage.jsx with premium UI, 3D tilt, glassmorphism, and TailwindCSS best practices

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Star, LogOut, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logout } from '../store/slices/authSlice';
import { fetchMyOrders, cancelOrder } from '../store/slices/orderSlice';
import { PageLoader } from '@/components/PageLoader';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const [activeView, setActiveView] = useState(location.state?.activeView || 'account');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const { user, status: authStatus } = useSelector((state) => state.auth);
    const { myOrders, status: orderStatus } = useSelector((state) => state.orders);

    useEffect(() => {
        if (user) dispatch(fetchMyOrders());
    }, [user, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await dispatch(cancelOrder(orderId)).unwrap();
            toast({ title: 'Order Cancelled', description: `Order #${orderId} has been cancelled.` });
            setSelectedOrder(null);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed', description: error.message });
        }
    };

    const filteredOrders = useMemo(() => myOrders.filter(order =>
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    ), [myOrders, searchQuery]);

    const navItems = [
        { id: 'account', label: 'My Info', icon: User },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'reviews', label: 'My Reviews', icon: Star },
        { id: 'logout', label: 'Logout', icon: LogOut, action: handleLogout },
    ];

    const handleMouseMove = (e) => {
        const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        setTilt({ x: -(y / height) * 10, y: (x / width) * 10 });
    };

    const resetTilt = () => setTilt({ x: 0, y: 0 });

    const Card = ({ children, className = '' }) => (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
            className={`bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl transition-transform duration-300 will-change-transform ${className}`}
        >{children}</div>
    );

    const renderContent = () => {
        if (authStatus === 'loading' || !user) return <PageLoader />;

        switch (activeView) {
            case 'account':
                return (
                    <Card>
                        <h2 className="text-3xl font-bold mb-6">Account Details</h2>
                        <div className="space-y-3 text-lg text-neutral-300">
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                        </div>
                    </Card>
                );
            case 'orders':
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">Order History</h2>
                            <div className="relative w-full max-w-xs">
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search order ID or item..."
                                    className="pl-10 bg-white/5 border border-white/10 placeholder:text-neutral-400"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {orderStatus === 'loading' && <PageLoader />}
                            {orderStatus === 'succeeded' && filteredOrders.length === 0 && <p className="text-neutral-400">No orders found.</p>}
                            {orderStatus === 'succeeded' && filteredOrders.map(order => (
                                <Card key={order.orderId} className="cursor-pointer hover:shadow-2xl" onClick={() => setSelectedOrder(order)}>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm font-mono text-neutral-400">#{order.orderId}</p>
                                            <p className="text-neutral-300 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                            <span className={`text-xs px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-300' :
                                                    order.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' :
                                                        'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black text-white"
        >
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold">Welcome, {user?.name.split(' ')[0]}</h1>
                    <p className="text-neutral-400 text-lg mt-2">Manage your profile, orders, and more.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <aside className="lg:col-span-1 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={item.action || (() => setActiveView(item.id))}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${activeView === item.id ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}
                  ${item.id === 'logout' ? 'text-red-400 hover:bg-red-500/10' : ''}`}
                            >
                                <item.icon size={20} /> <span>{item.label}</span>
                            </button>
                        ))}
                    </aside>
                    <main className="lg:col-span-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            <AnimatePresence>
                {selectedOrder && (
                    <motion.div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)}>
                        <motion.div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black border border-white/20 p-8 rounded-2xl text-white shadow-2xl"
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} transition={{ duration: 0.3 }}>
                            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-white/40 hover:text-red-500">
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-bold mb-1">Order #{selectedOrder.orderId}</h3>
                            <p className="text-neutral-400 text-sm mb-4">Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.product} className="flex justify-between text-sm">
                                        <span>{item.name} (x{item.quantity})</span>
                                        <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t border-white/10 pt-4 text-sm">
                                <div className="flex justify-between"><span>Status:</span><span className="font-semibold">{selectedOrder.status}</span></div>
                                <div className="flex justify-between mt-2"><span>Total:</span><span className="font-semibold">Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}</span></div>
                            </div>
                            {selectedOrder.status === 'Pending Payment' && (
                                <Button onClick={() => handleCancelOrder(selectedOrder.orderId)} variant="destructive" className="w-full mt-6">
                                    Cancel Order
                                </Button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProfilePage;