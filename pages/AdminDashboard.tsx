
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import VaultDB from '../db';
import { 
  Users, 
  User,
  Package, 
  Layout, 
  LogOut, 
  X,
  QrCode,
  Upload,
  CheckCircle2,
  Trash2,
  Eye,
  Info,
  Database,
  Smartphone,
  Check
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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) { navigate('/admin-login'); return; }

    const syncDB = () => {
      setOrders(VaultDB.getOrders());
      setProducts(VaultDB.getProducts());
      setSiteBanner(VaultDB.getBanner());
      setPaymentConfig(VaultDB.getPaymentConfig());
    };

    syncDB();
    window.addEventListener('storage', syncDB);
    return () => window.removeEventListener('storage', syncDB);
  }, [navigate]);

  // Smart Image Compressor to solve "not saving" issues
  const processAndCompressImage = (file: File, maxWidth = 800, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width *= maxWidth / height;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality JPEG
          callback(compressedDataUrl);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;
    setIsSaving(true);
    
    setTimeout(() => {
      const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
      const success = VaultDB.saveProducts(updated);
      setIsSaving(false);
      if (success) {
        setEditingProduct(null);
        alert('Product updated successfully!');
      }
    }, 500);
  };

  const handleSaveConfig = () => {
    VaultDB.setPaymentConfig(paymentConfig);
    alert('Payment configuration updated!');
  };

  const handleSaveBanner = () => {
    const success = VaultDB.setBanner(siteBanner);
    if (success) alert('Banner updated!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-20 md:w-64 bg-[#001E3C] text-white flex flex-col shrink-0 shadow-2xl z-50">
        <div className="p-6 text-xl font-black italic uppercase tracking-tighter border-b border-white/10 flex items-center gap-2">
           <Database className="w-5 h-5 text-blue-400" />
           <span className="hidden md:block">VaultDB</span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'orders', icon: Users, label: 'Orders' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'payment', icon: QrCode, label: 'QR Code' },
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
        {activeTab === 'orders' && (
          <div className="space-y-8 max-w-5xl">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Order <span className="text-blue-600">Database</span></h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                <Smartphone className="w-4 h-4" />
                <span>Device: Local Storage</span>
              </div>
            </header>
            
            <div className="grid gap-6">
              {orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-slate-200 text-center space-y-4">
                   <Users className="w-16 h-16 text-slate-100 mx-auto" />
                   <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Waiting for new orders...</p>
                </div>
              ) : orders.map(order => (
                <div key={order.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-6">
                  <div className="flex items-center gap-6 w-full">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                      <User className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-slate-900 uppercase text-lg leading-none">{order.name}</p>
                      <p className="text-xs text-slate-500 font-bold tracking-tight">{order.email} • <span className="text-indigo-600">₹{order.amount}</span></p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${order.status === 'verified' ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-amber-100 text-amber-600 border border-amber-200'}`}>
                          {order.status}
                        </span>
                        <span className="text-[9px] text-slate-300 font-bold uppercase">{order.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    {order.proofImage && (
                      <button onClick={() => setViewingProof(order.proofImage)} className="flex-1 md:flex-none py-3 px-6 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Eye className="w-4 h-4" /> <span>View Proof</span>
                      </button>
                    )}
                    <button onClick={() => VaultDB.updateOrder(order.id, { status: 'verified' })} className={`flex-1 md:flex-none py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${order.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-green-600 text-white shadow-lg'}`}>
                      <CheckCircle2 className="w-4 h-4" /> <span>{order.status === 'verified' ? 'Approved' : 'Approve'}</span>
                    </button>
                    <button onClick={() => VaultDB.deleteOrder(order.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Payment <span className="text-blue-600">DB Config</span></h2>
            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 space-y-8 shadow-sm">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">QR Code Source</label>
                <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 flex items-center justify-center relative group">
                  {paymentConfig.qr ? <img src={paymentConfig.qr} className="w-full h-full object-contain" /> : <QrCode className="w-24 h-24 text-slate-100" strokeWidth={1} />}
                  <input type="file" accept="image/*" onChange={(e) => {
                    if(e.target.files?.[0]) processAndCompressImage(e.target.files[0], 600, (qr) => setPaymentConfig(prev => ({ ...prev, qr })));
                  }} className="absolute inset-0 opacity-0 cursor-pointer" title="Click to upload QR" />
                </div>
                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest italic">Images are automatically compressed for database efficiency</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <input value={paymentConfig.recipient} onChange={e => setPaymentConfig(prev => ({ ...prev, recipient: e.target.value }))} className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-lg outline-none focus:border-blue-500" placeholder="Recipient Name" />
                <textarea value={paymentConfig.instructions} onChange={e => setPaymentConfig(prev => ({ ...prev, instructions: e.target.value }))} rows={3} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm italic outline-none focus:border-blue-500" placeholder="Instructions..." />
              </div>

              <button onClick={handleSaveConfig} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
                Update Payment DB
              </button>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Banner <span className="text-blue-600">Storage</span></h2>
            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 space-y-8 shadow-sm">
              <div className="aspect-[12/5] bg-slate-50 rounded-[2rem] overflow-hidden border-2 border-slate-100 relative group">
                <img src={siteBanner} className="w-full h-full object-cover" />
                <input type="file" accept="image/*" onChange={(e) => {
                  if(e.target.files?.[0]) processAndCompressImage(e.target.files[0], 1200, setSiteBanner);
                }} className="absolute inset-0 opacity-0 cursor-pointer" title="Update Banner" />
              </div>
              <button onClick={handleSaveBanner} className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95">
                Push Update to Site
              </button>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in">
             <h2 className="text-3xl font-black uppercase tracking-tighter italic">Product <span className="text-blue-600">Vault</span></h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 space-y-4 shadow-sm group hover:border-blue-200 transition-all">
                  <div className="aspect-[2/3] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative">
                    <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-black uppercase text-xl text-slate-900">{p.name}</h3>
                    <span className="text-blue-600 font-black">₹{p.price}</span>
                  </div>
                  <button onClick={() => setEditingProduct(p)} className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                     Edit Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-8 md:p-12 space-y-8 overflow-y-auto max-h-[90vh] shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Edit <span className="text-blue-600">Product</span></h2>
              <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-6">
               <div className="relative group mx-auto w-32 md:w-40 aspect-[2/3] bg-slate-50 rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-xl">
                  <img src={editingProduct.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[8px] font-black uppercase">
                     <Upload className="w-6 h-6 mb-1" />
                     <span>Change Image</span>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => {
                    if(e.target.files?.[0]) processAndCompressImage(e.target.files[0], 800, (res) => setEditingProduct({...editingProduct, image: res}));
                  }} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
               
               <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Display Name</label>
                    <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-lg outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Price (₹)</label>
                    <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-lg outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Digital Link (Video URL)</label>
                    <input value={editingProduct.downloadUrl} onChange={e => setEditingProduct({...editingProduct, downloadUrl: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs outline-none focus:border-blue-500" placeholder="https://drive.google.com/..." />
                  </div>
               </div>

               <button 
                onClick={handleSaveProduct} 
                disabled={isSaving}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                {isSaving ? 'Saving to Database...' : <><Check className="w-5 h-5" /> Save Product</>}
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
