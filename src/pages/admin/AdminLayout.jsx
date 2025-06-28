import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/admin/Sidebar';
import { Helmet } from 'react-helmet';

const AdminLayout = () => {
  return (
    <>
      <Helmet>
        <title>Admin - Radiant Rage</title>
      </Helmet>
      <div className="flex h-screen bg-neutral-950 text-white">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;