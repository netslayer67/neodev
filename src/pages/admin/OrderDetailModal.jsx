import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, User, Home, Package, CreditCard } from "lucide-react";
import PageLoader from "@/components/PageLoader";

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/10">
        <span className="text-sm text-white/60">{label}</span>
        <span className="text-sm font-semibold text-white">{value}</span>
    </div>
);

const OrderDetailModal = ({ isOpen, order, status, onClose }) => {
    if (!isOpen) return null;

    const subtotal =
        order?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
        0;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#0F0F1A]/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* floating blobs background */}
                <motion.div
                    className="absolute -top-20 -left-20 w-72 h-72 bg-[#8A5CF6]/20 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-[#1E2A47]/40 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />

                <motion.div
                    initial={{ scale: 0.95, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 40, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-3xl rounded-3xl bg-[#1E2A47]/60 backdrop-blur-2xl border border-white/10 shadow-2xl text-white overflow-hidden"
                >
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 text-white/60 hover:text-red-500 transition"
                    >
                        <X size={22} />
                    </Button>

                    <div className="p-6 sm:p-10">
                        {status === "loading" || !order ? (
                            <div className="h-96 flex items-center justify-center">
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
                                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                                        Order Overview
                                    </h2>
                                    <p className="text-sm font-mono text-white/50">
                                        #{order.orderId}
                                    </p>
                                </motion.div>

                                {/* Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    {/* Left: Customer + Shipping */}
                                    <div className="space-y-6">
                                        {/* Customer Info */}
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-[#8A5CF6]">
                                                <User size={18} /> Client
                                            </h3>
                                            <div className="pl-3 border-l-2 border-[#8A5CF6]/60 space-y-1 text-sm">
                                                <p>{order.user?.name}</p>
                                                <p className="text-white/50">{order.user?.email}</p>
                                            </div>
                                        </div>

                                        {/* Shipping */}
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-[#8A5CF6]">
                                                <Home size={18} /> Shipping
                                            </h3>
                                            <div className="pl-3 border-l-2 border-[#8A5CF6]/60 space-y-1 text-sm">
                                                <p>{order.shippingAddress?.street}</p>
                                                <p className="text-white/50">
                                                    {order.shippingAddress?.city},{" "}
                                                    {order.shippingAddress?.postalCode}
                                                </p>
                                                <p className="text-white/50">
                                                    {order.shippingAddress?.country}
                                                </p>
                                                <p className="text-white/50">
                                                    Phone: {order.shippingAddress?.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Items + Payment */}
                                    <div className="space-y-6">
                                        {/* Items */}
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-[#8A5CF6]">
                                                <Package size={18} /> Items
                                            </h3>
                                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.product}
                                                        className="flex justify-between items-start text-sm"
                                                    >
                                                        <div className="space-y-0.5">
                                                            <p className="text-white font-medium">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-white/50">
                                                                Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="font-mono whitespace-nowrap">
                                                            Rp{" "}
                                                            {(item.price * item.quantity).toLocaleString(
                                                                "id-ID"
                                                            )}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment */}
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-[#8A5CF6]">
                                                <CreditCard size={18} /> Payment
                                            </h3>
                                            <div className="space-y-2">
                                                <DetailRow
                                                    label="Subtotal"
                                                    value={`Rp ${subtotal.toLocaleString("id-ID")}`}
                                                />
                                                {order.shippingPrice && (
                                                    <DetailRow
                                                        label="Shipping"
                                                        value={`Rp ${order.shippingPrice.toLocaleString(
                                                            "id-ID"
                                                        )}`}
                                                    />
                                                )}
                                                <DetailRow
                                                    label="Method"
                                                    value={order.paymentMethod || "N/A"}
                                                />
                                                <div className="pt-2 mt-2 border-t border-white/10">
                                                    <DetailRow
                                                        label="Total"
                                                        value={
                                                            <span className="font-bold text-lg text-[#8A5CF6]">
                                                                Rp{" "}
                                                                {order.totalAmount.toLocaleString("id-ID")}
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
