import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Basic sanitizer (remove HTML/script + suspicious links)
const sanitizeInput = (val) =>
  val.replace(/(<([^>]+)>)/gi, "").replace(/(https?:\/\/[^\s]+)/g, "");

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: sanitizeInput(e.target.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Password must be at least 6 characters.",
      });
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
      toast({
        title: "Account Created",
        description: "Welcome aboard!",
      });
      navigate("/profile");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.message || "Something went wrong. Try again.",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-6 py-12 overflow-hidden bg-background">
      {/* Decorative Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-120px] left-[-100px] w-96 h-96 bg-accent/25 blur-3xl rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-primary/30 blur-3xl rounded-full"
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
            Create Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join us and start your journey today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-foreground/90">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="pl-10 bg-input border border-border placeholder-muted-foreground text-foreground rounded-xl focus:ring-2 focus:ring-accent transition-all duration-320"
                placeholder="John Doe"
              />
            </div>
          </div>

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
                autoComplete="new-password"
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
              <UserPlus className="w-5 h-5" />
              {status === "loading" ? "Signing up..." : "Register"}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent hover:underline hover:text-accent-foreground transition-colors duration-320"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
