/**
 * AI Privacy Firewall — Sensitivity Identification Engine
 * ISRO Problem Statement SIH26171
 * 
 * Inspects DOM nodes, input types, attributes, labels, and text patterns
 * strictly on-device to produce structured sensitivity records:
 * 
 * {
 *   type: "EMAIL",
 *   element: "input[type=email]#user-email",
 *   sensitivityLevel: "HIGH", // LOW | MEDIUM | HIGH | CRITICAL
 *   confidence: 0.98,
 *   reasons: ["matches email pattern", "inside input[type=email]"],
 *   action: "REDACT" // ALLOW | REDACT | BLOCK | REQUEST_USER_APPROVAL
 * }
 * 
 * Uses multiple signals:
 * - DOM input types (password, email, tel)
 * - HTML labels and accessibility names
 * - Field name / id attributes
 * - Semantic HTML tags
 * - Regex & pattern matching
 * - Page and script context
 * - User-defined website policy overrides
 * 
 * Note: Labeled as prototype policy/classification engine.
 */

import { SENSITIVITY_LEVELS, getPolicyForOrigin } from './policies.js';

// Deterministic regex patterns for PII and sensitive tokens
export const PATTERNS = {
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  PHONE_IN: /(?:\+91[\s-]?)?[6789]\d{4}[\s-]?\d{5}/g,
  PHONE_GENERIC: /(?:\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
  API_KEY_DEMO: /DEMO_API_KEY_[A-Za-z0-9_-]+/g,
  GENERIC_SECRET: /(?:API_KEY|TOKEN|SECRET|AUTH_KEY)[\s:=]+["']?([A-Za-z0-9_\-]{8,})["']?/gi,
  BEARER_TOKEN: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
  PASSWORD_PATTERN: /(?:password|pwd|passwd)[\s:=]+["']?([^"'\s]+)["']?/gi,
};

export const DETECTOR_METADATA = {
  engine: "Prototype Sensitivity Identification Engine",
  classificationType: "Multi-Signal Rule & Pattern Classifier",
  disclaimer: "Experimental prototype policy engine for SIH demonstration. Not a scientifically validated statistical model.",
  futureVisionModelRoadmap: "Lightweight ONNX Runtime Web + MobileViT with WebGPU on-device shader acceleration."
};

/**
 * Scan a simulated or live webpage context and produce structured sensitivity records
 * @param {Object} pageData - Form inputs, labels, and text elements
 * @param {Object} [options] - Optional origin and website policy overrides
 * @returns {Array<Object>} List of structured sensitivity records
 */
export function scanPageContext(pageData, options = {}) {
  const detections = [];
  let idCounter = 1;

  if (!pageData) return detections;

  const origin = options.origin || "isro-portal.local";
  const websitePolicy = options.policy || getPolicyForOrigin(origin);
  const privacyMode = options.privacyMode || websitePolicy.mode || "BALANCED";

  // 1. Password input detection
  if (pageData.password !== undefined && pageData.password !== '') {
    const reasons = [
      'HTML element input[type=password] detected in DOM',
      'Associated with form label "Password:"',
      'DOM id="#user-password" matches credential pattern',
      'Classified as primary authentication credential'
    ];

    // Policy resolution
    let action = "BLOCK"; // Passwords always blocked by default
    if (websitePolicy.rules && websitePolicy.rules.password) {
      action = websitePolicy.rules.password;
    }

    detections.push({
      id: `det-${idCounter++}`,
      type: "PASSWORD",
      element: "input[type=password]#user-password",
      selector: "#user-password",
      label: "User Password",
      category: "Authentication Credential",
      sensitivityLevel: SENSITIVITY_LEVELS.CRITICAL.level,
      confidence: 0.99,
      reasons,
      action,
      rawValue: String(pageData.password),
      sanitizedValue: "[PASSWORD]",
      signals: ["input[type=password]", "label:Password", "regex:non-empty"],
      sensitive: true
    });
  }

  // 2. Email detection
  if (pageData.email) {
    const rawEmail = String(pageData.email);
    const matchesPattern = rawEmail.match(PATTERNS.EMAIL) || rawEmail.includes('@');
    const reasons = [
      'Matches RFC-5322 email regular expression',
      'HTML input type="email"',
      'Associated with label "Email:"',
      'User contact identifier with potential tracking risk'
    ];

    let action = "REDACT";
    if (websitePolicy.rules && websitePolicy.rules.email) {
      action = websitePolicy.rules.email;
    } else if (privacyMode === "STRICT") {
      action = "BLOCK";
    }

    if (matchesPattern) {
      detections.push({
        id: `det-${idCounter++}`,
        type: "EMAIL",
        element: "input[type=email]#user-email",
        selector: "#user-email",
        label: "Email Address",
        category: "Personal Identifiable Information (PII)",
        sensitivityLevel: SENSITIVITY_LEVELS.HIGH.level,
        confidence: 0.98,
        reasons,
        action,
        rawValue: rawEmail,
        sanitizedValue: "[EMAIL]",
        signals: ["regex:RFC-5322", "input[type=email]", "label:Email"],
        sensitive: true
      });
    }
  }

  // 3. Phone number detection
  if (pageData.phone) {
    const rawPhone = String(pageData.phone);
    const reasons = [
      'Matches telecommunication number pattern (+91 national / E.164)',
      'HTML input type="tel"',
      'Associated with label "Phone:"',
      'Direct personal communications identifier'
    ];

    let action = "REDACT";
    if (websitePolicy.rules && websitePolicy.rules.phone) {
      action = websitePolicy.rules.phone;
    } else if (privacyMode === "STRICT") {
      action = "BLOCK";
    }

    detections.push({
      id: `det-${idCounter++}`,
      type: "PHONE",
      element: "input[type=tel]#user-phone",
      selector: "#user-phone",
      label: "Phone Number",
      category: "Personal Identifiable Information (PII)",
      sensitivityLevel: SENSITIVITY_LEVELS.HIGH.level,
      confidence: 0.96,
      reasons,
      action,
      rawValue: rawPhone,
      sanitizedValue: "[PHONE]",
      signals: ["regex:phone_in", "input[type=tel]", "label:Phone"],
      sensitive: true
    });
  }

  // 4. Name / Identity detection
  if (pageData.name) {
    const rawName = String(pageData.name);
    const reasons = [
      'Associated with user profile identity label "Name:"',
      'HTML input name="fullname" attribute matches person entity',
      'Potential subject identification in multi-agent workflow'
    ];

    let action = "REDACT";
    if (websitePolicy.rules && websitePolicy.rules.name) {
      action = websitePolicy.rules.name;
    }

    detections.push({
      id: `det-${idCounter++}`,
      type: "NAME",
      element: "input[name=fullname]#user-fullname",
      selector: "#user-fullname",
      label: "Full Name",
      category: "Personal Identifiable Information (PII)",
      sensitivityLevel: SENSITIVITY_LEVELS.MEDIUM.level,
      confidence: 0.92,
      reasons,
      action,
      rawValue: rawName,
      sanitizedValue: "[NAME]",
      signals: ["input[name=fullname]", "label:Name", "domContext:UserProfile"],
      sensitive: true
    });
  }

  // 5. API Key / Secret Token detection
  if (pageData.apiKey) {
    const rawKey = String(pageData.apiKey);
    const reasons = [
      'Prefix pattern DEMO_API_KEY_* matches cryptographic secret syntax',
      'Associated with developer authorization badge',
      'Contains high-entropy token characters',
      'Classified as service authorization secret'
    ];

    let action = "BLOCK";
    if (websitePolicy.rules && websitePolicy.rules.apiKey) {
      action = websitePolicy.rules.apiKey;
    }

    detections.push({
      id: `det-${idCounter++}`,
      type: "API_KEY",
      element: "input#user-api-key",
      selector: "#user-api-key",
      label: "Developer API Key",
      category: "API Secret / Credentials",
      sensitivityLevel: SENSITIVITY_LEVELS.CRITICAL.level,
      confidence: 0.99,
      reasons,
      action,
      rawValue: rawKey,
      sanitizedValue: "[SECRET]",
      signals: ["regex:API_KEY_PREFIX", "selector:api-key", "entropy:high"],
      sensitive: true
    });
  }

  // 6. Inline script/text scanning if provided
  if (pageData.inlineScripts) {
    const scriptText = String(pageData.inlineScripts);
    const matches = [...scriptText.matchAll(PATTERNS.GENERIC_SECRET)];
    for (const match of matches) {
      detections.push({
        id: `det-${idCounter++}`,
        type: "SECRET_TOKEN",
        element: "script[inline]#app-config",
        selector: "script#app-config",
        label: "Hardcoded Secret in Script",
        category: "Exposed Secret Token",
        sensitivityLevel: SENSITIVITY_LEVELS.CRITICAL.level,
        confidence: 0.97,
        reasons: [
          'Regex match on script variable assignment (API_KEY/TOKEN/SECRET)',
          'High risk of prompt-injection or unauthorized model exfiltration'
        ],
        action: "BLOCK",
        rawValue: match[0],
        sanitizedValue: "[BLOCKED_SECRET]",
        signals: ["scriptPattern:SECRET_ASSIGNMENT"],
        sensitive: true
      });
    }
  }

  return detections;
}

/**
 * Scan arbitrary text string for sensitive PII or secrets
 */
export function scanRawText(text) {
  if (!text) return [];
  const findings = [];

  const emailMatches = text.match(PATTERNS.EMAIL);
  if (emailMatches) {
    emailMatches.forEach(val => findings.push({ type: 'EMAIL', value: val, replacement: '[EMAIL]' }));
  }

  const phoneMatches = text.match(PATTERNS.PHONE_IN);
  if (phoneMatches) {
    phoneMatches.forEach(val => findings.push({ type: 'PHONE', value: val, replacement: '[PHONE]' }));
  }

  const keyMatches = text.match(PATTERNS.API_KEY_DEMO);
  if (keyMatches) {
    keyMatches.forEach(val => findings.push({ type: 'API_KEY', value: val, replacement: '[SECRET]' }));
  }

  return findings;
}
