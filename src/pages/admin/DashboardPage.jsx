import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Activity,
  Eye,
  Star,
  ArrowUpRight,
  Filter,
  Calendar
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/store/slices/dashboardSlice";
import io from "socket.io-client";

// Enhanced input sanitization
const sanitizeInput = (input) => {
  if (!input) return "";
  const dangerous = /<script|javascript:|on\w+=/gi;
  const malicious = /(\b(eval|function|alert|document|window)\b|[<>{}()[\]'"`;])/gi;
  const urls = /^(https?:\/\/|www\.|ftp:\/\/)/i;

  if (dangerous.test(input) || malicious.test(input) || urls.test(input)) return "";
  return String(input).replace(/[<>'"`;{}()[\]]/g, "").trim().slice(0, 200);
};

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

// Decorative blob component with token-based colors
const DecorativeBlob = ({ className, delay = 0, variant = "primary" }) => {
  const variants = {
    primary: "bg-gradient-to-br from-accent/30 to-secondary/20",
    secondary: "bg-gradient-to-br from-secondary/25 to-accent/15",
    tertiary: "bg-gradient-to-br from-success/20 to-info/15"
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-40 pointer-events-none ${variants[variant]} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: [0.8, 1.3, 0.9, 1.2, 1],
        opacity: [0, 0.4, 0.2, 0.35, 0.3],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 25 + delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  );
};

// Premium stat card with enhanced interactions
const StatCard = ({ item, index, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-3xl"
    >
      {/* Glass morphism background */}
      <div className="absolute inset-0 glass-card" />

      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-accent/30 via-transparent to-secondary/20">
        <div className="w-full h-full bg-card/40 backdrop-blur-xl rounded-3xl" />
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium tracking-wide">
              {sanitizeInput(item.label)}
            </p>
            <motion.p
              className="text-2xl md:text-3xl font-bold text-foreground font-heading"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.32 }}
            >
              {sanitizeInput(item.value)}
            </motion.p>
          </div>

          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-accent/20 to-secondary/10 border border-accent/20"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.32 }}
          >
            <item.icon className="w-6 h-6 text-accent" />
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-success/10 border border-success/20"
            animate={{ opacity: isHovered ? 1 : 0.8 }}
          >
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs text-success font-semibold">
              {sanitizeInput(item.changePercent || "+12%")}
            </span>
          </motion.div>
          <span className="text-xs text-muted-foreground">
            {sanitizeInput(item.change)}
          </span>
        </div>

        {/* Subtle animation indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-secondary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "100%" : "20%" }}
          transition={{ duration: 0.32 }}
        />
      </div>
    </motion.div>
  );
};

// Enhanced custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-4 shadow-2xl border border-border/30"
      >
        <p className="text-sm font-semibold text-foreground mb-2">{sanitizeInput(label)}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-accent font-medium">
              Revenue: Rp{entry.value?.toLocaleString("id-ID") || 0}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

// Activity item component
const ActivityItem = ({ activity, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="group flex items-center justify-between p-3 rounded-2xl hover:bg-card/30 transition-all duration-320"
  >
    <div className="flex items-center gap-3">
      <motion.div
        className="w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/30"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div>
        <p className="text-sm font-medium text-foreground">
          {sanitizeInput(activity.user)}
        </p>
        <p className="text-xs text-muted-foreground">
          {sanitizeInput(activity.action)}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">
        {sanitizeInput(activity.time)}
      </span>
      <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-320" />
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const parallaxY = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const dashboard = useSelector((state) => state.dashboard) || {};
  const {
    revenue = { total: 2847200, change: "vs last month", changePercent: "+24%" },
    sales = { total: 1249, change: "vs last month", changePercent: "+18%" },
    subscriptions = { total: 892, change: "vs last month", changePercent: "+32%" },
    activeUsers = { total: 156, change: "active now", changePercent: "+8%" },
    chartData = [
      { month: "Jan", value: 2400000 },
      { month: "Feb", value: 1398000 },
      { month: "Mar", value: 3200000 },
      { month: "Apr", value: 2780000 },
      { month: "May", value: 4890000 },
      { month: "Jun", value: 3900000 },
      { month: "Jul", value: 5200000 }
    ],
    recentActivities = [
      { user: "Sarah Chen", action: "Purchased Haute Couture Set", time: "2m ago" },
      { user: "Marcus Kim", action: "Added items to wishlist", time: "5m ago" },
      { user: "Elena Rodriguez", action: "Completed premium order", time: "12m ago" },
      { user: "James Wilson", action: "Started subscription", time: "18m ago" },
      { user: "Aria Nakamura", action: "Shared collection", time: "25m ago" }
    ],
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
      change: revenue?.change || "vs last month",
      changePercent: revenue?.changePercent || "+24%",
      icon: DollarSign,
    },
    {
      label: "Orders",
      value: `${sales?.total?.toLocaleString() || 0}`,
      change: sales?.change || "vs last month",
      changePercent: sales?.changePercent || "+18%",
      icon: ShoppingCart,
    },
    {
      label: "Customers",
      value: `${subscriptions?.total?.toLocaleString() || 0}`,
      change: subscriptions?.change || "vs last month",
      changePercent: subscriptions?.changePercent || "+32%",
      icon: Users,
    },
    {
      label: "Active Users",
      value: `${activeUsers?.total || 0}`,
      change: activeUsers?.change || "online now",
      changePercent: activeUsers?.changePercent || "+8%",
      icon: Activity,
    },
  ];

  const handleTimeRangeChange = useCallback((range) => {
    setTimeRange(range);
    // In real app, this would trigger data refetch
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 text-foreground overflow-hidden">
      {/* Animated background blobs */}
      <DecorativeBlob className="w-96 h-96 -top-48 -left-48" delay={0} variant="primary" />
      <DecorativeBlob className="w-80 h-80 top-1/3 -right-40" delay={8} variant="secondary" />
      <DecorativeBlob className="w-72 h-72 bottom-1/4 left-1/4" delay={15} variant="tertiary" />

      {/* Main content */}
      <motion.div
        className="relative"
        style={{ y: parallaxY }}
      >
        {/* Header */}
        <motion.header
          className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/20"
          style={{
            backgroundColor: `hsl(var(--background) / ${headerOpacity})`,
          }}
        >
          <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-heading text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-1 font-medium">
                  Premium insights at a glance
                </p>
              </motion.div>

              <div className="flex items-center gap-3">
                {/* Time range selector */}
                <div className="flex items-center bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl p-1">
                  {["24h", "7d", "30d"].map((range) => (
                    <motion.button
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-320 ${timeRange === range
                          ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {range}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-accent/50 transition-all duration-320"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard content */}
        <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left column - Stats and Chart */}
            <div className="xl:col-span-2 space-y-8">
              {/* Stats grid */}
              <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                {stats.map((item, index) => (
                  <StatCard
                    key={item.label}
                    item={item}
                    index={index}
                    isMobile={isMobile}
                  />
                ))}
              </div>

              {/* Revenue chart */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 glass-card" />
                <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-accent/20 via-transparent to-secondary/10">
                  <div className="w-full h-full bg-card/30 backdrop-blur-xl rounded-3xl" />
                </div>

                <div className="relative p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-xl md:text-2xl font-heading text-foreground">
                        Revenue Analytics
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Premium collections performance
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-sm text-success font-semibold">+28.5%</span>
                      </div>
                      <motion.button
                        className="px-4 py-2 text-sm font-medium text-accent border border-accent/30 rounded-xl hover:bg-accent/10 transition-all duration-320"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Export
                      </motion.button>
                    </div>
                  </div>

                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData || []}
                        margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                        onMouseMove={(state) =>
                          setActiveIndex(
                            state.isTooltipActive ? state.activeTooltipIndex : null
                          )
                        }
                      >
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                            <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity={0.1} />
                            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="month"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 2 }} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--accent))"
                          strokeWidth={3}
                          fill="url(#revenueGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right column - Activities and insights */}
            <div className="space-y-8">
              {/* Recent activities */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 glass-card" />
                <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-secondary/20 via-transparent to-accent/10">
                  <div className="w-full h-full bg-card/30 backdrop-blur-xl rounded-3xl" />
                </div>

                <div className="relative p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-heading text-foreground">
                        Live Activity
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        Real-time customer actions
                      </p>
                    </div>
                    <motion.div
                      className="p-2 rounded-xl bg-accent/10 border border-accent/20"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Activity className="w-4 h-4 text-accent" />
                    </motion.div>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                    {(recentActivities || []).map((activity, index) => (
                      <ActivityItem key={index} activity={activity} index={index} />
                    ))}
                  </div>

                  <motion.button
                    className="mt-6 w-full p-3 text-center text-sm font-medium text-accent hover:text-accent-foreground bg-accent/10 hover:bg-accent border border-accent/20 rounded-xl transition-all duration-320"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Activity
                  </motion.button>
                </div>
              </motion.div>

              {/* Quick insights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="relative overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 glass-card" />
                <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-success/20 via-transparent to-info/10">
                  <div className="w-full h-full bg-card/30 backdrop-blur-xl rounded-3xl" />
                </div>

                <div className="relative p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-5 h-5 text-secondary" />
                    <h2 className="text-xl font-heading text-foreground">
                      Insights
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-success/10 border border-success/20">
                      <p className="text-sm font-medium text-success mb-1">
                        Peak Performance
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Luxury collection sales up 45% this week
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-info/10 border border-info/20">
                      <p className="text-sm font-medium text-info mb-1">
                        Customer Growth
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Premium subscribers increased by 32%
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20">
                      <p className="text-sm font-medium text-warning mb-1">
                        Trending Now
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Haute couture pieces gaining momentum
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardPage;