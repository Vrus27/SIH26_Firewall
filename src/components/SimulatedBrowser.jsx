import React, { useState } from 'react';
import { 
  Lock, RotateCw, ArrowLeft, ArrowRight, Download, FileText, 
  KeyRound, CheckCircle2, Eye, EyeOff, Settings, Shield,
  AlertTriangle, X, ChevronDown
} from 'lucide-react';

export default function SimulatedBrowser({ 
  isProtected, 
  activeTab, 
  allTabs, 
  onSelectTab, 
  pageData, 
  setPageData, 
  detections, 
  showHighlights, 
  lastActionExecution, 
  onSimulateUserAction,
  onOpenSettings,
  extensionOpen,
  onToggleExtension
}) {
  const [showPasswordText, setShowPasswordText] = useState(false);

  const isExecutingLogin = lastActionExecution && 
    (lastActionExecution.command?.target === 'Login' || lastActionExecution.command?.action === 'FILL_AND_LOGIN');

  const isExecutingDownload = lastActionExecution &&
    lastActionExecution.command?.target === 'Download Report';

  // Find detection record helper
  const getDet = (type) => detections.find(d => d.type === type);
  const nameDet = getDet('NAME');
  const emailDet = getDet('EMAIL');
  const phoneDet = getDet('PHONE');
  const passDet = getDet('PASSWORD');
  const keyDet = getDet('API_KEY');

  // Detection highlight style
  const highlightClass = (det) => {
    if (!isProtected || !showHighlights || !det) return '';
    if (det.action === 'BLOCK') return 'ring-2 ring-red-400 bg-red-50';
    if (det.action === 'REDACT') return 'ring-2 ring-amber-400 bg-amber-50';
    return '';
  };

  // Detection badge
  const DetBadge = ({ det }) => {
    if (!isProtected || !showHighlights || !det) return null;
    const colors = det.action === 'BLOCK' 
      ? 'bg-red-100 text-red-700 border-red-200' 
      : 'bg-amber-100 text-amber-700 border-amber-200';
    return (
      <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium border ${colors}`}>
        {det.action === 'BLOCK' ? '🔒 BLOCKED' : '🔸 SANITIZED'} → {det.sanitizedValue}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* 1. Browser Tab Bar */}
      <div className="bg-gray-100 border-b border-gray-200 flex items-center px-2 pt-2 gap-1 select-none overflow-x-auto">
        {allTabs.map(tab => {
          const isActive = tab.id === activeTab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t-lg text-xs transition-colors cursor-pointer ${
                isActive 
                  ? 'bg-white text-gray-800 border-t border-x border-gray-200 font-medium shadow-sm' 
                  : 'bg-gray-50 text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isProtected ? 'bg-emerald-400' : 'bg-gray-400'}`} />
              <span className="truncate max-w-[120px]">
                {tab.title.split('—')[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. URL & Navigation Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-3 text-xs">
        <div className="flex items-center space-x-1.5 text-gray-400">
          <ArrowLeft className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600" />
          <ArrowRight className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600" />
          <RotateCw className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl flex items-center bg-white border border-gray-300 rounded-full px-3 py-1.5 text-xs">
          <Lock className="w-3 h-3 text-emerald-600 mr-1.5 shrink-0" />
          <span className="text-gray-500">https://</span>
          <span className="text-gray-800 font-medium">{activeTab.origin}</span>
          <span className="text-gray-400">/user/profile</span>
        </div>

        {/* Extension Icon (clickable) */}
        <button
          onClick={onToggleExtension}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            extensionOpen ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-200 text-gray-500'
          }`}
          title="AI Privacy Firewall Extension"
        >
          <Shield className="w-4 h-4" />
        </button>

        {/* Settings Icon */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
          title="Security Dashboard"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Protection Status Bar */}
      {isProtected && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium">AI Privacy Protected</span>
            <span className="text-emerald-600">— {detections.length} sensitive element{detections.length !== 1 ? 's' : ''} detected locally</span>
          </div>
          <span className="text-emerald-500 text-[10px]">Firewall Active</span>
        </div>
      )}

      {/* 3. Main Webpage Content */}
      <div className={`flex-1 overflow-y-auto ${
        isProtected ? 'border-l-4 border-emerald-500' : 'border-l-4 border-gray-300'
      }`}>
        
        {/* Action Feedback Toast */}
        {lastActionExecution && (
          <div className={`mx-4 mt-3 p-3 rounded-lg text-xs flex items-center justify-between ${
            lastActionExecution.command?.action === 'BLOCKED' 
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{lastActionExecution.feedback}</span>
            </div>
            <span className="text-[10px] text-blue-400 whitespace-nowrap ml-2">
              {lastActionExecution.executedAt?.slice(11, 19)}
            </span>
          </div>
        )}

        {/* Synthetic Demo Label */}
        <div className="mx-4 mt-3 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-700 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span><strong>Demo Environment</strong> — Synthetic test data only. No real credentials or financial data are used.</span>
        </div>

        {/* Page Content: SecureBank Demo */}
        <div className="p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">SecureBank Demo</h1>
                <p className="text-xs text-gray-500">Synthetic Test Environment — Employee Portal</p>
              </div>
            </div>
          </div>

          {/* Account Summary Card */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-5">
            <h2 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Account Profile
            </h2>

            <div className="space-y-3">
              {/* Name */}
              <div className={`flex items-center justify-between py-1.5 px-2 rounded ${highlightClass(nameDet)}`}>
                <label className="text-xs text-gray-500 w-24">Name</label>
                <div className="flex items-center flex-1">
                  <input 
                    type="text" 
                    value={pageData.name || ''} 
                    onChange={(e) => setPageData({...pageData, name: e.target.value})}
                    className="flex-1 text-sm text-gray-800 bg-transparent border-b border-gray-200 focus:border-indigo-400 focus:outline-none px-1 py-0.5"
                  />
                  <DetBadge det={nameDet} />
                </div>
              </div>

              {/* Email */}
              <div className={`flex items-center justify-between py-1.5 px-2 rounded ${highlightClass(emailDet)}`}>
                <label className="text-xs text-gray-500 w-24">Email</label>
                <div className="flex items-center flex-1">
                  <input 
                    type="email" 
                    value={pageData.email || ''} 
                    onChange={(e) => setPageData({...pageData, email: e.target.value})}
                    className="flex-1 text-sm text-gray-800 bg-transparent border-b border-gray-200 focus:border-indigo-400 focus:outline-none px-1 py-0.5"
                  />
                  <DetBadge det={emailDet} />
                </div>
              </div>

              {/* Phone */}
              <div className={`flex items-center justify-between py-1.5 px-2 rounded ${highlightClass(phoneDet)}`}>
                <label className="text-xs text-gray-500 w-24">Phone</label>
                <div className="flex items-center flex-1">
                  <input 
                    type="tel" 
                    value={pageData.phone || ''} 
                    onChange={(e) => setPageData({...pageData, phone: e.target.value})}
                    className="flex-1 text-sm text-gray-800 bg-transparent border-b border-gray-200 focus:border-indigo-400 focus:outline-none px-1 py-0.5"
                  />
                  <DetBadge det={phoneDet} />
                </div>
              </div>

              {/* Password */}
              <div className={`flex items-center justify-between py-1.5 px-2 rounded ${highlightClass(passDet)}`}>
                <label className="text-xs text-gray-500 w-24">Password</label>
                <div className="flex items-center flex-1">
                  <div className="flex-1 flex items-center border-b border-gray-200">
                    <input 
                      type={showPasswordText ? 'text' : 'password'} 
                      value={pageData.password || ''} 
                      onChange={(e) => setPageData({...pageData, password: e.target.value})}
                      className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none px-1 py-0.5"
                    />
                    <button onClick={() => setShowPasswordText(!showPasswordText)} className="p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer">
                      {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <DetBadge det={passDet} />
                </div>
              </div>

              {/* API Key */}
              <div className={`flex items-center justify-between py-1.5 px-2 rounded ${highlightClass(keyDet)}`}>
                <label className="text-xs text-gray-500 w-24">API Key</label>
                <div className="flex items-center flex-1">
                  <div className="flex-1 flex items-center">
                    <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                      {pageData.apiKey || ''}
                    </span>
                  </div>
                  <DetBadge det={keyDet} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => onSimulateUserAction('Login')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                isExecutingLogin 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              {isExecutingLogin ? '✓ Login Successful' : 'Login'}
            </button>

            <button 
              onClick={() => onSimulateUserAction('Download Report')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer flex items-center gap-2 ${
                isExecutingDownload
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Download className="w-4 h-4" />
              {isExecutingDownload ? '✓ Report Downloaded' : 'Download Report'}
            </button>

            <button 
              onClick={() => onSimulateUserAction('View Report')}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
