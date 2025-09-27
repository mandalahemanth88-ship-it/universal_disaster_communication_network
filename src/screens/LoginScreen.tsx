import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabase';
import { useNotificationStore } from '../stores/useNotificationStore';
import { AtSign, Lock, LogIn, UserPlus, Loader } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let error;
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        error = signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (!signUpError) {
          addNotification({ message: 'Check your email for verification!', type: 'info' });
        }
        error = signUpError;
      }

      if (error) {
        throw error;
      }
    } catch (error: any) {
      addNotification({ message: error.message || 'Authentication failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm p-8 space-y-6 bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 text-white"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">🚨 DisasterLink Pro</h1>
          <p className="mt-2 text-white/80">{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary-400 focus:outline-none transition"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-3 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary-400 focus:outline-none transition"
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" /> : (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}</span>
          </motion.button>
        </form>

        <div className="text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary-300 hover:underline">
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
