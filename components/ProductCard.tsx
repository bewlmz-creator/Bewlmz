
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
    <div className="group bg-white rounded-[1rem] md:rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full relative shadow-sm mx-auto w-full max-w-[320px]">
      
      {/* Top Badges - Compact */}
      <div className="absolute top-1.5 left-1.5 md:top-4 md:left-4 z-10 flex flex-col gap-1">
        <div className="bg-red-500 text-white px-1.5 py-0.5 md:px-3 md:py-1 rounded-md font-black text-[7px] md:text-xs uppercase tracking-wider shadow-lg">
          -{discount}%
        </div>
        {product.id === 'plan-b' && (
          <div className="bg-indigo-600 text-white px-1.5 py-0.5 md:px-3 md:py-1 rounded-md font-black text-[7px] md:text-xs uppercase tracking-wider shadow-lg">
            TOP
          </div>
        )}
      </div>

      <button className="absolute top-1.5 right-1.5 md:top-4 md:right-4 z-10 p-1 md:p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-300 hover:text-red-500 transition-colors shadow-md active:scale-90">
        <Heart className="w-3 h-3 md:w-5 md:h-5" />
      </button>

      {/* Product Image - Aspect 2:3 (800x1200) */}
      <div className="p-1.5 md:p-3">
        <Link to={`/product/${product.id}`} className="block relative aspect-[2/3] overflow-hidden bg-slate-50 rounded-[0.75rem] md:rounded-[1.5rem] flex items-center justify-center">
          {product.image && !imageError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
             <div className="flex flex-col items-center gap-2 text-slate-300">
               <ImageIcon className="w-8 h-8 md:w-12 md:h-12" />
               <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 px-4 text-center">Image missing or invalid URL</span>
             </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
        </Link>
      </div>

      {/* Product Info - Compact Padding and Text */}
      <div className="p-2 md:p-5 pt-0 md:pt-0 flex flex-col flex-grow items-center text-center">
        <div className="mb-1.5 md:mb-3 flex flex-col items-center">
          <div className="flex items-center gap-0.5 mb-1 md:mb-1.5">
             {[1, 2, 3, 4, 5].map((s) => (
               <Star key={s} className="w-2 md:w-3 text-amber-400 fill-current" />
             ))}
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-[10px] md:text-xl font-black text-gray-900 leading-tight uppercase tracking-tight hover:text-indigo-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto w-full space-y-1.5 md:space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-2 mb-0.5 md:mb-1">
            <span className="text-sm md:text-3xl font-[1000] text-gray-900 tracking-tighter">₹{product.price.toFixed(0)}</span>
            <span className="text-[8px] md:text-base text-gray-300 line-through font-bold">₹{originalPrice}</span>
          </div>

          <div className="w-full">
            <button 
              onClick={() => onBuyNow(product)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 md:py-4 rounded-lg md:rounded-2xl text-[8px] md:text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-2.5 h-2.5 md:w-5 md:h-5 text-amber-400 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
