
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import VaultDB from '../db';
import { Download, Play, ShieldCheck, ArrowLeft, Clock, Zap, Lock, AlertCircle } from 'lucide-react';

interface AccessItem extends Product {
  isVerified: boolean;
  orderDate: string;
}

const MyDownloads: React.FC = () => {
  const [accessList, setAccessList] = useState<AccessItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccess = useCallback(() => {
    const rawEmail = localStorage.getItem('last_customer_email');
    if (!rawEmail) {
      setLoading(false);
      return;
    }

    const email = rawEmail.toLowerCase().trim();
    const orders = VaultDB.getOrders();
    const dbProducts = VaultDB.getProducts();
    
    // Filter orders by normalized email
    const userOrders = orders.filter((o: any) => 
      o.email?.toLowerCase().trim() === email
    );
    
    const access: AccessItem[] = [];
    
    userOrders.forEach((order: any) => {
      // Match by IDs if available, fallback to name matching for legacy orders
      dbProducts.forEach(p => {
        const idMatch = order.productIds?.includes(p.id);
        const nameMatch = order.product?.includes(p.name);
        
        if (idMatch || nameMatch) {
          // Avoid duplicates
          if (!access.find(item => item.id === p.id)) {
            access.push({
              ...p,
              isVerified: order.status === 'verified',
              orderDate: order.date
            });
          }
        }
      });
    });

    setAccessList(access);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAccess();
    window.addEventListener('storage', fetchAccess);
    window.addEventListener('vault_sync', fetchAccess);
    return () => {
      window.removeEventListener('storage', fetchAccess);
      window.removeEventListener('vault_sync', fetchAccess);
    };
  }, [fetchAccess]);

  const handleDownload = (product: Product) => {
    if (!product.downloadUrl || product.downloadUrl === '#' || product.downloadUrl === '') {
      alert('Access Link is being generated. Please contact support if this takes more than 10 minutes.');
      return;
    }
    window.open(product.downloadUrl, '_blank');
  };

  if (loading) return null;

  if (accessList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-slate-100 flex flex-col items-center">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
              <Lock className="w-10 h-10 text-slate-200" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">No Downloads Found</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-10 max-w-sm leading-relaxed">
             Email used: <span className="text-indigo-600">{localStorage.getItem('last_customer_email')}</span><br/>
             Make sure you are using the same email you used during checkout.
           </p>
           <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95">
             <ArrowLeft className="w-4 h-4" /> Start Learning
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 py-12 md:py-24 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 md:mb-20 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg shadow-indigo-100">
             <ShieldCheck className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">Premium Course Vault</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Your <span className="text-indigo-600">Library</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs italic">
            {localStorage.getItem('last_customer_email')}
          </p>
        </header>

        <div className="grid gap-8">
          {accessList.map((product) => (
            <div key={product.id} className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 border border-slate-100 shadow-xl flex flex-col md:flex-row gap-8 md:gap-14 group overflow-hidden relative">
              
              {/* Status Ribbon */}
              <div className={`absolute top-0 right-0 px-10 py-2 rotate-45 translate-x-[30%] translate-y-[50%] font-black text-[8px] uppercase tracking-[0.2em] shadow-sm ${product.isVerified ? 'bg-green-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                {product.isVerified ? 'Verified' : 'Pending'}
              </div>

              <div className="w-full md:w-64 aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl shrink-0 border-4 border-slate-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>

              <div className="flex flex-col justify-between py-4 flex-grow space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">{product.name}</h3>
                  </div>
                  <p className="text-slate-500 font-bold italic mb-8 leading-relaxed text-sm md:text-xl">"{product.description}"</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ordered On</p>
                        <p className="text-xs font-black text-slate-700">{product.orderDate}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                        <p className={`text-xs font-black ${product.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                          {product.isVerified ? 'READY' : 'REVIEWING'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {product.isVerified ? (
                    <button 
                      onClick={() => handleDownload(product)}
                      className="w-full bg-blue-600 hover:bg-slate-900 text-white py-6 md:py-8 rounded-3xl font-black text-sm md:text-xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 active:scale-95 group/btn"
                    >
                      <Play className="w-6 h-6 md:w-8 md:h-8 fill-current text-amber-400" />
                      <span>Access Training Now</span>
                    </button>
                  ) : (
                    <div className="w-full bg-amber-50 border-2 border-amber-200 p-6 md:p-8 rounded-3xl text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 text-amber-700">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Verification</span>
                      </div>
                      <p className="text-xs md:text-sm font-bold text-amber-900 opacity-80 leading-relaxed italic">
                        Our team is checking your payment proof. Once approved, the download button will appear here automatically. (Usually takes 5-10 mins)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
           <div className="bg-slate-900 rounded-[3rem] md:rounded-[5rem] p-10 md:p-24 text-white relative overflow-hidden shadow-2xl border border-white/5">
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                 <Zap className="w-12 h-12 md:w-20 md:h-20 text-amber-400 mx-auto fill-current animate-bounce" />
                 <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">Your Future <br/><span className="text-indigo-500">Starts Here</span></h2>
                 <p className="text-slate-400 text-sm md:text-lg font-bold opacity-80 leading-relaxed uppercase tracking-widest">Watch every module carefully. Success comes to those who take massive action.</p>
                 <Link to="/" className="inline-flex items-center gap-2 bg-white text-slate-900 px-12 py-6 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95">
                    <ArrowLeft className="w-4 h-4" /> Marketplace
                 </Link>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyDownloads;
