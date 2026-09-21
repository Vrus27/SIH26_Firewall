import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Settings, 
  FileText, 
  Send, 
  ArrowRightCircle, 
  Lock, 
  KeyRound, 
  Check, 
  AlertTriangle,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

export default function FirewallExtension({ 
  isProtected, 
  setIsProtected, 
  activeTab, 
  detections, 
  privacyMode, 
  setPrivacyMode, 
  onOpenReport, 
  onOpenSettings, 
  onOpenOutboundGate, 
  onOpenComparison, 
  onTriggerAiTask, 
  onTestCrossTabAccess,
  isAiRunning 
}) {
  const detectedCount = detections.length;
  const blockedCount = detections.filter(d => d.action === 'BLOCK').length;
  const redactedCount = detections.filter(d => d.action === 'REDACT').length;
  const allowedCount = detections.filter(d => d.action === 'ALLOW').length;

  return (
    <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-4 shadow-md flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              🛡️ AI PRIVACY FIREWALL
            </span>
          </div>

          {/* Quick Toggle Switch */}
          <button
            onClick={() => setIsProtected(!isProtected)}
            className={`px-2 py-0.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
              isProtected ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {isProtected ? 'ON 🟢' : 'OFF ⚪'}
          </button>
        </div>

        {/* Tab Context Scope */}
        <div className="mt-3 p-2 rounded bg-[#070a12] border border-slate-800 text-xs font-mono space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Scoped Tab:</span>
            <span className="text-emerald-400 font-bold">Tab #{activeTab.id}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Origin:</span>
            <span className="text-slate-200 truncate max-w-[170px]">{activeTab.origin}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Isolation:</span>
            <span className="text-blue-400">Strict Tab Scope</span>
          </div>
        </div>

        {/* Privacy Mode Selector */}
        <div className="mt-3">
          <label className="text-[11px] font-mono text-slate-400 block mb-1">Privacy Mode:</label>
          <div className="grid grid-cols-3 gap-1 text-xs font-mono">
            {['BALANCED', 'STRICT', 'CUSTOM'].map(mode => (
              <button
                key={mode}
                onClick={() => setPrivacyMode(mode)}
                className={`py-1 rounded border text-[11px] cursor-pointer transition-colors ${
                  privacyMode === mode 
                    ? 'bg-slate-800 text-emerald-300 border-emerald-500 font-semibold' 
                    : 'bg-[#070a12] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tally Cards */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 text-center font-mono">
          <div className="bg-[#070a12] p-1.5 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Detected</span>
            <span className="text-sm font-bold text-white">{detectedCount}</span>
          </div>
          <div className="bg-[#070a12] p-1.5 rounded border border-red-900/40">
            <span className="text-[10px] text-red-400 block">Blocked</span>
            <span className="text-sm font-bold text-red-400">{isProtected ? blockedCount : 0}</span>
          </div>
          <div className="bg-[#070a12] p-1.5 rounded border border-orange-900/40">
            <span className="text-[10px] text-orange-400 block">Redacted</span>
            <span className="text-sm font-bold text-orange-400">{isProtected ? redactedCount : 0}</span>
          </div>
        </div>

        {/* Detected Items Compact List */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Classified Items:</span>
            <span>Policy Action</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
            {detections.map(det => (
              <div key={det.id} className="p-1.5 bg-[#070a12] border border-slate-800 rounded flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 truncate max-w-[130px]">{det.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  det.action === 'BLOCK' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-orange-950 text-orange-300 border border-orange-800'
                }`}>
                  {isProtected ? det.action : 'LEAKED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-800 space-y-1.5 font-mono text-xs">
        {/* Outbound AI agent trigger */}
        <button
          onClick={() => onTriggerAiTask("Find the Login button and log me in.")}
          disabled={isAiRunning}
          className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
        >
          <ArrowRightCircle className="w-3.5 h-3.5" />
          <span>{isAiRunning ? 'Agent Processing...' : 'Simulate Outbound AI Request'}</span>
        </button>

        {/* Cross-Tab Attack Test Trigger (Requirement 5) */}
        <button
          onClick={onTestCrossTabAccess}
          className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded flex items-center justify-center space-x-1.5 cursor-pointer"
          title="Simulate AI requesting Tab 14 data to verify cross-tab blocking"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Test Cross-Tab Access (Tab #14)</span>
        </button>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-1 pt-1">
          <button
            onClick={onOpenReport}
            className="py-1 px-2 rounded bg-[#070a12] hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] text-center"
          >
            Privacy Report →
          </button>
          <button
            onClick={onOpenSettings}
            className="py-1 px-2 rounded bg-[#070a12] hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] text-center"
          >
            Settings & Policies →
          </button>
        </div>
      </div>
    </div>
  );
}
