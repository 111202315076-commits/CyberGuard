import React from 'react';
import { ShieldAlert, ShieldCheck, ChevronRight, Info } from 'lucide-react';

export default function ResultsTable({ results, selectedRow, onSelectRow }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
      {/* Header Tabel */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            Hasil Deteksi Phishing
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Klik pada baris atau tombol rincian untuk melihat breakdown ekstraksi fitur URL
          </p>
        </div>
        <span className="px-2.5 py-1 bg-blue-500/10 text-sky-400 border border-blue-500/20 text-xs font-mono font-semibold rounded-lg">
          {results.length} URL
        </span>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Alamat URL</th>
              <th className="py-3 px-4">Klasifikasi</th>
              <th className="py-3 px-4">Skor Risiko</th>
              <th className="py-3 px-4">Probabilitas</th>
              <th className="py-3 px-4 text-center">Rincian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {results.map((row, index) => {
              const isPhishing = row.classification === 'Phishing';
              const isSelected = selectedRow && selectedRow.url === row.url;

              return (
                <tr
                  key={index}
                  onClick={() => onSelectRow(row)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600/15 border-l-4 border-blue-500'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  {/* URL */}
                  <td className="py-3.5 px-4 font-mono text-slate-200 max-w-xs truncate" title={row.url}>
                    {row.url}
                  </td>

                  {/* Klasifikasi */}
                  <td className="py-3.5 px-4">
                    {isPhishing ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg font-semibold text-[11px]">
                        <ShieldAlert size={14} />
                        <span>Phishing</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-semibold text-[11px]">
                        <ShieldCheck size={14} />
                        <span>Legitimate</span>
                      </span>
                    )}
                  </td>

                  {/* Skor Risiko */}
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={isPhishing ? 'text-red-400' : 'text-emerald-400'}>
                      {row.risk_score || row.confidence || '0'}%
                    </span>
                  </td>

                  {/* Probabilitas */}
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {row.probability ? `${(row.probability * 100).toFixed(2)}%` : '-'}
                  </td>

                  {/* Tombol Rincian */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRow(row);
                      }}
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700'
                      }`}
                    >
                      <span>Lihat Detail</span>
                      <ChevronRight size={14} />
                    </button>
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