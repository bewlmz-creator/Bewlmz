
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
  Smartphone
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

  const handleFileRead = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-20 md:w-64 bg-[#001E3C] text-white flex flex-col shrink-0 shadow-2xl z-50">
        <div className="p-6 text-xl font-black italic uppercase tracking-tighter border-b border-white/10 flex items-center gap-2">
           <Database className="w-5 h-5 text-blue-400" />
           <span className="hidden md:block">VaultDB</span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button onClick={() => setActiveTab('orders')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Users className="w-5 h-5" /><span className="hidden md:block font-bold text-xs uppercase tracking-widest">Orders</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'products' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Package className="w-5 h-5" /><span className="hidden md:block font-bold text-xs uppercase tracking-widest">Products</span>
          </button>
          <button onClick={() => setActiveTab('payment')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'payment' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <QrCode className="w-5 h-5" /><span className="hidden md:block font-bold text-xs uppercase tracking-widest">QR Code</span>
          </button>
          <button onClick={() => setActiveTab('config')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'config' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Layout className="w-5 h-5" /><span className="hidden md:block font-bold text-xs uppercase tracking-widest">Banner</span>
          </button>
        </nav>
        <button onClick={() => { localStorage.removeItem('adminLoggedIn'); navigate('/'); }} className="p-8 text-red-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 border-t border-white/10 hover:bg-red-500/10"><LogOut className="w-4 h-4"/> Logout</button>
      </aside>

      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        {activeTab === 'orders' && (
          <div className="space-y-8 max-w-5xl">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Order <span className="text-blue-600">Database</span></h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                <Smartphone className="w-4 h-4" />
                <span>Connected: Local Storage</span>
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
                    if(e.target.files?.[0]) handleFileRead(e.target.files[0], (qr) => setPaymentConfig(prev => ({ ...prev, qr })));
                  }} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <input value={paymentConfig.recipient} onChange={e => setPaymentConfig(prev => ({ ...prev, recipient: e.target.value }))} className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-lg" placeholder="Recipient Name" />
                <textarea value={paymentConfig.instructions} onChange={e => setPaymentConfig(prev => ({ ...prev, instructions: e.target.value }))} rows={3} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm italic" placeholder="Instructions..." />
              </div>

              <button onClick={() => {
                VaultDB.setPaymentConfig(paymentConfig);
                alert('Database updated: Payment Config');
              }} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                Update Config
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
                  if(e.target.files?.[0]) handleFileRead(e.target.files[0], setSiteBanner);
                }} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <button onClick={() => {
                VaultDB.setBanner(siteBanner);
                alert('Database updated: Site Banner');
              }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl">
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
                <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 space-y-4 shadow-sm group">
                  <div className="aspect-[2/3] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative">
                    <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <h3 className="font-black uppercase text-xl text-slate-900">{p.name}</h3>
                  <button onClick={() => setEditingProduct(p)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">
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
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-8 md:p-12 space-y-8 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)}><X /></button>
            </div>
            <div className="space-y-6">
               <div className="aspect-[2/3] w-32 mx-auto bg-slate-50 rounded-[2rem] overflow-hidden border-4 border-slate-100 relative group">
                  <img src={editingProduct.image} className="w-full h-full object-cover" />
                  <input type="file" accept="image/*" onChange={(e) => {
                    if(e.target.files?.[0]) handleFileRead(e.target.files[0], (res) => setEditingProduct({...editingProduct, image: res}));
                  }} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
               <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-lg" />
               <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-2xl font-black text-lg" />
               <input value={editingProduct.downloadUrl} onChange={e => setEditingProduct({...editingProduct, downloadUrl: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs" placeholder="Video Link" />
               <button onClick={() => {
                const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
                VaultDB.saveProducts(updated);
                setEditingProduct(null);
                alert('Database updated: Product');
              }} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingProof && (
        <div className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-4" onClick={() => setViewingProof(null)}>
          <img src={viewingProof} className="max-w-xl w-full max-h-[80vh] object-contain rounded-[3rem] shadow-2xl border-4 border-white/10" />
          <button onClick={() => setViewingProof(null)} className="mt-8 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs">Close</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
