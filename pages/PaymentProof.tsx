
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import VaultDB from '../db';
import { Upload, CheckCircle2, Loader2, FileText, Zap } from 'lucide-react';

interface Props {
  cart: CartItem[];
  clearCart: () => void;
}

const PaymentProof: React.FC<Props> = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [proofBase64, setProofBase64] = useState<string | null>(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) navigate('/');
  }, [cart, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simple compression check
        const result = reader.result as string;
        setProofBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedFile || !proofBase64) return;
    setIsVerifying(true);

    const orderData = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: localStorage.getItem('last_customer_name') || 'Unknown Customer',
      email: localStorage.getItem('last_customer_email') || 'N/A',
      product: cart.map(item => item.name).join(', '),
      productIds: cart.map(item => item.id),
      amount: total,
      date: new Date().toLocaleDateString(),
      status: 'pending',
      proofImage: proofBase64
    };

    try {
      // Must await for Supabase sync
      await VaultDB.addOrder(orderData);
      clearCart();
      navigate('/thank-you');
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Something went wrong. Please try again.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16 px-4">
      <div className="bg-white rounded-[2rem] md:rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-12 text-center bg-slate-50/50">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-amber-100 rounded-full mb-3">
            <FileText className="w-6 h-6 md:w-10 md:h-10 text-amber-600" />
          </div>
          <h1 className="text-xl md:text-3xl font-black text-gray-900 mb-1 uppercase tracking-tighter">Secure Proof Upload</h1>
          <p className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest">
            Total Payable: <span className="text-indigo-600">₹{total.toFixed(0)}</span>
          </p>
        </div>

        <div className="p-6 md:p-12 space-y-8">
           <div className={`relative border-2 border-dashed rounded-[2rem] p-8 md:p-16 flex flex-col items-center justify-center text-center transition-all ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-indigo-400'}`}>
              {!selectedFile ? (
                <>
                  <Upload className="w-8 h-8 md:w-12 md:h-12 text-indigo-400 mb-4" />
                  <p className="font-black uppercase text-xs tracking-widest text-slate-400">Click to upload screenshot</p>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </>
              ) : (
                <div className="space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="font-black uppercase text-sm truncate max-w-xs">{selectedFile.name}</p>
                  <button onClick={() => setSelectedFile(null)} className="text-xs text-red-500 font-bold uppercase underline">Change File</button>
                </div>
              )}
           </div>

           <button 
             onClick={handleSubmitProof}
             disabled={!selectedFile || isVerifying}
             className={`w-full py-6 rounded-2xl font-black text-white uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isVerifying ? 'bg-indigo-300' : selectedFile ? 'bg-blue-600 hover:bg-blue-700 shadow-xl' : 'bg-gray-200 cursor-not-allowed'}`}
           >
             {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-5 h-5 text-amber-400 fill-current" />}
             <span>{isVerifying ? 'Saving to Database...' : 'Complete Payment'}</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentProof;
