import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

import UrlInputForm from './components/UrlInputForm.jsx';
import FileUploader from './components/FileUploader.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import ResultsTable from './components/ResultsTable.jsx';
import FeatureExplanation from './components/FeatureExplanation.jsx';
import HistoryTable from './components/HistoryTable.jsx';
import ExportButton from './components/ExportButton.jsx';

import { analyzeSingleUrl, analyzeMultipleUrls, analyzeFile, getHistory } from './services/api.js';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedUrlResult, setSelectedUrlResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastHistoryId, setLastHistoryId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchHistoryData = async () => {
    try {
      const data = await getHistory();
      setHistory(data.history || []);
      if (data.history && data.history.length > 0) {
        setLastHistoryId(data.history[0].id);
      }
    } catch (err) {
      console.error('Gagal mengambil riwayat:', err);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleSingleAnalyze = async (url) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await analyzeSingleUrl(url);
      setAnalysisData(data);
      if (data.results && data.results.length > 0) {
        setSelectedUrlResult(data.results[0]);
      }
      await fetchHistoryData();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Gagal menganalisis URL');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchAnalyze = async (urls) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await analyzeMultipleUrls(urls);
      setAnalysisData(data);
      if (data.results && data.results.length > 0) {
        setSelectedUrlResult(data.results[0]);
      }
      await fetchHistoryData();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Gagal menganalisis daftar URL');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await analyzeFile(file);
      setAnalysisData(data);
      if (data.results && data.results.length > 0) {
        setSelectedUrlResult(data.results[0]);
      }
      await fetchHistoryData();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Gagal memproses file dokumen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield size={14} />
            <span>Cyber Guard STKI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight mb-2">
            Hindari Penipuan Online: Cek URL Anda di Sini
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto font-normal italic">
                Sistem Inteligensi Deteksi Phishing Real-Time
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Input Forms Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <UrlInputForm
              onAnalyzeSingle={handleSingleAnalyze}
              onAnalyzeBatch={handleBatchAnalyze}
              loading={loading}
            />
          </div>
          <div>
            <FileUploader onFileUpload={handleFileUpload} loading={loading} />
          </div>
        </div>

        {/* Results Section */}
        {analysisData && (
          <>
            <SummaryCards
              total={analysisData.total_urls}
              phishing={analysisData.phishing_count}
              legitimate={analysisData.legitimate_count}
            />

            <ExportButton lastHistoryId={lastHistoryId} />

            <ResultsTable
                results={analysisData.results}
                onSelectRow={(row) => setSelectedUrlResult(row)}
                selectedUrl={selectedUrlResult}
            />

            <FeatureExplanation selectedResult={selectedUrlResult} />
          </>
        )}

        {/* History Table */}
        <HistoryTable history={history} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <p>©2026 STKI CyberSecurity Research.</p>
      </footer>
    </div>
  );
}