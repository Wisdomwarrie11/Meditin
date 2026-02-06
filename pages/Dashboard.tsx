
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BookOpen,
  LogOut,
  Bell,
  CreditCard,
  Target,
  UserCircle,
  Activity,
  ChevronRight,
  Loader2,
  Trophy,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { auth } from '../services/firebase';
import { logoutUser } from '../services/authService';
import { getMyBookings, getPerformanceScores, logPerformanceScore } from '../services/firestoreService';
import { PracticeSession, PerformanceScore } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<PracticeSession[]>([]);
  const [scores, setScores] = useState<PerformanceScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Manual Score Entry State
  const [newScore, setNewScore] = useState({ title: '', score: '' });
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        navigate('/auth');
      } else {
        setUser(u);
        try {
          const [userBookings, userScores] = await Promise.all([
            getMyBookings(u.uid),
            getPerformanceScores(u.uid)
          ]);
          setBookings(userBookings);
          setScores(userScores);
          checkForNotifications(userBookings);
        } catch (err) {
          console.error("Dashboard data fetch error:", err);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const checkForNotifications = (sessions: PracticeSession[]) => {
    const now = new Date();
    const imminentSession = sessions.find(s => {
      if (!s.paid) return false;
      const sessionTime = new Date(`${s.date}T${s.time}`);
      const diffMs = sessionTime.getTime() - now.getTime();
      const diffMins = diffMs / (1000 * 60);
      return diffMins > 0 && diffMins < 180; // Within 3 hours
    });

    if (imminentSession) {
      setActiveNotification(`Heads up! Your ${imminentSession.natureOfPractice} session starts in less than 3 hours.`);
    }
  };

  const handleLogScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScore.title || !newScore.score || !user) return;
    setIsLogging(true);
    try {
      const scoreData: PerformanceScore = {
        userId: user.uid,
        title: newScore.title,
        score: parseInt(newScore.score),
        date: Date.now(),
        category: 'Self-Reported'
      };
      await logPerformanceScore(scoreData);
      setScores(prev => [...prev, scoreData]);
      setNewScore({ title: '', score: '' });
    } catch (err) {
      console.error("Error logging score:", err);
    } finally {
      setIsLogging(false);
    }
  };

  const chartData = scores.map(s => ({
    name: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: s.score
  })).slice(-8); // Show last 8 assessments

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
      <div className="relative">
         <div className="w-20 h-20 border-4 border-slate-100 border-t-brandOrange rounded-full animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center">
            <img src="public/Logo.svg" className="w-10 h-10 opacity-50" alt="Meditin" />
         </div>
      </div>
      <p className="font-black text-navy uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Professional Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-32 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Notification Banner */}
        {activeNotification && (
          <div className="bg-navy p-5 rounded-[2rem] flex items-center justify-between text-white shadow-2xl animate-in slide-in-from-top duration-700">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brandOrange text-white rounded-xl flex items-center justify-center shadow-lg"><Bell size={20} className="animate-swing" /></div>
              <p className="text-sm font-black tracking-tight">{activeNotification}</p>
            </div>
            <button onClick={() => setActiveNotification(null)} className="text-white/40 hover:text-white transition-colors"><Plus className="rotate-45" size={24} /></button>
          </div>
        )}

        {/* Dynamic Greeting */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><Activity size={400} /></div>
          <div className="flex items-center gap-8 z-10">
            <div className="w-24 h-24 bg-navy text-white rounded-[2.5rem] flex items-center justify-center font-black text-4xl shadow-2xl relative">
              {user.displayName?.charAt(0) || 'P'}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brandOrange rounded-xl flex items-center justify-center border-4 border-white shadow-lg"><Trophy size={14} /></div>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-navy leading-none tracking-tighter">Hello, {user.displayName?.split(' ')[0] || 'Pro'}</h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">Tier: Aspiring Elite</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{user.email}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 z-10 shrink-0">
            <button 
              onClick={() => navigate('/book')}
              className="px-10 py-5 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-navy/20 hover:bg-brandOrange hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Plus size={18} /> New Mock Session
            </button>
            <button 
              onClick={() => { logoutUser(); navigate('/auth'); }}
              className="p-5 bg-white text-slate-400 border border-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Analytics Hub */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Sessions', val: bookings.length, icon: <BookOpen />, bg: 'bg-white' },
                { label: 'Success Readiness', val: `${scores.length ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0}%`, icon: <TrendingUp />, bg: 'bg-white' },
                { label: 'Completed', val: bookings.filter(b => b.paid).length, icon: <CheckCircle />, bg: 'bg-white' }
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all`}>
                  <div className="w-14 h-14 bg-navy text-white rounded-2xl flex items-center justify-center group-hover:bg-brandOrange transition-colors shrink-0">{stat.icon}</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-navy">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Pulse Chart */}
            <div className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-navy/5 text-navy rounded-2xl"><Activity size={24} /></div>
                  <h3 className="text-2xl font-black text-navy tracking-tight">Career Pulse</h3>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
                   <div className="w-2 h-2 bg-brandOrange rounded-full animate-pulse" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-time Progression</span>
                </div>
              </div>

              <div className="h-[350px] w-full">
                {scores.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px -10px rgba(0,33,71,0.1)', padding: '20px', fontWeight: 900}}
                      />
                      <Bar dataKey="score" fill="#002147" radius={[12, 12, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#F97316' : '#002147'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 italic border-4 border-dashed border-slate-50 rounded-[3rem]">
                    <Target size={60} strokeWidth={1} />
                    <p className="font-bold text-sm tracking-tight">No assessment data. Start by logging your first mock score.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Session History Table */}
            <div className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-navy">Professional Roadmap</h3>
                <span className="px-4 py-1.5 bg-navy/5 text-navy rounded-full text-[10px] font-black uppercase tracking-widest border border-navy/10">{bookings.length} Sessions Total</span>
              </div>
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="group p-8 bg-slate-50 hover:bg-white rounded-[2.5rem] border border-slate-100 hover:border-brandOrange transition-all hover:shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white text-navy rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-navy group-hover:text-white transition-all shrink-0">
                        <Calendar size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-navy">{booking.natureOfPractice}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.field}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${booking.paid ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                          {booking.paid ? 'Confirmed Slot' : 'Pending Payment'}
                       </span>
                       {!booking.paid ? (
                         <button 
                            onClick={() => navigate(`/payment/${booking.id}`)}
                            className="px-8 py-4 bg-brandOrange text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-navy transition-all shadow-xl shadow-brandOrange/20 flex items-center gap-2"
                         >
                            Secure Slot <CreditCard size={16} />
                         </button>
                       ) : (
                         <button className="p-4 bg-white text-navy rounded-full border border-slate-100 shadow-sm hover:scale-110 transition-transform">
                            <ChevronRight size={20} />
                         </button>
                       )}
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100 space-y-4">
                     <AlertCircle className="mx-auto text-slate-200" size={48} />
                     <p className="text-slate-400 font-bold italic">You haven't requested any practice sessions yet.</p>
                     <button onClick={() => navigate('/book')} className="text-brandOrange font-black uppercase text-xs tracking-widest hover:underline">Book Your First Mock</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="space-y-10">
            
            {/* Manual Performance Logger */}
            <div className="bg-navy rounded-[3.5rem] p-10 lg:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none rotate-12"><Trophy size={100} /></div>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-brandOrange text-white rounded-2xl flex items-center justify-center shadow-xl shadow-brandOrange/20"><Activity size={24} /></div>
                <h3 className="text-2xl font-black tracking-tighter">Log Performance</h3>
              </div>
              <form onSubmit={handleLogScore} className="space-y-8 flex-1 relative z-10">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Assessment Name</label>
                    <input 
                        type="text" 
                        required 
                        value={newScore.title}
                        onChange={e => setNewScore({...newScore, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:bg-white/10 focus:border-brandOrange outline-none transition-all font-bold text-white placeholder:text-white/20" 
                        placeholder="e.g. Board Mock #4" 
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Percentage Result (%)</label>
                    <input 
                        type="number" 
                        max="100" 
                        min="0" 
                        required 
                        value={newScore.score}
                        onChange={e => setNewScore({...newScore, score: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:bg-white/10 focus:border-brandOrange outline-none transition-all font-bold text-white placeholder:text-white/20" 
                        placeholder="85" 
                    />
                </div>
                <button 
                  disabled={isLogging}
                  className="w-full py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-navy hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brandOrange/30 flex items-center justify-center gap-3 mt-4"
                >
                  {isLogging ? <Loader2 className="animate-spin" /> : <ChevronRight size={20} />} Log Assessment
                </button>
              </form>
              <div className="mt-12 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                 <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Why Log Manual Scores?</p>
                 <p className="text-xs text-white/50 leading-relaxed font-medium">Self-reporting helps Meditin calibrate your readiness rank and unlocks advanced AI-driven feedback in your next mock session.</p>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="bg-white rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform"><UserCircle size={100} /></div>
               <h3 className="text-2xl font-black text-navy mb-10 tracking-tighter">Your Profile</h3>
               <div className="space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-brandOrange group-hover:text-white transition-all"><Briefcase size={20} /></div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Applying For</p>
                        <p className="text-sm font-black text-navy truncate max-w-[180px]">{user.displayName || 'Professional'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-brandOrange group-hover:text-white transition-all"><BookOpen size={20} /></div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Experience Range</p>
                        <p className="text-sm font-black text-navy">Verified Advanced</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-brandOrange group-hover:text-white transition-all"><CheckCircle size={20} /></div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Preparation Verified</p>
                        <p className="text-sm font-black text-navy">Level 1 Complete</p>
                     </div>
                  </div>
               </div>
               <button onClick={() => navigate('/book')} className="w-full mt-10 py-5 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-navy hover:text-white transition-all border border-slate-100">Edit Professional Specs</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
