
import React from 'react';
import { RefreshCcw } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-10">
          <div className="bg-amber-50 p-3 rounded-2xl">
            <RefreshCcw className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Refund Policy</h1>
        </div>
        
        <div className="prose prose-amber max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Digital Goods Policy</h2>
            <p>
              चूंकि हमारे प्रोडक्ट्स डिजिटल हैं (PDFs, Videos, Guidebooks) और इन्हें डाउनलोड करने के बाद वापस नहीं किया जा सकता, इसलिए हम आमतौर पर रिफंड नहीं देते हैं। हालांकि, आपकी संतुष्टि हमारे लिए सर्वोपरि है।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Refund Eligibility</h2>
            <p>
              रिफंड केवल तभी दिया जा सकता है जब:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>पेमेंट सफल होने के बाद भी आपको प्रोडक्ट का एक्सेस न मिला हो।</li>
              <li>प्रोडक्ट फाइल करप्ट (Corrupt) हो और हम उसे रिप्लेस न कर पाएं।</li>
              <li>गलती से एक ही प्रोडक्ट के लिए दो बार पेमेंट हो गया हो।</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to Request</h2>
            <p>
              रिफंड के लिए कृपया हमें 7 दिनों के भीतर <a href="mailto:support@digivault.com" className="text-indigo-600 font-bold">support@digivault.com</a> पर ईमेल करें। ईमेल में अपना ट्रांजेक्शन ID और रिफंड का कारण ज़रूर लिखें।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Satisfaction Guarantee</h2>
            <p>
              यदि आप कंटेंट से खुश नहीं हैं, तो कृपया हमें बताएं। हम आपको अतिरिक्त रिसोर्सेज या गाइडेंस देकर आपकी मदद करने की पूरी कोशिश करेंगे ताकि आप अपने बिज़नेस में सफल हो सकें।
            </p>
          </section>

          <div className="pt-8 border-t border-gray-100">
            <p className="text-sm font-medium italic">We are here to help you grow, not just to sell.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
