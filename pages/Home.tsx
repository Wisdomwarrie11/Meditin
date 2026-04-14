import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Smile, 
  Zap,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Brain,
  Trophy,
  MessageSquare,
  Sparkles,
  Code,
  Briefcase,
  CheckCircle2,
  Gavel,
  ChevronRight,
  X
} from 'lucide-react';
import { auth } from '../services/firebase';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);


  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If we are near the end, snap back to start
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Move forward by one card width roughly
          scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    if (auth.currentUser) navigate('/dashboard');
    else navigate('/auth');
  };

  const testimonials = [
    { 
      name: 'Chinelo Azikiwe', 
      role: 'Senior Doctor', 
      text: 'Practicing here made me feel so ready. The feedback was clear and helped me fix small mistakes I didn\'t know I was making.', 
      img: 'https://i.pravatar.cc/100?img=45' 
    },
    { 
      name: 'Tunde Bakare', 
      role: 'Tech Lead', 
      text: 'I was nervous about my big interview, but after a few tries on Meditin, I walked in and got the job. It feels very real.', 
      img: 'https://i.pravatar.cc/100?img=12' 
    },
    { 
      name: 'Amara Okafor', 
      role: 'Finance Graduate', 
      text: 'The questions were just like the real test. I didn\'t have to guess what would come up next. Highly recommended!', 
      img: 'https://i.pravatar.cc/100?img=32' 
    }
  ];

  const mentorships = [
    {
      title: 'Medical Mentorship',
      mentor: 'Dr. Adewale Johnson',
      role: 'Senior Consultant',
      sector: 'Healthcare',
      duration: '8 Weeks',
      image: 'medicine.jpeg'
    },
    {
      title: 'Tech Leadership Mastery',
      mentor: 'Sarah Williams',
      role: 'CTO at HealthTech',
      sector: 'Technology',
      duration: '3 Weeks',
      image: 'tech.jpeg'
    },
    {
      title: 'Financial Mentorship Program',
      mentor: 'Mr Grace Obi',
      role: 'Head of Finance Department',
      sector: 'Finance',
      duration: '2 Weeks',
      image: 'finance.jpeg'
    }
  ];

   const steps = [
    {
      title: 'Choose Your Path',
      desc: 'Select from clinical exams, residency interviews, or mentorship programs tailored to your goals.',
      icon: <Brain className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Simulate & Practice',
      desc: 'Engage in high-fidelity simulations or join mentorship cohorts led by industry experts.',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'bg-brandOrange'
    },
    {
      title: 'Master & Succeed',
      desc: 'Analyze your performance with deep metrics and walk into your exam with total confidence.',
      icon: <CheckCircle2 className="w-8 h-8" />,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="bg-[#FCFCFD] selection:bg-brandOrange selection:text-white overflow-x-hidden">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[100vh] flex items-center mt-8 pt-24 pb-12">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-navy/5 -skew-x-12 translate-x-32 -z-10 hidden lg:block" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-brandOrange/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Side */}
          <div className={`lg:col-span-7 space-y-10 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            
            <h1 className="text-6xl md:text-8xl font-black text-navy leading-[0.85] tracking-tighter text-balance">
              Win your <br />
              <span className="text-brandOrange underline decoration-navy/10 underline-offset-8">career</span> <br />
              today.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-xl leading-relaxed">
              Real practice for your big interviews and tests. Talk to real people, get real scores, and walk into your next room with total peace of mind.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pt-4">
              <button 
                onClick={() => navigate('/book')}
                className="group relative px-12 py-6 bg-navy text-white rounded-[2rem] font-black text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-navy/20"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Practicing <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-brandOrange translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </div>

          {/* Image Side - Asymmetrical Grid */}
          <div className={`lg:col-span-5 relative transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,33,71,0.25)] border-[12px] border-white">
              <img 
                src="brand1.jpeg" 
                alt="Professional Black Woman Interviewing" 
                className="w-full h-[650px] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
            </div>      

            {/* Accent Circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brandOrange rounded-full -z-10 animate-pulse" />
          </div>
        </div>
      </section>

      {/* The Bento Step Grid */}
      <section className="py-30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-brandOrange font-black uppercase tracking-[0.3em] text-sm mb-6">Our Way</h2>
              <p className="text-5xl md:text-7xl font-black text-navy tracking-tighter leading-none">The path to your <br /> next paycheck.</p>
            </div>
            <p className="text-xl text-slate-500 font-medium max-w-xs">Simple steps to build your confidence and land the role.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            {/* Step 1 */}
            <div className="md:col-span-4 relative group rounded-[3.5rem] overflow-hidden">
              <img 
                src="interview.jpeg" 
                alt="Confident Professional Writing Exam" 
                className="w-full h-full object-cover grayscale-[100%] group-hover:grayscale-0 transition-all duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-navy/60 group-hover:bg-navy/20 transition-all" />
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className="text-3xl font-black text-white mb-2">Join Us</h3>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Create your profile and tell us what you want to achieve.</p>
              </div>
            </div>

            {/* Step 2 & 3 Combined Vertical */}
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <div className="bg-slate-100 rounded-[3.5rem] p-10 flex flex-col justify-between border border-slate-200 hover:border-brandOrange transition-all">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Users className="text-navy" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-navy mb-2">Meet Experts</h3>
                  <p className="text-slate-500 text-sm font-medium">Talk to real people from your industry face-to-face.</p>
                </div>
              </div>
              <div className="bg-white rounded-[3.5rem] p-10 flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="text-brandOrange" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-navy mb-2">Get Feedback</h3>
                  <p className="text-slate-500 text-sm font-medium">Learn exactly what you did well and what to fix.</p>
                </div>
              </div>
            </div>

            {/* Step 4 Large Image Content */}
            <div className="md:col-span-4 relative group rounded-[3.5rem] overflow-hidden">
              <img 
                src="account.jpeg" 
                alt="Confident Professional Writing Exam" 
                className="w-full h-full object-cover grayscale-[100%] group-hover:grayscale-0 transition-all duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1584820923423-8f15b18d4d51?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-navy/60 group-hover:bg-navy/20 transition-all" />
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className="text-3xl font-black text-white mb-2">Ace the Test</h3>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Try our real-world tests</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-brandOrange font-bold uppercase tracking-[0.3em] text-xs mb-4">The Process</h2>
            <p className="text-5xl font-display font-black text-navy tracking-tight leading-none mb-6">How Meditin Works.</p>
            <p className="text-lg text-slate-500 font-medium">We've distilled years of expert knowledge into a simple, powerful 3-step framework for your success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
            
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group-hover:border-brandOrange transition-all group-hover:-translate-y-2">
                  <div className={`w-20 h-20 ${step.color} text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-current/20`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-display font-black text-navy mb-4">{step.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center font-black text-navy shadow-lg">
                  0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentorship Programs Section */}
      <section className="py-30 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-brandOrange font-black uppercase tracking-[0.3em] text-sm mb-6">Mentorship</h2>
              <p className="text-5xl md:text-7xl font-black text-navy tracking-tighter leading-none">Join Elite Mentorship <br /> Programs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mentorships.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-navy/5 transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-navy">
                    Coming Soon
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 bg-navy/5 text-navy text-[8px] font-black uppercase tracking-widest rounded-md">{m.sector}</span>
                    <span className="px-2 py-0.5 bg-brandOrange/5 text-brandOrange text-[8px] font-black uppercase tracking-widest rounded-md">{m.duration}</span>
                  </div>
                  <h3 className="text-xl font-black text-navy mb-2 group-hover:text-brandOrange transition-colors">{m.title}</h3>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-50">
                    <div>
                      <p className="text-sm font-black text-navy leading-none">{m.mentor}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{m.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleStart}
                    className="w-full mt-8 py-4 bg-slate-50 text-slate-400 group-hover:bg-navy group-hover:text-white rounded-2xl font-black uppercase tracking-widest text-[15px] transition-all"
                  >
                    Join 
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-32 px-6 bg-navy relative overflow-hidden">
        {/* Animated Background Text */}
        <div className="absolute top-0 left-0 w-full whitespace-nowrap overflow-hidden select-none pointer-events-none opacity-[0.03]">
          <span className="text-[200px] font-black text-white leading-none inline-block animate-marquee">REVIEWS REVIEWS REVIEWS REVIEWS</span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
             <h2 className="text-brandOrange font-black uppercase tracking-[0.4em] text-sm mb-6">Real Voices</h2>
             <p className="text-5xl md:text-7xl font-black text-white tracking-tighter">Why people love us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-white/5 rounded-[4rem] -rotate-3 group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-[4rem] p-12 h-full flex flex-col justify-between hover:bg-white/20 transition-all shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex text-brandOrange">
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-xl text-white font-medium leading-relaxed italic">"{t.text}"</p>
                  </div>
                  <div className="flex items-center gap-4 mt-12 pt-8 border-t border-white/10">
                    <div>
                      <p className="font-black text-white text-lg leading-none mb-1">{t.name}</p>
                      <p className="text-[10px] font-bold text-brandOrange uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Results Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-7xl font-black text-navy leading-[0.9] tracking-tighter">Your field. <br /> Our <span className="text-brandOrange">experts.</span></h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
              We have panels of real leaders across healthcare, tech, and law. They set your questions and meet you face-to-face in virtual rooms.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
               <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col items-center text-center group hover:border-brandOrange transition-all">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <Trophy className="text-brandOrange" size={32} />
                  </div>
                  <h4 className="text-4xl font-black text-navy mb-2">98.4%</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Success Rate</p>
               </div>
               <div className="p-10 bg-navy rounded-[3rem] text-white flex flex-col items-center text-center group hover:bg-brandOrange transition-all">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="text-white" size={32} />
                  </div>
                  <h4 className="text-4xl font-black mb-2">100+</h4>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Qualified Pros</p>
               </div>
            </div>
          </div>

          <div className="relative h-[600px] rounded-[4rem] overflow-hidden group">
            <img 
              src="woman.jpeg" 
              alt="Confident Black Professional" 
              className="w-full h-full object-cover grayscale-[100%] group-hover:grayscale-0 transition-all duration-1000"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=1200";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60" />
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <p className="text-4xl font-black mb-4">Walk in like <br /> you own the room.</p>
              <button onClick={() => navigate('/book')} className="flex items-center gap-2 text-brandOrange font-black uppercase tracking-widest group/btn">
                Book now <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

         {/* Become a Mentor Section */}
         <section className="py-30 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl shadow-navy/5 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-brandOrange font-black uppercase tracking-[0.3em] text-sm mb-6">Pass it on</h2>
              <p className="text-4xl md:text-6xl font-black text-navy tracking-tighter leading-none mb-8">Join our network <br /> of expert mentors.</p>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Help the next generation of professionals find their feet. Share your experience, guide their growth, and build your own legacy.
              </p>
            </div>
            <button 
              onClick={() => setIsMentorModalOpen(true)}
              className="px-12 py-6 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brandOrange transition-all shadow-xl shadow-navy/10 active:scale-[0.98] shrink-0"
            >
              Apply as a Mentor
            </button>
          </div>
        </div>
      </section>

      {/* Mentor Application Modal */}
      {isMentorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsMentorModalOpen(false)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-navy transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-10">
              <h3 className="text-3xl font-black text-navy tracking-tighter">Apply to Mentor</h3>
              <p className="text-slate-500 font-medium mt-2">Tell us a bit about yourself and we'll get in touch.</p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                const role = formData.get('role');
                const qualification = formData.get('qualification');
                const phone = formData.get('phone');
                const email = formData.get('email');
                
                const message = `Hello Meditin, I would like to apply as a mentor.\n\nName: ${name}\nRole: ${role}\nQualification: ${qualification}\nPhone: ${phone}\nEmail: ${email}`;
                const whatsappUrl = `https://wa.me/2349029729621?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                setIsMentorModalOpen(false);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <input required name="name" type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brandOrange transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Current Role</label>
                  <input required name="role" type="text" placeholder="Senior Consultant" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brandOrange transition-all font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Highest Qualification</label>
                <input required name="qualification" type="text" placeholder="MBBS, FWACS, etc." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brandOrange transition-all font-medium" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                  <input required name="phone" type="tel" placeholder="+234..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brandOrange transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                  <input required name="email" type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brandOrange transition-all font-medium" />
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brandOrange transition-all shadow-xl shadow-navy/10 active:scale-[0.98]">
                Send Application via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Unique Final CTA */}
      {/* <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto relative h-[500px] rounded-[4rem] bg-navy flex items-center justify-center text-center overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brandOrange/20 via-transparent to-transparent opacity-50" />
           <div className="relative z-10 space-y-10 px-8">
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">Ready to win?</h2>
              <p className="text-xl text-white/50 font-medium max-w-lg mx-auto leading-relaxed">Join the thousands of smart professionals who practice before they play.</p>
              <button 
                onClick={() => navigate('/book')}
                className="px-16 py-8 bg-brandOrange text-white rounded-full font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Let's Go
              </button>
           </div>
        </div>
      </section> */}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
