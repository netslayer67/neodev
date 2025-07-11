// src/pages/admin/OrdersPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Package, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';

// Import actions HANYA dari adminSlice
import {
  fetchAllOrders,
  fetchOrderByIdForAdmin,
  clearAdminSelectedOrder,
  confirmOrderPayment,
  shipOrder,
  fulfillOrder
} from '../../store/slices/adminSlice';
import { PageLoader } from '@/components/PageLoader';
import OrderDetailModal from './OrderDetailModal';

// Komponen StatusBadge
const StatusBadge = ({ status }) => {
  const styles = {
    'Telah Sampai': 'bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20',
    Diproses: 'bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20',
    Cancelled: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20',
    Dikirim: 'bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20',
    'Pending Payment': 'bg-gray-500/10 text-gray-400 ring-1 ring-inset ring-gray-500/20',
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${styles[status] || styles['Pending Payment']}`}>{status}</span>;
};


const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Ambil data dari state admin
  const {
    orders: allOrders = [],
    selectedOrder,
    status: adminStatus
  } = useSelector((state) => state.admin) || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch data saat komponen dimuat
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Logika filter disesuaikan
  const filteredOrders = useMemo(() => {
    return allOrders
      .filter(order => statusFilter === 'All' || order.status === statusFilter)
      .filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [searchTerm, statusFilter, allOrders]);

  // Handler untuk mengubah status pesanan
  const handleUpdateOrderStatus = async (orderId, action) => {
    try {
      await dispatch(action(orderId)).unwrap();
      toast({ title: "Order Updated!" });
      dispatch(fetchAllOrders()); // Cukup refresh data pesanan admin
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  };

  // Handler untuk melihat detail pesanan
  const handleViewDetails = (orderId) => {
    dispatch(fetchOrderByIdForAdmin(orderId));
    setIsModalOpen(true);
  };

  // Handler untuk menutup modal
  const handleCloseModal = () => {
    dispatch(clearAdminSelectedOrder());
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8">
      <motion.div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
            <p className="text-neutral-400 mt-1">View, track, and manage all customer orders.</p>
          </div>
        </motion.div>

        {/* Table Section */}
        <motion.div className="relative p-px overflow-hidden rounded-2xl bg-transparent">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl" />
          <div className="relative p-4 md:p-6 bg-gray-900/60 backdrop-blur-xl rounded-[15px]">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <div className="relative w-full md:flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input placeholder="Search by Order ID or Customer..." className="w-full pl-10 bg-white/5 border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className='flex gap-2 w-full md:w-auto'>
                {['All', 'Fulfilled', 'Diproses', 'Cancelled', 'Dikirim', 'Pending Payment'].map(status => (
                  <Button key={status} variant={statusFilter === status ? 'secondary' : 'ghost'} onClick={() => setStatusFilter(status)} className="flex-grow md:flex-grow-0">
                    {status}
                  </Button>
                ))}
              </div>
            </div>

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
                  {adminStatus === 'loading' && (
                    <TableRow><TableCell colSpan={6} className="text-center py-10"><PageLoader /></TableCell></TableRow>
                  )}
                  {adminStatus === 'succeeded' && filteredOrders.map((order) => (
                    <TableRow key={order.orderId} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{order.orderId}</TableCell>
                      <TableCell className="text-neutral-300">{order.user?.name || 'N/A'}</TableCell>
                      <TableCell className="text-neutral-300">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={order.status} /></TableCell>
                      <TableCell className="text-right text-neutral-100 font-semibold">Rp {order.totalAmount.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900/80 border-white/20 text-white backdrop-blur-lg">
                            {order.status === 'Pending Payment' && <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order._id, confirmOrderPayment)}>Confirm Payment</DropdownMenuItem>}
                            {order.status === 'Diproses' && <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order._id, shipOrder)}>Mark as Shipped</DropdownMenuItem>}
                            {order.status === 'Dikirim' && <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order._id, fulfillOrder)}>Mark as Fulfilled</DropdownMenuItem>}
                            <DropdownMenuItem onClick={() => handleViewDetails(order._id)}>View Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {adminStatus === 'succeeded' && filteredOrders.length === 0 && (
              <div className="text-center py-10 text-neutral-500">
                <p>No orders found for the current filter.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <OrderDetailModal
        isOpen={isModalOpen}
        order={selectedOrder}
        status={adminStatus}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AdminOrdersPage;