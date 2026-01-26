
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentProof from './pages/PaymentProof';
import ThankYou from './pages/ThankYou';
import MyDownloads from './pages/MyDownloads';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { CartItem, Product } from './types';
import { ShoppingCart, Menu, X, Sparkles, Home as HomeIcon, Info, Shield, RefreshCcw, Headset, Zap, Lock, Download } from 'lucide-react';

const Navbar: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const checkVerification = () => {
      const email = localStorage.getItem('last_customer_email');
      const orders = JSON.parse(localStorage.getItem('vault_orders') || '[]');
      const verified = orders.some((o: any) => o.email === email && o.status === 'verified');
      setIsVerified(verified);
    };

    checkVerification();
    window.addEventListener('storage', checkVerification);
    return () => window.removeEventListener('storage', checkVerification);
  }, []);

  const menuLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    ...(isVerified ? [{ name: 'My Downloads', path: '/my-downloads', icon: Download }] : []),
    { name: 'About', path: '/about', icon: Info },
    { name: 'Privacy Policy', path: '/privacy-policy', icon: Shield },
    { name: 'Refund Policy', path: '/refund-policy', icon: RefreshCcw },
    { name: 'Contact', path: '/contact', icon: Headset },
  ];
  
  return (
    <nav className="sticky top-0 z-50 glass w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 md:h-24 items-center justify-between relative">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 justify-start">
            <button 
              onClick={() => setIsOpen(true)}
              className="p-2.5 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl active:scale-90 transition-all shadow-sm"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="hidden xs:flex items-center space-x-1.5 bg-indigo-600 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg border border-indigo-400">
               <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-400 fill-current" />
               <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">New</span>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center space-x-1.5 md:space-x-3 group">
              <div className="bg-gradient-to-tr from-indigo-600 to-indigo-400 p-1 md:p-1.5 rounded-lg md:rounded-2xl group-hover:rotate-12 transition-all shadow-lg">
                <Sparkles className="text-white w-4 h-4 md:w-6 md:h-6" />
              </div>
              <span className="text-sm md:text-3xl font-black tracking-tighter text-slate-900 uppercase whitespace-nowrap">
                bewl<span className="text-indigo-600">mz</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-end flex-1 gap-2 md:gap-4">
            {isVerified && (
               <Link to="/my-downloads" className="hidden md:flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest border border-indigo-200">
                  <Download className="w-4 h-4" />
                  <span>Downloads</span>
               </Link>
            )}
            <Link 
              to="/checkout" 
              className="p-2.5 md:p-4 text-slate-700 bg-white border border-slate-200 rounded-xl md:rounded-2xl relative transition-all active:scale-90 shadow-sm"
            >
              <ShoppingCart className="w-5 h-5 md:w-7 md:h-7" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] md:text-[11px] font-black h-4.5 w-4.5 md:h-6 md:w-6 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)}>
           <div className="w-80 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-600 p-1 rounded-lg"><Sparkles className="text-white w-4 h-4" /></div>
                  <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">Menu</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2.5 bg-slate-100 rounded-xl hover:text-red-500"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 md:p-8 space-y-3">
                {menuLinks.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-4 p-4 rounded-2xl text-[11px] md:text-[13px] font-black uppercase tracking-widest transition-all ${
                      location.pathname === link.path ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 text-slate-900'
                    }`}
                  >
                    <link.icon className="w-5 h-5 md:w-6 md:h-6" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCart([]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} removeFromCart={removeFromCart} />} />
            <Route path="/payment" element={<Payment cart={cart} clearCart={clearCart} />} />
            <Route path="/payment-proof" element={<PaymentProof cart={cart} clearCart={clearCart} />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/my-downloads" element={<MyDownloads />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 py-10 px-4 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 text-center md:text-left">
              <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <div className="bg-indigo-500 p-1 rounded-lg"><Sparkles className="text-white w-5 h-5" /></div>
                  <span className="text-2xl font-black tracking-tighter text-white uppercase">bewlmz</span>
                </div>
                <p className="text-slate-400 text-sm md:text-base max-w-sm mx-auto md:mx-0 leading-relaxed font-bold italic">
                  Start Your First Online Business & Earn Upto 3 lakh/Month with our specialized courses.
                </p>
              </div>
              <div className="md:col-span-2 flex flex-col items-center md:items-end">
                <div className="space-y-4 w-full md:w-auto text-center md:text-left">
                  <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Links</h4>
                  <div className="flex flex-col space-y-3">
                    <Link to="/about" className="text-slate-500 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest">About</Link>
                    <Link to="/contact" className="text-slate-500 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest">Contact</Link>
                    <Link to="/admin-login" className="text-slate-800 hover:text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center md:justify-end gap-2">
                       <Lock className="w-3 h-3" /> Admin Access
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-slate-600 text-[9px] font-black uppercase tracking-widest">
              <span>&copy; {new Date().getFullYear()} bewlmz.</span>
              <span className="text-indigo-500">Verified Platform</span>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
