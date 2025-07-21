import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, User, Home, Package } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/10">
        <span className="text-sm text-neutral-400">{label}</span>
        <span className="text-sm font-semibold text-white text-right">{value}</span>
    </div>
);

const OrderDetailModal = ({ isOpen, order, status, onClose }) => {
    if (!isOpen) return null;

    const subtotal = order?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 40 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-3xl rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/10 text-white overflow-hidden"
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

                    {/* Content */}
                    <div className="p-6 sm:p-10">
                        {status === 'loading' || !order ? (
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
                                    <h2 className="text-3xl font-display font-semibold tracking-tight">
                                        Order Overview
                                    </h2>
                                    <p className="text-sm font-mono text-white/50">{order.orderId}</p>
                                </motion.div>

                                {/* Grid Content */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Customer + Shipping */}
                                    <div className="space-y-8">
                                        {/* Customer Info */}
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                                <User size={18} /> Client
                                            </h3>
                                            <div className="pl-4 border-l border-indigo-500 space-y-1 text-sm">
                                                <p>{order.user?.name}</p>
                                                <p className="text-white/50">{order.user?.email}</p>
                                            </div>
                                        </div>

                                        {/* Shipping Info */}
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                                <Home size={18} /> Shipping Destination
                                            </h3>
                                            <div className="pl-4 border-l border-indigo-500 space-y-1 text-sm">
                                                <p>{order.shippingAddress?.street}</p>
                                                <p className="text-white/50">
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                                </p>
                                                <p className="text-white/50">{order.shippingAddress?.country}</p>
                                                <p className="text-white/50">Phone: {order.shippingAddress?.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Items + Payment */}
                                    <div className="space-y-8">
                                        {/* Items Ordered */}
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                                <Package size={18} /> Ordered Items
                                            </h3>
                                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                                {order.items.map((item) => (
                                                    <div key={item.product} className="flex justify-between items-start text-sm">
                                                        <div className="space-y-0.5">
                                                            <p className="text-white font-medium">{item.name}</p>
                                                            <p className="text-white/50">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-mono whitespace-nowrap">
                                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment Summary */}
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                                            <h3 className="font-semibold text-lg mb-3">Payment Summary</h3>
                                            <div className="space-y-2">
                                                <DetailRow label="Subtotal" value={`Rp ${subtotal.toLocaleString('id-ID')}`} />
                                                {order.shippingPrice && (
                                                    <DetailRow
                                                        label="Shipping"
                                                        value={`Rp ${order.shippingPrice.toLocaleString('id-ID')}`}
                                                    />
                                                )}
                                                <DetailRow
                                                    label="Payment Method"
                                                    value={order.paymentMethod || 'N/A'}
                                                />
                                                <div className="pt-2 mt-2 border-t border-white/10">
                                                    <DetailRow
                                                        label="Total Amount"
                                                        value={
                                                            <span className="font-bold text-lg">
                                                                Rp {order.totalAmount.toLocaleString('id-ID')}
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
