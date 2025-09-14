import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import { Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const sanitizeInput = (val) =>
  val.replace(/(<([^>]+)>)/gi, "").replace(/(https?:\/\/[^\s]+)/g, "");

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: sanitizeInput(e.target.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      navigate(result.user.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: err.message || "Email atau password salah.",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-6 py-12 overflow-hidden bg-background">
      {/* Blobs */}
      <motion.div

        className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl"
      />
      <motion.div

        className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 glass-card shadow-xl"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-foreground via-secondary to-foreground bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground/90">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 bg-input border border-border placeholder-muted-foreground text-foreground rounded-xl focus:ring-2 focus:ring-accent transition-all duration-320"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground/90">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="pl-10 bg-input border border-border placeholder-muted-foreground text-foreground rounded-xl focus:ring-2 focus:ring-accent transition-all duration-320"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Button */}
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              size="lg"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 btn-primary rounded-full py-3 hover:opacity-90 transition-opacity duration-320 disabled:opacity-60"
            >
              <LogIn className="w-5 h-5" />
              {status === "loading" ? "Signing in..." : "Login"}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-accent hover:underline hover:text-accent-foreground transition-colors duration-320"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
