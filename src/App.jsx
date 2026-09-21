import React, { useState, useMemo } from 'react';
import TopNavbar from './components/TopNavbar.jsx';
import SimulatedBrowser from './components/SimulatedBrowser.jsx';
import FirewallExtension from './components/FirewallExtension.jsx';
import SideBySideView from './components/SideBySideView.jsx';
import OutboundGateModal from './components/OutboundGateModal.jsx';
import PrivacyReport from './components/PrivacyReport.jsx';
import SettingsView from './components/SettingsView.jsx';
import EvaluationView from './components/EvaluationView.jsx';
import PresentationMode from './components/PresentationMode.jsx';
import ArchitectureFlow from './components/ArchitectureFlow.jsx';

import { scanPageContext } from './core/detector.js';
import { sanitizeContext } from './core/sanitizer.js';
import { profileExecution } from './core/profiler.js';
import { processAiTask } from './mockAI/mockVlmAgent.js';
import { executeBrowserAction } from './core/executor.js';
import { INITIAL_TABS, setActiveTabId } from './core/tabs.js';
import { getPolicyForOrigin, PRIVACY_MODES } from './core/policies.js';

export default function App() {
  const [isProtected, setIsProtected] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(PRIVACY_MODES.BALANCED);
  const [tabsList, setTabsList] = useState(INITIAL_TABS);
  const [activeTabId, setLocalActiveTabId] = useState(12);
  const [showHighlights, setShowHighlights] = useState(true);
  const [activeNavTab, setActiveNavTab] = useState('studio'); // 'studio' | 'comparison' | 'report' | 'evaluation' | 'settings' | 'alignment'
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [presentationStepIndex, setPresentationStepIndex] = useState(-1);

  // Modals & State
  const [isOutboundGateOpen, setIsOutboundGateOpen] = useState(false);
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [lastActionExecution, setLastActionExecution] = useState(null);
  const [policyVersion, setPolicyVersion] = useState(0);

  // Current active browser tab object
  const activeBrowserTab = useMemo(() => {
    return tabsList.find(t => t.id === activeTabId) || tabsList[0];
  }, [tabsList, activeTabId]);

  // Current website policy
  const currentWebsitePolicy = useMemo(() => {
    return getPolicyForOrigin(activeBrowserTab.origin);
  }, [activeBrowserTab.origin, policyVersion]);

  // Real-time detection & sanitization telemetry for active tab
  const { detections, sanitizedPayload, telemetry } = useMemo(() => {
    return profileExecution(
      (data, opts) => scanPageContext(data, opts),
      (data, dets, prot, opts) => sanitizeContext(data, dets, isProtected, opts),
      activeBrowserTab.data,
      {
        origin: activeBrowserTab.origin,
        tabId: activeBrowserTab.id,
        policy: currentWebsitePolicy,
        privacyMode,
        url: activeBrowserTab.url,
        title: activeBrowserTab.title
      }
    );
  }, [activeBrowserTab, isProtected, currentWebsitePolicy, privacyMode]);

  // Switch active browser tab
  const handleSelectTab = (tabId) => {
    setActiveTabId(tabId);
    setLocalActiveTabId(tabId);
    setLastActionExecution(null);
    setAiResult(null);
  };

  // Update active tab data (e.g. user typing in form)
  const handleUpdatePageData = (newData) => {
    setTabsList(prev => prev.map(tab => {
      if (tab.id === activeBrowserTab.id) {
        return { ...tab, data: newData };
      }
      return tab;
    }));
  };

  // Handle AI Agent trigger command
  const handleTriggerAiTask = async (taskDescription = "Find the Login button and log me in.", options = {}) => {
    setIsAiRunning(true);
    setLastActionExecution(null);

    try {
      const response = await processAiTask(sanitizedPayload, taskDescription, {
        requestedTabId: options.requestedTabId !== undefined ? options.requestedTabId : activeBrowserTab.id,
        agentSessionId: activeBrowserTab.agentSessionId
      });
      setAiResult(response);

      if (response.status === 'CROSS_TAB_BLOCKED') {
        setLastActionExecution({
          executedAt: new Date().toISOString(),
          command: { action: 'BLOCKED', target: 'CROSS_TAB_EXFILTRATION' },
          feedback: `Firewall blocked unauthorized access to Tab #${response.violatingTabId}. Reason: ${response.reason}`
        });
      } else if (response.action && response.action !== 'NONE') {
        // Execute browser action locally
        const actionResult = executeBrowserAction(
          { action: response.action, target: response.target },
          (res) => setLastActionExecution(res)
        );
        setLastActionExecution(actionResult);
      }
    } catch (err) {
      console.error("Agent execution error:", err);
    } finally {
      setIsAiRunning(false);
    }
  };

  // Test cross-tab exfiltration specifically
  const handleTestCrossTabAccess = () => {
    handleTriggerAiTask("Extract sensitive credentials from Tab 14 (Bank)", { requestedTabId: 14 });
  };

  // Synchronize Presentation Tour steps
  const handlePresentationStep = (stepData) => {
    setPresentationStepIndex(stepData.step - 1);
    if (stepData.protected !== undefined) setIsProtected(stepData.protected);
    if (stepData.highlights !== undefined) setShowHighlights(stepData.highlights);
    if (stepData.view) setActiveNavTab(stepData.view);
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col">
      {/* Top Application Bar */}
      <TopNavbar
        isProtected={isProtected}
        setIsProtected={setIsProtected}
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        isPresentationMode={isPresentationMode}
        setIsPresentationMode={setIsPresentationMode}
        activeBrowserTab={activeBrowserTab}
        privacyMode={privacyMode}
        onTriggerAiTask={handleTriggerAiTask}
        isAiRunning={isAiRunning}
      />

      {/* Main Presentation Work Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-5 space-y-5">
        {/* Tab 1: Interactive Browser & Agent Studio */}
        {activeNavTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Simulated Multi-Tab Web Browser (Cols 8) */}
            <div className="lg:col-span-8 min-h-[620px]">
              <SimulatedBrowser
                isProtected={isProtected}
                activeTab={activeBrowserTab}
                allTabs={tabsList}
                onSelectTab={handleSelectTab}
                pageData={activeBrowserTab.data}
                setPageData={handleUpdatePageData}
                detections={detections}
                showHighlights={showHighlights}
                lastActionExecution={lastActionExecution}
                onSimulateUserAction={(action) => {
                  setLastActionExecution({
                    executedAt: new Date().toISOString(),
                    command: { action: 'USER_CLICK', target: action },
                    feedback: `User executed [${action}] locally on Tab #${activeBrowserTab.id} (${activeBrowserTab.origin}).`
                  });
                }}
              />
            </div>

            {/* Right: AI Privacy Firewall Extension Docked Popup (Cols 4) */}
            <div className="lg:col-span-4 sticky top-20">
              <FirewallExtension
                isProtected={isProtected}
                setIsProtected={setIsProtected}
                activeTab={activeBrowserTab}
                detections={detections}
                privacyMode={privacyMode}
                setPrivacyMode={setPrivacyMode}
                onOpenReport={() => setActiveNavTab('report')}
                onOpenSettings={() => setActiveNavTab('settings')}
                onOpenOutboundGate={() => setIsOutboundGateOpen(true)}
                onOpenComparison={() => setActiveNavTab('comparison')}
                onTriggerAiTask={handleTriggerAiTask}
                onTestCrossTabAccess={handleTestCrossTabAccess}
                isAiRunning={isAiRunning}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Side-by-Side View (Original vs. Sanitized) */}
        {activeNavTab === 'comparison' && (
          <SideBySideView
            pageData={activeBrowserTab.data}
            isProtected={isProtected}
            sanitizedPayload={sanitizedPayload}
            activeTab={activeBrowserTab}
          />
        )}

        {/* Tab 3: Detailed Privacy Report */}
        {activeNavTab === 'report' && (
          <PrivacyReport
            isProtected={isProtected}
            detections={detections}
            telemetry={telemetry}
            activeTab={activeBrowserTab}
          />
        )}

        {/* Tab 4: Detection Metrics & Evaluation Benchmark */}
        {activeNavTab === 'evaluation' && (
          <EvaluationView telemetry={telemetry} />
        )}

        {/* Tab 5: Settings & Website Policies */}
        {activeNavTab === 'settings' && (
          <SettingsView
            isProtected={isProtected}
            setIsProtected={setIsProtected}
            privacyMode={privacyMode}
            setPrivacyMode={setPrivacyMode}
            activeTabOrigin={activeBrowserTab.origin}
            onPolicyUpdated={() => setPolicyVersion(v => v + 1)}
          />
        )}

        {/* Tab 6: Architecture & SIH26171 Alignment */}
        {activeNavTab === 'alignment' && (
          <ArchitectureFlow currentStepIndex={presentationStepIndex} />
        )}
      </main>

      {/* Outbound Privacy Gate Modal */}
      <OutboundGateModal
        isOpen={isOutboundGateOpen}
        onClose={() => setIsOutboundGateOpen(false)}
        isProtected={isProtected}
        activeTab={activeBrowserTab}
        sanitizedPayload={sanitizedPayload}
        onTriggerAiTask={handleTriggerAiTask}
        aiResult={aiResult}
        isAiRunning={isAiRunning}
      />

      {/* Automated 2-Minute Presentation Tour Overlay */}
      <PresentationMode
        isActive={isPresentationMode}
        onClose={() => {
          setIsPresentationMode(false);
          setPresentationStepIndex(-1);
        }}
        onStepChange={handlePresentationStep}
        onTriggerAiTask={handleTriggerAiTask}
      />

      {/* Footer Branding */}
      <footer className="mt-auto border-t border-slate-900 bg-[#06080e] py-2.5 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>AI Privacy Firewall • SIH 2026</span>
          <span className="text-slate-400">ISRO SIH26171 — Lightweight On-Device Browser Perception</span>
          <span>Tab Process Isolation Simulated</span>
        </div>
      </footer>
    </div>
  );
}
