
import React from 'react';
import { Product } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Zap, Rocket, CheckCircle2, TrendingUp } from 'lucide-react';

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
    <div className="group bg-white rounded-[1.2rem] md:rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full relative shadow-md mx-auto w-full max-w-[260px]">
      
      {/* Top Badges */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
        <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-md font-black text-[7px] md:text-[9px] uppercase tracking-wider shadow-lg">
          -{discount}% OFF
        </div>
      </div>

      <button className="absolute top-2 right-2 z-20 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:text-red-400 transition-colors shadow-md active:scale-90 border border-white/10">
        <Heart className="w-3 h-3" />
      </button>

      {/* Poster Section */}
      <div className="p-1.5 md:p-2">
        <Link 
          to={`/product/${product.id}`} 
          className="block relative aspect-[2/3] overflow-hidden rounded-[1rem] md:rounded-[1.5rem] bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 flex flex-col items-center justify-start p-3 md:p-4 text-center shadow-inner"
        >
          {/* Rocket Icon in Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 scale-[1.5] pointer-events-none">
            <Rocket className="w-24 h-24 text-white" />
          </div>

          {/* Poster Content */}
          <div className="relative z-10 w-full flex flex-col items-center space-y-1.5 md:space-y-3">
             <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-md">
               Plan <span className="text-amber-400">{product.id === 'plan-a' ? 'A' : 'B'}</span>
             </h2>

             {/* Illustration Mockup */}
             <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
                <Rocket className="w-8 h-8 md:w-10 md:h-10 text-amber-400 animate-bounce-slow" />
             </div>

             {/* Features List */}
             <div className="w-full text-left space-y-1 md:space-y-2 pt-2">
                {product.features?.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-100 leading-tight">
                       {feature.split(':')[0]} : <span className="text-amber-300 font-black">{feature.split(':')[1]}</span>
                    </p>
                  </div>
                ))}
             </div>

             {/* Hindi Tagline */}
             <p className="text-[7px] md:text-[9px] font-black text-amber-400 uppercase tracking-tight mt-2 italic bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">
                "Idea जिंदगी बदल देगी..!!"
             </p>
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-white/5 transition-colors"></div>
        </Link>
      </div>

      {/* Info & Price */}
      <div className="p-3 md:p-4 pt-0 md:pt-0 flex flex-col flex-grow items-center text-center">
        <div className="mb-2 flex flex-col items-center">
          <div className="flex items-center gap-0.5 mb-1">
             {[1, 2, 3, 4, 5].map((s) => (
               <Star key={s} className="w-2 md:w-2.5 text-amber-400 fill-current" />
             ))}
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-[10px] md:text-sm font-black text-gray-900 leading-tight uppercase tracking-tight hover:text-indigo-600 transition-colors">
              {product.name} Course
            </h3>
          </Link>
        </div>

        <div className="mt-auto w-full space-y-2">
          <div className="flex flex-row items-center justify-center gap-1.5 mb-1">
            <span className="text-lg md:text-xl font-[1000] text-gray-900 tracking-tighter">₹{product.price.toFixed(0)}</span>
            <span className="text-[8px] md:text-[10px] text-gray-300 line-through font-bold">₹{originalPrice}</span>
          </div>

          <button 
            onClick={() => onBuyNow(product)}
            className="w-full bg-indigo-600 hover:bg-slate-900 text-white py-2 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5 group/btn"
          >
            <Zap className="w-2.5 md:w-3 text-amber-400 fill-current group-hover/btn:animate-pulse" />
            <span>Enroll Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
