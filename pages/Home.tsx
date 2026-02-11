
import React, { useState, useEffect } from 'react';
import TextSlider from '../components/TextSlider';
import FakePurchaseSlider from '../components/FakePurchaseSlider';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import VaultDB from '../db';
import { HERO_BANNER } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { Info, Zap, ArrowRight } from 'lucide-react';

interface Props {
  addToCart: (product: Product) => void;
}

const Home: React.FC<Props> = ({ addToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(() => VaultDB.getProducts().slice(0, 2));
  const [banner, setBanner] = useState(() => VaultDB.getBanner());

  useEffect(() => {
    const loadFromDB = () => {
      setProducts(VaultDB.getProducts().slice(0, 2));
      setBanner(VaultDB.getBanner());
    };

    loadFromDB();
    window.addEventListener('storage', loadFromDB);
    return () => window.removeEventListener('storage', loadFromDB);
  }, []);

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    navigate('/checkout');
  };

  const handleBannerError = () => {
    console.error("Banner load error - resetting to default");
    setBanner(HERO_BANNER);
    localStorage.removeItem('bewlmz_db_banner');
  };

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden w-full bg-white min-h-screen flex flex-col">
      {/* Banner Section - Updated aspect ratio to 16:9 */}
      <section className="relative w-full shadow-sm">
        <div className="w-full aspect-[16/9] relative overflow-hidden flex items-center justify-center bg-slate-50">
          <img 
            src={banner} 
            alt="Hero Banner"
            className="w-full h-full object-cover block transition-transform duration-1000 hover:scale-[1.04]"
            loading="eager"
            onError={handleBannerError}
          />
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Sliders Container - Tightened top margin */}
      <div className="mt-2 flex flex-col gap-1">
        <TextSlider />
        <FakePurchaseSlider />
        
        {/* LARGER Information Text Box */}
        <div className="px-4 py-2">
          <Link to="/about" className="block max-w-7xl mx-auto group">
            <div className="bg-white border border-indigo-100 rounded-[1.5rem] md:rounded-[3.5rem] p-6 md:p-14 text-center flex flex-col items-center justify-center gap-2.5 md:gap-4 transition-all hover:bg-slate-50 hover:border-indigo-400 shadow-md md:shadow-xl shadow-indigo-100/50">
              <div className="flex items-center gap-3 md:gap-5">
                <div className="bg-indigo-50 p-2 md:p-4 rounded-xl md:rounded-2xl">
                  <Info className="w-5 h-5 md:w-10 md:h-10 text-indigo-600" />
                </div>
                <p className="text-xs md:text-4xl font-[1000] text-slate-900 uppercase tracking-tight leading-tight group-hover:text-indigo-700 transition-colors">
                  Click Here To <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-[6px] md:underline-offset-[12px]">More Information</span> About Business
                </p>
                <ArrowRight className="w-5 h-5 md:w-10 md:h-10 text-indigo-600 group-hover:translate-x-3 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      <section className="py-6 md:py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-6 md:mb-14">
           <p className="text-lg md:text-5xl font-[1000] text-gray-900 tracking-tighter uppercase leading-tight max-w-3xl">
             Start Your First <span className="text-indigo-600">Online Business</span> <br className="hidden md:block" /> & Earn Upto <span className="text-indigo-600">3 lakh/ Month</span>
           </p>
        </div>
        
        {/* Grid with 2 products */}
        <div className="grid grid-cols-2 gap-3 md:gap-8 max-w-4xl mx-auto items-stretch justify-center">
          {products.map(product => (
            <div key={product.id} className="flex justify-center">
              <ProductCard product={product} onAdd={addToCart} onBuyNow={handleBuyNow} />
            </div>
          ))}
        </div>
      </section>

      {/* UPDATED: Contact Support Box (White Background with requested text, removed italic for 'sidha' look) */}
      <div className="py-8 px-4 mb-10">
        <div className="max-w-4xl mx-auto rounded-3xl md:rounded-[4rem] p-8 md:p-20 bg-white text-center border border-indigo-100 flex flex-col items-center gap-6 shadow-2xl shadow-indigo-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>
          <h3 className="text-xl md:text-5xl font-[1000] text-slate-900 uppercase tracking-tighter relative z-10 leading-tight">
            Koi bhi sawal ho to <br className="hidden md:block" /> <span className="text-indigo-600">puchha sakte hai</span>
          </h3>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-xs relative z-10">Humari team aapki madad ke liye 24/7 taiyar hai.</p>
          <Link 
            to="/contact" 
            className="px-6 py-3.5 md:px-12 md:py-6 bg-indigo-600 text-white rounded-xl md:rounded-[2rem] font-black uppercase text-[10px] md:text-lg tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-slate-900 active:scale-95 transition-all relative z-10"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
