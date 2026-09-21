import React, { useState } from 'react';
import { 
  Lock, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  FileText, 
  KeyRound, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Plus, 
  X,
  ExternalLink,
  ShieldCheck,
  Info
} from 'lucide-react';

export default function SimulatedBrowser({ 
  isProtected, 
  activeTab, 
  allTabs, 
  onSelectTab, 
  pageData, 
  setPageData, 
  detections, 
  showHighlights, 
  lastActionExecution, 
  onSimulateUserAction 
}) {
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [inspectingItem, setInspectingItem] = useState(null);

  const isExecutingLogin = lastActionExecution && 
    (lastActionExecution.command?.target === 'Login' || lastActionExecution.command?.action === 'FILL_AND_LOGIN');

  // Find detection record helper
  const getDet = (type) => detections.find(d => d.type === type);

  const nameDet = getDet('NAME');
  const emailDet = getDet('EMAIL');
  const phoneDet = getDet('PHONE');
  const passDet = getDet('PASSWORD');
  const keyDet = getDet('API_KEY');

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] rounded-xl border border-slate-800 shadow-lg overflow-hidden">
      {/* 1. Real Multi-Tab Browser Header */}
      <div className="bg-[#111622] border-b border-slate-800 flex items-center px-2 pt-2 gap-1 select-none overflow-x-auto">
        {allTabs.map(tab => {
          const isActive = tab.id === activeTab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-t-lg text-xs font-mono transition-colors border-t border-x cursor-pointer ${
                isActive 
                  ? 'bg-[#0a0e17] text-white border-slate-700 font-semibold shadow-sm' 
                  : 'bg-[#151b2a] text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${tab.isProtected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span className="truncate max-w-[130px]">
                Tab #{tab.id}: {tab.origin}
              </span>
            </button>
          );
        })}

        <div className="text-slate-600 px-2 text-xs font-mono">
          [Browser Tabs Isolated Context]
        </div>
      </div>

      {/* 2. URL & Navigation Bar */}
      <div className="bg-[#0f1420] border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-500">
          <ArrowLeft className="w-3.5 h-3.5 cursor-pointer hover:text-slate-300" />
          <ArrowRight className="w-3.5 h-3.5 cursor-pointer hover:text-slate-300" />
          <RotateCw className="w-3.5 h-3.5 cursor-pointer hover:text-slate-300" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl flex items-center bg-[#070a12] border border-slate-700 rounded px-3 py-1 text-xs">
          <Lock className="w-3 h-3 text-emerald-400 mr-2 shrink-0" />
          <span className="text-emerald-400 font-mono">https://</span>
          <span className="text-slate-200 font-mono font-semibold">{activeTab.origin}</span>
          <span className="text-slate-500 font-mono">/user/profile</span>
          <span className="ml-auto text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 rounded">
            Tab #{activeTab.id}
          </span>
        </div>

        {/* Protection Status Indicator (Requirement 4 & 14) */}
        <div className="flex items-center">
          <div className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 border ${
            isProtected 
              ? 'bg-emerald-950 text-emerald-300 border-emerald-600' 
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isProtected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span>{isProtected ? '🟢 AI PRIVACY PROTECTED' : '⚪ PRIVACY FIREWALL OFF'}</span>
          </div>
        </div>
      </div>

      {/* 3. Rendered Webpage Body */}
      <div className={`flex-1 p-5 overflow-y-auto ${
        isProtected ? 'border-2 border-emerald-600/70' : 'border-2 border-dashed border-slate-700'
      }`}>

        {/* Action feedback message */}
        {lastActionExecution && (
          <div className="mb-4 p-2.5 rounded bg-blue-950/70 border border-blue-600/50 text-blue-200 text-xs flex items-center justify-between font-mono">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{lastActionExecution.feedback}</span>
            </div>
            <span className="text-[10px] text-blue-400">{lastActionExecution.executedAt?.slice(11, 19)}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="max-w-2xl mx-auto bg-[#0d121d] border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                AI PRIVACY FIREWALL TEST PAGE
              </h2>
              <p className="text-xs text-slate-400">
                Active Context: <strong>Tab #{activeTab.id} ({activeTab.origin})</strong> • Synthetic test profile
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Form #operator-profile
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Field: Name */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Name:</label>
                {showHighlights && nameDet && (
                  <button 
                    onClick={() => setInspectingItem(nameDet)}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 hover:bg-amber-900 cursor-pointer"
                  >
                    MEDIUM (92%) → {nameDet.action} ℹ️
                  </button>
                )}
              </div>
              <input
                id="user-fullname"
                type="text"
                value={pageData.name}
                onChange={(e) => setPageData({ ...pageData, name: e.target.value })}
                className="w-full bg-[#070a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* Field: Email */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Email:</label>
                {showHighlights && emailDet && (
                  <button 
                    onClick={() => setInspectingItem(emailDet)}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-700 hover:bg-orange-900 cursor-pointer"
                  >
                    HIGH (98%) → {emailDet.action} ℹ️
                  </button>
                )}
              </div>
              <input
                id="user-email"
                type="email"
                value={pageData.email}
                onChange={(e) => setPageData({ ...pageData, email: e.target.value })}
                className="w-full bg-[#070a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* Field: Phone */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Phone:</label>
                {showHighlights && phoneDet && (
                  <button 
                    onClick={() => setInspectingItem(phoneDet)}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-700 hover:bg-orange-900 cursor-pointer"
                  >
                    HIGH (96%) → {phoneDet.action} ℹ️
                  </button>
                )}
              </div>
              <input
                id="user-phone"
                type="tel"
                value={pageData.phone}
                onChange={(e) => setPageData({ ...pageData, phone: e.target.value })}
                className="w-full bg-[#070a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* Field: Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-red-400" />
                  Password:
                </label>
                {showHighlights && passDet && (
                  <button 
                    onClick={() => setInspectingItem(passDet)}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 font-bold hover:bg-red-900 cursor-pointer"
                  >
                    CRITICAL (99%) → BLOCK ℹ️
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="user-password"
                  type={showPasswordText ? "text" : "password"}
                  value={pageData.password}
                  onChange={(e) => setPageData({ ...pageData, password: e.target.value })}
                  className="w-full bg-[#070a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono pr-8 focus:outline-none focus:border-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                >
                  {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Field: API Key */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-red-400" />
                  API Key:
                </label>
                {showHighlights && keyDet && (
                  <button 
                    onClick={() => setInspectingItem(keyDet)}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 font-bold hover:bg-red-900 cursor-pointer"
                  >
                    CRITICAL (99%) → BLOCK ℹ️
                  </button>
                )}
              </div>
              <input
                id="user-api-key"
                type="text"
                value={pageData.apiKey}
                onChange={(e) => setPageData({ ...pageData, apiKey: e.target.value })}
                className="w-full bg-[#070a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-slate-500"
              />
            </div>

            {/* Submit / Action Button */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500 font-mono">
                <span>Action Target</span>
                <span className="text-slate-400">LOW (0%) → ALLOW</span>
              </div>
              <button
                id="btn-login"
                onClick={() => onSimulateUserAction('Login')}
                className={`w-full py-2 rounded text-xs font-bold text-white transition-all cursor-pointer ${
                  isExecutingLogin 
                    ? 'bg-emerald-600 ring-2 ring-emerald-400' 
                    : 'bg-emerald-700 hover:bg-emerald-600'
                }`}
              >
                [ Login ]
              </button>
            </div>
          </div>

          {/* Normal Non-Sensitive Content */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-semibold text-slate-300">Welcome to the dashboard.</h3>
              <span className="text-[10px] font-mono text-slate-500">Non-Sensitive Controls</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Standard telemetry reports and operational triggers available to autonomous browser agents.
            </p>

            <div className="flex items-center space-x-2">
              <button
                id="btn-view-report"
                onClick={() => onSimulateUserAction('View Report')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <FileText className="w-3 h-3 text-blue-400" />
                <span>[ View Report ]</span>
              </button>

              <button
                id="btn-download-report"
                onClick={() => onSimulateUserAction('Download Report')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3 h-3 text-purple-400" />
                <span>[ Download Report ]</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-mono text-slate-500 text-center mt-4">
          All data rendered above is synthetic demo context. Zero real credentials are used.
        </p>
      </div>

      {/* Reason Inspector Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-slate-700 rounded-lg p-4 max-w-md w-full shadow-2xl text-xs space-y-3 font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                Classification Reasoning: {inspectingItem.label}
              </span>
              <button onClick={() => setInspectingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Sensitivity Level:</span>
                <span className="font-bold text-amber-300">{inspectingItem.sensitivityLevel}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Confidence Score:</span>
                <span className="text-emerald-400 font-bold">{(inspectingItem.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Enforcement Action:</span>
                <span className="font-bold text-red-400">{inspectingItem.action}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1 font-semibold">Classification Signals & Reasons:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                {inspectingItem.reasons.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setInspectingItem(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
