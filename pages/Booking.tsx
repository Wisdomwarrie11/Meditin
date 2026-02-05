
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAREER_FIELDS, PRICING_PLANS } from '../constants';
import { PricingPlan, PracticeSession } from '../types';
import { initializePayment } from '../services/paymentService';
import { saveBooking } from '../services/firestoreService';
import { 
  Check, 
  ChevronRight, 
  ArrowLeft,
  CreditCard,
  User,
  BrainCircuit,
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dateError, setDateError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    field: '',
    customField: '',
    natureOfPractice: '',
    practiceCategory: '',
    date: '',
    time: '',
    plan: null as PricingPlan | null,
    bio: '',
    strengths: '',
    weaknesses: '',
    goals: ''
  });

  const updateForm = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  const validateDate = (selectedDate: string) => {
    const now = new Date();
    const target = new Date(selectedDate);
    const diffHours = (target.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) {
      setDateError('Please pick a time at least 24 hours away.');
      return false;
    }
    setDateError('');
    return true;
  };

  const handlePayment = async () => {
    if (!formData.plan) return;
    setIsProcessing(true);
    
    initializePayment({
      key: 'pk_test_sample_key_12345',
      email: formData.email,
      amount: formData.plan.price,
      ref: `BOK-${Date.now()}`,
      onSuccess: async () => {
        const sessionData: PracticeSession = {
          fullName: formData.fullName,
          email: formData.email,
          institution: formData.institution,
          field: formData.field,
          customField: formData.customField,
          natureOfPractice: formData.natureOfPractice,
          practiceCategory: formData.practiceCategory,
          date: formData.date,
          time: formData.time,
          planId: formData.plan?.id || '',
          bio: formData.bio,
          strengths: formData.strengths,
          weaknesses: formData.weaknesses,
          goals: formData.goals,
          status: 'SCHEDULED',
          paid: true,
          createdAt: Date.now()
        };
        await saveBooking(sessionData);
        navigate('/success');
      },
      onCancel: () => setIsProcessing(false)
    });
  };

  const steps = ['Info', 'Profile', 'Choose Plan', 'Pay'];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 selection:bg-brandOrange selection:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Stepper */}
        <div className="max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                    <React.Fragment key={i}>
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= i + 1 ? 'bg-brandOrange text-white shadow-xl shadow-brandOrange/30' : 'bg-white text-slate-300 border border-slate-200'}`}>
                                {step > i + 1 ? <Check size={20} strokeWidth={4} /> : i + 1}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= i + 1 ? 'text-navy' : 'text-slate-300'}`}>{s}</span>
                        </div>
                        {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded-full ${step > i + 1 ? 'bg-brandOrange' : 'bg-slate-200'}`} />}
                    </React.Fragment>
                ))}
            </div>
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 lg:p-20 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom duration-700">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-navy text-white rounded-[2rem] flex items-center justify-center shadow-lg"><User size={32} /></div>
                    <div>
                        <h3 className="text-4xl font-black text-navy leading-none">Your Details</h3>
                        <p className="text-slate-500 font-medium">Let's start with the basics.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input type="text" value={formData.fullName} onChange={(e) => updateForm('fullName', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy" placeholder="e.g. David Okafor" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <input type="email" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Field of Work</label>
                        <select value={formData.field} onChange={(e) => updateForm('field', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none">
                            <option value="">Select your field</option>
                            {CAREER_FIELDS.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                        </select>
                    </div>
                    {formData.field === 'Other Professional Fields' && (
                        <div className="space-y-2 animate-in slide-in-from-top duration-300">
                            <label className="text-[10px] font-black text-brandOrange uppercase tracking-widest ml-1">Specify Field</label>
                            <input type="text" value={formData.customField} onChange={(e) => updateForm('customField', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-orange-50 border border-brandOrange/20 outline-none font-bold text-navy" placeholder="e.g. Architecture" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company / School</label>
                        <input type="text" value={formData.institution} onChange={(e) => updateForm('institution', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy" placeholder="Where do you work/study?" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purpose</label>
                        <select value={formData.natureOfPractice} onChange={(e) => updateForm('natureOfPractice', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none">
                            <option value="">Why are you preparing?</option>
                            <option value="Job">Job Interview</option>
                            <option value="Test">Recruitment Test</option>
                            <option value="Exam">Board/Certification Exam</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                        <input type="date" value={formData.date} onChange={(e) => { updateForm('date', e.target.value); validateDate(e.target.value); }} className={`w-full px-8 py-5 rounded-2xl bg-slate-50 border outline-none transition-all font-bold text-navy ${dateError ? 'border-red-500' : 'border-slate-100'}`} />
                        {dateError && <p className="text-[10px] font-bold text-red-500 mt-2">{dateError}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time (Local)</label>
                        <input type="time" value={formData.time} onChange={(e) => updateForm('time', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none transition-all font-bold text-navy" />
                    </div>
                </div>

                <div className="mt-16 flex justify-end">
                    <button disabled={!formData.fullName || !formData.email || !formData.field || !formData.date || !!dateError} onClick={() => { window.scrollTo(0,0); setStep(2); }} className="px-16 py-6 bg-navy text-white rounded-full font-black uppercase tracking-widest hover:bg-brandOrange transition-all shadow-xl disabled:opacity-30 flex items-center gap-3">
                        Continue to Profile <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        )}

        {/* Step 2: Optional Profiling */}
        {step === 2 && (
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 lg:p-20 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-right duration-700">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-brandOrange text-white rounded-[2rem] flex items-center justify-center shadow-lg"><BrainCircuit size={32} /></div>
                    <div>
                        <h3 className="text-4xl font-black text-navy leading-none">About You</h3>
                        <p className="text-slate-500 font-medium">This helps our experts customize your session.</p>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 mb-12 flex gap-5 items-center">
                    <Sparkles className="text-brandOrange shrink-0" size={32} />
                    <p className="text-sm font-bold text-navy/70 leading-relaxed uppercase tracking-tighter">
                        We use this to pick the right questions and experts for you. This part is optional but highly recommended.
                    </p>
                </div>

                <div className="space-y-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">A brief bio</label>
                        <textarea value={formData.bio} onChange={(e) => updateForm('bio', e.target.value)} rows={3} className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy" placeholder="Tell us about your background..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Strengths</label>
                            <textarea value={formData.strengths} onChange={(e) => updateForm('strengths', e.target.value)} rows={2} className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy" placeholder="What are you good at?" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Areas for Growth</label>
                            <textarea value={formData.weaknesses} onChange={(e) => updateForm('weaknesses', e.target.value)} rows={2} className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy" placeholder="What do you want to improve?" />
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex justify-between">
                    <button onClick={() => setStep(1)} className="px-10 py-6 bg-slate-100 text-slate-400 rounded-full font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-200 hover:text-navy transition-all">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button onClick={() => { window.scrollTo(0,0); setStep(3); }} className="px-16 py-6 bg-navy text-white rounded-full font-black uppercase tracking-widest hover:bg-brandOrange transition-all shadow-xl flex items-center gap-3">
                        View Plans <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        )}

        {/* Step 3: Plan Selection */}
        {step === 3 && (
            <div className="animate-in zoom-in duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {PRICING_PLANS.map((plan) => (
                        <div 
                            key={plan.id}
                            onClick={() => updateForm('plan', plan)}
                            className={`p-12 rounded-[4rem] border-4 transition-all cursor-pointer relative flex flex-col group ${formData.plan?.id === plan.id ? 'border-brandOrange bg-white shadow-2xl scale-105 z-10' : 'border-white bg-white/50 backdrop-blur-md hover:border-slate-200'}`}
                        >
                            {formData.plan?.id === plan.id && (
                                <div className="absolute -top-5 -right-5 bg-brandOrange text-white p-3 rounded-full shadow-xl"><Check size={32} strokeWidth={4} /></div>
                            )}
                            <h3 className="text-2xl font-black text-navy mb-4">{plan.name}</h3>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-5xl font-black text-navy">₦{plan.price.toLocaleString()}</span>
                                <span className="text-slate-400 font-bold text-sm uppercase">{plan.billingCycle === 'monthly' ? '/ Month' : '/ One-off'}</span>
                            </div>
                            <ul className="space-y-5 mb-12 flex-1">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-4 text-sm font-bold text-slate-600">
                                        <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-brandOrange" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest transition-all ${formData.plan?.id === plan.id ? 'bg-brandOrange text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-navy group-hover:text-white'}`}>
                                {formData.plan?.id === plan.id ? 'Selected' : 'Select'}
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-between items-center mt-20">
                    <button onClick={() => setStep(2)} className="px-12 py-5 bg-white text-navy rounded-full font-black uppercase tracking-widest flex items-center gap-3 border border-slate-200 hover:bg-slate-50 transition-all">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button disabled={!formData.plan} onClick={() => { window.scrollTo(0,0); setStep(4); }} className="px-16 py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest flex items-center gap-4 hover:scale-105 transition-all shadow-2xl disabled:opacity-30">
                        Continue to Checkout <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        )}

        {/* Step 4: Checkout */}
        {step === 4 && (
            <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-700">
                <div className="bg-white rounded-[4rem] p-16 shadow-[0_50px_100px_-20px_rgba(0,33,71,0.25)] border border-slate-100 text-center">
                    <div className="w-24 h-24 bg-navy text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
                        <CreditCard size={48} />
                    </div>
                    <h3 className="text-4xl font-black text-navy mb-4">Secure Payment</h3>
                    <p className="text-slate-500 font-medium mb-12 italic">Almost there. Join our elite community of professionals.</p>

                    <div className="space-y-6 mb-12 bg-slate-50 p-10 rounded-[3rem] text-left border border-slate-100">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                            <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Candidate</span>
                            <span className="text-lg font-black text-navy">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                            <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Plan</span>
                            <span className="text-lg font-black text-navy">{formData.plan?.name}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-navy font-black uppercase tracking-widest text-xs">Total</span>
                            <span className="text-4xl font-black text-brandOrange">₦{formData.plan?.price.toLocaleString()}</span>
                        </div>
                    </div>

                    <button onClick={handlePayment} disabled={isProcessing} className="w-full py-8 bg-brandOrange text-white rounded-full font-black text-2xl uppercase tracking-widest shadow-2xl hover:bg-navy transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
                        {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirm & Pay'}
                        <ChevronRight size={32} />
                    </button>
                    
                    <button onClick={() => setStep(3)} className="w-full mt-10 text-xs font-black text-slate-400 hover:text-navy transition-colors uppercase tracking-widest">
                        Change Selection
                    </button>
                </div>
                <div className="mt-10 p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-white flex items-center gap-4">
                    <Info className="text-brandOrange shrink-0" size={24} />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        Your session will be manually reviewed by our panel. You will receive an email confirmation within 24 hours.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
