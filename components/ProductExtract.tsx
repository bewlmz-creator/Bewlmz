
import React from 'react';
import { Play, FileText, BarChart, Zap, ShieldCheck, Sparkles } from 'lucide-react';

const ProductExtract: React.FC = () => {
  return (
    <div className="px-4 py-8 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] md:rounded-[6rem] overflow-hidden relative shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] border border-slate-800">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left: Content */}
            <div className="flex-1 p-10 md:p-20 lg:p-28 space-y-8 md:space-y-14 z-10 text-center lg:text-left">
              <div className="space-y-6 flex flex-col items-center lg:items-start">
                <div className="inline-flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-6 py-3 rounded-full">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-[10px] md:text-sm font-black text-indigo-300 uppercase tracking-[0.2em]">What You Extract</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-[1000] text-white leading-[0.8] tracking-tighter uppercase">
                  Digital <br/>
                  <span className="text-indigo-500">Inventory</span>
                </h2>
                <p className="text-slate-400 text-lg md:text-3xl font-medium max-w-md leading-relaxed">
                  Enrollment के तुरंत बाद आपके Email पर ये सब उपलब्ध होगा। 
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-16">
                {[
                  { icon: Play, title: "Video Modules", desc: "Step-by-Step Hindi" },
                  { icon: FileText, title: "Action Sheets", desc: "Printable Blueprints" },
                  { icon: BarChart, title: "Earnings Flow", desc: "Proof of Concept" },
                  { icon: ShieldCheck, title: "Lifetime Pay", desc: "One time enrollment" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-6 group text-left">
                    <div className="bg-slate-800 p-4 rounded-2xl group-hover:bg-indigo-600 transition-colors shadow-lg">
                      <item.icon className="w-7 h-7 md:w-10 md:h-10 text-indigo-400 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm md:text-2xl uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-500 text-[10px] md:text-base font-bold uppercase tracking-wider">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual Showcase Synchronized for Mobile PC Look */}
            <div className="flex-1 w-full bg-slate-800/20 p-10 md:p-20 lg:p-28 flex items-center justify-center relative min-h-[550px] lg:min-h-0">
              <div className="relative w-full max-w-[320px] md:max-w-[550px] aspect-[2/3]">
                <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10 rounded-[4rem] md:rounded-[6rem] rotate-[-8deg] blur-sm"></div>
                
                {/* Main Floating Image Synchronized with Product Cards */}
                <div className="relative w-full h-full rounded-[4rem] md:rounded-[6rem] overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.6)] group border-2 border-white/5">
                  <img 
                    src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800&h=1200" 
                    alt="Digital Content" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[85%]">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-[2rem] text-center shadow-2xl">
                       <Zap className="w-8 h-8 md:w-14 md:h-14 text-amber-400 mx-auto mb-3 fill-current" />
                       <p className="text-white font-black text-[12px] md:text-2xl uppercase tracking-[0.2em]">Instant Access</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-12 -right-6 md:-top-16 md:-right-16 bg-amber-400 text-slate-900 w-24 h-24 md:w-48 md:h-48 rounded-full flex flex-col items-center justify-center shadow-3xl rotate-12 z-20 border-[6px] border-white">
                  <span className="text-[14px] md:text-4xl font-[1000] uppercase tracking-tighter">Elite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductExtract;
