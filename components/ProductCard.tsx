
import React from 'react';
import { Product } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Zap, Rocket } from 'lucide-react';

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onBuyNow }) => {
  const navigate = useNavigate();
  const originalPrice = Math.round(product.price * 2.5);
  const discount = 60;

  return (
    <div className="group bg-white rounded-[1rem] md:rounded-[1.5rem] border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-500 flex flex-col h-full relative shadow-sm mx-auto w-full max-w-[175px]">
      
      {/* Top Badges */}
      <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1">
        <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-md font-black text-[6px] md:text-[8px] uppercase tracking-wider shadow-md">
          -{discount}%
        </div>
      </div>

      {/* Poster Section - Set to 2:3 aspect ratio */}
      <div className="p-1 md:p-1.5">
        <Link 
          to={`/product/${product.id}`} 
          className="block relative aspect-[2/3] overflow-hidden rounded-[0.8rem] md:rounded-[1.2rem] bg-slate-100 flex flex-col items-center justify-center shadow-inner"
        >
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-indigo-950 flex flex-col items-center justify-center p-4">
                <Rocket className="w-6 h-6 text-amber-400 mb-1" />
                <h2 className="text-[10px] font-black text-white uppercase italic">Plan {product.id === 'plan-a' ? 'A' : 'B'}</h2>
             </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
        </Link>
      </div>

      {/* Info & Price - Compact spacing */}
      <div className="p-2 md:p-3 pt-0 md:pt-0 flex flex-col flex-grow items-center text-center">
        <div className="mb-1 flex flex-col items-center">
          <div className="flex items-center gap-0.5 mb-0.5">
             {[1, 2, 3, 4, 5].map((s) => (
               <Star key={s} className="w-1.5 md:w-2 text-amber-400 fill-current" />
             ))}
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-[8px] md:text-xs font-black text-gray-900 leading-tight uppercase tracking-tight hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto w-full space-y-1">
          <div className="flex flex-row items-center justify-center gap-1">
            <span className="text-xs md:text-lg font-[1000] text-gray-900 tracking-tighter">₹{product.price.toFixed(0)}</span>
            <span className="text-[6px] md:text-[8px] text-gray-300 line-through font-bold">₹{originalPrice}</span>
          </div>

          <button 
            onClick={() => onBuyNow(product)}
            className="w-full bg-indigo-600 hover:bg-slate-900 text-white py-1 md:py-2 rounded-md md:rounded-lg text-[6px] md:text-[8px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 group/btn"
          >
            <Zap className="w-2 md:w-2.5 text-amber-400 fill-current" />
            <span>Enroll</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
