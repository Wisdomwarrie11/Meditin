
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, ChevronLeft, AlertCircle } from 'lucide-react';
import { registerUser, loginUser } from '../services/authService';
import { db } from '../services/firebase';

// Fix: Replaced useHistory with useNavigate for compatibility with React Router v6
const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      let user;
      if (isLogin) {
        user = await loginUser(formData.email, formData.password);
      } else {
        user = await registerUser(formData.email, formData.password, formData.name);
      }
      
      if (user) {
        // Check if user has already completed their professional profile using compat namespaced API
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        // If professionalField exists, they've done the profile step
        if (userData && userData.professionalField) {
          navigate('/dashboard');
        } else {
          navigate('/book');
        }
      }
    } catch (err: any) {
      console.error(err);
      let message = 'An error occurred during authentication.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      }
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white selection:bg-brandOrange selection:text-white">
      {/* Left: Branding & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brandOrange/20 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 space-y-8">
          <div className="p-4 bg-brandOrange inline-block rounded-3xl text-white shadow-2xl rotate-6 animate-pulse">
            <Sparkles size={48} />
          </div>
          <h2 className="text-7xl font-black text-white leading-none tracking-tighter">
            Join the <br /> elite.
          </h2>
          <p className="text-xl text-white/50 font-medium max-w-md">
            The world's best professionals start their journey right here. One account, total access to mocks, tests, and expert reviews.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-20 relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 sm:top-10 sm:left-10 p-4 text-slate-400 hover:text-navy transition-colors flex items-center gap-2 font-black uppercase text-xs tracking-widest"
        >
          <ChevronLeft size={16} /> Home
        </button>

        <div className="w-full max-w-md space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-right duration-700">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-navy mb-2 sm:mb-4 tracking-tighter">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-tight">
              {isLogin ? 'Login to access your dashboard and mocks.' : 'Create your account to start your professional journey.'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs sm:text-sm font-bold animate-in shake">
              <AlertCircle size={20} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4 sm:space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brandOrange transition-colors" size={20} />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.2rem] sm:rounded-[1.5rem] py-4 sm:py-5 pl-14 pr-8 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy text-sm sm:text-base"
                    placeholder="Enter your name" 
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brandOrange transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.2rem] sm:rounded-[1.5rem] py-4 sm:py-5 pl-14 pr-8 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy text-sm sm:text-base"
                  placeholder="name@email.com" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brandOrange transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.2rem] sm:rounded-[1.5rem] py-4 sm:py-5 pl-14 pr-8 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy text-sm sm:text-base"
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-5 sm:py-6 bg-navy text-white rounded-full font-black text-lg sm:text-xl hover:bg-brandOrange transition-all shadow-2xl shadow-navy/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Login' : 'Create Account')}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-[10px] sm:text-sm font-black text-slate-400 hover:text-navy uppercase tracking-widest transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
