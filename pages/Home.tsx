
import React, { useState, useEffect } from 'react';
import TextSlider from '../components/TextSlider';
import FakePurchaseSlider from '../components/FakePurchaseSlider';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import VaultDB from '../db';
import { HERO_BANNER } from '../constants';
import { Link, useNavigate } from 'react-router-dom';

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
    // If the banner from DB fails, reset to hardcoded constant
    setBanner(HERO_BANNER);
    // Also clean up local storage to prevent loops
    localStorage.removeItem('bewlmz_db_banner');
  };

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden w-full bg-white min-h-screen flex flex-col">
      {/* Banner Section - Optimized for smaller vertical profile */}
      <section className="relative w-full flex justify-center px-4 pt-4 md:pt-8">
        <div className="max-w-7xl w-full aspect-[12/8] md:aspect-[12/4] relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-slate-100 flex items-center justify-center">
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
      <div className="mt-6">
        <TextSlider />
        <FakePurchaseSlider />
      </div>

      <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-8 md:mb-14">
           <p className="text-2xl md:text-5xl font-[1000] text-gray-900 tracking-tighter uppercase italic leading-tight max-w-3xl">
             Start Your First <span className="text-indigo-600">Online Business</span> <br className="hidden md:block" /> & Earn Upto <span className="text-indigo-600">3 lakh/ Month</span>
           </p>
        </div>
        
        {/* Compact Grid with tight gaps for small boxes */}
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
