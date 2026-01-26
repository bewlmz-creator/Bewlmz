
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
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vault_products');
    return saved ? JSON.parse(saved).slice(0, 2) : FEATURED_PRODUCTS;
  });

  const [banner, setBanner] = useState(() => {
    return localStorage.getItem('vault_banner') || HERO_BANNER;
  });

  useEffect(() => {
    const loadSiteData = () => {
      const savedProducts = localStorage.getItem('vault_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts).slice(0, 2));

      const savedBanner = localStorage.getItem('vault_banner');
      if (savedBanner) setBanner(savedBanner);
    };

    window.addEventListener('storage', loadSiteData);
    loadSiteData();
    return () => window.removeEventListener('storage', loadSiteData);
  }, []);

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden w-full bg-gray-50/50 min-h-screen flex flex-col">
      {/* 1. HERO BANNER - MAINTAINING PC PROPORTIONS ON MOBILE */}
      <section className="relative w-full flex justify-center px-4 py-6 md:py-12">
        <div className="max-w-[1200px] w-full aspect-[12/5] relative rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-slate-200 bg-slate-100">
          <img 
            src={banner} 
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 2. SLIDERS */}
      <div className="space-y-1">
        <TextSlider />
        <FakePurchaseSlider />
      </div>

      {/* 3. PRODUCT GRID - SINGLE COLUMN LARGE IMPACT ON MOBILE */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-16 border-b border-gray-100 pb-16">
           <h2 className="text-xs md:text-base font-black text-indigo-600 uppercase tracking-widest mb-4">bewlmz Marketplace</h2>
           <p className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-tight max-w-4xl">
             Launch Your Business Today
           </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 max-w-5xl mx-auto">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} onBuyNow={handleBuyNow} />
          ))}
        </div>
      </section>

      {/* 4. FOOTER CALL TO ACTION */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto rounded-[3rem] md:rounded-[5rem] p-12 md:p-24 bg-white text-center shadow-xl border border-slate-50 flex flex-col items-center gap-8">
          <h3 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter">
            Start Your <span className="text-indigo-600">Journey</span>
          </h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs md:text-sm">Join 10,000+ students already earning online.</p>
          <Link 
            to="/contact" 
            className="px-12 py-6 md:px-20 md:py-8 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs md:text-lg tracking-widest shadow-2xl shadow-indigo-200 active:scale-95 transition-transform"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
