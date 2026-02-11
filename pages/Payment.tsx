
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import VaultDB from '../db';
import { ShieldCheck, QrCode, Smartphone, ArrowLeft, Zap, AlertCircle } from 'lucide-react';

interface Props {
  cart: CartItem[];
  clearCart: () => void;
}

const Payment: React.FC<Props> = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(() => VaultDB.getPaymentConfig());
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
      return;
    }

    const loadSettings = () => {
      setConfig(VaultDB.getPaymentConfig());
    };

    loadSettings();
    window.addEventListener('storage', loadSettings);
    window.addEventListener('vault_sync', loadSettings);
    return () => {
      window.removeEventListener('storage', loadSettings);
      window.removeEventListener('vault_sync', loadSettings);
    };
  }, [cart, navigate]);

  const handlePayment = () => {
    navigate('/payment-proof');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center overflow-y-auto">
      <div className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button 
          onClick={() => navigate('/checkout')}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Payment</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-grow w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
        
        {/* Simplified QR Container - No borders or shadows to avoid "box" look */}
        <div className="w-full aspect-square relative mb-8 mt-4 flex items-center justify-center">
           <div className="absolute inset-0 bg-indigo-500/[0.03] rounded-full blur-3xl"></div>
           <div className="relative w-full max-w-[320px] md:max-w-[400px] h-full flex items-center justify-center p-4">
              {config.qr ? (
                <img 
                  src={config.qr} 
                  alt="Payment QR" 
                  className="w-full h-full object-contain mix-blend-multiply"
                  onError={(e) => {
                    console.error("QR Load failed");
                  }}
                />
              ) : (
                <div className="flex flex-col items-center text-slate-200 text-center">
                  <QrCode className="w-32 h-32 md:w-48 md:h-48 mb-4 opacity-10" strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No QR Uploaded by Admin</p>
                </div>
              )}
           </div>
        </div>

        <div className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 md:p-10 text-center mb-10">
          <p className="text-sm md:text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
            {config.instructions}
          </p>
        </div>

        <button 
          onClick={handlePayment}
          className="w-full py-6 md:py-8 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-[1000] text-xl md:text-3xl uppercase tracking-widest shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 active:scale-95 transition-all mb-12"
        >
          <Zap className="w-6 h-6 md:w-10 md:h-10 text-amber-400 fill-current animate-pulse" />
          <span>PROCEED PAYMENT</span>
        </button>

        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest pb-12">100% Encrypted & Secure Transaction</p>
      </div>
    </div>
  );
};

export default Payment;
