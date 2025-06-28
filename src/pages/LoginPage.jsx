import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pageTransition } from '@/lib/motion';

const LoginPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="container mx-auto px-6 pt-32 pb-16 flex items-center justify-center min-h-[80vh]"
    >
      <Helmet>
        <title>Login - Radiant Rage</title>
      </Helmet>
      
      <div className="w-full max-w-md glass-card p-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-heading tracking-wider text-white">LOGIN</h1>
            <p className="text-neutral-400 mt-2">Welcome back.</p>
        </div>

        <form className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="bg-neutral-800 border-neutral-700"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="bg-neutral-800 border-neutral-700"/>
            </div>
            <Button size="lg" className="w-full bg-white text-black hover:bg-neutral-300 rounded-full font-bold">
                Sign In
            </Button>
        </form>

        <div className="text-center mt-6">
            <p className="text-sm text-neutral-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-white hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;