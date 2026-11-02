import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OverviewTab from './components/OverviewTab';
import RagChatTab from './components/RagChatTab';
import UrlInputForm from './components/UrlInputForm';
import FileUploader from './components/FileUploader';
import ResultsTable from './components/ResultsTable';
import FeatureExplanation from './components/FeatureExplanation';
import HistoryTable from './components/HistoryTable';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [results, setResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [history, setHistory] = useState([]);

  // Mengambil data riwayat dari backend
  const fetchHistory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/history');
      const data = await res.json();

      // Menangani format respons { history: [...] } maupun array langsung
      if (data && Array.isArray(data.history)) {
        setHistory(data.history);
      } else if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalysisSuccess = (data) => {
    if (data && data.results) {
      setResults(data.results);
      if (data.results.length > 0) {
        setSelectedRow(data.results[0]);
      }
      fetchHistory(); // Refresh riwayat otomatis setelah analisis berhasil
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased">
      {/* Sidebar Navigasi Workspace */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Konten Utama */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'overview' && (
          <OverviewTab setActiveTab={setActiveTab} history={history} />
        )}

        {activeTab === 'detection' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100">Deteksi Single & Batch URL</h2>
            <UrlInputForm onSuccess={handleAnalysisSuccess} />

            {results.length > 0 && (
              <>
                <ResultsTable
                  results={results}
                  selectedRow={selectedRow}
                  onSelectRow={(row) => setSelectedRow(row)}
                />
                <FeatureExplanation data={selectedRow} />
              </>
            )}
          </div>
        )}

        {activeTab === 'document' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100">Analisis Dokumen (PDF / TXT)</h2>
            <FileUploader onSuccess={handleAnalysisSuccess} />

            {results.length > 0 && (
              <>
                <ResultsTable
                  results={results}
                  selectedRow={selectedRow}
                  onSelectRow={(row) => setSelectedRow(row)}
                />
                <FeatureExplanation data={selectedRow} />
              </>
            )}
          </div>
        )}

        {activeTab === 'rag-chat' && <RagChatTab />}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100">Log Riwayat Analisis</h2>
            <HistoryTable history={history} />
          </div>
        )}
      </main>
    </div>
  );
}