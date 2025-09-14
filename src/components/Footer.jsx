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
    const email = e.target.email.value.trim();

    // Basic sanitization
    if (!email || /<script|http:|https:|.php|.exe/i.test(email)) {
      toast({
        title: "⚠️ Invalid Input",
        description: "Please enter a valid email address only.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "🎉 Subscribed!",
      description: "Welcome aboard. Stay tuned.",
    });
    e.target.reset();
  };

  return (
    <footer className="relative overflow-hidden bg-background text-foreground">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />

        {/* Blobs */}
        <motion.div

          className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl"
        />
        <motion.div

          className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
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
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-accent to-secondary">
              NEO DERVISH
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Bold pieces, clean spirit. Designed to last.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/80 mb-5">
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
                    className="group flex items-center text-muted-foreground hover:text-foreground transition-colors duration-320"
                  >
                    {link.name}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-320">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/80 mb-5">
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
                    className="group flex items-center text-muted-foreground hover:text-foreground transition-colors duration-320"
                  >
                    {link.name}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-320">
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
          className="mt-16 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-6"
        >
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-foreground">
              Stay in the Loop
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
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
              className="w-full lg:w-80 h-12 bg-card/40 border border-border text-foreground placeholder-muted-foreground"
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 rounded-full bg-accent text-accent-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors duration-320"
            >
              <Send size={18} />
            </Button>
          </form>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground">
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
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-card/40 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-320"
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
