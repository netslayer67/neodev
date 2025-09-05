import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../store/slices/productSlice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageLoader from "@/components/PageLoader";
import {
  PlusCircle,
  MoreVertical,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

// --- Product Card ---
const ProductCard = ({ product, onEdit, onDelete }) => (
  <motion.div
    layout
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="relative group overflow-hidden rounded-2xl border border-white/10 
      bg-[#0F0F1A]/60 backdrop-blur-xl shadow-lg hover:shadow-2xl 
      transition-all duration-300"
  >
    <div className="relative">
      <img
        src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
        alt={product.images?.[0]?.alt || "Product"}
        className="w-full h-44 object-cover rounded-t-2xl"
      />
    </div>
    <div className="p-5 flex flex-col">
      <p className="text-xs text-[#8A5CF6] font-medium tracking-wide uppercase">
        {product.category}
      </p>
      <h3 className="font-semibold text-white mt-1 truncate">
        {product.name}
      </h3>
      <div className="flex items-end justify-between mt-4">
        <p className="text-lg font-bold text-white font-mono">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
        <p
          className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock > 10
              ? "bg-green-500/10 text-green-300"
              : "bg-red-500/10 text-red-300"
            }`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
        </p>
      </div>
    </div>

    {/* Dropdown simple (ganti hover → click biar mobile friendly) */}
    <div className="absolute top-3 right-3">
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="bg-black/40 hover:bg-black/70 p-2 rounded-full cursor-pointer"
        onClick={() => {
          if (window.confirm("Edit this item?")) onEdit(product);
        }}
      >
        <Edit className="w-4 h-4 text-white" />
      </motion.div>
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="bg-black/40 hover:bg-black/70 p-2 mt-2 rounded-full cursor-pointer"
        onClick={() => onDelete(product)}
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </motion.div>
    </div>
  </motion.div>
);

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items: products, status } = useSelector((s) => s.products);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      try {
        await dispatch(deleteProduct(product._id)).unwrap();
        toast({ title: "Product Deleted" });
        dispatch(fetchProducts());
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: err.message,
        });
      }
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0F0F1A] via-[#1E2A47] to-[#0F0F1A] text-white font-sans">
      {/* --- Decorative Blobs --- */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#8A5CF6]/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-[#1E2A47]/40 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Manage Products
              </h1>
              <p className="text-neutral-400 mt-1 text-sm">
                Easy, clean, and fast control of your lineup.
              </p>
            </div>
            <Button
              onClick={() => alert("Modal form belum di-wire up.")}
              className="bg-[#8A5CF6] hover:bg-[#7a4ee0] text-white font-semibold px-5 py-3 rounded-xl transition-all"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Add Product
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 text-white 
                placeholder-white/40 backdrop-blur-md rounded-xl py-4 pl-12"
            />
          </div>
        </motion.div>

        {/* Product Grid */}
        {status === "loading" && <PageLoader />}

        {status === "succeeded" && (
          <motion.div
            key={filteredProducts.length}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={() => alert("Edit modal belum di-wire up.")}
                onDelete={handleDeleteProduct}
              />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {status === "succeeded" && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-white/70"
          >
            <p className="text-xl">No products yet. Let’s add some.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
