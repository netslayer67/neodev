import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fadeIn } from '@/lib/motion';

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Star
                        size={30}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer transition-colors duration-300 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'
                            }`}
                    />
                </motion.div>
            ))}
        </div>
    );
};

const ReviewManager = ({ products, onSubmit }) => {
    const { user } = useSelector((state) => state.auth);
    const [productId, setProductId] = useState(products?.[0]?._id || '');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!productId || rating === 0 || !comment) return;
        onSubmit({ productId, rating, comment });
        setRating(0);
        setComment('');
    };

    return (
        <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-white space-y-6"
        >
            <h2 className="text-3xl font-serif font-semibold tracking-tight">Leave a Product Review</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label className="text-white/60 mb-1 block text-sm">Your Name</Label>
                    <Input
                        value={user?.name || ''}
                        readOnly
                        className="bg-white/10 text-white/80 border border-white/10 rounded-xl"
                    />
                </div>

                <div>
                    <Label htmlFor="product" className="text-white/60 mb-1 block text-sm">Product</Label>
                    <select
                        id="product"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm"
                    >
                        {products.map((p) => (
                            <option key={p._id} value={p._id} className="bg-zinc-900 text-white">
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label className="text-white/60 mb-1 block text-sm">Rating</Label>
                    <StarRating rating={rating} setRating={setRating} />
                </div>

                <div>
                    <Label htmlFor="comment" className="text-white/60 mb-1 block text-sm">Comment</Label>
                    <Textarea
                        id="comment"
                        rows={5}
                        placeholder="Share your thoughts about the product..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="bg-white/10 text-white/90 border border-white/10 rounded-xl backdrop-blur-md"
                        required
                    />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        type="submit"
                        className="w-full py-4 text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90"
                    >
                        Kirim Review
                    </Button>
                </motion.div>
            </form>
        </motion.div>
    );
};

export default ReviewManager;
