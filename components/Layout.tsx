
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { Activity, LayoutDashboard, History, User, LogOut, Menu, X, ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

// Fixed the syntax error and missing children scope by adding LayoutProps to React.FC and correct arrow function syntax
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Dashboard': return <LayoutDashboard size={20} />;
      case 'Practice': return <Activity size={20} />;
      case 'History': return <History size={20} />;
      case 'Profile': return <User size={20} />;
      default: return null;
    }
  };

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <button 
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-blue-600 flex items-center gap-2 cursor-pointer"
          >
            <span className="p-1.5 bg-blue-600 text-white rounded-lg">MT</span>
            Meditin
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {/* Use imported NAV_LINKS instead of local appNavLinks */}
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${currentPath === link.path 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {getIcon(link.name)}
              {link.name}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 w-full px-4">
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            onClick={() => navigate('/')}
          >
            <LogOut size={20} />
            Exit Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-6 z-30">
          <button 
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 lg:flex-none flex items-center gap-2">
            {currentPath === '/exam-engine' && (
              <button 
                onClick={() => navigate('/practice')}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft size={14} /> BACK TO PRACTICE
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Dr. Sarah Jenkins</p>
              <p className="text-xs text-slate-500">Student • Medicine</p>
            </div>
            <img 
              src="https://picsum.photos/seed/doc/100/100" 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
