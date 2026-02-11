
import React, { useState } from 'react';
import { Mail, User, Send, Clock, Sparkles, Play, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const EMAIL_ADDRESS = "support@bewlmz.com";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = `Support Request: ${firstName} ${lastName}`;
    const body = `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`;
    
    const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="animate-in fade-in duration-500 py-12 md:py-20 px-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Official Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-[1000] text-gray-900 mb-6 uppercase tracking-tighter italic">
            Support <span className="text-indigo-600">Center</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-500 max-w-2xl mx-auto font-bold">
            Koi bhi sawal ho to form fill karein ya humein Email karein. Humari team aapki madad ke liye taiyar hai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form Section */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 flex flex-col space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Send Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">First Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      required 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      placeholder="John" 
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-sm font-bold" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      required 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder="Doe" 
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-sm font-bold" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    required 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="john@example.com" 
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-sm font-bold" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Your Message</label>
                <textarea 
                  required 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  rows={4} 
                  placeholder="Type your message here..." 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-sm font-bold resize-none" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-4 active:scale-95 group"
              >
                <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          </div>

          {/* Additional Info Cards Section */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 p-4 rounded-2xl">
                <Play className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight">App Delivery</h3>
                <p className="text-gray-500 font-bold text-sm">Courses app mein unlock hote hain.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition-shadow">
              <div className="bg-amber-50 p-4 rounded-2xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight">Response Time</h3>
                <p className="text-gray-500 font-bold text-sm">Under 24 Working Hours</p>
              </div>
            </div>

            <div className="flex-grow bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center space-y-6 relative overflow-hidden border border-white/5">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
               <div className="space-y-2">
                 <h4 className="text-2xl font-black uppercase italic tracking-widest">24/7 Monitoring</h4>
                 <p className="text-indigo-100/60 text-sm font-bold italic">
                   Aapka access humesha secure hai aur bina manual intervention ke unlock hota hai.
                 </p>
               </div>
               
               <div className="pt-4 border-t border-white/10">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Direct Email</p>
                 <p className="text-lg md:text-xl font-black">{EMAIL_ADDRESS}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
