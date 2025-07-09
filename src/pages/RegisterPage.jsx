import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pageTransition } from '@/lib/motion';

const RegisterPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-black px-6 py-20"
    >
      <Helmet>
        <title>Create Account - Neo Dervish</title>
        <meta name="description" content="Create your Neo Dervish account and join the movement. Experience exclusive fashion, tailored for the bold." />
      </Helmet>

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

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="bg-neutral-800/80 border border-white/10 placeholder-neutral-500 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-neutral-800/80 border border-white/10 placeholder-neutral-500 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-neutral-800/80 border border-white/10 placeholder-neutral-500 text-white"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-4 bg-white text-black hover:bg-neutral-300 rounded-full font-bold transition-colors"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-neutral-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-white font-semibold hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;
