import React, { useState } from 'react';
import { Search, Layers, AlertCircle, Loader2 } from 'lucide-react';

export default function UrlInputForm({ onSuccess }) {
  const [activeTab, setActiveTab] = useState('single'); // 'single' atau 'batch'
  const [singleUrl, setSingleUrl] = useState('');
  const [batchUrls, setBatchUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = activeTab === 'single' ? '/api/analyze-url' : '/api/analyze-urls';
      const payload = activeTab === 'single' 
        ? { url: singleUrl } 
        : { urls: batchUrls.split('\n').filter(u => u.trim() !== '') };

      if (activeTab === 'single' && !singleUrl.trim()) {
        throw new Error('Masukkan alamat URL terlebih dahulu.');
      }

      if (activeTab === 'batch' && !batchUrls.trim()) {
        throw new Error('Masukkan minimal satu baris URL.');
      }

      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses URL.');
      }

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-slate-800/80 p-6 shadow-xl">
      {/* Switcher Tab Single / Batch */}
      <div className="flex space-x-2 border-b border-slate-800 pb-4 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('single')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'single'
              ? 'bg-blue-600/20 text-sky-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Search size={16} />
          <span>Analisis Satu URL</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('batch')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'batch'
              ? 'bg-blue-600/20 text-sky-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers size={16} />
          <span>Analisis Banyak URL</span>
        </button>
      </div>

      {/* Form Submit */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'single' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Masukkan Alamat URL
            </label>
            <input
              type="text"
              value={singleUrl}
              onChange={(e) => setSingleUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Masukkan Daftar URL (Satu URL per Baris)
            </label>
            <textarea
              rows={5}
              value={batchUrls}
              onChange={(e) => setBatchUrls(e.target.value)}
              placeholder={"https://example1.com\nhttps://example2.com"}
              className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2 text-xs text-red-400">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Memproses Deteksi...</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Periksa Deteksi URL</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}