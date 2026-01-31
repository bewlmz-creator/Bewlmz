
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VaultDB from '../db';
import { supabase } from '../lib/supabase';
import { PartyPopper, ArrowLeft, Clock, CheckCircle2, Loader2, ShieldCheck, Play, Zap, Sparkles } from 'lucide-react';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem('last_customer_email')?.toLowerCase().trim();

  const checkStatus = async () => {
    if (!email) {
      setLoading(false);
      return;
    }
    
    // First check local, then Supabase for real-time accuracy
    const orders = VaultDB.getOrders();
    const localVerified = orders.some((o: any) => o.email?.toLowerCase().trim() === email && o.status === 'verified');
    
    if (localVerified) {
      setIsVerified(true);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('orders')
      .select('status')
      .eq('email', email)
      .eq('status', 'verified');

    if (data && data.length > 0) {
      setIsVerified(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
    
    // Listen for real-time approval
    let channel: any;
    if (email) {
      channel = supabase
        .channel('thank-you-status')
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `email=eq.${email}` }, 
          () => {
            setIsVerified(true);
            VaultDB.pullFromSupabase(); // Sync local DB
          }
        )
        .subscribe();
    }

    const interval = setInterval(checkStatus, 5000);
    return () => {
      clearInterval(interval);
      if (channel) supabase.removeChannel(channel);
    };
  }, [email]);

  const handleStartLearning = async () => {
    // Force sync and find the video link
    await VaultDB.pullFromSupabase();
    const products = VaultDB.getProducts();
    const { data: verifiedOrders } = await supabase
      .from('orders')
      .select('product_ids, product')
      .eq('email', email)
      .eq('status', 'verified');

    if (verifiedOrders && verifiedOrders.length > 0) {
      // Find first matching product with a link
      for (const order of verifiedOrders) {
        const product = products.find(p => 
          order.product_ids?.includes(p.id) || 
          order.product?.toLowerCase().includes(p.name.toLowerCase())
        );
        if (product && product.downloadUrl && product.downloadUrl !== '#') {
          window.open(product.downloadUrl, '_blank');
          return;
        }
      }
    }
    // Fallback if no specific link found
    navigate('/my-downloads');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-white rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden border border-gray-100 relative">
        
        {/* Top Accent Bar */}
        <div className={`h-3 w-full ${isVerified ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`}></div>

        <div className="p-8 md:p-20 space-y-10 text-center">
          
          {!isVerified ? (
            <>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-amber-50 p-8 rounded-full inline-block border-4 border-white shadow-xl">
                  <Clock className="w-16 h-16 text-amber-500" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-[1000] text-slate-900 tracking-tighter uppercase italic">Verification <span className="text-amber-500">Pending</span></h1>
                <p className="text-lg md:text-2xl text-slate-500 font-bold max-w-xl mx-auto leading-tight">
                  Aapka payment proof humein mil gaya hai. Hum ise 2-5 minutes mein approve kar denge. 
                </p>
                <p className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 inline-block px-4 py-2 rounded-full">
                  No need to call anyone • Instant Digital Unlock
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                <div className="bg-slate-50 px-6 py-4 rounded-3xl border border-slate-100 flex items-center gap-3">
                   <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Checking Cloud Status...</span>
                </div>
                <Link to="/" className="text-xs font-black text-slate-300 uppercase tracking-widest hover:text-indigo-600 transition-colors">Back to Home</Link>
              </div>
            </>
          ) : (
            <>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-green-500 p-8 rounded-full inline-block border-4 border-white shadow-2xl">
                  <ShieldCheck className="w-16 h-16 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                   <Sparkles className="w-5 h-5 text-amber-400" />
                   <span className="text-xs font-black text-green-600 uppercase tracking-[0.3em]">Payment Verified</span>
                   <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <h1 className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-none">Access <span className="text-green-600">Unlocked!</span></h1>
                <p className="text-lg md:text-2xl text-slate-600 font-bold max-w-xl mx-auto">
                  Mubarak ho! Admin ne aapka payment approve kar diya hai. Ab aap bina kisi deri ke video training shuru kar sakte hain.
                </p>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleStartLearning}
                  className="w-full md:w-auto px-16 py-8 bg-blue-600 hover:bg-slate-900 text-white rounded-[2.5rem] font-[1000] text-xl md:text-3xl uppercase tracking-widest shadow-2xl shadow-blue-200 flex items-center justify-center gap-6 active:scale-95 transition-all group"
                >
                  <Play className="w-8 h-8 md:w-10 md:h-10 fill-current text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>PLAY VIDEO NOW</span>
                </button>
              </div>

              <div className="pt-8 flex items-center justify-center gap-4 opacity-40">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Direct Delivery • No Owner Approval Needed Anymore</span>
              </div>
            </>
          )}

        </div>
        
        <div className="bg-slate-950 p-8 text-center border-t border-white/5">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
             Official Digital Course Platform • bewlmz
           </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
