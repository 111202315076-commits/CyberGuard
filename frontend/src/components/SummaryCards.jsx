import React from 'react';
import { ShieldCheck, ShieldAlert, Link, AlertTriangle } from 'lucide-react';

export default function SummaryCards({ total, phishing, legitimate }) {
  const riskRate = total > 0 ? ((phishing / total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Link size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total URL</p>
          <p className="text-2xl font-bold text-slate-800">{total || 0}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
          <ShieldAlert size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phishing</p>
          <p className="text-2xl font-bold text-red-600">{phishing || 0}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legitimate</p>
          <p className="text-2xl font-bold text-emerald-600">{legitimate || 0}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rasio Risiko</p>
          <p className="text-2xl font-bold text-amber-600">{riskRate}%</p>
        </div>
      </div>
    </div>
  );
}