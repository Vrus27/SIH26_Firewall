import React, { useState } from 'react';
import { 
  Send, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  Lock, 
  X, 
  CheckCircle2, 
  AlertOctagon,
  RefreshCw,
  Eye,
  Server,
  Layers,
  AlertTriangle
} from 'lucide-react';

export default function OutboundGateModal({ 
  isOpen, 
  onClose, 
  isProtected, 
  activeTab,
  sanitizedPayload, 
  onTriggerAiTask, 
  aiResult, 
  isAiRunning 
}) {
  const [targetGoal, setTargetGoal] = useState("Find the Login button and log me in.");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#0f1422] border border-slate-700 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#0a0e17] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Outbound Privacy Gate & Network Inspector
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Scoped: Tab #{activeTab.id} ({activeTab.origin})
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
          {/* Pipeline Banner */}
          <div className="bg-[#0a0e17] p-3 rounded border border-slate-800">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1.5">
              Outbound Inspection Pipeline:
            </span>
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-800">1. AI Requests Context</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">2. Verify Tab Scope</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">3. Sanitize Secrets</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">4. Transmit Wire Safe</span>
            </div>
          </div>

          {/* Goal Input & Trigger */}
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="flex-1 w-full">
              <label className="text-[11px] text-slate-400 block mb-1">
                Autonomous Browser Agent Task (Current Tab #{activeTab.id}):
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g., Find the Login button and log me in."
                className="w-full bg-[#070a12] border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-500"
              />
            </div>
            <button
              onClick={() => onTriggerAiTask(targetGoal)}
              disabled={isAiRunning}
              className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              {isAiRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isAiRunning ? 'Dispatching...' : 'Transmit Payload'}</span>
            </button>
          </div>

          {/* Cross-Tab Simulation Trigger */}
          <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-300 text-[11px]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Demonstrate Multi-Tab Isolation: Test AI requesting Tab #14 (Bank) while scoped to Tab #{activeTab.id}.</span>
            </div>
            <button
              onClick={() => onTriggerAiTask("Summarize financial credentials from Tab 14", { requestedTabId: 14 })}
              disabled={isAiRunning}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-[11px] shrink-0 cursor-pointer"
            >
              Test Cross-Tab Exfiltration
            </button>
          </div>

          {/* Payload and VLM Response Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outbound Payload Inspector */}
            <div className="bg-[#0a0e17] rounded border border-slate-800 flex flex-col h-72 overflow-hidden">
              <div className="bg-[#111622] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  Wire Payload (Scoped to Tab #{activeTab.id})
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {isProtected ? 'Zero Raw Secrets' : 'LEAKAGE WARNING'}
                </span>
              </div>
              <div className="p-3 overflow-y-auto text-[11px] text-slate-300 flex-1">
                <pre className="text-emerald-400 whitespace-pre-wrap">
                  {JSON.stringify(sanitizedPayload, null, 2)}
                </pre>
              </div>
            </div>

            {/* Remote Mock VLM Response Inspector */}
            <div className="bg-[#0a0e17] rounded border border-slate-800 flex flex-col h-72 overflow-hidden">
              <div className="bg-[#111622] px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-purple-400" />
                  Remote AI / VLM Decision Log
                </span>
                <span className="text-[10px] text-purple-400">Mock VLM</span>
              </div>
              
              <div className="p-3 overflow-y-auto text-xs flex-1 space-y-2.5">
                {aiResult ? (
                  <>
                    <div className={`p-2.5 rounded border ${
                      aiResult.status === 'SAFE_EXECUTION' 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                        : aiResult.status === 'CROSS_TAB_BLOCKED'
                        ? 'bg-red-950/60 border-red-500/60 text-red-300'
                        : 'bg-red-950/40 border-red-500/40 text-red-300'
                    }`}>
                      <p className="font-bold">{aiResult.agentNotice}</p>
                      {aiResult.reason && (
                        <p className="text-[11px] mt-1 font-bold text-red-400">Reason: {aiResult.reason}</p>
                      )}
                    </div>

                    <div className="space-y-1 text-slate-300 text-[11px]">
                      <span className="text-slate-500 block uppercase font-bold text-[10px]">AI Reasoning:</span>
                      <p className="bg-[#111622] p-2 rounded border border-slate-800 text-slate-300">
                        {aiResult.thoughtProcess}
                      </p>
                    </div>

                    {aiResult.action !== "NONE" && (
                      <div className="space-y-1">
                        <span className="text-slate-500 block uppercase font-bold text-[10px]">Action Dispatched to Local Browser:</span>
                        <div className="bg-[#111622] p-2 rounded border border-slate-800 flex items-center justify-between">
                          <span className="text-emerald-400 font-bold">Command: {aiResult.action}</span>
                          <span className="text-blue-300">Target: [{aiResult.target}]</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                    <Server className="w-6 h-6 opacity-40" />
                    <p className="text-xs">No outbound payload transmitted yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-[#0a0e17] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Cross-tab protection and local sanitization enforced on-device.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
