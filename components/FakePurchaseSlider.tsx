
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
    <div className="px-4 py-1">
      <div className="max-w-6xl mx-auto">
        {/* Updated background to white and adjusted border/shadow */}
        <div className="bg-white rounded-xl md:rounded-2xl py-1 px-3 md:py-1.5 md:px-6 overflow-hidden relative shadow-sm border border-slate-100 flex items-center min-h-[40px] md:min-h-[50px] shadow-indigo-100/50">
          
          <div className="flex items-center justify-between w-full relative z-10 gap-2 md:gap-4">
            
            <div className="relative shrink-0 flex items-center">
              {/* Changed icon background to a light indigo tint */}
              <div className="bg-indigo-50 p-1 md:p-1.5 rounded-lg border border-indigo-100 flex items-center justify-center">
                <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 text-indigo-600" />
              </div>
            </div>
            
            <div className="flex-grow flex items-center overflow-hidden">
               <div className={`transition-all duration-700 transform flex items-center gap-2 md:gap-4 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                 {/* Updated text colors for light background */}
                 <p className="text-[9px] md:text-sm font-black text-slate-900 uppercase tracking-tight whitespace-nowrap">
                   <span className="text-indigo-600">{current.name}</span> 
                   <span className="text-slate-400 font-bold lowercase px-1">from</span> 
                   <span className="text-slate-900">{current.city}</span>
                 </p>
                 
                 <div className="hidden sm:flex items-center space-x-2">
                   <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-1 py-0.5 rounded">
                      <TrendingUp className="w-2 h-2 text-amber-600" />
                      <span className="text-[6px] font-black text-amber-600 uppercase tracking-widest">Growth</span>
                   </div>
                   <p className="text-[8px] md:text-xs font-bold text-slate-500">
                     Purchased <span className="text-slate-900">"{current.product}"</span>
                   </p>
                 </div>
               </div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakePurchaseSlider;
