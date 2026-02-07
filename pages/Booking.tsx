
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SECTORS, SECTOR_MAPPING } from '../constants';
import { PracticeSession, UserProfile } from '../types';
import { saveBooking, updateUserProfile } from '../services/firestoreService';
import { onAuthStateChange } from '../services/authService';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Check, 
  ChevronRight, 
  ArrowLeft,
  User as UserIcon,
  BrainCircuit,
  Loader2,
  Sparkles,
  Trophy,
  Target,
  Users,
  AlertCircle,
  Clock
} from 'lucide-react';

const SKILL_OPTIONS = ["Communication", "Leadership", "Technical Analysis", "Problem Solving", "Research", "Critical Thinking", "Clinical Knowledge", "Ethics", "Teamwork"];
const QUALIFICATIONS = ["Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Fellowship", "Specialized Certificate"];

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dateError, setDateError] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    sector: '',
    field: '',
    customJob: '',
    natureOfPractice: '',
    date: '',
    time: '',
    genderPreference: 'No Preference' as 'No Preference' | 'Male' | 'Female',
    applyingFor: '',
    experienceYears: '',
    skills: [] as string[],
    qualification: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (!user) {
        navigate('/auth');
      } else {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile;
          setUserProfile(profile);
          setFormData(prev => ({ 
            ...prev, 
            fullName: user.displayName || profile.displayName || '', 
            email: user.email || profile.email || '',
            institution: profile.institution || '',
            sector: profile.professionalSector || '',
            field: profile.professionalField || '',
            experienceYears: profile.experienceYears || '',
            skills: profile.skills || [],
            qualification: profile.qualification || ''
          }));
        }
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
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 4) {
      setDateError('Please pick a date at least 4 days from today.');
      return false;
    }
    setDateError('');
    return true;
  };

  const isProfileComplete = !!(userProfile?.professionalField && userProfile?.institution && userProfile?.experienceYears);

  const handleStep1Next = () => {
    if (isProfileComplete) {
      finalizeBooking();
    } else {
      setStep(2);
      window.scrollTo(0,0);
    }
  };

  const finalizeBooking = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const finalField = formData.field === 'Other / Specify' ? formData.customJob : formData.field;
      const sessionData: PracticeSession = {
        userId: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        institution: formData.institution,
        sector: formData.sector,
        field: finalField,
        natureOfPractice: formData.natureOfPractice,
        practiceCategory: 'General',
        date: formData.date,
        time: formData.time,
        genderPreference: formData.genderPreference,
        applyingFor: formData.applyingFor || finalField,
        experienceYears: formData.experienceYears,
        skills: formData.skills,
        qualification: formData.qualification,
        status: 'PENDING_PAYMENT',
        paid: false,
        createdAt: Date.now()
      };

      const sessionId = await saveBooking(sessionData);

      // Only update profile if it wasn't already considered complete
      if (!isProfileComplete) {
        await updateUserProfile(user.uid, {
          professionalSector: formData.sector,
          professionalField: finalField,
          institution: formData.institution,
          experienceYears: formData.experienceYears,
          skills: formData.skills,
          qualification: formData.qualification
        });
      }

      navigate(`/payment/${sessionId}`);
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Failed to save booking. Please check your connection.");
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

  // Time range between 16:00 (4pm) and 22:00 (10pm)
  const timeOptions = [];
  for (let h = 16; h <= 22; h++) {
    timeOptions.push(`${h}:00`);
    if (h < 22) timeOptions.push(`${h}:30`);
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-md mx-auto mb-16 px-2">
            <div className="flex items-center justify-between">
                {[1, 2].map((s) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= s ? 'bg-brandOrange text-white shadow-xl shadow-brandOrange/30' : 'bg-white text-slate-300 border border-slate-200'}`}>
                                {step > s ? <Check size={16} strokeWidth={4} /> : s}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-navy' : 'text-slate-300'}`}>
                                {s === 1 ? 'Booking' : 'Profile'}
                            </span>
                        </div>
                        {s === 1 && <div className={`flex-1 h-0.5 mx-4 rounded-full ${step > 1 ? 'bg-brandOrange' : 'bg-slate-200'}`} />}
                    </React.Fragment>
                ))}
            </div>
        </div>

        {step === 1 ? (
            <div className="bg-white rounded-[3rem] p-8 sm:p-16 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom duration-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-navy text-white rounded-[2rem] flex items-center justify-center shadow-lg"><UserIcon size={32} /></div>
                        <div>
                            <h3 className="text-3xl font-black text-navy leading-none">Session Details</h3>
                            <p className="text-slate-500 font-medium">Select your sector and preferred time.</p>
                        </div>
                    </div>
                    {formData.natureOfPractice === 'Job Interview' && (
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3 max-w-xs">
                            <Users className="text-blue-600 shrink-0" size={20} />
                            <p className="text-[10px] font-bold text-blue-800 leading-tight">
                                Interviews are led by a panel of at least 2 qualified professionals in your field.
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector</label>
                        <select 
                          value={formData.sector} 
                          onChange={(e) => { updateForm('sector', e.target.value); updateForm('field', ''); }} 
                          className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none"
                        >
                            <option value="">Select Sector</option>
                            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Field / Job Title</label>
                        <select 
                          value={formData.field} 
                          onChange={(e) => updateForm('field', e.target.value)} 
                          disabled={!formData.sector} 
                          className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none disabled:opacity-30"
                        >
                            <option value="">Select Field</option>
                            {formData.sector && SECTOR_MAPPING[formData.sector]?.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    {formData.field === 'Other / Specify' && (
                        <div className="md:col-span-2 space-y-2 animate-in slide-in-from-top duration-300">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specify Job Role</label>
                             <input 
                              type="text" 
                              value={formData.customJob} 
                              onChange={(e) => updateForm('customJob', e.target.value)} 
                              className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange transition-all font-bold text-navy" 
                              placeholder="e.g. Senior Pathologist" 
                             />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Practice Purpose</label>
                        <select 
                          value={formData.natureOfPractice} 
                          onChange={(e) => updateForm('natureOfPractice', e.target.value)} 
                          className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange transition-all font-bold text-navy appearance-none"
                        >
                            <option value="">Select Purpose</option>
                            <option value="Job Interview">Job Interview (Panel)</option>
                            <option value="Exam">Board / Certification Exam</option>
                            <option value="Promotion">Promotion Review</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interviewer Gender Choice</label>
                        <select 
                          value={formData.genderPreference} 
                          onChange={(e) => updateForm('genderPreference', e.target.value)} 
                          className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange transition-all font-bold text-navy appearance-none"
                        >
                            <option value="No Preference">No Preference</option>
                            <option value="Male">Male Only</option>
                            <option value="Female">Female Only</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">Date (Min 4 days notice) <Target size={12}/></label>
                        <input 
                          type="date" 
                          value={formData.date} 
                          onChange={(e) => { updateForm('date', e.target.value); validateDate(e.target.value); }} 
                          className={`w-full px-8 py-5 rounded-2xl bg-slate-50 border outline-none transition-all font-bold text-navy ${dateError ? 'border-red-500' : 'border-slate-100'}`} 
                        />
                        {dateError && <p className="text-[10px] font-bold text-red-500 mt-2">{dateError}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">Time (4PM - 10PM) <Clock size={12}/></label>
                        <select 
                          value={formData.time} 
                          onChange={(e) => updateForm('time', e.target.value)} 
                          className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange transition-all font-bold text-navy appearance-none"
                        >
                            <option value="">Select Time</option>
                            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-16 flex justify-end">
                    <button 
                        disabled={!formData.field || !formData.date || !formData.time || !!dateError} 
                        onClick={handleStep1Next} 
                        className="w-full sm:w-auto px-16 py-6 bg-navy text-white rounded-full font-black uppercase tracking-widest hover:bg-brandOrange transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3"
                    >
                        {isProfileComplete ? 'Confirm & Go to Payment' : 'Next: Complete Profile'} <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-[3rem] p-8 sm:p-16 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-right duration-700">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-brandOrange text-white rounded-[2rem] flex items-center justify-center shadow-lg"><BrainCircuit size={32} /></div>
                    <div>
                        <h3 className="text-3xl font-black text-navy leading-none">Setup Profile</h3>
                        <p className="text-slate-500 font-medium">Tell us about your professional background.</p>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Institution</label>
                            <input 
                              type="text" 
                              value={formData.institution} 
                              onChange={(e) => updateForm('institution', e.target.value)} 
                              className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy" 
                              placeholder="e.g. Lagos University Hospital" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Years</label>
                            <select 
                              value={formData.experienceYears} 
                              onChange={(e) => updateForm('experienceYears', e.target.value)} 
                              className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none"
                            >
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
                            <Target size={12} /> Key Professional Skills
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
                        <select 
                          value={formData.qualification} 
                          onChange={(e) => updateForm('qualification', e.target.value)} 
                          className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none"
                        >
                            <option value="">Select qualification</option>
                            {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-16 flex flex-col sm:flex-row justify-between gap-4">
                    <button 
                      onClick={() => setStep(1)} 
                      className="px-10 py-6 bg-slate-50 text-slate-400 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button 
                        onClick={finalizeBooking} 
                        disabled={isProcessing || !formData.institution || !formData.qualification}
                        className="px-16 py-6 bg-brandOrange text-white rounded-full font-black uppercase tracking-widest hover:bg-navy transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} Book Session & Pay
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
