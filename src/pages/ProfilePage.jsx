import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Star, X, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { logout } from '../store/slices/authSlice';
import { fetchMyOrders, cancelOrder } from '../store/slices/orderSlice';
import { PageLoader } from '@/components/PageLoader';

// --- Animation Variants (tetap sama) ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    // Set tab aktif berdasarkan state dari navigasi, atau default ke 'account'
    const [activeView, setActiveView] = useState(location.state?.activeView || 'account');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Mengambil data dari Redux stores
    const { user, status: authStatus } = useSelector((state) => state.auth);
    const { myOrders, status: orderStatus } = useSelector((state) => state.orders);

    // Mengambil data pesanan saat komponen dimuat (jika user sudah login)
    useEffect(() => {
        if (user) {
            dispatch(fetchMyOrders());
        }
    }, [user, dispatch]);

    // Handler untuk Logout
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // Handler untuk membatalkan pesanan
    const handleCancelOrder = async (orderId) => {
        try {
            await dispatch(cancelOrder(orderId)).unwrap();
            toast({ title: "Order Cancelled", description: `Order #${orderId} has been successfully cancelled.` });
            setSelectedOrder(null); // Tutup modal setelah berhasil
        } catch (error) {
            toast({ variant: "destructive", title: "Cancellation Failed", description: error.message || "Could not cancel this order." });
        }
    };

    const navItems = [
        { id: 'account', label: 'My Info', icon: User },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'reviews', label: 'My Reviews', icon: Star },
        { id: 'logout', label: 'Logout', icon: LogOut, action: handleLogout },
    ];

    // Logika untuk filter pencarian (menggunakan useMemo untuk optimasi)
    const filteredOrders = useMemo(() =>
        myOrders.filter(order =>
            order.items.some(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) || order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [myOrders, searchQuery]);


    const renderContent = () => {
        if (authStatus === 'loading' || !user) return <PageLoader />;

        switch (activeView) {
            case 'account':
                return (
                    <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                        <h2 className="text-3xl font-bold mb-6">Account Details</h2>
                        <div className="space-y-4 text-lg">
                            <div className="flex items-center"><strong className="w-24">Name:</strong> <span className="text-neutral-300">{user.name}</span></div>
                            <div className="flex items-center"><strong className="w-24">Email:</strong> <span className="text-neutral-300">{user.email}</span></div>
                            <div className="flex items-center"><strong className="w-24">Joined:</strong> <span className="text-neutral-300">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span></div>
                        </div>
                    </motion.div>
                );
            case 'orders':
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">Order History</h2>
                            <div className="relative w-full max-w-xs">
                                <Input
                                    placeholder="Search by Product or Order ID..."
                                    className="bg-white/5 border-white/20 pl-10 placeholder:text-neutral-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {orderStatus === 'loading' && <PageLoader />}
                            {orderStatus === 'succeeded' && filteredOrders.length === 0 && (
                                <p className="text-neutral-400 text-center py-10">
                                    {searchQuery ? `No orders found for "${searchQuery}".` : "You haven't placed any orders yet."}
                                </p>
                            )}
                            {orderStatus === 'succeeded' && filteredOrders.map((order) => (
                                <motion.div
                                    key={order.orderId}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl flex justify-between items-center transition-all cursor-pointer"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex gap-6 items-center">
                                        <div className="text-neutral-400 text-sm font-mono">{order.orderId}</div>
                                        <div className="text-neutral-300 text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        <div>
                                            <span className={`px-3 py-1 text-xs rounded-full ${order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300' :
                                                order.status === 'Delivered' ? 'bg-green-500/20 text-green-300' :
                                                    order.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' :
                                                        'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                );
            // Case lain seperti 'reviews' bisa ditambahkan di sini
            default: return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="min-h-screen px-4 sm:px-6 lg:px-8 pt-32 pb-20 bg-gradient-to-br from-black via-gray-900 to-black text-white selection:bg-white/30"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-left mb-12">
                    <h1 className="text-5xl font-bold tracking-tight">Welcome, {user ? user.name.split(' ')[0] : 'User'}</h1>
                    <p className="text-neutral-400 mt-2 text-lg">Manage your account, track orders, and leave reviews.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    <aside className="md:w-1/4 lg:w-1/5">
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <button key={item.id} onClick={item.action ? item.action : () => setActiveView(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${activeView === item.id ? 'bg-white/10 text-white font-semibold' : 'text-neutral-400 hover:bg-white/5 hover:text-white'} ${item.id === 'logout' ? 'text-red-400 hover:bg-red-500/10' : ''}`}>
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: 'easeInOut' }}>
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            <AnimatePresence>
                {selectedOrder && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4" onClick={() => setSelectedOrder(null)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ duration: 0.3, ease: 'easeOut' }} onClick={(e) => e.stopPropagation()} className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-white/20 p-8 rounded-2xl w-full max-w-lg text-white shadow-2xl">
                            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-white/50 hover:text-red-500 transition-colors duration-200">
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-bold mb-1">Order #{selectedOrder.orderId}</h3>
                            <p className="text-neutral-400 text-sm mb-6">Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            <div className="space-y-3 text-base">
                                {selectedOrder.items.map(item => (
                                    <div key={item.product} className="flex justify-between items-center text-sm">
                                        <span>{item.name} (x{item.quantity})</span>
                                        <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 my-4"></div>
                            <div className="flex justify-between text-neutral-300"><strong>Status:</strong> <span className='font-bold'>{selectedOrder.status}</span></div>
                            <div className="flex justify-between text-neutral-300 mt-2"><strong>Total:</strong> <span className='font-bold'>Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}</span></div>

                            {selectedOrder.status === 'Pending Payment' && (
                                <Button onClick={() => handleCancelOrder(selectedOrder.orderId)} variant="destructive" className="w-full mt-8" disabled={orderStatus === 'loading'}>
                                    {orderStatus === 'loading' ? 'Cancelling...' : 'Cancel Order'}
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