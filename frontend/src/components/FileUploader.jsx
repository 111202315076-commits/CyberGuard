import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function FileUploader({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Silakan pilih file PDF atau TXT terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengekstrak dokumen.');
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
      {/* Header Card */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-sky-400 rounded-xl">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Ekstraksi & Analisis Dokumen (PDF / TXT)
          </h3>
          <p className="text-xs text-slate-400">
            Unggah file PDF atau TXT. Sistem akan mengekstrak seluruh hyperlink dan URL secara otomatis.
          </p>
        </div>
      </div>

      {/* Area Drag and Drop / Input File */}
      <label className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-700/80 hover:border-blue-500/50 rounded-xl cursor-pointer bg-[#0b0f19] hover:bg-slate-900/60 transition-all group">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="p-3 bg-slate-800 group-hover:bg-blue-600/20 group-hover:text-sky-400 text-slate-400 rounded-full mb-3 transition-colors">
            <Upload size={24} />
          </div>
          {file ? (
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400">
              <CheckCircle2 size={16} />
              <span className="truncate max-w-xs">{file.name}</span>
            </div>
          ) : (
            <>
              <p className="mb-1 text-xs text-slate-300 font-medium">
                Klik untuk mengunggah file PDF atau TXT
              </p>
              <p className="text-[11px] text-slate-500">Maksimal ukuran file 10 MB</p>
            </>
          )}
        </div>
      </label>

      {/* Error Alert */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2 text-xs text-red-400">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Tombol Action Upload */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Mengekstrak Dokumen & Memindai URL...</span>
          </>
        ) : (
          <>
            <FileText size={16} />
            <span>Mulai Analisis Dokumen</span>
          </>
        )}
      </button>
    </div>
  );
}