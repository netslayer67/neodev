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
  Edit3,
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  TrendingUp,
  Package
} from "lucide-react";

// Security function for input sanitization
const sanitizeInput = (input) => {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 100);
};

// Premium Product Card with Glass Morphism
const ProductCard = ({ product, onEdit, onDelete, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 40, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden glass-card hover:border-accent/40 transition-all duration-320"
      style={{
        background: "hsl(var(--card))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)"
      }}
    >
      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-320 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5" />

      {/* Premium Image Container */}
      <div className="relative overflow-hidden">
        <motion.img
          src={product.images?.[0]?.url || "https://via.placeholder.com/400x240"}
          alt={product.images?.[0]?.alt || product.name}
          className={`w-full object-cover transition-all duration-320 ${isMobile ? "h-32" : "h-48"
            }`}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        />

        {/* Gradient Overlay on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-320" />

        {/* Stock Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-all duration-320 ${product.stock > 10
            ? "bg-success/20 text-success border border-success/30"
            : product.stock > 0
              ? "bg-warning/20 text-warning border border-warning/30"
              : "bg-error/20 text-error border border-error/30"
          }`}>
          {product.stock > 0 ? `${product.stock} left` : "Sold Out"}
        </div>
      </div>

      {/* Content Section */}
      <div className={`p-4 space-y-3 ${isMobile ? "p-3 space-y-2" : ""}`}>
        {/* Category & Actions Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tracking-widest uppercase text-accent">
            {product.category}
          </span>

          {/* Action Buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-320">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--info) / 0.2)" }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              className="p-2 rounded-lg border border-info/30 text-info hover:text-info-foreground transition-all duration-320"
            >
              <Edit3 size={isMobile ? 12 : 14} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--error) / 0.2)" }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
              className="p-2 rounded-lg border border-error/30 text-error hover:text-error-foreground transition-all duration-320"
            >
              <Trash2 size={isMobile ? 12 : 14} />
            </motion.button>
          </div>
        </div>

        {/* Product Name */}
        <h3 className={`font-semibold text-foreground transition-colors duration-320 group-hover:text-accent ${isMobile ? "text-sm" : "text-base"
          }`}>
          {product.name}
        </h3>

        {/* Price & Stats */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <div className={`font-bold text-secondary font-mono ${isMobile ? "text-lg" : "text-xl"
              }`}>
              Rp {product.price?.toLocaleString("id-ID") || "0"}
            </div>
            <div className="text-xs text-muted-foreground">
              Premium Quality
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors duration-320"
          >
            <Eye size={12} />
            <span>View</span>
          </motion.div>
        </div>
      </div>

      {/* Hover Effect Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-320 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-secondary/10 blur-xl" />
      </div>
    </motion.div>
  );
};

// Premium Stats Card
const StatsCard = ({ icon: Icon, label, value, trend, color = "accent" }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    className="glass-card p-6 space-y-4 hover:border-accent/40 transition-all duration-320"
    style={{ background: "hsl(var(--card))" }}
  >
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl bg-${color}/10 border border-${color}/20`}>
        <Icon size={24} className={`text-${color}`} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-success text-sm">
          <TrendingUp size={16} />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  </motion.div>
);

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items: products, status } = useSelector((s) => s.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [dispatch]);

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Remove "${product.name}" from collection?`)) {
      try {
        await dispatch(deleteProduct(product._id)).unwrap();
        toast({
          title: "Product Removed",
          description: "Successfully removed from your collection"
        });
        dispatch(fetchProducts());
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Removal Failed",
          description: err.message,
        });
      }
    }
  };

  const handleSearchChange = (e) => {
    const sanitized = sanitizeInput(e.target.value);
    setSearchTerm(sanitized);
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  const stats = useMemo(() => ({
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    revenue: products.reduce((sum, p) => sum + (p.price * p.sold || 0), 0)
  }), [products]);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "hsl(var(--accent))" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-1/2 -right-32 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: "hsl(var(--secondary))" }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, -80, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: "hsl(var(--primary))" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.2, 0.05],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground">
                Product
                <span className="ml-3 text-accent">Collection</span>
              </h1>
              <p className="text-muted-foreground max-w-md">
                Curate your premium lineup with precision and style
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => toast({ title: "Add Product Modal - Coming Soon" })}
                className="animated-gradient text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-320 border-0"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Product
              </Button>
            </motion.div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={Package}
              label="Total Products"
              value={stats.total}
              trend="+12%"
              color="accent"
            />
            <StatsCard
              icon={TrendingUp}
              label="In Stock"
              value={stats.inStock}
              color="success"
            />
            <StatsCard
              icon={Filter}
              label="Low Stock"
              value={stats.lowStock}
              color="warning"
            />
            <StatsCard
              icon={Eye}
              label="Revenue"
              value={`Rp ${(stats.revenue / 1000000).toFixed(1)}M`}
              trend="+8.2%"
              color="secondary"
            />
          </div>
        </motion.div>

        {/* Search & Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search your collection..."
              value={searchTerm}
              onChange={handleSearchChange}
              maxLength={50}
              className="glass-card border-border/50 text-foreground placeholder-muted-foreground pl-12 py-3 rounded-xl hover:border-accent/50 focus:border-accent transition-all duration-320"
              style={{ background: "hsl(var(--card) / 0.5)" }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="transition-all duration-320"
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="transition-all duration-320"
            >
              <List size={16} />
            </Button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PageLoader />
            </motion.div>
          )}

          {status === "succeeded" && filteredProducts.length > 0 && (
            <motion.div
              key={`${viewMode}-${filteredProducts.length}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`grid gap-6 ${viewMode === "grid"
                  ? isMobile
                    ? "grid-cols-2"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1 max-w-4xl mx-auto"
                }`}
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05, duration: 0.32 }}
                  >
                    <ProductCard
                      product={product}
                      onEdit={() => toast({ title: "Edit Modal - Coming Soon" })}
                      onDelete={handleDeleteProduct}
                      isMobile={isMobile}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {status === "succeeded" && filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 space-y-4"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
                <Package size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                No products found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Start building your premium collection"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminProductsPage;