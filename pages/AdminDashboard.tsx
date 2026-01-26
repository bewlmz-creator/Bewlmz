
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
  ExternalLink,
  Settings,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  Plus,
  Upload,
  Layout,
  Type,
  Link as LinkIcon,
  Video,
  AlertCircle,
  QrCode as QrIcon,
  Loader2,
  User as UserIcon
} from 'lucide-react';

interface Order {
  id: string;
  name: string;
  email: string;
  product: string;
  amount: number;
  date: string;
  status: 'pending' | 'verified';
  proofImage?: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [siteBanner, setSiteBanner] = useState(HERO_BANNER);
  const [siteQrCode, setSiteQrCode] = useState<string | null>(null);
  const [siteSlides, setSiteSlides] = useState<string[]>(TEXT_SLIDES);
  const [recipientName, setRecipientName] = useState('Ranjit Rishidev');
  const [paymentInstruction, setPaymentInstruction] = useState('ये QR CODE को Scan करके पेमेंट करें। \nपेमेंट के बाद \'Proceed Payment\' बटन दबाएं।');
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'config'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProof, setViewingProof] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login');
      return;
    }

    const savedOrders = JSON.parse(localStorage.getItem('vault_orders') || '[]');
    setOrders(savedOrders);

    const savedProducts = JSON.parse(localStorage.getItem('vault_products') || JSON.stringify(FEATURED_PRODUCTS));
    setProducts(savedProducts);

    const savedBanner = localStorage.getItem('vault_banner') || HERO_BANNER;
    setSiteBanner(savedBanner);

    const savedQr = localStorage.getItem('vault_qr_code');
    setSiteQrCode(savedQr);

    const savedSlides = JSON.parse(localStorage.getItem('vault_slides') || JSON.stringify(TEXT_SLIDES));
    setSiteSlides(savedSlides);

    const savedRecipient = localStorage.getItem('vault_recipient_name');
    if (savedRecipient) setRecipientName(savedRecipient);

    const savedInstruction = localStorage.getItem('vault_payment_instruction');
    if (savedInstruction) setPaymentInstruction(savedInstruction);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  const deleteOrder = (id: string) => {
    if (!window.confirm('Delete this order?')) return;
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    localStorage.setItem('vault_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const markVerified = (id: string) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: 'verified' as const } : o);
    setOrders(updated);
    localStorage.setItem('vault_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    alert('Payment Verified!');
  };

  const saveSiteConfig = () => {
    localStorage.setItem('vault_banner', siteBanner);
    localStorage.setItem('vault_slides', JSON.stringify(siteSlides));
    localStorage.setItem('vault_recipient_name', recipientName);
    localStorage.setItem('vault_payment_instruction', paymentInstruction);
    if (siteQrCode) {
      localStorage.setItem('vault_qr_code', siteQrCode);
    }
    alert('Site Configuration Updated Successfully!');
    window.dispatchEvent(new Event('storage'));
  };

  const updateSlide = (index: number, value: string) => {
    const newSlides = [...siteSlides];
    newSlides[index] = value;
    setSiteSlides(newSlides);
  };

  const handleAddNewProduct = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: 'New Product',
      price: 499,
      description: 'इस Idea से आपकी जिंदगी बदल जाएगी..!!',
      longDescription: 'Full product details here...',
      features: ['Total Episode : 5', "No of Idea's : 1"],
      image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800&h=1200',
      category: 'course',
      downloadUrl: ''
    };
    setEditingProduct(newProd);
  };

  const deleteProduct = (id: string) => {
    if (!window.confirm('Delete product?')) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('vault_products', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEditingProduct(prev => prev ? ({ ...prev, image: base64String }) : null);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSiteBanner(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSiteQrCode(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updated;
    const exists = products.find(p => p.id === editingProduct.id);
    if (exists) {
      updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    } else {
      updated = [...products, editingProduct];
    }
    
    setProducts(updated);
    localStorage.setItem('vault_products', JSON.stringify(updated));
    setEditingProduct(null);
    alert('Product Saved!');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Same as before */}
      <aside className="w-20 md:w-80 bg-[#001E3C] text-white flex flex-col shrink-0 border-r border-white/5">
        <div className="p-4 md:p-8 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl"><BarChart3 className="w-6 h-6" /></div>
          <span className="hidden md:block text-2xl font-[1000] uppercase italic tracking-tighter">Admin bewlmz</span>
        </div>
        <nav className="flex-grow p-2 md:p-6 space-y-2">
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Users className="w-6 h-6" /><span className="hidden md:block font-black uppercase text-[12px]">Orders</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'products' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Package className="w-6 h-6" /><span className="hidden md:block font-black uppercase text-[12px]">Products</span>
          </button>
          <button onClick={() => setActiveTab('config')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'config' ? 'bg-blue-600' : 'hover:bg-white/5'}`}>
            <Layout className="w-6 h-6" /><span className="hidden md:block font-black uppercase text-[12px]">Site Config</span>
          </button>
        </nav>
        <div className="p-4 md:p-8">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-6 h-6" /><span className="hidden md:block font-black uppercase text-[12px]">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        <header className="mb-12">
           <h1 className="text-3xl md:text-5xl font-[1000] text-slate-900 uppercase tracking-tighter">{activeTab.toUpperCase()}</h1>
        </header>

        {activeTab === 'orders' && (
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-8">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50">
                   <th className="p-6 text-[10px] font-black uppercase tracking-widest">Customer</th>
                   <th className="p-6 text-[10px] font-black uppercase tracking-widest">Amount</th>
                   <th className="p-6 text-[10px] font-black uppercase tracking-widest">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {orders.map(order => (
                   <tr key={order.id} className="border-t border-slate-100">
                     <td className="p-6"><p className="font-bold">{order.name}</p><p className="text-xs text-slate-400">{order.email}</p></td>
                     <td className="p-6 font-bold">₹{order.amount}</td>
                     <td className="p-6 flex gap-2">
                       <button onClick={() => setViewingProof(order.proofImage || null)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><ImageIcon className="w-4 h-4" /></button>
                       <button onClick={() => deleteOrder(order.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                       {order.status === 'pending' && <button onClick={() => markVerified(order.id)} className="p-2 text-green-600 bg-green-50 rounded-lg"><CheckCircle2 className="w-4 h-4" /></button>}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            <button onClick={handleAddNewProduct} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex gap-6">
                  <img src={p.image} className="w-24 h-36 object-cover rounded-xl" />
                  <div className="flex-grow">
                    <h3 className="text-xl font-black">{p.name}</h3>
                    <p className="text-indigo-600 font-bold">₹{p.price}</p>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => setEditingProduct(p)} className="p-3 bg-slate-100 rounded-xl"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-3 bg-red-50 text-red-500 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-3xl space-y-12">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                <h3 className="text-2xl font-black uppercase italic">Hero Banner (1200x500)</h3>
                <div className="aspect-[12/5] rounded-2xl overflow-hidden bg-slate-100 relative group">
                   <img src={siteBanner} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                      <Upload className="w-10 h-10" />
                      <input type="file" onChange={handleBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                   </div>
                </div>
                
                <div className="space-y-4">
                   <h3 className="text-2xl font-black uppercase italic">Payment Details</h3>
                   <input value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="Recipient Name" />
                   <textarea value={paymentInstruction} onChange={e => setPaymentInstruction(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-xl h-24" placeholder="Instructions" />
                   <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 border rounded-xl flex items-center justify-center relative overflow-hidden">
                        {siteQrCode ? <img src={siteQrCode} className="w-full h-full object-contain" /> : <QrIcon />}
                        <input type="file" onChange={handleQrUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Upload UPI QR Code</p>
                   </div>
                </div>

                <button onClick={saveSiteConfig} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                  <Save className="w-6 h-6" /> Save All Config
                </button>
             </div>
          </div>
        )}
      </main>

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 space-y-6">
              <h2 className="text-2xl font-black uppercase">Edit Product</h2>
              <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="Name" />
              <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="Price" />
              <input value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="Hindi Tagline" />
              <div className="flex gap-4 items-center">
                 <div className="w-16 h-24 bg-slate-50 border rounded-xl relative overflow-hidden">
                    <img src={editingProduct.image} className="w-full h-full object-cover" />
                    <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
                 <p className="text-xs font-bold uppercase text-slate-400">Tap to upload Image</p>
              </div>
              <button onClick={handleSaveProduct} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase">Save Product</button>
              <button onClick={() => setEditingProduct(null)} className="w-full text-slate-400 font-bold uppercase text-xs">Cancel</button>
           </div>
        </div>
      )}

      {/* Proof Viewing Modal */}
      {viewingProof && (
        <div className="fixed inset-0 z-[110] bg-slate-900/95 flex items-center justify-center p-4" onClick={() => setViewingProof(null)}>
           <img src={viewingProof} className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
