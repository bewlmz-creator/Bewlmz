
import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="animate-in fade-in duration-500 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Contact <span className="text-indigo-600">Us</span></h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            कोई भी सवाल हो तो बेझिझक हमसे संपर्क करें। हमारी टीम आपकी मदद के लिए तैयार है।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-start space-x-6">
              <div className="bg-indigo-50 p-4 rounded-2xl">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Email Us</h3>
                <p className="text-gray-500 mb-2">General inquiries & support</p>
                <a href="mailto:support@digivault.com" className="text-indigo-600 font-bold">support@digivault.com</a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-start space-x-6">
              <div className="bg-amber-50 p-4 rounded-2xl">
                <MessageSquare className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Social Media</h3>
                <p className="text-gray-500 mb-2">Direct Message for quick reply</p>
                <p className="text-indigo-600 font-bold">@DigiVault_India</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-start space-x-6">
              <div className="bg-indigo-50 p-4 rounded-2xl">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Location</h3>
                <p className="text-gray-500 mb-1">Digital First Office</p>
                <p className="text-gray-900 font-medium">Remote Support, New Delhi, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-indigo-500/5 border border-gray-100">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="bg-green-100 p-4 rounded-full">
                  <Send className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">Message Sent!</h2>
                <p className="text-gray-500">हम 24 घंटे के भीतर आपसे संपर्क करेंगे।</p>
                <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-bold hover:underline mt-4">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                    <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="आपका नाम" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input required type="email" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="आपका ईमेल" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Message</label>
                  <textarea required rows={4} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="आप क्या पूछना चाहते हैं?"></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2">
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
