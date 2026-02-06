
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { PracticeSession, PricingPlan } from '../types';
import { PRICING_PLANS } from '../constants';
import { initializePayment } from '../services/paymentService';
import { updateBookingStatus } from '../services/firestoreService';
import { CreditCard, Loader2, ArrowLeft, ShieldCheck, Check } from 'lucide-react';

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
      const docSnap = await getDoc(doc(db, "practiceSessions", sessionId));
      if (docSnap.exists()) {
        const data = docSnap.data() as PracticeSession;
        if (data.paid) navigate('/dashboard');
        setSession({ ...data, id: docSnap.id });
      }
      setLoading(false);
    };
    fetchSession();
  }, [sessionId, navigate]);

  const handlePay = () => {
    if (!selectedPlan || !session || !sessionId) return;
    setIsProcessing(true);
    initializePayment({
      key: 'pk_test_sample_key_12345',
      email: session.email,
      amount: selectedPlan.price,
      ref: `SEC-${sessionId}-${Date.now()}`,
      onSuccess: async () => {
        await updateBookingStatus(sessionId, { paid: true, status: 'SCHEDULED', planId: selectedPlan.id });
        navigate('/success');
      },
      onCancel: () => setIsProcessing(false)
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brandOrange" size={48} /></div>;
  if (!session) return <div className="p-20 text-center">Session not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-4 bg-white rounded-2xl border border-slate-100 hover:text-brandOrange transition-all shadow-sm"><ArrowLeft size={20} /></button>
            <h1 className="text-3xl font-black text-navy tracking-tighter">Secure Your Session Slot</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-black text-navy border-b border-slate-50 pb-6">Select Prep Tier</h3>
                    <div className="space-y-4">
                        {PRICING_PLANS.map(plan => (
                            <button 
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan)}
                                className={`w-full p-8 rounded-[2.5rem] border-4 transition-all flex items-center justify-between text-left ${selectedPlan?.id === plan.id ? 'border-brandOrange bg-brandOrange/5' : 'border-slate-50 bg-white hover:border-slate-200'}`}
                            >
                                <div>
                                    <p className="text-lg font-black text-navy">{plan.name}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.features.length} Features Included</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-navy">₦{plan.price.toLocaleString()}</p>
                                    {selectedPlan?.id === plan.id && <Check className="text-brandOrange ml-auto mt-2" size={24} />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
                <div className="bg-navy p-10 rounded-[3.5rem] text-white shadow-2xl space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5"><ShieldCheck size={100} /></div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-brandOrange uppercase tracking-[0.4em]">Review & Confirm</p>
                        <h3 className="text-2xl font-black tracking-tighter">Session Summary</h3>
                    </div>
                    <div className="space-y-6 bg-white/5 p-8 rounded-[2rem] border border-white/10">
                        <div className="flex justify-between items-center"><span className="text-white/40 font-bold text-xs uppercase">Purpose</span><span className="font-black text-sm">{session.natureOfPractice}</span></div>
                        <div className="flex justify-between items-center"><span className="text-white/40 font-bold text-xs uppercase">Date</span><span className="font-black text-sm">{new Date(session.date).toLocaleDateString()}</span></div>
                        <div className="flex justify-between items-center"><span className="text-white/40 font-bold text-xs uppercase">Time</span><span className="font-black text-sm">{session.time}</span></div>
                        {selectedPlan && (
                            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                <span className="text-brandOrange font-black uppercase text-xs">Total</span>
                                <span className="text-3xl font-black">₦{selectedPlan.price.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handlePay}
                        disabled={!selectedPlan || isProcessing}
                        className="w-full py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-4"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCard size={24} />} Secure Session
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
