
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import VaultDB from '../db';
import { supabase } from '../lib/supabase';
// Added RefreshCcw to the imports
import { Download, Play, ShieldCheck, ArrowLeft, Clock, Zap, Lock, AlertCircle, Loader2, RefreshCcw } from 'lucide-react';

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
    
    // Force sync from Supabase to get latest status
    await VaultDB.pullFromSupabase();
    
    // Get fresh orders from Supabase directly to bypass any localStorage delays
    const { data: freshOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('email', email);
    
    const dbProducts = VaultDB.getProducts();
    const access: AccessItem[] = [];

    if (freshOrders) {
      freshOrders.forEach((order: any) => {
        dbProducts.forEach(p => {
          // Robust matching: Check product_ids (array) or the product name string
          const idMatch = order.product_ids?.includes(p.id);
          const nameMatch = order.product?.toLowerCase().includes(p.name.toLowerCase());
          
          if (idMatch || nameMatch) {
            // Avoid duplicates
            if (!access.find(item => item.id === p.id)) {
              access.push({
                ...p,
                isVerified: order.status === 'verified',
                orderDate: new Date(order.created_at || order.date).toLocaleDateString('en-IN')
              });
            } else {
              // If already found but this order is verified, update the status
              const existing = access.find(item => item.id === p.id);
              if (existing && order.status === 'verified') {
                existing.isVerified = true;
              }
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

    // Set up Realtime listener for status changes
    const email = localStorage.getItem('last_customer_email')?.toLowerCase().trim();
    if (email) {
      const channel = supabase
        .channel('downloads-status-sync')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'orders',
            filter: `email=eq.${email}` 
          }, 
          () => {
            console.log("Status updated via Realtime! Refreshing library...");
            fetchAccess(true);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchAccess]);

  const handleDownload = (product: Product) => {
    if (!product.downloadUrl || product.downloadUrl === '#' || product.downloadUrl === '') {
      alert('Your access link is being generated. Please wait 2-5 minutes or contact support.');
      return;
    }
    window.open(product.downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Opening Your Vault...</p>
        </div>
      </div>
    );
  }

  if (accessList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-slate-100 flex flex-col items-center">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
              <Lock className="w-10 h-10 text-slate-200" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">No Courses Found</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-10 max-w-sm leading-relaxed">
             We couldn't find any orders for: <br/>
             <span className="text-indigo-600 lowercase">{localStorage.getItem('last_customer_email') || 'N/A'}</span>
           </p>
           <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl active:scale-95">
               <ArrowLeft className="w-4 h-4" /> Marketplace
             </Link>
             <button onClick={() => fetchAccess(true)} className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95">
               <RefreshCcw className="w-4 h-4" /> Refresh Status
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
          <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full shadow-lg shadow-green-100">
             {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
             <span className="text-[10px] font-black uppercase tracking-widest">
               {isSyncing ? 'Syncing Status...' : 'Your Premium Library'}
             </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Learning <span className="text-indigo-600">Vault</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs italic">
            Active User: {localStorage.getItem('last_customer_email')}
          </p>
        </header>

        <div className="grid gap-8">
          {accessList.map((product) => (
            <div key={product.id} className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 border border-slate-100 shadow-xl flex flex-col md:flex-row gap-8 md:gap-14 group overflow-hidden relative">
              
              <div className={`absolute top-0 right-0 px-10 py-2 rotate-45 translate-x-[30%] translate-y-[50%] font-black text-[8px] uppercase tracking-[0.2em] shadow-sm z-10 ${product.isVerified ? 'bg-green-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                {product.isVerified ? 'Access Granted' : 'Verification Pending'}
              </div>

              <div className="w-full md:w-64 aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl shrink-0 border-4 border-slate-50 relative">
                <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-all duration-700 ${!product.isVerified ? 'grayscale blur-[2px]' : 'group-hover:scale-105'}`} />
                {!product.isVerified && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <Lock className="w-12 h-12 text-white/50" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between py-4 flex-grow space-y-8">
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">{product.name}</h3>
                  <p className="text-slate-500 font-bold italic mb-8 leading-relaxed text-sm md:text-xl">"{product.description}"</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Enrolled On</p>
                        <p className="text-xs font-black text-slate-700">{product.orderDate}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <ShieldCheck className={`w-5 h-5 ${product.isVerified ? 'text-green-500' : 'text-amber-500'}`} />
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Security Status</p>
                        <p className={`text-xs font-black ${product.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                          {product.isVerified ? 'SECURE ACCESS' : 'LOCKED'}
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
                      <span>Watch Training Now</span>
                    </button>
                  ) : (
                    <div className="w-full bg-amber-50 border-2 border-amber-200 p-6 md:p-8 rounded-3xl text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 text-amber-700">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Admin Reviewing Payment</span>
                      </div>
                      <p className="text-xs md:text-sm font-bold text-amber-900 opacity-80 leading-relaxed italic">
                        Please wait 2-5 minutes while we confirm your screenshot. This page will update automatically once verified!
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
