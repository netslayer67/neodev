import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Filter,
  Calendar,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  X
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

import {
  fetchAllOrders,
  fetchOrderByIdForAdmin,
  clearAdminSelectedOrder,
  confirmOrderPayment,
  shipOrder,
  fulfillOrder,
} from "../../store/slices/adminSlice";
import PageLoader from "@/components/PageLoader";
import OrderDetailModal from "./OrderDetailModal";

import io from "socket.io-client";

// Socket initialization
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

// Input sanitization utility
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 100); // Limit length
};

// Premium Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    "Telah Sampai": {
      bg: "bg-success/10",
      text: "text-success",
      ring: "ring-success/20",
      icon: CheckCircle,
      glow: "shadow-success/25"
    },
    "Diproses": {
      bg: "bg-warning/10",
      text: "text-warning",
      ring: "ring-warning/20",
      icon: Clock,
      glow: "shadow-warning/25"
    },
    "Cancelled": {
      bg: "bg-error/10",
      text: "text-error",
      ring: "ring-error/20",
      icon: X,
      glow: "shadow-error/25"
    },
    "Dikirim": {
      bg: "bg-info/10",
      text: "text-info",
      ring: "ring-info/20",
      icon: Truck,
      glow: "shadow-info/25"
    },
    "Pending Payment": {
      bg: "bg-muted/20",
      text: "text-muted-foreground",
      ring: "ring-muted/30",
      icon: AlertCircle,
      glow: "shadow-muted/25"
    }
  };

  const config = statusConfig[status] || statusConfig["Pending Payment"];
  const IconComponent = config.icon;

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium 
        ${config.bg} ${config.text} ring-1 ${config.ring} backdrop-blur-sm
        transition-all duration-320 hover:shadow-lg ${config.glow}`}
    >
      <IconComponent className="w-3 h-3" />
      {status}
    </motion.span>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, trend, color = "accent" }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className="glass-card p-6 group cursor-pointer transition-all duration-320
      hover:shadow-xl hover:shadow-accent/10"
  >
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-text-subtle text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {trend && (
          <p className="text-xs text-success flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-${color}/10 text-${color} 
        group-hover:bg-${color}/20 transition-all duration-320`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

// Filter Button Component
const FilterButton = ({ active, onClick, children, count }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-320
      ${active
        ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25'
        : 'bg-muted/10 text-muted-foreground hover:bg-accent/10 hover:text-accent'
      } border border-border hover:border-accent/50`}
  >
    {children}
    {count > 0 && (
      <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground 
        text-xs rounded-full flex items-center justify-center font-bold">
        {count}
      </span>
    )}
  </motion.button>
);

// Main Component
const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const {
    orders: allOrders = [],
    selectedOrder,
    status: adminStatus,
  } = useSelector((state) => state.admin) || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle resize for responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    const refreshOrders = () => dispatch(fetchAllOrders());
    socket.on("new-order", refreshOrders);
    socket.on("order-status-updated", refreshOrders);
    return () => {
      socket.off("new-order", refreshOrders);
      socket.off("order-status-updated", refreshOrders);
    };
  }, [dispatch]);

  // Sanitize search input
  const handleSearchChange = useCallback((e) => {
    const sanitized = sanitizeInput(e.target.value);
    setSearchTerm(sanitized);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const total = allOrders.length;
    const pending = allOrders.filter(o => o.status === "Pending Payment").length;
    const processing = allOrders.filter(o => o.status === "Diproses").length;
    const shipped = allOrders.filter(o => o.status === "Dikirim").length;
    const fulfilled = allOrders.filter(o => o.status === "Telah Sampai").length;
    const revenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      total,
      pending,
      processing,
      shipped,
      fulfilled,
      revenue
    };
  }, [allOrders]);

  const filteredOrders = useMemo(() => {
    return allOrders
      .filter((order) => statusFilter === "All" || order.status === statusFilter)
      .filter((order) => {
        const sanitizedSearch = sanitizeInput(searchTerm);
        return (
          order.orderId.toLowerCase().includes(sanitizedSearch.toLowerCase()) ||
          (order.user &&
            order.user.name.toLowerCase().includes(sanitizedSearch.toLowerCase()))
        );
      });
  }, [searchTerm, statusFilter, allOrders]);

  const handleUpdateOrderStatus = async (orderId, action) => {
    try {
      await dispatch(action(orderId)).unwrap();
      toast({
        title: "Success",
        description: "Order status updated successfully",
        className: "bg-success/10 border-success/20"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: error.message,
        className: "bg-error/10 border-error/20"
      });
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

  const statusOptions = [
    { key: "All", label: "All Orders", count: stats.total },
    { key: "Pending Payment", label: "Pending", count: stats.pending },
    { key: "Diproses", label: "Processing", count: stats.processing },
    { key: "Dikirim", label: "Shipped", count: stats.shipped },
    { key: "Telah Sampai", label: "Fulfilled", count: stats.fulfilled },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/6 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-heading text-foreground mb-2 
                  bg-gradient-to-r from-foreground via-accent to-secondary bg-clip-text ">
                  Order Command
                </h1>
                <p className="text-text-subtle text-lg">
                  Orchestrate transactions with precision & elegance
                </p>
              </div>

              {/* Mobile Filter Toggle */}
              {isMobile && (
                <Button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  variant="outline"
                  size="sm"
                  className="bg-card/50 border-border hover:bg-accent/10"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              )}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatsCard
              icon={Package}
              label="Total Orders"
              value={stats.total}
              color="accent"
            />
            <StatsCard
              icon={Users}
              label="Processing"
              value={stats.processing}
              color="warning"
            />
            <StatsCard
              icon={DollarSign}
              label="Revenue"
              value={`Rp ${stats.revenue.toLocaleString('id-ID')}`}
              trend="+12.5%"
              color="success"
            />
            <StatsCard
              icon={TrendingUp}
              label="Fulfilled"
              value={stats.fulfilled}
              color="secondary"
            />
          </motion.div>

          {/* Controls Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 mb-8"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID or Customer Name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-12 h-12 bg-card/50 border-border text-foreground 
                  placeholder-muted-foreground rounded-xl backdrop-blur-sm
                  focus:ring-2 focus:ring-accent/50 focus:border-accent
                  transition-all duration-320"
                maxLength={100}
              />
            </div>

            {/* Filter Buttons */}
            <AnimatePresence>
              {(!isMobile || isFilterOpen) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-3"
                >
                  {statusOptions.map((status) => (
                    <FilterButton
                      key={status.key}
                      active={statusFilter === status.key}
                      onClick={() => setStatusFilter(status.key)}
                      count={status.count}
                    >
                      {status.label}
                    </FilterButton>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Orders Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium h-14">
                      Order ID
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      Customer
                    </TableHead>
                    {!isMobile && (
                      <TableHead className="text-muted-foreground font-medium">
                        Date
                      </TableHead>
                    )}
                    <TableHead className="text-muted-foreground font-medium">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium text-right">
                      Total
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminStatus === "loading" && (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 5 : 6} className="py-16 text-center">
                        <PageLoader />
                      </TableCell>
                    </TableRow>
                  )}

                  {adminStatus === "succeeded" && filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.orderId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{
                        backgroundColor: "hsl(var(--accent) / 0.05)",
                        scale: 1.001
                      }}
                      className="border-border hover:bg-accent/5 transition-all duration-320 cursor-pointer"
                      onClick={() => handleViewDetails(order._id)}
                    >
                      <TableCell className="font-mono text-sm text-accent">
                        {order.orderId}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {order.user?.name || "—"}
                      </TableCell>
                      {!isMobile && (
                        <TableCell className="text-text-subtle">
                          {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </TableCell>
                      )}
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size={isMobile ? "sm" : "default"}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground 
                                hover:bg-accent/10 transition-all duration-320"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="glass-card border-border min-w-48"
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(order._id);
                              }}
                              className="text-foreground hover:bg-accent/10 hover:text-accent 
                                transition-colors duration-320"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>

                            {order.status === "Pending Payment" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateOrderStatus(order._id, confirmOrderPayment);
                                }}
                                className="text-warning hover:bg-warning/10 hover:text-warning 
                                  transition-colors duration-320"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm Payment
                              </DropdownMenuItem>
                            )}

                            {order.status === "Diproses" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateOrderStatus(order._id, shipOrder);
                                }}
                                className="text-info hover:bg-info/10 hover:text-info 
                                  transition-colors duration-320"
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                Mark as Shipped
                              </DropdownMenuItem>
                            )}

                            {order.status === "Dikirim" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateOrderStatus(order._id, fulfillOrder);
                                }}
                                className="text-success hover:bg-success/10 hover:text-success 
                                  transition-colors duration-320"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Fulfilled
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {adminStatus === "succeeded" && filteredOrders.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-muted-foreground"
                >
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted/50" />
                  <p className="text-lg mb-2">No orders found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

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