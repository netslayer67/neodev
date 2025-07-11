import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// 1. Import action loginUser
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
      // 1. Dispatch action dan simpan hasilnya
      const resultAction = await dispatch(loginUser(formData)).unwrap();

      // 2. Lakukan pengecekan role dari payload yang dikembalikan
      if (resultAction.user.role === 'admin') {
        // Jika role adalah admin, arahkan ke dashboard admin
        navigate('/admin');
      } else {
        // Jika bukan admin, arahkan ke halaman profil pengguna biasa
        navigate('/profile');
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
      });
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-black px-6 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading text-white tracking-wider">Welcome Back</h1>
          <p className="text-neutral-400 text-sm mt-2">Login to continue your journey</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="bg-neutral-800/80 border border-white/10 placeholder-neutral-500 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleChange} required className="bg-neutral-800/80 border border-white/10 placeholder-neutral-500 text-white" />
          </div>
          <Button type="submit" size="lg" className="w-full mt-4 bg-white text-black hover:bg-neutral-300 rounded-full font-bold transition-colors" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-neutral-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-semibold hover:underline transition-colors">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;