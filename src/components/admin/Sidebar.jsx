import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  ];

  const activeLinkStyle = {
    backgroundColor: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))',
  };

  return (
    <div className="h-full w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-heading tracking-wider text-white">RR / ADMIN</h1>
      </div>
      <nav className="flex-grow px-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            end={link.href === '/admin'}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="flex items-center gap-3 px-4 py-3 my-1 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <link.icon size={20} />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-neutral-800">
        <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors"
        >
            <LogOut size={20} />
            <span>Exit Admin</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;