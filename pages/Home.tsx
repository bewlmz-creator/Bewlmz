
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
      {/* Banner Section - Optimized for 1200x500 aspect ratio */}
      <section className="relative w-full flex justify-center px-4 pt-4 md:pt-8">
        <div className="max-w-7xl w-full aspect-[12/5] relative rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-slate-100 flex items-center justify-center">
          <img 
            src={banner} 
            alt="Hero Banner"
            className="w-full h-full object-cover block transition-transform duration-1000 hover:scale-[1.02]"
            loading="eager"
            onError={handleBannerError}
          />
        </div>
      </section>

      {/* Sliders Container */}
      <div className="mt-6 flex flex-col gap-1">
        <TextSlider />
        <FakePurchaseSlider />
        
        {/* ENLARGED Information Text Box */}
        <div className="px-4 py-3">
          <Link to="/about" className="block max-w-7xl mx-auto group">
            <div className="bg-white border-2 border-indigo-100 rounded-2xl md:rounded-[2.5rem] p-6 md:p-12 text-center flex flex-col items-center justify-center gap-3 transition-all hover:bg-slate-50 hover:border-indigo-400 shadow-lg shadow-indigo-50">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 md:w-8 md:h-8 text-indigo-600" />
                <p className="text-sm md:text-3xl font-[1000] text-slate-900 uppercase tracking-tight leading-tight group-hover:text-indigo-700 transition-colors">
                  Click Here To <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">More Information</span> About Business
                </p>
                <ArrowRight className="w-5 h-5 md:w-8 md:h-8 text-indigo-600 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-8 md:mb-14">
           <p className="text-2xl md:text-5xl font-[1000] text-gray-900 tracking-tighter uppercase leading-tight max-w-3xl">
             Start Your First <span className="text-indigo-600">Online Business</span> <br className="hidden md:block" /> & Earn Upto <span className="text-indigo-600">3 lakh/ Month</span>
           </p>
        </div>
        
        {/* Grid with 2 products as specified */}
        <div className="grid grid-cols-2 gap-3 md:gap-8 max-w-4xl mx-auto items-stretch justify-center">
          {products.map(product => (
            <div key={product.id} className="flex justify-center">
              <ProductCard product={product} onAdd={addToCart} onBuyNow={handleBuyNow} />
            </div>
          ))}
        </div>
      </section>

      <div className="py-10 px-4 mb-10">
        <div className="max-w-4xl mx-auto rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-20 bg-slate-900 text-center border border-white/5 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <h3 className="text-2xl md:text-5xl font-[1000] text-white uppercase tracking-tighter italic relative z-10">
            Join Our <span className="text-indigo-400">Success</span> Community
          </h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-xs relative z-10">Need help? Our team is available 24/7 via WhatsApp.</p>
          <Link 
            to="/contact" 
            className="px-8 py-4 md:px-12 md:py-6 bg-indigo-600 text-white rounded-2xl md:rounded-[2rem] font-black uppercase text-xs md:text-lg tracking-[0.2em] shadow-xl hover:bg-indigo-500 active:scale-95 transition-all relative z-10"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
