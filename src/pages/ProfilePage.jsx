import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logout } from "../store/slices/authSlice";
import { fetchMyOrders, cancelOrder } from "../store/slices/orderSlice";
import PageLoader from "@/components/PageLoader";
import Review from "@/components/Review";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const [activeView, setActiveView] = useState(
        location.state?.activeView || "account"
    );
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCancelSuccess, setShowCancelSuccess] = useState(false);

    const { user, status: authStatus } = useSelector((s) => s.auth);
    const { myOrders, status: orderStatus } = useSelector((s) => s.orders);

    useEffect(() => {
        if (user) dispatch(fetchMyOrders());
    }, [user, dispatch]);

    useEffect(() => {
        document.body.style.overflow = selectedOrder ? "hidden" : "";
    }, [selectedOrder]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const handleCancelOrder = async () => {
        try {
            await dispatch(cancelOrder(selectedOrder.orderId)).unwrap();
            toast({
                title: "Order Cancelled",
                description: `Order #${selectedOrder.orderId} cancelled.`,
            });
            setSelectedOrder(null);
            setShowCancelSuccess(true);
            setTimeout(() => setShowCancelSuccess(false), 2000);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Failed",
                description: err.message || "Something went wrong.",
            });
        }
    };

    const filteredOrders = useMemo(
        () =>
            myOrders.filter(
                (o) =>
                    o.items.some((i) =>
                        i.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ) || o.orderId.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [myOrders, searchQuery]
    );

    const navItems = [
        { id: "account", label: "Info", icon: User },
        { id: "orders", label: "Orders", icon: ShoppingBag },
        { id: "reviews", label: "Reviews", icon: Star },
        { id: "logout", label: "Logout", icon: LogOut, action: handleLogout },
    ];

    const Card = ({ children, className = "", onClick }) => (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl transition-all ${className}`}
        >
            {children}
        </motion.div>
    );

    const renderContent = () => {
        if (authStatus === "loading" || !user) return <PageLoader />;

        switch (activeView) {
            case "account":
                return (
                    <Card>
                        <h2 className="text-2xl font-semibold mb-4">Account</h2>
                        <p className="text-white/80">Name: {user.name}</p>
                        <p className="text-white/80">Email: {user.email}</p>
                        <p className="text-white/60 text-sm mt-2">
                            Joined {new Date(user.createdAt).toLocaleDateString("en-US")}
                        </p>
                    </Card>
                );

            case "orders":
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                            <h2 className="text-2xl font-semibold">Orders</h2>
                            <div className="relative w-full sm:max-w-xs">
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="pl-10 bg-white/5 border border-white/10 text-white placeholder:text-white/40"
                                />
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                    size={18}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {orderStatus === "loading" && <PageLoader />}
                            {orderStatus === "succeeded" && filteredOrders.length === 0 && (
                                <p className="text-white/50">No orders found.</p>
                            )}
                            {orderStatus === "succeeded" &&
                                filteredOrders.map((o) => (
                                    <Card
                                        key={o.orderId}
                                        className="cursor-pointer hover:shadow-2xl"
                                        onClick={() => setSelectedOrder(o)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-mono text-white/50">
                                                    #{o.orderId}
                                                </p>
                                                <p className="text-white/60 text-sm">
                                                    {new Date(o.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#8A5CF6]">
                                                    Rp {o.totalAmount.toLocaleString("id-ID")}
                                                </p>
                                                <span
                                                    className={`text-xs px-3 py-1 rounded-full ${o.status === "Delivered"
                                                            ? "bg-green-500/20 text-green-300"
                                                            : o.status === "Cancelled"
                                                                ? "bg-red-500/20 text-red-300"
                                                                : "bg-yellow-500/20 text-yellow-300"
                                                        }`}
                                                >
                                                    {o.status}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    </motion.div>
                );

            case "reviews":
                return (
                    <Review
                        products={myOrders.flatMap((o) =>
                            o.items.map((i) => i.productData || i)
                        )}
                        onSubmit={(r) => console.log("Review:", r)}
                    />
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
            className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-10 text-white font-sans bg-gradient-to-br from-[#0F0F1A] via-[#1E2A47] to-[#0F0F1A]"
        >
            {/* Blobs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#8A5CF6]/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8A5CF6]/10 rounded-full blur-3xl animate-pulse" />

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-semibold">
                        Hey, {user?.name?.split?.(" ")[0] || "User"} 👋
                    </h1>
                    <p className="text-white/60 mt-1">Manage your stuff here.</p>
                </div>

                {/* Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Sidebar (turns into scrollable tabs on mobile) */}
                    <aside className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {navItems.map((i) => (
                            <button
                                key={i.id}
                                onClick={i.action || (() => setActiveView(i.id))}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeView === i.id
                                        ? "bg-[#8A5CF6]/20 text-white"
                                        : "text-white/60 hover:bg-white/5"
                                    } ${i.id === "logout" ? "text-red-400" : ""}`}
                            >
                                <i.icon size={18} />
                                <span>{i.label}</span>
                            </button>
                        ))}
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Order Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="absolute top-4 right-4 text-white/40 hover:text-red-400"
                            >
                                <X size={22} />
                            </button>
                            <h3 className="text-xl font-semibold mb-2">
                                Order #{selectedOrder.orderId}
                            </h3>
                            <p className="text-white/60 text-sm mb-4">
                                {new Date(selectedOrder.createdAt).toLocaleString("id-ID")}
                            </p>
                            <div className="space-y-2 text-sm">
                                {selectedOrder.items.map((i) => (
                                    <div key={i.product} className="flex justify-between">
                                        <span>
                                            {i.name} <span className="text-white/50">({i.size})</span>{" "}
                                            ×{i.quantity}
                                        </span>
                                        <span>
                                            Rp {(i.price * i.quantity).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t border-white/10 pt-4 text-sm">
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="font-semibold">{selectedOrder.status}</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span>Total:</span>
                                    <span className="font-semibold">
                                        Rp {selectedOrder.totalAmount.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                            {["Diproses", "Pending Payment"].includes(selectedOrder.status) && (
                                <Button
                                    onClick={handleCancelOrder}
                                    variant="destructive"
                                    className="w-full mt-6"
                                >
                                    Cancel Order
                                </Button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cancel Success */}
            <AnimatePresence>
                {showCancelSuccess && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <div className="bg-green-600/90 p-6 rounded-full shadow-2xl">
                            <CheckCircle className="text-white" size={40} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProfilePage;
