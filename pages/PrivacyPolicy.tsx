import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
            <div className="w-16 h-16 bg-brandOrange/10 text-brandOrange rounded-2xl flex items-center justify-center">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-navy tracking-tighter">Privacy Policy</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Last Updated: April 2026</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                <Eye className="text-brandOrange" size={24} /> 1. Introduction
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                At Meditin, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform for medical exam simulations and interview preparation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                <FileText className="text-brandOrange" size={24} /> 2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="font-black text-navy mb-2">Personal Information</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We collect information you provide directly to us, such as your name, email address, professional sector, field of study, and institution when you create an account or book a session.
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="font-black text-navy mb-2">Usage Data</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We automatically collect certain information about your interaction with our platform, including your IP address, browser type, pages visited, and performance scores during simulations.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                <Lock className="text-brandOrange" size={24} /> 3. How We Use Your Information
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                We use the collected data for various purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium">
                <li>To provide and maintain our Service, including scheduling mock sessions.</li>
                <li>To notify you about changes to our Service or upcoming sessions.</li>
                <li>To provide expert feedback and performance analysis.</li>
                <li>To monitor the usage of our Service and improve user experience.</li>
                <li>To provide customer support and handle inquiries.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy">4. Data Security</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                The security of your data is important to us. We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, remember that no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy">5. Third-Party Services</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                We may employ third-party companies and individuals to facilitate our Service (e.g., payment processors like Paystack/Flutterwave). These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy">6. Your Rights</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                You have the right to access, update, or delete the information we have on you. Whenever made possible, you can access, update or request deletion of your Personal Data directly within your account settings section.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-navy">7. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="p-6 bg-navy text-white rounded-2xl">
                <p className="font-black">Email: support@meditin.com</p>
                <p className="text-sm opacity-70">Delta, Nigeria</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
