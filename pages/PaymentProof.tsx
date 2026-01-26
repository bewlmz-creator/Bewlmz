
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { Upload, CheckCircle2, Loader2, FileText, AlertCircle, Zap } from 'lucide-react';

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
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = () => {
    if (!selectedFile) return;
    
    setIsVerifying(true);

    // Save order data to localStorage for the Admin to see
    const orderData = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: localStorage.getItem('last_customer_name') || 'Unknown Customer',
      email: localStorage.getItem('last_customer_email') || 'N/A',
      product: cart.map(item => item.name).join(', '),
      amount: total,
      date: new Date().toLocaleDateString(),
      status: 'pending',
      proofImage: proofBase64 // Actual image data saved here
    };

    const existingOrders = JSON.parse(localStorage.getItem('vault_orders') || '[]');
    localStorage.setItem('vault_orders', JSON.stringify([orderData, ...existingOrders]));

    // Simulate verification delay
    setTimeout(() => {
      clearCart();
      navigate('/thank-you');
    }, 3500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16 px-2 sm:px-4">
      <div className="bg-white rounded-[2rem] md:rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
        <div className="p-6 md:p-12 text-center border-b border-gray-50 bg-slate-50/50">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-amber-100 rounded-full mb-3 md:mb-6">
            <FileText className="w-6 h-6 md:w-10 md:h-10 text-amber-600" />
          </div>
          <h1 className="text-xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2 uppercase tracking-tighter">Upload Payment Proof</h1>
          <p className="text-[10px] md:text-sm text-gray-500 max-w-sm mx-auto font-bold uppercase tracking-widest">
            Transaction: <span className="text-indigo-600">₹{total.toFixed(0)}</span>
          </p>
        </div>

        <div className="p-4 md:p-12">
          <div className="flex flex-row items-stretch justify-center gap-3 md:gap-12">
            <div className="flex-1 flex flex-col">
              <div className={`relative flex-grow border-2 border-dashed rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-10 transition-all duration-300 flex flex-col items-center justify-center text-center ${selectedFile ? 'border-green-400 bg-green-50/30' : 'border-gray-200 hover:border-indigo-400 bg-gray-50/50'}`}>
                {!selectedFile ? (
                  <>
                    <div className="bg-white p-2 md:p-4 rounded-xl md:rounded-2xl shadow-sm mb-2 md:mb-4">
                      <Upload className="w-5 h-5 md:w-8 md:h-8 text-indigo-600" />
                    </div>
                    <p className="text-[8px] md:text-sm font-black text-gray-700 mb-0.5 uppercase tracking-tight">Tap to Upload</p>
                    <p className="text-[6px] md:text-xs text-gray-400 uppercase font-bold">Screenshot</p>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </>
                ) : (
                  <div className="text-center space-y-2 md:space-y-4">
                     <div className="bg-green-100 p-2 md:p-4 rounded-full inline-block">
                        <CheckCircle2 className="w-5 h-5 md:w-8 md:h-8 text-green-600" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[7px] md:text-sm font-black text-gray-900 uppercase tracking-tighter truncate max-w-[80px] md:max-w-xs mx-auto">{selectedFile.name}</p>
                        <button onClick={() => {setSelectedFile(null); setProofBase64(null);}} className="text-[6px] md:text-xs text-red-500 font-black uppercase tracking-widest hover:underline">Change</button>
                     </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-[1.2] flex flex-col justify-between space-y-4">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl md:rounded-3xl p-3 md:p-6 flex items-start space-x-2 md:space-x-4">
                 <AlertCircle className="w-4 h-4 md:w-6 md:h-6 text-blue-500 shrink-0" />
                 <div className="text-[7px] md:text-sm text-blue-800 leading-tight md:leading-relaxed">
                    <p className="font-black mb-0.5 md:mb-1 uppercase tracking-widest">Guide:</p>
                    <p className="font-medium uppercase tracking-tighter opacity-80">Amount & Transaction ID must be clearly visible for 5-min access.</p>
                 </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleSubmitProof}
                  disabled={!selectedFile || isVerifying}
                  className={`w-full py-3 md:py-6 rounded-xl md:rounded-2xl font-black text-white shadow-xl flex items-center justify-center space-x-2 md:space-x-3 transition-all active:scale-95 ${
                    isVerifying ? 'bg-indigo-400 cursor-not-allowed' : 
                    selectedFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 cursor-not-allowed text-gray-400'
                  }`}
                >
                  {isVerifying ? (
                    <Loader2 className="w-4 h-4 md:w-6 md:h-6 animate-spin" />
                  ) : (
                    <Zap className="w-3 h-3 md:w-6 md:h-6 fill-current text-amber-400" />
                  )}
                  <span className="text-[8px] md:text-lg uppercase tracking-widest">
                    {isVerifying ? 'Verifying...' : 'Submit Proof'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProof;
