/**
 * AI Privacy Firewall — Policy & Sensitivity Levels Engine
 * ISRO Problem Statement SIH26171
 * 
 * Defines prototype sensitivity classifications, privacy modes, and
 * user-approved per-website privacy policies.
 */

// Four standard prototype sensitivity levels
export const SENSITIVITY_LEVELS = {
  LOW: {
    level: "LOW",
    description: "Normal UI elements, non-identifying content, public actions",
    defaultAction: "ALLOW",
    badgeColor: "bg-slate-700 text-slate-300 border-slate-600"
  },
  MEDIUM: {
    level: "MEDIUM",
    description: "Potentially identifying information (names, operator handles)",
    defaultAction: "REDACT",
    badgeColor: "bg-amber-950 text-amber-300 border-amber-800"
  },
  HIGH: {
    level: "HIGH",
    description: "Personal Identifiable Information (email, phone, contact details)",
    defaultAction: "REDACT",
    badgeColor: "bg-orange-950 text-orange-300 border-orange-800"
  },
  CRITICAL: {
    level: "CRITICAL",
    description: "Authentication credentials, passwords, API keys, cryptographic tokens",
    defaultAction: "BLOCK",
    badgeColor: "bg-red-950 text-red-300 border-red-800"
  }
};

// Standard Privacy Modes
export const PRIVACY_MODES = {
  BALANCED: "BALANCED", // Default: Semantic preservation with PII redacted and secrets blocked
  STRICT: "STRICT",     // Maximum protection: Heavy blocking, minimal transmission
  CUSTOM: "CUSTOM"      // User-defined actions per data type
};

// Default policy rules per data category
export const DEFAULT_RULES = {
  password: { type: "PASSWORD", level: "CRITICAL", action: "BLOCK", label: "Password Fields", canWeaken: false },
  apiKey: { type: "API_KEY", level: "CRITICAL", action: "BLOCK", label: "API Keys & Secrets", canWeaken: false },
  token: { type: "TOKEN", level: "CRITICAL", action: "BLOCK", label: "Session & Auth Tokens", canWeaken: false },
  email: { type: "EMAIL", level: "HIGH", action: "REDACT", label: "Email Addresses", canWeaken: true },
  phone: { type: "PHONE", level: "HIGH", action: "REDACT", label: "Phone Numbers", canWeaken: true },
  name: { type: "NAME", level: "MEDIUM", action: "REDACT", label: "Full Names & Identities", canWeaken: true },
  visualPii: { type: "VISUAL_PII", level: "MEDIUM", action: "REDACT", label: "Face / Visual ID", canWeaken: true },
  normalUi: { type: "NORMAL_UI", level: "LOW", action: "ALLOW", label: "Buttons & Navigation", canWeaken: true }
};

// In-memory store for User-Approved Website Privacy Policies
// Initial demo policy configurations for test origins
const initialWebsitePolicies = {
  "isro-portal.local": {
    origin: "isro-portal.local",
    name: "ISRO Mission Telemetry Portal",
    mode: "BALANCED",
    rules: {
      password: "BLOCK",
      apiKey: "BLOCK",
      email: "REDACT",
      phone: "REDACT",
      name: "REDACT"
    },
    lastUpdated: "2026-09-11T10:00:00Z",
    userApproved: true
  },
  "mail.internal.local": {
    origin: "mail.internal.local",
    name: "Internal Operator Mail",
    mode: "STRICT",
    rules: {
      password: "BLOCK",
      apiKey: "BLOCK",
      email: "REDACT",
      phone: "BLOCK",
      name: "REDACT"
    },
    lastUpdated: "2026-09-11T10:15:00Z",
    userApproved: true
  },
  "vault.bank.local": {
    origin: "vault.bank.local",
    name: "Financial Authorization Portal",
    mode: "STRICT",
    rules: {
      password: "BLOCK",
      apiKey: "BLOCK",
      email: "BLOCK",
      phone: "BLOCK",
      name: "BLOCK"
    },
    lastUpdated: "2026-09-11T10:20:00Z",
    userApproved: true
  }
};

let storedWebsitePolicies = { ...initialWebsitePolicies };

/**
 * Get user policy for a specific origin, or return defaults
 */
export function getPolicyForOrigin(origin) {
  if (storedWebsitePolicies[origin]) {
    return { ...storedWebsitePolicies[origin] };
  }
  return {
    origin,
    name: origin,
    mode: "BALANCED",
    rules: {
      password: "BLOCK",
      apiKey: "BLOCK",
      email: "REDACT",
      phone: "REDACT",
      name: "REDACT"
    },
    lastUpdated: new Date().toISOString(),
    userApproved: false
  };
}

/**
 * Save user-approved policy for an origin
 */
export function savePolicyForOrigin(origin, updatedPolicy) {
  // CRITICAL Safety Guard: do not allow silent weakening of passwords/API keys
  const guardedRules = { ...updatedPolicy.rules };
  guardedRules.password = "BLOCK";
  guardedRules.apiKey = "BLOCK";

  storedWebsitePolicies[origin] = {
    ...updatedPolicy,
    origin,
    rules: guardedRules,
    userApproved: true,
    lastUpdated: new Date().toISOString()
  };

  return storedWebsitePolicies[origin];
}

/**
 * Reset policy for an origin to prototype defaults
 */
export function resetPolicyForOrigin(origin) {
  if (initialWebsitePolicies[origin]) {
    storedWebsitePolicies[origin] = { ...initialWebsitePolicies[origin] };
  } else {
    delete storedWebsitePolicies[origin];
  }
  return getPolicyForOrigin(origin);
}

/**
 * Get all configured website policies
 */
export function getAllWebsitePolicies() {
  return Object.values(storedWebsitePolicies);
}
