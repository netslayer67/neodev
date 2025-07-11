import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// 1. Import action dari authSlice
import { registerUser } from '../store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { pageTransition } from '@/lib/motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Ambil status untuk menonaktifkan tombol saat loading
  const { status } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    try {
      // 2. Dispatch action registerUser dan tunggu hasilnya dengan .unwrap()
      await dispatch(registerUser(formData)).unwrap();

      // 3. Jika berhasil, tampilkan notifikasi dan arahkan ke profil
      toast({ title: "Registration Successful!", description: "Welcome to Neo Dervish." });
      navigate('/profile');
    } catch (error) {
      // Jika gagal, tampilkan pesan error dari backend
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An error occurred. Please try again.",
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
          <h1 className="text-4xl font-heading text-white tracking-wider">Create Account</h1>
          <p className="text-neutral-400 text-sm mt-2">Join the Neo Dervish collective.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Full Name</Label>
            <Input id="name" type="text" value={formData.name} onChange={handleChange} required className="bg-neutral-800/80 border border-white/10 placeholder-neutral-500 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="bg-neutral-800/80 border border-white/10 placeholder-neutral-500 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleChange} required className="bg-neutral-800/80 border border-white/10 placeholder-neutral-500 text-white" />
          </div>
          <Button type="submit" size="lg" className="w-full mt-4 bg-white text-black hover:bg-neutral-300 rounded-full font-bold transition-colors" disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline transition-colors">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage; 