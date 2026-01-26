
import React, { useState, useEffect } from 'react';
import TextSlider from '../components/TextSlider';
import FakePurchaseSlider from '../components/FakePurchaseSlider';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { FEATURED_PRODUCTS, HERO_BANNER } from '../constants';
import { BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  addToCart: (product: Product) => void;
}

const Home: React.FC<Props> = ({ addToCart }) => {
  const navigate = useNavigate();
  
  // Use state with initial values from localStorage to prevent "simple" images showing first
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vault_products');
    return saved ? JSON.parse(saved) : FEATURED_PRODUCTS;
  });

  const [banner, setBanner] = useState(() => {
    return localStorage.getItem('vault_banner') || HERO_BANNER;
  });

  useEffect(() => {
    const loadSiteData = () => {
      const savedProducts = localStorage.getItem('vault_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedBanner = localStorage.getItem('vault_banner');
      if (savedBanner) setBanner(savedBanner);
    };

    // Listen for storage changes from other tabs/admin panel
    window.addEventListener('storage', loadSiteData);
    // Initial check
    loadSiteData();
    
    return () => window.removeEventListener('storage', loadSiteData);
  }, []);

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden w-full bg-gray-50/50 min-h-screen flex flex-col">
      {/* 1. HERO BANNER - EXACT 1200x500 (12/5 Aspect Ratio) */}
      <section className="relative w-full flex justify-center px-1 sm:px-4 py-2 md:py-8">
        <div className="max-w-[1200px] w-full aspect-[12/5] relative rounded-[1rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-200 group bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img 
              src={banner} 
              alt="Hero Banner"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent z-10"></div>
          </div>
        </div>
      </section>

      {/* 2. SLIDERS */}
      <div className="space-y-0.5">
        <TextSlider />
        <FakePurchaseSlider />
      </div>

      {/* 3. PRODUCT GRID */}
      <section className="py-2 md:py-20 px-1 md:px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-6 md:mb-20 border-b border-gray-100 pb-4 md:pb-10">
           <h2 className="text-[8px] md:text-base font-black text-indigo-600 uppercase tracking-[0.4em] mb-2 md:mb-4">bewlmz Marketplace</h2>
           <p className="text-sm md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-tight max-w-4xl">
             Start Your First Online Business & <br className="hidden md:block" /> Earn Upto 3 lakh/Month
           </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 md:gap-10">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} onBuyNow={handleBuyNow} />
          ))}
        </div>
      </section>

      {/* 4. TRUST FOOTER */}
      <div className="py-4 md:py-24 px-4">
        <div className="max-w-5xl mx-auto rounded-[1rem] md:rounded-[4rem] p-6 md:p-24 bg-white text-slate-900 shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col items-center text-center gap-6 md:gap-14">
          <div className="space-y-3 md:space-y-6 relative z-10">
            <h3 className="text-2xl md:text-7xl font-[1000] leading-tight uppercase tracking-tighter text-slate-900">
              सफलता की ओर <br /> <span className="text-indigo-600">कदम बढ़ाएं</span>
            </h3>
            <p className="text-[10px] md:text-xl text-slate-400 font-bold uppercase tracking-widest italic">आपका भविष्य आपके हाथ में है।</p>
          </div>
          <Link 
            to="/contact" 
            className="w-full sm:w-auto px-8 py-4 md:px-20 md:py-10 bg-[#001E3C] text-white rounded-xl md:rounded-[2.5rem] font-black text-[10px] md:text-3xl uppercase tracking-widest flex items-center justify-center gap-2 md:gap-6 hover:bg-indigo-600 transition-all active:scale-95 relative z-10 shadow-2xl"
          >
            <BarChart3 className="w-4 h-4 md:w-10 md:h-10 text-blue-400" />
            Contact Support
          </Link>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
