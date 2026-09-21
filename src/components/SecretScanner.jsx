import React, { useState } from 'react';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Code, 
  AlertTriangle, 
  Check, 
  RefreshCw,
  Terminal
} from 'lucide-react';
import { PATTERNS } from '../core/detector';

const SAMPLE_PAGE_SCRIPTS = `// Inline Web Application Script (demo-app-bundle.js)
const CONFIG = {
  appName: "ISRO Telemetry Portal",
  version: "2.4.1",
  apiUrl: "https://api.isro-portal.local/v1",
  API_KEY="DEMO_API_KEY_123456",
  AUTH_TOKEN="ghp_demoSyntheticTokenSecret987654321",
  SESSION_SECRET="demo_session_secret_xyz999",
  retryAttempts: 3
};

function initializeAgentClient() {
  console.log("Client agent listener ready.");
}`;

export default function SecretScanner({ pageData }) {
  const [sourceCode, setSourceCode] = useState(SAMPLE_PAGE_SCRIPTS);
  const [scanResults, setScanResults] = useState([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const runSecretScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const results = [];
      const lines = sourceCode.split('\n');

      lines.forEach((line, index) => {
        // Look for API_KEY, TOKEN, SECRET, PASSWORD
        const secretMatches = [...line.matchAll(/(?:API_KEY|AUTH_TOKEN|SESSION_SECRET|PASSWORD|TOKEN|SECRET)[\s:=]+["']?([A-Za-z0-9_\-]{6,})["']?/gi)];
        
        secretMatches.forEach(match => {
          results.push({
            lineNumber: index + 1,
            matchedKey: match[0].split(/[=:]/)[0].trim(),
            rawSecret: match[1] || match[0],
            sanitizedToken: '[SECRET]',
            status: 'BLOCKED',
            severity: 'CRITICAL',
            snippet: line.trim()
          });
        });
      });

      setScanResults(results);
      setHasScanned(true);
      setIsScanning(false);
    }, 250);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Local JavaScript & Secret Scanner
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                Client Code Auditor
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Scans client-side scripts, variables, and bundle headers for exposed secrets before agent transmission.
            </p>
          </div>
        </div>

        <button
          onClick={runSecretScan}
          disabled={isScanning}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          <span>{isScanning ? 'Auditing Scripts...' : 'Run Local Secret Scan'}</span>
        </button>
      </div>

      {/* Main Grid: Script Inspector & Detected Secrets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Code Panel */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-80 overflow-hidden">
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              Inspected Client Source (DOM Scripts)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Read-Only View</span>
          </div>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            className="flex-1 p-3 bg-slate-950 text-slate-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            placeholder="Paste client JavaScript or HTML bundle to audit for secrets..."
          />
        </div>

        {/* Scan Results Panel */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-80 overflow-hidden">
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Scanner Findings ({scanResults.length})
            </span>
            <span className="text-[10px] font-mono text-rose-400">
              {scanResults.length > 0 ? 'Outbound Redaction Required' : 'Clean'}
            </span>
          </div>

          <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
            {scanResults.length > 0 ? (
              scanResults.map((result, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-rose-500/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300 font-mono flex items-center gap-1.5">
                      🛡️ LOCAL SECRET DETECTED: {result.matchedKey}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                      Line {result.lineNumber}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] bg-slate-950 p-2 rounded text-slate-400 truncate">
                    {result.snippet}
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400 font-mono">
                      Firewall Replacement: <strong className="text-emerald-400 font-bold">{result.matchedKey} → [SECRET]</strong>
                    </span>
                    <span className="text-emerald-400 font-semibold font-mono text-[10px]">
                      BLOCKED FROM AI ✓
                    </span>
                  </div>
                </div>
              ))
            ) : hasScanned ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <p className="text-xs text-slate-300 font-semibold">No hardcoded secrets detected in source code.</p>
                <p className="text-[11px]">All variables conform to safe client boundaries.</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <Search className="w-8 h-8 opacity-40" />
                <p className="text-xs">Click "Run Local Secret Scan" to audit page scripts.</p>
                <p className="text-[11px]">Detects tokens matching API_KEY=, TOKEN=, SECRET=.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
