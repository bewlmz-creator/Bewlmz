
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
import { supabase } from './lib/supabase';
import { CartItem, Product } from './types';
import { ShoppingCart, Sparkles, Menu, X, Home as HomeIcon, Info, Shield, RefreshCcw, Headset, Lock, Download, Play } from 'lucide-react';

const Navbar: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const checkVerification = useCallback(async () => {
    const rawEmail = localStorage.getItem('last_customer_email');
    if (!rawEmail) {
      setIsVerified(false);
      return;
    }
    
    const email = rawEmail.toLowerCase().trim();
    
    // First check local storage for speed
    const orders = VaultDB.getOrders();
    let verified = orders.some((o: any) => 
      o.email?.toLowerCase().trim() === email && o.status === 'verified'
    );
    
    // If not verified in local, double check fresh data from Supabase
    if (!verified) {
      const { data } = await supabase
        .from('orders')
        .select('status')
        .eq('email', email)
        .eq('status', 'verified');
      
      if (data && data.length > 0) {
        verified = true;
      }
    }
    
    setIsVerified(verified);
  }, []);

  useEffect(() => {
    checkVerification();
    
    // Set up real-time listener for the navbar
    const email = localStorage.getItem('last_customer_email')?.toLowerCase().trim();
    let channel: any;

    if (email) {
      channel = supabase
        .channel('navbar-verify-check')
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `email=eq.${email}` }, 
          async () => {
            await VaultDB.pullFromSupabase(); // Sync database
            checkVerification(); // Update navbar state
          }
        )
        .subscribe();
    }

    window.addEventListener('storage', checkVerification);
    window.addEventListener('vault_sync', checkVerification);
    
    return () => {
      if (channel) supabase.removeChannel(channel);
      window.removeEventListener('storage', checkVerification);
      window.removeEventListener('vault_sync', checkVerification);
    };
  }, [checkVerification]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const menuLinks = [
    { name: 'Home', short: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', short: 'About', path: '/about', icon: Info },
    { name: 'Privacy Policy', short: 'Privacy', path: '/privacy-policy', icon: Shield },
    { name: 'Refund Policy', short: 'Refund', path: '/refund-policy', icon: RefreshCcw },
    { name: 'Contact', short: 'Contact', path: '/contact', icon: Headset },
  ];

  const isLinkActive = (path: string) => location.pathname === path;
  
  return (
    <>
      {/* Drawer Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[300] shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <span className="text-xl font-black text-indigo-600 uppercase italic">Menu</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {menuLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                isLinkActive(link.path) 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isLinkActive(link.path) ? 'text-white' : 'text-indigo-600'}`} />
              {link.name}
            </Link>
          ))}
          
          {isVerified && (
            <Link 
              to="/my-downloads"
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                isLinkActive('/my-downloads') ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 animate-pulse'
              }`}
            >
              <Play className="w-5 h-5" />
              Play Video
            </Link>
          )}
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
            <Lock className="w-4 h-4 text-slate-300" />
            <Link to="/admin-login" className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-indigo-600">Admin Portal</Link>
          </div>
        </div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[200] bg-white border-b border-slate-100 shadow-sm h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative">
          
          <div className="flex-1 flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 md:hidden text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <Menu className="w-7 h-7" />
            </button>

            <div className="hidden md:flex items-center gap-2">
              {menuLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-[11px] font-[900] uppercase tracking-tight transition-all whitespace-nowrap ${
                    isLinkActive(link.path) 
                      ? 'text-white bg-indigo-600 shadow-md scale-105' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {link.short}
                </Link>
              ))}
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
            <Link to="/" className="flex items-center space-x-1 md:space-x-2 group">
              <div className="bg-indigo-600 p-1 md:p-1.5 rounded-lg group-hover:rotate-12 transition-all shadow-md">
                <Sparkles className="text-white w-3 h-3 md:w-5 md:h-5" />
              </div>
              <span className="text-sm md:text-2xl font-black tracking-tighter text-slate-900 uppercase">
                bewl<span className="text-indigo-600">mz</span>
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
            {isVerified && (
              <Link 
                to="/my-downloads" 
                className={`flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest transition-all hover:bg-green-700 shadow-md ${
                  isLinkActive('/my-downloads') ? 'bg-slate-900 text-white' : 'bg-green-600 text-white animate-bounce-slow'
                }`}
              >
                <Play className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden xs:inline">Play Video</span>
              </Link>
            )}
            
            <Link 
              to="/checkout" 
              className={`p-2.5 md:p-3 border rounded-xl relative transition-all active:scale-95 ${
                isLinkActive('/checkout') 
                  ? 'bg-indigo-600 text-white border-indigo-500' 
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[8px] md:text-[10px] font-black h-4 w-4 md:h-5.5 md:w-5.5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
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
        <main className="flex-grow pt-16 md:pt-20">
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
        <footer className="bg-slate-950 py-12 px-4 md:py-20 mt-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-500 p-1.5 rounded-lg"><Sparkles className="text-white w-6 h-6" /></div>
                  <span className="text-2xl font-black text-white uppercase italic">bewlmz</span>
                </div>
                <p className="text-slate-400 text-sm md:text-lg leading-relaxed font-medium italic max-w-sm">
                  Empowering you to start your first online business with proven blueprints.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 md:col-span-2">
                <div className="space-y-4">
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px] opacity-40">Shop</h4>
                  <div className="flex flex-col space-y-2">
                    <Link to="/" className="text-slate-500 hover:text-indigo-400 text-xs font-bold transition-colors">Marketplace</Link>
                    <Link to="/about" className="text-slate-500 hover:text-indigo-400 text-xs font-bold transition-colors">About Us</Link>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px] opacity-40">Legal</h4>
                  <div className="flex flex-col space-y-2">
                    <Link to="/privacy-policy" className="text-slate-500 hover:text-indigo-400 text-xs font-bold transition-colors">Privacy</Link>
                    <Link to="/refund-policy" className="text-slate-500 hover:text-indigo-400 text-xs font-bold transition-colors">Refund</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">
              <span>&copy; {new Date().getFullYear()} bewlmz.</span>
              <div className="flex items-center gap-4">
                <Link to="/admin-login" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Admin
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
