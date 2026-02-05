
import React from 'react';
import { ShieldCheck, Heart, Target, Lightbulb, ArrowRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative h-[60vh] flex items-center justify-center bg-medical-hero px-6 pt-20">
        <div className="text-center space-y-8 z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-brandOrange/20 border border-brandOrange/30 text-brandOrange rounded-full text-xs font-black tracking-widest uppercase">
            Our DNA
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Mission for <br /> Excellence.
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            We exist to eliminate the uncertainty in medical career progression. Through precision training, we build the leaders of healthcare.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl font-black text-navy leading-tight">The Meditin Philosophy</h2>
            <div className="space-y-8 text-lg text-slate-500 font-medium leading-relaxed">
              <p>
                Meditin was born in the hallways of clinical research centers. We saw students with immense theoretical potential struggling when faced with the pressure of a board exam or the complexity of a consultant interview.
              </p>
              <p>
                We believed that medical preparation should be as rigorous as medical practice itself. We built a platform that combines real-time data, expert human insight, and cutting-edge simulation technology.
              </p>
              <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 border-l-8 border-l-brandOrange italic text-navy font-bold">
                "Our goal is not just to help you pass; it's to help you excel with a confidence that only comes from deep practice."
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            {[
              { label: 'Precision', icon: <Target className="text-navy" />, color: 'bg-navy-50', desc: 'Surgical accuracy in mock exams.' },
              { label: 'Empathy', icon: <Heart className="text-brandOrange" />, color: 'bg-orange-50', desc: 'Focus on bedside human interaction.' },
              { label: 'Integrity', icon: <ShieldCheck className="text-navy" />, color: 'bg-navy-50', desc: 'Ethical simulations without shortcuts.' },
              { label: 'Innovation', icon: <Lightbulb className="text-brandOrange" />, color: 'bg-orange-50', desc: 'AI-driven growth analytics.' }
            ].map((v, i) => (
              <div key={i} className={`p-10 ${v.color} rounded-[3rem] space-y-4 hover:-translate-y-2 transition-transform duration-500`}>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  {v.icon}
                </div>
                <h4 className="text-xl font-black text-navy">{v.label}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact */}
      <section className="py-32 bg-navy px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div>
                <p className="text-8xl font-black text-brandOrange mb-4">98%</p>
                <p className="text-xl font-black text-white uppercase tracking-[0.2em]">Board Pass Rate</p>
            </div>
            <div>
                <p className="text-8xl font-black text-white mb-4">15k+</p>
                <p className="text-xl font-black text-brandOrange uppercase tracking-[0.2em]">Alumni Globally</p>
            </div>
            <div>
                <p className="text-8xl font-black text-brandOrange mb-4">40+</p>
                <p className="text-xl font-black text-white uppercase tracking-[0.2em]">Fields Covered</p>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <Award className="w-24 h-24 text-brandOrange mx-auto" />
          <h2 className="text-5xl lg:text-7xl font-black text-navy leading-tight">Join the Elite Class of Medical Professionals.</h2>
          <button 
            onClick={() => navigate('/book')}
            className="px-16 py-7 bg-brandOrange text-white rounded-full font-black text-2xl shadow-2xl hover:bg-navy transition-all transform hover:scale-105"
          >
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
