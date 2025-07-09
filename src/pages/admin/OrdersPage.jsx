import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileDown, Search, MoreHorizontal, Package, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';

// --- DATA (Bisa dari API) & KOMPONEN PEMBANTU ---
const orders = [
  { id: 'ORD-001', customer: 'Jb Maximillian', date: '2025-07-08', total: 115.0, status: 'Fulfilled' },
  { id: 'ORD-002', customer: 'Jane Smith', date: '2025-07-08', total: 40.0, status: 'Processing' },
  { id: 'ORD-003', customer: 'Mike Wheeler', date: '2025-07-07', total: 210.0, status: 'Fulfilled' },
  { id: 'ORD-004', customer: 'Sarah Connor', date: '2025-07-07', total: 75.0, status: 'Cancelled' },
  { id: 'ORD-005', customer: 'Alex Danvers', date: '2025-07-06', total: 88.0, status: 'Processing' },
  { id: 'ORD-006', customer: 'John Doe', date: '2025-07-05', total: 150.0, status: 'Fulfilled' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Fulfilled: 'bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20',
    Processing: 'bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20',
    Cancelled: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20',
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${styles[status]}`}>{status}</span>;
};


// --- KOMPONEN UTAMA ---
const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Kalkulasi data untuk kartu statistik & filtering (gunakan useMemo untuk performa)
  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => statusFilter === 'All' || order.status === statusFilter)
      .filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => o.status === 'Fulfilled' ? acc + o.total : acc, 0);
    return [
      { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: CheckCircle2 },
      { label: 'Processing', value: orders.filter(o => o.status === 'Processing').length, icon: RefreshCw },
      { label: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, icon: XCircle },
      { label: 'Total Orders', value: orders.length, icon: Package },
    ];
  }, []);

  // Varian animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
            <p className="text-neutral-400 mt-1">View, track, and manage all customer orders.</p>
          </div>
          <Button className="bg-white text-black hover:bg-neutral-200 rounded-lg px-4 py-2 font-semibold text-sm flex items-center gap-2 shadow-lg transition-all duration-300 hover:shadow-indigo-500/30">
            <FileDown className="h-4 w-4" /> Export Data
          </Button>
        </motion.div>

        {/* Stat Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="relative p-px overflow-hidden rounded-2xl bg-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl" />
              <div className="relative p-5 bg-gray-900/60 backdrop-blur-xl rounded-[15px] h-full">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
                  <stat.icon className="h-5 w-5 text-neutral-500" />
                </div>
                <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Controls and Table */}
        <motion.div variants={itemVariants} className="relative p-px overflow-hidden rounded-2xl bg-transparent">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl" />
          <div className="relative p-4 md:p-6 bg-gray-900/60 backdrop-blur-xl rounded-[15px]">
            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <div className="relative w-full md:flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search by Order ID or Customer..."
                  className="w-full pl-10 bg-white/5 border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className='flex gap-2 w-full md:w-auto'>
                {['All', 'Fulfilled', 'Processing', 'Cancelled'].map(status => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'secondary' : 'ghost'}
                    onClick={() => setStatusFilter(status)}
                    className="flex-grow md:flex-grow-0"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-white/10 hover:bg-transparent">
                    <TableHead className="text-white/70">Order ID</TableHead>
                    <TableHead className="text-white/70">Customer</TableHead>
                    <TableHead className="text-white/70">Date</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-right text-white/70">Total</TableHead>
                    <TableHead className="text-right text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{order.id}</TableCell>
                      <TableCell className="text-neutral-300">{order.customer}</TableCell>
                      <TableCell className="text-neutral-300">{order.date}</TableCell>
                      <TableCell><StatusBadge status={order.status} /></TableCell>
                      <TableCell className="text-right text-neutral-100 font-semibold">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900/80 border-white/20 text-white backdrop-blur-lg">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredOrders.length === 0 && (
              <div className="text-center py-10 text-neutral-500">
                <p>No orders found.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminOrdersPage;