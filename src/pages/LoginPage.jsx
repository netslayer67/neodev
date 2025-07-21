import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { pageTransition } from '@/lib/motion';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData)).unwrap();
      if (resultAction.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid email or password.',
      });
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-6 py-20 font-sans"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_8px_30px_rgba(255,255,255,0.05)] p-10 relative"
      >
        {/* Glow circle for ambient luxury effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl z-0"
        />

        <div className="relative z-10 text-center mb-10">
          <h1 className="text-4xl font-display text-white tracking-wide leading-tight">
            Step into Your Exclusive Space
          </h1>
          <p className="text-sm text-white/50 mt-2">
            Luxury meets simplicity — welcome back.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-sm">Email Address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-white/5 border border-white/10 placeholder-white/40 text-white focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white text-sm">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-white/5 border border-white/10 placeholder-white/40 text-white focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all rounded-xl"
            />
          </div>

          <motion.div whileTap={{ scale: 0.97 }} className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-white text-black font-bold tracking-wide rounded-full py-3 hover:bg-neutral-200 transition-all disabled:opacity-70"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Authenticating...' : 'Enter'}
            </Button>
          </motion.div>
        </form>

        <div className="text-center mt-6 text-sm text-white/60 relative z-10">
          New here?{' '}
          <Link
            to="/register"
            className="text-white font-medium underline hover:text-indigo-300 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
