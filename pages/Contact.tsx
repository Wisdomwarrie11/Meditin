
import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, ChevronRight, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="relative h-[40vh] flex items-center justify-center bg-medical-hero px-6 pt-20">
        <div className="text-center space-y-4 z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">
            Get in <span className="text-brandOrange">Touch</span>
          </h1>
          <p className="text-lg text-slate-300 font-medium">We are here to support your medical career journey.</p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-navy">Connect with MedPraktiz</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                Whether you have questions about our mock exams, interview panels, or international scholarship prep, our team is ready to assist.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: <Phone className="text-brandOrange" />, title: 'Call Us', detail: '+234 800 MED PREP' },
                { icon: <Mail className="text-brandOrange" />, title: 'Email', detail: 'support@medpraktiz.com' },
                { icon: <MapPin className="text-brandOrange" />, title: 'Office', detail: 'Lagos, Nigeria' },
                { icon: <Globe className="text-brandOrange" />, title: 'Global', detail: 'Serving 40+ Fields' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm">{item.icon}</div>
                  <div>
                    <h4 className="font-black text-navy text-sm uppercase tracking-widest">{item.title}</h4>
                    <p className="text-slate-500 font-bold">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy rounded-[3rem] p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brandOrange/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-3xl font-black mb-8">Send a Message</h3>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Full Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brandOrange outline-none transition-all font-bold" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brandOrange outline-none transition-all font-bold" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Message</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brandOrange outline-none transition-all font-bold" placeholder="How can we help?"></textarea>
              </div>
              <button className="w-full py-6 bg-brandOrange text-white rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brandOrange/20 flex items-center justify-center gap-3">
                Send Message <MessageSquare size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
