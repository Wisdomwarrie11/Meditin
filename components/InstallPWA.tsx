
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // iOS detection
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Capture install prompt for Chrome/Android
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a small delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, we show the prompt if not in standalone
    if (isIOSDevice && !window.matchMedia('(display-mode: standalone)').matches) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-md mx-auto bg-navy/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex items-center gap-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
          <Smartphone size={100} />
        </div>
        
        <div className="w-14 h-14 bg-brandOrange text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
          <Download size={24} />
        </div>

        <div className="flex-1">
          <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">Install Meditin</h4>
          <p className="text-slate-400 text-xs font-medium leading-tight">
            {isIOS 
              ? 'Add to home screen for a seamless mobile experience.'
              : 'Get fast access to mocks & results directly from your home screen.'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {isIOS ? (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 rounded-lg text-white animate-pulse">
                <Share size={18} />
              </div>
              <div className="p-2 bg-white/10 rounded-lg text-white">
                <PlusSquare size={18} />
              </div>
            </div>
          ) : (
            <button 
              onClick={handleInstall}
              className="px-5 py-2.5 bg-brandOrange text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-brandOrange/20"
            >
              Install
            </button>
          )}
          <button 
            onClick={() => setShowPrompt(false)}
            className="p-1 text-white/30 hover:text-white transition-colors self-end"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {isIOS && (
        <div className="max-w-md mx-auto mt-2 text-center text-white/40 text-[10px] font-bold uppercase tracking-widest">
          Tap <Share size={10} className="inline mx-1"/> then "Add to Home Screen"
        </div>
      )}
    </div>
  );
};

export default InstallPWA;
