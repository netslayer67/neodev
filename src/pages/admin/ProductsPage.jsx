import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { products } from '@/data/products';
import { PlusCircle, MoreHorizontal } from 'lucide-react';

const AdminProductsPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button className="bg-white text-black hover:bg-neutral-300">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-neutral-800 hover:bg-neutral-800/50">
                <TableCell>
                  <img 
                    alt={product.name}
                    className="h-12 w-12 rounded-md object-cover"
                   src="https://images.unsplash.com/photo-1671376354106-d8d21e55dddd" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProductsPage;