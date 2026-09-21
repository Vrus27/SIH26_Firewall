import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Check, 
  Eye, 
  EyeOff, 
  X, 
  ArrowRight,
  Sparkles,
  Server
} from 'lucide-react';
import { DEMO_VAULT_STORE, requestLocalVaultFill } from '../core/vault';

export default function LocalVaultModal({ isOpen, onClose, onVaultFilled }) {
  const [showPassword, setShowPassword] = useState(false);
  const [fillStatus, setFillStatus] = useState(null);

  if (!isOpen) return null;

  const handleManualFill = () => {
    const res = requestLocalVaultFill('password');
    setFillStatus(res.message);
    if (onVaultFilled) {
      onVaultFilled(res);
    }
    setTimeout(() => {
      setFillStatus(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0e1422] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                🔐 LOCAL PRIVACY VAULT
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Client-Side Only
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Synthetic credential boundary for zero-knowledge AI browser actions
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Architecture Concept Explainer */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
              Architectural Separation of Concerns:
            </span>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-purple-400 font-bold block">REMOTE AI:</span>
                <span className="text-slate-400">Requests credential-related intent (e.g., "Authenticate User"). Never sees the actual password!</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold block">LOCAL VAULT:</span>
                <span className="text-slate-400">Handles credentials strictly on the user's machine and populates the local DOM directly.</span>
              </div>
            </div>
          </div>

          {/* Stored Credentials Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
              <span className="font-bold text-white">{DEMO_VAULT_STORE.siteName}</span>
              <span className="font-mono text-slate-400">{DEMO_VAULT_STORE.domain}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Username / Identity:</span>
                <span className="font-mono text-slate-200">{DEMO_VAULT_STORE.username}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Password:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-slate-200">
                    {showPassword ? DEMO_VAULT_STORE.syntheticPassword : DEMO_VAULT_STORE.maskedPassword}
                  </span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Security Fingerprint:</span>
                <span className="font-mono">{DEMO_VAULT_STORE.keyHash.slice(0, 18)}...</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleManualFill}
                className="w-full py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>[ Fill Credential Locally ]</span>
              </button>
            </div>
          </div>

          {/* Feedback Toast */}
          {fillStatus && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{fillStatus}</span>
            </div>
          )}

          {/* Security Rule Disclaimer */}
          <p className="text-[11px] text-slate-500 text-center">
            🔒 Synthetic demo credentials only. No actual user credentials are stored or requested.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0e1422] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
}
