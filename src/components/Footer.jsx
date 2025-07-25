import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const { toast } = useToast();

  const handleSocialClick = (name) => {
    toast({
      title: '🔗 Opening...',
      description: `Redirecting to ${name}.`,
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast({
        title: '🎉 Subscribed!',
        description: 'Thanks for joining our circle. Premium drops incoming.',
      });
      e.target.reset();
    } else {
      toast({
        title: '⚠️ Oops!',
        description: 'Please enter a valid email.',
        variant: 'destructive',
      });
    }
  };

  return (
    <footer className="bg-black text-white backdrop-blur-2xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Grid Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-4xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-300 to-white">
              NEO DERVISH
            </h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-md">
              Crafted for those who move with intention. Timeless silhouettes for bold spirits. Welcome to luxury, redefined.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-5">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Shop All', to: '/shop' },
                { name: 'Our Story', to: '/about' },
                { name: 'Journal', to: '/journal' },
                { name: 'Contact', to: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="group flex items-center text-white/60 hover:text-white transition-all"
                  >
                    {link.name}
                    <span className="ml-2 group-hover:opacity-100 opacity-0 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'FAQ', to: '/faq' },
                { name: 'Shipping & Returns', to: '/shipping' },
                { name: 'Sizing Guide', to: '/sizing' },
                { name: 'Admin Portal', to: '/admin' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="group flex items-center text-white/60 hover:text-white transition-all"
                  >
                    {link.name}
                    <span className="ml-2 group-hover:opacity-100 opacity-0 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-8 flex flex-col lg:flex-row justify-between items-center gap-6 border border-white/10"
        >
          <div>
            <h4 className="text-xl font-bold text-white tracking-tight">Stay in the Know</h4>
            <p className="text-sm text-white/60 mt-1">
              Be the first to access exclusive drops & editorials.
            </p>
          </div>
          <form
            onSubmit={handleNewsletterSubmit}
            className="w-full lg:w-auto flex gap-2"
          >
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full lg:w-80 h-12 bg-white/10 border border-white/20 text-white placeholder-white/40"
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 bg-white text-black hover:bg-neutral-300 transition"
            >
              <Send size={20} />
            </Button>
          </form>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} Neo Dervish. Crafted with clarity and vision.</p>
          <div className="flex gap-4">
            {[{ Icon: Instagram }, { Icon: Twitter }, { Icon: Facebook }].map(({ Icon }, idx) => (
              <button
                key={idx}
                onClick={() => handleSocialClick(Icon.name)}
                className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white text-white/70 hover:text-black rounded-full transition-all duration-300 hover:scale-110"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
