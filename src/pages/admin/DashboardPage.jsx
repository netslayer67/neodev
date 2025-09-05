import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/store/slices/dashboardSlice";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

// --- Stat Card Component ---
const StatCard = ({ item }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    whileHover={{
      scale: 1.03,
      transition: { type: "spring", stiffness: 300 },
    }}
    className="relative p-px overflow-hidden rounded-2xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl" />
    <div className="relative flex flex-col h-full p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-300">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
        </div>
        <div className="p-2 bg-[#1E2A47]/60 rounded-lg">
          <item.icon className="w-5 h-5 text-[#8A5CF6]" />
        </div>
      </div>
      <p className="mt-3 text-xs text-neutral-400">{item.change}</p>
    </div>
  </motion.div>
);

// --- Custom Tooltip for Chart ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-[#0F0F1A]/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-sm text-[#8A5CF6]">
          {`Sales: Rp${payload[0].value.toLocaleString("id-ID")}`}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(null);

  const dashboard = useSelector((state) => state.dashboard) || {};
  const {
    revenue = { total: 0, change: "0%" },
    sales = { total: 0, change: "0%" },
    subscriptions = { total: 0, change: "0%" },
    activeUsers = { total: 0 },
    chartData = [],
    recentActivities = [],
  } = dashboard;

  useEffect(() => {
    dispatch(fetchDashboardStats());
    socket.on("dashboard-update", () => {
      dispatch(fetchDashboardStats());
    });
    return () => {
      socket.off("dashboard-update");
    };
  }, [dispatch]);

  const stats = [
    {
      label: "Revenue",
      value: `Rp ${revenue?.total?.toLocaleString("id-ID") || 0}`,
      change: `${revenue?.change || "0%"} vs last month`,
      icon: DollarSign,
    },
    {
      label: "Subscriptions",
      value: `+${subscriptions?.total || 0}`,
      change: `${subscriptions?.change || "0%"} vs last month`,
      icon: Users,
    },
    {
      label: "Sales",
      value: `+${sales?.total || 0}`,
      change: `${sales?.change || "0%"} vs last month`,
      icon: ShoppingCart,
    },
    {
      label: "Active Now",
      value: `${activeUsers?.total || 0}`,
      change: "on platform",
      icon: Package,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="relative min-h-screen w-full text-white p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* --- Decorative Blobs --- */}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 bg-[#8A5CF6]/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E2A47]/30 rounded-full blur-3xl"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* --- Dashboard Content --- */}
      <motion.div
        className="relative max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          variants={containerVariants}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-neutral-400 mt-1">Your snapshot today.</p>
          </div>
        </motion.div>

        {/* Stats + Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Stats + Chart */}
          <motion.div
            variants={containerVariants}
            className="lg:col-span-2 space-y-8"
          >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((item) => (
                <StatCard key={item.label} item={item} />
              ))}
            </div>

            {/* Chart */}
            <motion.div
              variants={containerVariants}
              className="relative p-px overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl" />
              <div className="relative p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Sales Overview</h2>
                    <p className="text-sm text-neutral-400">Last 7 months</p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium text-white bg-[#8A5CF6]/20 border border-[#8A5CF6]/30 rounded-md hover:bg-[#8A5CF6]/30 transition-colors">
                    Report
                  </button>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData || []}
                      margin={{ top: 20, right: 0, left: -20, bottom: 5 }}
                      onMouseMove={(state) =>
                        setActiveIndex(
                          state.isTooltipActive ? state.activeTooltipIndex : null
                        )
                      }
                    >
                      <defs>
                        <linearGradient
                          id="colorSales"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopColor="#8A5CF6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1E2A47" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        stroke="#a3a3a3"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#a3a3a3"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `Rp${value / 1000000}jt`}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(138, 92, 246, 0.1)" }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {(chartData || []).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === activeIndex ? "#8A5CF6" : "url(#colorSales)"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Recent Activity */}
          <motion.div variants={containerVariants} className="space-y-8">
            <div className="relative p-px overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl" />
              <div className="relative p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <p className="text-sm text-neutral-400 mb-5">Latest updates</p>

                <div className="space-y-5">
                  {(recentActivities || []).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#8A5CF6] animate-pulse"></div>
                        <div>
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-neutral-400">
                            {activity.action}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500">{activity.time}</p>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full text-center text-sm text-[#8A5CF6] hover:text-white transition-colors">
                  View all
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
