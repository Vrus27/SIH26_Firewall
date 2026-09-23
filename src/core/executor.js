/**
 * AI Privacy Firewall — Local Browser Action Executor & Action Firewall
 * ISRO Problem Statement SIH26171
 * 
 * Validates and executes actions requested by the AI agent on the local DOM
 * while maintaining user agency and verification.
 * 
 * The Action Firewall ensures the remote AI cannot directly execute
 * arbitrary browser operations — all actions must pass local validation.
 */

import { requestLocalVaultFill } from './vault.js';
import { recordEvent, EVENT_TYPES } from './eventLog.js';

// Allowed action types the AI can request
const ALLOWED_ACTIONS = ['CLICK', 'FILL_AND_LOGIN', 'NAVIGATE', 'SCROLL'];

// Allowed click targets (whitelist)
const ALLOWED_TARGETS = [
  'Login', 'Download Report', 'View Report', 'Submit',
  'Sign In', 'Sign Out', 'Next', 'Previous', 'Close',
  'login-button', 'download-report', 'view-report'
];

/**
 * Validate an AI-generated action before execution.
 * Returns { valid, checks[] } where checks is an array of validation steps.
 */
export function validateAction(actionCommand) {
  const checks = [];
  let valid = true;

  // 1. Schema validation
  const hasAction = actionCommand && typeof actionCommand.action === 'string';
  const hasTarget = actionCommand && typeof actionCommand.target === 'string';
  checks.push({
    label: 'Action schema valid',
    passed: hasAction && hasTarget,
    detail: hasAction && hasTarget
      ? `Action: ${actionCommand.action}, Target: ${actionCommand.target}`
      : 'Missing action or target field'
  });
  if (!hasAction || !hasTarget) valid = false;

  // 2. Action type allowed
  const actionAllowed = ALLOWED_ACTIONS.includes(actionCommand?.action);
  checks.push({
    label: 'Action type allowed',
    passed: actionAllowed,
    detail: actionAllowed
      ? `"${actionCommand.action}" is in the allowed action set`
      : `"${actionCommand?.action}" is not an allowed action type`
  });
  if (!actionAllowed) valid = false;

  // 3. Target exists / allowed
  const targetAllowed = ALLOWED_TARGETS.some(t => 
    actionCommand?.target?.toLowerCase().includes(t.toLowerCase())
  );
  checks.push({
    label: 'Target allowed by policy',
    passed: targetAllowed,
    detail: targetAllowed
      ? `"${actionCommand.target}" matches allowed target list`
      : `"${actionCommand?.target}" not found in allowed targets`
  });
  if (!targetAllowed) valid = false;

  return { valid, checks };
}

/**
 * Execute a validated browser action locally.
 */
export function executeBrowserAction(actionCommand, onUiUpdate) {
  // Run Action Firewall validation first
  const validation = validateAction(actionCommand);

  const result = {
    executedAt: new Date().toISOString(),
    command: actionCommand,
    success: validation.valid,
    validation,
    feedback: ''
  };

  if (!validation.valid) {
    result.feedback = `Action Firewall BLOCKED: ${actionCommand?.action} → ${actionCommand?.target}. Validation failed.`;
    recordEvent({
      tabId: 0,
      origin: 'action-firewall',
      type: EVENT_TYPES.AI_REQUEST_BLOCKED,
      level: 'HIGH',
      action: 'ACTION_BLOCKED',
      summary: `Action Firewall blocked invalid action: ${actionCommand?.action}`,
      details: validation.checks.filter(c => !c.passed).map(c => c.detail).join('; '),
      securityBoundary: 'ACTION_FIREWALL'
    });
    if (onUiUpdate) onUiUpdate(result);
    return result;
  }

  switch (actionCommand.action) {
    case 'CLICK':
      if (actionCommand.target === 'Login') {
        const vaultRes = requestLocalVaultFill('password');
        result.feedback = 'Local Executor: Credential resolved from vault locally. Clicked [Login]. Authentication initiated.';
        result.vaultResolved = vaultRes;
      } else if (actionCommand.target === 'View Report') {
        result.feedback = 'Local Executor: Opened telemetry report view.';
      } else if (actionCommand.target === 'Download Report') {
        result.feedback = 'Local Executor: Triggered synthetic report download.';
      } else {
        result.feedback = `Local Executor: Clicked element "${actionCommand.target}".`;
      }
      break;

    case 'FILL_AND_LOGIN': {
      const vaultRes = requestLocalVaultFill('password');
      result.feedback = 'Local Executor: Vault resolved credential locally. Executed click on [Login]. (Zero leakage to AI)';
      result.vaultResolved = vaultRes;
      break;
    }

    default:
      result.feedback = `Local Executor: Executed action: ${actionCommand.action}`;
  }

  recordEvent({
    tabId: 0,
    origin: 'action-firewall',
    type: EVENT_TYPES.AI_REQUEST_ALLOWED,
    level: 'LOW',
    action: 'ACTION_ALLOWED',
    summary: `Action Firewall approved and executed: ${actionCommand.action} → ${actionCommand.target}`,
    details: validation.checks.map(c => `${c.passed ? '✓' : '✗'} ${c.label}`).join('; '),
    securityBoundary: 'ACTION_FIREWALL'
  });

  if (onUiUpdate) {
    onUiUpdate(result);
  }

  return result;
}
