
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, ArrowRight, UserCircle } from 'lucide-react';
import { onAuthStateChange, logoutUser } from '../services/authService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(u => setUser(u));
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleCTA = () => {
    if (user) navigate('/dashboard');
    else navigate('/auth');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-navy shadow-2xl py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          {/* <img 
            src="public/Logo.svg" 
            alt="Meditin Logo" 
            className="w-20 h-20 rounded-xl group-hover:rotate-6 transition-transform object-cover shadow-lg border border-white/10" 
          /> */}
          <span className="text-2xl font-black tracking-tighter text-white">Meditin</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-[12px] font-black uppercase tracking-[0.3em] transition-all hover:text-brandOrange ${location.pathname === link.path ? 'text-brandOrange' : 'text-white/80'}`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-6">
              <button 
                onClick={handleCTA}
                className="flex items-center gap-3 text-white hover:text-brandOrange transition-colors"
              >
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                  <UserCircle size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{user.displayName || 'Account'}</span>
              </button>
              <button 
                onClick={() => { logoutUser(); navigate('/'); }}
                className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={handleCTA}
              className="px-8 py-3 bg-brandOrange text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-navy transition-all transform hover:scale-105 flex items-center gap-2 shadow-2xl shadow-brandOrange/20"
            >
              Get Started <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-navy z-50 flex flex-col items-center justify-center space-y-8 p-6">
          <button className="absolute top-6 right-6 text-white" onClick={() => setIsOpen(false)}><X size={40} /></button>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-4xl font-black text-white hover:text-brandOrange transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={() => { handleCTA(); setIsOpen(false); }}
            className="w-full py-6 bg-brandOrange text-white rounded-full font-black text-xl uppercase tracking-widest shadow-2xl shadow-brandOrange/20"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
