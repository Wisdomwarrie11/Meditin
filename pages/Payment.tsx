
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { PracticeSession, PricingPlan, PracticeType } from '../types';
import { PRICING_PLANS } from '../constants';
import { initializePayment } from '../services/paymentService';
import { updateBookingStatus } from '../services/firestoreService';
import { 
  CreditCard, 
  Loader2, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  Zap, 
  Calendar, 
  Sparkles,
  Award,
  Users
} from 'lucide-react';

const Payment: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      try {
        const docSnap = await getDoc(doc(db, "practiceSessions", sessionId));
        if (docSnap.exists()) {
          const data = docSnap.data() as PracticeSession;
          if (data.paid) {
            navigate('/dashboard');
            return;
          }
          setSession({ ...data, id: docSnap.id });
          
          // Auto-select the standard one-off plan for their type initially
          const initialType = data.natureOfPractice === 'Job Interview' ? PracticeType.INTERVIEW : PracticeType.EXAM;
          const defaultPlan = PRICING_PLANS.find(p => p.type === initialType && p.billingCycle === 'once');
          if (defaultPlan) setSelectedPlan(defaultPlan);
        } else {
            console.error("Session not found");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, navigate]);

  const handlePay = () => {
    if (!selectedPlan || !session || !sessionId) return;
    setIsProcessing(true);
    
    // Paystack test key
    const publicKey = 'pk_test_sample_key_12345'; 
    
    initializePayment({
      key: publicKey,
      email: session.email,
      amount: selectedPlan.price,
      ref: `SEC-${sessionId}-${Date.now()}`,
      onSuccess: async () => {
        await updateBookingStatus(sessionId, { 
          paid: true, 
          status: 'SCHEDULED', 
          planId: selectedPlan.id 
        });
        navigate('/success');
      },
      onCancel: () => setIsProcessing(false)
    });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-brandOrange" size={48} />
      <p className="font-black text-navy uppercase tracking-widest text-[10px]">Verifying Session...</p>
    </div>
  );

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center p-12">
      <div className="text-center space-y-4">
          <p className="text-2xl font-black text-navy">Session Expired or Not Found</p>
          <button onClick={() => navigate('/book')} className="text-brandOrange font-bold hover:underline">Start Over</button>
      </div>
    </div>
  );

  const isInterview = session.natureOfPractice === 'Job Interview';
  const filteredPlans = PRICING_PLANS.filter(p => 
    isInterview ? p.type === PracticeType.INTERVIEW : p.type === PracticeType.EXAM
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="p-4 bg-white rounded-2xl border border-slate-100 hover:text-brandOrange transition-all shadow-sm"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-3xl font-black text-navy tracking-tighter">Choose Prep Plan</h1>
                  <p className="text-slate-500 font-medium">Select a tier for your <span className="text-brandOrange font-black">{session.field}</span> {isInterview ? 'Interview' : 'Exam'}.</p>
                </div>
            </div>
            <div className="bg-navy rounded-2xl px-6 py-3 text-white flex items-center gap-3 shadow-xl">
               <ShieldCheck size={20} className="text-brandOrange" />
               <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Checkout</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPlans.map(plan => (
                        <button 
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`relative w-full p-8 sm:p-10 rounded-[3rem] border-4 transition-all text-left flex flex-col justify-between group h-full ${selectedPlan?.id === plan.id ? 'border-brandOrange bg-white shadow-[0_25px_60px_-15px_rgba(249,115,22,0.15)]' : 'border-white bg-white hover:border-slate-100 hover:shadow-xl shadow-sm'}`}
                        >
                            {plan.billingCycle === 'monthly' && (
                                <div className="absolute -top-3 right-8 bg-navy text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full flex items-center gap-2">
                                  <Zap size={10} className="text-brandOrange" /> Best Value
                                </div>
                            )}
                            
                            <div className="space-y-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedPlan?.id === plan.id ? 'bg-brandOrange text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-navy group-hover:text-white'}`}>
                                    {plan.billingCycle === 'monthly' ? <Calendar size={24} /> : <Award size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-navy leading-none mb-2">{plan.name}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                        {plan.billingCycle === 'monthly' ? 'Monthly Subscription' : 'Single Practice Session'}
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <p className="text-3xl font-black text-navy">₦{plan.price.toLocaleString()}</p>
                                </div>
                                <ul className="space-y-3 pt-6 border-t border-slate-50">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-xs font-medium text-slate-500">
                                            <div className="mt-1 p-0.5 bg-green-500 text-white rounded-full"><Check size={8} strokeWidth={4}/></div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={`mt-8 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center transition-all ${selectedPlan?.id === plan.id ? 'bg-brandOrange text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-navy group-hover:text-white'}`}>
                                {selectedPlan?.id === plan.id ? 'Selected Tier' : 'Select Plan'}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-navy p-10 rounded-[4rem] text-white shadow-2xl space-y-10 relative overflow-hidden flex flex-col h-full border border-white/5">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Users size={120} /></div>
                    
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-brandOrange uppercase tracking-[0.4em]">Checkout Intel</p>
                        <h3 className="text-3xl font-black tracking-tighter">Order Summary</h3>
                    </div>

                    <div className="space-y-5 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex-1">
                        <div className="flex justify-between items-center group/item">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Client</span>
                           <span className="font-black text-sm truncate max-w-[150px]">{session.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Practice</span>
                           <span className="font-black text-sm">{session.natureOfPractice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Field</span>
                           <span className="font-black text-sm">{session.field}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Schedule</span>
                           <span className="font-black text-sm">{new Date(session.date).toLocaleDateString()} @ {session.time}</span>
                        </div>
                        
                        {selectedPlan && (
                            <div className="pt-8 mt-4 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-brandOrange font-black uppercase text-[10px] tracking-widest">Subtotal</span>
                                    <span className="text-2xl font-black">₦{selectedPlan.price.toLocaleString()}</span>
                                </div>
                                <p className="text-[9px] font-bold text-white/30 italic text-center">Includes all professional feedback and analytics.</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handlePay}
                        disabled={!selectedPlan || isProcessing}
                        className="w-full py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all shadow-2xl shadow-brandOrange/20 active:scale-95 disabled:opacity-30 flex items-center justify-center gap-4 text-sm"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />} 
                        {isProcessing ? 'Connecting...' : `Secure Session`}
                    </button>

                    <div className="flex items-center justify-center gap-2 opacity-30">
                        <Sparkles size={14} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Powering Professional Growth</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
