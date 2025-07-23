import React, { useEffect, useState } from 'react';
import {
  DollarSign, ShoppingCart, Users, Package
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';
import io from 'socket.io-client';

// Di atas component:
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

const StatCard = ({ item }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className="relative p-px overflow-hidden rounded-2xl bg-transparent"
    whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 300 } }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl" aria-hidden="true" />
    <div className="relative flex flex-col h-full p-6 bg-gray-900/60 backdrop-blur-xl rounded-[15px]">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-neutral-400">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
        </div>
        <div className="p-2 bg-white/10 rounded-lg">
          <item.icon className="w-5 h-5 text-neutral-300" />
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-500">{item.change}</p>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-lg shadow-xl">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-sm text-indigo-400">{`Sales: Rp${payload[0].value.toLocaleString('id-ID')}`}</p>
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
    revenue = { total: 0, change: '0%' },
    sales = { total: 0, change: '0%' },
    subscriptions = { total: 0, change: '0%' },
    activeUsers = { total: 0 },
    chartData = [],
    recentActivities = [],
    status = 'idle',
  } = dashboard;


  useEffect(() => {
    dispatch(fetchDashboardStats());

    socket.on('dashboard-update', () => {
      dispatch(fetchDashboardStats());
    });

    return () => {
      socket.off('dashboard-update');
    };
  }, [dispatch]);

  const stats = [
    {
      label: 'Total Revenue',
      value: `Rp ${revenue?.total?.toLocaleString('id-ID') || 0}`,
      change: `${revenue?.change || '0%'} from last month`,
      icon: DollarSign,
    },
    {
      label: 'Subscriptions',
      value: `+${subscriptions?.total || 0}`,
      change: `${subscriptions?.change || '0%'} from last month`,
      icon: Users,
    },
    {
      label: 'Sales',
      value: `+${sales?.total || 0}`,
      change: `${sales?.change || '0%'} from last month`,
      icon: ShoppingCart,
    },
    {
      label: 'Active Now',
      value: `${activeUsers?.total || 0}`,
      change: 'on the platform',
      icon: Package,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, duration: 0.8 },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8">
      <motion.div className="max-w-7xl mx-auto space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-neutral-400 mt-1">Welcome back, here's your business snapshot.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((item) => <StatCard key={item.label} item={item} />)}
            </div>

            <motion.div variants={itemVariants} className="relative p-px overflow-hidden rounded-2xl bg-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl" aria-hidden="true" />
              <div className="relative p-6 bg-gray-900/70 backdrop-blur-xl rounded-[15px]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Sales Overview</h2>
                    <p className="text-sm text-neutral-400">Last 7 Months Performance</p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition-colors">
                    View Report
                  </button>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData || []} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}
                      onMouseMove={(state) => {
                        if (state.isTooltipActive) {
                          setActiveIndex(state.activeTooltipIndex);
                        } else {
                          setActiveIndex(null);
                        }
                      }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value / 1000000}jt`} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(129, 140, 248, 0.1)' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {(chartData || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === activeIndex ? '#818cf8' : '#4f46e5'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-8">
            <div className="relative p-px overflow-hidden rounded-2xl bg-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl" aria-hidden="true" />
              <div className="relative p-6 bg-gray-900/70 backdrop-blur-xl rounded-[15px]">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <p className="text-sm text-neutral-400 mb-6">Latest customer actions.</p>

                <div className="space-y-5">
                  {(recentActivities || []).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <div>
                          <p className="text-sm text-white font-medium">{activity.user}</p>
                          <p className="text-xs text-neutral-400">{activity.action}</p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500">{activity.time}</p>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full text-center text-sm text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
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
