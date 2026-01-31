
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import VaultDB from '../db';
import { supabase } from '../lib/supabase';
import { Play, ShieldCheck, ArrowLeft, Clock, Zap, Lock, AlertCircle, Loader2, RefreshCcw, Sparkles } from 'lucide-react';

interface AccessItem extends Product {
  isVerified: boolean;
  orderDate: string;
}

const MyDownloads: React.FC = () => {
  const [accessList, setAccessList] = useState<AccessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchAccess = useCallback(async (showSyncLoader = false) => {
    if (showSyncLoader) setIsSyncing(true);
    
    const rawEmail = localStorage.getItem('last_customer_email');
    if (!rawEmail) {
      setLoading(false);
      setIsSyncing(false);
      return;
    }

    const email = rawEmail.toLowerCase().trim();
    await VaultDB.pullFromSupabase();
    
    const { data: freshOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('email', email);
    
    const dbProducts = VaultDB.getProducts();
    const access: AccessItem[] = [];

    if (freshOrders) {
      freshOrders.forEach((order: any) => {
        dbProducts.forEach(p => {
          const idMatch = order.product_ids?.includes(p.id);
          const nameMatch = order.product?.toLowerCase().includes(p.name.toLowerCase());
          
          if (idMatch || nameMatch) {
            const existingIdx = access.findIndex(item => item.id === p.id);
            if (existingIdx === -1) {
              access.push({
                ...p,
                isVerified: order.status === 'verified',
                orderDate: new Date(order.created_at || order.date).toLocaleDateString('en-IN')
              });
            } else if (order.status === 'verified') {
              access[existingIdx].isVerified = true;
            }
          }
        });
      });
    }

    setAccessList(access);
    setLoading(false);
    setIsSyncing(false);
  }, []);

  useEffect(() => {
    fetchAccess();
    const email = localStorage.getItem('last_customer_email')?.toLowerCase().trim();
    if (email) {
      const channel = supabase
        .channel('downloads-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `email=eq.${email}` }, () => fetchAccess(true))
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [fetchAccess]);

  const handleDownload = (product: Product) => {
    if (!product.downloadUrl || product.downloadUrl === '#' || product.downloadUrl === '') {
      alert('Video link set nahi hai. Admin se approve hone ka intezar karein ya contact karein.');
      return;
    }
    window.open(product.downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
             <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
             <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Authenticating Vault...</p>
        </div>
      </div>
    );
  }

  if (accessList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-slate-100 flex flex-col items-center">
           <Lock className="w-16 h-16 text-slate-200 mb-8" />
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">No Courses Found</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-10 max-w-sm">
             Bought something? Make sure you used: <br/>
             <span className="text-indigo-600 lowercase font-black text-xs">{localStorage.getItem('last_customer_email') || 'N/A'}</span>
           </p>
           <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/" className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl active:scale-95">
               <ArrowLeft className="w-4 h-4" /> Go to Marketplace
             </Link>
             <button onClick={() => fetchAccess(true)} className="inline-flex items-center gap-3 bg-slate-100 text-slate-600 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-200 transition-all">
               <RefreshCcw className="w-4 h-4" /> Check Again
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 py-12 md:py-24 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 md:mb-20 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg">
             <Sparkles className="w-4 h-4 text-amber-400" />
             <span className="text-[10px] font-black uppercase tracking-widest">My Success Vault</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-[1000] text-slate-900 uppercase tracking-tighter leading-none italic">Learning <span className="text-indigo-600">Access</span></h1>
        </header>

        <div className="grid gap-8">
          {accessList.map((product) => (
            <div key={product.id} className="bg-white rounded-[3rem] md:rounded-[4rem] p-6 md:p-12 border border-slate-100 shadow-xl flex flex-col md:flex-row gap-8 md:gap-16 group relative overflow-hidden">
              
              <div className={`absolute top-0 right-0 px-12 py-3 rotate-45 translate-x-[30%] translate-y-[50%] font-black text-[9px] uppercase tracking-widest z-10 ${product.isVerified ? 'bg-green-500 text-white shadow-lg' : 'bg-amber-400 text-slate-900 animate-pulse'}`}>
                {product.isVerified ? 'UNLOCKED' : 'PENDING'}
              </div>

              <div className="w-full md:w-72 aspect-[2/3] rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0 border-4 border-slate-50 relative bg-slate-900">
                <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-all duration-1000 ${!product.isVerified ? 'grayscale opacity-30 blur-[4px]' : 'group-hover:scale-110'}`} />
                {!product.isVerified && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Lock className="w-16 h-16 text-white/40 mb-4" />
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Admin Approval Awaiting</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between py-2 flex-grow space-y-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter italic">{product.name}</h3>
                    <p className="text-slate-400 font-bold italic text-sm md:text-xl">"{product.description}"</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm"><Clock className="w-6 h-6 text-indigo-600" /></div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Enrollment Date</p>
                        <p className="text-sm font-black text-slate-700">{product.orderDate}</p>
                      </div>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm">
                        {product.isVerified ? <ShieldCheck className="w-6 h-6 text-green-600" /> : <Zap className="w-6 h-6 text-amber-600" />}
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verification</p>
                        <p className={`text-sm font-black uppercase ${product.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                          {product.isVerified ? 'Instant Access ON' : 'Syncing Proof...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {product.isVerified ? (
                    <button 
                      onClick={() => handleDownload(product)}
                      className="w-full bg-blue-600 hover:bg-slate-900 text-white py-6 md:py-10 rounded-[2.5rem] font-[1000] text-lg md:text-3xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-6 active:scale-[0.98] group"
                    >
                      <Play className="w-8 h-8 md:w-12 md:h-12 fill-current text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>START TRAINING</span>
                    </button>
                  ) : (
                    <div className="w-full bg-amber-50 border-4 border-dashed border-amber-200 p-8 rounded-[2.5rem] text-center space-y-4">
                      <div className="flex items-center justify-center gap-3 text-amber-700">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest">Admin Approval In Progress</span>
                      </div>
                      <p className="text-xs md:text-sm font-bold text-amber-900/60 leading-relaxed max-w-sm mx-auto italic">
                        Screenshot check kiya ja raha hai. Approve hote hi button active ho jayega. Malik se alag se baat karne ki zarurat nahi hai!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyDownloads;
