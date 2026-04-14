import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, UserCircle, LogOut } from 'lucide-react';
import { onAuthStateChange, logoutUser } from '../services/authService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(u => setUser(u));
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Prices', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleCTA = () => {
    if (user) navigate('/dashboard');
    else navigate('/auth');
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
          scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg border border-white/20' : 'bg-transparent'
        }`}>
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-display font-black tracking-tight text-navy">Meditin</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 pr-6 border-r border-slate-200">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-xs font-bold tracking-wide transition-all hover:text-brandOrange ${
                    location.pathname === link.path ? 'text-brandOrange' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {user && user.emailVerified ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleCTA}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all"
                >
                  <UserCircle size={20} className="text-navy" />
                  <span className="text-xs font-bold text-navy">{user.displayName || 'Account'}</span>
                </button>
                <button 
                  onClick={() => { logoutUser(); navigate('/'); }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-brandOrange animate-pulse uppercase tracking-widest">Verification Pending</span>
                <button 
                  onClick={() => { logoutUser(); navigate('/'); }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleCTA}
                className="px-6 py-2.5 bg-navy text-white rounded-xl font-bold text-sm transition-all hover:bg-navy-800 hover:shadow-xl hover:shadow-navy/20 active:scale-95 flex items-center gap-2"
              >
                Get Started <ArrowRight size={16} />
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-navy" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full px-6 pt-2"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="block text-2xl font-display font-black text-navy hover:text-brandOrange transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-slate-100">
                <button 
                  onClick={() => { handleCTA(); setIsOpen(false); }}
                  className="w-full py-4 bg-brandOrange text-white rounded-2xl font-bold text-lg shadow-xl shadow-brandOrange/20"
                >
                  {user ? (user.emailVerified ? 'Dashboard' : 'Verify Email') : 'Sign In'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
