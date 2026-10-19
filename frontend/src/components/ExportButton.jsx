import React from 'react';
import { Download } from 'lucide-react';
import { getExportUrl } from '../services/api';

export default function ExportButton({ currentBatchId, lastHistoryId }) {
  if (!lastHistoryId) return null;

  return (
    <div className="flex justify-end mb-6">
      <a
        href={getExportUrl(lastHistoryId)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        <Download size={16} />
        <span>Unduh Hasil Analisis (CSV)</span>
      </a>
    </div>
  );
}