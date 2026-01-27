
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURED_PRODUCTS, HERO_BANNER } from '../constants';
import { Product } from '../types';
import { 
  Users, 
  Package, 
  Layout, 
  LogOut, 
  Edit, 
  X,
  QrCode,
  Upload,
  CheckCircle2,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [siteBanner, setSiteBanner] = useState(HERO_BANNER);
  const [siteQr, setSiteQr] = useState('');
  const [recipientName, setRecipientName] = useState('Ranjit Rishidev');
  const [instructions, setInstructions] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'config' | 'payment'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProof, setViewingProof] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) { navigate('/admin-login'); return; }

    const loadData = () => {
      setOrders(JSON.parse(localStorage.getItem('vault_orders') || '[]'));
      setProducts(JSON.parse(localStorage.getItem('vault_products') || JSON.stringify(FEATURED_PRODUCTS)));
      setSiteBanner(localStorage.getItem('vault_banner') || HERO_BANNER);
      setSiteQr(localStorage.getItem('vault_qr_code') || '');
      setRecipientName(localStorage.getItem('vault_recipient_name') || 'Ranjit Rishidev');
      setInstructions(localStorage.getItem('vault_payment_instruction') || "ये QR CODE को Scan करके पेमेंट करें। \nपेमेंट के बाद 'Proceed Payment' बटन दबाएं।");
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [navigate]);

  const saveToStorage = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    window.dispatchEvent(new Event('storage'));
  };

  const convertLink = (url: string) => {
    if (!url || url.startsWith('data:')) return url;
    let u = url.trim();
    if (u.includes('drive.google.com')) {
      const id = u.match(/\/file\/d\/(.+?)\//) || u.match(/id=(.+?)(&|$)/);
      return id ? `https://drive.google.com/uc?export=view&id=${id[1]}` : u;
    }
    if (u.includes('dropbox.com')) return u.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
    return u;
  };

  const handleVerify = (id: string) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: 'verified' } : o);
    setOrders(updated);
    saveToStorage('vault_orders', updated);
  };

  const handleDeleteOrder = (id: string) => {
    if(confirm('Delete this order?')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      saveToStorage('vault_orders', updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-20 md:w-64 bg-[#001E3C] text-white flex flex-col shrink-0">
        <div className="p-6 text-xl font-black italic uppercase tracking-tighter border-b border-white/10">Admin</div>
        <nav className="flex-grow p-4 space-y-2">
          {['orders', 'products', 'payment', 'config'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`w-full p-4 rounded-xl flex items-center gap-3 capitalize font-bold text-xs ${activeTab === tab ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
              {tab === 'orders' && <Users className="w-5 h-5" />}
              {tab === 'products' && <Package className="w-5 h-5" />}
              {tab === 'payment' && <QrCode className="w-5 h-5" />}
              {tab === 'config' && <Layout className="w-5 h-5" />}
              <span className="hidden md:block">{tab}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('adminLoggedIn'); navigate('/'); }} className="p-8 text-red-400 font-bold uppercase text-xs flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
      </aside>

      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Customer Orders</h2>
            <div className="grid gap-4">
              {orders.length === 0 ? <p className="text-slate-400 font-bold">No orders yet.</p> : orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <p className="font-black text-slate-900 uppercase">{order.name}</p>
                    <p className="text-xs text-slate-500 font-bold">{order.email} • ₹{order.amount}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${order.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {order.proofImage && (
                      <button onClick={() => setViewingProof(order.proofImage)} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200">
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    <button onClick={() => handleVerify(order.id)} className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteOrder(order.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Payment Configuration</h2>
            <div className="bg-white p-8 rounded-3xl border space-y-6">
              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border flex items-center justify-center mb-4">
                {siteQr ? <img src={siteQr} className="w-full h-full object-contain" /> : <QrCode className="w-20 h-20 text-slate-200" />}
              </div>
              <input type="file" onChange={(e) => {
                const reader = new FileReader();
                reader.onload = () => setSiteQr(reader.result as string);
                if(e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
              }} className="text-xs font-bold" />
              <input value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full p-4 border rounded-xl font-bold" placeholder="Recipient Name" />
              <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full p-4 border rounded-xl font-bold" placeholder="Instructions" />
              <button onClick={() => {
                saveToStorage('vault_qr_code', siteQr);
                saveToStorage('vault_recipient_name', recipientName);
                saveToStorage('vault_payment_instruction', instructions);
                alert('Saved!');
              }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase">Save Settings</button>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Site Banner</h2>
            <div className="bg-white p-8 rounded-3xl border space-y-6">
              <div className="aspect-[12/5] bg-slate-50 rounded-2xl overflow-hidden border">
                <img src={siteBanner} className="w-full h-full object-cover" />
              </div>
              <input type="file" onChange={(e) => {
                const reader = new FileReader();
                reader.onload = () => setSiteBanner(reader.result as string);
                if(e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
              }} className="text-xs font-bold" />
              <button onClick={() => {
                saveToStorage('vault_banner', siteBanner);
                alert('Banner Updated!');
              }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase">Apply Banner</button>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border space-y-4">
                <div className="aspect-[2/3] bg-slate-100 rounded-2xl overflow-hidden">
                  <img src={p.image} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-black uppercase">{p.name}</h3>
                <button onClick={() => setEditingProduct(p)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase">Edit</button>
              </div>
            ))}
          </div>
        )}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-black uppercase">Edit Product</h2>
              <button onClick={() => setEditingProduct(null)}><X /></button>
            </div>
            <div className="aspect-[2/3] w-32 mx-auto rounded-xl overflow-hidden border">
              <img src={editingProduct.image} className="w-full h-full object-cover" />
            </div>
            <input type="file" onChange={(e) => {
              const reader = new FileReader();
              reader.onload = () => setEditingProduct({...editingProduct, image: reader.result as string});
              if(e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
            }} className="text-[10px]" />
            <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 border rounded-xl font-bold" />
            <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 border rounded-xl font-bold" />
            <input value={editingProduct.downloadUrl} onChange={e => setEditingProduct({...editingProduct, downloadUrl: e.target.value})} className="w-full p-4 border rounded-xl text-xs" placeholder="Video Link" />
            <button onClick={() => {
              const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
              setProducts(updated);
              saveToStorage('vault_products', updated);
              setEditingProduct(null);
            }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase">Save Product</button>
          </div>
        </div>
      )}

      {viewingProof && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setViewingProof(null)}>
          <img src={viewingProof} className="max-w-full max-h-full rounded-2xl" />
          <button className="absolute top-8 right-8 text-white"><X className="w-10 h-10" /></button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
