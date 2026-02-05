
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ArrowRight, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DASHBOARD_DATA = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 72 },
  { name: 'Mar', score: 85 },
  { name: 'Apr', score: 80 },
  { name: 'May', score: 92 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, Sarah!</h2>
          <p className="text-slate-500 mt-1">You have a mock interview scheduled for tomorrow at 2:00 PM.</p>
        </div>
        <button 
          onClick={() => navigate('/practice')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          New Practice Session
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Exams Taken', val: '12', icon: <BookOpen className="text-blue-600" />, trend: '+2 this week' },
          { label: 'Avg. Score', val: '84%', icon: <TrendingUp className="text-green-600" />, trend: 'Top 5% in Rad' },
          { label: 'Hours Practiced', val: '48h', icon: <Clock className="text-purple-600" />, trend: 'Goal: 50h' },
          { label: 'Ready Level', val: 'High', icon: <CheckCircle className="text-orange-600" />, trend: 'Exam ready' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
              <span className="text-xs font-medium text-slate-400">{stat.trend}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            Performance Trends
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Last 5 Sessions</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DASHBOARD_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Schedule</h3>
          <div className="space-y-4">
            {[
              { title: 'Radiography Finals Mock', date: 'Tomorrow, 2:00 PM', type: 'Interview' },
              { title: 'Clinical Anatomy Quiz', date: 'Fri, June 12, 10:00 AM', type: 'Exam' }
            ].map((session, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 group cursor-pointer hover:border-blue-200 transition-all">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{session.type}</p>
                <p className="font-bold text-slate-800">{session.title}</p>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                  <Calendar size={14} />
                  {session.date}
                </div>
              </div>
            ))}
            <button className="w-full py-3 text-sm font-semibold text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors">
              View Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Practice */}
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-2xl font-bold mb-2">Practice Radiography II</h4>
              <p className="text-blue-100 mb-6 max-w-xs">New set of diagnostic questions added based on recent licensing trends.</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Start Now <ArrowRight size={18} />
              </button>
            </div>
            <BookOpen className="absolute -bottom-6 -right-6 text-white/10 w-48 h-48 transform -rotate-12" />
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-2xl font-bold mb-2">Mock Interview Bundle</h4>
              <p className="text-indigo-100 mb-6 max-w-xs">Master your clinical bedside manners with real-time feedback sessions.</p>
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn More <ArrowRight size={18} />
              </button>
            </div>
            <TrendingUp className="absolute -bottom-6 -right-6 text-white/10 w-48 h-48 transform -rotate-12" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
