
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VaultDB from '../db';
import { PartyPopper, Download, Mail, ArrowLeft, Clock, CheckCircle2, Loader2, ShieldCheck, Lock, Play } from 'lucide-react';

const ThankYou: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      const email = localStorage.getItem('last_customer_email');
      if (!email) {
        setIsVerified(false);
        setChecking(false);
        return;
      }
      const orders = VaultDB.getOrders();
      const verified = orders.some((o: any) => o.email?.toLowerCase().trim() === email.toLowerCase().trim() && o.status === 'verified');
      setIsVerified(verified);
      setChecking(false);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    window.addEventListener('storage', checkStatus);
    window.addEventListener('vault_sync', checkStatus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkStatus);
      window.removeEventListener('vault_sync', checkStatus);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden text-center border border-gray-100">
        <div className="p-10 md:p-16 space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-green-500 p-6 rounded-full inline-block shadow-xl shadow-green-100">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Proof Submitted!</h1>
            <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100/50">
              <p className="text-xl md:text-2xl text-indigo-900 font-bold leading-relaxed max-w-2xl mx-auto">
                Payment screenshot receive ho gayi hai! Admin approve karte hi upar menu mein <span className="text-indigo-600">"Play Video"</span> button active ho jayega.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
             <div className={`flex items-center gap-3 px-8 py-4 rounded-2xl border font-black uppercase text-xs tracking-widest transition-all ${isVerified ? 'bg-green-100 border-green-200 text-green-700' : 'bg-amber-100 border-amber-200 text-amber-700'}`}>
                {isVerified ? <ShieldCheck className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                {isVerified ? 'Video Unlocked Successfully!' : 'Waiting for Admin Approval...'}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
               <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                     <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-black text-amber-900 uppercase">Wait Time</p>
                     <p className="text-xs text-amber-700 font-bold">2-5 Minutes</p>
                  </div>
               </div>
               <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                     <Play className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-black text-green-900 uppercase">Delivery</p>
                     <p className="text-xs text-green-700 font-bold">Direct in App</p>
                  </div>
               </div>
             </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link 
                to="/" 
                className="w-full sm:w-auto px-10 py-5 bg-gray-100 text-gray-700 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all text-sm uppercase tracking-widest"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Marketplace</span>
              </Link>
              
              {isVerified ? (
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto px-10 py-5 bg-green-600 text-white rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-green-700 transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Learning Now</span>
                </button>
              ) : (
                <div className="w-full sm:w-auto px-10 py-5 bg-slate-200 text-slate-400 rounded-2xl font-black flex items-center justify-center space-x-2 cursor-not-allowed text-sm uppercase tracking-widest">
                  <Lock className="w-5 h-5" />
                  <span>App Locked (Pending)</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 p-8 text-white">
           <div className="flex flex-col md:flex-row items-center justify-center gap-4">
             <PartyPopper className="w-6 h-6 text-amber-400" />
             <p className="text-sm font-bold uppercase tracking-widest">
               No email needed—Video will play directly in this app!
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
