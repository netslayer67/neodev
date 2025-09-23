import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, User, Home, Package, CreditCard } from "lucide-react";
import PageLoader from "@/components/PageLoader";

// Reusable row for details
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-border/50 transition-colors duration-300">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
);

const OrderDetailModal = ({ isOpen, order, status, onClose }) => {
    if (!isOpen) return null;

    const subtotal =
        order?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-overlay backdrop-blur-glass flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Decorative animated blobs */}
                <motion.div
                    className="absolute -top-24 -left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-secondary/30 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />

                <motion.div
                    initial={{ scale: 0.95, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 40, opacity: 0 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-3xl liquid-glass-card overflow-hidden"
                >
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-error transition-colors duration-300"
                    >
                        <X size={22} />
                    </Button>

                    <div className="p-6 sm:p-10">
                        {status === "loading" || !order ? (
                            <div className="h-80 flex items-center justify-center">
                                <PageLoader />
                            </div>
                        ) : (
                            <>
                                {/* Title */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-8"
                                >
                                    <h2 className="text-3xl font-heading tracking-wide drop-shadow-sm">
                                        Order Overview
                                    </h2>
                                    <p className="text-sm font-mono text-text-subtle">#{order.orderId}</p>
                                </motion.div>

                                {/* Grid Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {/* Customer Info */}
                                        <div className="glass-card p-4 hover:shadow-glass transition duration-300">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-accent">
                                                <User size={18} /> Client
                                            </h3>
                                            <div className="pl-3 border-l-2 border-accent/50 space-y-1 text-sm">
                                                <p>{order.user?.name}</p>
                                                <p className="text-muted-foreground">{order.user?.email}</p>
                                            </div>
                                        </div>

                                        {/* Shipping */}
                                        <div className="glass-card p-4 hover:shadow-glass transition duration-300">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-accent">
                                                <Home size={18} /> Shipping
                                            </h3>
                                            <div className="pl-3 border-l-2 border-accent/50 space-y-1 text-sm">
                                                <p>{order.shippingAddress?.street}</p>
                                                <p className="text-muted-foreground">
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                                </p>
                                                <p className="text-muted-foreground">{order.shippingAddress?.country}</p>
                                                <p className="text-muted-foreground">Phone: {order.shippingAddress?.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        {/* Items */}
                                        <div className="glass-card p-4 hover:shadow-glass transition duration-300">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-accent">
                                                <Package size={18} /> Items
                                            </h3>
                                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.product}
                                                        className="flex justify-between items-start text-sm"
                                                    >
                                                        <div className="space-y-0.5">
                                                            <p className="font-medium text-foreground">{item.name}</p>
                                                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-mono whitespace-nowrap">
                                                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment */}
                                        <div className="glass-card p-4 hover:shadow-glass transition duration-300">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-accent">
                                                <CreditCard size={18} /> Payment
                                            </h3>
                                            <div className="space-y-2">
                                                <DetailRow label="Subtotal" value={`Rp ${subtotal.toLocaleString("id-ID")}`} />
                                                {order.shippingPrice && (
                                                    <DetailRow
                                                        label="Shipping"
                                                        value={`Rp ${order.shippingPrice.toLocaleString("id-ID")}`}
                                                    />
                                                )}
                                                <DetailRow label="Method" value={order.paymentMethod || "N/A"} />
                                                <div className="pt-2 mt-2 border-t border-border/50">
                                                    <DetailRow
                                                        label="Total"
                                                        value={
                                                            <span className="font-bold text-lg text-accent">
                                                                Rp {order.totalAmount.toLocaleString("id-ID")}
                                                            </span>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderDetailModal;
