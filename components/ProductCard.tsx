
import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Star, Heart, Zap } from 'lucide-react';

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onBuyNow }) => {
  const originalPrice = Math.round(product.price * 2.5);
  const discount = 60;
  
  return (
    <div className="group bg-white rounded-md md:rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative">
      
      {/* Top Badges & Actions - Ultra tiny on mobile */}
      <div className="absolute top-1 left-1 md:top-3 md:left-3 z-10 flex flex-col gap-0.5 md:gap-2">
        <div className="bg-red-500 text-white px-0.5 py-0 md:px-3 md:py-1 rounded-[2px] font-black text-[5px] md:text-xs uppercase tracking-tight md:tracking-wider shadow-lg">
          -{discount}%
        </div>
        {product.id === 'plan-b' && (
          <div className="bg-indigo-600 text-white px-0.5 py-0 md:px-3 md:py-1 rounded-[2px] font-black text-[5px] md:text-xs uppercase tracking-tight md:tracking-wider shadow-lg">
            TOP
          </div>
        )}
      </div>

      <button className="absolute top-1 right-1 md:top-3 md:right-3 z-10 p-0.5 md:p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
        <Heart className="w-2 h-2 md:w-5 md:h-5" />
      </button>

      {/* Product Image - Aspect ratio set to 2/3 for 800x1200 images */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
      </Link>

      {/* Product Info - Centered text alignment */}
      <div className="p-2 md:p-6 flex flex-col flex-grow items-center text-center">
        <div className="mb-1 md:mb-3 flex flex-col items-center">
          <div className="flex items-center gap-0.5 md:gap-1 mb-1">
             {[1, 2, 3, 4, 5].map((s) => (
               <Star key={s} className="w-1.5 h-1.5 md:w-4 md:h-4 text-amber-400 fill-current" />
             ))}
             <span className="text-[6px] md:text-xs font-bold text-gray-400 ml-0.5">(2.4k)</span>
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-[10px] md:text-2xl font-black text-gray-900 leading-tight uppercase tracking-tight line-clamp-1 md:line-clamp-2 hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-[7px] md:text-sm text-gray-400 font-medium line-clamp-2 mb-2 md:mb-6 italic opacity-70">
          "{product.description}"
        </p>

        <div className="mt-auto w-full space-y-2 md:space-y-4">
          <div className="flex items-baseline justify-center gap-1 md:gap-3">
            <span className="text-[11px] md:text-3xl font-black text-gray-900">₹{product.price.toFixed(0)}</span>
            <span className="text-[7px] md:text-sm text-gray-300 line-through font-bold">₹{originalPrice}</span>
          </div>

          <button 
            onClick={() => onBuyNow(product)}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-2 md:py-4 rounded-lg md:rounded-2xl text-[8px] md:text-sm font-black uppercase tracking-tight md:tracking-widest transition-all shadow-lg flex items-center justify-center gap-1 md:gap-2 active:scale-95 group/btn"
          >
            <Zap className="w-2 h-2 md:w-4 md:h-4 text-amber-400 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
