
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { ShieldCheck, QrCode, Smartphone, ArrowLeft, Zap, AlertCircle } from 'lucide-react';

interface Props {
  cart: CartItem[];
  clearCart: () => void;
}

const Payment: React.FC<Props> = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [customQr, setCustomQr] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('Ranjit Rishidev');
  const [paymentInstruction, setPaymentInstruction] = useState("ये QR CODE को Scan करके पेमेंट करें। \nपेमेंट के बाद 'Proceed Payment' बटन दबाएं।");
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
      return;
    }

    const savedQr = localStorage.getItem('vault_qr_code');
    if (savedQr) setCustomQr(savedQr);

    const savedRecipient = localStorage.getItem('vault_recipient_name');
    if (savedRecipient) setRecipientName(savedRecipient);

    const savedInstruction = localStorage.getItem('vault_payment_instruction');
    if (savedInstruction) setPaymentInstruction(savedInstruction);
  }, [cart, navigate]);

  const handlePayment = () => {
    navigate('/payment-proof');
  };

  // Helper to split text by space for colored emphasis (Ranjit Rishidev style)
  const formatName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length < 2) return name;
    return (
      <>
        {parts[0]} <span className="text-indigo-600">{parts.slice(1).join(' ')}</span>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center overflow-y-auto">
      {/* Mini Top Bar */}
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
        
        {/* Recipient Name - BIG & BOLD */}
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-[1000] text-slate-900 uppercase tracking-tighter leading-none mb-1">
            {formatName(recipientName)}
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Official Recipient</p>
        </div>

        {/* QR Code Container - FULL SCREEN IMPACT */}
        <div className="w-full aspect-square relative mb-8">
           <div className="absolute inset-0 bg-indigo-500/5 rounded-[3rem] blur-3xl"></div>
           <div className="relative w-full h-full bg-white border-8 border-slate-50 rounded-[3rem] shadow-2xl flex items-center justify-center p-6 md:p-10">
              {customQr ? (
                <img 
                  src={customQr} 
                  alt="Payment QR" 
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'auto' }}
                />
              ) : (
                <div className="flex flex-col items-center text-slate-200">
                  <QrCode className="w-32 h-32 md:w-48 md:h-48 mb-4" strokeWidth={1} />
                  <p className="text-xs font-black uppercase tracking-widest">No QR Uploaded</p>
                </div>
              )}
           </div>
        </div>

        {/* Amount Tag */}
        <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-4 shadow-xl mb-8">
           <Smartphone className="w-6 h-6 text-indigo-400" />
           <span className="text-2xl md:text-4xl font-black tracking-tighter">₹{total.toFixed(0)}</span>
        </div>

        {/* Instructions */}
        <div className="w-full bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-5 md:p-8 text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2 text-amber-700">
             <AlertCircle className="w-5 h-5" />
             <span className="text-xs font-black uppercase tracking-widest">Instruction</span>
          </div>
          <p className="text-sm md:text-lg font-bold text-slate-800 italic leading-relaxed whitespace-pre-wrap">
            {paymentInstruction}
          </p>
        </div>

        {/* THE ONLY BUTTON */}
        <button 
          onClick={handlePayment}
          className="w-full py-6 md:py-8 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-[1000] text-xl md:text-3xl uppercase tracking-widest shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 active:scale-95 transition-all mb-12"
        >
          <Zap className="w-6 h-6 md:w-10 md:h-10 text-amber-400 fill-current animate-pulse" />
          <span>PROCEED PAYMENT</span>
        </button>

        {/* Logos */}
        <div className="flex items-center gap-8 opacity-30 grayscale pb-12">
           <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-6" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Google_Pay_%28GPay%29_Logo.svg" alt="GPay" className="h-4" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-3" />
        </div>
      </div>
    </div>
  );
};

export default Payment;
