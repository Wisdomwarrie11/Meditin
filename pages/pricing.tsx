import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, ShieldCheck, Star, AlertCircle } from 'lucide-react';
import { PRICING_PLANS, EXAM_PRICING_PLANS, SECTORS, GET_PLAN_PRICE } from '../constants';
import { auth } from '../services/firebase';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState('Education');
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const handleSelectPlan = (planId: string) => {
    if (!auth.currentUser) {
      setShowAuthAlert(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // If logged in, take them to booking with the plan pre-selected if possible
    // For now, just go to booking
    navigate('/book');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-black text-navy tracking-tighter mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Choose the plan that fits your career goals. Whether you're preparing for an interview or a certification exam, we've got you covered.
          </p>
        </div>

        {showAuthAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-brandOrange/10 border border-brandOrange/20 rounded-[2rem] flex items-center gap-4 text-brandOrange"
          >
            <AlertCircle size={24} />
            <div className="flex-1">
              <p className="font-black">Authentication Required</p>
              <p className="text-sm font-medium opacity-80">Please register or sign in to your account before choosing a plan.</p>
            </div>
            <button 
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-brandOrange text-white rounded-xl font-bold text-sm shadow-lg shadow-brandOrange/20"
            >
              Register Now
            </button>
          </motion.div>
        )}

        {/* Sector Selector for Interview Plans */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div>
              <h2 className="text-3xl font-black text-navy tracking-tight">Interview Sessions</h2>
              <p className="text-slate-500 font-medium">Prices vary slightly by sector complexity</p>
            </div>
            <div className="flex flex-wrap gap-2 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
              {SECTORS.map(sector => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedSector === sector 
                      ? 'bg-navy text-white shadow-lg shadow-navy/20' 
                      : 'text-slate-400 hover:text-navy hover:bg-slate-50'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan) => {
              const price = GET_PLAN_PRICE(plan.id, selectedSector);
              return (
                <motion.div 
                  key={plan.id}
                  whileHover={{ y: -10 }}
                  className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-navy/5 flex flex-col"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 text-navy">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-navy">₦{price.toLocaleString()}</span>
                    <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">/ session</span>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                        <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full py-5 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brandOrange transition-all shadow-xl shadow-navy/10"
                  >
                    Choose Plan
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Exam Plans */}
        <div>
          <h2 className="text-3xl font-black text-navy tracking-tight mb-10">Certification & Board Exams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {EXAM_PRICING_PLANS.map((plan) => (
              <motion.div 
                key={plan.id}
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[3rem] border flex flex-col ${
                  plan.id === 'PAID_EXAM' 
                    ? 'bg-navy text-white border-navy shadow-2xl shadow-navy/20' 
                    : 'bg-white border-slate-100 shadow-xl shadow-navy/5'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                  plan.id === 'PAID_EXAM' ? 'bg-white/10 text-white' : 'bg-slate-50 text-navy'
                }`}>
                  {plan.icon}
                </div>
                <h3 className={`text-2xl font-black mb-2 ${plan.id === 'PAID_EXAM' ? 'text-white' : 'text-navy'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-4xl font-black ${plan.id === 'PAID_EXAM' ? 'text-white' : 'text-navy'}`}>
                    {plan.price === 0 ? 'Free' : `₦${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && <span className="opacity-50 font-bold text-sm uppercase tracking-widest">/ exam</span>}
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-start gap-3 font-medium text-sm ${
                      plan.id === 'PAID_EXAM' ? 'text-white/70' : 'text-slate-600'
                    }`}>
                      <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                    plan.id === 'PAID_EXAM' 
                      ? 'bg-brandOrange text-white shadow-xl shadow-brandOrange/20 hover:scale-[1.02]' 
                      : 'bg-navy text-white hover:bg-brandOrange shadow-xl shadow-navy/10'
                  }`}
                >
                  {plan.price === 0 ? 'Start Free' : 'Choose Premium'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
