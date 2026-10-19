import React, { useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

export default function FileUploader({ onFileUpload, loading }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center space-x-2">
        <FileText size={18} className="text-indigo-600" />
        <span>Ekstraksi & Analisis Dokumen (PDF / TXT)</span>
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Unggah file PDF atau TXT. Sistem akan mengekstrak seluruh hyperlink dan URL secara otomatis.
      </p>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 transition-colors rounded-xl p-6 text-center cursor-pointer"
      >
        <UploadCloud size={32} className="mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-medium text-slate-700">Klik untuk mengunggah file PDF atau TXT</p>
        <p className="text-xs text-slate-400 mt-1">Maksimal ukuran file 10 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
      </div>
    </div>
  );
}