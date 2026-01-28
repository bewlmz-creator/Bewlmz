
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
        <div className="max-w-[1200px] w-full aspect-[12/5] relative rounded-[1rem] md:rounded-[2rem] overflow-hidden shadow-lg bg-white border border-slate-100 flex items-center justify-center">
          <img 
            src={banner} 
            alt="Hero Banner"
            className="w-full h-full object-cover block"
            loading="eager"
            onError={(e) => {
              console.error("Banner load error");
              setBanner(VaultDB.getBanner());
            }}
          />
        </div>
      </section>

      {/* Sliders Container */}
      <div className="mt-4">
        <TextSlider />
        <FakePurchaseSlider />
      </div>

      <section className="py-6 md:py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-6 md:mb-10">
           <h2 className="text-[8px] md:text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Enrollment Marketplace</h2>
           <p className="text-lg md:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-tight max-w-xl">
             Start Your Journey
           </p>
        </div>
        
        {/* Compact Grid with tight gaps for small boxes */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 max-w-3xl mx-auto items-stretch justify-center">
          {products.map(product => (
            <div key={product.id} className="flex justify-center">
              <ProductCard product={product} onAdd={addToCart} onBuyNow={handleBuyNow} />
            </div>
          ))}
        </div>
      </section>

      <div className="py-6 px-4">
        <div className="max-w-4xl mx-auto rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 bg-slate-50 text-center border border-slate-100 flex flex-col items-center gap-4">
          <h3 className="text-xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Join Our <span className="text-indigo-600">Success</span> Community
          </h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[7px] md:text-[9px]">Need help? Reach out to our team.</p>
          <Link 
            to="/contact" 
            className="px-5 py-2.5 md:px-8 md:py-4 bg-indigo-600 text-white rounded-lg md:rounded-xl font-black uppercase text-[8px] md:text-xs tracking-widest shadow-md active:scale-95 transition-transform"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
