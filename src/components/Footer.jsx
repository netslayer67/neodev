import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Animation Variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

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
    <footer className="bg-black text-white border-t border-white/10 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand */}
          <motion.div variants={item} className="lg:col-span-2">
            <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-white via-slate-300 to-white bg-clip-text text-transparent mb-4 tracking-wide">
              NEO DERVISH
            </h2>
            <p className="text-white/60 max-w-md text-sm leading-relaxed">
              Crafted for those who move with intention. Timeless silhouettes for bold spirits. Welcome to luxury, redefined.
            </p>
          </motion.div>

          {/* Explore Links */}
          <motion.div variants={item}>
            <h4 className="text-white font-semibold text-base mb-5 uppercase tracking-widest">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Shop All', to: '/shop' },
                { name: 'Our Story', to: '/about' },
                { name: 'Journal', to: '/journal' },
                { name: 'Contact', to: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="group flex items-center text-white/60 hover:text-white transition-colors">
                    {link.name}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={item}>
            <h4 className="text-white font-semibold text-base mb-5 uppercase tracking-widest">Support</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'FAQ', to: '/faq' },
                { name: 'Shipping & Returns', to: '/shipping' },
                { name: 'Sizing Guide', to: '/sizing' },
                { name: 'Admin Portal', to: '/admin' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="group flex items-center text-white/60 hover:text-white transition-colors">
                    {link.name}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg p-8 flex flex-col lg:flex-row justify-between items-center gap-6"
        >
          <div>
            <h4 className="text-white font-bold text-xl tracking-wide">Stay in the Know</h4>
            <p className="text-white/50 text-sm mt-1">Be the first to access exclusive drops & editorials.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-shrink-0 gap-2">
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full lg:w-80 h-12 bg-black/30 border border-white/20 text-white placeholder-white/40"
            />
            <Button type="submit" size="icon" className="h-12 w-12 bg-white text-black hover:bg-neutral-300 transition">
              <Send size={20} />
            </Button>
          </form>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-white/40 text-xs"
          >
            &copy; {new Date().getFullYear()} Neo Dervish. Crafted with clarity and vision.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {[{ Icon: Instagram }, { Icon: Twitter }, { Icon: Facebook }].map(({ Icon }, idx) => (
              <button
                key={idx}
                onClick={() => handleSocialClick(Icon.name)}
                className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white text-white/70 hover:text-black rounded-full transition duration-300 hover:scale-110"
              >
                <Icon size={18} />
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
