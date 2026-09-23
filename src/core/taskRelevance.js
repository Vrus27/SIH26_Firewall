/**
 * AI Privacy Firewall — Task-Aware Minimum Context Engine
 * ISRO Problem Statement SIH26171
 * 
 * Enforces the Principle of Data Minimization:
 * "The AI agent should receive only the minimum context strictly necessary
 *  to understand and complete the specific task."
 * 
 * STRICT SAFEGUARD HIERARCHY:
 *   1. SENSITIVITY LEVEL (Critical credentials always protected)
 *   2. PRIVACY POLICY (Domain-level rules enforced)
 *   3. TASK RELEVANCE (Determines what structural controls are needed)
 *   4. MINIMUM NECESSARY CONTEXT (Prunes non-essential data)
 * 
 * FAIL-SAFE PRINCIPLE:
 * "When uncertain, prefer non-disclosure."
 * If relevance of any field is ambiguous, sanitize or block it.
 * Task relevance NEVER exposes raw sensitive credentials.
 */

/**
 * Filter and sanitize context elements based on active task intent
 * @param {Array<Object>} fusedElements - Fused multimodal elements from contextFusion.js
 * @param {string} userTask - User prompt / agent instruction (e.g. "Ask AI to log me in")
 * @param {Object} [options] - Configuration and origin scope
 * @returns {Object} Task-filtered context payload with minimization audit
 */
export function filterContextForTask(fusedElements = [], userTask = "", options = {}) {
  const normalizedTask = (userTask || "").toLowerCase();
  
  // Categorize task intent
  let taskIntent = "GENERAL_NAVIGATION";
  if (normalizedTask.includes("log") || normalizedTask.includes("sign in") || normalizedTask.includes("auth")) {
    taskIntent = "AUTHENTICATION";
  } else if (normalizedTask.includes("download") || normalizedTask.includes("export")) {
    taskIntent = "REPORT_DOWNLOAD";
  } else if (normalizedTask.includes("view") || normalizedTask.includes("telemetry") || normalizedTask.includes("report")) {
    taskIntent = "REPORT_INSPECTION";
  }

  let preservedCount = 0;
  let prunedCount = 0;
  let sensitiveProtectedCount = 0;

  const filteredElements = fusedElements.map(element => {
    const isSensitive = element.sensitivityLevel === 'CRITICAL' || element.sensitivityLevel === 'HIGH' || element.sensitivityLevel === 'MEDIUM';

    // ── RULE 1: SENSITIVITY OVERRIDES TASK RELEVANCE ──
    // Even if password is "relevant" to an auth task, the raw value is NEVER transmitted to AI.
    if (element.type === 'PASSWORD' || element.type === 'API_KEY') {
      sensitiveProtectedCount++;
      return {
        ...element,
        taskRelevance: taskIntent === 'AUTHENTICATION' ? 'TASK_RELEVANT_BUT_BLOCKED' : 'IRRELEVANT_BLOCKED',
        transmittedValue: element.sanitizedValue, // "[PASSWORD]" or "[SECRET]"
        rawTransmitted: false,
        wireStatus: "BLOCKED_FROM_AI",
        minimizationDecision: "SENSITIVITY_GUARD_ENFORCED: Credential withheld from remote model"
      };
    }

    // ── RULE 2: TASK-SPECIFIC MINIMUM CONTEXT ──
    if (taskIntent === 'AUTHENTICATION') {
      if (element.type === 'EMAIL' || element.type === 'NAME') {
        // Relevant structure needed for login, but semantic placeholder only
        preservedCount++;
        return {
          ...element,
          taskRelevance: 'TASK_RELEVANT',
          transmittedValue: element.sanitizedValue, // "[EMAIL]" / "[NAME]"
          rawTransmitted: false,
          wireStatus: "SANITIZED_FOR_AI",
          minimizationDecision: "Semantic placeholder preserved for form context"
        };
      }

      if (element.type === 'NORMAL_UI' && (element.label === 'Login' || element.label === 'Submit')) {
        preservedCount++;
        return {
          ...element,
          taskRelevance: 'PRIMARY_TASK_TARGET',
          transmittedValue: element.label,
          rawTransmitted: true,
          wireStatus: "ALLOWED_TASK_CONTROL",
          minimizationDecision: "Primary action target required for task execution"
        };
      }

      // Non-essential fields (Phone, confidential seals, other buttons) pruned for privacy
      prunedCount++;
      return {
        ...element,
        taskRelevance: 'NON_ESSENTIAL_PRUNED',
        transmittedValue: "[REDACTED_NOT_REQUIRED_FOR_TASK]",
        rawTransmitted: false,
        wireStatus: "PRUNED_BY_MINIMIZATION",
        minimizationDecision: "Excluded: Field not required to fulfill authentication task"
      };
    }

    if (taskIntent === 'REPORT_DOWNLOAD') {
      if (element.type === 'NORMAL_UI' && element.label.toLowerCase().includes('download')) {
        preservedCount++;
        return {
          ...element,
          taskRelevance: 'PRIMARY_TASK_TARGET',
          transmittedValue: element.label,
          rawTransmitted: true,
          wireStatus: "ALLOWED_TASK_CONTROL",
          minimizationDecision: "Target download button required to fulfill download task"
        };
      }

      // For download tasks, user credentials, passwords, and PII are 100% unnecessary!
      prunedCount++;
      return {
        ...element,
        taskRelevance: 'IRRELEVANT_PRUNED',
        transmittedValue: isSensitive ? element.sanitizedValue : "[REDACTED_IRRELEVANT_FOR_TASK]",
        rawTransmitted: false,
        wireStatus: "PRUNED_BY_MINIMIZATION",
        minimizationDecision: "Excluded: User identity and credentials are not required for downloading reports"
      };
    }

    // ── RULE 3: FAIL-SAFE NON-DISCLOSURE FOR UNCERTAIN TASKS ──
    if (isSensitive) {
      sensitiveProtectedCount++;
      return {
        ...element,
        taskRelevance: 'UNCERTAIN_FAIL_SAFE',
        transmittedValue: element.sanitizedValue,
        rawTransmitted: false,
        wireStatus: "SANITIZED_FAIL_SAFE",
        minimizationDecision: "Fail-safe: Intent uncertain; sensitive field sanitized"
      };
    }

    // Default UI elements for general navigation
    preservedCount++;
    return {
      ...element,
      taskRelevance: 'GENERAL_UI',
      transmittedValue: element.label || element.rawValue,
      rawTransmitted: true,
      wireStatus: "ALLOWED_GENERAL_UI",
      minimizationDecision: "Non-sensitive UI element preserved for page structure"
    };
  });

  return {
    taskIntent,
    userTask,
    totalElements: filteredElements.length,
    minimizationSummary: {
      preservedForTask: preservedCount,
      prunedForPrivacy: prunedCount,
      sensitiveProtected: sensitiveProtectedCount,
      dataReductionPercent: filteredElements.length > 0
        ? Number(((prunedCount / filteredElements.length) * 100).toFixed(0))
        : 0
    },
    filteredElements
  };
}
