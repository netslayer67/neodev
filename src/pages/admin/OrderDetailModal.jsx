// src/pages/admin/OrderDetailModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, User, Home, Package } from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/10">
        <span className="text-sm text-neutral-400">{label}</span>
        <span className="text-sm font-medium text-white text-right">{value}</span>
    </div>
);

const OrderDetailModal = ({ isOpen, order, status, onClose }) => {
    if (!isOpen) return null;

    // Kalkulasi subtotal hanya dilakukan jika `order` dan `order.items` ada.
    const subtotal = (order && order.items)
        ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        : 0;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-white/20 p-8 rounded-2xl w-full max-w-2xl text-white shadow-2xl"
                >
                    <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </Button>

                    {/* Menampilkan loader atau konten berdasarkan status */}
                    {status === 'loading' || !order ? (
                        <div className="h-96 flex items-center justify-center">
                            <PageLoader />
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-1">Order Details</h2>
                            <p className="text-sm text-neutral-400 mb-6 font-mono">{order.orderId}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Kolom Kiri: Info Pengiriman & User */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><User size={18} /> Customer</h3>
                                        <div className="text-sm space-y-1 pl-4 border-l border-indigo-500">
                                            <p>{order.user?.name}</p>
                                            <p className="text-neutral-400">{order.user?.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Home size={18} /> Shipping Address</h3>
                                        <div className="text-sm space-y-1 pl-4 border-l border-indigo-500">
                                            <p>{order.shippingAddress?.street}</p>
                                            <p className="text-neutral-400">{`${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}`}</p>
                                            <p className="text-neutral-400">{order.shippingAddress?.country}</p>
                                            <p className="text-neutral-400">Phone: {order.shippingAddress?.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Kolom Kanan: Detail Item & Harga */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Package size={18} /> Items Ordered</h3>
                                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                            {order.items.map(item => (
                                                <div key={item.product} className="flex justify-between items-center text-sm">
                                                    <div>
                                                        <p className="font-medium text-white">{item.name}</p>
                                                        <p className="text-neutral-400">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-mono">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-3">Payment Summary</h3>
                                        <div className="space-y-2">
                                            <DetailRow label="Subtotal" value={`Rp ${subtotal.toLocaleString('id-ID')}`} />
                                            {order.shippingPrice && <DetailRow label="Shipping" value={`Rp ${order.shippingPrice.toLocaleString('id-ID')}`} />}
                                            <DetailRow label="Payment Method" value={order.paymentMethod || 'N/A'} />
                                            <div className="pt-2 mt-2 border-t border-white/20">
                                                <DetailRow label="Total Amount" value={<span className="font-bold text-lg">Rp {order.totalAmount.toLocaleString('id-ID')}</span>} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderDetailModal;