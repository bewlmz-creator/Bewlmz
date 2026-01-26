
import React from 'react';
import { Target, Users, Award, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 py-12 md:py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">About <span className="text-indigo-600">bewlmz</span></h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
            हमारा मिशन हर भारतीय को सही बिजनेस आइडिया और गाइडेंस के साथ एक सफल डिजिटल एंटरप्रेन्योर बनाना है।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 mb-16 md:mb-24">
          <div className="bg-slate-50 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">Our Vision</h3>
            <p className="text-gray-500 leading-relaxed font-medium md:text-lg">
              हम सिर्फ कोर्स नहीं बेचते, हम सफलता की चाबी देते हैं। हमारा लक्ष्य 10,000+ लोगों को उनका पहला ऑनलाइन बिजनेस शुरू करने में मदद करना है।
            </p>
          </div>
          <div className="bg-slate-50 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-amber-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-100">
              <Users className="w-7 h-7 text-indigo-900" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">Our Community</h3>
            <p className="text-gray-500 leading-relaxed font-medium md:text-lg">
              1000 से ज्यादा छात्र पहले ही bewlmz से जुड़ चुके हैं। हम एक ऐसा समुदाय बना रहे हैं जहाँ हर कोई एक-दूसरे की तरक्की में साथ देता है।
            </p>
          </div>
        </div>

        <div className="bg-indigo-900 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-20 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter relative z-10">Why Choose Our Blueprints?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="space-y-4">
              <Award className="w-12 h-12 text-amber-400 mx-auto" />
              <h4 className="font-black text-xl uppercase tracking-widest">Expert Content</h4>
              <p className="text-indigo-200 text-sm md:text-base font-medium">Verified strategies for Indian market.</p>
            </div>
            <div className="space-y-4">
              <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
              <h4 className="font-black text-xl uppercase tracking-widest">Instant Access</h4>
              <p className="text-indigo-200 text-sm md:text-base font-medium">Get your videos immediately after payment.</p>
            </div>
            <div className="space-y-4">
              <Users className="w-12 h-12 text-amber-400 mx-auto" />
              <h4 className="font-black text-xl uppercase tracking-widest">Hindi Language</h4>
              <p className="text-indigo-200 text-sm md:text-base font-medium">Simple step-by-step Hindi guidance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
