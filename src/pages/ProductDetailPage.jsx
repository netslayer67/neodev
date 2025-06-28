import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { pageTransition } from '@/lib/motion';
import ProductCard from '@/components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== id).slice(0, 4);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  if (!product) {
    return (
      <div className="container mx-auto px-6 pt-32 pb-16 text-center">
        <h1 className="text-4xl font-bold">Product not found</h1>
        <Link to="/shop" className="text-blue-500 mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: 'Added to Cart!',
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="container mx-auto px-6 pt-32 pb-16"
    >
      <Helmet>
        <title>{product.name} - Radiant Rage</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="mb-8">
        <Link to="/shop" className="inline-flex items-center text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Collection
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
            <motion.div layoutId={`product-image-${product.id}`} className="mb-4">
                <img 
                    class="w-full h-auto object-cover rounded-lg"
                    alt={product.name}
                 src="https://images.unsplash.com/photo-1671376354106-d8d21e55dddd" />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(img)} className={`rounded-lg overflow-hidden border-2 ${selectedImage === img ? 'border-white' : 'border-transparent'}`}>
                    <img 
                        class="w-full h-24 object-cover"
                        alt={`Thumbnail ${index + 1} for ${product.name}`}
                     src="https://images.unsplash.com/photo-1671376354106-d8d21e55dddd" />
                </button>
            ))}
            </div>
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col">
            <h1 className="text-4xl lg:text-5xl font-heading tracking-wider text-white">{product.name}</h1>
            <p className="text-3xl font-bold text-white my-4">${product.price.toFixed(2)}</p>
            <p className="text-neutral-300 leading-relaxed mb-6">{product.description}</p>
            
            <div className="flex items-center gap-4 mb-6">
                <p className="font-semibold">Quantity:</p>
                <div className="flex items-center border border-neutral-700 rounded-full">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16}/></Button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQuantity(q => q + 1)}><Plus size={16}/></Button>
                </div>
            </div>

            <Button size="lg" className="w-full bg-white text-black hover:bg-neutral-300 rounded-full font-bold text-lg py-7" onClick={handleAddToCart}>
                <ShoppingBag size={20} className="mr-2" /> Add to Cart
            </Button>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-24">
        <h2 className="text-3xl font-heading tracking-wider text-white text-center mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;