
import React, { useState } from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Star, Heart, Zap, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onBuyNow }) => {
  const [imageError, setImageError] = useState(false);
  const originalPrice = Math.round(product.price * 2.5);
  const discount = 60;
  
  return (
    <div className="group bg-white rounded-[1rem] md:rounded-[1.5rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full relative shadow-sm mx-auto w-full max-w-[260px]">
      
      {/* Top Badges - Compact */}
      <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 z-10 flex flex-col gap-1">
        <div className="bg-red-500 text-white px-1 py-0.5 md:px-2 md:py-0.5 rounded-md font-black text-[6px] md:text-[10px] uppercase tracking-wider shadow-lg">
          -{discount}%
        </div>
        {product.id === 'plan-b' && (
          <div className="bg-indigo-600 text-white px-1 py-0.5 md:px-2 md:py-0.5 rounded-md font-black text-[6px] md:text-[10px] uppercase tracking-wider shadow-lg">
            TOP
          </div>
        )}
      </div>

      <button className="absolute top-1.5 right-1.5 md:top-3 md:right-3 z-10 p-1 md:p-1.5 bg-white/90 backdrop-blur-md rounded-full text-gray-300 hover:text-red-500 transition-colors shadow-md active:scale-90">
        <Heart className="w-3 h-3 md:w-4 md:h-4" />
      </button>

      {/* Product Image - Aspect 2:3 (Smaller container) */}
      <div className="p-1 md:p-2">
        <Link to={`/product/${product.id}`} className="block relative aspect-[2/3] overflow-hidden bg-slate-50 rounded-[0.5rem] md:rounded-[1rem] flex items-center justify-center">
          {product.image && !imageError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
             <div className="flex flex-col items-center gap-1 text-slate-300">
               <ImageIcon className="w-6 h-6 md:w-10 md:h-10" />
               <span className="text-[5px] md:text-[7px] font-black uppercase tracking-widest text-slate-400 px-2 text-center">Image Error</span>
             </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
        </Link>
      </div>

      {/* Product Info - Compact Padding and Text */}
      <div className="p-2 md:p-3 pt-0 md:pt-0 flex flex-col flex-grow items-center text-center">
        <div className="mb-1 md:mb-2 flex flex-col items-center">
          <div className="flex items-center gap-0.5 mb-0.5 md:mb-1">
             {[1, 2, 3, 4, 5].map((s) => (
               <Star key={s} className="w-1.5 md:w-2.5 text-amber-400 fill-current" />
             ))}
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-[9px] md:text-base font-black text-gray-900 leading-tight uppercase tracking-tight hover:text-indigo-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto w-full space-y-1 md:space-y-2">
          <div className="flex flex-row items-center justify-center gap-1 md:gap-1.5 mb-0.5">
            <span className="text-xs md:text-xl font-[1000] text-gray-900 tracking-tighter">₹{product.price.toFixed(0)}</span>
            <span className="text-[7px] md:text-xs text-gray-300 line-through font-bold">₹{originalPrice}</span>
          </div>

          <div className="w-full">
            <button 
              onClick={() => onBuyNow(product)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 md:py-3 rounded-md md:rounded-xl text-[7px] md:text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-1 md:gap-2"
            >
              <Zap className="w-2 md:w-4 md:h-4 text-amber-400 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
