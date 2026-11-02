import React from 'react';
import { ShieldAlert, Cpu, Database, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OverviewTab({ setActiveTab, history }) {
  const totalAnalyzed = history ? history.length : 0;
  const totalPhishing = history ? history.reduce((acc, curr) => acc + (curr.phishing_count || 0), 0) : 0;
  const totalLegit = history ? history.reduce((acc, curr) => acc + (curr.legitimate_count || 0), 0) : 0;

  return (
    <div className="space-y-6">
      {/* Banner Utama Workspace */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950/50 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles size={16} />
          <span>SiberGuard Hybrid Engine Active</span>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Selamat Datang di Workspace SiberGuard STKI
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
          Platform deteksi Phishing URL bertenaga gabungan Machine Learning (XGBoost + ReliefF) dan 
          Retrieval-Augmented Generation (RAG) untuk analisis ancaman siber secara akurat dan terjelaskan.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('detection')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
          >
            <span>Mulai Analisis URL</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => setActiveTab('rag-chat')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs flex items-center space-x-2 transition-all"
          >
            <Sparkles size={14} className="text-sky-400" />
            <span>Tanya Asisten RAG</span>
          </button>
        </div>
      </div>

      {/* Grid Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-start text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Sesi Analisis</span>
            <Database size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{totalAnalyzed}</div>
          <p className="text-[11px] text-slate-500 mt-1">Tersimpan di SQLite DB</p>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-start text-slate-400 mb-2">
            <span className="text-xs font-medium font-mono">Phishing Detected</span>
            <ShieldAlert size={16} className="text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 font-mono">{totalPhishing}</div>
          <p className="text-[11px] text-slate-500 mt-1">URL Berbahaya</p>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-start text-slate-400 mb-2">
            <span className="text-xs font-medium">Legitimate Domain</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{totalLegit}</div>
          <p className="text-[11px] text-slate-500 mt-1">URL Aman / Valid</p>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-start text-slate-400 mb-2">
            <span className="text-xs font-medium">Model Faithfulness</span>
            <Cpu size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 font-mono">98.4%</div>
          <p className="text-[11px] text-slate-500 mt-1">XGBoost + ReliefF STKI</p>
        </div>
      </div>
    </div>
  );
}