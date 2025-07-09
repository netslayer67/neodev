import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- Animation Variants for Staggering ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

const Footer = () => {
  const { toast } = useToast();

  const handleSocialClick = (socialMedia) => {
    toast({
      title: "🚀 Connecting...",
      description: `Redirecting you to our ${socialMedia} page. Stay tuned!`,
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast({
        title: "✅ Subscribed!",
        description: "Thanks for joining our mailing list. Welcome to the club.",
      });
      e.target.reset();
    } else {
      toast({
        title: "⚠️ Whoops!",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="bg-black border-t border-white/10 overflow-hidden">
      <div className="container mx-auto px-6 pt-24 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand & Mission */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white tracking-wider mb-4">
              NEO DERVISH
            </h3>
            <p className="text-neutral-400 max-w-md text-sm leading-relaxed">
              Apparel designed with intention. Made for bold thinkers and aesthetic souls. We believe in movement—not just of the body, but of the soul.
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold text-base mb-5 tracking-wide">Explore</h4>
            <ul className="space-y-3">
              {[
                { name: 'Shop All', to: '/shop' },
                { name: 'Our Story', to: '/about' },
                { name: 'Journal', to: '/journal' },
                { name: 'Contact', to: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm group">
                    {link.name} <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold text-base mb-5 tracking-wide">Support</h4>
            <ul className="space-y-3">
              {[
                { name: 'FAQ', to: '/faq' },
                { name: 'Shipping & Returns', to: '/shipping' },
                { name: 'Sizing Guide', to: '/sizing' },
                { name: 'Admin Portal', to: '/admin' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm group">
                    {link.name} <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter & Socials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
          className="mt-20 p-8 bg-white/5 rounded-2xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div>
            <h4 className="text-white font-bold text-xl tracking-wide">Join The Movement</h4>
            <p className="text-neutral-400 text-sm mt-1">Get early access to new drops and exclusive content.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex-shrink-0 flex gap-2">
            <Input name="email" type="email" placeholder="Enter your email" className="w-full lg:w-80 bg-black/20 border-white/20 h-12" />
            <Button type="submit" size="icon" className="h-12 w-12 bg-white text-black flex-shrink-0 hover:bg-neutral-200">
              <Send size={20} />
            </Button>
          </form>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-neutral-500 text-xs"
          >
            &copy; {new Date().getFullYear()} Neo Dervish. All rights reserved.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {[
              { Icon: Instagram, name: 'Instagram' },
              { Icon: Twitter, name: 'Twitter' },
              { Icon: Facebook, name: 'Facebook' }
            ].map(({ Icon, name }) => (
              <button
                key={name}
                onClick={() => handleSocialClick(name)}
                className="w-9 h-9 flex items-center justify-center bg-white/5 text-neutral-400 border border-white/10 rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:scale-110"
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