
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
  const [products, setProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState('');

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
      {/* Banner Section - Optimized spacing */}
      <section className="relative w-full flex justify-center px-4 py-6 md:py-10">
        <div className="max-w-[1200px] w-full aspect-[12/5] relative rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-xl bg-slate-50">
          <img 
            src={banner} 
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <div className="space-y-1">
        <TextSlider />
        <FakePurchaseSlider />
      </div>

      <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
           <h2 className="text-[10px] md:text-sm font-black text-indigo-600 uppercase tracking-widest mb-2">Marketplace</h2>
           <p className="text-2xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-tight max-w-2xl">
             Launch Your Business Today
           </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto items-stretch justify-center">
          {products.map(product => (
            <div key={product.id} className="flex justify-center">
              <ProductCard product={product} onAdd={addToCart} onBuyNow={handleBuyNow} />
            </div>
          ))}
        </div>
      </section>

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto rounded-[2rem] md:rounded-[4rem] p-10 md:p-20 bg-slate-50 text-center border border-slate-100 flex flex-col items-center gap-6">
          <h3 className="text-3xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">
            Start Your <span className="text-indigo-600">Journey</span>
          </h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-xs">Join our successful students today.</p>
          <Link 
            to="/contact" 
            className="px-8 py-4 md:px-12 md:py-6 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-sm tracking-widest shadow-lg active:scale-95 transition-transform"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
