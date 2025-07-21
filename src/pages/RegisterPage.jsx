import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { pageTransition } from '@/lib/motion';
import { Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
      toast({
        title: 'Welcome Aboard',
        description: 'Your journey with Neo Dervish begins now.',
      });
      navigate('/profile');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-6 py-24 font-sans"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(255,255,255,0.05)] p-10"
      >
        {/* Ambient floating glass light */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute -top-28 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl z-0"
        />

        <div className="text-center mb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mx-auto mb-4 text-indigo-300"
          >
            <Sparkles className="mx-auto h-8 w-8" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-display text-white leading-tight tracking-wide">
            Begin Your Journey
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Join the Neo Dervish collective — it all starts here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white text-sm">Full Name</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-white/5 border border-white/10 placeholder-white/40 text-white focus:ring-2 focus:ring-indigo-300/30 focus:outline-none transition-all rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-sm">Email Address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-white/5 border border-white/10 placeholder-white/40 text-white focus:ring-2 focus:ring-indigo-300/30 focus:outline-none transition-all rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white text-sm">Create Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-white/5 border border-white/10 placeholder-white/40 text-white focus:ring-2 focus:ring-indigo-300/30 focus:outline-none transition-all rounded-xl"
            />
          </div>

          <motion.div whileTap={{ scale: 0.97 }} className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-white text-black font-bold tracking-wide rounded-full py-3 hover:bg-neutral-200 transition-all disabled:opacity-70"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Creating Account...' : 'Create Account'}
            </Button>
          </motion.div>
        </form>

        <div className="text-center mt-6 text-sm text-white/60 relative z-10">
          Already a member?{' '}
          <Link
            to="/login"
            className="text-white font-medium underline hover:text-indigo-300 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;
