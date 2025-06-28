import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const orders = [
  { id: 'ORD-001', customer: 'John Doe', date: '2025-06-27', total: 115.00, status: 'Fulfilled' },
  { id: 'ORD-002', customer: 'Jane Smith', date: '2025-06-26', total: 40.00, status: 'Processing' },
  { id: 'ORD-003', customer: 'Mike Johnson', date: '2025-06-25', total: 210.00, status: 'Fulfilled' },
  { id: 'ORD-004', customer: 'Sarah Brown', date: '2025-06-25', total: 75.00, status: 'Cancelled' },
];

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
  const statusClasses = {
    Fulfilled: "bg-green-500/20 text-green-300",
    Processing: "bg-yellow-500/20 text-yellow-300",
    Cancelled: "bg-red-500/20 text-red-300",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const AdminOrdersPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-neutral-800 hover:bg-neutral-800/50">
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell><StatusBadge status={order.status} /></TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;