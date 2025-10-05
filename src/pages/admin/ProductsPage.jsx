// src/pages/admin/AdminProductsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../store/slices/productSlice";

import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

import { PlusCircle, Grid, List, Loader2, Badge, Package } from "lucide-react";
import ProductAdmin from "./ProductAdmin";
import StockManagementModal from "../../components/admin/StockManagementModal";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus produk ini?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleManageStock = (product) => {
    setSelectedProductForStock(product);
    setStockModalOpen(true);
  };

  const handleStockModalClose = () => {
    setStockModalOpen(false);
    setSelectedProductForStock(null);
    // Refresh products to get updated stock data
    dispatch(fetchProducts());
  };

  return (
    <div className="relative min-h-screen w-full bg-background/80 backdrop-blur-xl p-6">
      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-24 w-[500px] h-[500px] bg-success/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 mb-6 flex flex-col gap-3 rounded-2xl bg-background/60 p-4 backdrop-blur-md shadow-sm border border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">Product Manager</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                setSelectedProduct(null);
                setModalOpen(true);
              }}
              className="btn-accent flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>
        <Input
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72"
        />
      </div>

      {/* Content */}
      {status === "loading" ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
        </div>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">No products found.</p>
      ) : (
        <div
          className={`grid gap-4 ${viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
            }`}
        >
          {filtered.map((product) => (
            <Card
              key={product._id}
              className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-md hover:shadow-xl transition"
            >
              <CardHeader className="p-0">
                <div className="relative h-40 overflow-hidden rounded-t-2xl">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="No Image"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="success">Rp {product.price.toLocaleString("id-ID")}</Badge>
                    <Badge variant={product.stock > 0 ? "info" : "error"}>
                      Stock: {product.stock}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManageStock(product)}
                      className="flex-1"
                    >
                      <Package className="w-3 h-3 mr-1" />
                      Stock
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(product);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reusable Form Modal */}
      {modalOpen && (
        <ProductAdmin
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          product={selectedProduct}
          loading={status === "loading"} // ⬅️ inject status loading redux
          onSubmit={async (data) => {
            try {
              if (selectedProduct) {
                await dispatch(
                  updateProduct({ id: selectedProduct._id, productData: data })
                ).unwrap();
              } else {
                await dispatch(createProduct(data)).unwrap();
              }
              setModalOpen(false); // ⬅️ cuma close kalau sukses
            } catch (err) {
              console.error("Save failed:", err);
              // opsional: kasih toast/error alert
            }
          }}
        />

      )}

      {/* Stock Management Modal */}
      <StockManagementModal
        isOpen={stockModalOpen}
        onClose={handleStockModalClose}
        product={selectedProductForStock}
      />
    </div>
  );
}
