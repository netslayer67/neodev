// Top: AdminOrdersPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';

import {
  fetchAllOrders,
  fetchOrderByIdForAdmin,
  clearAdminSelectedOrder,
  confirmOrderPayment,
  shipOrder,
  fulfillOrder
} from '../../store/slices/adminSlice';
import PageLoader from '@/components/PageLoader';
import OrderDetailModal from './OrderDetailModal';

import io from 'socket.io-client';

// Inisialisasi socket.io
const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
});

const StatusBadge = ({ status }) => {
  const styles = {
    'Telah Sampai': 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30',
    Diproses: 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30',
    Cancelled: 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30',
    Dikirim: 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30',
    'Pending Payment': 'bg-zinc-500/10 text-zinc-300 ring-1 ring-zinc-500/30',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[status] || styles['Pending Payment']}`}>
      {status}
    </span>
  );
};

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { orders: allOrders = [], selectedOrder, status: adminStatus } = useSelector((state) => state.admin) || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');


  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Socket.IO: Dengarkan event real-time
  useEffect(() => {
    console.log('Connecting to socket at:', import.meta.env.VITE_API_BASE_URL);

    const refreshOrders = () => dispatch(fetchAllOrders());

    // Socket connection logs
    socket.on('connect', () => {
      console.log('[Socket.IO] Connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket.IO] Connection Error:', err.message);
    });

    // Real-time update events
    socket.on('new-order', refreshOrders);
    socket.on('order-status-updated', refreshOrders);

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('new-order', refreshOrders);
      socket.off('order-status-updated', refreshOrders);
    };
  }, [dispatch]);


  const filteredOrders = useMemo(() => {
    return allOrders
      .filter(order => statusFilter === 'All' || order.status === statusFilter)
      .filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [searchTerm, statusFilter, allOrders]);

  const handleUpdateOrderStatus = async (orderId, action) => {
    try {
      await dispatch(action(orderId)).unwrap();
      toast({ title: 'Order Status Updated' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed', description: error.message });
    }
  };

  const handleViewDetails = (orderId) => {
    dispatch(fetchOrderByIdForAdmin(orderId));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    dispatch(clearAdminSelectedOrder());
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 sm:px-6 lg:px-10 pt-24 pb-16 text-white font-sans"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-display font-semibold tracking-tight text-white">
              Curated Order Concierge
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Review and orchestrate all transactions with precision.
            </p>
          </div>
        </motion.div>

        {/* Filter + Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-lg p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            <div className="relative w-full lg:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <Input
                placeholder="Search by Order ID or Customer"
                className="w-full pl-11 bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl py-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
              {['All', 'Fulfilled', 'Diproses', 'Cancelled', 'Dikirim', 'Pending Payment'].map(status => (
                <Button
                  key={status}
                  size="sm"
                  variant={statusFilter === status ? 'secondary' : 'ghost'}
                  onClick={() => setStatusFilter(status)}
                  className="rounded-full px-4 py-2 text-sm transition-all duration-200"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="border-b border-white/10">
                  {['Order ID', 'Customer', 'Date', 'Status', 'Total', ''].map((head, idx) => (
                    <TableHead key={idx} className="text-white/60 text-sm font-medium">
                      {head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminStatus === 'loading' && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      <PageLoader />
                    </TableCell>
                  </TableRow>
                )}

                {adminStatus === 'succeeded' && filteredOrders.map((order) => (
                  <motion.tr
                    key={order.orderId}
                    whileHover={{ scale: 1.01 }}
                    className="transition-all duration-200 hover:bg-white/5 border-b border-white/10"
                  >
                    <TableCell className="font-mono text-white">{order.orderId}</TableCell>
                    <TableCell className="text-white/80">{order.user?.name || '—'}</TableCell>
                    <TableCell className="text-white/50 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right font-semibold text-white">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 transition">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-black/80 border border-white/10 text-white backdrop-blur-lg"
                        >
                          {order.status === 'Pending Payment' && (
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order._id, confirmOrderPayment)}>
                              Confirm Payment
                            </DropdownMenuItem>
                          )}
                          {order.status === 'Diproses' && (
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order._id, shipOrder)}>
                              Mark as Shipped
                            </DropdownMenuItem>
                          )}
                          {order.status === 'Dikirim' && (
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order._id, fulfillOrder)}>
                              Mark as Fulfilled
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleViewDetails(order._id)}>
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            {adminStatus === 'succeeded' && filteredOrders.length === 0 && (
              <div className="text-center py-10 text-white/50">
                No matching orders found.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        order={selectedOrder}
        status={adminStatus}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default AdminOrdersPage;
