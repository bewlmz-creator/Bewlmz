
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
    <div className="group bg-white rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative shadow-sm mx-auto w-full max-w-[450px] md:max-w-none">
      
      {/* Top Badges & Actions */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <div className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-black text-xs md:text-sm uppercase tracking-wider shadow-lg">
          -{discount}%
        </div>
        {product.id === 'plan-b' && (
          <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-black text-xs md:text-sm uppercase tracking-wider shadow-lg">
            TOP SELL
          </div>
        )}
      </div>

      <button className="absolute top-6 right-6 z-10 p-3 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-md active:scale-90">
        <Heart className="w-6 h-6" />
      </button>

      {/* Product Image - Tall Poster Look (Strict 2:3) */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
        {/* Subtle Overlay Label */}
        <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Premium Content</span>
        </div>
      </Link>

      {/* Product Info - Bold & Large like PC */}
      <div className="p-8 md:p-10 flex flex-col flex-grow items-center text-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-3">
             {[1, 2, 3, 4, 5].map((s) => (
               <Star key={s} className="w-5 h-5 text-amber-400 fill-current" />
             ))}
             <span className="text-sm font-bold text-gray-400 ml-1">(2.4k+)</span>
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight uppercase tracking-tight hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-sm md:text-lg text-gray-500 font-medium line-clamp-2 mb-8 italic opacity-80 max-w-[300px]">
          "{product.description}"
        </p>

        <div className="mt-auto w-full space-y-6">
          <div className="flex items-baseline justify-center gap-4">
            <span className="text-4xl md:text-6xl font-[1000] text-gray-900 tracking-tighter">₹{product.price.toFixed(0)}</span>
            <span className="text-lg md:text-2xl text-gray-300 line-through font-bold">₹{originalPrice}</span>
          </div>

          <button 
            onClick={() => onBuyNow(product)}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-6 md:py-8 rounded-[2rem] text-sm md:text-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-4 active:scale-95 group/btn"
          >
            <Zap className="w-5 h-5 md:w-8 md:h-8 text-amber-400 fill-current group-hover:scale-125 transition-transform" />
            <span>Enroll Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
