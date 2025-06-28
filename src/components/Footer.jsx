import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
  const { toast } = useToast();
  
  const handleSocialClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <footer className="bg-black/30 border-t border-white/10 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-heading tracking-wider text-white mb-4">RADIANT RAGE</h3>
            <p className="text-neutral-400 text-center md:text-left text-sm max-w-xs">A minimalist aesthetic for the modern soul. High-quality apparel designed with purpose.</p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-neutral-400 hover:text-white transition">Shop</Link></li>
              <li><Link to="/about" className="text-neutral-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="text-neutral-400 hover:text-white transition">Contact</Link></li>
              <li><Link to="/admin" className="text-neutral-400 hover:text-white transition">Admin</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <button onClick={handleSocialClick} className="text-neutral-400 hover:text-white transition"><Instagram /></button>
              <button onClick={handleSocialClick} className="text-neutral-400 hover:text-white transition"><Twitter /></button>
              <button onClick={handleSocialClick} className="text-neutral-400 hover:text-white transition"><Facebook /></button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-neutral-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Radiant Rage. All Rights Reserved.</p>
          <p className="mt-1 font-heading text-lg tracking-widest">IN GOD WE FEAR</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;