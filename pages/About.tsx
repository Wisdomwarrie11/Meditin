
import React from 'react';
import { ShieldCheck, Heart, Target, Lightbulb, ArrowRight, Award, Sparkles, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white selection:bg-brandOrange selection:text-white">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-12 overflow-hidden bg-navy">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brandOrange/10 -skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <div className="space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-brandOrange rounded-2xl text-[10px] font-black uppercase tracking-widest">
              Our Mission
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter">
              Winning is for <br />
              <span className="text-brandOrange underline decoration-white/10 underline-offset-8">everyone.</span>
            </h1>
            <p className="text-xl text-white/50 font-medium max-w-lg leading-relaxed">
              We started Meditin to help professionals ace their big moves. No complex words, just real tools to help you succeed.
            </p>
          </div>
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
             <div className="rounded-[4rem] overflow-hidden border-[12px] border-white/10 shadow-2xl">
                <img 
                  src="smiling.jpeg" 
                  className="w-full h-[500px] object-cover" 
                  alt="Black medical scientist focusing on research" 
                />
             </div>
             <div className="absolute -bottom-6 -right-6 bg-brandOrange p-8 rounded-[2.5rem] shadow-2xl animate-bounce">
                <Sparkles className="text-white" size={32} />
             </div>
          </div>
        </div>
      </section>

      {/* Core Values - Interactive Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <h2 className="text-brandOrange font-black uppercase tracking-[0.4em] text-sm">The Way</h2>
            <p className="text-5xl font-black text-navy tracking-tighter leading-none">Why we are different.</p>
            <p className="text-xl text-slate-500 font-medium">We don't just talk. We help you build the muscle to win any room.</p>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Real Results', icon: <Target className="text-brandOrange" />, text: 'We focus on what actually works in the real world.' },
              { label: 'Total Kindness', icon: <Heart className="text-brandOrange" />, text: 'Supportive feedback to help you grow faster.' },
              { label: 'Modern Tools', icon: <Lightbulb className="text-brandOrange" />, text: 'The latest tech to make your practice feel real.' },
              { label: 'Global Reach', icon: <Globe className="text-brandOrange" />, text: 'Trusted by pros from Lagos to London.' }
            ].map((v, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:border-brandOrange transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-navy group-hover:text-white transition-all">
                  {v.icon}
                </div>
                <h4 className="text-2xl font-black text-navy mb-4">{v.label}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-navy relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(249,115,22,0.3)]">
                <img 
                  src="man.jpeg" 
                  alt="Black Professional smiling and working" 
                  className="w-full h-[600px] object-cover" 
                />
             </div>
             <div className="absolute top-10 left-10 p-6 bg-white rounded-[2rem] shadow-2xl">
                <p className="text-xs font-black text-slate-400 uppercase mb-2">Success Stories</p>
                <p className="text-2xl font-black text-navy tracking-tighter leading-none">15k+ Winners</p>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-12">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">A better path <br /> to success.</h2>
            <div className="space-y-8 text-xl text-white/50 font-medium leading-relaxed">
              <p>
                We saw too many people fail because of nerves, not skill. We decided to fix that. Meditin is more than just a website; it’s your partner for the big day.
              </p>
              <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 italic text-white font-bold leading-relaxed relative">
                <Sparkles className="absolute top-6 right-6 text-brandOrange opacity-50" />
                "Confidence isn't born. It's built through real practice."
              </div>
            </div>
            <button 
              onClick={() => navigate('/auth')}
              className="px-12 py-6 bg-brandOrange text-white rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-brandOrange/20"
            >
              Start Building Confidence
            </button>
          </div>
        </div>
      </section>

      {/* Global Impact Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center space-y-4">
                <p className="text-8xl font-black text-brandOrange tracking-tighter">98%</p>
                <p className="text-sm font-black text-navy uppercase tracking-[0.4em]">Pass Rate</p>
            </div>
            <div className="text-center space-y-4">
                <p className="text-8xl font-black text-navy tracking-tighter">15k+</p>
                <p className="text-sm font-black text-brandOrange uppercase tracking-[0.4em]">Elite Alumni</p>
            </div>
            <div className="text-center space-y-4">
                <p className="text-8xl font-black text-brandOrange tracking-tighter">40+</p>
                <p className="text-sm font-black text-navy uppercase tracking-[0.4em]">Career Paths</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default About;
