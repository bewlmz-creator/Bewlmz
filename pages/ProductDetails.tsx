
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../constants';
import { Product } from '../types';
import { ArrowLeft, TrendingUp, Package, CheckCircle2, Zap, Rocket, Star } from 'lucide-react';

interface Props { addToCart: (product: Product) => void; }

const ProductDetails: React.FC<Props> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | undefined>(() => {
    const saved = localStorage.getItem('vault_products');
    if (saved) {
      const parsed = JSON.parse(saved) as Product[];
      return parsed.find(p => p.id === id);
    }
    return FEATURED_PRODUCTS.find(p => p.id === id);
  });

  useEffect(() => {
    const updateProduct = () => {
      const savedProducts = localStorage.getItem('vault_products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts) as Product[];
        setProduct(parsed.find(p => p.id === id));
      }
    };
    window.addEventListener('storage', updateProduct);
    return () => window.removeEventListener('storage', updateProduct);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-400 uppercase tracking-widest">Guide Not Found</h2>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest">Back to Home</Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  const originalPrice = Math.round(product.price * 2.5);

  const renderFeatureText = (text: string) => {
    const parts = text.split(':');
    if (parts.length < 2) return <span className="text-lg md:text-2xl font-bold text-slate-700">{text}</span>;
    return (
      <span className="text-lg md:text-3xl font-black text-slate-800 uppercase tracking-tight">
        {parts[0]} : <span className="text-indigo-600">{parts[1]}</span>
      </span>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 lg:pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 mb-6 md:mb-12 font-black transition-all text-[10px] md:text-xs uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="relative">
            <div className="lg:sticky lg:top-32">
              <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden relative aspect-[2/3] shadow-2xl transition-all duration-700 bg-slate-100 border-4 border-slate-50 flex flex-col items-center justify-center p-0 text-center">
                
                {product.image ? (
                  <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Rocket className="w-16 h-16 md:w-32 md:h-32 text-amber-400 mb-4 animate-bounce-slow" />
                    <h2 className="text-4xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase leading-none mb-4">
                      Plan <br/><span className="text-amber-400">{product.id === 'plan-a' ? 'A' : 'B'}</span>
                    </h2>
                  </div>
                )}

                <div className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                   <p className="text-white font-black text-xs md:text-lg uppercase tracking-tighter drop-shadow-md">"Idea जिंदगी बदल देगी..!!"</p>
                </div>
              </div>
              
              <div className="mt-8 md:mt-12 grid grid-cols-2 gap-4 md:gap-6">
                <div className="bg-slate-50 p-6 md:p-10 rounded-[2rem] flex items-center space-x-4 shadow-sm border border-slate-100">
                  <TrendingUp className="w-8 h-8 md:w-12 md:h-12 text-green-500 shrink-0" />
                  <div>
                    <p className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Potential</p>
                    <p className="text-xs md:text-xl font-[900] text-slate-900 tracking-tighter">High Growth</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 md:p-10 rounded-[2rem] flex items-center space-x-4 shadow-sm border border-slate-100">
                  <Package className="w-8 h-8 md:w-12 md:h-12 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Delivery</p>
                    <p className="text-xs md:text-xl font-[900] text-slate-900 tracking-tighter">Instant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col pt-4 md:pt-10 space-y-10 md:space-y-16 items-center">
            <div className="space-y-4 md:space-y-8 text-center">
              <div className="flex items-center justify-center gap-0.5 mb-2">
                 {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 md:w-6 md:h-6 text-amber-400 fill-current" />)}
              </div>
              <h1 className="text-4xl md:text-8xl font-[1000] text-slate-900 leading-[0.85] tracking-tighter uppercase">
                {product.name.split(' ')[0]} <br/>
                <span className="text-indigo-600">{product.name.split(' ')[1]}</span>
              </h1>
              <p className="text-base md:text-3xl font-bold text-slate-400 italic tracking-tight leading-tight max-w-xl">
                "{product.description}"
              </p>
            </div>

            <div className="bg-slate-50 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] w-full space-y-8 md:space-y-12 shadow-inner border border-slate-100 text-center flex flex-col items-center">
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <span className="text-[10px] md:text-lg font-black text-slate-400 uppercase tracking-[0.2em]">Full Training Enrollment</span>
                <div className="flex flex-col items-center gap-1 md:gap-4">
                  <span className="text-5xl md:text-9xl font-[1000] text-indigo-600 tracking-tighter leading-none">₹{product.price.toFixed(0)}</span>
                  <span className="text-xl md:text-3xl text-slate-300 line-through font-bold">₹{originalPrice}</span>
                </div>
              </div>

              <div className="w-full space-y-4 md:space-y-8">
                {product.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-center space-x-4 md:space-x-8 py-4 md:py-6 border-b border-slate-200 last:border-0">
                     <div className="bg-indigo-600 rounded-full p-1.5 shadow-md shrink-0">
                        <CheckCircle2 className="w-4 h-4 md:w-8 md:h-8 text-white" />
                     </div>
                     <div className="text-left">
                        {renderFeatureText(feature)}
                     </div>
                  </div>
                ))}
              </div>

              <div className="w-full pt-4">
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-blue-600 hover:bg-slate-900 text-white py-5 md:py-8 rounded-[1.5rem] md:rounded-[2.5rem] text-lg md:text-4xl font-[1000] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center space-x-3 md:space-x-8 group"
                >
                  <Zap className="w-6 h-6 md:w-10 md:h-10 text-amber-400 fill-current" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            <div className="space-y-6 md:space-y-10 px-4 text-center">
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
                Start Today & Earn <br className="md:hidden" /> Upto 3 lakh/Month
              </h3>
              <p className="text-sm md:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl italic">
                {product.longDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
