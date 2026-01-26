
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURED_PRODUCTS, HERO_BANNER, TEXT_SLIDES } from '../constants';
import { Product } from '../types';
import { 
  BarChart3, 
  Users, 
  Package, 
  CheckCircle2, 
  LogOut, 
  Trash2,
  Edit,
  Save,
  X,
  Layout,
  Link as LinkIcon,
  Globe,
  HelpCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [siteBanner, setSiteBanner] = useState(HERO_BANNER);
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'config'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login');
      return;
    }

    setOrders(JSON.parse(localStorage.getItem('vault_orders') || '[]'));
    setProducts(JSON.parse(localStorage.getItem('vault_products') || JSON.stringify(FEATURED_PRODUCTS)));
    setSiteBanner(localStorage.getItem('vault_banner') || HERO_BANNER);
  }, [navigate]);

  const saveToStorage = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = products.find(p => p.id === editingProduct.id) 
      ? products.map(p => p.id === editingProduct.id ? editingProduct : p)
      : [...products, editingProduct];
    
    setProducts(updated.slice(0, 2)); // Limit to 2 products
    saveToStorage('vault_products', updated.slice(0, 2));
    setEditingProduct(null);
    alert('Product Updated Globally!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-[#001E3C] text-white flex flex-col shrink-0">
        <div className="p-6 text-xl font-black italic uppercase tracking-tighter">Admin</div>
        <nav className="flex-grow p-4 space-y-2">
          <button onClick={() => setActiveTab('orders')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Users className="w-5 h-5" /><span className="hidden md:block text-xs font-bold uppercase">Orders</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'products' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Package className="w-5 h-5" /><span className="hidden md:block text-xs font-bold uppercase">Products</span>
          </button>
          <button onClick={() => setActiveTab('config')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'config' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Layout className="w-5 h-5" /><span className="hidden md:block text-xs font-bold uppercase">Site Banner</span>
          </button>
        </nav>
        <button onClick={() => { localStorage.removeItem('adminLoggedIn'); navigate('/'); }} className="p-8 text-red-400 font-bold uppercase text-xs">Logout</button>
      </aside>

      <main className="flex-grow p-8 overflow-y-auto">
        <div className="mb-10 bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl flex items-center gap-6">
           <HelpCircle className="w-12 h-12 text-blue-200 shrink-0" />
           <div>
             <h2 className="text-xl font-black uppercase">Guide: How to show images to everyone?</h2>
             <p className="opacity-80 text-sm font-medium italic">"Postimages.org" par photo upload karein aur uska **Direct Link** yahan paste karein. Isse photo har kisi ko dikhegi.</p>
           </div>
        </div>

        {activeTab === 'config' && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 space-y-8">
            <h3 className="text-2xl font-black uppercase italic">Hero Banner (1200x500)</h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paste Image Direct Link (URL)</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={siteBanner} 
                  onChange={e => setSiteBanner(e.target.value)}
                  placeholder="Paste URL here..."
                  className="w-full p-4 pl-12 bg-slate-50 border rounded-xl font-bold text-sm"
                />
              </div>
            </div>
            {siteBanner && (
              <div className="aspect-[12/5] rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                <img src={siteBanner} className="w-full h-full object-cover" alt="Preview" />
              </div>
            )}
            <button onClick={() => { saveToStorage('vault_banner', siteBanner); alert('Banner Updated Globally!'); }} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">
              Save Banner Globally
            </button>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col gap-6">
                <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-lg border-2 border-slate-50">
                  <img src={p.image} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase">{p.name}</h3>
                  <p className="text-indigo-600 font-black">₹{p.price}</p>
                  <button onClick={() => setEditingProduct(p)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                    <Edit className="w-3 h-3" /> Edit Global URL & Price
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <h2 className="text-2xl font-black uppercase mb-6">Recent Customer Proofs</h2>
            {orders.length === 0 ? <p className="text-slate-400 text-center py-10">No orders yet.</p> : (
              <div className="divide-y">
                {orders.map((o: any) => (
                  <div key={o.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg uppercase">{o.name}</p>
                      <p className="text-xs text-slate-400 font-black tracking-widest uppercase">{o.product}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <p className="font-black text-indigo-600">₹{o.amount}</p>
                       <button className="bg-green-100 text-green-700 p-2 rounded-lg"><CheckCircle2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Edit Global Details</h2>
              <button onClick={() => setEditingProduct(null)}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest">Global Product Image Link (URL)</label>
              <input value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-sm" />
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Postimages.org se copy kiya hua "Direct Link" yahan daalein.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest">Name</label>
                <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest">Price (₹)</label>
                <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold" />
              </div>
            </div>

            <button onClick={handleSaveProduct} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">
              Save For All Customers
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
