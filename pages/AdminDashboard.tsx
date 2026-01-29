
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import VaultDB from '../db';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  User,
  Package, 
  Layout, 
  LogOut, 
  X,
  QrCode,
  CheckCircle2,
  Trash2,
  Eye,
  Database,
  RefreshCw,
  Loader2,
  Check,
  Zap
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [siteBanner, setSiteBanner] = useState('');
  const [paymentConfig, setPaymentConfig] = useState({ qr: '', recipient: '', instructions: '' });

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'config' | 'payment'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProof, setViewingProof] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    await VaultDB.pullFromSupabase();
    setOrders(VaultDB.getOrders());
    setProducts(VaultDB.getProducts());
    setSiteBanner(VaultDB.getBanner());
    setPaymentConfig(VaultDB.getPaymentConfig());
    if (showLoader) setIsLoading(false);
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) { navigate('/admin-login'); return; }
    
    fetchLiveData();

    // Set up Realtime Subscription for New Orders
    const ordersChannel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('New order detected in Supabase:', payload.new);
          // Gently refresh without a full UI blocker
          fetchLiveData(false);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        () => fetchLiveData(false)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'orders' },
        () => fetchLiveData(false)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [navigate, fetchLiveData]);

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    const success = await VaultDB.saveProducts(updated);
    setIsSaving(false);
    if (success) {
      setEditingProduct(null);
      setProducts(updated);
    }
  };

  const handleSaveConfig = async () => {
    await VaultDB.setPaymentConfig(paymentConfig);
    alert('Payment configuration saved to Supabase!');
  };

  const handleSaveBanner = async () => {
    await VaultDB.setBanner(siteBanner);
    alert('Banner updated in Supabase!');
  };

  const processAndCompressImage = (file: File, maxWidth = 800, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } } 
        else { if (height > maxWidth) { width *= maxWidth / height; height = maxWidth; } }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          callback(canvas.toDataURL('image/jpeg', 0.7));
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-20 md:w-64 bg-[#001E3C] text-white flex flex-col shrink-0 shadow-2xl z-50">
        <div className="p-6 text-xl font-black italic uppercase tracking-tighter border-b border-white/10 flex items-center gap-2">
           <Database className="w-5 h-5 text-blue-400" />
           <span className="hidden md:block text-blue-400">bewlmz</span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'orders', icon: Users, label: 'Orders' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'payment', icon: QrCode, label: 'Payment' },
            { id: 'config', icon: Layout, label: 'Banner' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden md:block font-bold text-xs uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('adminLoggedIn'); navigate('/'); }} className="p-8 text-red-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 border-t border-white/10 hover:bg-red-500/10">
          <LogOut className="w-4 h-4"/> Logout
        </button>
      </aside>

      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        <div className="mb-8 flex justify-between items-center">
           <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
              Admin <span className="text-blue-600">Dashboard</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Sync Active
            </p>
           </div>
           <button 
             onClick={() => fetchLiveData()}
             className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"
           >
             {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
             <span>Manual Sync</span>
           </button>
        </div>

        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
             <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Fetching Data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'orders' && (
              <div className="grid gap-6 max-w-5xl">
                {orders.length === 0 ? (
                  <div className="bg-white p-20 rounded-[3rem] border border-slate-200 text-center">
                     <Users className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                     <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No customer orders yet.</p>
                  </div>
                ) : orders.map(order => (
                  <div key={order.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-6 animate-fade-in">
                    <div className="flex items-center gap-6 w-full">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                        <User className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-900 uppercase text-lg leading-none">{order.name}</p>
                          {new Date(order.created_at).getTime() > Date.now() - 3600000 && (
                            <span className="bg-blue-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">New</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-bold tracking-tight">{order.email} • <span className="text-indigo-600">₹{order.amount}</span></p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${order.status === 'verified' ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-amber-100 text-amber-600 border border-amber-200'}`}>
                            {order.status}
                          </span>
                          <span className="text-[9px] text-slate-300 font-bold uppercase">{order.date}</span>
                        </div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight truncate max-w-[200px]">{order.product}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      {order.proofImage && (
                        <button onClick={() => setViewingProof(order.proofImage)} className="flex-1 md:flex-none py-3 px-6 bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                          <Eye className="w-4 h-4" /> <span>Proof</span>
                        </button>
                      )}
                      <button 
                        onClick={() => VaultDB.updateOrder(order.id, { status: 'verified' })} 
                        className={`flex-1 md:flex-none py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${order.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-green-600 text-white shadow-lg shadow-green-600/20 active:scale-95 transition-all'}`}
                      >
                        <CheckCircle2 className="w-4 h-4" /> <span>{order.status === 'verified' ? 'Approved' : 'Verify'}</span>
                      </button>
                      <button onClick={() => { if(confirm('Delete order?')) VaultDB.deleteOrder(order.id); }} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="max-w-2xl space-y-8">
                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 space-y-8 shadow-sm">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">QR Code (Tap to Change)</label>
                    <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 flex items-center justify-center relative group">
                      {paymentConfig.qr ? <img src={paymentConfig.qr} className="w-full h-full object-contain" /> : <QrCode className="w-24 h-24 text-slate-100" strokeWidth={1} />}
                      <input type="file" accept="image/*" onChange={(e) => {
                        if(e.target.files?.[0]) processAndCompressImage(e.target.files[0], 600, (qr) => setPaymentConfig(prev => ({ ...prev, qr })));
                      }} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input value={paymentConfig.recipient} onChange={e => setPaymentConfig(prev => ({ ...prev, recipient: e.target.value }))} className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-lg outline-none" placeholder="Recipient Name" />
                    <textarea value={paymentConfig.instructions} onChange={e => setPaymentConfig(prev => ({ ...prev, instructions: e.target.value }))} rows={3} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none" placeholder="Instructions..." />
                  </div>
                  <button onClick={handleSaveConfig} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">
                    Update Payment in Supabase
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="max-w-2xl space-y-8">
                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 space-y-8 shadow-sm">
                  <div className="aspect-[12/5] bg-slate-50 rounded-[2rem] overflow-hidden border-2 border-slate-100 relative group">
                    <img src={siteBanner} className="w-full h-full object-cover" />
                    <input type="file" accept="image/*" onChange={(e) => {
                      if(e.target.files?.[0]) processAndCompressImage(e.target.files[0], 1200, setSiteBanner);
                    }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <button onClick={handleSaveBanner} className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">
                    Update Global Banner
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 space-y-4 shadow-sm group hover:border-blue-200 transition-all">
                    <div className="aspect-[2/3] bg-slate-50 rounded-2xl overflow-hidden relative">
                      <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <h3 className="font-black uppercase text-xl text-slate-900">{p.name}</h3>
                      <span className="text-blue-600 font-black">₹{p.price}</span>
                    </div>
                    <button onClick={() => setEditingProduct(p)} className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                       Edit Training Link
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-8 md:p-12 space-y-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-6">
               <div className="relative group mx-auto w-32 aspect-[2/3] bg-slate-50 rounded-[2rem] overflow-hidden border-4 border-slate-100">
                  <img src={editingProduct.image} className="w-full h-full object-cover" />
                  <input type="file" accept="image/*" onChange={(e) => {
                    if(e.target.files?.[0]) processAndCompressImage(e.target.files[0], 800, (res) => setEditingProduct({...editingProduct, image: res}));
                  }} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
               <div className="space-y-4">
                  <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-lg outline-none" />
                  <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-lg outline-none" />
                  <input value={editingProduct.downloadUrl} onChange={e => setEditingProduct({...editingProduct, downloadUrl: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs outline-none" placeholder="Video Course Link" />
               </div>
               <button onClick={handleSaveProduct} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingProof && (
        <div className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-4" onClick={() => setViewingProof(null)}>
          <img src={viewingProof} className="max-w-xl w-full max-h-[80vh] object-contain rounded-[3rem] shadow-2xl border-4 border-white/10" />
          <button onClick={() => setViewingProof(null)} className="mt-8 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Close Preview</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
