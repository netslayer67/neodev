import React, { useState, useEffect, useMemo, useCallback } from "react";
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
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logout } from "../store/slices/authSlice";
import { fetchMyOrders, cancelOrder } from "../store/slices/orderSlice";
import PageLoader from "@/components/PageLoader";
import Review from "@/components/Review";
import { useToast } from "@/components/ui/use-toast";

// small sanitizer to strip tags/links
const sanitizeInput = (val = "") =>
    String(val).slice(0, 80).replace(/(<([^>]+)>)/gi, "").replace(/https?:\/\/[^"]+/gi, "").trim();

const UI_DUR = 0.32;

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const [activeView, setActiveView] = useState(location.state?.activeView || "orders");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCancelSuccess, setShowCancelSuccess] = useState(false);

    const { user, status: authStatus } = useSelector((s) => s.auth || {});
    const { myOrders = [], status: orderStatus } = useSelector((s) => s.orders || {});

    useEffect(() => {
        if (user) dispatch(fetchMyOrders());
    }, [user, dispatch]);

    useEffect(() => {
        document.body.style.overflow = selectedOrder ? "hidden" : "";
    }, [selectedOrder]);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        navigate("/");
    }, [dispatch, navigate]);

    const handleCancelOrder = useCallback(async () => {
        try {
            await dispatch(cancelOrder(selectedOrder.orderId)).unwrap();
            toast({ title: "Order Cancelled", description: `Order #${selectedOrder.orderId} cancelled.` });
            setSelectedOrder(null);
            setShowCancelSuccess(true);
            setTimeout(() => setShowCancelSuccess(false), 2000);
        } catch (err) {
            toast({ variant: "destructive", title: "Failed", description: err.message || "Something went wrong." });
        }
    }, [dispatch, selectedOrder, toast]);

    const filteredOrders = useMemo(() => {
        const q = sanitizeInput(searchQuery).toLowerCase();
        if (!q) return myOrders;
        return myOrders.filter((o) => {
            return (
                o.orderId.toLowerCase().includes(q) ||
                o.items.some((i) => (i.name || "").toLowerCase().includes(q))
            );
        });
    }, [myOrders, searchQuery]);

    // compact card for order list (mobile-first)
    const OrderRow = ({ order }) => {
        const statusColor =
            order.status === "Delivered"
                ? "bg-success/20 text-success"
                : order.status === "Cancelled"
                    ? "bg-error/20 text-error"
                    : "bg-warning/20 text-warning";

        return (
            <motion.button
                whileHover={{ scale: 1.01 }}
                transition={{ duration: UI_DUR }}
                onClick={() => setSelectedOrder(order)}
                className="w-full text-left p-4 rounded-2xl glass-card flex items-center justify-between gap-4"
            >
                <div className="flex items-start gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-mono text-muted-foreground truncate">#{order.orderId}</p>
                        <p className="text-sm text-foreground truncate">{order.items?.[0]?.name} {order.items?.length > 1 ? `+${order.items.length - 1} more` : ''}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <p className="font-bold text-secondary">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                    <span className={`text-xs px-3 py-1 rounded-full mt-2 ${statusColor}`}>{order.status}</span>
                </div>
            </motion.button>
        );
    };

    // layout: mobile-first with bottom navigation
    return (
        <motion.div className="relative min-h-screen pt-20 pb-24 px-4 bg-background text-foreground font-sans">
            {/* decorative blobs */}
            <motion.div className="absolute -top-16 -left-12 w-64 h-64 rounded-full blur-3xl bg-accent/14" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 10, repeat: Infinity }} aria-hidden />
            <motion.div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl bg-primary/18" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 12, repeat: Infinity }} aria-hidden />

            <div className="max-w-3xl mx-auto">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-heading font-bold">Hey, {user?.name?.split?.(' ')[0] || 'User'} 👋</h1>
                        <p className="text-muted-foreground text-sm">Manage your account & orders</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-lg border border-border">
                            <ChevronLeft size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-lg border border-border">
                            <LogOut size={18} />
                        </Button>
                    </div>
                </header>

                {/* Search + quick stats */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search orders or items..."
                            className="pl-10 bg-card/60 border border-border rounded-xl focus:ring-2 focus:ring-accent/30 transition duration-[320ms]"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Orders</p>
                            <p className="font-bold">{myOrders.length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Spent</p>
                            <p className="font-bold">Rp {myOrders.reduce((s, o) => s + (o.totalAmount || 0), 0).toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                </div>

                {/* Main content: account / orders / reviews */}
                <div className="space-y-6">
                    {activeView === 'account' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <div className="glass-card p-4 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-card/80 flex items-center justify-center overflow-hidden">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{user?.name}</p>
                                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Joined {new Date(user?.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'orders' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {orderStatus === 'loading' && <PageLoader />}

                            <div className="flex flex-col gap-3">
                                {orderStatus === 'succeeded' && filteredOrders.length === 0 && (
                                    <div className="glass-card p-6 text-center text-muted-foreground">No orders yet.</div>
                                )}

                                {orderStatus === 'succeeded' && filteredOrders.map((o) => (
                                    <OrderRow key={o.orderId} order={o} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'reviews' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Review
                                products={myOrders.flatMap((o) => o.items.map((i) => i.productData || i))}
                                onSubmit={(r) => console.log('Review:', r)}
                            />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Bottom nav for mobile */}
            <nav className="fixed left-1/2 -translate-x-1/2 bottom-4 z-40 w-[94%] max-w-3xl flex items-center justify-between glass-card px-3 py-2 rounded-3xl shadow-xl md:hidden">
                <button onClick={() => setActiveView('account')} className={`flex-1 py-2 flex flex-col items-center gap-1 ${activeView === 'account' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <User size={18} />
                    <span className="text-xs">Info</span>
                </button>
                <button onClick={() => setActiveView('orders')} className={`flex-1 py-2 flex flex-col items-center gap-1 ${activeView === 'orders' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <ShoppingBag size={18} />
                    <span className="text-xs">Orders</span>
                </button>
                <button onClick={() => setActiveView('reviews')} className={`flex-1 py-2 flex flex-col items-center gap-1 ${activeView === 'reviews' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <Star size={18} />
                    <span className="text-xs">Reviews</span>
                </button>
                <button onClick={handleLogout} className="py-2 px-3 rounded-xl text-error">
                    <LogOut size={18} />
                </button>
            </nav>

            {/* Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div className="fixed inset-0 z-50 bg-overlay backdrop-blur-md flex justify-center items-end md:items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)}>
                        <motion.div onClick={(e) => e.stopPropagation()} initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} transition={{ duration: UI_DUR }} className="w-full md:max-w-lg glass-card p-6 rounded-t-2xl md:rounded-3xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Order #{selectedOrder.orderId}</h3>
                                <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground"><X /></button>
                            </div>
                            <div className="space-y-3 text-sm text-foreground">
                                {selectedOrder.items.map((i) => (
                                    <div key={i.product} className="flex justify-between">
                                        <div className="min-w-0 truncate">{i.name} <span className="text-muted-foreground">({i.size})</span> × {i.quantity}</div>
                                        <div className="font-mono">Rp {(i.price * i.quantity).toLocaleString('id-ID')}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 border-t border-border pt-4 flex gap-3">
                                {['Diproses', 'Pending Payment'].includes(selectedOrder.status) && (
                                    <Button variant="destructive" className="flex-1" onClick={handleCancelOrder}>Cancel</Button>
                                )}
                                <Button className="flex-1" onClick={() => navigate(`/order/${selectedOrder.orderId}`)}>Details</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cancel success */}
            <AnimatePresence>
                {showCancelSuccess && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                        <div className="bg-success/90 p-5 rounded-full shadow-2xl"><CheckCircle className="text-foreground" size={36} /></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <div className="hidden md:block fixed top-32 right-6 w-48">
                <aside className="glass-card p-3 rounded-2xl space-y-2">
                    <button onClick={() => setActiveView('account')} className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 ${activeView === 'account' ? 'bg-accent/20 text-foreground' : 'text-muted-foreground hover:bg-card/50'}`}><User size={16} /> Info</button>
                    <button onClick={() => setActiveView('orders')} className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 ${activeView === 'orders' ? 'bg-accent/20 text-foreground' : 'text-muted-foreground hover:bg-card/50'}`}><ShoppingBag size={16} /> Orders</button>
                    <button onClick={() => setActiveView('reviews')} className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 ${activeView === 'reviews' ? 'bg-accent/20 text-foreground' : 'text-muted-foreground hover:bg-card/50'}`}><Star size={16} /> Reviews</button>
                    <button onClick={handleLogout} className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-3 text-error hover:bg-error/10"><LogOut size={16} /> Logout</button>
                </aside>
            </div>
        </motion.div>
    );
};

export default ProfilePage;
