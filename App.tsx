
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import PracticeSelector from './pages/PracticeSelector';
import ExamEngine from './pages/ExamEngine';
import InstallPWA from './components/InstallPWA';

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
            <Route path="/book" element={<Booking />} />
            <Route path="/payment/:sessionId" element={<Payment />} />
            <Route path="/practice" element={<PracticeSelector />} />
            <Route path="/exam-engine" element={<ExamEngine />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/success" element={<Success />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/brand-assets" element={<BrandAssets />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <InstallPWA />

        <footer className="bg-navy text-white py-20 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src="public/Logo.svg" alt="Meditin" className="w-10 h-10 rounded-xl" />
                <span className="text-2xl font-black tracking-tighter">Meditin</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering the next generation of professionals through realistic simulations and expert feedback. Designed for global career success.
              </p>
            </div>
            <div>
              <h4 className="font-black text-brandOrange uppercase tracking-widest text-xs mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-bold">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#/gallery" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#/brand-assets" className="hover:text-brandOrange transition-colors">Brand Assets</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-brandOrange uppercase tracking-widest text-xs mb-6">Support</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-bold">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#/contact" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-brandOrange uppercase tracking-widest text-xs mb-6">Contact</h4>
              <p className="text-slate-400 text-sm font-bold">
                support@meditin.com<br />
                +2349029729621<br />
                Delta, Nigeria
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
            © 2025 Meditin Technologies. Built for Medical Excellence.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
