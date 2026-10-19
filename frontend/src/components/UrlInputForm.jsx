import React, { useState } from 'react';
import { Search, Layers } from 'lucide-react';

export default function UrlInputForm({ onAnalyzeSingle, onAnalyzeBatch, loading }) {
  const [activeTab, setActiveTab] = useState('single');
  const [singleUrl, setSingleUrl] = useState('');
  const [batchText, setBatchText] = useState('');

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (singleUrl.trim()) {
      onAnalyzeSingle(singleUrl.trim());
    }
  };

  const handleBatchSubmit = (e) => {
    e.preventDefault();
    const urls = batchText.split('\n').filter(u => u.trim() !== '');
    if (urls.length > 0) {
      onAnalyzeBatch(urls);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <div className="flex border-b border-slate-200 mb-4">
        <button
          onClick={() => setActiveTab('single')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'single'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search size={16} />
          <span>Analisis Satu URL</span>
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'batch'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={16} />
          <span>Analisis Banyak URL</span>
        </button>
      </div>

      {activeTab === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Masukkan Alamat URL
            </label>
            <input
              type="text"
              placeholder="Contoh: https://secure-login.bank-example.com/update"
              value={singleUrl}
              onChange={(e) => setSingleUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? 'Menganalisis...' : 'Periksa Deteksi URL'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleBatchSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Masukkan Daftar URL (Satu URL Per Baris)
            </label>
            <textarea
              rows={5}
              placeholder={`https://google.com\nhttp://192.168.1.1/login\nwww.paypal-verify-account.top`}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 text-sm font-mono"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? 'Menganalisis Masal...' : 'Periksa Seluruh URL'}
          </button>
        </form>
      )}
    </div>
  );
}