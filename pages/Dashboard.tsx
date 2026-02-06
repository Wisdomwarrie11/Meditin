
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
    <div className="min-h-screen bg-[#F8FAFC] pb-12 pt-24 sm:pb-24 sm:pt-32 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
        
        {/* Notification Banner */}
        {activeNotification && (
          <div className="bg-navy p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] flex items-center justify-between text-white shadow-2xl animate-in slide-in-from-top duration-700">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brandOrange text-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shrink-0"><Bell size={16} className="animate-swing" /></div>
              <p className="text-xs sm:text-sm font-black tracking-tight leading-tight">{activeNotification}</p>
            </div>
            <button onClick={() => setActiveNotification(null)} className="text-white/40 hover:text-white transition-colors p-1"><Plus className="rotate-45" size={20} /></button>
          </div>
        )}

        {/* Dynamic Greeting */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-10 bg-white p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 hidden sm:block"><Activity size={400} /></div>
          <div className="flex items-center gap-4 sm:gap-8 z-10">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-navy text-white rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center font-black text-2xl sm:text-4xl shadow-2xl relative shrink-0">
              {user.displayName?.charAt(0) || 'P'}
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-brandOrange rounded-lg sm:rounded-xl flex items-center justify-center border-2 sm:border-4 border-white shadow-lg"><Trophy size={10} className="sm:size-[14px]" /></div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-navy leading-none tracking-tighter">Hello, {user.displayName?.split(' ')[0] || 'Pro'}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-slate-200">Tier: Aspiring Elite</span>
                <span className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest truncate max-w-[150px]">{user.email}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 z-10 shrink-0 mt-2 sm:mt-0">
            <button 
              onClick={() => navigate('/book')}
              className="flex-1 sm:flex-none px-6 sm:px-10 py-4 sm:py-5 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[8px] sm:text-[10px] shadow-2xl shadow-navy/20 hover:bg-brandOrange hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} className="sm:size-[18px]" /> New Mock
            </button>
            <button 
              onClick={() => { logoutUser(); navigate('/auth'); }}
              className="p-4 sm:p-5 bg-white text-slate-400 border border-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm shrink-0"
            >
              <LogOut size={16} className="sm:size-[20px]" />
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
          
          {/* Main Analytics Hub */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-10">
            
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: 'Sessions', val: bookings.length, icon: <BookOpen />, color: 'bg-navy' },
                { label: 'Readiness', val: `${scores.length ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0}%`, icon: <TrendingUp />, color: 'bg-navy' },
                { label: 'Completed', val: bookings.filter(b => b.paid).length, icon: <CheckCircle />, color: 'bg-navy', hideOnMobile: true }
              ].map((stat, i) => (
                <div key={i} className={`bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 group hover:shadow-xl transition-all ${stat.hideOnMobile ? 'hidden sm:flex' : 'flex'}`}>
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 ${stat.color} text-white rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-brandOrange transition-colors shrink-0`}>
                    {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 18 })}
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-black text-navy leading-none">{stat.val}</p>
                  </div>
                </div>
              ))}
              {/* Mobile Only 3rd Stat to fill grid */}
              <div className="sm:hidden bg-white p-5 rounded-3xl border border-slate-100 flex flex-col items-start gap-3">
                 <div className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center"><CheckCircle size={18} /></div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Paid</p>
                    <p className="text-lg font-black text-navy leading-none">{bookings.filter(b => b.paid).length}</p>
                 </div>
              </div>
            </div>

            {/* Performance Pulse Chart */}
            <div className="bg-white p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8 sm:mb-12">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-navy/5 text-navy rounded-xl sm:rounded-2xl"><Activity size={20} className="sm:size-[24px]" /></div>
                  <h3 className="text-xl sm:text-2xl font-black text-navy tracking-tight">Career Pulse</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-slate-50 border border-slate-100 rounded-full">
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brandOrange rounded-full animate-pulse" />
                   <span className="text-[7px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-time Progression</span>
                </div>
              </div>

              <div className="h-[250px] sm:h-[350px] w-full">
                {scores.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 8, fontWeight: 900}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 8, fontWeight: 900}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,33,71,0.1)', padding: '12px', fontWeight: 900, fontSize: '12px'}}
                      />
                      <Bar dataKey="score" fill="#002147" radius={[8, 8, 0, 0]} barSize={30}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#F97316' : '#002147'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 italic border-2 sm:border-4 border-dashed border-slate-50 rounded-2xl sm:rounded-[3rem] p-6 text-center">
                    <Target size={40} className="sm:size-[60px]" strokeWidth={1} />
                    <p className="font-bold text-xs sm:text-sm tracking-tight">No assessment data. Log your first mock score to see analytics.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Session History */}
            <div className="bg-white p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[3.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8 sm:mb-12">
                <h3 className="text-xl sm:text-2xl font-black text-navy">Roadmap</h3>
                <span className="px-3 py-1 bg-navy/5 text-navy rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-navy/10">{bookings.length} Total</span>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="group p-5 sm:p-8 bg-slate-50 hover:bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-100 hover:border-brandOrange transition-all hover:shadow-xl flex flex-col gap-4">
                    <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white text-navy rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-navy group-hover:text-white transition-all shrink-0">
                           <Calendar size={20} className="sm:size-[28px]" />
                         </div>
                         <div>
                           <h4 className="text-sm sm:text-xl font-black text-navy leading-tight">{booking.natureOfPractice}</h4>
                           <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[7px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.field}</span>
                              <span className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                              <span className="text-[7px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(booking.date).toLocaleDateString()}</span>
                           </div>
                         </div>
                       </div>
                       <div className="hidden sm:block">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${booking.paid ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                             {booking.paid ? 'Confirmed' : 'Unpaid'}
                          </span>
                       </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                       <div className="sm:hidden">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${booking.paid ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                             {booking.paid ? 'Confirmed' : 'Unpaid'}
                          </span>
                       </div>
                       {!booking.paid ? (
                         <button 
                            onClick={() => navigate(`/payment/${booking.id}`)}
                            className="px-6 py-3 bg-brandOrange text-white rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-navy transition-all shadow-lg flex items-center gap-2"
                         >
                            Pay <CreditCard size={12} className="sm:size-[16px]" />
                         </button>
                       ) : (
                         <button className="p-3 bg-white text-navy rounded-full border border-slate-100 shadow-sm hover:scale-110 transition-transform">
                            <ChevronRight size={14} className="sm:size-[20px]" />
                         </button>
                       )}
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="py-12 sm:py-20 text-center bg-slate-50 rounded-2xl sm:rounded-[3rem] border-2 border-dashed border-slate-100 space-y-4">
                     <AlertCircle className="mx-auto text-slate-200" size={32} />
                     <p className="text-slate-400 font-bold text-xs italic">No sessions requested yet.</p>
                     <button onClick={() => navigate('/book')} className="text-brandOrange font-black uppercase text-[10px] tracking-widest hover:underline">Book Your First Mock</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="space-y-6 sm:space-y-10">
            
            {/* Manual Performance Logger */}
            <div className="bg-navy rounded-3xl sm:rounded-[3.5rem] p-6 sm:p-10 lg:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none rotate-12 hidden sm:block"><Trophy size={100} /></div>
              <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brandOrange text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-brandOrange/20 shrink-0"><Activity size={20} className="sm:size-[24px]" /></div>
                <h3 className="text-lg sm:text-2xl font-black tracking-tighter">Log Performance</h3>
              </div>
              <form onSubmit={handleLogScore} className="space-y-6 sm:space-y-8 flex-1 relative z-10">
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[8px] sm:text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Assessment Name</label>
                    <input 
                        type="text" 
                        required 
                        value={newScore.title}
                        onChange={e => setNewScore({...newScore, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-5 focus:bg-white/10 focus:border-brandOrange outline-none transition-all font-bold text-white text-sm placeholder:text-white/20" 
                        placeholder="e.g. Mock #1" 
                    />
                </div>
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[8px] sm:text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Score (%)</label>
                    <input 
                        type="number" 
                        max="100" 
                        min="0" 
                        required 
                        value={newScore.score}
                        onChange={e => setNewScore({...newScore, score: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-5 focus:bg-white/10 focus:border-brandOrange outline-none transition-all font-bold text-white text-sm placeholder:text-white/20" 
                        placeholder="85" 
                    />
                </div>
                <button 
                  disabled={isLogging}
                  className="w-full py-5 sm:py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-white hover:text-navy hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brandOrange/30 flex items-center justify-center gap-3"
                >
                  {isLogging ? <Loader2 className="animate-spin" /> : <ChevronRight size={16} />} Record Score
                </button>
              </form>
              <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-white/5 rounded-2xl sm:rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                 <p className="text-[7px] sm:text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 sm:mb-4">Why Log Scores?</p>
                 <p className="text-[10px] sm:text-xs text-white/50 leading-relaxed font-medium">Tracking mock results calibrates your readiness rank for real board exams.</p>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="bg-white rounded-3xl sm:rounded-[3.5rem] p-6 sm:p-10 lg:p-14 border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform hidden sm:block"><UserCircle size={100} /></div>
               <h3 className="text-lg sm:text-2xl font-black text-navy mb-6 sm:mb-10 tracking-tighter">Your Profile</h3>
               <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-center gap-4 sm:gap-6">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-brandOrange group-hover:text-white transition-all shrink-0"><Briefcase size={16} className="sm:size-[20px]" /></div>
                     <div>
                        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Specialization</p>
                        <p className="text-xs sm:text-sm font-black text-navy truncate max-w-[120px] sm:max-w-[180px]">{user.displayName || 'Professional'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-brandOrange group-hover:text-white transition-all shrink-0"><BookOpen size={16} className="sm:size-[20px]" /></div>
                     <div>
                        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                        <p className="text-xs sm:text-sm font-black text-navy">Verified Pro</p>
                     </div>
                  </div>
               </div>
               <button onClick={() => navigate('/book')} className="w-full mt-8 sm:mt-10 py-4 sm:py-5 bg-slate-50 text-slate-400 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-navy hover:text-white transition-all border border-slate-100">Update Profile</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
