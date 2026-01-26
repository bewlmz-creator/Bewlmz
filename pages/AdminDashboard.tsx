
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
  Globe,
  CheckCircle2,
  Video,
  QrCode,
  User,
  Info,
  Link as LinkIcon,
  Eye,
  Maximize2,
  AlertCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [siteBanner, setSiteBanner] = useState(HERO_BANNER);
  
  // Payment States
  const [siteQr, setSiteQr] = useState('');
  const [recipientName, setRecipientName] = useState('Ranjit Rishidev');
  const [instructions, setInstructions] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'config' | 'payment'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProof, setViewingProof] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) { navigate('/admin-login'); return; }

    const savedOrders = JSON.parse(localStorage.getItem('vault_orders') || '[]');
    setOrders(savedOrders);
    
    const savedProducts = JSON.parse(localStorage.getItem('vault_products') || JSON.stringify(FEATURED_PRODUCTS));
    setProducts(savedProducts);
    
    setSiteBanner(localStorage.getItem('vault_banner') || HERO_BANNER);
    
    // Load Payment Config
    setSiteQr(localStorage.getItem('vault_qr_code') || '');
    setRecipientName(localStorage.getItem('vault_recipient_name') || 'Ranjit Rishidev');
    setInstructions(localStorage.getItem('vault_payment_instruction') || "ये QR CODE को Scan करके पेमेंट करें। \nपेमेंट के बाद 'Proceed Payment' बटन दबाएं।");
  }, [navigate]);

  const saveToStorage = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    window.dispatchEvent(new Event('storage'));
  };

  const handleVerifyOrder = (orderId: string) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: 'verified' } : o);
    setOrders(updatedOrders);
    saveToStorage('vault_orders', updatedOrders);
    alert('Order Verified! Customer can now download.');
  };

  const handleProductSave = () => {
    if (!editingProduct) return;
    const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    setProducts(updated);
    saveToStorage('vault_products', updated);
    setEditingProduct(null);
    alert('Product Updated!');
  };

  const savePaymentSettings = () => {
    saveToStorage('vault_qr_code', siteQr);
    saveToStorage('vault_recipient_name', recipientName);
    saveToStorage('vault_payment_instruction', instructions);
    alert('Payment Settings Updated Globally!');
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
          <button onClick={() => setActiveTab('payment')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'payment' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <QrCode className="w-5 h-5" /><span className="hidden md:block text-xs font-bold uppercase">QR & Payment</span>
          </button>
          <button onClick={() => setActiveTab('config')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'config' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Layout className="w-5 h-5" /><span className="hidden md:block text-xs font-bold uppercase">Banner</span>
          </button>
        </nav>
        <button onClick={() => { localStorage.removeItem('adminLoggedIn'); navigate('/'); }} className="p-8 text-red-400 font-bold uppercase text-xs flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
      </aside>

      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        {/* Payment Settings Tab */}
        {activeTab === 'payment' && (
          <div className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Payment Configuration</h2>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Recipient Name
                  </label>
                  <input 
                    value={recipientName} 
                    onChange={e => setRecipientName(e.target.value)}
                    className="w-full p-4 bg-slate-50 border rounded-xl font-bold"
                    placeholder="e.g. Ranjit Rishidev"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <LinkIcon className="w-3 h-3" /> QR Code Direct Link (URL)
                  </label>
                  <input 
                    value={siteQr} 
                    onChange={e => setSiteQr(e.target.value)}
                    className="w-full p-4 bg-slate-50 border rounded-xl font-bold"
                    placeholder="https://postimages.org/direct-link..."
                  />
                  <p className="text-[9px] text-blue-600 font-bold italic">* Postimages se "Direct Link" copy karke yahan paste karein.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3" /> Payment Instructions
                  </label>
                  <textarea 
                    value={instructions} 
                    onChange={e => setInstructions(e.target.value)}
                    rows={3}
                    className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-sm"
                    placeholder="Enter instructions for customer..."
                  />
                </div>
              </div>

              {siteQr && (
                <div className="mt-6 p-4 border rounded-2xl bg-slate-50 flex flex-col items-center">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4">Preview QR Code</p>
                  <img src={siteQr} className="w-48 h-48 object-contain bg-white p-2 rounded-xl shadow-inner" alt="QR Preview" />
                </div>
              )}

              <button 
                onClick={savePaymentSettings}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Save Payment Settings Globally
              </button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic">Customer Orders</h2>
            {orders.length === 0 ? <p className="text-slate-400 py-10">No orders yet.</p> : (
              <div className="grid gap-6">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-black text-xl md:text-2xl uppercase tracking-tighter text-slate-900">{o.name}</p>
                        {o.status === 'verified' && <span className="text-[8px] font-black uppercase tracking-widest bg-green-100 text-green-600 px-2 py-1 rounded">Verified ✓</span>}
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{o.email}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <span className="text-indigo-600 font-[1000] text-xl">₹{o.amount}</span>
                        <span className="text-[10px] font-black uppercase text-slate-300 bg-slate-50 px-2 py-1 rounded border border-slate-100">{o.product}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      {/* Payment Proof Thumbnail */}
                      {o.proofImage ? (
                        <button 
                          onClick={() => setViewingProof(o.proofImage)}
                          className="group relative w-20 h-28 md:w-24 md:h-36 bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-indigo-500 transition-all shrink-0"
                        >
                          <img src={o.proofImage} alt="Proof" className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Maximize2 className="w-6 h-6 text-white" />
                          </div>
                        </button>
                      ) : (
                        <div className="w-20 h-28 md:w-24 md:h-36 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                          <AlertCircle className="w-6 h-6 mb-1" />
                          <span className="text-[8px] font-black uppercase tracking-widest">No Proof</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 flex-grow md:flex-grow-0">
                        {o.status === 'pending' ? (
                          <button 
                            onClick={() => handleVerifyOrder(o.id)} 
                            className="w-full md:w-48 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Verify Payment
                          </button>
                        ) : (
                          <div className="w-full md:w-48 text-center py-4 rounded-xl bg-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest border border-slate-200">
                            Already Verified
                          </div>
                        )}
                        {o.proofImage && (
                          <button 
                            onClick={() => setViewingProof(o.proofImage)}
                            className="text-[10px] font-black uppercase text-indigo-600 flex items-center justify-center gap-1 hover:underline"
                          >
                            <Eye className="w-3 h-3" /> Check Screenshot
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <div className="aspect-[2/3] rounded-2xl overflow-hidden border">
                  <img src={p.image} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase">{p.name}</h3>
                  <p className="text-slate-400 text-xs font-bold truncate">Link: {p.downloadUrl || 'Not set'}</p>
                  <button onClick={() => setEditingProduct(p)} className="mt-4 w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" /> Edit Video Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Banner Config */}
        {activeTab === 'config' && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 space-y-6 max-w-2xl">
            <h2 className="text-2xl font-black uppercase italic">Site Banner</h2>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-xs text-blue-800 font-bold">
              <Globe className="w-5 h-5 shrink-0" />
              Postimages.org ka "Direct Link" yahan daalein.
            </div>
            <input value={siteBanner} onChange={e => setSiteBanner(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-xl font-bold" placeholder="Paste Banner URL..." />
            <button onClick={() => { saveToStorage('vault_banner', siteBanner); alert('Banner Saved!'); }} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Save Banner</button>
          </div>
        )}
      </main>

      {/* Proof Viewer Modal */}
      {viewingProof && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
           <button 
             onClick={() => setViewingProof(null)}
             className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors z-[210]"
           >
             <X className="w-8 h-8" />
           </button>
           <div className="relative w-full max-w-4xl max-h-full flex items-center justify-center overflow-hidden">
             <img 
               src={viewingProof} 
               alt="Full Payment Proof" 
               className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border-4 border-white/10"
             />
           </div>
           <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-black uppercase tracking-widest">Tap anywhere outside or close button to exit</p>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Setup Product</h2>
              <button onClick={() => setEditingProduct(null)}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Video Link</label>
                <div className="relative">
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    value={editingProduct.downloadUrl} 
                    onChange={e => setEditingProduct({...editingProduct, downloadUrl: e.target.value})} 
                    className="w-full p-4 pl-12 bg-slate-50 border rounded-xl font-bold text-sm" 
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Image URL</label>
                <input value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (₹)</label>
                  <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Name</label>
                  <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold" />
                </div>
              </div>
            </div>

            <button onClick={handleProductSave} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">
              Update Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
