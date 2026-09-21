import React, { useState } from 'react';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  Code, 
  FileText 
} from 'lucide-react';
import { generateComparisonTexts } from '../core/sanitizer.js';

export default function SideBySideView({ pageData, isProtected, sanitizedPayload, activeTab }) {
  const [copiedSide, setCopiedSide] = useState(null);
  const [viewFormat, setViewFormat] = useState('text'); // 'text' | 'json'

  const { original, sanitized } = generateComparisonTexts(pageData);

  const copyToClipboard = (text, side) => {
    navigator.clipboard.writeText(text);
    setCopiedSide(side);
    setTimeout(() => setCopiedSide(null), 2000);
  };

  return (
    <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-6 shadow-md space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            ⚖️ Original Local Context vs. Sanitized Context Sent to AI
          </h2>
          <p className="text-xs text-slate-400">
            Active Context: <strong>Tab #{activeTab.id} ({activeTab.origin})</strong> • Confirms UI semantics are preserved for AI reasoning while sensitive values are replaced on-device.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          <button
            onClick={() => setViewFormat(viewFormat === 'text' ? 'json' : 'text')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Format: {viewFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Comparison Split Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative font-mono text-xs">
        {/* Transformation Badge in center */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[#111622] border border-emerald-500 text-emerald-400 shadow-md">
          <ArrowRight className="w-4 h-4" />
        </div>

        {/* LEFT COLUMN: ORIGINAL LOCAL CONTEXT */}
        <div className="bg-[#0a0e17] border border-slate-800 rounded flex flex-col">
          {/* Column Header */}
          <div className="bg-[#111622] px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
                LEFT: ORIGINAL LOCAL CONTEXT
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                User Browser DOM
              </span>
              <button
                onClick={() => copyToClipboard(viewFormat === 'text' ? original : JSON.stringify(pageData, null, 2), 'left')}
                className="text-slate-400 hover:text-white p-1"
                title="Copy Original"
              >
                {copiedSide === 'left' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="p-2 bg-[#0e1422] text-[11px] text-slate-400 border-b border-slate-800 px-3">
            Contains raw personal data visible to the user on their screen.
          </div>

          {/* Content Body */}
          <div className="p-4 text-slate-200 overflow-x-auto flex-1">
            {viewFormat === 'text' ? (
              <pre className="whitespace-pre-wrap leading-relaxed space-y-1">
                <div><span className="text-slate-500">Name:</span> <span className="text-slate-100">{pageData.name}</span> <span className="text-[10px] text-slate-500 ml-2">(MEDIUM)</span></div>
                <div><span className="text-slate-500">Email:</span> <span className="text-slate-100">{pageData.email}</span> <span className="text-[10px] text-slate-500 ml-2">(HIGH)</span></div>
                <div><span className="text-slate-500">Phone:</span> <span className="text-slate-100">{pageData.phone}</span> <span className="text-[10px] text-slate-500 ml-2">(HIGH)</span></div>
                <div><span className="text-slate-500">Password:</span> <span className="text-red-400 font-bold">{pageData.password}</span> <span className="text-[10px] text-red-500 ml-2">(CRITICAL)</span></div>
                <div><span className="text-slate-500">API Key:</span> <span className="text-red-400 font-bold">{pageData.apiKey}</span> <span className="text-[10px] text-red-500 ml-2">(CRITICAL)</span></div>
                <br />
                <div className="text-slate-400">Welcome to the dashboard.</div>
                <div className="text-emerald-400">[ Login ] <span className="text-[10px] text-slate-500 ml-2">(LOW)</span></div>
                <div className="text-blue-400">[ View Report ] <span className="text-[10px] text-slate-500 ml-2">(LOW)</span></div>
                <div className="text-purple-400">[ Download Report ] <span className="text-[10px] text-slate-500 ml-2">(LOW)</span></div>
              </pre>
            ) : (
              <pre className="text-slate-300 whitespace-pre-wrap">
                {JSON.stringify(pageData, null, 2)}
              </pre>
            )}
          </div>

          <div className="px-3.5 py-1.5 bg-[#111622] border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
            <span>Stored in local client memory</span>
            <span className="text-amber-400">Raw Sensitive Content Visible</span>
          </div>
        </div>

        {/* RIGHT COLUMN: SANITIZED CONTEXT SENT TO AI */}
        <div className="bg-[#0a0e17] border border-emerald-900/40 rounded flex flex-col">
          {/* Column Header */}
          <div className="bg-[#111622] px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <h3 className="font-bold text-emerald-300 uppercase tracking-wider text-xs">
                RIGHT: SANITIZED CONTEXT SENT TO AI
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 font-semibold">
                Wire Safe
              </span>
              <button
                onClick={() => copyToClipboard(viewFormat === 'text' ? sanitized : JSON.stringify(sanitizedPayload, null, 2), 'right')}
                className="text-slate-400 hover:text-white p-1"
                title="Copy Sanitized"
              >
                {copiedSide === 'right' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="p-2 bg-[#0e1422] text-[11px] text-emerald-300/80 border-b border-slate-800 px-3">
            Values sanitized into semantic tokens. Normal UI elements remain intact for AI.
          </div>

          {/* Content Body */}
          <div className="p-4 text-slate-200 overflow-x-auto flex-1">
            {viewFormat === 'text' ? (
              <pre className="whitespace-pre-wrap leading-relaxed space-y-1">
                <div><span className="text-slate-500">Name:</span> <span className="text-amber-300 font-bold">[NAME]</span> <span className="text-[10px] text-emerald-500 ml-2">REDACTED</span></div>
                <div><span className="text-slate-500">Email:</span> <span className="text-orange-300 font-bold">[EMAIL]</span> <span className="text-[10px] text-emerald-500 ml-2">REDACTED</span></div>
                <div><span className="text-slate-500">Phone:</span> <span className="text-orange-300 font-bold">[PHONE]</span> <span className="text-[10px] text-emerald-500 ml-2">REDACTED</span></div>
                <div><span className="text-slate-500">Password:</span> <span className="text-red-400 font-bold">[PASSWORD]</span> <span className="text-[10px] text-red-400 ml-2">BLOCKED</span></div>
                <div><span className="text-slate-500">API Key:</span> <span className="text-red-400 font-bold">[SECRET]</span> <span className="text-[10px] text-red-400 ml-2">BLOCKED</span></div>
                <br />
                <div className="text-slate-400">Welcome to the dashboard.</div>
                <div className="text-emerald-400">[ Login ] <span className="text-[10px] text-emerald-400 ml-2">INTACT</span></div>
                <div className="text-blue-400">[ View Report ] <span className="text-[10px] text-emerald-400 ml-2">INTACT</span></div>
                <div className="text-purple-400">[ Download Report ] <span className="text-[10px] text-emerald-400 ml-2">INTACT</span></div>
              </pre>
            ) : (
              <pre className="text-emerald-300 whitespace-pre-wrap">
                {JSON.stringify(sanitizedPayload, null, 2)}
              </pre>
            )}
          </div>

          <div className="px-3.5 py-1.5 bg-[#111622] border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
            <span>Semantics: 100% Preserved</span>
            <span className="text-emerald-400 font-bold">0 Raw Secrets Transmitted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
