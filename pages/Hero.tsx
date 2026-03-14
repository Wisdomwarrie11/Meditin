
import React from 'react';
// Updated to react-router-dom v6 syntax
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Video, 
  BrainCircuit, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import { auth } from '../services/firebase';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    if (auth.currentUser) {
      navigate('/practice');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold animate-bounce">
              <Award size={16} /> #1 Medical Prep Platform in Africa
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Master Your <span className="text-blue-600">Medical Journey</span> with Confidence.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
              MedPraktiz is the comprehensive prep platform for doctors, nurses, and radiographers. Practice realistic exams and live mock interviews with AI-driven analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleStart}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all group"
              >
                Start Practicing Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
              >
                Learn More
              </button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white object-cover" alt="User" />
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Joined by <span className="text-slate-900 font-bold">2,400+</span> medical professionals this month
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-blue-600/10 rounded-[2.5rem] blur-2xl -z-10" />
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl p-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200" 
                className="rounded-2xl w-full h-[400px] object-cover" 
                alt="Medical Professional"
              />
              {/* Floating Cards */}
              <div className="absolute top-12 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Exam Readiness</p>
                    <p className="text-lg font-black text-slate-900">94% Score</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-12 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Video size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Next Interview</p>
                    <p className="text-sm font-bold text-slate-900">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
          {[
            { label: 'Practice Questions', val: '50,000+', icon: <BookOpen className="text-blue-600" /> },
            { label: 'Mock Interviews', val: '12,000+', icon: <Video className="text-indigo-600" /> },
            { label: 'Active Students', val: '85,000+', icon: <Users className="text-emerald-600" /> },
            { label: 'Success Rate', val: '98.4%', icon: <Award className="text-orange-600" /> },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">{stat.icon}</div>
              <div>
                <p className="text-2xl font-black text-slate-900 leading-none">{stat.val}</p>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
          <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight relative z-10">
            Ready to Ace Your <br /> Medical Certification?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto relative z-10">
            Join thousands of medical students worldwide who use MedPraktiz to bridge the gap between study and practice.
          </p>
          <div className="flex justify-center relative z-10">
            <button 
              onClick={handleStart}
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;