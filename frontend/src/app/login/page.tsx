"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/auth/signin', { username, password });
      const { token, id, roles } = res.data;
      login(token, { id, username: res.data.username, roles });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden relative font-sans">
      <div className="absolute w-[600px] h-[600px] bg-purple-300 rounded-full blur-[150px] opacity-40 top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-orange-200 rounded-full blur-[120px] opacity-40 bottom-[-50px] right-[-100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-purple-100/50 to-transparent pointer-events-none"></div>
      
      <div className="bg-white/90 w-full max-w-md p-8 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-10 relative overflow-hidden border border-white">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20">
             <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm font-medium">Log in to manage your tasks effectively</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B35] hover:bg-[#ff7e4f] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/20 transform transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-purple-600 font-semibold hover:text-orange-500 transition-colors">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
