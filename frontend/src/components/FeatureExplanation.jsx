import React, { useEffect, useState } from 'react';
import { Info, AlertTriangle } from 'lucide-react';

export default function FeatureExplanation({ selectedResult }) {
  const [isHighlighting, setIsHighlighting] = useState(false);

  useEffect(() => {
    if (selectedResult) {
      // Pemicu efek visual "flash lampu"
      setIsHighlighting(true);
      
      // Matikan efek setelah 2.5 detik agar meredup perlahan
      const timer = setTimeout(() => {
        setIsHighlighting(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [selectedResult]);

  if (!selectedResult) {
    return (
      <div 
        id="feature-explanation-section"
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6 text-center text-slate-500 text-sm"
      >
        Klik pada salah satu baris tabel di atas untuk melihat rincian ekstraksi fitur URL.
      </div>
    );
  }

  const { url, classification, reasons = [], features = {} } = selectedResult;
  const isPhishing = classification === 'Phishing';

  return (
    <div
      id="feature-explanation-section"
      // KUNCI EFEK: Transisi instan saat masuk, lambat saat keluar (ease-out)
      className={`bg-white rounded-xl border p-6 shadow-sm mb-6 transition-all duration-1000 ease-out ${
        isHighlighting
          ? '!bg-indigo-50 !border-indigo-500 !ring-8 !ring-indigo-300/40 !shadow-indigo-100 shadow-xl' 
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-center space-x-2 mb-4 border-b border-slate-200 pb-3">
        <div className={`p-1.5 rounded-lg transition-colors duration-1000 ease-out ${isHighlighting ? 'bg-indigo-200 animate-pulse' : 'bg-indigo-100'}`}>
           <Info size={18} className="text-indigo-700" />
        </div>
        <h3 className="font-semibold text-slate-800 text-sm">Penjelasan Fitur & Alasan Risiko</h3>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-1">URL Terpilih:</p>
        <p className="text-xs font-mono bg-slate-100 p-2.5 rounded text-slate-800 break-all border border-slate-200 font-medium">
          {url}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
          <AlertTriangle size={14} className="text-amber-500" />
          <span>Indikator Penilaian Risiko:</span>
        </h4>
        <ul className="space-y-1.5 pl-2">
          {reasons.length > 0 ? (
            reasons.map((reason, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))
          ) : (
            <li className="text-xs text-slate-700 flex items-start space-x-2">
               <span className="text-emerald-600 font-bold">•</span>
               <span>Struktur URL tampak normal dan standar.</span>
            </li>
          )}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Nilai Ekstraksi Fitur Struktural URL:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Panjang URL:</span>
            <span className="font-bold text-slate-800 text-sm">{features.url_length ?? '-'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Jumlah Subdomain:</span>
            <span className="font-bold text-slate-800 text-sm">{features.num_subdomains ?? '-'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Entropy URL:</span>
            <span className="font-bold text-slate-800 text-sm">{features.url_entropy ?? '-'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Protokol HTTPS:</span>
            <span className="font-bold text-slate-800 text-sm">{features.has_https === 1 ? 'Ya' : 'Tidak'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}