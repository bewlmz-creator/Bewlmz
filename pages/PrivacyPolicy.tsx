
import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-10">
          <div className="bg-indigo-50 p-3 rounded-2xl">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p>
              When you purchase a digital product from DigiVault, we collect basic information such as your name, email address, and billing details. This is purely to ensure the delivery of your digital assets and to provide customer support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Data</h2>
            <p>
              Your data is primarily used to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Process transactions and send confirmation emails.</li>
              <li>Deliver download links for your purchased products.</li>
              <li>Send occasional updates about new business ideas (you can unsubscribe anytime).</li>
              <li>Provide personalized customer support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. All payment transactions are processed through encrypted gateways (UPI/Stripe/Razorpay) and are not stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Cookies</h2>
            <p>
              We use small cookies to help us remember and process the items in your shopping cart and understand your preferences for future visits.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-100">
            <p className="text-sm font-medium">Last Updated: October 2023</p>
            <p className="text-sm mt-2">Questions? Contact us at <a href="mailto:privacy@digivault.com" className="text-indigo-600 font-bold">privacy@digivault.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
