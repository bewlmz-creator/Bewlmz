
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
      alert("Failed to read file. Try another image.");
      setIsProcessing(false);
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        alert("Invalid image file.");
        setIsProcessing(false);
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Standardize max dimension for stability
        const maxDim = 1200;
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
          // Compress significantly to stay within safe payload limits
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
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
      alert("Please upload a valid screenshot first.");
      return;
    }
    
    setIsVerifying(true);

    try {
      const orderData = {
        id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        name: localStorage.getItem('last_customer_name') || 'Customer',
        email: localStorage.getItem('last_customer_email') || 'N/A',
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
      alert("Error: Photo upload fail ho gaya. Kripya apna internet check karein ya screenshot ka size thoda kam karke phir se koshish karein.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16 px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] md:rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 md:p-12 text-center bg-slate-50 border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-3xl mb-4 shadow-sm">
            <FileText className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Submit Payment Proof</h1>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-widest">Amount to Confirm</p>
            <p className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tight">₹{total.toFixed(0)}</p>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-8">
           {/* Upload Zone */}
           <div className={`relative border-4 border-dashed rounded-[3rem] p-10 md:p-20 flex flex-col items-center justify-center text-center transition-all duration-300 ${proofBase64 ? 'border-green-400 bg-green-50/50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}>
              {!proofBase64 && !isProcessing ? (
                <>
                  <div className="bg-indigo-100 p-6 rounded-full mb-6">
                    <Upload className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black uppercase text-sm md:text-lg text-slate-900 tracking-tight">Click or Tap to Upload</p>
                    <p className="font-bold text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">Screenshot of your payment</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </>
              ) : isProcessing ? (
                <div className="space-y-4 py-4">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                  <p className="font-black uppercase text-xs tracking-widest text-indigo-600 animate-pulse">Processing Image...</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in zoom-in duration-300">
                  <div className="relative inline-block">
                    <img 
                      src={proofBase64!} 
                      className="w-40 md:w-64 h-auto rounded-2xl shadow-xl border-4 border-white" 
                      alt="Proof Preview"
                    />
                    <button 
                      onClick={() => { setProofBase64(null); setSelectedFile(null); }}
                      className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                    <p className="font-black uppercase text-xs tracking-widest">Ready to Send</p>
                  </div>
                </div>
              )}
           </div>

           {/* Submit Button */}
           <div className="space-y-4">
              <button 
                onClick={handleSubmitProof}
                disabled={!proofBase64 || isVerifying || isProcessing}
                className={`w-full py-6 md:py-8 rounded-3xl font-black text-white uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all duration-300 text-sm md:text-xl ${isVerifying ? 'bg-indigo-400 cursor-not-allowed' : proofBase64 ? 'bg-blue-600 hover:bg-slate-900 shadow-2xl shadow-blue-200 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
                    <span>Syncing with Cloud...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 md:w-8 md:h-8 text-amber-400 fill-current" />
                    <span>Complete Enrollment</span>
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Do not close this page while uploading</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProof;
