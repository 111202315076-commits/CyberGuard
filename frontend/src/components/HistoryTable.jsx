import React from 'react';
import { History, Download } from 'lucide-react';
import { getExportUrl } from '../services/api';

export default function HistoryTable({ history }) {
  if (!history || history.length === 0) return null;

  // Fungsi helper untuk memformat tanggal ke zona waktu lokal pengguna
  const formatDate = (dateString) => {
    if (!dateString) return '-';

    try {
      // Jika string waktu tidak memiliki akhiran 'Z' (UTC) dan tidak ada offset jam,
      // kita tambahkan 'Z' agar JavaScript membacanya sebagai UTC dan mengonversinya ke WIB (+7)
      let formattedInput = dateString;
      if (typeof dateString === 'string' && !dateString.endsWith('Z') && !dateString.includes('+')) {
        formattedInput = dateString.replace(' ', 'T') + 'Z';
      }

      const date = new Date(formattedInput);

      // Jika parsing Date gagal/invalid, kembalikan string aslinya
      if (isNaN(date.getTime())) {
        return dateString;
      }

      // Format ke tanggal & waktu lokal Indonesia (24 jam)
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (err) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center space-x-2">
        <History size={18} className="text-indigo-600" />
        <h3 className="font-semibold text-slate-800 text-sm">Riwayat Analisis Terakhir</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Waktu</th>
              <th className="py-3 px-4">Sumber</th>
              <th className="py-3 px-4">Total URL</th>
              <th className="py-3 px-4">Phishing</th>
              <th className="py-3 px-4">Legitimate</th>
              <th className="py-3 px-4 text-center">Ekspor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {history.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-xs text-slate-600 font-mono">
                  {formatDate(row.created_at)}
                </td>
                <td className="py-3 px-4 text-xs text-slate-800 font-medium">
                  {row.source_type}
                </td>
                <td className="py-3 px-4 text-xs font-semibold">
                  {row.total_urls}
                </td>
                <td className="py-3 px-4 text-xs font-semibold text-red-600">
                  {row.phishing_count}
                </td>
                <td className="py-3 px-4 text-xs font-semibold text-emerald-600">
                  {row.legitimate_count}
                </td>
                <td className="py-3 px-4 text-center">
                  <a
                    href={getExportUrl(row.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded transition-colors"
                  >
                    <Download size={14} />
                    <span>CSV</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}