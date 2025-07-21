import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../store/slices/productSlice';
import {
  PlusCircle,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Search,
} from 'lucide-react';
import PageLoader from '@/components/PageLoader';

const ProductCard = ({ product, onEdit, onDelete }) => (
  <motion.div
    layout
    whileHover={{ scale: 1.015 }}
    whileTap={{ scale: 0.985 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="relative group overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300"
  >
    <div className="relative">
      <img
        src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
        alt={product.images?.[0]?.alt || 'Product Image'}
        className="w-full h-48 object-cover rounded-t-2xl"
      />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <p className="text-xs text-amber-300 font-medium tracking-wide uppercase">
        {product.category}
      </p>
      <h3 className="font-display font-semibold text-white mt-1 line-clamp-1">
        {product.name}
      </h3>
      <div className="flex items-end justify-between mt-4">
        <p className="text-lg font-bold text-white font-mono">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
        <p
          className={`text-xs px-2 py-1 rounded-full font-medium transition-all duration-300 ${product.stock > 10
            ? 'bg-green-500/10 text-green-300'
            : 'bg-red-500/10 text-red-300'
            }`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
        </p>
      </div>
    </div>
    <div className="absolute top-2 right-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white bg-black/30 hover:bg-black/60 rounded-full"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-black/70 backdrop-blur-md border border-white/10 text-white"
        >
          <DropdownMenuItem onClick={() => onEdit(product)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(product)}
            className="text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </motion.div>
);

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items: products, status } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (formData, id) => {
    try {
      if (id) {
        await dispatch(updateProduct({ id, productData: formData })).unwrap();
        toast({ title: 'Product Updated!' });
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast({ title: 'Product Added!' });
      }
      dispatch(fetchProducts());
      handleCloseModal();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: error.message,
      });
    }
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await dispatch(deleteProduct(product._id)).unwrap();
        toast({ title: 'Product Deleted' });
        dispatch(fetchProducts());
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Deletion Failed',
          description: error.message,
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
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-slate-900 to-black text-white p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-display font-bold tracking-tight text-white">
                Curate Your Collection
              </h1>
              <p className="text-neutral-400 mt-1 text-sm">
                Organize, refine, and showcase your product lineup.
              </p>
            </div>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-white text-black font-bold px-5 py-3 rounded-xl hover:bg-neutral-200 transition-all"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Craft New Piece
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="relative w-full"
        >
          <div className="relative">
            <Input
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 text-white placeholder-white/40 backdrop-blur-md rounded-xl py-4 px-5"
            />
          </div>
        </motion.div>

        {status === 'loading' && <PageLoader />}

        {status === 'succeeded' && (
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
                onEdit={handleOpenModal}
                onDelete={handleDeleteProduct}
              />
            ))}
          </motion.div>
        )}

        {status === 'succeeded' && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-white/70"
          >
            <p className="text-xl font-display">No curation yet. Let’s begin crafting.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;