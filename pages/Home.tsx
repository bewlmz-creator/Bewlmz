
import React, { useState, useEffect } from 'react';
import TextSlider from '../components/TextSlider';
import FakePurchaseSlider from '../components/FakePurchaseSlider';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import VaultDB from '../db';
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

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden w-full bg-white min-h-screen flex flex-col">
      {/* Banner Section */}
      <section className="relative w-full flex justify-center px-4 pt-4 md:pt-6">
        <div className="max-w-[1200px] w-full aspect-[12/5] relative rounded-[1.2rem] md:rounded-[2.5rem] overflow-hidden shadow-lg bg-slate-50 border border-slate-100">
          <img 
            src={banner} 
            alt="Hero Banner"
            className="w-full h-full object-cover block"
            style={{ minHeight: '100%' }}
          />
        </div>
      </section>

      {/* Sliders Container - Tight spacing */}
      <div className="mt-2">
        <TextSlider />
        <FakePurchaseSlider />
      </div>

      <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
           <h2 className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Marketplace</h2>
           <p className="text-xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-tight max-w-xl">
             Launch Your Business Today
           </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 md:gap-8 max-w-4xl mx-auto items-stretch justify-center">
          {products.map(product => (
            <div key={product.id} className="flex justify-center">
              <ProductCard product={product} onAdd={addToCart} onBuyNow={handleBuyNow} />
            </div>
          ))}
        </div>
      </section>

      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 bg-slate-50 text-center border border-slate-100 flex flex-col items-center gap-4">
          <h3 className="text-2xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Start Your <span className="text-indigo-600">Journey</span>
          </h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Join our successful students today.</p>
          <Link 
            to="/contact" 
            className="px-6 py-3 md:px-10 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-xs tracking-widest shadow-lg active:scale-95 transition-transform"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
