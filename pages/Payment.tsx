
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { PracticeSession, PricingPlan, PracticeType } from '../types';
import { GET_PLAN_PRICE, GET_OLD_PRICE, PRICING_PLANS } from '../constants';
import { initializeSecurePayment } from '../services/paymentService';
import { 
  CreditCard, 
  Loader2, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  Zap, 
  Calendar, 
  Sparkles,
  Users,
  X,
  Clock,
  Ticket,
  Printer,
  FileText,
  Info,
  AlertCircle
} from 'lucide-react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const Payment: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PENDING_WEBHOOK' | 'ERROR'>('IDLE');

  // Listen for real-time updates to the session (triggered by the Webhook Cloud Function)
  useEffect(() => {
    if (!sessionId) return;
    const unsub = onSnapshot(doc(db, "practiceSessions", sessionId), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as PracticeSession;
        setSession({ ...data, id: doc.id });
        if (data.paid) {
          navigate('/success');
        }
      }
    });
    return () => unsub();
  }, [sessionId, navigate]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!sessionId) return;
      try {
        const sessionSnap = await getDoc(doc(db, "practiceSessions", sessionId));
        if (sessionSnap.exists()) {
          const data = sessionSnap.data() as PracticeSession;
          setSession({ ...data, id: sessionSnap.id });
          const initialType = data.natureOfPractice === 'Exam' ? PracticeType.EXAM : PracticeType.INTERVIEW;
          const defaultPlan = PRICING_PLANS.find(p => p.type === initialType);
          if (defaultPlan) setSelectedPlan(defaultPlan);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [sessionId]);

  const handlePay = async () => {
    if (!selectedPlan || !session || !sessionId) return;
    
    setIsProcessing(true);
    setPaymentStatus('IDLE');

    await initializeSecurePayment({
      email: session.email,
      sessionId: sessionId,
      planId: selectedPlan.id,
      onSuccess: () => {
        // User closed modal after success
        setPaymentStatus('PENDING_WEBHOOK');
        setIsProcessing(false);
      },
      onCancel: () => {
        setIsProcessing(false);
      },
      onError: (msg) => {
        setIsProcessing(false);
        setPaymentStatus('ERROR');
        alert(msg);
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-brandOrange" size={48} />
      <p className="font-black text-navy uppercase tracking-widest text-[10px]">Verifying Session...</p>
    </div>
  );

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center p-12 text-center">
      <div>
          <p className="text-2xl font-black text-navy mb-4">Session Not Found</p>
          <button onClick={() => navigate('/book')} className="text-brandOrange font-bold hover:underline">Start Over</button>
      </div>
    </div>
  );

  const isInterview = session.natureOfPractice === 'Job Interview';
  const filteredPlans = PRICING_PLANS;
  
  const getPriceForPlan = (plan: PricingPlan) => {
    const planType = plan.id.toUpperCase() as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
    return GET_PLAN_PRICE(planType, session.sector);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 sm:px-6 print:pt-0 print:bg-white">
      <div className={`max-w-6xl mx-auto space-y-12 ${showInvoice ? 'hidden print:block' : ''}`}>
        
        {paymentStatus === 'PENDING_WEBHOOK' && (
          <div className="bg-navy text-white p-8 rounded-[2rem] flex items-center gap-6 animate-pulse">
            <Loader2 className="animate-spin text-brandOrange" size={32} />
            <div>
              <p className="font-black uppercase tracking-widest text-xs">Awaiting Confirmation</p>
              <p className="text-slate-400 text-sm">We've received your payment. Please wait a moment while we secure your slot...</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/book')} className="p-4 bg-white rounded-2xl border border-slate-100 hover:text-brandOrange transition-all shadow-sm">
                  <ArrowLeft size={20} />
                </button>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black text-navy tracking-tighter leading-none">Choose Prep Plan</h1>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">SECURE CHECKOUT FOR {session.sector.toUpperCase()}</p>
                </div>
            </div>
            <div className="bg-navy rounded-2xl px-6 py-3 text-white flex items-center gap-3 shadow-xl">
               <ShieldCheck size={20} className="text-brandOrange" />
               <span className="text-[10px] font-black uppercase tracking-widest">Bank-Grade Security</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map(plan => {
                        const currentPrice = getPriceForPlan(plan);
                        const oldPrice = GET_OLD_PRICE(currentPrice);
                        
                        return (
                            <button 
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan)}
                                className={`relative w-full p-6 sm:p-8 rounded-[3rem] border-4 transition-all text-left flex flex-col justify-between group h-full ${selectedPlan?.id === plan.id ? 'border-brandOrange bg-white shadow-[0_25px_60px_-15px_rgba(249,115,22,0.15)]' : 'border-white bg-white hover:border-slate-100 hover:shadow-xl shadow-sm'}`}
                            >
                                <div className="space-y-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selectedPlan?.id === plan.id ? 'bg-brandOrange text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-navy group-hover:text-white'}`}>
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-navy leading-none mb-2">{plan.name}</h3>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Single Session</p>
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl font-black text-navy">₦{currentPrice.toLocaleString()}</p>
                                            <p className="text-sm font-bold text-slate-300 line-through">₦{oldPrice.toLocaleString()}</p>
                                        </div>
                                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1 italic">Special Sector Pricing</p>
                                    </div>
                                    <ul className="space-y-2 pt-4 border-t border-slate-50">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[10px] font-medium text-slate-500">
                                                <div className="mt-0.5 p-0.5 bg-green-500 text-white rounded-full"><Check size={6} strokeWidth={4}/></div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={`mt-6 w-full py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] text-center transition-all ${selectedPlan?.id === plan.id ? 'bg-brandOrange text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-navy group-hover:text-white'}`}>
                                    {selectedPlan?.id === plan.id ? 'Selected' : 'Choose Plan'}
                                </div>
                            </button>
                        );
                    })}
                </div>
                
                {/* <button 
                  onClick={() => setShowInvoice(true)}
                  disabled={!selectedPlan}
                  className="w-full py-5 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:border-brandOrange hover:text-brandOrange transition-all disabled:opacity-30"
                >
                  <FileText size={18} /> Generate Proforma Invoice
                </button> */}
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-navy p-10 rounded-[4rem] text-white shadow-2xl space-y-10 relative overflow-hidden flex flex-col h-full border border-white/5">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none hidden lg:block"><Users size={120} /></div>
                    
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-brandOrange uppercase tracking-[0.4em]">Secure Checkout</p>
                        <h3 className="text-3xl font-black tracking-tighter">Budget Match</h3>
                    </div>

                    <div className="space-y-5 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex-1">
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Client</span>
                           <span className="font-black text-sm truncate max-w-[150px]">{session.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Practice</span>
                           <span className="font-black text-sm">{session.natureOfPractice}</span>
                        </div>
                        
                        {selectedPlan && (
                            <div className="pt-8 mt-4 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-brandOrange font-black uppercase text-[10px] tracking-widest">Final Total</span>
                                    <span className="text-2xl font-black">₦{getPriceForPlan(selectedPlan).toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handlePay}
                        disabled={!selectedPlan || isProcessing || paymentStatus === 'PENDING_WEBHOOK'}
                        className="w-full py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all shadow-2xl shadow-brandOrange/20 active:scale-95 disabled:opacity-30 flex items-center justify-center gap-4 text-sm"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />} 
                        {isProcessing ? 'Connecting Server...' : `Pay ₦${selectedPlan ? getPriceForPlan(selectedPlan).toLocaleString() : '0'}`}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 opacity-30">
                       <ShieldCheck size={12} />
                       <p className="text-[8px] font-bold uppercase tracking-widest">Verified by Paystack Webhooks</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Invoice Generator remains the same for proforma purposes */}
      {/* {showInvoice && selectedPlan && session && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in duration-500 pb-20 print:p-0">
           <div className="flex justify-between items-center print:hidden">
              <button onClick={() => setShowInvoice(false)} className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-navy transition-colors">
                <ArrowLeft size={16} /> Edit Plan
              </button>
              <button onClick={() => window.print()} className="px-8 py-3 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl">
                <Printer size={16} /> Print Proforma
              </button>
           </div>
           <div ref={invoiceRef} className="bg-white rounded-[4rem] p-12 sm:p-20 shadow-2xl border border-slate-100 relative overflow-hidden print:shadow-none print:border-none print:p-8">
              <h2 className="text-4xl font-black text-navy tracking-tighter mb-8">Meditin Proforma</h2>
              <div className="bg-slate-50 p-10 rounded-3xl space-y-4 font-bold text-navy">
                 <p>Plan: {selectedPlan.name}</p>
                 <p>Total: ₦{getPriceForPlan(selectedPlan).toLocaleString()}</p>
                 <p className="text-xs text-slate-400">Reference: PRO-{sessionId.substring(0,6)}</p>
              </div>
           </div>
        </div>
      )} */}
    </div>
  );
};

export default Payment;
