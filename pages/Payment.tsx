
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { PracticeSession, PricingPlan, PracticeType } from '../types';
import { PRICING_PLANS } from '../constants';
import { initializePayment } from '../services/paymentService';
import { updateBookingStatus } from '../services/firestoreService';
import { sendAdminWhatsAppNotification } from '../services/notificationService.ts';
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
  Gift,
  X,
  Clock,
  Ticket,
  AlertTriangle,
  Printer,
  FileText,
  Download,
  Info
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';

const Payment: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      try {
        const sessionSnap = await getDoc(doc(db, "practiceSessions", sessionId));
        
        if (sessionSnap.exists()) {
          const data = sessionSnap.data() as PracticeSession;
          if (data.paid) {
            navigate('/dashboard');
            return;
          }
          setSession({ ...data, id: sessionSnap.id });
          
          const initialType = data.natureOfPractice === 'Exam' ? PracticeType.EXAM : PracticeType.INTERVIEW;
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

  const handleSuccessfulActivation = async (plan: PricingPlan) => {
    if (!sessionId || !session) return;
    try {
      await updateBookingStatus(sessionId, { 
        paid: true, 
        status: 'SCHEDULED', 
        planId: plan.id 
      });
      
      // Notify Admin with relevant context
      sendAdminWhatsAppNotification(session, plan, false); // false for no waiting list
      
      navigate('/success');
    } catch (error) {
      console.error(error);
      alert("Failed to confirm booking.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePay = async () => {
    if (!selectedPlan || !session || !sessionId) return;
    
    setIsProcessing(true);
    
    if (selectedPlan.price === 0) {
      await handleSuccessfulActivation(selectedPlan);
      return;
    }

    const publicKey = 'pk_test_sample_key_12345'; // Use your real public key here
    
    initializePayment({
      key: publicKey,
      email: session.email,
      amount: Math.round(selectedPlan.price * 0.85), // Applying 15% discount for 4-day early booking
      ref: `MED-${sessionId}-${Date.now()}`,
      onSuccess: async () => {
        await handleSuccessfulActivation(selectedPlan);
      },
      onCancel: () => setIsProcessing(false)
    });
  };

  const handlePrintInvoice = () => {
    window.print();
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
  const filteredPlans = PRICING_PLANS.filter(p => 
    isInterview ? p.type === PracticeType.INTERVIEW : p.type === PracticeType.EXAM
  );

  const discountedPrice = selectedPlan ? Math.round(selectedPlan.price * 0.85) : 0;
  const isBasicPlan = selectedPlan?.id === 'int_basic_once';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 sm:px-6 print:pt-0 print:bg-white">
      <div className={`max-w-6xl mx-auto space-y-12 ${showInvoice ? 'hidden print:block' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/book')} 
                  className="p-4 bg-white rounded-2xl border border-slate-100 hover:text-brandOrange transition-all shadow-sm"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black text-navy tracking-tighter leading-none">Choose Prep Plan</h1>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                    "We have a plan for your budget because we want you to make it in"
                  </p>
                </div>
            </div>
            <div className="bg-navy rounded-2xl px-6 py-3 text-white flex items-center gap-3 shadow-xl">
               <ShieldCheck size={20} className="text-brandOrange" />
               <span className="text-[10px] font-black uppercase tracking-widest">Secure Reservation</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map(plan => (
                        <button 
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`relative w-full p-6 sm:p-8 rounded-[3rem] border-4 transition-all text-left flex flex-col justify-between group h-full ${selectedPlan?.id === plan.id ? 'border-brandOrange bg-white shadow-[0_25px_60px_-15px_rgba(249,115,22,0.15)]' : 'border-white bg-white hover:border-slate-100 hover:shadow-xl shadow-sm'}`}
                        >
                            <div className="space-y-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selectedPlan?.id === plan.id ? 'bg-brandOrange text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-navy group-hover:text-white'}`}>
                                    {plan.billingCycle === 'monthly' ? <Calendar size={20} /> : plan.billingCycle === 'free' ? <Gift size={20} /> : <Ticket size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-navy leading-none mb-2">{plan.name}</h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                        {plan.billingCycle === 'monthly' ? 'One Month' : plan.billingCycle === 'free' ? 'Starter' : 'Single Session'}
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <p className="text-2xl font-black text-navy">{plan.price === 0 ? 'FREE' : `₦${plan.price.toLocaleString()}`}</p>
                                    {plan.price > 0 && (
                                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1 italic">
                                        -15% Early Bird Applied
                                      </p>
                                    )}
                                </div>
                                <ul className="space-y-2 pt-4 border-t border-slate-50">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[10px] font-medium text-slate-500">
                                            <div className={`mt-0.5 p-0.5 ${plan.billingCycle === 'free' ? 'bg-slate-300' : 'bg-green-500'} text-white rounded-full`}><Check size={6} strokeWidth={4}/></div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={`mt-6 w-full py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] text-center transition-all ${selectedPlan?.id === plan.id ? 'bg-brandOrange text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-navy group-hover:text-white'}`}>
                                {selectedPlan?.id === plan.id ? 'Selected' : 'Choose Plan'}
                            </div>
                        </button>
                    ))}
                </div>
                
                <button 
                  onClick={() => setShowInvoice(true)}
                  disabled={!selectedPlan}
                  className="w-full py-5 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:border-brandOrange hover:text-brandOrange transition-all disabled:opacity-30"
                >
                  <FileText size={18} /> View & Generate Proforma Invoice
                </button>
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-navy p-10 rounded-[4rem] text-white shadow-2xl space-y-10 relative overflow-hidden flex flex-col h-full border border-white/5">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none hidden lg:block"><Users size={120} /></div>
                    
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-brandOrange uppercase tracking-[0.4em]">Checkout Intel</p>
                        <h3 className="text-3xl font-black tracking-tighter">Budget Match</h3>
                    </div>

                    <div className="space-y-5 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex-1">
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Client</span>
                           <span className="font-black text-sm truncate max-w-[150px]">{session.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Type</span>
                           <span className="font-black text-sm">{session.applicationType}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Practice</span>
                           <span className="font-black text-sm">{session.natureOfPractice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Tier</span>
                           <span className="font-black text-sm">{selectedPlan?.name || '---'}</span>
                        </div>
                        
                        {selectedPlan && (
                            <div className="pt-8 mt-4 border-t border-white/10 space-y-4">
                                {isBasicPlan && (
                                  <div className="p-4 bg-brandOrange/10 border border-brandOrange/20 rounded-2xl flex gap-3">
                                     <Info size={16} className="text-brandOrange shrink-0" />
                                     <p className="text-[9px] font-bold text-slate-300 leading-tight">
                                       Basic Plan: Submit your 5 questions via WhatsApp/Email after payment.
                                     </p>
                                  </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-brandOrange font-black uppercase text-[10px] tracking-widest">Subtotal</span>
                                    <span className="text-lg font-black line-through opacity-30">₦{selectedPlan.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-black uppercase text-[10px] tracking-widest">Total Payable</span>
                                    <span className="text-2xl font-black">₦{discountedPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handlePay}
                        disabled={!selectedPlan || isProcessing}
                        className="w-full py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all shadow-2xl shadow-brandOrange/20 active:scale-95 disabled:opacity-30 flex items-center justify-center gap-4 text-sm"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />} 
                        {isProcessing ? 'Processing...' : 'Secure & Activate'}
                    </button>
                    
                    <p className="text-[8px] text-center text-white/30 font-bold uppercase tracking-widest">
                      Your budget matters. Your career matters.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Invoice Generation View */}
      {showInvoice && selectedPlan && session && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in duration-500 pb-20 print:p-0">
           <div className="flex justify-between items-center print:hidden">
              <button 
                onClick={() => setShowInvoice(false)}
                className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-navy transition-colors"
              >
                <ArrowLeft size={16} /> Edit Plan
              </button>
              <div className="flex gap-4">
                  <button 
                    onClick={handlePrintInvoice}
                    className="px-8 py-3 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl"
                  >
                    <Printer size={16} /> Print Proforma
                  </button>
                  <button 
                    onClick={() => setShowInvoice(false)}
                    className="px-8 py-3 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest text-[10px]"
                  >
                    Proceed to Pay Now
                  </button>
              </div>
           </div>

           <div ref={invoiceRef} className="bg-white rounded-[4rem] p-12 sm:p-20 shadow-2xl border border-slate-100 relative overflow-hidden print:shadow-none print:border-none print:p-8">
              <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 pointer-events-none"><Zap size={400} /></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-12 mb-20 border-b border-slate-50 pb-20">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-navy text-white rounded-[2rem] flex items-center justify-center font-black text-xl shadow-xl">MT</div>
                      <h2 className="text-4xl font-black text-navy tracking-tighter">Meditin Official</h2>
                    </div>
                    <p className="text-xs font-bold text-slate-400 max-w-xs leading-relaxed uppercase tracking-widest">
                      Elite Professional Career & <br /> Interview Simulation Network
                    </p>
                 </div>
                 <div className="text-right space-y-2">
                    <p className="text-[10px] font-black text-brandOrange uppercase tracking-[0.4em]">Proforma Invoice #</p>
                    <p className="text-2xl font-black text-navy uppercase tracking-widest">MED-{sessionId?.substring(0, 8)}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6">Client Intel</h4>
                    <p className="text-xl font-black text-navy">{session.fullName}</p>
                    <p className="text-xs font-bold text-slate-400">{session.email}</p>
                    <p className="text-[10px] font-black text-brandOrange uppercase tracking-widest">Target: {session.applicationType}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{session.sector} • {session.field}</p>
                 </div>
                 <div className="space-y-4 md:text-right">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6">Session Target</h4>
                    <p className="text-xl font-black text-navy">{session.natureOfPractice}</p>
                    <p className="text-xs font-bold text-slate-400">{session.date} @ {session.time}</p>
                    <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-100 mt-2">Active Booking</span>
                 </div>
              </div>

              <div className="bg-slate-50 rounded-[3rem] p-10 sm:p-14 space-y-10 border border-slate-100">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-200">
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                          <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       <tr>
                          <td className="py-8">
                             <p className="font-black text-navy">{selectedPlan.name} Reservation</p>
                             <p className="text-xs font-medium text-slate-400 mt-1">4-Day Advance Professional Mock Session</p>
                          </td>
                          <td className="py-8 text-right font-black text-navy">₦{selectedPlan.price.toLocaleString()}</td>
                       </tr>
                       <tr className="bg-green-50/50">
                          <td className="py-6 px-4">
                             <div className="flex items-center gap-3">
                               <Sparkles size={14} className="text-green-600" />
                               <p className="font-black text-green-600 text-xs uppercase tracking-widest">Early Booking Reward - 15% Applied</p>
                             </div>
                          </td>
                          <td className="py-6 px-4 text-right font-black text-green-600">-₦{(selectedPlan.price * 0.15).toLocaleString()}</td>
                       </tr>
                    </tbody>
                 </table>

                 <div className="flex justify-end pt-10 border-t-4 border-navy">
                    <div className="text-right space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payable Now</p>
                       <p className="text-6xl font-black text-navy tracking-tighter">₦{discountedPrice.toLocaleString()}</p>
                       <p className="text-[10px] font-black text-brandOrange uppercase tracking-widest bg-brandOrange/10 py-2 px-4 rounded-xl inline-block">Secure Checkout Required</p>
                    </div>
                 </div>
              </div>

              <div className="mt-20 pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-navy uppercase tracking-widest">Next Steps</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      {isBasicPlan ? 'BASIC PLAN: Submit your 5 custom questions via WhatsApp (+2349029729621) or Email after payment. ' : 'Upon payment, a calendar invite with the join link will be emailed to you.'}
                    </p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-navy uppercase tracking-widest">Support Line</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Need help with payment or scheduling? Email win@meditin.com or reach us on WhatsApp.
                    </p>
                 </div>
                 <div className="flex items-end justify-end">
                    <div className="text-right opacity-30">
                       <p className="text-[10px] font-black uppercase tracking-widest">Official Stamp</p>
                       <div className="w-20 h-20 border-4 border-navy rounded-full flex items-center justify-center font-black rotate-12 mt-4">MEDITIN</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
