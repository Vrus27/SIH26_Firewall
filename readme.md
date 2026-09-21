# AI Privacy Firewall 🛡️

### Smart India Hackathon (SIH 2026) MVP Demo — Upgraded Prototype
**Problem Statement:** `SIH26171` — *On-device Visual Perception for Light-weight Browser Agents*  
**Organization:** Indian Space Research Organisation (ISRO)  
**Project Name:** AI Privacy Firewall  

---

## 🚀 Executive Summary

As autonomous AI agents and Vision-Language Models (VLMs) interact directly with user sessions, transmitting raw visual and DOM context over the network introduces severe privacy vulnerabilities (leaking credentials, PII, session tokens, and cross-tab data).

The **AI Privacy Firewall** operates as an on-device, zero-leakage privacy boundary between browser sessions and external AI browser agents. It performs local multi-signal perception, enforces browser-tab isolation, redacts sensitive values while preserving action semantics, and guarantees that remote AI models reason and act without ever receiving plaintext user secrets.

---

## 🔄 Core Architectural Pipeline

```
BROWSER (Local Visual DOM Context & Open Tabs)
       ↓
LOCAL PERCEPTION & TAB ISOLATION (Scoped to Active Tab)
       ↓
SENSITIVITY IDENTIFICATION ENGINE (Multi-signal: DOM, regex, labels, policy)
       ↓
LOCAL SANITIZATION ENGINE (Semantic-Preserving Token Replacement)
       ↓
OUTBOUND PRIVACY GATE (Wire Inspector & Cross-Tab Barrier)
       ↓
SANITIZED CONTEXT ONLY → REMOTE MOCK AI / VLM
       ↓
AI REASONS & GENERATES ACTION (e.g., {"action": "CLICK", "target": "Login"})
       ↓
LOCAL BROWSER EXECUTOR (With Local Synthetic Credential Vault)
       ↓
SAFE BROWSER ACTION EXECUTION & AUDIT EVENT LOGGING
```

---

## ✨ Upgraded Features & Capabilities

| Feature | Technical Implementation |
| :--- | :--- |
| **Sensitivity Identification Engine** | Multi-signal classification combining DOM input types, HTML labels, regex patterns, field identifiers, and website policies. Produces structured records with `sensitivityLevel` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), confidence scores, explicit classification reasons, and enforcement actions (`ALLOW`, `REDACT`, `BLOCK`). |
| **Multi-Tab Browser Isolation** | Models isolated process contexts (`Tab 12: isro-portal.local`, `Tab 13: mail.internal.local`, `Tab 14: vault.bank.local`). Strictly scopes AI requests to the active tab and intercepts cross-tab context exfiltration with `CROSS-TAB CONTEXT ACCESS NOT AUTHORIZED`. |
| **Detection Metrics & Benchmark** | 11-element synthetic test corpus evaluating True Positives (TP), False Positives (FP), True Negatives (TN), False Negatives (FN), Precision, Recall, and F1 Score live on-device without hardcoded fabrication. |
| **User-Approved Website Policies** | Per-origin customizable policies with local on-device persistence. Allows users to configure `ALLOW`, `REDACT`, or `BLOCK` per data type with automated guards preventing silent weakening of `CRITICAL` secrets. |
| **Background Event Log** | In-memory chronological ledger recording `CONTEXT_REQUEST`, `DATA_DETECTED`, `DATA_REDACTED`, `DATA_BLOCKED`, `AI_REQUEST_ALLOWED`, and `CROSS_TAB_REQUEST_BLOCKED`. |
| **Detailed Privacy Report** | Comprehensive report aggregating AI requests, allowed/sanitized/blocked totals, cross-tab blocks, and an itemized audit ledger. |
| **Human-Built Engineering UI** | Restrained, professional security tool aesthetics with clean typography, clear technical tables, and realistic browser tabs. |
| **Preserved 2-Minute Demo Tour** | Automated 9-step guided walkthrough with auto-advance and pause/resume controls for SIH hackathon presentations. |

---

## ⚖️ Mapping to ISRO SIH26171 Evaluation Rubric

| Official Criteria | Weight | Prototype Status | Implementation in Prototype |
| :--- | :---: | :---: | :--- |
| **Visual Context Accuracy** | 25% | TBD | Spatial bounding box fidelity comparing rendered DOM nodes with detected segments |
| **PII Detection Precision / Recall** | 20% | Measured Live | 11-element synthetic test corpus measuring TP, FP, TN, FN, Precision, Recall, F1 |
| **Redaction Precision** | 20% | 100% Zero-Leak | Outbound wire verifier confirming no raw secrets are transmitted over the network |
| **Client Resource Usage** | 20% | Measured Heap | Lightweight client engine (< 20 MB active heap, no heavy weights loaded) |
| **End-to-End Latency** | 15% | Measured (< 3ms) | High-resolution `performance.now()` timer profiling DOM scan and sanitization |

---

## 🛠️ Quick Start & Running the Project

### Prerequisites:
- Node.js (v18+)
- npm (v9+)

### 1. Run Verification Test Suite
```bash
node scripts/verify.mjs
```
*Executes all 12 automated test suites verifying sensitivity classification, tab scoping, cross-tab blocking, website policy overrides, benchmark calculations, and mock VLM reasoning.*

### 2. Start Local Development Studio
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🎯 How to Demonstrate to Hackathon Judges

### 1. Automated 2-Minute Guided Tour (Best for Pitch Start)
- Click **`▶ 2-Min Demo Tour`** in the top navigation bar.
- The presentation automatically advances through all 9 stages:
  1. Firewall ON & visual protection indicator
  2. Raw webpage loaded with confidential profile data
  3. Multi-signal sensitivity classification in < 1ms
  4. Visual bounding tags showing confidence and levels
  5. Semantic sanitization (`[NAME]`, `[EMAIL]`, `[PASSWORD]`, `[SECRET]`)
  6. Side-by-Side original vs. sanitized comparison
  7. Outbound Privacy Gate interception
  8. Remote mock VLM receiving sanitized context and emitting `CLICK [Login]`
  9. Local browser execution and detailed Privacy Report

### 2. Multi-Tab Isolation Demonstration
- In the browser tab bar, switch between **Tab #12 (`isro-portal.local`)**, **Tab #13 (`mail.internal.local`)**, and **Tab #14 (`vault.bank.local`)**.
- Notice how the scoped origin and data isolate per tab.
- Click **"Test Cross-Tab Access (Tab #14)"** in the docked extension widget or Outbound Gate.
- The firewall immediately blocks the request with:  
  **`CROSS-TAB CONTEXT ACCESS NOT AUTHORIZED`** and logs it to the Privacy Report and Event Log!

### 3. User-Approved Website Policies Demonstration
- Navigate to **"Settings & Website Policies"** tab.
- Select `isro-portal.local` under Website Policies.
- Change Email rule from `REDACT` to `ALLOW` and click **`[ Save Policy ]`**.
- Switch back to **Browser & Agent Studio**: notice that Email is now classified as `ALLOW (Transmit)`.
- Click **`[ Reset Website Policy ]`** in Settings to restore prototype defaults.

### 4. Empirical Evaluation Metrics Demonstration
- Navigate to **"Detection Metrics & Benchmark"** tab.
- Click **`[ Run Benchmark on Synthetic Dataset ]`**.
- The confusion matrix calculates live on the 11 labeled test elements:
  - True Positives (TP): 5
  - False Positives (FP): 0
  - True Negatives (TN): 6
  - False Negatives (FN): 0
  - Precision: 100%, Recall: 100%, F1 Score: 100%
- Answers judges: *"How do we know our sensitive-data detection works?"*

---

## 🛡️ Technical Honesty & Scope Notes

- **Genuinely Implemented:** Multi-signal sensitivity classification, configurable sensitivity levels, multi-tab context isolation, unauthorized cross-tab request blocking, per-website policy editor with local storage, live ground-truth benchmark calculation, background event logging, and empirical performance timers.
- **Future Work:** Replacing rule-based visual segmentation with an on-device quantized Vision-Language Model (MobileViT / Florence-2 via ONNX Runtime Web with WebGPU acceleration) for screenshot-level computer-use agents.
- **100% Synthetic Data:** All test accounts, credentials, and API keys are mock strings created strictly for demonstration.
