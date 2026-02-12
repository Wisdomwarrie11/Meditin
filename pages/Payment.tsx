
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
  Download
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
  const [showWaitingListModal, setShowWaitingListModal] = useState(false);
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

  const handleSuccessfulActivation = async (plan: PricingPlan, isWaitingList: boolean = false) => {
    if (!sessionId || !session) return;
    try {
      await updateBookingStatus(sessionId, { 
        paid: plan.price === 0, 
        status: isWaitingList ? 'WAITING_LIST' : 'SCHEDULED', 
        planId: plan.id 
      });
      
      // Notify Admin with relevant context
      sendAdminWhatsAppNotification(session, plan, isWaitingList);
      
      if (isWaitingList) {
        setShowWaitingListModal(false);
        setShowInvoice(true);
      } else {
        navigate('/success');
      }
    } catch (error) {
      console.error(error);
      alert("Failed to confirm booking.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePay = async () => {
    if (!selectedPlan || !session || !sessionId) return;
    
    if (session.natureOfPractice === 'Job Interview' && selectedPlan.price > 0) {
      setShowWaitingListModal(true);
      return;
    }

    setIsProcessing(true);
    
    if (selectedPlan.price === 0) {
      await handleSuccessfulActivation(selectedPlan);
      return;
    }

    const publicKey = 'pk_test_sample_key_12345'; 
    
    initializePayment({
      key: publicKey,
      email: session.email,
      amount: selectedPlan.price,
      ref: `SEC-${sessionId}-${Date.now()}`,
      onSuccess: async () => {
        await handleSuccessfulActivation(selectedPlan);
      },
      onCancel: () => setIsProcessing(false)
    });
  };

  const handleJoinWaitingList = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    await handleSuccessfulActivation(selectedPlan, true);
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredPlans.map(plan => (
                        <button 
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`relative w-full p-6 sm:p-8 rounded-[3rem] border-4 transition-all text-left flex flex-col justify-between group h-full ${selectedPlan?.id === plan.id ? 'border-brandOrange bg-white shadow-[0_25px_60px_-15px_rgba(249,115,22,0.15)]' : 'border-white bg-white hover:border-slate-100 hover:shadow-xl shadow-sm'}`}
                        >
                            {plan.billingCycle === 'monthly' && (
                                <div className="absolute -top-3 right-6 bg-navy text-white text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full flex items-center gap-2">
                                  <Zap size={10} className="text-brandOrange" /> Sub Bundle
                                </div>
                            )}
                            
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
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Practice</span>
                           <span className="font-black text-sm">{session.natureOfPractice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white/40 font-black text-[9px] uppercase tracking-widest">Selected Tier</span>
                           <span className="font-black text-sm">{selectedPlan?.name || '---'}</span>
                        </div>
                        
                        {selectedPlan && (
                            <div className="pt-8 mt-4 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-brandOrange font-black uppercase text-[10px] tracking-widest">Total</span>
                                    <span className="text-2xl font-black">{selectedPlan.price === 0 ? '₦0' : `₦${selectedPlan.price.toLocaleString()}`}</span>
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
                        {isProcessing ? 'Processing...' : isInterview && selectedPlan?.price !== 0 ? 'Proceed to Waiting List' : 'Activate Session'}
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
                <ArrowLeft size={16} /> Edit Booking
              </button>
              <div className="flex gap-4">
                  <button 
                    onClick={handlePrintInvoice}
                    className="px-8 py-3 bg-navy text-white rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl"
                  >
                    <Printer size={16} /> Print Invoice
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest text-[10px]"
                  >
                    Return to Dashboard
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
                    <p className="text-[10px] font-black text-brandOrange uppercase tracking-[0.4em]">Invoice / Waitlist #</p>
                    <p className="text-2xl font-black text-navy uppercase tracking-widest">MED-{sessionId?.substring(0, 8)}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6">Client Intel</h4>
                    <p className="text-xl font-black text-navy">{session.fullName}</p>
                    <p className="text-xs font-bold text-slate-400">{session.email}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{session.sector} • {session.field}</p>
                 </div>
                 <div className="space-y-4 md:text-right">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6">Session Target</h4>
                    <p className="text-xl font-black text-navy">{session.natureOfPractice}</p>
                    <p className="text-xs font-bold text-slate-400">{session.date} @ {session.time}</p>
                    <span className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-orange-100 mt-2">Waiting List Status</span>
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
                             <p className="font-black text-navy">{selectedPlan.name} Booking</p>
                             <p className="text-xs font-medium text-slate-400 mt-1">Waitlist Priority Reservation</p>
                          </td>
                          <td className="py-8 text-right font-black text-navy">₦{selectedPlan.price.toLocaleString()}</td>
                       </tr>
                       <tr className="bg-green-50/50">
                          <td className="py-6 px-4">
                             <div className="flex items-center gap-3">
                               <Sparkles size={14} className="text-green-600" />
                               <p className="font-black text-green-600 text-xs uppercase tracking-widest">Early Bird (Waitlist) Discount - 15%</p>
                             </div>
                          </td>
                          <td className="py-6 px-4 text-right font-black text-green-600">-₦{(selectedPlan.price * 0.15).toLocaleString()}</td>
                       </tr>
                    </tbody>
                 </table>

                 <div className="flex justify-end pt-10 border-t-4 border-navy">
                    <div className="text-right space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Commitment Total</p>
                       <p className="text-6xl font-black text-navy tracking-tighter">₦{discountedPrice.toLocaleString()}</p>
                       <p className="text-[10px] font-black text-brandOrange uppercase tracking-widest bg-brandOrange/10 py-2 px-4 rounded-xl inline-block">Amount Payable on Selection</p>
                    </div>
                 </div>
              </div>

              <div className="mt-20 pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-navy uppercase tracking-widest">Next Steps</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Your commitment has been recorded. Once a slot matching your schedule opens, you will receive an active payment link via email.
                    </p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-navy uppercase tracking-widest">Support Line</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Questions regarding your waitlist status? Email win@meditin.com or reach us on WhatsApp.
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

      {/* Waiting List Confirmation Modal */}
      {showWaitingListModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/95 backdrop-blur-xl animate-in fade-in duration-300 print:hidden">
           <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5"><Clock size={200} /></div>
              
              <button 
                onClick={() => setShowWaitingListModal(false)}
                className="absolute top-8 right-8 p-2 text-slate-300 hover:text-navy transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-8 relative z-10">
                 <div className="w-16 h-16 bg-brandOrange/10 text-brandOrange rounded-2xl flex items-center justify-center">
                   <AlertTriangle size={32} />
                 </div>
                 
                 <div className="space-y-4">
                    <h2 className="text-3xl font-black text-navy tracking-tighter leading-tight">Demand is high!</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      Due to a surge in applications from global professionals, we are currently at full capacity for live panel simulations.
                    </p>
                 </div>

                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-navy uppercase tracking-widest">Early Bird Reward</p>
                      <p className="text-xl font-black text-green-600 leading-none">15% Discount Applied</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-400 leading-relaxed">
                      Join the waiting list today to lock in your 15% discount. We'll generate your invoice instantly and notify you when a panel is ready.
                    </p>
                    <button 
                      onClick={handleJoinWaitingList}
                      disabled={isProcessing}
                      className="w-full py-6 bg-navy text-white rounded-full font-black uppercase tracking-widest hover:bg-brandOrange transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <FileText size={20} />} 
                      {isProcessing ? 'Processing...' : 'Confirm & Generate Invoice'}
                    </button>
                    <button 
                      onClick={() => setShowWaitingListModal(false)}
                      className="w-full py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] hover:text-navy transition-colors"
                    >
                      I'll wait and decide later
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
