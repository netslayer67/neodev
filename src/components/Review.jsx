import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Star, MessageSquare, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// simple sanitize biar aman
const sanitizeInput = (val) =>
    val.replace(/(<([^>]+)>)/gi, "").replace(/(https?:\/\/[^\s]+)/g, "");

const StarRating = ({ rating, setRating }) => (
    <div className="flex gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
                key={star}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.32 }}
                type="button"
                onClick={() => setRating(star)}
            >
                <Star
                    size={28}
                    className={`cursor-pointer transition-colors duration-320 ${star <= rating
                            ? "text-secondary fill-secondary"
                            : "text-muted-foreground"
                        }`}
                />
            </motion.button>
        ))}
    </div>
);

const ReviewManager = ({ products, onSubmit }) => {
    const { user } = useSelector((s) => s.auth);
    const [productId, setProductId] = useState(products?.[0]?._id || "");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!productId || rating === 0 || !comment.trim()) return;
        onSubmit({ productId, rating, comment: sanitizeInput(comment) });
        setRating(0);
        setComment("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative glass-card p-6 sm:p-10 shadow-xl overflow-hidden"
        >
            {/* Decorative Blobs */}
            <motion.div
                animate={{ y: [0, 25, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 right-0 w-56 h-56 bg-primary/30 rounded-full blur-3xl"
            />

            <div className="relative space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold flex items-center gap-2 bg-gradient-to-r from-foreground via-secondary to-accent bg-clip-text text-transparent">
                        <MessageSquare size={26} />
                        Review Product
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Your feedback makes us better 🚀
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <Label className="text-sm text-muted-foreground">Your Name</Label>
                        <Input
                            value={user?.name || ""}
                            readOnly
                            className="bg-input text-foreground border border-border rounded-xl backdrop-blur-sm"
                        />
                    </div>

                    {/* Product */}
                    <div>
                        <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ShoppingBag size={16} className="text-accent" /> Product
                        </Label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="w-full p-3 rounded-xl bg-input text-foreground border border-border backdrop-blur-sm focus:ring-2 focus:ring-accent transition duration-320"
                        >
                            {products.map((p) => (
                                <option
                                    key={p._id}
                                    value={p._id}
                                    className="bg-background text-foreground"
                                >
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rating */}
                    <div>
                        <Label className="text-sm text-muted-foreground">Rating</Label>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>

                    {/* Comment */}
                    <div>
                        <Label className="text-sm text-muted-foreground">Comment</Label>
                        <Textarea
                            rows={4}
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(sanitizeInput(e.target.value))}
                            className="bg-input text-foreground border border-border rounded-xl backdrop-blur-md focus:ring-2 focus:ring-secondary transition duration-320"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            className="w-full py-3 text-lg font-semibold rounded-xl btn-primary hover:opacity-90 transition duration-320"
                        >
                            Submit Review
                        </Button>
                    </motion.div>
                </form>
            </div>
        </motion.div>
    );
};

export default ReviewManager;
