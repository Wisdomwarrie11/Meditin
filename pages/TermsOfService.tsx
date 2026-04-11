import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Gavel, AlertCircle, CheckCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-navy/5 border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-navy/5 text-navy rounded-2xl flex items-center justify-center">
              <Scale size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-navy tracking-tighter">Terms of Use</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Last Updated: April 2026</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                <CheckCircle className="text-brandOrange" size={24} /> 1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                By accessing or using the Meditin platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                <Gavel className="text-brandOrange" size={24} /> 2. Description of Service
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Meditin provides simulation services for medical exams and professional interviews. This includes mock sessions with experts, AI-driven feedback, and performance analytics. We reserve the right to modify or discontinue the service at any time without notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy">3. User Conduct</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                You agree to use the platform only for lawful purposes. You are prohibited from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium">
                <li>Recording sessions without explicit permission from the expert/interviewer.</li>
                <li>Sharing exam questions or proprietary simulation content with third parties.</li>
                <li>Using the platform for any fraudulent or malicious activity.</li>
                <li>Attempting to bypass any security measures or access unauthorized data.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy">4. Payments and Refunds</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Payments for sessions are made in advance. Refunds are handled on a case-by-case basis and are generally only provided if a session is cancelled by Meditin or if there are significant technical failures on our part.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                <AlertCircle className="text-brandOrange" size={24} /> 5. Limitation of Liability
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Meditin and its experts are not responsible for your actual exam results or job interview outcomes. Our simulations are tools for preparation and do not guarantee success in real-world scenarios. We shall not be liable for any indirect, incidental, or consequential damages.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy">6. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                All content on the Meditin platform, including text, graphics, logos, and simulation materials, is the property of Meditin Technologies and is protected by intellectual property laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy">7. Governing Law</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                These terms and conditions are governed by and construed in accordance with the laws of the Federal Republic of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy">8. Changes to Terms</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Meditin may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Use.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
