import React, { useState, useEffect, useMemo, useCallback, memo, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    User,
    ShoppingBag,
    Star,
    LogOut,
    X,
    Search,
    CheckCircle,
    ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logout } from "../store/slices/authSlice";
import { fetchMyOrders, cancelOrder } from "../store/slices/orderSlice";
import PageLoader from "@/components/PageLoader";
import { useToast } from "@/components/ui/use-toast";

// Lazy load komponen berat
const Review = lazy(() => import("@/components/Review"));

// Utility functions
const sanitizeInput = (val = "") =>
    String(val).slice(0, 80).replace(/(<([^>]+)>)/gi, "").replace(/https?:\/\/[^"]+/gi, "").trim();

// Custom hook untuk debounced search
const useDebounced = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

// Memoized OrderRow component
const OrderRow = memo(({ order, onClick, reduceMotion }) => {
    const statusColor = useMemo(() => {
        switch (order.status) {
            case "Delivered": return "bg-success/20 text-success";
            case "Cancelled": return "bg-error/20 text-error";
            default: return "bg-warning/20 text-warning";
        }
    }, [order.status]);

    const formattedDate = useMemo(() =>
        new Date(order.createdAt).toLocaleDateString('id-ID'), [order.createdAt]);

    const formattedPrice = useMemo(() =>
        order.totalAmount.toLocaleString('id-ID'), [order.totalAmount]);

    const itemsText = useMemo(() => {
        const firstItem = order.items?.[0]?.name || '';
        const additionalCount = order.items?.length > 1 ? ` +${order.items.length - 1} lainnya` : '';
        return firstItem + additionalCount;
    }, [order.items]);

    const handleClick = useCallback(() => onClick(order), [order, onClick]);

    const MotionButton = reduceMotion ? 'button' : motion.button;
    const motionProps = reduceMotion ? {} : {
        whileHover: { scale: 1.01 },
        transition: { duration: 0.2 }
    };

    return (
        <MotionButton
            {...motionProps}
            onClick={handleClick}
            className="w-full text-left p-4 rounded-2xl glass-card flex items-center justify-between gap-4 will-change-transform"
        >
            <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="min-w-0">
                    <p className="text-sm font-mono text-muted-foreground truncate">
                        #{order.orderId}
                    </p>
                    <p className="text-sm text-foreground truncate">
                        {itemsText}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formattedDate}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
                <p className="font-bold text-secondary">
                    Rp {formattedPrice}
                </p>
                <span className={`text-[0.563rem] px-3 py-1 rounded-full mt-2 whitespace-nowrap ${statusColor}`}>
                    {order.status}
                </span>
            </div>
        </MotionButton>
    );
});

OrderRow.displayName = 'OrderRow';

// Memoized NavButton component
const NavButton = memo(({ icon: Icon, label, isActive, onClick, className = "" }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-2 flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-foreground' : 'text-muted-foreground'
            } ${className}`}
    >
        <Icon size={18} />
        <span className="text-xs">{label}</span>
    </button>
));

NavButton.displayName = 'NavButton';

// Memoized UserProfile component
const UserProfile = memo(({ user }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
    >
        <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-card/80 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <User size={28} />
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-lg truncate">{user?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Bergabung {new Date(user?.createdAt).toLocaleDateString('id-ID')}
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
));

UserProfile.displayName = 'UserProfile';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const shouldReduceMotion = useReducedMotion();

    // Debug logging
    console.log('ProfilePage location state:', location.state);
    console.log('ProfilePage activeView from state:', location.state?.activeView);

    // State management
    const [activeView, setActiveView] = useState(location.state?.activeView || "orders");
    console.log('ProfilePage initial activeView:', activeView);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCancelSuccess, setShowCancelSuccess] = useState(false);

    // Debounced search untuk mengurangi re-render
    const debouncedSearch = useDebounced(searchQuery, 300);

    // Redux selectors dengan shallow comparison
    const { user, status: authStatus } = useSelector((state) => state.auth || {});
    const { myOrders = [], status: orderStatus } = useSelector((state) => state.orders || {});

    // Effects
    useEffect(() => {
        if (user && orderStatus === 'idle') {
            dispatch(fetchMyOrders());
        }
    }, [user, dispatch, orderStatus]);

    // Update activeView when location state changes
    useEffect(() => {
        if (location.state?.activeView) {
            setActiveView(location.state.activeView);
        }
    }, [location.state]);

    useEffect(() => {
        document.body.style.overflow = selectedOrder ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [selectedOrder]);

    // Memoized callbacks
    const handleLogout = useCallback(() => {
        dispatch(logout());
        navigate("/");
    }, [dispatch, navigate]);

    const handleOrderSelect = useCallback((order) => {
        setSelectedOrder(order);
    }, []);

    const handleCancelOrder = useCallback(async () => {
        if (!selectedOrder) return;

        console.log('Cancelling order:', selectedOrder.orderId, 'for user:', user?._id);

        try {
            await dispatch(cancelOrder(selectedOrder.orderId)).unwrap();
            toast({
                title: "Pesanan Dibatalkan",
                description: `Pesanan #${selectedOrder.orderId} berhasil dibatalkan.`
            });
            setSelectedOrder(null);
            setShowCancelSuccess(true);
            setTimeout(() => setShowCancelSuccess(false), 2000);
        } catch (err) {
            console.error('Cancel order error:', err);
            toast({
                variant: "destructive",
                title: "Gagal Membatalkan Pesanan",
                description: err.message || "Terjadi kesalahan saat membatalkan pesanan."
            });
        }
    }, [dispatch, selectedOrder, toast, user]);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleModalClose = useCallback(() => {
        setSelectedOrder(null);
    }, []);

    const handleViewChange = useCallback((view) => {
        setActiveView(view);
    }, []);

    // Memoized filtered orders dengan optimasi - sorted by newest first
    const filteredOrders = useMemo(() => {
        if (!Array.isArray(myOrders)) return [];

        // Sort by createdAt descending (newest first), then filter out cancelled orders
        const sortedOrders = [...myOrders].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        const activeOrders = sortedOrders.filter(order => order.status !== "Cancelled");

        if (!debouncedSearch) return activeOrders;

        const query = sanitizeInput(debouncedSearch).toLowerCase();
        return activeOrders.filter(order => {
            return order.orderId.toLowerCase().includes(query) ||
                order.items?.some(item =>
                    (item.name || "").toLowerCase().includes(query)
                );
        });
    }, [myOrders, debouncedSearch]);

    // Memoized user first name
    const userFirstName = useMemo(() =>
        user?.name?.split?.(' ')[0] || 'User', [user?.name]);

    // Animation variants dengan reduced motion support
    const containerVariants = useMemo(() => ({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: shouldReduceMotion ? 0.1 : 0.3 }
    }), [shouldReduceMotion]);

    const modalVariants = useMemo(() => ({
        initial: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
        transition: { duration: shouldReduceMotion ? 0.1 : 0.32 }
    }), [shouldReduceMotion]);

    return (
        <motion.div
            className="relative min-h-screen pt-20 pb-24 px-4 text-foreground font-sans"
            {...containerVariants}
        >
            {/* Background blobs - hanya render jika tidak reduce motion */}
            {!shouldReduceMotion && (
                <>
                    <div className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl will-change-transform" />
                    <div className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl will-change-transform" />
                </>
            )}

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-heading font-bold truncate">
                            Halo, {userFirstName} 👋
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola akun & pesanan Anda
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="rounded-lg border border-border"
                            aria-label="Kembali"
                        >
                            <ChevronLeft size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="rounded-lg border border-border"
                            aria-label="Keluar"
                        >
                            <LogOut size={18} />
                        </Button>
                    </div>
                </header>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Cari pesanan atau produk..."
                            className="pl-10 bg-card/60 border border-border rounded-xl focus:ring-2 focus:ring-accent/30 transition-all duration-200"
                            aria-label="Pencarian pesanan"
                        />
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            size={18}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {activeView === 'account' && <UserProfile user={user} />}

                    {activeView === 'orders' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
                            className="space-y-4"
                        >
                            {orderStatus === 'loading' && <PageLoader />}

                            <div className="flex flex-col gap-3">
                                {orderStatus === 'succeeded' && filteredOrders.length === 0 && (
                                    <div className="glass-card p-6 text-center text-muted-foreground">
                                        {debouncedSearch ? 'Tidak ada pesanan yang cocok.' : 'Belum ada pesanan.'}
                                    </div>
                                )}

                                {orderStatus === 'succeeded' && filteredOrders.map((order) => (
                                    <OrderRow
                                        key={order.orderId}
                                        order={order}
                                        onClick={handleOrderSelect}
                                        reduceMotion={shouldReduceMotion}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'reviews' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
                        >
                            <Suspense fallback={<PageLoader />}>
                                <Review
                                    products={myOrders.flatMap(order =>
                                        order.items.map(item => item.productData || item)
                                    )}
                                    onSubmit={(review) => console.log('Review:', review)}
                                />
                            </Suspense>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Bottom Navigation - Mobile */}
            <nav className="fixed left-1/2 -translate-x-1/2 bottom-4 z-40 w-[94%] max-w-3xl flex items-center justify-between glass-card px-3 py-2 rounded-3xl shadow-xl md:hidden">
                <NavButton
                    icon={User}
                    label="Info"
                    isActive={activeView === 'account'}
                    onClick={() => handleViewChange('account')}
                />
                <NavButton
                    icon={ShoppingBag}
                    label="Pesanan"
                    isActive={activeView === 'orders'}
                    onClick={() => handleViewChange('orders')}
                />
                <NavButton
                    icon={Star}
                    label="Review"
                    isActive={activeView === 'reviews'}
                    onClick={() => handleViewChange('reviews')}
                />
                <button
                    onClick={handleLogout}
                    className="py-2 px-3 rounded-xl text-error transition-colors duration-200 hover:bg-error/10"
                    aria-label="Keluar"
                >
                    <LogOut size={18} />
                </button>
            </nav>

            {/* Enhanced Order Detail Modal */}
            <AnimatePresence mode="wait">
                {selectedOrder && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-overlay backdrop-blur-glass flex justify-center items-center p-4"
                        {...modalVariants}
                        onClick={handleModalClose}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl glass-card p-6 rounded-3xl will-change-transform max-h-[90vh] overflow-y-auto scrollbar-hide"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xl font-heading font-bold truncate">
                                        Pesanan #{selectedOrder.orderId}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(selectedOrder.createdAt).toLocaleString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={handleModalClose}
                                    className="text-muted-foreground hover:text-foreground transition-colors p-2 flex-shrink-0"
                                    aria-label="Tutup"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Status & Payment Method */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div className="glass-card p-4">
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Status Pesanan</h4>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${selectedOrder.status === 'Telah Sampai' ? 'bg-success/20 text-success' :
                                            selectedOrder.status === 'Dikirim' ? 'bg-info/20 text-info' :
                                                selectedOrder.status === 'Diproses' ? 'bg-warning/20 text-warning' :
                                                    selectedOrder.status === 'Pending Payment' ? 'bg-error/20 text-error' :
                                                        'bg-muted/20 text-muted-foreground'
                                        }`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div className="glass-card p-4">
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Metode Pembayaran</h4>
                                    <span className="text-sm font-medium">
                                        {selectedOrder.paymentMethod === 'va' ? 'Virtual Account' : 'Cash On Delivery'}
                                    </span>
                                    {selectedOrder.transactionId && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            TXN: {selectedOrder.transactionId}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Items */}
                            <div className="glass-card p-4 mb-6">
                                <h4 className="font-semibold text-sm text-muted-foreground mb-3">Detail Produk</h4>
                                <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={`${item.product}-${index}`} className="flex justify-between items-start gap-4 py-2 border-b border-border/50 last:border-b-0">
                                            <div className="min-w-0 flex-1">
                                                <span className="font-medium text-sm block truncate">
                                                    {item.name}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">
                                                        Size {item.size}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">×</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.quantity} pcs
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="font-mono text-sm">
                                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    @ Rp {item.price.toLocaleString('id-ID')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="glass-card p-4 mb-6">
                                <h4 className="font-semibold text-sm text-muted-foreground mb-3">Rincian Pembayaran</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal Produk</span>
                                        <span className="font-mono">Rp {selectedOrder.itemsPrice?.toLocaleString('id-ID') || selectedOrder.totalAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                    {selectedOrder.shippingPrice > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>Biaya Pengiriman</span>
                                            <span className="font-mono">Rp {selectedOrder.shippingPrice.toLocaleString('id-ID')}</span>
                                        </div>
                                    )}
                                    {selectedOrder.adminFee > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>Biaya Admin COD</span>
                                            <span className="font-mono">Rp {selectedOrder.adminFee.toLocaleString('id-ID')}</span>
                                        </div>
                                    )}
                                    {selectedOrder.discount > 0 && (
                                        <div className="flex justify-between text-sm text-success">
                                            <span>Diskon</span>
                                            <span className="font-mono">-Rp {selectedOrder.discount.toLocaleString('id-ID')}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-border pt-2 mt-2">
                                        <div className="flex justify-between font-semibold text-base">
                                            <span>Total Pembayaran</span>
                                            <span className="font-mono text-accent">Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {selectedOrder.shippingAddress && (
                                <div className="glass-card p-4 mb-6">
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-3">Alamat Pengiriman</h4>
                                    <div className="text-sm space-y-1">
                                        <p className="font-medium">{selectedOrder.user?.name}</p>
                                        <p>{selectedOrder.shippingAddress.street}</p>
                                        <p className="text-muted-foreground">
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                                        </p>
                                        <p className="text-muted-foreground">{selectedOrder.shippingAddress.country}</p>
                                        <p className="text-muted-foreground">📞 {selectedOrder.shippingAddress.phone}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {['Diproses', 'Pending Payment'].includes(selectedOrder.status) && (
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={handleCancelOrder}
                                    >
                                        Batalkan Pesanan
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleModalClose}
                                >
                                    Tutup
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cancel Success Animation */}
            <AnimatePresence>
                {showCancelSuccess && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-success/90 p-5 rounded-full shadow-2xl">
                            <CheckCircle className="text-foreground" size={36} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden md:block fixed top-32 right-6 w-48">
                <aside className="glass-card p-3 rounded-2xl space-y-2">
                    <button
                        onClick={() => handleViewChange('account')}
                        className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 transition-colors duration-200 ${activeView === 'account'
                            ? 'bg-accent/20 text-foreground'
                            : 'text-muted-foreground hover:bg-card/50'
                            }`}
                    >
                        <User size={16} /> Info
                    </button>
                    <button
                        onClick={() => handleViewChange('orders')}
                        className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 transition-colors duration-200 ${activeView === 'orders'
                            ? 'bg-accent/20 text-foreground'
                            : 'text-muted-foreground hover:bg-card/50'
                            }`}
                    >
                        <ShoppingBag size={16} /> Pesanan
                    </button>
                    <button
                        onClick={() => handleViewChange('reviews')}
                        className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 transition-colors duration-200 ${activeView === 'reviews'
                            ? 'bg-accent/20 text-foreground'
                            : 'text-muted-foreground hover:bg-card/50'
                            }`}
                    >
                        <Star size={16} /> Review
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 text-error hover:bg-error/10 transition-colors duration-200"
                    >
                        <LogOut size={16} /> Keluar
                    </button>
                </aside>
            </div>
        </motion.div>
    );
};

export default ProfilePage;