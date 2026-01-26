
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../constants';
import { Product } from '../types';
import { Download, Play, ShieldCheck, ArrowLeft, ExternalLink, Zap } from 'lucide-react';

const MyDownloads: React.FC = () => {
  const navigate = useNavigate();
  const [verifiedProducts, setVerifiedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerified = () => {
      const email = localStorage.getItem('last_customer_email');
      const orders = JSON.parse(localStorage.getItem('vault_orders') || '[]');
      const savedProducts = JSON.parse(localStorage.getItem('vault_products') || JSON.stringify(FEATURED_PRODUCTS));
      
      const verifiedOrderProducts = orders
        .filter((o: any) => o.email === email && o.status === 'verified')
        .map((o: any) => o.product);

      const matches = savedProducts.filter((p: Product) => 
        verifiedOrderProducts.some((orderP: string) => orderP.includes(p.name))
      );

      setVerifiedProducts(matches);
      setLoading(false);
    };

    fetchVerified();
    window.addEventListener('storage', fetchVerified);
    return () => window.removeEventListener('storage', fetchVerified);
  }, []);

  if (loading) return null;

  if (verifiedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-sm border border-slate-100">
           <ShieldCheck className="w-16 h-16 text-slate-200 mx-auto mb-6" />
           <h2 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter mb-4">No Verified Access</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-10">Your payment proof is currently being reviewed by our admin.</p>
           <Link to="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-600 transition-all">
             <ArrowLeft className="w-4 h-4" /> Back to Market
           </Link>
        </div>
      </div>
    );
  }

  const handleDownload = (product: Product) => {
    if (!product.downloadUrl || product.downloadUrl === '#' || product.downloadUrl === '') {
      alert('Video link is being updated by admin. Please try again in 1 minute.');
      return;
    }
    window.open(product.downloadUrl, '_blank');
  };

  return (
    <div className="animate-in fade-in duration-500 py-12 md:py-24 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 md:mb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-6 py-2 rounded-full mb-6">
             <ShieldCheck className="w-5 h-5 text-green-600" />
             <span className="text-xs font-black text-green-700 uppercase tracking-widest">Verified Vault Access</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-[1000] text-slate-900 uppercase tracking-tighter leading-none mb-4">My <span className="text-indigo-600">Downloads</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-sm italic">Access your premium business guides below.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {verifiedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-[3rem] p-6 md:p-12 border border-slate-100 shadow-xl flex flex-col md:flex-row gap-8 md:gap-12 group hover:shadow-indigo-500/5 transition-all">
              <div className="w-full md:w-56 aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex flex-col justify-between py-2 flex-grow">
                <div>
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">{product.name}</h3>
                  <p className="text-slate-500 font-medium italic mb-6 leading-relaxed">"{product.description}"</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {product.features?.map((f, i) => (
                      <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 px-3 py-1 rounded-md">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleDownload(product)}
                    className="w-full bg-indigo-600 hover:bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 group/btn"
                  >
                    <Download className="w-5 h-5 group-hover/btn:animate-bounce" />
                    <span>Download Video Guide</span>
                  </button>
                  <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Full HD .MP4 Content</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
           <div className="bg-indigo-900 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                 <Zap className="w-10 h-10 md:w-16 md:h-16 text-amber-400 mx-auto fill-current animate-pulse" />
                 <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter italic">Ready to scale?</h2>
                 <p className="text-indigo-200 text-sm md:text-lg font-medium opacity-80">Follow the steps exactly as shown in the videos to launch your 3 Lakh/Month business today.</p>
                 <Link to="/" className="inline-block bg-white text-indigo-900 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl">Back to Market</Link>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyDownloads;
