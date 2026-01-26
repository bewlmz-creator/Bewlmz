
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
    <div className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative shadow-sm">
      
      {/* Top Badges & Actions */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-red-500 text-white px-3 py-1 rounded-md font-black text-[10px] md:text-xs uppercase tracking-wider shadow-lg">
          -{discount}%
        </div>
        {product.id === 'plan-b' && (
          <div className="bg-indigo-600 text-white px-3 py-1 rounded-md font-black text-[10px] md:text-xs uppercase tracking-wider shadow-lg">
            TOP SELL
          </div>
        )}
      </div>

      <button className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-md active:scale-90">
        <Heart className="w-5 h-5" />
      </button>

      {/* Product Image - High Impact Poster Style */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
        {/* Subtle Overlay Label */}
        <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
          <span className="text-[8px] font-black text-white uppercase tracking-widest">Premium Content</span>
        </div>
      </Link>

      {/* Product Info - Clean & Bold like PC */}
      <div className="p-6 md:p-8 flex flex-col flex-grow items-center text-center">
        <div className="mb-4 flex flex-col items-center">
          <div className="flex items-center gap-1 mb-2">
             {[1, 2, 3, 4, 5].map((s) => (
               <Star key={s} className="w-4 h-4 text-amber-400 fill-current" />
             ))}
             <span className="text-xs font-bold text-gray-400 ml-1">(2.4k+)</span>
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight uppercase tracking-tight hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-xs md:text-sm text-gray-500 font-medium line-clamp-2 mb-6 italic opacity-80 max-w-[250px]">
          "{product.description}"
        </p>

        <div className="mt-auto w-full space-y-4">
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-2xl md:text-4xl font-[1000] text-gray-900 tracking-tighter">₹{product.price.toFixed(0)}</span>
            <span className="text-sm md:text-lg text-gray-300 line-through font-bold">₹{originalPrice}</span>
          </div>

          <button 
            onClick={() => onBuyNow(product)}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 md:py-5 rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 group/btn"
          >
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-current group-hover:scale-125 transition-transform" />
            <span>Enroll Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
