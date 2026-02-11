
import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, TrendingUp } from 'lucide-react';

const PURCHASES = [
  { name: "Rahul", city: "Mumbai", product: "Plan A" },
  { name: "Ankit", city: "New Delhi", product: "Plan B" },
  { name: "Priya", city: "Lucknow", product: "Plan A" },
  { name: "Vikram", city: "Pune", product: "Plan B" },
  { name: "Sneha", city: "Jaipur", product: "Plan A" },
  { name: "Arjun", city: "Ahmedabad", product: "Plan B" },
  { name: "Megha", city: "Indore", product: "Plan A" }
];

const FakePurchaseSlider: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PURCHASES.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = PURCHASES[index];

  return (
    <div className="px-4 py-1.5">
      <div className="max-w-6xl mx-auto">
        {/* Increased min-height and padding for a bigger look */}
        <div className="bg-white rounded-xl md:rounded-3xl py-3 px-4 md:py-4 md:px-8 overflow-hidden relative shadow-md border border-slate-100 flex items-center min-h-[56px] md:min-h-[72px] shadow-indigo-100/50">
          
          <div className="flex items-center justify-between w-full relative z-10 gap-3 md:gap-6">
            
            <div className="relative shrink-0 flex items-center">
              {/* Larger icon container */}
              <div className="bg-indigo-50 p-2 md:p-3 rounded-xl border border-indigo-100 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 text-indigo-600" />
              </div>
            </div>
            
            <div className="flex-grow flex items-center overflow-hidden">
               <div className={`transition-all duration-700 transform flex items-center gap-2 md:gap-4 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                 {/* Larger text size for better mobile visibility */}
                 <p className="text-[12px] md:text-lg font-black text-slate-900 uppercase tracking-tight whitespace-nowrap leading-none">
                   <span className="text-indigo-600">{current.name}</span> 
                   <span className="text-slate-400 font-bold lowercase px-1.5">from</span> 
                   <span className="text-slate-900">{current.city}</span>
                 </p>
                 
                 <div className="hidden sm:flex items-center space-x-3">
                   <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                      <TrendingUp className="w-3 h-3 text-amber-600" />
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Growth</span>
                   </div>
                   <p className="text-sm font-bold text-slate-500">
                     Purchased <span className="text-slate-900">"{current.product}"</span>
                   </p>
                 </div>
               </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
               <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Verified Purchase</span>
            </div>
            
            {/* Larger mobile badge */}
            <div className="md:hidden flex items-center">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakePurchaseSlider;
