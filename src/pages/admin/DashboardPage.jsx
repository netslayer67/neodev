import React from 'react';
import {
  DollarSign, ShoppingCart, Users, Package, ArrowUpRight, MoreVertical,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { motion } from 'framer-motion';

// --- DATA (Sama seperti sebelumnya, bisa diganti dengan data dari API) ---
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7200 },
];

const stats = [
  {
    label: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    icon: DollarSign,
  },
  {
    label: 'Subscriptions',
    value: '+2,350',
    change: '+180.1% from last month',
    icon: Users,
  },
  {
    label: 'Sales',
    value: '+1,234',
    change: '+15% from last month',
    icon: ShoppingCart,
  },
  {
    label: 'Active Now',
    value: '153',
    change: 'on the platform',
    icon: Package,
  },
];

const recentActivities = [
  { user: 'Jb Maximillian', action: 'purchased "Pro Plan"', time: '2m ago' },
  { user: 'Alex Danvers', action: 'upgraded to "Enterprise"', time: '1h ago' },
  { user: 'Sarah Connor', action: 'viewed pricing page', time: '3h ago' },
  { user: 'Mike Wheeler', action: 'signed up', time: '5h ago' },
];


// --- Sub-Komponen untuk Clean Code ---

// Kartu Statistik Individual
const StatCard = ({ item }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    className="relative p-px overflow-hidden rounded-2xl bg-transparent"
    whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 300 } }}
  >
    {/* Gradient Border */}
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


// Chart Kustom dengan Tooltip yang sudah di-styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-lg shadow-xl">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-sm text-indigo-400">{`Sales: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};


// --- Komponen Utama Dashboard ---

const DashboardPage = () => {
  // State untuk bar yang aktif (untuk efek interaktif)
  const [activeIndex, setActiveIndex] = React.useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Animasi anak-anak muncul satu per satu
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
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-neutral-400 mt-1">Welcome back, here's your business snapshot.</p>
          </div>
        </motion.div>

        {/* Main Grid Layout (2-kolom di desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Kolom Kiri (Main Content) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((item) => (
                <StatCard key={item.label} item={item} />
              ))}
            </div>

            {/* Sales Chart Card */}
            <motion.div
              variants={itemVariants}
              className="relative p-px overflow-hidden rounded-2xl bg-transparent"
            >
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
                    <BarChart
                      data={salesData}
                      margin={{ top: 20, right: 0, left: -20, bottom: 5 }}
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
                      <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(129, 140, 248, 0.1)' }} />
                      <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                        {salesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === activeIndex ? '#818cf8' : '#4f46e5'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Kolom Kanan (Sidebar) */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="relative p-px overflow-hidden rounded-2xl bg-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl" aria-hidden="true" />
              <div className="relative p-6 bg-gray-900/70 backdrop-blur-xl rounded-[15px]">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <p className="text-sm text-neutral-400 mb-6">Latest customer actions.</p>

                {/* Daftar Aktivitas */}
                <div className="space-y-5">
                  {recentActivities.map((activity, index) => (
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

                {/* Placeholder untuk infinite scroll atau filter */}
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