import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Star, LogOut, X, Search, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logout } from '../store/slices/authSlice';
import { fetchMyOrders, cancelOrder } from '../store/slices/orderSlice';
import PageLoader from '@/components/PageLoader';
import Review from '@/components/Review';
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
    const [showCancelSuccess, setShowCancelSuccess] = useState(false);
    const { user, status: authStatus } = useSelector((state) => state.auth);
    const { myOrders, status: orderStatus } = useSelector((state) => state.orders);
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', email: '' });

    useEffect(() => {
        if (user) setProfileData({ name: user.name, email: user.email });
    }, [user]);

    useEffect(() => {
        if (user) dispatch(fetchMyOrders());
    }, [user, dispatch]);

    useEffect(() => {
        document.body.style.overflow = selectedOrder ? 'hidden' : '';
    }, [selectedOrder]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleCancelOrder = async () => {
        try {
            await dispatch(cancelOrder(selectedOrder.orderId)).unwrap();
            toast({ title: 'Order Cancelled', description: `Order #${selectedOrder.orderId} has been cancelled.` });
            setSelectedOrder(null);
            setShowCancelSuccess(true);
            setTimeout(() => setShowCancelSuccess(false), 2000);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed', description: error.message || 'Something went wrong.' });
        }
    };

    const filteredOrders = useMemo(() =>
        myOrders.filter(order =>
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
        ), [myOrders, searchQuery]
    );

    const navItems = [
        { id: 'account', label: 'My Info', icon: User },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'reviews', label: 'My Reviews', icon: Star },
        { id: 'logout', label: 'Logout', icon: LogOut, action: handleLogout },
    ];

    const Card = ({ children, className = '', onClick }) => (
        <div
            onClick={onClick}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl transition-transform duration-300 ${className}`}
        >
            {children}
        </div>
    );

    const renderContent = () => {
        if (authStatus === 'loading' || !user) return <PageLoader />;

        switch (activeView) {
            case 'account':
                return (
                    <Card>
                        <h2 className="text-3xl font-serif font-semibold mb-6">Account Details</h2>
                        <div className="space-y-3 text-lg text-white/80">
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                        </div>
                    </Card>
                );

            case 'orders':
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-3xl font-serif font-semibold">Order History</h2>
                            <div className="relative w-full max-w-xs">
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search order ID or item..."
                                    className="pl-10 bg-white/5 border border-white/10 placeholder:text-white/40 text-white"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {orderStatus === 'loading' && <PageLoader />}
                            {orderStatus === 'succeeded' && filteredOrders.length === 0 && <p className="text-white/50">No orders found.</p>}
                            {orderStatus === 'succeeded' && filteredOrders.map(order => (
                                <Card
                                    key={order.orderId}
                                    className="cursor-pointer hover:shadow-2xl"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-mono text-white/50">#{order.orderId}</p>
                                            <p className="text-white/70 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gold-400">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                            <span className={`text-xs px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-300' : order.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{order.status}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'reviews':
                return (
                    <Review
                        products={myOrders.flatMap(order => order.items.map(item => item.productData || item))}
                        onSubmit={(review) => console.log('Review submitted:', review)}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-10 text-white font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-serif font-semibold">Welcome, {user?.name?.split?.(' ')[0] || 'User'}</h1>
                    <p className="text-white/60 text-lg mt-2">Manage your profile, orders, and more.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <aside className="lg:col-span-1 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={item.action || (() => setActiveView(item.id))}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeView === item.id ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'} ${item.id === 'logout' ? 'text-red-400 hover:bg-red-500/10' : ''}`}
                            >
                                <item.icon size={20} /> <span>{item.label}</span>
                            </button>
                        ))}
                    </aside>
                    <main className="lg:col-span-4">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilePage;
