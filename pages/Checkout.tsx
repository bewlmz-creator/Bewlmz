
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { ShoppingBag, Zap, User, Mail, Trash2, Phone } from 'lucide-react';

interface Props {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
}

const Checkout: React.FC<Props> = ({ cart, removeFromCart }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Save user info for identification
    const fullName = `${firstName} ${lastName}`.trim();
    localStorage.setItem('last_customer_name', fullName);
    localStorage.setItem('last_customer_first_name', firstName);
    localStorage.setItem('last_customer_last_name', lastName);
    localStorage.setItem('last_customer_phone', phone);
    localStorage.setItem('last_customer_email', email.toLowerCase().trim());
    
    navigate('/payment');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 md:py-20 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Your vault is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm md:text-base">Explore our marketplace and fill it with digital products.</p>
          <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors w-full sm:w-auto">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gray-50">
              <h2 className="font-bold text-lg md:text-xl text-indigo-900 uppercase tracking-wide">Review Order ({cart.length})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {cart.map(item => (
                <div key={item.id} className="p-4 md:p-8 flex items-center space-x-4 md:space-x-8">
                  <div className="relative w-24 h-36 md:w-48 md:h-72 rounded-xl md:rounded-[2.5rem] overflow-hidden bg-[#1a0033] shrink-0 shadow-lg">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-black text-sm md:text-3xl truncate uppercase tracking-tighter text-slate-900">{item.name}</h3>
                    <div className="mt-2 text-indigo-600 font-black text-lg md:text-4xl">₹{item.price.toFixed(0)}</div>
                    <p className="mt-2 text-[10px] md:text-xs font-black text-green-600 uppercase tracking-widest bg-green-50 inline-block px-2 py-1 rounded-md">Direct App Delivery</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors shrink-0 group">
                    <Trash2 className="w-5 h-5 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-lg p-6 md:p-8">
            <h2 className="font-black text-xl mb-6 text-gray-900 uppercase tracking-wide">Identity Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 00000 00000" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between text-2xl font-black text-gray-900 pb-6">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{total.toFixed(0)}</span>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl md:rounded-[2rem] text-[14px] md:text-2xl font-black uppercase tracking-[0.15em] hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 shadow-xl">
                  <Zap className="w-5 h-5 md:w-7 md:h-7 fill-current text-amber-400" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
