
import React, { useState, useEffect, useCallback } from 'react';
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
import VaultDB from './db';
import { CartItem, Product } from './types';
import { ShoppingCart, Menu, X, Sparkles, Home as HomeIcon, Info, Shield, RefreshCcw, Headset, Lock, Download } from 'lucide-react';

const Navbar: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();
  
  const checkVerification = useCallback(() => {
    const rawEmail = localStorage.getItem('last_customer_email');
    if (!rawEmail) {
      setIsVerified(false);
      return;
    }
    
    const email = rawEmail.toLowerCase().trim();
    const orders = VaultDB.getOrders();
    const verified = orders.some((o: any) => 
      o.email?.toLowerCase().trim() === email && o.status === 'verified'
    );
    
    setIsVerified(verified);
  }, []);

  useEffect(() => {
    checkVerification();
    window.addEventListener('storage', checkVerification);
    window.addEventListener('vault_sync', checkVerification);
    
    return () => {
      window.removeEventListener('storage', checkVerification);
      window.removeEventListener('vault_sync', checkVerification);
    };
  }, [checkVerification]);

  useEffect(() => {
    checkVerification();
    setIsOpen(false);
  }, [location.pathname, checkVerification]);

  // Restored Privacy and Refund policies to the header menu
  const menuLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Privacy Policy', path: '/privacy-policy', icon: Shield },
    { name: 'Refund Policy', path: '/refund-policy', icon: RefreshCcw },
    { name: 'Contact', path: '/contact', icon: Headset },
  ];

  const isLinkActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 glass w-full border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 h-16 md:h-20 items-center">
          
          {/* LEFT: Menu (Mobile Trigger & Tablet/Desktop Links) */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2.5 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl active:scale-90 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {menuLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`px-2 xl:px-3 py-2 rounded-lg text-[9px] xl:text-[10px] font-black uppercase tracking-tight xl:tracking-widest transition-all whitespace-nowrap ${
                    isLinkActive(link.path) 
                      ? 'text-white bg-indigo-600 shadow-md' 
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CENTER: Logo */}
          <div className="flex justify-center">
            <Link to="/" className="flex items-center space-x-2 group shrink-0">
              <div className="bg-gradient-to-tr from-indigo-600 to-indigo-400 p-1.5 rounded-xl group-hover:rotate-12 transition-all shadow-lg">
                <Sparkles className="text-white w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-lg md:text-2xl font-black tracking-tighter text-slate-900 uppercase">
                bewl<span className="text-indigo-600">mz</span>
              </span>
            </Link>
          </div>

          {/* RIGHT: Downloads & Checkout */}
          <div className="flex items-center justify-end gap-2 md:gap-4">
            {isVerified && (
              <Link 
                to="/my-downloads" 
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-md ${
                  isLinkActive('/my-downloads')
                    ? 'bg-slate-900 text-white'
                    : 'bg-indigo-600 text-white animate-pulse'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">My Downloads</span>
              </Link>
            )}

            <Link 
              to="/checkout" 
              className={`p-2.5 border rounded-xl relative transition-all active:scale-95 ${
                isLinkActive('/checkout') 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)}>
           <div className="w-80 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-6 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-600 p-1 rounded-lg"><Sparkles className="text-white w-4 h-4" /></div>
                  <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">Menu</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 rounded-xl hover:text-red-500"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-2 flex-grow overflow-y-auto">
                {menuLinks.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    className={`flex items-center space-x-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      isLinkActive(link.path) ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                ))}
                {isVerified && (
                  <Link 
                    to="/my-downloads" 
                    className={`flex items-center space-x-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all mt-4 border-2 border-indigo-100 ${
                      isLinkActive('/my-downloads') ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                    <span>My Downloads</span>
                  </Link>
                )}
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
      <div className="min-h-screen flex flex-col bg-white selection:bg-indigo-100 selection:text-indigo-900">
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
        <footer className="bg-slate-950 py-12 px-4 md:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-500 p-1 rounded-lg"><Sparkles className="text-white w-6 h-6" /></div>
                  <span className="text-2xl font-black tracking-tighter text-white uppercase italic">bewlmz</span>
                </div>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium italic max-w-sm">
                  Empowering you to start your first online business with proven blueprints.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 md:col-span-2">
                <div className="space-y-4">
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Company</h4>
                  <div className="flex flex-col space-y-2">
                    <Link to="/about" className="text-slate-500 hover:text-indigo-400 text-xs font-bold transition-colors">About Us</Link>
                    <Link to="/contact" className="text-slate-500 hover:text-indigo-400 text-xs font-bold transition-colors">Contact</Link>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Legal</h4>
                  <div className="flex flex-col space-y-2">
                    <Link to="/privacy-policy" className="text-slate-500 hover:text-indigo-400 text-xs font-bold transition-colors">Privacy Policy</Link>
                    <Link to="/refund-policy" className="text-slate-500 hover:text-indigo-400 text-xs font-bold transition-colors">Refund Policy</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">
              <span>&copy; {new Date().getFullYear()} bewlmz. Digital Assets Marketplace.</span>
              <div className="flex items-center gap-6">
                <Link to="/admin-login" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Admin Portal
                </Link>
                <span className="text-indigo-500">Secure Protocol</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
