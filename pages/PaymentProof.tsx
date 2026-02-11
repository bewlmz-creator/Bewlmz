
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import VaultDB from '../db';
import { Upload, CheckCircle2, Loader2, FileText, Zap, AlertCircle, X } from 'lucide-react';

interface Props {
  cart: CartItem[];
  clearCart: () => void;
}

const PaymentProof: React.FC<Props> = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [proofBase64, setProofBase64] = useState<string | null>(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) navigate('/');
  }, [cart, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onerror = () => {
      alert("Failed to read file. Please try selecting the image again.");
      setIsProcessing(false);
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        alert("Invalid image format. Please use a screenshot from your gallery.");
        setIsProcessing(false);
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const maxDim = 800;
        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4);
          setProofBase64(compressedBase64);
        }
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = async () => {
    if (!selectedFile || !proofBase64) {
      alert("Please upload your payment screenshot first.");
      return;
    }
    
    setIsVerifying(true);

    try {
      const orderData = {
        id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        name: localStorage.getItem('last_customer_name') || 'Customer',
        email: localStorage.getItem('last_customer_email') || 'N/A',
        phone: localStorage.getItem('last_customer_phone') || 'N/A',
        product: cart.map(item => item.name).join(', '),
        productIds: cart.map(item => item.id),
        amount: total,
        date: new Date().toLocaleDateString('en-IN'),
        status: 'pending',
        proofImage: proofBase64
      };

      const success = await VaultDB.addOrder(orderData);
      
      if (success) {
        clearCart();
        navigate('/thank-you');
      } else {
        throw new Error("Supabase connection failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Photo upload fail ho gaya. Koshish karein image thoda crop karke.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16 px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] md:rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        
        <div className="p-8 md:p-12 space-y-8">
           {/* Seamless Upload Area - Removed heavy box styling */}
           <div className="relative w-full flex flex-col items-center justify-center text-center transition-all duration-300 py-10">
              
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-indigo-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>

              {!proofBase64 && !isProcessing ? (
                <div className="relative group cursor-pointer flex flex-col items-center">
                  <div className="bg-slate-50 p-8 md:p-12 rounded-full mb-6 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <Upload className="w-10 h-10 md:w-12 md:h-12" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-[1000] uppercase text-sm md:text-xl text-slate-900 tracking-tight">Tap to Upload Screenshot</p>
                    <p className="font-bold text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">Select your payment proof</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              ) : isProcessing ? (
                <div className="space-y-4 py-8 relative">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto relative" />
                  </div>
                  <p className="font-black uppercase text-xs tracking-[0.3em] text-indigo-600 animate-pulse">Optimizing Proof...</p>
                </div>
              ) : (
                <div className="space-y-8 animate-in zoom-in duration-300 relative">
                  <div className="relative inline-block">
                    <img 
                      src={proofBase64!} 
                      className="w-48 md:w-80 h-auto rounded-3xl shadow-2xl border-8 border-white" 
                      alt="Proof Preview"
                    />
                    <button 
                      onClick={() => { setProofBase64(null); setSelectedFile(null); }}
                      className="absolute -top-4 -right-4 bg-red-500 text-white p-2.5 rounded-full shadow-lg hover:bg-slate-900 transition-colors border-2 border-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-green-600 bg-green-50 px-6 py-2 rounded-full border border-green-100 mx-auto w-fit">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-black uppercase text-[10px] tracking-widest">Screenshot Received</p>
                  </div>
                </div>
              )}
           </div>

           <div className="space-y-4 pt-4">
              <button 
                onClick={handleSubmitProof}
                disabled={!proofBase64 || isVerifying || isProcessing}
                className={`w-full py-6 md:py-10 rounded-3xl md:rounded-[2.5rem] font-black text-white uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all duration-300 text-base md:text-3xl ${isVerifying ? 'bg-slate-800 cursor-not-allowed' : proofBase64 ? 'bg-blue-600 hover:bg-slate-900 shadow-2xl shadow-blue-500/30 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-6 h-6 md:w-10 md:h-10 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 md:w-10 md:h-10 text-amber-400 fill-current animate-pulse" />
                    <span>SEND PROOF</span>
                  </>
                )}
              </button>
              
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Stay on this page until upload finishes</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProof;
