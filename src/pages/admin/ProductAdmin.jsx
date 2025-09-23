import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ProductAdmin({
    open,
    onClose,
    product,
    onSubmit,
    loading,
}) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [],
        sizes: [],
    });

    const [dragIndex, setDragIndex] = useState(null);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                category: product.category || "",
                images: [], // fresh upload only
                sizes: product.sizes || [],
            });
        } else {
            setForm({
                name: "",
                description: "",
                price: "",
                category: "",
                images: [],
                sizes: [],
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm((prev) => ({
                ...prev,
                images: [...prev.images, ...Array.from(files)],
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSizeChange = (index, field, value) => {
        const updated = [...form.sizes];
        updated[index][field] = value;
        setForm((prev) => ({ ...prev, sizes: updated }));
    };

    const addSize = () => {
        setForm((prev) => ({
            ...prev,
            sizes: [...prev.sizes, { size: "", quantity: 0 }],
        }));
    };

    const removeSize = (index) => {
        const updated = [...form.sizes];
        updated.splice(index, 1);
        setForm((prev) => ({ ...prev, sizes: updated }));
    };

    // Drag & Drop untuk images
    const handleDragStart = (index) => setDragIndex(index);

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (dragIndex === index) return;
        const newImages = [...form.images];
        const draggedItem = newImages[dragIndex];
        newImages.splice(dragIndex, 1);
        newImages.splice(index, 0, draggedItem);
        setDragIndex(index);
        setForm((prev) => ({ ...prev, images: newImages }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", form.name.trim());
        data.append("description", form.description.trim());
        data.append("price", form.price);
        data.append("category", form.category);

        form.images.forEach((file) => {
            data.append("images", file);
        });

        data.append("sizes", JSON.stringify(form.sizes));

        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-lg rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {product ? "Edit Product" : "Add Product"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="name"
                        placeholder="Product name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <Textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                    />
                    <Input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />

                    {/* Category */}
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full rounded border p-2 bg-background"
                    >
                        <option value="">-- Select Category --</option>
                        <option value="Outerwear">T-Shirt</option>
                        <option value="Hoodie">Hoodie</option>
                        <option value="pants">Pants</option>
                    </select>

                    <Input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleChange}
                    />

                    {/* Preview + DnD */}
                    {form.images.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {form.images.map((file, idx) => (
                                <div
                                    key={idx}
                                    draggable
                                    onDragStart={() => handleDragStart(idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    className="relative"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${idx}`}
                                        className={`w-20 h-20 object-cover rounded border ${idx === 0 ? "ring-2 ring-blue-500" : ""
                                            }`}
                                    />
                                    {idx === 0 && (
                                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                            Main
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Sizes */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Sizes</h3>
                            <Button type="button" size="sm" variant="outline" onClick={addSize}>
                                Add Size
                            </Button>
                        </div>
                        {form.sizes.map((s, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <Input
                                    type="text"
                                    placeholder="Size (e.g. S, M, L)"
                                    value={s.size}
                                    onChange={(e) =>
                                        handleSizeChange(index, "size", e.target.value)
                                    }
                                />
                                <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={s.quantity}
                                    onChange={(e) =>
                                        handleSizeChange(index, "quantity", e.target.value)
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeSize(index)}
                                >
                                    ✕
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="btn-accent">
                            {loading ? "Saving..." : product ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
