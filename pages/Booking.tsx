
import React, { useState, useEffect } from 'react';
// Updated to react-router-dom v6 syntax
import { useNavigate } from 'react-router-dom';
import { SECTORS, SECTOR_MAPPING, GET_PLAN_PRICE, GET_OLD_PRICE, PRICING_PLANS, EXAM_PRICING_PLANS } from '../constants';
import { PracticeSession, UserProfile, WaitingListEntry, SectorVote } from '../types';
import { saveBooking, updateUserProfile, joinWaitingList, voteForSector } from '../services/firestoreService';
import { onAuthStateChange } from '../services/authService';
import { auth, db } from '../services/firebase';
import { 
  Check, 
  ChevronRight, 
  ArrowLeft,
  User as UserIcon,
  BrainCircuit,
  Loader2,
  Sparkles,
  Target,
  Clock,
  LayoutGrid,
  FileText,
  UserCheck,
  Zap,
  ShieldCheck,
  Star,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';

const SKILL_OPTIONS = ["Communication", "Leadership", "Technical Analysis", "Problem Solving", "Research", "Critical Thinking", "Clinical Knowledge", "Ethics", "Teamwork"];
const QUALIFICATIONS = ["Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Fellowship", "Specialized Certificate"];
const DIFFICULTY_LEVELS = ["Starter", "Advanced", "Expert"] as const;

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dateError, setDateError] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showWaitingList, setShowWaitingList] = useState(false);
  const [waitingListSubmitted, setWaitingListSubmitted] = useState(false);
  const [voted, setVoted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    sector: '',
    field: '',
    customSector: '',
    customField: '',
    natureOfPractice: '',
    difficultyLevel: 'Starter' as 'Starter' | 'Advanced' | 'Expert',
    date: '',
    time: '',
    genderPreference: 'No Preference' as 'No Preference' | 'Male' | 'Female',
    questionType: 'MCQ' as 'MCQ' | 'Theory',
    examStandard: 'Local Standard' as 'Local Standard' | 'International Standard',
    applyingFor: '',
    experienceYears: '',
    skills: [] as string[],
    qualification: '',
    selectedPlan: '' as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | ''
  });

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('meditin_booking_progress');
    if (savedProgress) {
      try {
        const { step: savedStep, formData: savedData, userId: savedUserId } = JSON.parse(savedProgress);
        
        // We'll verify the userId inside the auth listener to be safe
        setStep(savedStep);
        setFormData(prev => ({ ...prev, ...savedData }));
      } catch (e) {
        console.error("Failed to load saved progress", e);
      }
    }
  }, []);

  // Save progress on change
  useEffect(() => {
    if (auth.currentUser && (step > 1 || formData.sector)) {
      localStorage.setItem('meditin_booking_progress', JSON.stringify({ 
        step, 
        formData, 
        userId: auth.currentUser.uid 
      }));
    }
  }, [step, formData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (!user) {
        navigate('/auth');
      } else if (!user.emailVerified) {
        navigate('/verify-email');
      } else if (user) {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) {
          const profile = userSnap.data() as UserProfile;
          setUserProfile(profile);
          
          // Only apply profile defaults if there's no saved progress for this user
          const savedProgress = localStorage.getItem('meditin_booking_progress');
          let hasValidSavedProgress = false;
          if (savedProgress) {
            try {
              const { userId: savedUserId } = JSON.parse(savedProgress);
              if (savedUserId === user.uid) {
                hasValidSavedProgress = true;
              } else {
                // Clear progress if it belongs to a different user
                localStorage.removeItem('meditin_booking_progress');
                setStep(1);
              }
            } catch (e) {
              localStorage.removeItem('meditin_booking_progress');
            }
          }
          
          setFormData(prev => {
            if (hasValidSavedProgress) return prev; // Keep saved progress
            
            return { 
              ...prev, 
              fullName: user.displayName || profile.displayName || '', 
              email: user.email || profile.email || '',
              institution: profile.institution || '',
              sector: profile.professionalSector || '',
              field: profile.professionalField || '',
              experienceYears: profile.experienceYears || '',
              skills: profile.skills || [],
              qualification: profile.qualification || ''
            };
          });
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
    setStep(2);
    window.scrollTo(0,0);
  };

  const handleStep2Next = () => {
    if (isProfileComplete) {
      finalizeBooking();
    } else {
      setStep(3);
      window.scrollTo(0,0);
    }
  };

  const handleWaitingListSubmit = async () => {
    if (!auth.currentUser || !formData.customSector || !formData.customField) return;
    setIsProcessing(true);
    try {
      const entry: WaitingListEntry = {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email || '',
        sector: formData.customSector,
        field: formData.customField,
        createdAt: Date.now()
      };
      await joinWaitingList(entry);
      setWaitingListSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVote = async () => {
    if (!auth.currentUser) return;
    setIsProcessing(true);
    try {
      const vote: SectorVote = {
        userId: auth.currentUser.uid,
        sectorName: 'Scholarship Interview',
        createdAt: Date.now()
      };
      await voteForSector(vote);
      setVoted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeBooking = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!formData.selectedPlan) return;
    
    setIsProcessing(true);
    try {
      const finalField = formData.field;
      const price = GET_PLAN_PRICE(formData.selectedPlan, formData.sector);
      const selectedPlanObj = plans.find(p => p.id === formData.selectedPlan);
      const planName = selectedPlanObj ? selectedPlanObj.name : formData.selectedPlan;
      
      const sessionData: PracticeSession = {
        userId: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        institution: formData.institution,
        sector: formData.sector,
        field: finalField,
        natureOfPractice: formData.natureOfPractice,
        difficultyLevel: formData.difficultyLevel,
        practiceCategory: 'General',
        date: formData.date,
        time: formData.time,
        planName: planName,
        price: price,
        ...(formData.natureOfPractice === 'Job Interview' ? { genderPreference: formData.genderPreference } : { questionType: formData.questionType, examStandard: formData.examStandard }),
        applyingFor: formData.applyingFor || finalField,
        experienceYears: formData.experienceYears,
        skills: formData.skills,
        qualification: formData.qualification,
        status: price === 0 ? 'SCHEDULED' : 'PENDING_PAYMENT',
        paid: price === 0,
        createdAt: Date.now()
      };

      const sessionId = await saveBooking(sessionData);
      localStorage.removeItem('meditin_booking_progress');

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

      if (price === 0) {
        navigate('/dashboard');
      } else {
        navigate(`/payment/${sessionId}`);
      }
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

  const timeOptions = [
    "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", 
    "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
  ];

  const isExam = formData.natureOfPractice === 'Exam';
  const isScholarship = formData.natureOfPractice === 'Scholarship';

  const plans = isExam ? EXAM_PRICING_PLANS : PRICING_PLANS;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-md mx-auto mb-16 px-2">
            <div className="flex items-center justify-between">
                {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= s ? 'bg-brandOrange text-white shadow-xl shadow-brandOrange/30' : 'bg-white text-slate-300 border border-slate-200'}`}>
                                {step > s ? <Check size={16} strokeWidth={4} /> : s}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-navy' : 'text-slate-300'}`}>
                                {s === 1 ? 'Details' : s === 2 ? 'Pricing' : 'Profile'}
                            </span>
                        </div>
                        {s < 3 && <div className={`flex-1 h-0.5 mx-4 rounded-full ${step > s ? 'bg-brandOrange' : 'bg-slate-200'}`} />}
                    </React.Fragment>
                ))}
            </div>
        </div>

        {step === 1 && (
            <div className="bg-white rounded-[3rem] p-8 sm:p-16 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom duration-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-navy text-white rounded-[2rem] flex items-center justify-center shadow-lg"><UserIcon size={32} /></div>
                        <div>
                            <h3 className="text-3xl font-black text-navy leading-none">Session Details</h3>
                            <p className="text-slate-500 font-medium">Tell us what you're preparing for.</p>
                        </div>
                    </div>
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
                            <option value="NOT_LISTED">My sector is not listed</option>
                        </select>
                    </div>

                    {formData.sector === 'NOT_LISTED' ? (
                      <div className="md:col-span-2 bg-brandOrange/5 p-8 rounded-[2rem] border border-brandOrange/10 space-y-6">
                        <div className="flex items-center gap-4 text-brandOrange">
                          <AlertCircle size={24} />
                          <p className="font-bold">Join the waiting list! We'll notify you when we launch your sector.</p>
                        </div>
                        {waitingListSubmitted ? (
                          <div className="text-center py-4 text-emerald-600 font-black uppercase tracking-widest">
                            <ThumbsUp className="mx-auto mb-2" />
                            Success! You're on the list.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input 
                              type="text" 
                              placeholder="Enter Sector" 
                              className="px-6 py-4 rounded-xl bg-white border border-slate-100 font-bold"
                              value={formData.customSector}
                              onChange={(e) => updateForm('customSector', e.target.value)}
                            />
                            <input 
                              type="text" 
                              placeholder="Enter Field" 
                              className="px-6 py-4 rounded-xl bg-white border border-slate-100 font-bold"
                              value={formData.customField}
                              onChange={(e) => updateForm('customField', e.target.value)}
                            />
                            <button 
                              onClick={handleWaitingListSubmit}
                              disabled={isProcessing || !formData.customSector || !formData.customField}
                              className="sm:col-span-2 py-4 bg-brandOrange text-white rounded-xl font-black uppercase tracking-widest hover:bg-navy transition-all disabled:opacity-50"
                            >
                              {isProcessing ? 'Processing...' : 'Join Waiting List'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
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

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Practice Purpose</label>
                            <select 
                              value={formData.natureOfPractice} 
                              onChange={(e) => {
                                updateForm('natureOfPractice', e.target.value);
                                updateForm('selectedPlan', '');
                              }} 
                              className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange transition-all font-bold text-navy appearance-none"
                            >
                                <option value="">Select Purpose</option>
                                <option value="Job Interview">Job Interview (Panel)</option>
                                <option value="Exam">Board / Certification Exam</option>
                                <option value="Scholarship">Scholarship Interview (Coming Soon)</option>
                            </select>
                            {isScholarship && (
                              <div className="mt-4 p-6 bg-navy/5 rounded-[2rem] border border-navy/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center"><Star size={20} /></div>
                                  <p className="text-xs font-bold text-navy">This feature is launching soon! Vote to prioritize it.</p>
                                </div>
                                <button 
                                  onClick={handleVote}
                                  disabled={voted || isProcessing}
                                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${voted ? 'bg-emerald-500 text-white' : 'bg-navy text-white hover:bg-brandOrange'}`}
                                >
                                  {voted ? 'Voted Successfully!' : 'Vote for Scholarship'}
                                </button>
                              </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty Level</label>
                            <select 
                              value={formData.difficultyLevel} 
                              onChange={(e) => updateForm('difficultyLevel', e.target.value)} 
                              className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange transition-all font-bold text-navy appearance-none"
                            >
                                {DIFFICULTY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>

                        {!isExam && (
                          <div className="space-y-2 animate-in fade-in duration-500">
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
                        )}

                        {isExam && (
                          <>
                            <div className="space-y-2 animate-in slide-in-from-top duration-500">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">Question Type <FileText size={12}/></label>
                              <select 
                                value={formData.questionType} 
                                onChange={(e) => updateForm('questionType', e.target.value)} 
                                className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange transition-all font-bold text-navy appearance-none"
                              >
                                  <option value="MCQ">MCQ</option>
                                  <option value="Theory">Theory</option>
                              </select>
                            </div>
                            <div className="space-y-2 animate-in slide-in-from-top duration-500">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">Exam Standard <LayoutGrid size={12}/></label>
                              <select 
                                value={formData.examStandard} 
                                onChange={(e) => updateForm('examStandard', e.target.value)} 
                                className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange transition-all font-bold text-navy appearance-none"
                              >
                                  <option value="Local Standard">Local Standard</option>
                                  <option value="International Standard">International Standard</option>
                              </select>
                            </div>
                          </>
                        )}

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
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">Time (4:30 PM - 9:00 PM) <Clock size={12}/></label>
                            <select 
                              value={formData.time} 
                              onChange={(e) => updateForm('time', e.target.value)} 
                              className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brandOrange outline-none transition-all font-bold text-navy appearance-none"
                            >
                                <option value="">Select Time</option>
                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                      </>
                    )}
                </div>

                {formData.sector !== 'NOT_LISTED' && !isScholarship && (
                  <div className="mt-16 flex justify-end">
                      <button 
                          disabled={!formData.field || !formData.date || !formData.time || !!dateError || !formData.natureOfPractice} 
                          onClick={handleStep1Next} 
                          className="w-full sm:w-auto px-16 py-6 bg-navy text-white rounded-full font-black uppercase tracking-widest hover:bg-brandOrange transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3"
                      >
                          Next: Choose Plan <ChevronRight size={20} />
                      </button>
                  </div>
                )}
            </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right duration-700 space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-navy">Choose Your Plan</h3>
              <p className="text-slate-500 font-medium">Pricing optimized for the <span className="text-brandOrange font-bold">{formData.sector}</span> sector.</p>
            </div>

            <div className={`grid grid-cols-1 ${plans.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' : 'md:grid-cols-3'} gap-8`}>
              {plans.map((plan) => {
                const price = GET_PLAN_PRICE(plan.id as any, formData.sector);
                const oldPrice = GET_OLD_PRICE(price);
                return (
                  <button
                    key={plan.id}
                    onClick={() => updateForm('selectedPlan', plan.id)}
                    className={`relative p-8 rounded-[2.5rem] border-4 transition-all text-left flex flex-col h-full ${formData.selectedPlan === plan.id ? 'bg-white border-brandOrange shadow-2xl scale-105 z-10' : 'bg-white border-transparent hover:border-slate-200'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${formData.selectedPlan === plan.id ? 'bg-brandOrange text-white' : 'bg-slate-100 text-navy'}`}>
                      {plan.icon}
                    </div>
                    <h4 className="text-xl font-black text-navy mb-2">{plan.name}</h4>
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-3xl font-black text-navy">₦{price.toLocaleString()}</span>
                      <span className="text-sm text-slate-400 line-through font-bold">₦{oldPrice.toLocaleString()}</span>
                    </div>
                    <ul className="space-y-4 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-500">
                          <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {formData.selectedPlan === plan.id && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brandOrange text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Selected</div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-8">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-navy font-black uppercase tracking-widest text-xs"><ArrowLeft size={16} /> Back</button>
              <button 
                disabled={!formData.selectedPlan}
                onClick={handleStep2Next}
                className="px-12 py-6 bg-navy text-white rounded-full font-black uppercase tracking-widest hover:bg-brandOrange transition-all shadow-xl disabled:opacity-30"
              >
                {isProfileComplete ? 'Confirm Booking' : 'Next: Setup Profile'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
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
                      onClick={() => setStep(2)} 
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
