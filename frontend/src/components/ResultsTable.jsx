import React from 'react';
import { AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

export default function ResultsTable({ results, onSelectRow, selectedUrl }) {
  if (!results || results.length === 0) return null;

  const handleRowClick = (row) => {
    if (onSelectRow) {
      onSelectRow(row);
    }
    
    // Smooth scroll ke komponen FeatureExplanation
    setTimeout(() => {
      const explanationElement = document.getElementById('feature-explanation-section');
      if (explanationElement) {
        explanationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Hasil Deteksi Phishing</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Klik pada baris tabel untuk melihat rincian ekstraksi fitur URL</p>
        </div>
        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
          {results.length} URL
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Alamat URL</th>
              <th className="py-3 px-4">Klasifikasi</th>
              <th className="py-3 px-4">Skor Risiko</th>
              <th className="py-3 px-4">Probabilitas</th>
              <th className="py-3 px-4 text-center">Rincian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {results.map((row, idx) => {
              const isPhishing = row.classification === 'Phishing';
              const isSelected = selectedUrl?.url === row.url;

              return (
                <tr
                  key={idx}
                  onClick={() => handleRowClick(row)}
                  className={`cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-indigo-50/90 font-medium border-l-4 border-l-indigo-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3.5 px-4 max-w-xs font-mono text-xs text-slate-800 truncate" title={row.url}>
                    {row.url}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isPhishing
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isPhishing ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                      <span>{row.classification}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    <span className={isPhishing ? 'text-red-600' : 'text-emerald-600'}>
                      {row.risk_score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                    {(row.phishing_probability * 100).toFixed(2)}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <ChevronRight size={16} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}