import React from 'react';
import { 
  Shield, ShieldOff, Settings, FileText, ChevronRight, 
  Lock, AlertTriangle, Play, Zap
} from 'lucide-react';

export default function FirewallExtension({ 
  isProtected, 
  setIsProtected, 
  activeTab, 
  detections, 
  privacyMode, 
  setPrivacyMode, 
  onOpenSettings, 
  onTriggerAiTask, 
  onTestCrossTabAccess,
  isAiRunning,
  onClose
}) {
  // Dynamic counts from actual detector output
  const detectedCount = detections.length;
  const blockedCount = detections.filter(d => d.action === 'BLOCK').length;
  const redactedCount = detections.filter(d => d.action === 'REDACT').length;

  return (
    <div className="w-72 bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">AI Privacy Firewall</span>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white text-xs cursor-pointer">✕</button>
        </div>
        <div className="text-indigo-200 text-[11px] mt-0.5 truncate">
          {activeTab.title.split('—')[0].trim()} — {activeTab.origin}
        </div>
      </div>

      {/* Protection Toggle */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isProtected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium text-gray-800">Protection</span>
          </div>
          <button
            onClick={() => setIsProtected(!isProtected)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
              isProtected ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              isProtected ? 'left-[22px]' : 'left-0.5'
            }`} />
          </button>
        </div>
        {!isProtected && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 rounded px-2 py-1">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>Firewall disabled. Sensitive data may be exposed to remote AI.</span>
          </div>
        )}
      </div>

      {/* Dynamic Detection Summary */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="text-[11px] text-gray-500 mb-2">Locally Detected</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded p-1.5">
            <div className="text-base font-semibold text-gray-800">{detectedCount}</div>
            <div className="text-[10px] text-gray-500">Detected</div>
          </div>
          <div className="bg-red-50 rounded p-1.5">
            <div className="text-base font-semibold text-red-600">{blockedCount}</div>
            <div className="text-[10px] text-red-500">Blocked</div>
          </div>
          <div className="bg-amber-50 rounded p-1.5">
            <div className="text-base font-semibold text-amber-600">{redactedCount}</div>
            <div className="text-[10px] text-amber-500">Sanitized</div>
          </div>
        </div>

        {/* Per-detection breakdown */}
        {detections.length > 0 && (
          <div className="mt-2 space-y-1">
            {detections.map(det => (
              <div key={det.id} className="flex items-center justify-between text-[11px] py-0.5">
                <span className="text-gray-600">{det.type}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  det.action === 'BLOCK' ? 'bg-red-100 text-red-600' : 
                  det.action === 'REDACT' ? 'bg-amber-100 text-amber-600' : 
                  'bg-gray-100 text-gray-500'
                }`}>
                  {det.action === 'BLOCK' ? 'Blocked' : det.action === 'REDACT' ? 'Sanitized' : det.action}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Task Actions */}
      <div className="px-4 py-3 border-b border-gray-100 space-y-2">
        <div className="text-[11px] text-gray-500 mb-1">AI Agent Tasks</div>
        <button 
          onClick={() => onTriggerAiTask("Find the Login button and log me in.")}
          disabled={isAiRunning}
          className="w-full py-2 px-3 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          {isAiRunning ? (
            <><Zap className="w-3.5 h-3.5 animate-pulse" /> Processing...</>
          ) : (
            <><Play className="w-3.5 h-3.5" /> Ask AI to log me in</>
          )}
        </button>
        <button 
          onClick={() => onTriggerAiTask("Download the report.")}
          disabled={isAiRunning}
          className="w-full py-2 px-3 bg-white text-gray-700 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" /> Download Report
        </button>
      </div>

      {/* Navigation Links */}
      <div className="px-4 py-2">
        <button 
          onClick={onOpenSettings}
          className="w-full py-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1 cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          Open Security Dashboard
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
