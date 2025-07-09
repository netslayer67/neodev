import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { products as initialProducts } from '@/data/products'; // Asumsi data produk Anda
import { PlusCircle, MoreVertical, Search, ChevronDown, Edit, Trash2, Eye } from 'lucide-react';

// --- Sub-Komponen untuk Clean Code: Product Card ---
const ProductCard = ({ product, variants }) => (
  <motion.div variants={variants} className="relative group overflow-hidden rounded-2xl">
    {/* Gradient Border */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl p-px" aria-hidden="true" />
    <div className="relative bg-gray-900/60 backdrop-blur-xl h-full rounded-[15px] flex flex-col">

      {/* Image and Hover Overlay */}
      <div className="relative">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button size="icon" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-indigo-400 font-medium">{product.category}</p>
        <h3 className="font-semibold text-white mt-1 flex-grow">{product.name}</h3>
        <div className="flex items-end justify-between mt-4">
          <p className="text-xl font-bold text-white">${product.price.toFixed(2)}</p>
          <p className={`text-xs px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);


// --- Komponen Utama Halaman Produk ---
const AdminProductsPage = () => {
  // State untuk fungsionalitas filter & search (contoh)
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Animasi grid muncul satu per satu
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, duration: 0.5 },
    },
  };

  // Logika filter sederhana (bisa diperluas)
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-neutral-400 mt-1">Manage, add, and organize all your products.</p>
            </div>
            <Button className="bg-white text-black hover:bg-neutral-200 rounded-lg px-5 py-2.5 font-semibold text-sm flex items-center gap-2 shadow-lg transition-all duration-300 hover:shadow-indigo-500/30">
              <PlusCircle className="h-5 w-5" /> Add New Product
            </Button>
          </div>
        </motion.div>

        {/* Filter and Search Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-900/50 backdrop-blur-lg border border-white/10 rounded-xl"
        >
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search products..."
              className="w-full pl-10 bg-white/5 border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Contoh filter, bisa di-map dari list kategori */}
            <Button variant="ghost" className="text-neutral-300 hover:bg-white/10 hover:text-white">All</Button>
            <Button variant="ghost" className="text-neutral-300 hover:bg-white/10 hover:text-white">Electronics</Button>
            <Button variant="ghost" className="text-neutral-300 hover:bg-white/10 hover:text-white">Apparel</Button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          key={filteredProducts.length} // Re-trigger animasi saat filter berubah
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} variants={itemVariants} />
          ))}
        </motion.div>
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-neutral-400 col-span-full"
          >
            No products found.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;