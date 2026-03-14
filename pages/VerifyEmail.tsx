
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, LogOut, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { auth } from '../services/firebase';
import { reloadUser, resendVerificationEmail, logoutUser } from '../services/authService';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // If user is already verified, send them to dashboard
    if (auth.currentUser?.emailVerified) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      const user = await reloadUser();
      if (user?.emailVerified) {
        navigate('/dashboard');
      } else {
        setMessage({ type: 'error', text: 'Email not verified yet. Please check your inbox.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to check status. Please try again.' });
    } finally {
      setIsChecking(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setMessage(null);
    try {
      await resendVerificationEmail();
      setMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' });
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        setMessage({ type: 'error', text: 'Too many requests. Please wait a moment before trying again.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to resend email. Please try again.' });
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center space-y-8">
        <div className="w-20 h-20 bg-brandOrange/10 text-brandOrange rounded-[2rem] flex items-center justify-center mx-auto">
          <Mail size={40} />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-navy tracking-tight">Verify Your Email</h1>
          <p className="text-slate-500 font-medium">
            We've sent a verification link to <span className="text-navy font-bold">{auth.currentUser?.email}</span>. 
            Please click the link to activate your account.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top duration-300 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full py-5 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brandOrange transition-all shadow-xl shadow-navy/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isChecking ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
            I've Verified My Email
          </button>

          <button 
            onClick={handleResend}
            disabled={isResending}
            className="w-full py-5 bg-white text-navy border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isResending ? <Loader2 className="animate-spin" /> : <Mail size={18} />}
            Resend Verification Email
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-500 font-black uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <LogOut size={14} /> Logout & Try Another Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
