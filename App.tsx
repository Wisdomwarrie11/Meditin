
import React from 'react';
// Updated to react-router-dom v6 syntax
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import Success from './pages/Success';
import Contact from './pages/Contact';
import BrandAssets from './pages/BrandAssets';
import Gallery from './pages/Gallery';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Payment from './pages/Payment';
import ExamEngine from './pages/ExamEngine';
import AdminBookings from './pages/AdminBookings';
import VerifyEmail from './pages/VerifyEmail';
import InstallPWA from './components/InstallPWA';
import { Analytics } from '@vercel/analytics/next';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/payment/:sessionId" element={<Payment />} />
            <Route path="/practice" element={<Navigate to="/dashboard" />} />
            <Route path="/exam-engine" element={<ExamEngine />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/success" element={<Success />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/brand-assets" element={<BrandAssets />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <InstallPWA />

        <footer className="bg-navy-900 text-white py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brandOrange rounded-xl flex items-center justify-center shadow-lg shadow-brandOrange/20">
                  <img src="public/Logo.svg" alt="Meditin" className="w-6 h-6 invert" />
                </div>
                <span className="text-2xl font-display font-black tracking-tight">Meditin</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                The world's most realistic simulation platform for medical exams and high-stakes interviews. Built by experts, powered by intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm mb-8">Platform</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><Link to="/" className="hover:text-brandOrange transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-brandOrange transition-colors">About Us</Link></li>
                <li><Link to="/gallery" className="hover:text-brandOrange transition-colors">Gallery</Link></li>
                <li><Link to="/brand-assets" className="hover:text-brandOrange transition-colors">Brand Assets</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm mb-8">Support</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><a href="#" className="hover:text-brandOrange transition-colors">Documentation</a></li>
                <li><Link to="/contact" className="hover:text-brandOrange transition-colors">Contact Support</Link></li>
                <li><a href="#" className="hover:text-brandOrange transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brandOrange transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm mb-8">Contact</h4>
              <p className="text-slate-400 text-sm font-medium leading-loose">
                support@meditin.com<br />
                +234 902 972 9621<br />
                Delta, Nigeria
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <span>© 2025 Meditin Technologies. All rights reserved.</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;