import React from 'react';
import { Download, History, ShieldAlert, ShieldCheck, Database, Calendar } from 'lucide-react';

export default function HistoryTable({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800/80 p-12 text-center shadow-xl">
        <div className="inline-flex p-4 bg-blue-500/10 border border-blue-500/20 text-sky-400 rounded-2xl mb-4">
          <History size={32} />
        </div>
        <h3 className="text-base font-semibold text-slate-200">Belum Ada Riwayat Analisis</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Coba lakukan analisis URL atau unggah dokumen terlebih dahulu pada menu Deteksi URL atau Parser Dokumen.
        </p>
      </div>
    );
  }

  const handleDownloadCsv = (id) => {
    window.open(`http://127.0.0.1:5000/api/export/${id}`, '_blank');
  };

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
      {/* Header Tabel */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-sky-400 rounded-xl">
            <Database size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Log Sesi Analisis Tersimpan</h3>
            <p className="text-[11px] text-slate-400">Database SQLite SiberGuard Workspace</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-500/10 text-sky-400 border border-blue-500/20 text-xs font-mono font-semibold rounded-lg">
          {history.length} Sesi
        </span>
      </div>

      {/* Tabel Data Riwayat */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0b0f19] text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">ID / Batch</th>
              <th className="py-3.5 px-4">Sumber Tipe</th>
              <th className="py-3.5 px-4">Total URL</th>
              <th className="py-3.5 px-4">Phishing</th>
              <th className="py-3.5 px-4">Legitimate</th>
              <th className="py-3.5 px-4">Waktu Sesi</th>
              <th className="py-3.5 px-4 text-center">Ekspor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {history.map((item, index) => {
              const analysisId = item.id || item.batch_id;
              return (
                <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                  {/* ID / Batch */}
                  <td className="py-3.5 px-4 font-mono text-sky-400 font-semibold">
                    #{analysisId}
                  </td>

                  {/* Sumber Tipe */}
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    {item.source_type || item.type || 'Single / Batch URL'}
                  </td>

                  {/* Total URL */}
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {item.total_urls || 1} URL
                  </td>

                  {/* Phishing Count */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md font-mono text-[11px]">
                      <ShieldAlert size={12} />
                      <span>{item.phishing_count || 0}</span>
                    </span>
                  </td>

                  {/* Legitimate Count */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-mono text-[11px]">
                      <ShieldCheck size={12} />
                      <span>{item.legitimate_count || 0}</span>
                    </span>
                  </td>

                  {/* Waktu Sesi */}
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{item.created_at || item.timestamp || 'Baru Saja'}</span>
                    </div>
                  </td>

                  {/* Tombol Download CSV */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDownloadCsv(analysisId)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
                    >
                      <Download size={13} />
                      <span>Unduh CSV</span>
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