
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
    <div className="px-4 py-1 md:py-2 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Main Box - Slim (Chhota) and Long (Lamba) */}
        <div className="bg-slate-900 rounded-[1rem] md:rounded-[2rem] py-1.5 px-3 md:py-2 md:px-8 overflow-hidden relative shadow-md border border-slate-800 group min-h-[50px] md:min-h-[70px] flex items-center">
          
          {/* Subtle Live Badge */}
          <div className="absolute top-1 left-4 z-20">
            <div className="flex items-center space-x-1 bg-indigo-600/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-full">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[5px] md:text-[7px] font-black text-indigo-400 uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="flex items-center justify-between w-full relative z-10 gap-2 md:gap-6">
            
            {/* Left: Compact Icon Box */}
            <div className="relative shrink-0 scale-75 md:scale-100">
              <div className="bg-slate-800 p-1.5 md:p-2 rounded-lg md:rounded-xl ring-1 ring-white/5 shadow-md flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 md:w-5 md:h-5 text-indigo-400" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full border border-slate-900 p-0.5">
                 <CheckCircle2 className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 text-white" />
              </div>
            </div>
            
            {/* Middle: Long Text Content Area */}
            <div className="flex-grow flex items-center overflow-hidden">
               <div className={`transition-all duration-700 transform flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-4 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                 <p className="text-[10px] md:text-base font-black text-white uppercase tracking-tight whitespace-nowrap">
                   <span className="text-indigo-400">{current.name}</span> 
                   <span className="text-slate-500 font-bold lowercase px-1">from</span> 
                   <span className="text-slate-100">{current.city}</span>
                 </p>
                 
                 <div className="flex items-center space-x-1.5 md:space-x-3 overflow-hidden">
                   <div className="hidden xs:flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-1 py-0.5 rounded">
                      <TrendingUp className="w-2 h-2 text-amber-500" />
                      <span className="text-[6px] font-black text-amber-500 uppercase tracking-widest">Growth</span>
                   </div>
                   <p className="text-[8px] md:text-sm font-bold text-slate-400 truncate max-w-[150px] sm:max-w-none">
                     Purchased <span className="text-white italic">"{current.product}"</span>
                   </p>
                 </div>
               </div>
            </div>

            {/* Right: Small Verification Box */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/20 px-3 py-1.5 rounded-full border border-slate-700/30">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
               <span className="text-[7px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">Verified Transaction</span>
            </div>
          </div>

          {/* Background Highlight */}
          <div className="absolute right-0 bottom-0 w-32 h-full bg-indigo-500/5 blur-[30px] pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default FakePurchaseSlider;
