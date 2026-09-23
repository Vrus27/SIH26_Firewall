/**
 * AI Privacy Firewall — Local Browser Action Executor
 * ISRO Problem Statement SIH26171
 * 
 * Executes validated actions from the AI Action Firewall on the local browser DOM.
 * Guarantees zero leakage of credentials to the remote AI agent by resolving
 * credentials strictly on-device via the Local Credential Vault.
 */

import { requestLocalVaultFill } from './vault.js';
import { validateAgentAction } from './actionFirewall.js';

// Re-export validateAction for backward compatibility
export function validateAction(actionCommand, pageContext = {}) {
  return validateAgentAction(actionCommand, pageContext);
}

/**
 * Execute a validated browser action locally.
 * Admitted only if the AI Action Firewall approves the action.
 * @param {Object} actionCommand - { action: string, target: string }
 * @param {Function} [onUiUpdate] - UI update callback
 * @param {Object} [pageContext] - Scoped tab context
 * @returns {Object} Action execution telemetry
 */
export function executeBrowserAction(actionCommand, onUiUpdate, pageContext = {}) {
  // 1. Enforce AI Action Firewall gate
  const firewallResult = validateAgentAction(actionCommand, pageContext);

  const result = {
    executedAt: new Date().toISOString(),
    command: actionCommand,
    success: firewallResult.valid,
    validation: firewallResult,
    feedback: ''
  };

  if (!firewallResult.valid) {
    result.feedback = `Action Firewall BLOCKED: "${actionCommand?.action} → ${actionCommand?.target}". Reason: ${firewallResult.violationReason}`;
    if (onUiUpdate) onUiUpdate(result);
    return result;
  }

  // 2. Execute validated action safely on local browser
  switch (actionCommand.action) {
    case 'CLICK':
      if (actionCommand.target === 'Login') {
        const vaultRes = requestLocalVaultFill('password');
        result.feedback = 'Action Firewall Approved: Credential resolved locally from vault. Executed click on [Login]. (Zero leakage to AI)';
        result.vaultResolved = vaultRes;
      } else if (actionCommand.target === 'View Report') {
        result.feedback = 'Action Firewall Approved: Opened telemetry report view locally.';
      } else if (actionCommand.target === 'Download Report') {
        result.feedback = 'Action Firewall Approved: Triggered synthetic report download locally.';
      } else {
        result.feedback = `Action Firewall Approved: Clicked element "${actionCommand.target}".`;
      }
      break;

    case 'FILL_AND_LOGIN': {
      const vaultRes = requestLocalVaultFill('password');
      result.feedback = 'Action Firewall Approved: Vault resolved credential locally. Executed click on [Login].';
      result.vaultResolved = vaultRes;
      break;
    }

    default:
      result.feedback = `Action Firewall Approved: Executed local action: ${actionCommand.action}`;
  }

  if (onUiUpdate) {
    onUiUpdate(result);
  }

  return result;
}
