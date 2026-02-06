
import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, ChevronRight, Globe, Sparkles, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-white selection:bg-brandOrange selection:text-white">
      {/* Dynamic Header */}
      <section className="relative h-[120vh] flex items-center pt-24 overflow-hidden bg-[#FCFCFD]">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-navy -skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
             <h1 className="text-6xl md:text-8xl font-black text-navy tracking-tighter leading-[0.85]">
               Let's <br /> <span className="text-brandOrange">talk.</span>
             </h1>
             <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-md leading-relaxed">
               Have a question? We are here to help you win. Our team responds in under 12 hours.
             </p>
          </div>
          <div className="lg:col-span-5 hidden lg:block animate-in fade-in slide-in-from-right duration-1000 delay-300">
             <div className="rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl relative group">
                <img 
                  src="girl.jpeg" 
                  alt="Black professional smiling and holding a phone" 
                  className="w-full h-[550px] object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-all" />
             </div>
          </div>
        </div>
      </section>

      {/* Grid of Contact Options */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-20">
             <div className="space-y-6">
               <h2 className="text-brandOrange font-black uppercase tracking-[0.4em] text-sm">Reach Out</h2>
               <p className="text-5xl font-black text-navy tracking-tighter leading-tight">Ways to get <br /> in touch.</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               {[
                 { icon: <Phone className="text-brandOrange" />, title: 'Call Us', val: '+234 800 MED PREP' },
                 { icon: <Mail className="text-brandOrange" />, title: 'Email', val: 'win@meditin.com' },
                 { icon: <MapPin className="text-brandOrange" />, title: 'Office', val: 'Lagos, Nigeria' },
                 { icon: <Globe className="text-brandOrange" />, title: 'Support', val: '24/7 Priority' }
               ].map((item, i) => (
                 <div key={i} className="group p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:border-brandOrange transition-all">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-navy group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.title}</h4>
                    <p className="text-lg font-black text-navy">{item.val}</p>
                 </div>
               ))}
             </div>
          </div>

          {/* Contact Form */}
          <div className="relative group">
             <div className="absolute -inset-4 bg-navy rounded-[4.5rem] rotate-2 group-hover:rotate-0 transition-transform duration-500 -z-10" />
             <div className="bg-white rounded-[4rem] p-12 lg:p-16 shadow-2xl border border-slate-100">
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-brandOrange text-white rounded-2xl flex items-center justify-center shadow-xl shadow-brandOrange/20"><Send size={24} /></div>
                  <h3 className="text-3xl font-black text-navy">Send a Message</h3>
               </div>
               
               <form className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                       <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 outline-none focus:bg-white focus:border-brandOrange transition-all font-bold text-navy" placeholder="David O." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                       <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 outline-none focus:bg-white focus:border-brandOrange transition-all font-bold text-navy" placeholder="name@email.com" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">How can we help?</label>
                    <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-6 outline-none focus:bg-white focus:border-brandOrange transition-all font-bold text-navy" placeholder="Tell us what you need..."></textarea>
                 </div>
                 <button className="w-full py-8 bg-navy text-white rounded-full font-black text-2xl uppercase tracking-widest shadow-2xl hover:bg-brandOrange transition-all flex items-center justify-center gap-4 active:scale-95">
                   Shoot Message <Send size={28} />
                 </button>
               </form>
             </div>
          </div>
        </div>
      </section>

      {/* Unique Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto h-[400px] bg-navy rounded-[4rem] relative overflow-hidden flex items-center justify-center text-center p-12">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brandOrange/10 via-transparent to-transparent opacity-50" />
           <div className="relative z-10 space-y-8">
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Ready to win?</h3>
              <button onClick={() => window.scrollTo(0,0)} className="px-12 py-5 bg-white text-navy rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all">
                Let's Start Today
              </button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
