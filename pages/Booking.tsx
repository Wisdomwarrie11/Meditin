
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CAREER_FIELDS } from '../constants';
import { PracticeSession } from '../types';
import { saveBooking, updateUserProfile } from '../services/firestoreService';
import { onAuthStateChange } from '../services/authService';
import { auth } from '../services/firebase';
import { 
  Check, 
  ChevronRight, 
  ArrowLeft,
  User as UserIcon,
  BrainCircuit,
  Loader2,
  Sparkles,
  Trophy,
  Briefcase,
  Target
} from 'lucide-react';

const SKILL_OPTIONS = [
  "Communication", "Leadership", "Technical Analysis", "Problem Solving", 
  "Research", "Critical Thinking", "Clinical Knowledge", "Ethics", "Teamwork"
];

const QUALIFICATIONS = [
  "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Fellowship", "Specialized Certificate"
];

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dateError, setDateError] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    field: '',
    natureOfPractice: '',
    date: '',
    time: '',
    applyingFor: '',
    experienceYears: '',
    skills: [] as string[],
    qualification: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (!user) {
        navigate('/auth');
      } else {
        setFormData(prev => ({ 
          ...prev, 
          fullName: user.displayName || '', 
          email: user.email || '' 
        }));
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const updateForm = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

  const toggleSkill = (skill: string) => {
    const current = formData.skills;
    if (current.includes(skill)) {
      updateForm('skills', current.filter(s => s !== skill));
    } else {
      updateForm('skills', [...current, skill]);
    }
  };

  const validateDate = (selectedDate: string) => {
    const now = new Date();
    const target = new Date(selectedDate);
    const diffHours = (target.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 48) {
      setDateError('Please pick a date at least 48 hours away.');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleFinalSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const sessionData: PracticeSession = {
        userId: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        institution: formData.institution,
        field: formData.field,
        natureOfPractice: formData.natureOfPractice,
        practiceCategory: 'General',
        date: formData.date,
        time: formData.time,
        applyingFor: formData.applyingFor,
        experienceYears: formData.experienceYears,
        skills: formData.skills,
        qualification: formData.qualification,
        status: 'PENDING_PAYMENT',
        paid: false,
        createdAt: Date.now()
      };

      // Store initial booking record
      await saveBooking(sessionData);

      // Update user profile with professional details collected
      await updateUserProfile(user.uid, {
        displayName: formData.fullName,
        professionalField: formData.field,
        institution: formData.institution,
        experienceYears: formData.experienceYears,
        skills: formData.skills,
        qualification: formData.qualification
      });

      // Navigate to dashboard as requested
      navigate('/dashboard');
    } catch (error) {
      console.error("Storage Error:", error);
      alert("We had trouble saving your profile. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-brandOrange" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 selection:bg-brandOrange selection:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="max-w-md mx-auto mb-16 px-2">
            <div className="flex items-center justify-between">
                {[1, 2].map((s) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= s ? 'bg-brandOrange text-white shadow-xl shadow-brandOrange/30' : 'bg-white text-slate-300 border border-slate-200'}`}>
                                {step > s ? <Check size={16} strokeWidth={4} /> : s}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-navy' : 'text-slate-300'}`}>
                                {s === 1 ? 'Details' : 'Profile'}
                            </span>
                        </div>
                        {s === 1 && <div className={`flex-1 h-0.5 mx-4 rounded-full ${step > 1 ? 'bg-brandOrange' : 'bg-slate-200'}`} />}
                    </React.Fragment>
                ))}
            </div>
        </div>

        {step === 1 ? (
            <div className="bg-white rounded-[3rem] p-8 sm:p-16 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom duration-700">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-navy text-white rounded-[2rem] flex items-center justify-center shadow-lg"><UserIcon size={32} /></div>
                    <div>
                        <h3 className="text-3xl font-black text-navy leading-none">Basic Intel</h3>
                        <p className="text-slate-500 font-medium">When and why are you preparing?</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Field</label>
                        <select value={formData.field} onChange={(e) => updateForm('field', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none">
                            <option value="">Select your field</option>
                            {CAREER_FIELDS.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution / Company</label>
                        <input type="text" value={formData.institution} onChange={(e) => updateForm('institution', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy" placeholder="Where are you now?" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mock Session Date</label>
                        <input type="date" value={formData.date} onChange={(e) => { updateForm('date', e.target.value); validateDate(e.target.value); }} className={`w-full px-8 py-5 rounded-2xl bg-slate-50 border outline-none transition-all font-bold text-navy ${dateError ? 'border-red-500' : 'border-slate-100'}`} />
                        {dateError && <p className="text-[10px] font-bold text-red-500 mt-2">{dateError}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Time</label>
                        <input type="time" value={formData.time} onChange={(e) => updateForm('time', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none transition-all font-bold text-navy" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nature of Preparation</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['Job Interview', 'Board Exam', 'Promotion'].map((nature) => (
                                <button
                                    key={nature}
                                    onClick={() => updateForm('natureOfPractice', nature)}
                                    className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${formData.natureOfPractice === nature ? 'bg-navy border-navy text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-brandOrange hover:text-brandOrange'}`}
                                >
                                    {nature}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex justify-end">
                    <button 
                        disabled={!formData.field || !formData.date || !formData.natureOfPractice || !!dateError} 
                        onClick={() => { window.scrollTo(0,0); setStep(2); }} 
                        className="w-full sm:w-auto px-16 py-6 bg-navy text-white rounded-full font-black uppercase tracking-widest hover:bg-brandOrange transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3"
                    >
                        Next: Professional Profile <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-[3rem] p-8 sm:p-16 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-right duration-700">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-brandOrange text-white rounded-[2rem] flex items-center justify-center shadow-lg"><BrainCircuit size={32} /></div>
                    <div>
                        <h3 className="text-3xl font-black text-navy leading-none">About You</h3>
                        <p className="text-slate-500 font-medium">This helps our experts tailor your sessions.</p>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position Applying For</label>
                            <input type="text" value={formData.applyingFor} onChange={(e) => updateForm('applyingFor', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy" placeholder="e.g. Senior Pathologist" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Years</label>
                            <select value={formData.experienceYears} onChange={(e) => updateForm('experienceYears', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none">
                                <option value="">Select range</option>
                                <option value="0-1">0 - 1 Year</option>
                                <option value="2-5">2 - 5 Years</option>
                                <option value="6-10">6 - 10 Years</option>
                                <option value="10+">10+ Years</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Target size={12} /> Top Skills to Showcase
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {SKILL_OPTIONS.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${formData.skills.includes(skill) ? 'bg-brandOrange border-brandOrange text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-brandOrange/30 hover:text-brandOrange'}`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Highest Qualification</label>
                        <select value={formData.qualification} onChange={(e) => updateForm('qualification', e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none">
                            <option value="">Select qualification</option>
                            {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-16 flex flex-col sm:flex-row justify-between gap-4">
                    <button onClick={() => setStep(1)} className="px-10 py-6 bg-slate-50 text-slate-400 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button 
                        onClick={handleFinalSubmit} 
                        disabled={isProcessing || !formData.applyingFor || !formData.qualification}
                        className="px-16 py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest hover:bg-navy transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} Complete & View Dashboard
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
