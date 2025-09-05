import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const { toast } = useToast();

  const handleSocialClick = (name) => {
    toast({
      title: "🔗 Opening...",
      description: `Redirecting to ${name}.`,
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast({
        title: "🎉 Subscribed!",
        description: "Welcome aboard. Stay tuned.",
      });
      e.target.reset();
    } else {
      toast({
        title: "⚠️ Oops!",
        description: "Please enter a valid email.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="relative bg-[#0F0F1A] text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F1A] via-[#1E2A47] to-[#0F0F1A]" />
        {/* Grain texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
        {/* Blobs */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-28 -left-20 w-96 h-96 bg-[#8A5CF6]/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-120px] right-[-120px] w-[450px] h-[450px] bg-[#1E2A47]/40 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12">
        {/* Top Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#8A5CF6] to-white">
              NEO DERVISH
            </h2>
            <p className="text-sm text-white/70 max-w-md">
              Bold pieces, clean spirit. Designed to last.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-5">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Shop All", to: "/shop" },
                { name: "Our Story", to: "/about" },
                { name: "Journal", to: "/journal" },
                { name: "Contact", to: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="group flex items-center text-white/60 hover:text-white transition-all"
                  >
                    {link.name}
                    <span className="ml-2 group-hover:opacity-100 opacity-0 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-5">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "FAQ", to: "/faq" },
                { name: "Shipping & Returns", to: "/shipping" },
                { name: "Sizing Guide", to: "/sizing" },
                { name: "Admin Portal", to: "/admin" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="group flex items-center text-white/60 hover:text-white transition-all"
                  >
                    {link.name}
                    <span className="ml-2 group-hover:opacity-100 opacity-0 transition-opacity">
                      →
                    </span>
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
          className="mt-16 rounded-3xl bg-white/5 backdrop-blur-xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-6 border border-white/10"
        >
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-white">
              Stay in the Loop
            </h4>
            <p className="text-sm text-white/60 mt-1">
              Early access to drops & updates.
            </p>
          </div>
          <form
            onSubmit={handleNewsletterSubmit}
            className="w-full lg:w-auto flex gap-2"
          >
            <Input
              name="email"
              type="email"
              placeholder="Your email"
              className="w-full lg:w-80 h-12 bg-white/10 border border-white/20 text-white placeholder-white/40"
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-12 bg-[#8A5CF6] hover:bg-[#7A4BE0] transition text-white rounded-full"
            >
              <Send size={16} />
            </Button>
          </form>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Neo Dervish. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[{ Icon: Instagram }, { Icon: Twitter }, { Icon: Facebook }].map(
              ({ Icon }, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSocialClick(Icon.name)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-[#8A5CF6] text-white/70 hover:text-white rounded-full transition-all duration-300"
                >
                  <Icon size={18} />
                </motion.button>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
