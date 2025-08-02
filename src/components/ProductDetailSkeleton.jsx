// components/ProductDetailSkeleton.jsx
import React from 'react';
import { motion } from 'framer-motion';

const shimmer = 'animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5';

const ProductDetailSkeleton = () => {
    return (
        <motion.div className="min-h-screen pt-24 pb-32 px-4 container mx-auto text-white">
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className={`w-full aspect-square rounded-3xl ${shimmer}`} />
                    <div className="flex gap-3 overflow-x-auto">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className={`w-20 h-20 rounded-xl ${shimmer}`} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className={`h-6 w-2/5 rounded ${shimmer}`} />
                    <div className={`h-10 w-4/5 rounded ${shimmer}`} />
                    <div className={`h-8 w-1/3 rounded ${shimmer}`} />
                    <div className="flex flex-col gap-4 mt-4">
                        <div className={`h-5 w-24 rounded ${shimmer}`} />
                        <div className="flex gap-2 flex-wrap">
                            {Array(4).fill(0).map((_, i) => (
                                <div key={i} className={`h-10 w-16 rounded-full ${shimmer}`} />
                            ))}
                        </div>
                    </div>
                    <div className={`h-12 w-full rounded-full mt-4 ${shimmer}`} />
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetailSkeleton;
