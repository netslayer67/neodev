import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Package,
    Save,
    X,
    AlertTriangle,
    CheckCircle,
    Minus,
    Plus
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "../../api/axios";

const StockManagementModal = ({ isOpen, onClose, product }) => {
    const { toast } = useToast();
    const [stockData, setStockData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (product && product.sizes) {
            setStockData([...product.sizes]);
            setHasChanges(false);
        }
    }, [product, isOpen]);

    const handleStockChange = (size, newQuantity) => {
        const quantity = Math.max(0, parseInt(newQuantity) || 0);
        setStockData(prev =>
            prev.map(item =>
                item.size === size ? { ...item, quantity } : item
            )
        );
        setHasChanges(true);
    };

    const handleIncrement = (size) => {
        setStockData(prev =>
            prev.map(item =>
                item.size === size ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
        setHasChanges(true);
    };

    const handleDecrement = (size) => {
        setStockData(prev =>
            prev.map(item =>
                item.size === size ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
            )
        );
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            // Update each size stock individually
            const promises = stockData.map(sizeData =>
                axios.patch(`/products/${product._id}/stock`, {
                    size: sizeData.size,
                    quantity: sizeData.quantity
                })
            );

            await Promise.all(promises);

            toast({
                title: "Success",
                description: "Stock levels updated successfully",
                className: "bg-success/10 border-success/20"
            });

            setHasChanges(false);
            onClose();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed",
                description: error.message || "Failed to update stock levels",
                className: "bg-error/10 border-error/20"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalStock = stockData.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockItems = stockData.filter(item => item.quantity <= 5);

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-accent" />
                        Stock Management - {product.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Stock Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Stock</p>
                                    <p className="text-2xl font-bold text-foreground">{totalStock}</p>
                                </div>
                                <Package className="w-8 h-8 text-accent" />
                            </div>
                        </div>
                        <div className="glass-card p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Low Stock Items</p>
                                    <p className="text-2xl font-bold text-foreground">{lowStockItems.length}</p>
                                </div>
                                {lowStockItems.length > 0 ? (
                                    <AlertTriangle className="w-8 h-8 text-warning" />
                                ) : (
                                    <CheckCircle className="w-8 h-8 text-success" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stock by Size */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Stock by Size</h3>
                        <div className="grid gap-4">
                            {stockData.map((sizeData) => (
                                <motion.div
                                    key={sizeData.size}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`glass-card p-4 border-l-4 ${sizeData.quantity <= 5
                                            ? 'border-l-warning bg-warning/5'
                                            : sizeData.quantity === 0
                                                ? 'border-l-error bg-error/5'
                                                : 'border-l-success bg-success/5'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                                <span className="text-lg font-bold text-accent">{sizeData.size}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Size {sizeData.size}</p>
                                                <p className={`text-sm ${sizeData.quantity <= 5
                                                        ? 'text-warning'
                                                        : sizeData.quantity === 0
                                                            ? 'text-error'
                                                            : 'text-success'
                                                    }`}>
                                                    {sizeData.quantity <= 5
                                                        ? sizeData.quantity === 0
                                                            ? 'Out of stock'
                                                            : 'Low stock'
                                                        : 'In stock'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDecrement(sizeData.size)}
                                                disabled={sizeData.quantity <= 0}
                                                className="w-8 h-8 p-0"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>

                                            <Input
                                                type="number"
                                                value={sizeData.quantity}
                                                onChange={(e) => handleStockChange(sizeData.size, e.target.value)}
                                                className="w-20 text-center"
                                                min="0"
                                            />

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleIncrement(sizeData.size)}
                                                className="w-8 h-8 p-0"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    {lowStockItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-4 border border-warning/20 bg-warning/5"
                        >
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                                <div>
                                    <p className="font-medium text-warning">Low Stock Alert</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        The following sizes have low stock (≤5 items):
                                        {lowStockItems.map(item => ` ${item.size}(${item.quantity})`).join(', ')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1"
                            disabled={isSubmitting || !hasChanges}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StockManagementModal;