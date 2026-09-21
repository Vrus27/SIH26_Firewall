import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getEvents } from '../core/eventLog.js';

export default function PrivacyReport({ isProtected, detections, telemetry, activeTab }) {
  const events = getEvents();

  // Calculations for summary tallies
  const passwordCount = detections.filter(d => d.type === 'PASSWORD').length;
  const emailCount = detections.filter(d => d.type === 'EMAIL').length;
  const phoneCount = detections.filter(d => d.type === 'PHONE').length;
  const nameCount = detections.filter(d => d.type === 'NAME').length;
  const secretCount = detections.filter(d => d.type === 'API_KEY' || d.type === 'SECRET_TOKEN').length;

  const crossTabBlockedEvents = events.filter(e => e.type === 'CROSS_TAB_REQUEST_BLOCKED');
  const crossTabBlockedCount = crossTabBlockedEvents.length;

  // Sample aggregated session totals
  const totalAiRequests = 17;
  const allowedRequests = 6;
  const sanitizedRequests = 8;
  const blockedRequests = 3;

  return (
    <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-6 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Detailed Privacy Report & Audit Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Chronological audit of sensitive data detections, sanitized wire payloads, and cross-tab isolation barriers.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-slate-500">Active Scope:</span>
          <span className="text-emerald-400 font-bold">Tab #{activeTab.id}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Protection: {isProtected ? 'ON 🟢' : 'OFF ⚪'}
          </span>
        </div>
      </div>

      {/* Aggregate Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
        <div className="bg-[#0a0e17] border border-slate-800 p-3 rounded text-center">
          <span className="text-slate-500 block text-[10px]">AI Requests</span>
          <span className="text-lg font-bold text-white">{totalAiRequests}</span>
        </div>
        <div className="bg-[#0a0e17] border border-slate-800 p-3 rounded text-center">
          <span className="text-slate-500 block text-[10px]">Allowed</span>
          <span className="text-lg font-bold text-blue-400">{allowedRequests}</span>
        </div>
        <div className="bg-[#0a0e17] border border-slate-800 p-3 rounded text-center">
          <span className="text-slate-500 block text-[10px]">Sanitized</span>
          <span className="text-lg font-bold text-emerald-400">{sanitizedRequests}</span>
        </div>
        <div className="bg-[#0a0e17] border border-slate-800 p-3 rounded text-center">
          <span className="text-slate-500 block text-[10px]">Blocked Secrets</span>
          <span className="text-lg font-bold text-red-400">{blockedRequests}</span>
        </div>
        <div className="bg-[#0a0e17] border border-red-900/40 p-3 rounded text-center col-span-2 sm:col-span-1">
          <span className="text-red-400 block text-[10px]">Cross-Tab Blocked</span>
          <span className="text-lg font-bold text-red-400">{crossTabBlockedCount}</span>
        </div>
      </div>

      {/* Detected Elements Breakdown */}
      <div className="bg-[#0a0e17] border border-slate-800 rounded p-4 space-y-2 font-mono text-xs">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <span className="font-bold text-white">Sensitive Elements Detected on Active Tab:</span>
          <span className="text-slate-400">{detections.length} Items</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
          <div className="p-2 bg-[#111622] rounded flex items-center justify-between">
            <span className="text-slate-400">Passwords:</span>
            <span className="text-red-400 font-bold">{passwordCount}</span>
          </div>
          <div className="p-2 bg-[#111622] rounded flex items-center justify-between">
            <span className="text-slate-400">Emails:</span>
            <span className="text-orange-400 font-bold">{emailCount}</span>
          </div>
          <div className="p-2 bg-[#111622] rounded flex items-center justify-between">
            <span className="text-slate-400">Phones:</span>
            <span className="text-orange-400 font-bold">{phoneCount}</span>
          </div>
          <div className="p-2 bg-[#111622] rounded flex items-center justify-between">
            <span className="text-slate-400">Names:</span>
            <span className="text-amber-400 font-bold">{nameCount}</span>
          </div>
          <div className="p-2 bg-[#111622] rounded flex items-center justify-between">
            <span className="text-slate-400">API Secrets:</span>
            <span className="text-red-400 font-bold">{secretCount}</span>
          </div>
        </div>
      </div>

      {/* Detailed Chronological Event Ledger (Requirement 7) */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white">Audit Event Ledger (Recent Background Events):</span>
          <span className="text-slate-500 text-[10px]">Zero Raw Credentials Stored</span>
        </div>

        <div className="space-y-3">
          {/* Render current detections as structured event items */}
          {detections.map(det => (
            <div key={det.id} className="bg-[#0a0e17] border border-slate-800 rounded p-3.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-mono">10:42 AM</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300 font-semibold">{activeTab.origin}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-400">Tab #{activeTab.id}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold ${
                    det.sensitivityLevel === 'CRITICAL' ? 'bg-red-950 text-red-300 border-red-800' :
                    det.sensitivityLevel === 'HIGH' ? 'bg-orange-950 text-orange-300 border-orange-800' :
                    'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {det.sensitivityLevel}
                  </span>
                  <span className="text-slate-400 text-[10px]">Confidence: {(det.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Detected:</span> <strong className="text-white">{det.type}</strong> ({det.element})
                  <div className="text-slate-400 mt-0.5">Reason: {det.reasons[0]}</div>
                </div>
                <div>
                  <span className="text-slate-500">Action:</span> <strong className={det.action === 'BLOCK' ? 'text-red-400' : 'text-orange-400'}>{det.action}</strong>
                  <div className="text-slate-400 mt-0.5">
                    Remote AI: {det.action === 'BLOCK' ? 'Did not receive secret.' : `Received sanitized token ${det.sanitizedValue}`}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Cross-tab block audit item */}
          {crossTabBlockedCount > 0 && (
            <div className="bg-[#0a0e17] border border-red-900/60 rounded p-3.5 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-red-900/40 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">10:21 AM</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-red-400 font-bold">CROSS-TAB CONTEXT ACCESS BLOCKED</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                  CRITICAL
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                AI agent attempted context exfiltration for <strong>Tab #14 (vault.bank.local)</strong> while scoped to Tab #12.
                <div className="text-red-400 mt-0.5 font-bold">Reason: CROSS-TAB CONTEXT ACCESS NOT AUTHORIZED</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
