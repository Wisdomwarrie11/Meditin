
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MEDICAL_FIELDS, PRICING_PLANS } from '../constants';
import { PracticeType, PricingPlan } from '../types';
import { initializePayment } from '../services/paymentService';
import { 
  Check, 
  ChevronRight, 
  Stethoscope, 
  Microscope, 
  Heart, 
  Crosshair, 
  Syringe, 
  CreditCard 
} from 'lucide-react';

const PracticeSelector: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    // Real keys should be in environment variables
    const publicKey = 'pk_test_sample_key_12345'; 
    
    initializePayment({
      key: publicKey,
      email: 'student@example.com',
      amount: selectedPlan.price,
      ref: `REF-${Date.now()}`,
      onSuccess: (res) => {
        console.log('Payment success:', res);
        // Navigate to success or the exam engine
        if (selectedPlan.type === PracticeType.EXAM) {
          navigate('/exam-engine');
        } else {
          navigate('/scheduling');
        }
      },
      onCancel: () => {
        setIsProcessing(false);
        alert('Payment cancelled');
      }
    });
  };

  const getFieldIcon = (id: string) => {
    switch (id) {
      case 'rad': return <Crosshair size={24} />;
      case 'nur': return <Heart size={24} />;
      case 'med': return <Stethoscope size={24} />;
      case 'pha': return <Syringe size={24} />;
      case 'lab': return <Microscope size={24} />;
      default: return <Stethoscope size={24} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
              ${step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 border-2 border-slate-200'}
            `}
          >
            {step > s ? <Check size={20} /> : s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Select Medical Field</h2>
            <p className="text-slate-500 mt-2">Choose your specialization to see relevant preparation materials.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MEDICAL_FIELDS.map((field) => (
              <button
                key={field.id}
                onClick={() => {
                  setSelectedField(field.id);
                  setStep(2);
                }}
                className={`
                  p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-6 group
                  ${selectedField === field.id 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'}
                `}
              >
                <div className={`
                  p-4 rounded-xl transition-colors
                  ${selectedField === field.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'}
                `}>
                  {getFieldIcon(field.id)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{field.name}</h4>
                  <p className="text-sm text-slate-500">{field.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-blue-600">Back to Fields</button>
            <div className="h-4 w-px bg-slate-300" />
            <span className="text-sm font-semibold text-slate-900">Field: {MEDICAL_FIELDS.find(f => f.id === selectedField)?.name}</span>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Choose Practice Type</h2>
            <p className="text-slate-500 mt-2">Select how you want to prepare today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRICING_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`
                  p-8 rounded-3xl border-2 transition-all relative
                  ${selectedPlan?.id === plan.id ? 'border-blue-600 bg-white ring-4 ring-blue-50' : 'border-slate-100 bg-white'}
                `}
              >
                {selectedPlan?.id === plan.id && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Selected
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">₦{plan.price.toLocaleString()}</span>
                    <span className="text-slate-500">/ session</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                      <div className="mt-1 bg-green-100 text-green-600 rounded-full p-0.5">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`
                    w-full py-4 rounded-xl font-bold transition-all
                    ${selectedPlan?.id === plan.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}
                  `}
                >
                  {selectedPlan?.id === plan.id ? 'Selected' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              disabled={!selectedPlan}
              onClick={() => setStep(3)}
              className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
            >
              Continue to Payment <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && selectedPlan && (
        <div className="max-w-md mx-auto text-center space-y-8 animate-in zoom-in duration-500">
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Checkout</h2>
            <p className="text-slate-500 mb-8">Confirm your purchase details below.</p>

            <div className="space-y-4 text-left mb-8 p-6 bg-slate-50 rounded-2xl">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Plan</span>
                <span className="font-bold text-slate-900">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Field</span>
                <span className="font-bold text-slate-900 uppercase">{selectedField}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-lg font-bold text-blue-600">₦{selectedPlan.price.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? 'Connecting...' : `Pay ₦${selectedPlan.price.toLocaleString()}`}
              <ChevronRight size={20} />
            </button>

            <button 
              onClick={() => setStep(2)}
              className="mt-4 text-sm font-medium text-slate-400 hover:text-slate-600"
            >
              Go back and change plan
            </button>
          </div>
          
          <p className="text-xs text-slate-400 px-6">
            Payments are secured by Paystack. By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      )}
    </div>
  );
};

export default PracticeSelector;
