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

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message || "Invalid email or password.",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-6 py-12 overflow-hidden bg-gradient-to-br from-[#0F0F1A] via-[#1E2A47] to-[#0F0F1A]">
      {/* Decorative Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-120px] left-[-100px] w-96 h-96 bg-[#8A5CF6]/30 blur-3xl rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-[#1E2A47]/40 blur-3xl rounded-full"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-lg"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Sign in to continue your journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-white">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 bg-white/10 border border-white/10 placeholder-white/40 text-white rounded-xl focus:ring-2 focus:ring-[#8A5CF6] focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-white">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pl-10 bg-white/10 border border-white/10 placeholder-white/40 text-white rounded-xl focus:ring-2 focus:ring-[#8A5CF6] focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Button */}
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              size="lg"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8A5CF6] to-[#1E2A47] text-white font-semibold rounded-full py-3 hover:opacity-90 transition disabled:opacity-70"
              disabled={status === "loading"}
            >
              <LogIn className="w-5 h-5" />
              {status === "loading" ? "Signing in..." : "Login"}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-white/60">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#8A5CF6] hover:underline hover:text-[#a27af8] transition"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
