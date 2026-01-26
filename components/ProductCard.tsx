
import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Star, Heart, Zap, ShoppingCart } from 'lucide-react';

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onAdd, onBuyNow }) => {
  const originalPrice = Math.round(product.price * 2.5);
  const discount = 60;
  
  return (
    <div className="group bg-white rounded-[1.5rem] md:rounded-[3rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative shadow-sm mx-auto w-full">
      
      {/* Top Badges */}
      <div className="absolute top-2 left-2 md:top-6 md:left-6 z-10 flex flex-col gap-1">
        <div className="bg-red-500 text-white px-2 py-0.5 md:px-4 md:py-1.5 rounded-md md:rounded-lg font-black text-[8px] md:text-sm uppercase tracking-wider shadow-lg">
          -{discount}%
        </div>
        {product.id === 'plan-b' && (
          <div className="bg-indigo-600 text-white px-2 py-0.5 md:px-4 md:py-1.5 rounded-md md:rounded-lg font-black text-[8px] md:text-sm uppercase tracking-wider shadow-lg">
            TOP
          </div>
        )}
      </div>

      <button className="absolute top-2 right-2 md:top-6 md:right-6 z-10 p-1.5 md:p-3 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-md active:scale-90">
        <Heart className="w-3.5 h-3.5 md:w-6 md:h-6" />
      </button>

      {/* Product Image */}
      <div className="p-2 md:p-4">
        <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-[1rem] md:rounded-[2rem]">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
          <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white/20 backdrop-blur-md px-2 py-0.5 md:px-4 md:py-2 rounded-full border border-white/30">
            <span className="text-[5px] md:text-[10px] font-black text-white uppercase tracking-widest">Premium</span>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-8 pt-0 md:pt-0 flex flex-col flex-grow items-center text-center">
        <div className="mb-2 md:mb-4 flex flex-col items-center">
          <div className="flex items-center gap-0.5 md:gap-1.5 mb-1 md:mb-2">
             {[1, 2, 3, 4, 5].map((s) => (
               <Star key={s} className="w-2.5 h-2.5 md:w-4 md:h-4 text-amber-400 fill-current" />
             ))}
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm md:text-3xl font-black text-gray-900 leading-tight uppercase tracking-tight hover:text-indigo-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto w-full space-y-2 md:space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-4 mb-1 md:mb-2">
            <span className="text-lg md:text-5xl font-[1000] text-gray-900 tracking-tighter">₹{product.price.toFixed(0)}</span>
            <span className="text-[10px] md:text-xl text-gray-300 line-through font-bold">₹{originalPrice}</span>
          </div>

          {/* Direct Buy Button Only */}
          <div className="w-full">
            <button 
              onClick={() => onBuyNow(product)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 md:py-6 rounded-lg md:rounded-[1.5rem] text-[10px] md:text-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-3 h-3 md:w-6 md:h-6 text-amber-400 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
