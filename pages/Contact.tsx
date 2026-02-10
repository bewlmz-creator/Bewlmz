
import React from 'react';
import { Mail, MapPin, Sparkles, Play, Send, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const EMAIL_ADDRESS = "support@bewlmz.com";
  const emailUrl = `mailto:${EMAIL_ADDRESS}?subject=Support Request - bewlmz Digital&body=Hi Support Team,`;

  return (
    <div className="animate-in fade-in duration-500 py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Official Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-[1000] text-gray-900 mb-6 uppercase tracking-tighter italic">Support <span className="text-indigo-600">Center</span></h1>
          <p className="text-lg md:text-2xl text-gray-500 max-w-2xl mx-auto font-bold">
            Koi bhi sawal ho to humein Email karein. Humari team aapki madad ke liye taiyar hai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Main Direct Support Action - Replaced WhatsApp with Email */}
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
            <div className="bg-indigo-500/10 p-6 rounded-full">
              <Mail className="w-12 h-12 text-indigo-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Official Email</h2>
              <p className="text-slate-400 font-bold leading-relaxed italic">
                Aapka query humein email karein. Hum 24 ghanton ke andar aapko reply karenge.
              </p>
            </div>
            <a 
              href={emailUrl}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-4 active:scale-95"
            >
              <Send className="w-6 h-6" />
              <span>EMAIL US NOW</span>
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
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight">Response Time</h3>
                <p className="text-gray-500 font-bold text-sm">Under 24 Working Hours</p>
              </div>
            </div>

            <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white flex flex-col justify-center">
               <h4 className="text-xl font-black uppercase italic tracking-widest mb-2">24/7 Monitoring</h4>
               <p className="text-indigo-100 text-sm font-bold italic opacity-80">Aapka access humesha secure hai aur bina manual intervention ke unlock hota hai.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
