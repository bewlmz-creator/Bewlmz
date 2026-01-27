
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
  AlertCircle,
  Trash2,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Upload,
  ShieldAlert,
  Smartphone
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
    // Trigger storage event for other components to update immediately
    window.dispatchEvent(new Event('storage'));
  };

  const handleVerifyOrder = (orderId: string) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: 'verified' } : o);
    setOrders(updatedOrders);
    saveToStorage('vault_orders', updatedOrders);
    alert('Order Verified!');
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure?')) {
      const updatedOrders = orders.filter(o => o.id !== orderId);
      setOrders(updatedOrders);
      saveToStorage('vault_orders', updatedOrders);
    }
  };

  const convertToDirectLink = (url: string): string => {
    if (!url) return url;
    let newUrl = url.trim();

    // Google Drive
    if (newUrl.includes('drive.google.com')) {
      const fileIdMatch = newUrl.match(/\/file\/d\/(.+?)\//) || newUrl.match(/id=(.+?)(&|$)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
    }

    // Dropbox
    if (newUrl.includes('dropbox.com')) {
      return newUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace(/\?dl=0|\?dl=1/, '');
    }

    // PostImg
    if (newUrl.includes('postimg.cc') && !newUrl.includes('i.postimg.cc')) {
      // Basic attempt to fix postimg links
      return newUrl.replace('postimg.cc', 'i.postimg.cc') + '.png';
    }

    return newUrl;
  };

  const handleProductSave = () => {
    if (!editingProduct) return;
    const finalProduct = {
      ...editingProduct,
      image: editingProduct.image.startsWith('data:') ? editingProduct.image : convertToDirectLink(editingProduct.image),
      downloadUrl: editingProduct.downloadUrl
    };
    const updated = products.map(p => p.id === finalProduct.id ? finalProduct : p);
    setProducts(updated);
    saveToStorage('vault_products', updated);
    setEditingProduct(null);
    alert('Marketplace Updated Successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({
          ...editingProduct,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteQr(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const savePaymentSettings = () => {
    const finalQr = siteQr.startsWith('data:') ? siteQr : convertToDirectLink(siteQr);
    saveToStorage('vault_qr_code', finalQr);
    saveToStorage('vault_recipient_name', recipientName);
    saveToStorage('vault_payment_instruction', instructions);
    alert('Payment Config Saved!');
  };

  const isActuallyImage = (url: string) => {
    if (!url) return false;
    if (url.startsWith('data:image')) return true;
    const lower = url.toLowerCase();
    return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || 
           lower.endsWith('.webp') || lower.includes('drive.google.com/uc') || 
           lower.includes('dl.dropboxusercontent') || lower.includes('i.postimg.cc');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-20 md:w-64 bg-[#001E3C] text-white flex flex-col shrink-0 shadow-2xl z-50">
        <div className="p-6 text-xl font-black italic uppercase tracking-tighter border-b border-white/10">Admin</div>
        <nav className="flex-grow p-4 space-y-2">
          <button onClick={() => setActiveTab('orders')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Users className="w-5 h-5" /><span className="hidden md:block text-xs font-bold">Orders</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'products' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Package className="w-5 h-5" /><span className="hidden md:block text-xs font-bold">Products</span>
          </button>
          <button onClick={() => setActiveTab('payment')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'payment' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <QrCode className="w-5 h-5" /><span className="hidden md:block text-xs font-bold">Payment</span>
          </button>
          <button onClick={() => setActiveTab('config')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'config' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Layout className="w-5 h-5" /><span className="hidden md:block text-xs font-bold">Banner</span>
          </button>
        </nav>
        <button onClick={() => { localStorage.removeItem('adminLoggedIn'); navigate('/'); }} className="p-8 text-red-400 font-bold uppercase text-xs flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
      </aside>

      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        {activeTab === 'payment' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Payment Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 flex flex-col items-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest self-start">Current QR Code</p>
                <div className="w-full aspect-square bg-slate-50 rounded-3xl border-2 border-slate-100 flex items-center justify-center overflow-hidden p-4 relative group">
                  {siteQr ? (
                    <img src={siteQr} className="w-full h-full object-contain" />
                  ) : (
                    <QrCode className="w-24 h-24 text-slate-200" />
                  )}
                </div>
                
                <div className="w-full space-y-3">
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleQrUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                       <Upload className="w-4 h-4" />
                       <span>Upload QR Image (BEST)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Recipient Name</label>
                    <input value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-xl font-black text-lg" placeholder="Recipient Name" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Or QR Image Link</label>
                    <input 
                      value={siteQr.startsWith('data:') ? '[Using Uploaded Image]' : siteQr} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val.startsWith('[Using')) return;
                        setSiteQr(val);
                      }} 
                      className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-xs" 
                      placeholder="Paste image URL here..." 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Payment Instructions</label>
                    <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={4} className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-sm italic" />
                  </div>
                </div>
                
                <button onClick={savePaymentSettings} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-transform">
                  Save Payment Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <div className="aspect-[2/3] rounded-2xl overflow-hidden border bg-slate-50 flex items-center justify-center">
                  <img src={p.image} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-black uppercase">{p.name}</h3>
                <button onClick={() => setEditingProduct(p)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs">
                   Edit Product
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-3xl space-y-8">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Banner Settings</h2>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <div className="aspect-[12/5] w-full border-4 border-slate-50 rounded-3xl overflow-hidden shadow-xl bg-slate-100">
                    <img src={siteBanner} className="w-full h-full object-cover" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="relative group">
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                         <Upload className="w-5 h-5" />
                         <span>Upload Banner (BEST)</span>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <input 
                        value={siteBanner.startsWith('data:') ? '[Using Uploaded Image]' : siteBanner} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val.startsWith('[Using')) return;
                          setSiteBanner(val);
                        }} 
                        className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-xs h-full" 
                        placeholder="Or paste banner URL..." 
                      />
                   </div>
                </div>

                <button onClick={() => { 
                  const finalBanner = siteBanner.startsWith('data:') ? siteBanner : convertToDirectLink(siteBanner);
                  saveToStorage('vault_banner', finalBanner); 
                  alert('Banner Updated!'); 
                }} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-2xl active:scale-[0.98] transition-all">
                  Apply Home Banner
                </button>
            </div>
          </div>
        )}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] p-6 md:p-12 space-y-8 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b pb-6">
              <h2 className="text-2xl font-black uppercase italic">Product Setup</h2>
              <button onClick={() => setEditingProduct(null)} className="p-3 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
               <div className="w-full lg:w-72 shrink-0 space-y-4">
                  <div className="aspect-[2/3] w-full bg-slate-100 rounded-3xl border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center relative">
                    <img src={editingProduct.image} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 group-hover:bg-indigo-700 transition-colors">
                       <Upload className="w-4 h-4" />
                       <span>Upload Image (BEST)</span>
                    </div>
                  </div>
               </div>

               <div className="flex-grow space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Photo URL (Fallback)</label>
                      <input 
                        value={editingProduct.image.startsWith('data:') ? '[Uploaded Local Image]' : editingProduct.image} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val.startsWith('[Uploaded')) return;
                          setEditingProduct({...editingProduct, image: val});
                        }} 
                        className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-xs" 
                        placeholder="Paste URL..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Video Access Link</label>
                      <input value={editingProduct.downloadUrl} onChange={e => setEditingProduct({...editingProduct, downloadUrl: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-xl font-black text-lg" placeholder="Price" />
                      <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl font-black text-lg" placeholder="Name" />
                    </div>
                  </div>
                  <button onClick={handleProductSave} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                    Update Marketplace
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
