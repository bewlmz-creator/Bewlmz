
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated credentials as per user request
    if (username === 'admin' && password === 'DDhj12@$') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin-dashboard');
    } else {
      setError('Invalid Vault Credentials');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-[#001E3C] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5 relative overflow-hidden group">
          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-all duration-700"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-white/5 border border-white/10 rounded-2xl shadow-inner mb-2">
                <ShieldCheck className="w-10 h-10 text-blue-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-[1000] text-white tracking-tighter uppercase italic">
                bewlmz <span className="text-blue-400">Access</span>
              </h1>
              <p className="text-blue-200/40 text-[10px] font-black uppercase tracking-[0.3em]">Administrator Authentication</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest px-1">Identity</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Admin Username"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold placeholder:text-blue-200/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest px-1">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold placeholder:text-blue-200/20"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-[10px] font-black uppercase text-center tracking-widest animate-pulse">{error}</p>
              )}

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-95 group/btn"
              >
                <span>Authorize Access</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="pt-6 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-[8px] font-black text-blue-200/20 uppercase tracking-[0.4em]">Official bewlmz Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
