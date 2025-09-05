import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, User, X } from "lucide-react";

import Sidebar from "@/components/admin/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DashboardHeader = ({ onMenuClick }) => (
  <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-10 bg-white/10 backdrop-blur-md border-b border-white/10 z-30">
    <div className="flex items-center gap-3">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden text-white/80 hover:bg-white/10 hover:text-white rounded-xl"
      >
        <Menu size={22} />
      </Button>

      {/* Search (hidden on small screens) */}
      <div className="hidden md:block relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
        />
        <Input
          placeholder="Search..."
          className="w-56 lg:w-72 bg-white/10 border-white/10 pl-10 h-11 text-white placeholder:text-white/40 rounded-xl"
        />
      </div>
    </div>

    <div className="flex items-center gap-3 sm:gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
      >
        <Bell size={20} />
      </Button>
      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#8A5CF6] to-[#1E2A47] flex items-center justify-center shadow-inner">
        <User size={20} className="text-white" />
      </div>
    </div>
  </header>
);

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard – NEO DERVISH</title>
        <body className="font-sans overflow-hidden bg-[#0F0F1A] text-white" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-[#0F0F1A] via-[#1E2A47] to-[#0F0F1A]">
        {/* --- Decorative Blob Background --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25, scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-72 h-72 bg-[#8A5CF6]/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2, scale: [1.1, 1, 1.1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E2A47]/50 rounded-full blur-3xl"
        />

        {/* --- Desktop Sidebar --- */}
        <aside className="hidden lg:block w-72 flex-shrink-0 z-20 bg-white/5 backdrop-blur-md border-r border-white/10">
          <Sidebar />
        </aside>

        {/* --- Mobile Sidebar (Drawer) --- */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              {/* Drawer Panel */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="fixed top-0 left-0 w-72 h-full z-50 bg-gradient-to-b from-[#1E2A47] to-[#0F0F1A] border-r border-white/10 shadow-2xl"
              >
                <Sidebar />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-5 right-5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <X size={22} />
                </Button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* --- Main Content --- */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 overflow-y-auto scroll-smooth bg-white/5 backdrop-blur-md"
          >
            <div className="p-5 sm:p-6 md:p-8">
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
