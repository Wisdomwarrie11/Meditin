
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail, Calendar, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-medical-hero flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full text-center space-y-8 bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-200 shadow-2xl fade-ready">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-navy leading-tight">You're All Set!</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Your payment was successful and your spot in our global practice network is reserved.
          </p>
        </div>

        <div className="bg-navy rounded-3xl p-8 text-left space-y-6">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-brandOrange/20 rounded-xl text-brandOrange">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Timing</p>
                <p className="text-slate-400 text-xs">Check your email. We'll send your meeting details and join link within 24 hours.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-3 bg-brandOrange/20 rounded-xl text-brandOrange">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Bonus Resources</p>
                <p className="text-slate-400 text-xs">We'll also include our top tips and guides to help you get ready.</p>
              </div>
           </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full py-6 bg-brandOrange text-white rounded-full font-black flex items-center justify-center gap-3 hover:bg-navy transition-all"
        >
          Return to Home <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Success;
