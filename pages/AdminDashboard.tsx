
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
    alert('Payment Verified! Customer can now download their products.');
  };

  const saveSiteConfig = () => {
    localStorage.setItem('vault_banner', siteBanner);
    localStorage.setItem('vault_slides', JSON.stringify(siteSlides));
    localStorage.setItem('vault_recipient_name', recipientName);
    localStorage.setItem('vault_payment_instruction', paymentInstruction);
    if (siteQrCode) {
      localStorage.setItem('vault_qr_code', siteQrCode);
    }
    alert('Site Configuration Updated!');
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
    if (!window.confirm('Are you sure you want to delete this product?')) return;
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
      setEditingProduct(prev => prev ? ({
        ...prev,
        image: base64String
      }) : null);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("Error reading file");
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
    alert('Product Saved Successfully!');
    window.dispatchEvent(new Event('storage'));
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-20 md:w-80 bg-[#001E3C] text-white flex flex-col shrink-0 border-r border-white/5">
        <div className="p-4 md:p-8 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl"><BarChart3 className="w-6 h-6" /></div>
          <span className="hidden md:block text-2xl font-[1000] uppercase italic tracking-tighter">Admin bewlmz</span>
        </div>

        <nav className="flex-grow p-2 md:p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-xl' : 'text-blue-200/50 hover:bg-white/5'}`}
          >
            <Users className="w-6 h-6" />
            <span className="hidden md:block font-black uppercase text-[12px] tracking-widest text-left">Customer Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-xl' : 'text-blue-200/50 hover:bg-white/5'}`}
          >
            <Package className="w-6 h-6" />
            <span className="hidden md:block font-black uppercase text-[12px] tracking-widest text-left">Marketplace</span>
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'config' ? 'bg-blue-600 text-white shadow-xl' : 'text-blue-200/50 hover:bg-white/5'}`}
          >
            <Layout className="w-6 h-6" />
            <span className="hidden md:block font-black uppercase text-[12px] tracking-widest text-left">Site Design</span>
          </button>
        </nav>

        <div className="p-4 md:p-8 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-6 h-6" />
            <span className="hidden md:block font-black uppercase text-[12px] tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        <header className="mb-12">
           <h1 className="text-3xl md:text-5xl font-[1000] text-slate-900 uppercase tracking-tighter">
             {activeTab === 'orders' ? 'Order Management' : activeTab === 'products' ? 'Product Control' : 'Website Settings'}
           </h1>
           <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest mt-2">Full Access Control Dashboard</p>
        </header>

        {activeTab === 'orders' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Sales</p>
                <h3 className="text-4xl md:text-6xl font-[1000] text-slate-900 tracking-tighter italic">₹{totalRevenue}</h3>
              </div>
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Proofs</p>
                <h3 className="text-4xl md:text-6xl font-[1000] text-amber-500 tracking-tighter italic">{pendingCount}</h3>
              </div>
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Customers</p>
                <h3 className="text-4xl md:text-6xl font-[1000] text-blue-600 tracking-tighter italic">{orders.length}</h3>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-0 overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Proof</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {orders.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs">No orders found in vault</td>
                       </tr>
                     ) : orders.map((order) => (
                       <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6">
                           <p className="font-black text-slate-900 uppercase text-sm">{order.name}</p>
                           <p className="text-xs text-slate-400 lowercase">{order.email}</p>
                         </td>
                         <td className="px-8 py-6">
                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{order.product}</span>
                         </td>
                         <td className="px-8 py-6 font-black text-slate-900">₹{order.amount}</td>
                         <td className="px-8 py-6">
                            <button 
                              onClick={() => setViewingProof(order.proofImage || null)}
                              disabled={!order.proofImage}
                              className={`flex items-center gap-2 font-bold text-xs uppercase hover:underline ${order.proofImage ? 'text-blue-600' : 'text-slate-300 cursor-not-allowed'}`}
                            >
                              <ExternalLink className="w-3 h-3" /> {order.proofImage ? 'View Proof' : 'No Image'}
                            </button>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              {order.status === 'pending' ? (
                                <button onClick={() => markVerified(order.id)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all shadow-md">
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                              ) : (
                                <div className="bg-green-100 text-green-600 p-2 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                              )}
                              <button onClick={() => deleteOrder(order.id)} className="bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-lg transition-all">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-8 md:p-12">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                  <h2 className="text-2xl md:text-3xl font-[1000] text-slate-900 uppercase tracking-tighter italic">Marketplace Inventory</h2>
                  <button 
                    onClick={handleAddNewProduct}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                  >
                    <Plus className="w-5 h-5" /> Add New Product
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(p => (
                    <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-6 flex flex-col gap-6 relative group overflow-hidden">
                       <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => deleteProduct(p.id)} className="bg-red-500 text-white p-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                       
                       <div className="absolute top-4 left-4 z-10">
                          {p.downloadUrl && p.downloadUrl !== '#' ? (
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1 shadow-lg">
                              <LinkIcon className="w-2 h-2" /> Link Set
                            </div>
                          ) : (
                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1 shadow-lg">
                              <AlertCircle className="w-2 h-2" /> No Link
                            </div>
                          )}
                       </div>

                       <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100">
                         <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{p.name}</h4>
                          <p className="text-indigo-600 font-bold text-lg mb-4">₹{p.price}</p>
                          <button 
                            onClick={() => setEditingProduct(p)}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          >
                            <Edit className="w-4 h-4" /> Edit Details & Image
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-4xl space-y-10">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-8 md:p-12 space-y-12">
               
               <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <ImageIcon className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Hero Banner Image</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="w-full aspect-[12/5] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group cursor-pointer">
                        <img src={siteBanner} alt="Banner Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                           {isUploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Upload className="w-10 h-10 mb-2" />}
                           <span className="text-xs font-black uppercase tracking-widest">{isUploading ? 'Processing...' : 'Click to Change Banner'}</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                     </div>
                  </div>
               </section>

               {/* Payment Page Customization */}
               <section className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <QrIcon className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Payment Page Control</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                         <UserIcon className="w-3 h-3" /> Recipient Name
                       </label>
                       <input 
                         type="text" 
                         value={recipientName}
                         onChange={(e) => setRecipientName(e.target.value)}
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                         placeholder="e.g. Ranjit Rishidev"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                         <QrIcon className="w-3 h-3" /> QR Upload
                       </label>
                       <div className="relative group h-[52px]">
                          <div className="absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center gap-3 text-indigo-600 transition-all group-hover:bg-indigo-100">
                             {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                             <span className="text-xs font-black uppercase tracking-widest">{siteQrCode ? 'Change QR Image' : 'Upload QR Image'}</span>
                          </div>
                          <input type="file" accept="image/*" onChange={handleQrUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Instructions (Hindi/English)</label>
                     <textarea 
                        value={paymentInstruction}
                        onChange={(e) => setPaymentInstruction(e.target.value)}
                        className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm h-32 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Enter instructions for the customer..."
                     />
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start bg-slate-50 p-6 rounded-3xl border border-slate-100">
                     <div className="w-40 aspect-square bg-white rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-lg shrink-0 flex items-center justify-center p-2">
                        {siteQrCode ? (
                          <img src={siteQrCode} alt="QR Preview" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
                        ) : (
                          <div className="text-center p-4">
                             <QrIcon className="w-8 h-8 text-slate-200 mx-auto mb-1" />
                             <p className="text-[6px] font-black text-slate-300 uppercase tracking-widest">Preview</p>
                          </div>
                        )}
                     </div>
                     <div className="flex-grow space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipients UI Preview</p>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                           <p className="text-sm font-black text-slate-900 mb-1">{recipientName}</p>
                           <p className="text-[10px] text-slate-400 whitespace-pre-wrap leading-tight">{paymentInstruction}</p>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <Type className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Trust Text Sliders</h3>
                  </div>
                  <div className="space-y-6">
                     {siteSlides.map((slide, idx) => (
                       <div key={idx} className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Slider {idx + 1} Text</label>
                          <textarea 
                            value={slide}
                            onChange={(e) => updateSlide(idx, e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                       </div>
                     ))}
                  </div>
               </section>

               <button 
                 onClick={saveSiteConfig}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
               >
                 <Save className="w-6 h-6" /> Update Website Config
               </button>
            </div>
          </div>
        )}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl my-8">
              <div className="bg-slate-900 p-8 flex items-center justify-between text-white">
                 <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-blue-400" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Manage Product</h3>
                 </div>
                 <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSaveProduct} className="p-10 space-y-8">
                 <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-900">
                       <Video className="w-5 h-5" />
                       <h4 className="font-black uppercase tracking-widest text-xs">Video Content URL</h4>
                    </div>
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                       <input 
                         type="text" 
                         value={editingProduct.downloadUrl || ''} 
                         onChange={e => {
                            const val = e.target.value;
                            setEditingProduct(prev => prev ? ({ ...prev, downloadUrl: val }) : null);
                         }} 
                         placeholder="Paste Drive/Mega/Video link here..."
                         className="w-full p-4 pl-12 bg-white border border-indigo-200 rounded-2xl font-bold text-indigo-600 placeholder:text-slate-300 shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                       <input 
                         type="text" 
                         value={editingProduct.name} 
                         onChange={e => {
                            const val = e.target.value;
                            setEditingProduct(prev => prev ? ({ ...prev, name: val }) : null);
                         }} 
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                         required 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price (INR)</label>
                       <input 
                         type="number" 
                         value={editingProduct.price} 
                         onChange={e => {
                            const val = Number(e.target.value);
                            setEditingProduct(prev => prev ? ({ ...prev, price: val }) : null);
                         }} 
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                         required 
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Hindi Tagline</label>
                    <input 
                      type="text" 
                      value={editingProduct.description} 
                      onChange={e => {
                        const val = e.target.value;
                        setEditingProduct(prev => prev ? ({ ...prev, description: val }) : null);
                      }} 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                      required 
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Product Image</label>
                    <div className="flex gap-4">
                       <div className="w-24 h-36 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 group relative cursor-pointer shadow-inner">
                          {editingProduct.image ? (
                             <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                             <ImageIcon className="w-8 h-8 text-slate-200" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                             {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                       </div>
                       <div className="flex-grow space-y-2">
                          <input 
                            type="text" 
                            value={editingProduct.image} 
                            onChange={e => {
                              const val = e.target.value;
                              setEditingProduct(prev => prev ? ({ ...prev, image: val }) : null);
                            }} 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-[10px] focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="Or paste direct image URL..." 
                          />
                          <p className="text-[8px] font-black text-slate-300 uppercase px-2">Tap image box to upload new file</p>
                       </div>
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95">
                    <Save className="w-6 h-6" /> Save Product Details
                 </button>
              </form>
           </div>
        </div>
      )}

      {viewingProof && (
        <div className="fixed inset-0 z-[110] bg-slate-900/95 flex items-center justify-center p-4" onClick={() => setViewingProof(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-2 animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingProof(null)} className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black uppercase tracking-widest"><X className="w-6 h-6" /> Close</button>
            <div className="overflow-auto max-h-[80vh] rounded-2xl">
              <img src={viewingProof} alt="Payment Proof" className="w-full h-auto object-contain mx-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
