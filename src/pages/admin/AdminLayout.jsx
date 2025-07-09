import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, User, X } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar'; // Assuming Sidebar component exists
import { Input } from '@/components/ui/input'; // Assuming you have a ShadCN/UI input
import { Button } from '@/components/ui/button';

const DashboardHeader = ({ onMenuClick }) => (
  <header className="flex-shrink-0 bg-black/10 backdrop-blur-md border-b border-white/10 h-20 flex items-center justify-between px-6 lg:px-8">
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden text-white/80 hover:bg-white/10 hover:text-white"
      >
        <Menu size={22} />
      </Button>
      {/* Global Search */}
      <div className="hidden md:block relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <Input
          placeholder="Search anything..."
          className="w-full max-w-sm bg-white/5 border-white/10 pl-10 h-11 placeholder:text-neutral-500"
        />
      </div>
    </div>
    <div className="flex items-center gap-5">
      <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white">
        <Bell size={20} />
      </Button>
      <div className="h-9 w-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
        <User size={20} />
      </div>
    </div>
  </header>
);

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - NEO DERVISH</title>
        <body className="overflow-hidden" />
      </Helmet>

      <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* --- Sidebar for Desktop --- */}
        <aside className="w-72 hidden lg:block flex-shrink-0 h-full bg-black/20 border-r border-white/10">
          <Sidebar />
        </aside>

        {/* --- Sidebar for Mobile (Off-Canvas) --- */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
              {/* Mobile Menu */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-gray-900 to-black z-50 border-r border-white/10"
              >
                <Sidebar />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-5 right-5 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <X size={24} />
                </Button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* --- Main Content Area --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <motion.main
            key={location.pathname} // Animate on route change
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex-1 overflow-y-auto"
          >
            <div className="p-6 lg:p-8">
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;