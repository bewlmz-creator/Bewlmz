
import React from 'react';
import { MessageSquare, MapPin, Sparkles, Smartphone, Play } from 'lucide-react';

const Contact: React.FC = () => {
  const WHATSAPP_NUMBER = "919316422604"; // Your WhatsApp Number
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi,%20I%20need%20help%20with%20bewlmz%20Digital%20Course.`;

  return (
    <div className="animate-in fade-in duration-500 py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Fast Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-[1000] text-gray-900 mb-6 uppercase tracking-tighter italic">Support <span className="text-indigo-600">Center</span></h1>
          <p className="text-lg md:text-2xl text-gray-500 max-w-2xl mx-auto font-bold">
            Koi bhi sawal ho to WhatsApp par turant sampark karein. Humari team aapki madad ke liye taiyar hai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Main Direct Support Action */}
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            <div className="bg-green-500/10 p-6 rounded-full">
              <MessageSquare className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Direct WhatsApp</h2>
              <p className="text-slate-400 font-bold leading-relaxed italic">
                Email karne ki zarurat nahi! Direct WhatsApp karein aur 2-5 minutes mein reply payein.
              </p>
            </div>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all shadow-xl shadow-green-900/40 flex items-center justify-center gap-4 active:scale-95"
            >
              <Smartphone className="w-6 h-6" />
              <span>CHAT ON WHATSAPP</span>
            </a>
          </div>

          {/* Additional Info Cards */}
          <div className="grid gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6">
              <div className="bg-indigo-50 p-4 rounded-2xl">
                <Play className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight">App Delivery</h3>
                <p className="text-gray-500 font-bold text-sm">Courses app mein unlock hote hain.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6">
              <div className="bg-amber-50 p-4 rounded-2xl">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight">Location</h3>
                <p className="text-gray-500 font-bold text-sm">Remote Support, India</p>
              </div>
            </div>

            <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white flex flex-col justify-center">
               <h4 className="text-xl font-black uppercase italic tracking-widest mb-2">24/7 Monitoring</h4>
               <p className="text-indigo-100 text-sm font-bold italic opacity-80">Aapka access humesha secure hai aur bina manual call ke unlock hota hai.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
