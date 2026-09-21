import React from 'react';
import { 
  Eye, 
  Search, 
  ShieldCheck, 
  Filter, 
  Send, 
  BrainCircuit, 
  MousePointerClick, 
  ArrowRight,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function ArchitectureFlow({ currentStepIndex = -1 }) {
  const steps = [
    {
      id: 1,
      title: "SEE LOCALLY",
      desc: "Browser loads DOM & rendered visual context into client memory",
      icon: Eye,
      badge: "Step 1"
    },
    {
      id: 2,
      title: "DETECT LOCALLY",
      desc: "Multi-signal classifier detects passwords, emails, phones, and API keys",
      icon: Search,
      badge: "Step 2"
    },
    {
      id: 3,
      title: "PROTECT LOCALLY",
      desc: "Enforces tab isolation and delegates credentials to local vault",
      icon: ShieldCheck,
      badge: "Step 3"
    },
    {
      id: 4,
      title: "SANITIZE LOCALLY",
      desc: "Replaces values with [NAME], [EMAIL], [PASSWORD], [SECRET]",
      icon: Filter,
      badge: "Step 4"
    },
    {
      id: 5,
      title: "SEND SAFE CONTEXT",
      desc: "Only sanitized semantics dispatched over wire to remote AI",
      icon: Send,
      badge: "Step 5"
    },
    {
      id: 6,
      title: "REMOTE AI REASONS",
      desc: "External VLM understands page intents without seeing raw secrets",
      icon: BrainCircuit,
      badge: "Step 6"
    },
    {
      id: 7,
      title: "LOCAL BROWSER ACTS",
      desc: "Local executor triggers button click & fills credentials securely",
      icon: MousePointerClick,
      badge: "Step 7"
    }
  ];

  const sihMappings = [
    { sih: "On-device perception", impl: "Local DOM tree inspection & lightweight on-device classifier (WebGPU/MobileViT roadmap)" },
    { sih: "Sensitive information handling", impl: "Multi-signal sensitivity classification (LOW, MEDIUM, HIGH, CRITICAL)" },
    { sih: "Sanitization before transmission", impl: "Semantic-preserving token replacement ([NAME], [EMAIL], [PASSWORD], [SECRET])" },
    { sih: "Remote reasoning", impl: "Remote VLM agent reasoning over sanitized structure without raw data" },
    { sih: "Efficient client processing", impl: "Lightweight client-side footprint (< 20MB active heap, no heavy weights)" },
    { sih: "End-to-End Latency", impl: "Empirically measured client processing timer (< 3ms DOM scan and sanitize)" }
  ];

  return (
    <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
      {/* Visual Pipeline Header */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Core Architectural Pipeline (ISRO SIH26171)
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-[#070a12] px-2 py-0.5 rounded border border-slate-800">
            Trusted Client Boundary
          </span>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 pt-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStepIndex === idx;

            return (
              <div 
                key={step.id} 
                className={`p-2.5 rounded border transition-colors flex flex-col justify-between ${
                  isActive 
                    ? 'bg-slate-800 border-emerald-500 font-semibold' 
                    : 'bg-[#0a0e17] border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.badge}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  </div>
                  <h4 className="text-xs font-bold font-mono text-white mb-0.5">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex justify-end pt-1.5 text-slate-600">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SIH Alignment Section (Requirement 16) */}
      <div className="bg-[#0a0e17] border border-slate-800 rounded p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center space-x-2 text-slate-200 font-bold">
          <Compass className="w-4 h-4 text-teal-400" />
          <span>ISRO Problem Statement SIH26171 Alignment</span>
        </div>

        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
          SIH26171 evaluates lightweight on-device visual perception for browser agents. The table below documents how each specific requirement maps directly to the AI Privacy Firewall implementation:
        </p>

        <div className="divide-y divide-slate-800/80 border border-slate-800 rounded overflow-hidden">
          {sihMappings.map((m, idx) => (
            <div key={idx} className="p-2.5 bg-[#0f1422] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
              <div className="text-slate-300 font-semibold sm:w-1/3 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{m.sih}</span>
              </div>
              <div className="text-slate-400 sm:w-2/3">
                → {m.impl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
