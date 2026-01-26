
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../constants';
import { Product } from '../types';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Zap, Download, TrendingUp, Package, CheckCircle2 } from 'lucide-react';

interface Props { addToCart: (product: Product) => void; }

const ProductDetails: React.FC<Props> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    // Try to load from local storage first (admin changes)
    const savedProducts = localStorage.getItem('vault_products');
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts) as Product[];
      setProduct(parsed.find(p => p.id === id));
    } else {
      setProduct(FEATURED_PRODUCTS.find(p => p.id === id));
    }
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
    if (parts.length < 2) return <span>{text}</span>;
    return (
      <span className="text-lg md:text-5xl font-black text-slate-800 uppercase tracking-tight">
        {parts[0]} : <span className="text-indigo-600">{parts[1]}</span>
      </span>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 lg:pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 mb-8 md:mb-16 font-black transition-all text-[11px] md:text-sm uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
          {/* Left Column: Image */}
          <div className="relative">
            <div className="lg:sticky lg:top-32">
              <div className="rounded-[4.5rem] md:rounded-[6.5rem] overflow-hidden relative aspect-[2/3] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.35)] hover:shadow-indigo-500/20 transition-all duration-700 bg-slate-50 border border-slate-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-10 left-10 md:top-20 md:left-20 bg-indigo-600 text-white px-8 py-2.5 md:px-16 md:py-7 rounded-full font-black text-[12px] md:text-3xl uppercase tracking-widest shadow-2xl z-20 border-2 border-white/20">
                  {product.id === 'plan-b' ? 'Elite Bundle' : 'Premium'}
                </div>
              </div>
              
              <div className="mt-12 md:mt-24 grid grid-cols-2 gap-6 md:gap-12">
                <div className="bg-slate-50 p-7 md:p-14 rounded-[3rem] md:rounded-[4.5rem] flex items-center space-x-4 md:space-x-10 shadow-sm border border-slate-100">
                  <TrendingUp className="w-10 h-10 md:w-20 md:h-20 text-green-500 shrink-0" />
                  <div>
                    <p className="text-[10px] md:text-xl font-black text-slate-400 uppercase tracking-widest mb-1">Potential</p>
                    <p className="text-sm md:text-3xl font-[900] text-slate-900 tracking-tighter">High Return</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-7 md:p-14 rounded-[3rem] md:rounded-[4.5rem] flex items-center space-x-4 md:space-x-10 shadow-sm border border-slate-100">
                  <Package className="w-10 h-10 md:w-20 md:h-20 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-[10px] md:text-xl font-black text-slate-400 uppercase tracking-widest mb-1">Offer</p>
                    <p className="text-sm md:text-3xl font-[900] text-slate-900 tracking-tighter">Lifetime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title & Price - Fully Centered */}
          <div className="flex flex-col pt-6 md:pt-14 space-y-12 md:space-y-24 items-center">
            <div className="space-y-6 md:space-y-12 text-center">
              <h1 className="text-5xl md:text-[130px] font-[1000] text-slate-900 leading-[0.8] tracking-tighter uppercase">
                {product.name.split(' ')[0]} <br/>
                <span className="text-indigo-600">{product.name.split(' ')[1]}</span>
              </h1>
              <p className="text-xl md:text-6xl font-bold text-slate-400 italic tracking-tight leading-tight max-w-2xl">
                "{product.description}"
              </p>
            </div>

            <div className="bg-slate-50 p-10 md:p-24 rounded-[3.5rem] md:rounded-[7rem] w-full space-y-10 md:space-y-20 shadow-inner border border-slate-100 text-center flex flex-col items-center">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <span className="text-[12px] md:text-2xl font-black text-slate-400 uppercase tracking-[0.2em]">Enrollment Fee</span>
                <div className="flex flex-col items-center gap-2 md:gap-14">
                  <span className="text-6xl md:text-[150px] font-[1000] text-indigo-600 tracking-tighter leading-none">₹{product.price.toFixed(0)}</span>
                  <span className="text-3xl md:text-6xl text-slate-300 line-through font-bold">₹{originalPrice}</span>
                </div>
              </div>

              {/* Features Section - Styled to match image labels */}
              <div className="w-full space-y-5 md:space-y-12">
                {product.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-center space-x-6 md:space-x-12 py-6 md:py-12 border-b border-slate-200 last:border-0">
                     <div className="bg-indigo-600 rounded-full p-2 shadow-lg shadow-indigo-200 shrink-0">
                        <CheckCircle2 className="w-6 h-6 md:w-16 md:h-16 text-white" />
                     </div>
                     <div className="text-left">
                        {renderFeatureText(feature)}
                     </div>
                  </div>
                ))}
              </div>

              <div className="w-full flex flex-col gap-8 md:gap-14 pt-6">
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-indigo-600 hover:bg-slate-900 text-white py-7 md:py-16 rounded-[2.5rem] md:rounded-[5rem] text-xl md:text-[64px] font-[1000] transition-all shadow-[0_40px_80px_-20px_rgba(79,70,229,0.4)] active:scale-[0.98] flex items-center justify-center space-x-4 md:space-x-12 group"
                >
                  <ShoppingCart className="w-10 h-10 md:w-20 md:h-20 group-hover:animate-bounce" />
                  <span>ENROLL NOW</span>
                </button>
              </div>
            </div>

            <div className="space-y-10 md:space-y-16 px-4 md:px-0 text-center">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                Start Your First Online Business & <br /> Earn Upto 3 lakh/Month
              </h3>
              <p className="text-xl md:text-4xl text-slate-600 leading-[1.3] font-medium max-w-3xl italic">
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
