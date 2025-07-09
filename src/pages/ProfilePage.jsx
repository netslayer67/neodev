import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, Star, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming you have a ShadCN/UI input

// --- MOCK DATA ---
const orders = [
    { id: 'ORD-001', date: '2025-07-01', total: 120.0, status: 'Shipped', items: 3, tracking: 'ID102938' },
    { id: 'ORD-002', date: '2025-06-15', total: 45.5, status: 'Delivered', items: 1, tracking: 'ID847362' },
    { id: 'ORD-003', date: '2025-05-28', total: 250.75, status: 'Delivered', items: 5, tracking: 'ID958271' },
    { id: 'ORD-004', date: '2025-05-10', total: 89.99, status: 'Cancelled', items: 2, tracking: 'ID736452' },
];

const reviews = [
    { product: 'Premium Hoodie', rating: 5, comment: 'Super comfy and premium! The fabric feels incredibly soft and the fit is perfect.' },
    { product: 'Capsule Tee', rating: 4, comment: 'Nice fabric, would buy again. Great for everyday wear.' },
];

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    },
};

const StarRating = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(null);

    return (
        <div className="flex gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    whileHover={{ scale: 1.2, y: -2 }}
                    className={`cursor-pointer transition-colors duration-200 ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-neutral-700'
                        }`}
                >
                    ★
                </motion.span>
            ))}
        </div>
    );
};


const ProfilePage = () => {
    const [activeView, setActiveView] = useState('account');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newReviewRating, setNewReviewRating] = useState(0);

    const navItems = [
        { id: 'account', label: 'My Info', icon: User },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'reviews', label: 'My Reviews', icon: Star },
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'account':
                return (
                    <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                        <h2 className="text-3xl font-bold mb-6">Account Details</h2>
                        <div className="space-y-4 text-lg">
                            <div className="flex items-center"><strong className="w-24">Name:</strong> <span className="text-neutral-300">John Doe</span></div>
                            <div className="flex items-center"><strong className="w-24">Email:</strong> <span className="text-neutral-300">johndoe@email.com</span></div>
                            <div className="flex items-center"><strong className="w-24">Joined:</strong> <span className="text-neutral-300">January 2024</span></div>
                        </div>
                        <Button variant="outline" className="mt-8 bg-transparent border-white/40 hover:bg-white hover:text-black transition-colors duration-300">
                            Edit Profile
                        </Button>
                    </motion.div>
                );
            case 'orders':
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">Order History</h2>
                            <div className="relative w-full max-w-xs">
                                <Input placeholder="Search by Order ID..." className="bg-white/5 border-white/20 pl-10 placeholder:text-neutral-400" />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl flex justify-between items-center transition-all cursor-pointer"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex gap-6 items-center">
                                        <div className="text-neutral-400 text-sm">{order.id}</div>
                                        <div className="text-neutral-300 text-sm">{order.date}</div>
                                        <div>
                                            <span className={`px-3 py-1 text-xs rounded-full ${order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300' :
                                                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-300' :
                                                        'bg-red-500/20 text-red-300'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Note for infinite scroll: Add a loading spinner here and an IntersectionObserver to trigger fetching more orders */}
                    </motion.div>
                );
            case 'reviews':
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <h2 className="text-3xl font-bold mb-6">Your Reviews</h2>
                        <div className="grid md:grid-cols-2 gap-6 mb-10">
                            {reviews.map((review, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-3"
                                >
                                    <h3 className="text-xl font-semibold">{review.product}</h3>
                                    <p className="text-yellow-400 text-xl">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                                    <p className="text-neutral-300 pt-2 text-sm leading-relaxed">"{review.comment}"</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div variants={itemVariants} className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl">
                            <h4 className="text-2xl font-semibold mb-6">Write a New Review</h4>
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="productName" className="block text-sm font-medium text-neutral-300">Product Name</label>
                                    <Input id="productName" type="text" placeholder="e.g. Premium Hoodie" className="w-full bg-white/10 border-white/20" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="reviewText" className="block text-sm font-medium text-neutral-300">Your Review</label>
                                    <textarea id="reviewText" rows="4" placeholder="What did you think?" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition duration-300 resize-none"></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-neutral-300">Rating</label>
                                    <StarRating rating={newReviewRating} setRating={setNewReviewRating} />
                                </div>
                                <div className="pt-4">
                                    <Button type="submit" className="w-full bg-white text-black font-bold py-3 text-base rounded-lg transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-100">
                                        Submit Review
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                );
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
                    <h1 className="text-5xl font-bold tracking-tight">My Dashboard</h1>
                    <p className="text-neutral-400 mt-2 text-lg">Manage your account, track orders, and leave reviews.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* --- Sidebar Navigation --- */}
                    <aside className="md:w-1/4 lg:w-1/5">
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveView(item.id)}
                                    className={`w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${activeView === item.id
                                            ? 'bg-white/10 text-white font-semibold'
                                            : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* --- Main Content --- */}
                    <main className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* --- Order Details Modal --- */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-white/20 p-8 rounded-2xl w-full max-w-lg text-white shadow-2xl"
                        >
                            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-white/50 hover:text-red-500 transition-colors duration-200">
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-bold mb-1">Order #{selectedOrder.id}</h3>
                            <p className="text-neutral-400 text-sm mb-6">Tracking ID: {selectedOrder.tracking}</p>

                            <div className="space-y-3 text-base">
                                <p><strong className="text-neutral-400 w-24 inline-block">Status:</strong> {selectedOrder.status}</p>
                                <p><strong className="text-neutral-400 w-24 inline-block">Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                                <p><strong className="text-neutral-400 w-24 inline-block">Items:</strong> {selectedOrder.items}</p>
                            </div>

                            <Button className="w-full mt-8 bg-white text-black font-bold py-3 text-base rounded-lg transition-all duration-300 hover:bg-neutral-200">
                                Track Full Shipment
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProfilePage;