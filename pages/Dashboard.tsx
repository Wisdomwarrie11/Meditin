
import React, { useState, useEffect } from 'react';
// Updated to react-router-dom v6 syntax
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
  Target,
  Activity,
  Loader2,
  Trophy,
  Briefcase,
  Settings,
  X,
  Save,
  GraduationCap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { auth, db } from '../services/firebase';
import { logoutUser } from '../services/authService';
import { getMyBookings, getPerformanceScores, logPerformanceScore, updateUserProfile } from '../services/firestoreService';
import { PracticeSession, PerformanceScore, UserProfile } from '../types';
import { doc, getDoc } from 'firebase/firestore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<PracticeSession[]>([]);
  const [scores, setScores] = useState<PerformanceScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [newScore, setNewScore] = useState({ title: '', score: '' });
  const [isLogging, setIsLogging] = useState(false);

  const [editFormData, setEditFormData] = useState<Partial<UserProfile>>({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        navigate('/auth');
      } else {
        setUser(u);
        try {
          const userSnap = await getDoc(doc(db, 'users', u.uid));
          const profileData = userSnap.data() as UserProfile;
          setProfile(profileData);
          setEditFormData(profileData || {});

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
      if (!s.paid && s.status !== 'WAITING_LIST') return false;
      const sessionTime = new Date(`${s.date}T${s.time}`);
      const diffMs = sessionTime.getTime() - now.getTime();
      const diffMins = diffMs / (1000 * 60);
      return diffMins > 0 && diffMins < 180;
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingProfile(true);
    try {
      await updateUserProfile(user.uid, editFormData);
      setProfile({ ...profile, ...editFormData } as UserProfile);
      setIsEditProfileOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const chartData = scores.map(s => ({
    name: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: s.score
  })).slice(-8);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
      <div className="w-20 h-20 border-4 border-slate-100 border-t-brandOrange rounded-full animate-spin" />
      <p className="font-black text-navy uppercase tracking-[0.3em] text-[10px] animate-pulse">Synchronizing Career Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 pt-24 sm:pb-24 sm:pt-32 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
        
        {activeNotification && (
          <div className="bg-navy p-4 sm:p-5 rounded-2xl flex items-center justify-between text-white shadow-2xl animate-in slide-in-from-top duration-700">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brandOrange text-white rounded-xl flex items-center justify-center shadow-lg"><Bell size={20} className="animate-swing" /></div>
              <p className="text-xs sm:text-sm font-black tracking-tight">{activeNotification}</p>
            </div>
            <button onClick={() => setActiveNotification(null)} className="text-white/40 hover:text-white p-1"><Plus className="rotate-45" size={20} /></button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-10 bg-white p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 hidden sm:block"><Activity size={400} /></div>
          <div className="flex items-center gap-4 sm:gap-8 z-10">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-navy text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl relative shrink-0">
              {profile?.displayName?.charAt(0) || user.displayName?.charAt(0) || 'P'}
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-brandOrange rounded-lg flex items-center justify-center border-2 border-white shadow-lg"><Trophy size={10} /></div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-navy leading-none tracking-tighter">Hello, {profile?.displayName?.split(' ')[0] || user.displayName?.split(' ')[0] || 'Pro'}</h1>
              <div className="flex wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-slate-200">Tier: Aspiring Elite</span>
                <span className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest truncate max-w-[150px]">{user.email}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 z-10 shrink-0 mt-2 sm:mt-0">
            <button 
              onClick={() => navigate('/book')}
              className="flex-1 sm:flex-none px-8 sm:px-14 py-5 sm:py-7 bg-navy text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs sm:text-sm shadow-2xl shadow-navy/40 hover:bg-brandOrange hover:scale-105 transition-all flex items-center justify-center gap-3 border-4 border-white/10"
            >
              <Plus size={18} strokeWidth={4} /> New Mock Session
            </button>
            <button 
              onClick={() => { logoutUser(); navigate('/auth'); }}
              className="p-4 sm:p-5 bg-white text-slate-400 border border-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
          <div className="lg:col-span-2 space-y-6 sm:space-y-10">
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: 'Sessions', val: bookings.length, icon: <BookOpen /> },
                { label: 'Readiness', val: `${scores.length ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0}%`, icon: <TrendingUp /> },
                { label: 'Completed', val: bookings.filter(b => b.paid).length, icon: <CheckCircle />, hideOnMobile: true }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 group hover:shadow-xl transition-all">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-navy text-white rounded-xl flex items-center justify-center group-hover:bg-brandOrange transition-colors shrink-0">
                    {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 18 })}
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-black text-navy leading-none">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-2 sm:p-3 bg-navy/5 text-navy rounded-xl"><Activity size={20} /></div>
                  <h3 className="text-xl sm:text-2xl font-black text-navy tracking-tight">Career Pulse</h3>
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
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 italic border-2 border-dashed border-slate-50 rounded-2xl text-center p-6">
                    <Target size={40} strokeWidth={1} />
                    <p className="font-bold text-xs tracking-tight">No assessment data found. Start by logging your first mock score.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-10 lg:p-14 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-black text-navy mb-8">Roadmap</h3>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white text-navy rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-navy">{booking.natureOfPractice}</h4>
                        <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.field} • {new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${booking.status === 'WAITING_LIST' ? 'bg-orange-50 text-orange-600 border-orange-100' : booking.paid ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                          {booking.status === 'WAITING_LIST' ? 'Waiting List' : booking.paid ? 'Confirmed' : 'Unpaid'}
                       </span>
                       {!booking.paid && booking.status !== 'WAITING_LIST' && (
                         <button 
                            onClick={() => navigate(`/payment/${booking.id}`)}
                            className="px-6 py-2 bg-brandOrange text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                         >
                            Pay & Secure
                         </button>
                       )}
                       {booking.status === 'WAITING_LIST' && (
                         <div className="text-[8px] font-black text-slate-400 uppercase italic">Awaiting Invoice</div>
                       )}
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                     <button onClick={() => navigate('/book')} className="text-brandOrange font-black uppercase text-[10px] tracking-widest hover:underline">Book Your First Mock Session</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-10">
            
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Settings size={80} /></div>
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-navy tracking-tighter">Career Profile</h3>
                  <button 
                    onClick={() => {
                      setEditFormData(profile || {});
                      setIsEditProfileOpen(true);
                    }} 
                    className="p-2 text-slate-400 hover:text-brandOrange transition-colors"
                  >
                    <Settings size={18}/>
                  </button>
               </div>
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0"><Briefcase size={16} /></div>
                     <div className="min-w-0">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sector & Field</p>
                        <p className="text-xs font-black text-navy truncate">
                          {profile?.professionalSector || 'N/A'} • {profile?.professionalField || 'Not set'}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0"><GraduationCap size={16} /></div>
                     <div className="min-w-0">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Institution & Experience</p>
                        <p className="text-xs font-black text-navy">
                          {profile?.institution || 'N/A'} ({profile?.experienceYears || 'N/A'})
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0"><Activity size={16} /></div>
                     <div className="min-w-0">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Skills</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                           {(profile?.skills || []).slice(0, 3).map(s => <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[7px] font-bold">{s}</span>)}
                           {(profile?.skills || []).length > 3 && <span className="text-[7px] font-bold text-slate-300">+{profile!.skills!.length - 3} more</span>}
                           {(profile?.skills || []).length === 0 && <span className="text-[7px] font-bold text-slate-300">Not listed</span>}
                        </div>
                     </div>
                  </div>
               </div>
               <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full mt-8 sm:mt-10 py-4 sm:py-5 bg-slate-50 text-slate-400 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-navy hover:text-white transition-all border border-slate-100"
               >
                 Edit Career Specs
               </button>
            </div>

            <div className="bg-navy rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col">
              <h3 className="text-lg font-black tracking-tighter mb-8 flex items-center gap-3"><Target size={20} className="text-brandOrange" /> Log Performance</h3>
              <form onSubmit={handleLogScore} className="space-y-6">
                <input 
                  type="text" 
                  required 
                  value={newScore.title}
                  onChange={e => setNewScore({...newScore, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:bg-white/10 outline-none transition-all font-bold text-white text-xs placeholder:text-white/20" 
                  placeholder="e.g. Mock Interview #1" 
                />
                <input 
                  type="number" 
                  max="100" 
                  min="0" 
                  required 
                  value={newScore.score}
                  onChange={e => setNewScore({...newScore, score: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:bg-white/10 outline-none transition-all font-bold text-white text-xs placeholder:text-white/20" 
                  placeholder="Score (0-100)" 
                />
                <button 
                  disabled={isLogging}
                  className="w-full py-4 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest text-[9px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brandOrange/20"
                >
                  {isLogging ? <Loader2 className="animate-spin" size={14} /> : 'Record Assessment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/90 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-12 shadow-2xl space-y-8 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-navy tracking-tighter">Update Career Specs</h2>
                 <button onClick={() => setIsEditProfileOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Institution</label>
                    <input 
                      type="text" 
                      value={editFormData.institution || ''} 
                      onChange={e => setEditFormData({...editFormData, institution: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-navy outline-none focus:border-brandOrange transition-all" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Years</label>
                    <select 
                      value={editFormData.experienceYears || ''} 
                      onChange={e => setEditFormData({...editFormData, experienceYears: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-navy outline-none focus:border-brandOrange transition-all" 
                    >
                        <option value="">Select range</option>
                        <option value="0-1">0 - 1 Year</option>
                        <option value="2-5">2 - 5 Years</option>
                        <option value="6-10">6 - 10 Years</option>
                        <option value="10+">10+ Years</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Highest Qualification</label>
                    <input 
                      type="text" 
                      value={editFormData.qualification || ''} 
                      onChange={e => setEditFormData({...editFormData, qualification: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-navy outline-none focus:border-brandOrange transition-all" 
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Field</label>
                    <input 
                      type="text" 
                      value={editFormData.professionalField || ''} 
                      onChange={e => setEditFormData({...editFormData, professionalField: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-navy outline-none focus:border-brandOrange transition-all" 
                    />
                 </div>

                 <button 
                  disabled={isUpdatingProfile}
                  className="w-full py-5 bg-navy text-white rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brandOrange transition-all shadow-xl"
                 >
                   {isUpdatingProfile ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Sync Profile
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
