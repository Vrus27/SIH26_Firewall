/**
 * AI Privacy Firewall — Sanitization Engine
 * ISRO Problem Statement SIH26171
 * 
 * Takes raw DOM / structured page context and outputs a sanitized representation
 * scoped explicitly to the active browser tab.
 * - Preserves structural semantics, layout, action targets (buttons, links).
 * - Replaces sensitive values with standardized semantic tokens based on policy.
 * - Leaves the user's live browser view untouched.
 */

/**
 * Creates a sanitized context structure specifically formatted for AI/VLM consumption
 * @param {Object} rawPageData 
 * @param {Array} detections
 * @param {boolean} protectionActive 
 * @param {Object} [options] - Tab metadata and origin scope
 * @returns {Object} Sanitized context payload
 */
export function sanitizeContext(rawPageData, detections, protectionActive = true, options = {}) {
  const tabId = options.tabId || 12;
  const origin = options.origin || "isro-portal.local";
  const url = options.url || `https://${origin}/user/profile`;
  const contextScope = options.contextScope || "current-tab";
  const privacyMode = options.privacyMode || "BALANCED";

  // If protection is disabled, simulate unshielded egress
  if (!protectionActive) {
    return {
      tabId,
      origin,
      contextScope,
      protectionStatus: 'DISABLED_UNPROTECTED',
      warning: 'CAUTION: Firewall is OFF. Raw sensitive values exposed in outbound payload!',
      timestamp: new Date().toISOString(),
      url,
      pageTitle: options.title || 'AI Privacy Firewall Test Page — User Profile',
      elements: [
        { id: 'name-field', type: 'input_text', label: 'Name', value: rawPageData.name, sensitivity: 'MEDIUM', sensitive: false },
        { id: 'email-field', type: 'input_email', label: 'Email', value: rawPageData.email, sensitivity: 'HIGH', sensitive: true },
        { id: 'phone-field', type: 'input_phone', label: 'Phone', value: rawPageData.phone, sensitivity: 'HIGH', sensitive: true },
        { id: 'password-field', type: 'input_password', label: 'Password', value: rawPageData.password, sensitivity: 'CRITICAL', sensitive: true },
        { id: 'api-key-badge', type: 'badge', label: 'API Key', value: rawPageData.apiKey, sensitivity: 'CRITICAL', sensitive: true },
        { id: 'btn-login', type: 'button', label: 'Login', action: 'submit_auth', sensitivity: 'LOW' },
        { id: 'btn-view-report', type: 'button', label: 'View Report', action: 'navigate_report', sensitivity: 'LOW' },
        { id: 'btn-download-report', type: 'button', label: 'Download Report', action: 'trigger_download', sensitivity: 'LOW' }
      ],
      rawLeakageDetected: true
    };
  }

  // Protection is ACTIVE: Map each field according to detection action
  const nameDet = detections.find(d => d.type === 'NAME');
  const emailDet = detections.find(d => d.type === 'EMAIL');
  const phoneDet = detections.find(d => d.type === 'PHONE');
  const passDet = detections.find(d => d.type === 'PASSWORD');
  const keyDet = detections.find(d => d.type === 'API_KEY');

  const sanitizedElements = [
    {
      id: 'name-field',
      type: 'input_text',
      label: 'Name',
      value: nameDet?.action === 'ALLOW' ? rawPageData.name : '[NAME]',
      sensitivity: 'MEDIUM',
      confidence: nameDet?.confidence || 0.92,
      action: nameDet?.action || 'REDACT',
      originalRedacted: nameDet?.action !== 'ALLOW'
    },
    {
      id: 'email-field',
      type: 'input_email',
      label: 'Email',
      value: emailDet?.action === 'ALLOW' ? rawPageData.email : '[EMAIL]',
      sensitivity: 'HIGH',
      confidence: emailDet?.confidence || 0.98,
      action: emailDet?.action || 'REDACT',
      originalRedacted: emailDet?.action !== 'ALLOW'
    },
    {
      id: 'phone-field',
      type: 'input_phone',
      label: 'Phone',
      value: phoneDet?.action === 'ALLOW' ? rawPageData.phone : '[PHONE]',
      sensitivity: 'HIGH',
      confidence: phoneDet?.confidence || 0.96,
      action: phoneDet?.action || 'REDACT',
      originalRedacted: phoneDet?.action !== 'ALLOW'
    },
    {
      id: 'password-field',
      type: 'input_password',
      label: 'Password',
      value: '[PASSWORD]',
      sensitivity: 'CRITICAL',
      confidence: passDet?.confidence || 0.99,
      action: 'BLOCK',
      blockedFromTransmission: true,
      delegatedToVault: true
    },
    {
      id: 'api-key-badge',
      type: 'badge',
      label: 'API Key',
      value: '[SECRET]',
      sensitivity: 'CRITICAL',
      confidence: keyDet?.confidence || 0.99,
      action: 'BLOCK',
      blockedFromTransmission: true
    },
    // Normal non-sensitive UI elements remain completely intact for AI reasoning
    {
      id: 'btn-login',
      type: 'button',
      label: 'Login',
      action: 'submit_auth',
      sensitivity: 'LOW',
      target: 'primary_action'
    },
    {
      id: 'text-welcome',
      type: 'heading',
      label: 'Welcome to the dashboard.',
      content: 'Welcome to the dashboard.',
      sensitivity: 'LOW'
    },
    {
      id: 'btn-view-report',
      type: 'button',
      label: 'View Report',
      action: 'navigate_report',
      sensitivity: 'LOW'
    },
    {
      id: 'btn-download-report',
      type: 'button',
      label: 'Download Report',
      action: 'trigger_download',
      sensitivity: 'LOW'
    }
  ];

  const blockedCount = sanitizedElements.filter(e => e.action === 'BLOCK').length;
  const redactedCount = sanitizedElements.filter(e => e.action === 'REDACT').length;
  const allowedCount = sanitizedElements.filter(e => e.action === 'ALLOW' || e.sensitivity === 'LOW').length;

  return {
    tabId,
    origin,
    contextScope,
    privacyMode,
    protectionStatus: 'ACTIVE_SHIELDED',
    firewallEngine: 'AI Privacy Firewall v1.2 (ISRO SIH26171)',
    timestamp: new Date().toISOString(),
    url,
    pageTitle: options.title || 'AI Privacy Firewall Test Page — User Profile',
    sanitizationSummary: {
      totalElements: sanitizedElements.length,
      blockedSecrets: blockedCount,
      redactedFields: redactedCount,
      allowedElements: allowedCount
    },
    elements: sanitizedElements,
    accessibilityTree: {
      role: 'document',
      name: 'User Profile & Dashboard',
      tabScope: `tab-${tabId}`,
      children: [
        { role: 'textbox', name: 'Name', value: nameDet?.action === 'ALLOW' ? rawPageData.name : '[NAME]' },
        { role: 'textbox', name: 'Email', value: emailDet?.action === 'ALLOW' ? rawPageData.email : '[EMAIL]' },
        { role: 'textbox', name: 'Phone', value: phoneDet?.action === 'ALLOW' ? rawPageData.phone : '[PHONE]' },
        { role: 'textbox', name: 'Password', value: '[PASSWORD]' },
        { role: 'status', name: 'API Key', value: '[SECRET]' },
        { role: 'button', name: 'Login' },
        { role: 'button', name: 'View Report' },
        { role: 'button', name: 'Download Report' }
      ]
    },
    rawLeakageDetected: false
  };
}

/**
 * Generate human-readable comparison text
 */
export function generateComparisonTexts(rawPageData, options = {}) {
  const original = `Name: ${rawPageData.name}
Email: ${rawPageData.email}
Phone: ${rawPageData.phone}
Password: ${rawPageData.password}
API Key: ${rawPageData.apiKey}

Welcome to the dashboard.
[ Login ]
[ View Report ]
[ Download Report ]`;

  const sanitized = `Name: [NAME]
Email: [EMAIL]
Phone: [PHONE]
Password: [PASSWORD]
API Key: [SECRET]

Welcome to the dashboard.
[ Login ]
[ View Report ]
[ Download Report ]`;

  return { original, sanitized };
}
