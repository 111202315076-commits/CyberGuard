import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  MessageSquareCode, 
  History, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', sub: 'Dashboard ringkasan', icon: LayoutDashboard },
    { id: 'detection', label: 'Deteksi URL', sub: 'Single & Batch URL', icon: Search },
    { id: 'document', label: 'Analisis Dokumen', sub: 'PDF & Extractor', icon: FileText },
    { id: 'rag-chat', label: 'Chat Asisten RAG', sub: 'Analisis berbasis AI', icon: MessageSquareCode },
    { id: 'history', label: 'Riwayat Analisis', sub: 'Log & Ekspor Data', icon: History },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-xl text-white font-bold shadow-lg shadow-blue-500/20">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-wide flex items-center gap-1.5">
              SiberGuard <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-sky-400 rounded border border-blue-500/30 font-mono">STKI</span>
            </h1>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Workspace RAG</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-800 to-slate-800/50 text-sky-400 border-l-4 border-blue-500 shadow-md shadow-black/20'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <Icon size={18} className={`mt-0.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.sub}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Widget (Bottom) */}
      <div className="p-3 m-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Cpu size={12} className="text-sky-400" /> Engine
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-semibold">
            ● ONLINE
          </span>
        </div>
        <div className="text-[11px] text-slate-300 font-mono flex justify-between">
          <span className="text-slate-500">ML Model:</span>
          <span>XGBoost + ReliefF</span>
        </div>
        <div className="text-[11px] text-slate-300 font-mono flex justify-between">
          <span className="text-slate-500">Vector Index:</span>
          <span className="text-sky-400">RAG Grounded</span>
        </div>
      </div>
    </aside>
  );
}