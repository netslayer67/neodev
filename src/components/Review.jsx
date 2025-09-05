import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Star, MessageSquare, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Star
                        size={28}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer transition-colors duration-300 ${star <= rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-white/30"
                            }`}
                    />
                </motion.div>
            ))}
        </div>
    );
};

const ReviewManager = ({ products, onSubmit }) => {
    const { user } = useSelector((state) => state.auth);
    const [productId, setProductId] = useState(products?.[0]?._id || "");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!productId || rating === 0 || !comment) return;
        onSubmit({ productId, rating, comment });
        setRating(0);
        setComment("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-[#0F0F1A] via-[#1E2A47] to-[#0F0F1A] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/10 backdrop-blur-2xl"
        >
            {/* Decorative Blobs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#8A5CF6]/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#8A5CF6]/20 rounded-full blur-3xl animate-pulse" />

            <div className="relative space-y-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
                        <MessageSquare className="text-[#8A5CF6]" size={26} />
                        Leave a Review
                    </h2>
                    <p className="text-white/60 text-sm mt-1">
                        Quick feedback helps us grow better 🚀
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <Label className="text-white/70 mb-1 block text-sm">Your Name</Label>
                        <Input
                            value={user?.name || ""}
                            readOnly
                            className="bg-white/10 text-white/90 border border-white/10 rounded-xl backdrop-blur-sm"
                        />
                    </div>

                    {/* Product Select */}
                    <div>
                        <Label className="text-white/70 mb-1 block text-sm flex items-center gap-2">
                            <ShoppingBag size={16} className="text-[#8A5CF6]" /> Product
                        </Label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm focus:outline-none"
                        >
                            {products.map((p) => (
                                <option key={p._id} value={p._id} className="bg-[#0F0F1A]">
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rating */}
                    <div>
                        <Label className="text-white/70 mb-1 block text-sm">Rating</Label>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>

                    {/* Comment */}
                    <div>
                        <Label className="text-white/70 mb-1 block text-sm">Comment</Label>
                        <Textarea
                            rows={4}
                            placeholder="Share a quick thought..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="bg-white/10 text-white/90 border border-white/10 rounded-xl backdrop-blur-md"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            className="w-full py-3 text-lg font-semibold rounded-xl bg-[#8A5CF6] text-white hover:bg-[#7a4ee3] transition-colors"
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
