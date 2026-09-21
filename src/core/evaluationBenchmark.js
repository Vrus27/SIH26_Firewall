/**
 * AI Privacy Firewall — Detection Metrics & Evaluation Benchmark
 * ISRO Problem Statement SIH26171
 * 
 * Provides an empirical evaluation on a labeled synthetic test corpus
 * answering: "How do we know our sensitive-data detection works?"
 * 
 * Evaluates True Positives, False Positives, True Negatives, False Negatives,
 * Precision, Recall, and F1 Score using standard classification equations:
 * 
 *   Precision = TP / (TP + FP)
 *   Recall    = TP / (TP + FN)
 *   F1 Score  = 2 * (Precision * Recall) / (Precision + Recall)
 */

import { scanPageContext } from './detector.js';

export const SYNTHETIC_EVALUATION_CORPUS = [
  // --- 5 Ground Truth SENSITIVE Elements ---
  {
    id: "corpus-1",
    name: "Password Field",
    selector: "#user-password",
    element: "input[type=password]",
    sampleValue: "DemoPassword123",
    groundTruth: "SENSITIVE",
    expectedCategory: "CRITICAL",
    contextSignal: "HTML input type=password, Auth form"
  },
  {
    id: "corpus-2",
    name: "Email Address Field",
    selector: "#user-email",
    element: "input[type=email]",
    sampleValue: "vrushabh.demo@example.com",
    groundTruth: "SENSITIVE",
    expectedCategory: "HIGH",
    contextSignal: "HTML input type=email, RFC-5322 regex match"
  },
  {
    id: "corpus-3",
    name: "Phone Number Field",
    selector: "#user-phone",
    element: "input[type=tel]",
    sampleValue: "+91 98765 43210",
    groundTruth: "SENSITIVE",
    expectedCategory: "HIGH",
    contextSignal: "ITU-T E.164 phone pattern, label='Phone:'"
  },
  {
    id: "corpus-4",
    name: "Full Name Identifier",
    selector: "#user-fullname",
    element: "input[name=fullname]",
    sampleValue: "Vrushabh Tonge",
    groundTruth: "SENSITIVE",
    expectedCategory: "MEDIUM",
    contextSignal: "Profile form entity, label='Name:'"
  },
  {
    id: "corpus-5",
    name: "API Secret Key Token",
    selector: "#user-api-key",
    element: "div.secret-badge",
    sampleValue: "DEMO_API_KEY_123456",
    groundTruth: "SENSITIVE",
    expectedCategory: "CRITICAL",
    contextSignal: "Prefixed token format DEMO_API_KEY_*"
  },

  // --- 6 Ground Truth NON-SENSITIVE Elements ---
  {
    id: "corpus-6",
    name: "Login Submit Button",
    selector: "#btn-login",
    element: "button[type=submit]",
    sampleValue: "[ Login ]",
    groundTruth: "NON_SENSITIVE",
    expectedCategory: "LOW",
    contextSignal: "Action element, public interface control"
  },
  {
    id: "corpus-7",
    name: "View Report Navigation Button",
    selector: "#btn-view-report",
    element: "button.nav-btn",
    sampleValue: "[ View Report ]",
    groundTruth: "NON_SENSITIVE",
    expectedCategory: "LOW",
    contextSignal: "Navigation control"
  },
  {
    id: "corpus-8",
    name: "Download Report Button",
    selector: "#btn-download-report",
    element: "button.download-btn",
    sampleValue: "[ Download Report ]",
    groundTruth: "NON_SENSITIVE",
    expectedCategory: "LOW",
    contextSignal: "File download trigger"
  },
  {
    id: "corpus-9",
    name: "Dashboard Welcome Heading",
    selector: "#heading-dashboard",
    element: "h3.welcome-title",
    sampleValue: "Welcome to the dashboard.",
    groundTruth: "NON_SENSITIVE",
    expectedCategory: "LOW",
    contextSignal: "Static layout heading"
  },
  {
    id: "corpus-10",
    name: "Telemetry Header Link",
    selector: "#nav-telemetry",
    element: "a.nav-link",
    sampleValue: "Telemetry Stream v2.4",
    groundTruth: "NON_SENSITIVE",
    expectedCategory: "LOW",
    contextSignal: "Anchor link"
  },
  {
    id: "corpus-11",
    name: "Prototype Footer Notice",
    selector: "#footer-notice",
    element: "footer.disclaimer",
    sampleValue: "ISRO SIH26171 Prototype Environment",
    groundTruth: "NON_SENSITIVE",
    expectedCategory: "LOW",
    contextSignal: "Footer static text"
  }
];

/**
 * Execute detection benchmark over the ground-truth corpus
 */
export function runDetectionBenchmark(customDetectorFn = null) {
  const detector = customDetectorFn || ((data) => scanPageContext(data));

  // Run detection on the synthetic profile page representation
  const pageRepresentation = {
    name: "Vrushabh Tonge",
    email: "vrushabh.demo@example.com",
    phone: "+91 98765 43210",
    password: "DemoPassword123",
    apiKey: "DEMO_API_KEY_123456"
  };

  const detectedItems = detector(pageRepresentation);
  const detectedSelectors = new Set(detectedItems.map(d => d.selector));

  let tp = 0; // Sensitive and Detected
  let fp = 0; // Non-Sensitive but incorrectly Detected
  let tn = 0; // Non-Sensitive and NOT Detected
  let fn = 0; // Sensitive but missed by Detector

  const itemEvaluations = SYNTHETIC_EVALUATION_CORPUS.map(item => {
    const wasDetected = detectedSelectors.has(item.selector);
    let classification = "";

    if (item.groundTruth === "SENSITIVE") {
      if (wasDetected) {
        tp++;
        classification = "TRUE_POSITIVE (TP)";
      } else {
        fn++;
        classification = "FALSE_NEGATIVE (FN)";
      }
    } else {
      if (wasDetected) {
        fp++;
        classification = "FALSE_POSITIVE (FP)";
      } else {
        tn++;
        classification = "TRUE_NEGATIVE (TN)";
      }
    }

    return {
      ...item,
      wasDetected,
      classification
    };
  });

  const precision = (tp + fp) > 0 ? (tp / (tp + fp)) : 0;
  const recall = (tp + fn) > 0 ? (tp / (tp + fn)) : 0;
  const f1 = (precision + recall) > 0 ? (2 * (precision * recall) / (precision + recall)) : 0;

  return {
    executedAt: new Date().toLocaleTimeString(),
    totalElements: SYNTHETIC_EVALUATION_CORPUS.length,
    counts: {
      tp,
      fp,
      tn,
      fn
    },
    metrics: {
      precision: Number((precision * 100).toFixed(1)),
      recall: Number((recall * 100).toFixed(1)),
      f1Score: Number((f1 * 100).toFixed(1))
    },
    items: itemEvaluations
  };
}
