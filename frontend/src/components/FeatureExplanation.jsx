import React from 'react';
import { Cpu, ShieldAlert, ShieldCheck, Activity, Key, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function FeatureExplanation({ data }) {
  if (!data) {
    return (
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800/80 p-8 text-center text-slate-400 text-xs">
        Klik pada salah satu baris tabel di atas atau tombol <span className="text-sky-400 font-semibold">Lihat Detail</span> untuk melihat rincian ekstraksi fitur URL.
      </div>
    );
  }

  const isPhishing = data.classification === 'Phishing';
  const features = data.features || {};

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
      {/* Header Status Rincian */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold uppercase tracking-wider mb-1">
            <Cpu size={16} />
            <span>Rincian Ekstraksi Fitur & Explainable IR</span>
          </div>
          <p className="text-xs font-mono text-slate-300 break-all">{data.url}</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border ${
            isPhishing 
              ? 'bg-red-500/10 text-red-400 border-red-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {isPhishing ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
            <span>{data.classification}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300">
            Skor Risiko: <span className={isPhishing ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {data.risk_score || data.confidence || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid Indikator Utama Fitur STKI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shannon Entropy Card */}
        <div className="bg-[#0b0f19] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-sky-400">Shannon Entropy</span>
            <Activity size={16} className="text-sky-400" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-100">
            {features.shannon_entropy !== undefined ? Number(features.shannon_entropy).toFixed(4) : '-'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Mengukur keacakan domain. Nilai tinggi mengindikasikan domain acak/phishing.
          </p>
        </div>

        {/* Panjang URL */}
        <div className="bg-[#0b0f19] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-300">Panjang URL</span>
            <Key size={16} className="text-slate-400" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-100">
            {features.url_length !== undefined ? features.url_length : data.url?.length || 0} <span className="text-xs font-normal text-slate-500">karakter</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            URL abnormal yang sangat panjang berpotensi menyembunyikan redirect.
          </p>
        </div>

        {/* IP Address Usage */}
        <div className="bg-[#0b0f19] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-300">Penggunaan IP</span>
            {features.use_of_ip ? <AlertTriangle size={16} className="text-red-400" /> : <CheckCircle2 size={16} className="text-emerald-400" />}
          </div>
          <div className="text-xl font-mono font-bold text-slate-100">
            {features.use_of_ip ? 'Ya (Terdeteksi IP)' : 'Tidak (Domain Resmi)'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Penggunaan IP mentah langsung tanpa domain merupakan ciri khas phishing.
          </p>
        </div>
      </div>

      {/* Alasan Risiko / Key Risk Factors */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Analisis Faktor Risiko & Indikator
        </h4>
        <div className="space-y-2">
          {data.risk_reasons && data.risk_reasons.length > 0 ? (
            data.risk_reasons.map((reason, idx) => (
              <div key={idx} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))
          ) : (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
              <span>Tidak ditemukan indikator ancaman struktural signifikan pada URL ini.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}