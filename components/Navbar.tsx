
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-navy shadow-2xl py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-brandOrange text-white rounded-xl font-bold text-xl group-hover:rotate-6 transition-transform">MT</div>
          <span className="text-2xl font-black tracking-tighter text-white">Meditin</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-brandOrange ${location.pathname === link.path ? 'text-brandOrange' : 'text-white/80'}`}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={() => navigate('/book')}
            className="px-8 py-3 bg-brandOrange text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-navy transition-all transform hover:scale-105 flex items-center gap-2"
          >
            Get Started <ArrowRight size={14} />
          </button>
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
            onClick={() => { navigate('/book'); setIsOpen(false); }}
            className="w-full py-6 bg-brandOrange text-white rounded-full font-black text-xl uppercase tracking-widest"
          >
            Start Prep
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
