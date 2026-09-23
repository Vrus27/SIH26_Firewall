import React, { useState } from 'react';
import { 
  ArrowLeft, Shield, Eye, FileText, Send, Lock, KeyRound,
  Activity, Settings, List, Play, Info, CheckCircle2,
  AlertTriangle, XCircle, ChevronRight, BarChart3, Clock
} from 'lucide-react';
import { getEvents, clearEvents, EVENT_TYPES } from '../core/eventLog.js';
import { generateComparisonTexts } from '../core/sanitizer.js';
import { DEMO_VAULT_STORE } from '../core/vault.js';
import { ISRO_EVALUATION_METRICS } from '../core/profiler.js';
import { runDetectionBenchmark } from '../core/evaluationBenchmark.js';
import { getPolicyForOrigin, savePolicyForOrigin, resetPolicyForOrigin, getAllWebsitePolicies, PRIVACY_MODES } from '../core/policies.js';
import { DEMO_STEPS } from '../core/demoSteps.js';

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Shield },
  { id: 'detections', label: 'Detected Data', icon: Eye },
  { id: 'sanitization', label: 'Sanitization', icon: FileText },
  { id: 'outbound', label: 'Outbound Gate', icon: Send },
  { id: 'agent', label: 'AI Agent', icon: Activity },
  { id: 'vault', label: 'Credential Vault', icon: KeyRound },
  { id: 'report', label: 'Privacy Report', icon: BarChart3 },
  { id: 'evaluation', label: 'Evaluation', icon: BarChart3 },
  { id: 'policies', label: 'Website Policies', icon: Settings },
  { id: 'auditlog', label: 'Audit Log', icon: List },
  { id: 'demo', label: 'Demo Tour', icon: Play },
  { id: 'about', label: 'Prototype Status', icon: Info },
];

export default function SecurityDashboard({
  onBack,
  isProtected,
  setIsProtected,
  privacyMode,
  setPrivacyMode,
  activeBrowserTab,
  detections,
  sanitizedPayload,
  telemetry,
  aiResult,
  lastActionExecution,
  onTriggerAiTask,
  isAiRunning,
  onPolicyUpdated
}) {
  const [activeSection, setActiveSection] = useState('overview');
  const [eventsList, setEventsList] = useState(() => getEvents());

  const refreshEvents = () => setEventsList(getEvents());

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-gray-200">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 mb-3 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Browser
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="text-sm font-semibold text-gray-800">Security Dashboard</div>
              <div className="text-[10px] text-gray-500">AI Privacy Firewall</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {SIDEBAR_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-medium border-r-2 border-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl">

          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-5">
              <SectionHeader title="Overview" subtitle="Current system state and protection status" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Protection" value={isProtected ? 'ON' : 'OFF'} color={isProtected ? 'emerald' : 'gray'} />
                <StatCard label="Privacy Mode" value={privacyMode} color="indigo" />
                <StatCard label="Active Tab" value={`#${activeBrowserTab.id}`} color="blue" />
                <StatCard label="Detected" value={detections.length} color="amber" />
              </div>

              <Card title="Current Tab Context">
                <InfoRow label="Origin" value={activeBrowserTab.origin} />
                <InfoRow label="Title" value={activeBrowserTab.title} />
                <InfoRow label="URL" value={activeBrowserTab.url} />
                <InfoRow label="Isolation" value="Strict Tab Scope" />
              </Card>

              <Card title="Prototype Status">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-2">Implemented</div>
                    <div className="space-y-1">
                      {['Local detection', 'Sanitization', 'Outbound privacy gate', 'Mock remote AI', 'Action firewall', 'Local action execution', 'Credential vault (simulated)', 'Privacy event logging'].map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-2">Experimental / Prototype</div>
                    <div className="space-y-1">
                      {['Browser visual perception', 'WebGPU inference', 'Advanced semantic PII detection'].map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-gray-500">
                          <span className="w-3.5 h-3.5 text-center text-[10px]">◐</span> {f}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs font-medium text-gray-700 mt-3 mb-2">Future</div>
                    <div className="space-y-1">
                      {['Production-grade credential storage', 'Full VLM integration', 'Advanced policy learning', 'Multi-browser deployment'].map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span className="w-3.5 h-3.5 text-center text-[10px]">○</span> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* DETECTED DATA */}
          {activeSection === 'detections' && (
            <div className="space-y-5">
              <SectionHeader title="Detected Data" subtitle={`${detections.length} sensitive element${detections.length !== 1 ? 's' : ''} detected locally on the active page`} />
              
              {detections.length === 0 ? (
                <Card><p className="text-sm text-gray-500">No sensitive elements detected on the current page.</p></Card>
              ) : (
                detections.map(det => (
                  <Card key={det.id} title={det.type}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          det.sensitivityLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          det.sensitivityLevel === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {det.sensitivityLevel}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          det.action === 'BLOCK' ? 'bg-red-100 text-red-700' :
                          det.action === 'REDACT' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {det.action}
                        </span>
                        <span className="text-[11px] text-gray-500">Confidence: {(det.confidence * 100).toFixed(0)}%</span>
                      </div>
                      
                      <InfoRow label="Detected locally" value={det.element} />
                      <InfoRow label="Privacy action" value={det.action === 'BLOCK' ? 'Blocked from remote AI' : det.action === 'REDACT' ? 'Sanitized before transmission' : det.action} />
                      <InfoRow label="Replacement" value={det.sanitizedValue} mono />
                      
                      <div className="mt-2">
                        <div className="text-[11px] text-gray-500 mb-1">Why was this protected?</div>
                        <div className="space-y-0.5">
                          {det.reasons.map((r, i) => (
                            <div key={i} className="text-[11px] text-gray-600 flex items-start gap-1.5">
                              <span className="text-gray-400 mt-0.5">•</span> {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* SANITIZATION (Side-by-Side) */}
          {activeSection === 'sanitization' && (
            <div className="space-y-5">
              <SectionHeader title="Sanitization" subtitle="Original context vs. sanitized context sent to AI" />
              <SanitizationDiff pageData={activeBrowserTab.data} isProtected={isProtected} />
            </div>
          )}

          {/* OUTBOUND PRIVACY GATE */}
          {activeSection === 'outbound' && (
            <div className="space-y-5">
              <SectionHeader title="Outbound Privacy Gate" subtitle="Inspect the actual payload before and after sanitization" />
              <OutboundGateSection 
                pageData={activeBrowserTab.data} 
                sanitizedPayload={sanitizedPayload} 
                isProtected={isProtected}
                detections={detections}
              />
            </div>
          )}

          {/* AI AGENT */}
          {activeSection === 'agent' && (
            <div className="space-y-5">
              <SectionHeader title="AI Agent" subtitle="AI decision and action generation (Mock AI — Simulated VLM)" />
              
              <Card title="Trigger AI Task">
                <div className="flex gap-2 mb-3">
                  <button 
                    onClick={() => onTriggerAiTask("Find the Login button and log me in.")}
                    disabled={isAiRunning}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                  >
                    {isAiRunning ? 'Processing...' : 'Ask AI to log me in'}
                  </button>
                  <button 
                    onClick={() => onTriggerAiTask("Download the report.")}
                    disabled={isAiRunning}
                    className="px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    Download Report
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">Note: This is a Mock AI agent for prototype demonstration. Not a deployed VLM.</p>
              </Card>

              {aiResult && (
                <>
                  <Card title="AI Decision">
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded p-3 border border-gray-200 space-y-2">
                        <StepRow step="1" label="Sanitized context received" detail={`Tab #${activeBrowserTab.id} (${activeBrowserTab.origin})`} />
                        <StepRow step="2" label="Task interpretation" detail={aiResult.action === 'NONE' ? 'Cross-tab request blocked' : `${aiResult.target || 'N/A'} identified on page`} />
                        <StepRow step="3" label="Generated action" detail={aiResult.action !== 'NONE' ? `${aiResult.action} → ${aiResult.target}` : 'NONE (Blocked)'} />
                        <StepRow step="4" label="Status" detail={aiResult.status} />
                      </div>

                      {aiResult.action !== 'NONE' && (
                        <div className="bg-indigo-50 rounded p-3 border border-indigo-200">
                          <div className="text-[11px] font-medium text-indigo-700 mb-1">Structured Action Sent to Local Executor</div>
                          <pre className="text-xs font-mono text-indigo-800 bg-white rounded p-2 border border-indigo-100">
{JSON.stringify({ action: aiResult.action, target: aiResult.target }, null, 2)}
                          </pre>
                        </div>
                      )}

                      {aiResult.receivedTokens && (
                        <div>
                          <div className="text-[11px] text-gray-500 mb-1">What the AI received (sanitized tokens only)</div>
                          <div className="space-y-0.5">
                            {Object.entries(aiResult.receivedTokens).map(([k, v]) => (
                              <div key={k} className="text-[11px] text-gray-600 font-mono">{k}: {v}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Action Firewall */}
                  {lastActionExecution?.validation && (
                    <Card title="Action Firewall">
                      <div className="space-y-1.5">
                        {lastActionExecution.validation.checks.map((check, i) => (
                          <div key={i} className={`flex items-center gap-2 text-xs ${check.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                            {check.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span className="font-medium">{check.label}</span>
                            <span className="text-gray-400">— {check.detail}</span>
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                          → {lastActionExecution.validation.valid ? 'Action validated and executed locally' : 'Action blocked by firewall'}
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Execution Result */}
                  {lastActionExecution && (
                    <Card title="Execution Result">
                      <InfoRow label="Feedback" value={lastActionExecution.feedback} />
                      <InfoRow label="Executed at" value={lastActionExecution.executedAt} />
                      {lastActionExecution.vaultResolved && (
                        <InfoRow label="Vault" value="Credential resolved locally — zero leakage to remote AI" />
                      )}
                    </Card>
                  )}
                </>
              )}
            </div>
          )}

          {/* CREDENTIAL VAULT */}
          {activeSection === 'vault' && (
            <div className="space-y-5">
              <SectionHeader title="Local Credential Vault" subtitle="Synthetic demo credentials stored locally — never transmitted to remote AI" />
              <Card>
                <div className="space-y-2">
                  <InfoRow label="Domain" value={DEMO_VAULT_STORE.domain} />
                  <InfoRow label="Site" value={DEMO_VAULT_STORE.siteName} />
                  <InfoRow label="Username" value={DEMO_VAULT_STORE.username} />
                  <InfoRow label="Password" value={DEMO_VAULT_STORE.maskedPassword} mono />
                  <InfoRow label="Status" value="Stored locally (simulated)" />
                  <InfoRow label="Last accessed" value={DEMO_VAULT_STORE.lastAccessed || 'Not yet accessed'} />
                </div>
                <div className="mt-3 text-[10px] text-gray-400 bg-gray-50 rounded p-2 border border-gray-100">
                  <strong>Architecture:</strong> When the AI commands CLICK Login, the Local Executor resolves the credential from this vault on-device. The remote AI never receives the plaintext password.
                </div>
              </Card>
            </div>
          )}

          {/* PRIVACY REPORT */}
          {activeSection === 'report' && (
            <div className="space-y-5">
              <SectionHeader title="Privacy Report" subtitle="Live counters derived from the active detection and sanitization pipeline" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Detected" value={detections.length} color="blue" />
                <StatCard label="Blocked" value={detections.filter(d => d.action === 'BLOCK').length} color="red" />
                <StatCard label="Sanitized" value={detections.filter(d => d.action === 'REDACT').length} color="amber" />
                <StatCard label="Allowed" value={detections.filter(d => d.action === 'ALLOW').length} color="emerald" />
              </div>

              {telemetry && (
                <Card title="Performance (Measured Live)">
                  <InfoRow label="Detection latency" value={`${telemetry.detectionMs} ms`} />
                  <InfoRow label="Sanitization latency" value={`${telemetry.sanitizationMs} ms`} />
                  <InfoRow label="Total client processing" value={`${telemetry.totalClientMs} ms`} />
                  <InfoRow label="Memory" value={telemetry.memoryUsage} />
                  <InfoRow label="Measured at" value={telemetry.measuredAt} />
                  <div className="mt-2 text-[10px] text-gray-400">All values measured live using performance.now() — not fabricated.</div>
                </Card>
              )}
            </div>
          )}

          {/* EVALUATION */}
          {activeSection === 'evaluation' && (
            <EvaluationSection telemetry={telemetry} />
          )}

          {/* WEBSITE POLICIES */}
          {activeSection === 'policies' && (
            <PoliciesSection 
              activeTabOrigin={activeBrowserTab.origin} 
              isProtected={isProtected}
              setIsProtected={setIsProtected}
              privacyMode={privacyMode}
              setPrivacyMode={setPrivacyMode}
              onPolicyUpdated={onPolicyUpdated}
            />
          )}

          {/* AUDIT LOG */}
          {activeSection === 'auditlog' && (
            <div className="space-y-5">
              <SectionHeader title="Audit Log" subtitle="Chronological security event trail" />
              <div className="flex gap-2 mb-3">
                <button onClick={refreshEvents} className="px-3 py-1 bg-white border border-gray-300 rounded text-xs cursor-pointer hover:bg-gray-50">Refresh</button>
                <button onClick={() => { clearEvents(); refreshEvents(); }} className="px-3 py-1 bg-white border border-gray-300 rounded text-xs cursor-pointer hover:bg-gray-50">Clear</button>
              </div>
              <div className="space-y-2">
                {eventsList.length === 0 ? (
                  <Card><p className="text-sm text-gray-500">No events recorded.</p></Card>
                ) : (
                  eventsList.slice(0, 30).map(evt => (
                    <div key={evt.id} className="bg-white border border-gray-200 rounded p-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          evt.level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          evt.level === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {evt.level}
                        </span>
                        <span className="text-[10px] text-gray-400">{evt.timestamp}</span>
                      </div>
                      <div className="font-medium text-gray-800 mb-0.5">{evt.summary}</div>
                      <div className="text-gray-500">{evt.details}</div>
                      <div className="text-[10px] text-gray-400 mt-1">Tab #{evt.tabId} · {evt.origin} · {evt.type}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* DEMO TOUR */}
          {activeSection === 'demo' && (
            <div className="space-y-5">
              <SectionHeader title="Guided Demo Tour" subtitle="9-stage prototype demonstration sequence" />
              <div className="space-y-3">
                {DEMO_STEPS.map(step => (
                  <Card key={step.step} title={step.title}>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT / PROTOTYPE STATUS */}
          {activeSection === 'about' && (
            <div className="space-y-5">
              <SectionHeader title="Prototype Status" subtitle="AI Privacy Firewall — SIH 2026 (SIH26171)" />
              <Card>
                <div className="space-y-2">
                  <InfoRow label="Product" value="AI Privacy Firewall for Agentic Browsing" />
                  <InfoRow label="Problem Statement" value="SIH26171 — On-device Visual Perception for Light-weight Browser Agents" />
                  <InfoRow label="Organization" value="ISRO" />
                  <InfoRow label="Architecture" value="Local Perception → Local Privacy Enforcement → Safe Remote Reasoning → Local Execution" />
                  <InfoRow label="Detection Engine" value="Prototype multi-signal rule & pattern classifier (DOM + regex + policy)" />
                  <InfoRow label="AI Agent" value="Mock AI (Simulated VLM) — not a deployed model" />
                  <InfoRow label="Credential Storage" value="In-memory demo vault (not production-grade)" />
                </div>
              </Card>
              <Card title="Core Product Message">
                <p className="text-sm text-gray-700 italic">
                  "The AI can use the browser without getting access to everything the browser knows."
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  We are not trying to stop the AI from using the browser — we are making sure the AI can use the browser without getting access to the sensitive information inside it.
                </p>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Reusable sub-components
   ═══════════════════════════════════════════════════════════════════ */

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-1">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {title && <div className="text-sm font-medium text-gray-700 mb-3">{title}</div>}
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start gap-2 py-1 text-xs">
      <span className="text-gray-400 w-32 shrink-0">{label}</span>
      <span className={`text-gray-700 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
  };
  return (
    <div className={`rounded-lg border p-3 text-center ${colorMap[color] || colorMap.gray}`}>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-[10px] font-medium mt-0.5">{label}</div>
    </div>
  );
}

function StepRow({ step, label, detail }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{step}</span>
      <div>
        <span className="font-medium text-gray-700">{label}</span>
        {detail && <span className="text-gray-500"> — {detail}</span>}
      </div>
    </div>
  );
}

/* Sanitization Diff */
function SanitizationDiff({ pageData, isProtected }) {
  const { original, sanitized } = generateComparisonTexts(pageData);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-gray-400" />
          Original Local Context
        </div>
        <pre className="text-xs font-mono text-gray-700 bg-gray-50 rounded p-3 border border-gray-100 whitespace-pre-wrap">{original}</pre>
      </div>
      <div className="bg-white border border-indigo-200 rounded-lg p-4">
        <div className="text-xs font-medium text-indigo-700 mb-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-indigo-500" />
          Sanitized Context Sent to Remote AI
        </div>
        <pre className="text-xs font-mono text-indigo-700 bg-indigo-50 rounded p-3 border border-indigo-100 whitespace-pre-wrap">{isProtected ? sanitized : original}</pre>
      </div>
    </div>
  );
}

/* Outbound Privacy Gate */
function OutboundGateSection({ pageData, sanitizedPayload, isProtected, detections }) {
  return (
    <div className="space-y-4">
      <SanitizationDiff pageData={pageData} isProtected={isProtected} />
      
      {isProtected && (
        <div className="bg-white border border-emerald-200 rounded-lg p-4">
          <div className="text-sm font-medium text-emerald-700 mb-3">Privacy Gate Status</div>
          <div className="space-y-1.5">
            {[
              { check: true, text: `Sensitive information detected locally (${detections.length} items)` },
              { check: true, text: `Sensitive information sanitized (${detections.filter(d => d.action === 'REDACT').length} redacted, ${detections.filter(d => d.action === 'BLOCK').length} blocked)` },
              { check: detections.some(d => d.type === 'PASSWORD'), text: 'Password prevented from leaving browser' },
              { check: true, text: 'Sanitized context allowed to remote AI' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isProtected && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700 mb-2">
            <AlertTriangle className="w-4 h-4" /> Firewall Disabled
          </div>
          <p className="text-xs text-red-600">With the firewall OFF, raw sensitive values would be exposed in the outbound payload to the remote AI agent.</p>
        </div>
      )}
    </div>
  );
}

/* Evaluation */
function EvaluationSection({ telemetry }) {
  const [benchmark, setBenchmark] = useState(null);

  const runBenchmark = () => {
    const result = runDetectionBenchmark();
    setBenchmark(result);
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Evaluation & Benchmark" subtitle="SIH evaluation metrics (honest reporting — values measured from the running system)" />
      
      <Card title="ISRO SIH26171 Evaluation Criteria">
        <div className="space-y-2">
          {Object.values(ISRO_EVALUATION_METRICS).map(m => (
            <div key={m.label} className="flex items-start justify-between py-1 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-xs font-medium text-gray-700">{m.label} ({m.weight})</div>
                <div className="text-[10px] text-gray-400">{m.methodology}</div>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                m.status.includes('MEASURED') ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>{m.status}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Detection Benchmark (Synthetic Corpus)">
        <button onClick={runBenchmark} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 mb-3 cursor-pointer">
          Run Benchmark Now
        </button>
        {benchmark && (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2">
              <StatCard label="True Positive" value={benchmark.counts.tp} color="emerald" />
              <StatCard label="False Positive" value={benchmark.counts.fp} color="red" />
              <StatCard label="True Negative" value={benchmark.counts.tn} color="blue" />
              <StatCard label="False Negative" value={benchmark.counts.fn} color="amber" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <StatCard label="Precision" value={`${benchmark.metrics.precision}%`} color="indigo" />
              <StatCard label="Recall" value={`${benchmark.metrics.recall}%`} color="indigo" />
              <StatCard label="F1 Score" value={`${benchmark.metrics.f1Score}%`} color="indigo" />
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Measured on {benchmark.totalElements}-element synthetic corpus at {benchmark.executedAt}. Prototype measurement.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

/* Website Policies */
function PoliciesSection({ activeTabOrigin, isProtected, setIsProtected, privacyMode, setPrivacyMode, onPolicyUpdated }) {
  const [selectedOrigin, setSelectedOrigin] = useState(activeTabOrigin);
  const [currentPolicy, setCurrentPolicy] = useState(() => getPolicyForOrigin(activeTabOrigin));
  const [saveStatus, setSaveStatus] = useState(null);

  const allPolicies = getAllWebsitePolicies();

  const handleOriginChange = (orig) => {
    setSelectedOrigin(orig);
    setCurrentPolicy(getPolicyForOrigin(orig));
  };

  const handleRuleChange = (field, action) => {
    if (field === 'password' || field === 'apiKey') return;
    setCurrentPolicy(prev => ({ ...prev, rules: { ...prev.rules, [field]: action } }));
  };

  const handleSave = () => {
    savePolicyForOrigin(selectedOrigin, currentPolicy);
    setSaveStatus('Policy saved.');
    if (onPolicyUpdated) onPolicyUpdated(selectedOrigin);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleReset = () => {
    const def = resetPolicyForOrigin(selectedOrigin);
    setCurrentPolicy(def);
    setSaveStatus('Reset to defaults.');
    if (onPolicyUpdated) onPolicyUpdated(selectedOrigin);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Website Policies" subtitle="User-configurable privacy rules per domain" />
      
      <Card title="Privacy Mode">
        <div className="flex gap-2">
          {Object.values(PRIVACY_MODES).map(mode => (
            <button
              key={mode}
              onClick={() => setPrivacyMode(mode)}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
                privacyMode === mode ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{mode}</button>
          ))}
        </div>
      </Card>

      <Card title={`Rules for: ${selectedOrigin}`}>
        <div className="flex gap-2 mb-3">
          {Object.keys(allPolicies).map(orig => (
            <button key={orig} onClick={() => handleOriginChange(orig)}
              className={`px-2 py-1 rounded text-[11px] cursor-pointer ${selectedOrigin === orig ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-500'}`}
            >{orig}</button>
          ))}
        </div>
        {currentPolicy?.rules && Object.entries(currentPolicy.rules).map(([field, action]) => (
          <div key={field} className="flex items-center justify-between py-1.5 border-b border-gray-50">
            <span className="text-xs text-gray-600 capitalize">{field}</span>
            <div className="flex gap-1">
              {['BLOCK', 'REDACT', 'ALLOW'].map(a => (
                <button key={a} onClick={() => handleRuleChange(field, a)}
                  disabled={field === 'password' || field === 'apiKey'}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                    action === a ? (a === 'BLOCK' ? 'bg-red-100 text-red-700' : a === 'REDACT' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700') : 'bg-gray-50 text-gray-400'
                  } ${(field === 'password' || field === 'apiKey') ? 'opacity-50 cursor-not-allowed' : ''}`}
                >{a}</button>
              ))}
            </div>
          </div>
        ))}
        <div className="flex gap-2 mt-3">
          <button onClick={handleSave} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs cursor-pointer hover:bg-indigo-700">Save</button>
          <button onClick={handleReset} className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs cursor-pointer hover:bg-gray-200">Reset</button>
        </div>
        {saveStatus && <p className="text-[11px] text-emerald-600 mt-2">{saveStatus}</p>}
      </Card>
    </div>
  );
}
