import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../store/slices/productSlice';
import { PlusCircle, MoreVertical, Search, Edit, Trash2, Eye, X } from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';

// --- Sub-Komponen: Product Card ---
const ProductCard = ({ product, onEdit, onDelete }) => (
  <motion.div
    layout
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className="relative group overflow-hidden rounded-2xl bg-gray-900/60 backdrop-blur-xl border border-white/10"
  >
    <div className="relative">
      <img
        src={product.images?.[0] || 'https://via.placeholder.com/300'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <p className="text-xs text-indigo-400 font-medium">{product.category}</p>
      <h3 className="font-semibold text-white mt-1 flex-grow truncate">{product.name}</h3>
      <div className="flex items-end justify-between mt-4">
        <p className="text-xl font-bold text-white">Rp {product.price.toLocaleString('id-ID')}</p>
        <p className={`text-xs px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
        </p>
      </div>
    </div>
    <div className="absolute top-2 right-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-300 rounded-full bg-black/40 hover:bg-black/70">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-900/80 border-white/20 text-white backdrop-blur-lg">
          <DropdownMenuItem onClick={() => onEdit(product)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(product)} className="text-red-400 focus:bg-red-500/20 focus:text-red-300"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </motion.div>
);

// --- Sub-Komponen: Product Form Modal ---
const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFormData(product || { name: '', description: '', price: '', category: '', stock: '' });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== '_id' && key !== 'images') { // Hindari mengirim ID dan gambar lama
        data.append(key, formData[key]);
      }
    });
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        data.append('images', files[i]);
      }
    }
    onSave(data, product?._id);
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative bg-gray-900 border border-white/20 p-8 rounded-2xl w-full max-w-lg text-white shadow-2xl">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white"><X /></Button>
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} className="w-full bg-white/5 border-white/10 rounded-lg p-3" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
            <Input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
          </div>
          <Input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <div>
            <Label htmlFor="images">Product Images</Label>
            <Input id="images" type="file" onChange={handleFileChange} multiple className="mt-2" accept="image/*" />
          </div>
          <Button type="submit" className="w-full bg-white text-black font-bold py-3 mt-4 hover:bg-neutral-200">Save Product</Button>
        </form>
      </motion.div>
    </motion.div>
  );
};


// --- Komponen Utama Halaman Produk ---
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
        toast({ title: "Product Updated!" });
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast({ title: "Product Added!" });
      }
      dispatch(fetchProducts()); // Refresh data
      handleCloseModal();
    } catch (error) {
      toast({ variant: "destructive", title: "Operation Failed", description: error.message });
    }
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await dispatch(deleteProduct(product._id)).unwrap();
        toast({ title: "Product Deleted" });
        dispatch(fetchProducts()); // Refresh data
      } catch (error) {
        toast({ variant: "destructive", title: "Deletion Failed", description: error.message });
      }
    }
  };

  const filteredProducts = useMemo(() =>
    products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [products, searchTerm]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-neutral-400 mt-1">Manage, add, and organize all your products.</p>
            </div>
            <Button onClick={() => handleOpenModal()} className="bg-white text-black ...">
              <PlusCircle className="h-5 w-5" /> Add New Product
            </Button>
          </div>
        </motion.div>

        {/* Filter and Search */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="flex flex-col ...">
          <div className="relative w-full md:flex-grow">
            {/* <Search className="absolute left-3 top-1/2 ..." /> */}
            <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </motion.div>

        {/* Products Grid */}
        {status === 'loading' && <PageLoader />}
        {status === 'succeeded' && (
          <motion.div
            key={filteredProducts.length}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
            initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onEdit={handleOpenModal} onDelete={handleDeleteProduct} />
            ))}
          </motion.div>
        )}
        {status === 'succeeded' && filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 ...">
            No products found.
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        <ProductFormModal isOpen={isModalOpen} onClose={handleCloseModal} product={editingProduct} onSave={handleSaveProduct} />
      </AnimatePresence>
    </div>
  );
};

export default AdminProductsPage;