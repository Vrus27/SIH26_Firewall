# AI Privacy Firewall 🛡️
## Comprehensive Project Report & Code Walkthrough

**Problem Statement:** `SIH26171` — *On-device Visual Perception for Light-weight Browser Agents*  
**Organization:** Indian Space Research Organisation (ISRO)  
**Project Name:** AI Privacy Firewall  
**Target Event:** Smart India Hackathon (SIH 2026)  
**Document Purpose:** Teammate onboarding, architectural deep-dive, code walkthrough, and SIH pitch presentation guide.

---

## Table of Contents
1. [Executive Summary & Core Idea](#1-executive-summary--core-idea)
2. [How Our Solution Solves ISRO Problem Statement SIH26171](#2-how-our-solution-solves-isro-problem-statement-sih26171)
3. [The Central Architecture Pipeline](#3-the-central-architecture-pipeline)
4. [Complete Code Walkthrough by File & Module](#4-complete-code-walkthrough-by-file--module)
   - [Core Engines (`src/core/`)](#core-engines-srccore)
   - [Mock AI Agent (`src/mockAI/`)](#mock-ai-agent-srcmockai)
   - [UI Components (`src/components/`)](#ui-components-srccomponents)
   - [Standalone Chrome Extension (`extension/`)](#standalone-chrome-extension-extension)
5. [Data Flow: Step-by-Step Execution Lifecycle](#5-data-flow-step-by-step-execution-lifecycle)
6. [Evaluation Rubric & Benchmark Methodology](#6-evaluation-rubric--benchmark-methodology)
7. [How to Run, Test, and Verify the Project](#7-how-to-run-test-and-verify-the-project)
8. [SIH Hackathon Pitch & Presentation Script (Under 2 Minutes)](#8-sih-hackathon-pitch--presentation-script-under-2-minutes)
9. [Technical Honesty: Current Prototype vs. Future Roadmap](#9-technical-honesty-current-prototype-vs-future-roadmap)

---

## 1. Executive Summary & Core Idea

Modern autonomous AI agents (such as Vision-Language Models, Claude Computer Use, and browser copilots) require full access to the user's browser viewport and DOM tree to navigate websites and execute tasks. However, this creates a catastrophic privacy dilemma:
- **The Danger:** Transmitting raw screenshots or raw HTML context to third-party cloud AI servers exposes user passwords, personal identifiable information (PII), session tokens, bank balances, and confidential enterprise telemetry.
- **The Breakthrough:** The **AI Privacy Firewall** acts as a **trusted, zero-leakage local privacy boundary** operating on-device between the user's browser and the external AI agent.
- **The Core Guarantee:** The AI model still fully understands the webpage semantics and layout to successfully execute actions (e.g. clicking buttons, navigating tabs), but **never receives plaintext credentials or private user secrets**.

---

## 2. How Our Solution Solves ISRO Problem Statement SIH26171

ISRO's Problem Statement **SIH26171** focuses on:
> *"On-device Visual Perception for Light-weight Browser Agents"*

### The 5 Official Evaluation Criteria & How We Address Them:

| SIH26171 Metric | Weight | The Challenge | Our Firewall Solution |
| :--- | :---: | :--- | :--- |
| **Visual Context Accuracy** | **25%** | Preserving page layout and button locations so the AI agent doesn't get confused. | Replaces sensitive strings with standardized tokens (`[NAME]`, `[EMAIL]`, `[PASSWORD]`, `[SECRET]`) while preserving 100% of DOM tags, button labels, and accessibility trees. |
| **PII Detection Precision / Recall** | **20%** | Accurately detecting personal data without false alarms or misses. | Built an empirical 11-element synthetic test corpus (`evaluationBenchmark.js`) measuring True Positives, False Positives, True Negatives, and False Negatives, achieving 100% F1-score on benchmarked synthetic patterns. |
| **Redaction Precision** | **20%** | Zero raw secret leakage over the network wire. | The Outbound Privacy Gate intercepts wire payloads before dispatch; verified 0 unshielded secret transmissions. |
| **Client-Side Resource Usage** | **20%** | Running on lightweight client hardware without bogging down the browser. | Pure client-side JavaScript engine consuming **< 20 MB active JS heap**, avoiding heavy multi-gigabyte neural weights on client memory. |
| **End-to-End Latency** | **15%** | Avoiding sluggish page lag. | High-resolution `performance.now()` benchmarking proves local DOM scan and sanitization executes in **< 1.0 ms**, leaving ample headroom for network roundtrip. |

---

## 3. The Central Architecture Pipeline

The system operates on an immutable 7-stage architectural lifecycle:

```
[1] SEE LOCALLY
    The browser loads HTML DOM, styles, and rendered visual context into client memory.
         ↓
[2] DETECT LOCALLY
    Multi-signal classifier inspects input types, labels, regex, and website policy.
         ↓
[3] PROTECT LOCALLY
    Enforces browser-tab process isolation and routes credentials to the local vault.
         ↓
[4] SANITIZE LOCALLY
    Replaces sensitive text with semantic tokens while leaving buttons and layout intact.
         ↓
[5] SEND SAFE CONTEXT
    Outbound Privacy Gate audits payload; only clean semantic wire JSON is transmitted.
         ↓
[6] REMOTE AI REASONS
    External VLM parses tokens and emits a structured command (e.g. CLICK "Login").
         ↓
[7] LOCAL BROWSER ACTS
    Local browser executor receives command, fills password via local vault, and clicks!
```

---

## 4. Complete Code Walkthrough by File & Module

### Project Directory Structure
```
e:\SIH\
├── package.json                   // Dependencies (React 18, Vite, TailwindCSS, Lucide)
├── vite.config.js                 // Vite bundler configuration
├── tailwind.config.js             // Tailwind color & typography configuration
├── scripts/
│   └── verify.mjs                 // 12-suite automated verification script
├── extension/                     // Standalone Chrome Extension (Manifest V3)
│   ├── manifest.json              // Extension manifest
│   ├── background.js              // Service worker
│   ├── content.js & content.css   // In-page visual boundary & DOM auditor
│   └── popup.html & popup.js      // Clean extension popup UI
└── src/
    ├── main.jsx                   // React root render
    ├── App.jsx                    // Master state coordinator & tab router
    ├── index.css                  // Restrained engineering CSS styling
    ├── mockAI/
    │   └── mockVlmAgent.js        // Simulated remote VLM agent
    ├── core/
    │   ├── detector.js            // Sensitivity Identification Engine
    │   ├── sanitizer.js           // Semantic-preserving token replacer
    │   ├── tabs.js                // Multi-tab isolation & cross-tab barrier
    │   ├── policies.js            // Configurable sensitivity levels & website policies
    │   ├── eventLog.js            // Background security event ledger
    │   ├── evaluationBenchmark.js // Ground-truth confusion matrix & metrics
    │   ├── vault.js               // Synthetic local credential store
    │   ├── executor.js            // Local DOM action runner
    │   ├── profiler.js            // Live performance latency timer
    │   └── demoSteps.js           // 9-step automated presentation tour data
    └── components/
        ├── TopNavbar.jsx          // Navigation, protection toggle, scope badges
        ├── SimulatedBrowser.jsx   // Multi-tab browser viewport & profile page
        ├── FirewallExtension.jsx  // Docked extension widget with quick stats
        ├── SideBySideView.jsx     // Original vs. Sanitized comparison diff
        ├── OutboundGateModal.jsx  // Wire payload inspector & cross-tab simulator
        ├── PrivacyReport.jsx      // Detailed Brave-style audit report
        ├── SettingsView.jsx       // Data rules, per-website policy editor, event log
        ├── EvaluationView.jsx     // Live benchmark runner & confusion matrix
        ├── PresentationMode.jsx   // 2-minute automated tour overlay
        └── ArchitectureFlow.jsx   // 7-stage visual pipeline & ISRO criteria map
```

---

### Core Engines (`src/core/`)

#### 1. `src/core/detector.js` — Sensitivity Identification Engine
- **Purpose:** Replaces simple regex with a multi-signal classification engine.
- **Key Function:** `scanPageContext(pageData, options)`
- **How it works:**
  - Evaluates 6 distinct signals: DOM input type (`type="password"`, `type="email"`, `type="tel"`), HTML labels (`label[for]`), field IDs/names, regex patterns (RFC-5322, E.164 phone, API key prefixes), script context, and user-defined website policies.
  - Outputs structured records conforming to the required schema:
    ```json
    {
      "id": "det-1",
      "type": "EMAIL",
      "element": "input[type=email]#user-email",
      "sensitivityLevel": "HIGH",
      "confidence": 0.98,
      "reasons": [
        "Matches RFC-5322 email regular expression",
        "HTML input type=\"email\"",
        "Associated with label \"Email:\""
      ],
      "action": "REDACT",
      "rawValue": "vrushabh.demo@example.com",
      "sanitizedValue": "[EMAIL]"
    }
    ```

#### 2. `src/core/sanitizer.js` — Semantic Sanitization Engine
- **Purpose:** Converts the raw DOM context into a safe wire JSON payload.
- **Key Function:** `sanitizeContext(rawPageData, detections, isProtected, options)`
- **How it works:**
  - When `isProtected === true`, maps every detected sensitive field to its semantic token (`[NAME]`, `[EMAIL]`, `[PHONE]`, `[PASSWORD]`, `[SECRET]`).
  - Tags the payload with explicit tab scoping: `tabId: 12`, `origin: "isro-portal.local"`, `contextScope: "current-tab"`.
  - Leaves normal buttons (`[Login]`, `[View Report]`, `[Download Report]`) completely intact (`sensitivity: "LOW"`, `action: "ALLOW"`).
  - When `isProtected === false`, generates an unshielded payload with `rawLeakageDetected: true` to demonstrate the security danger of disabling the firewall.

#### 3. `src/core/tabs.js` — Multi-Tab Isolation Engine
- **Purpose:** Solves the critical requirement that protecting one tab must not allow AI agents to snoop on other open tabs.
- **Key Function:** `verifyTabContextAccess(requestingScope, requestedTabId)`
- **How it works:**
  - Manages three isolated browser tabs:
    - **Tab #12:** `isro-portal.local` (Operator profile & telemetry)
    - **Tab #13:** `mail.internal.local` (Internal operator email communications)
    - **Tab #14:** `vault.bank.local` (Institutional financial authorization)
  - When an AI agent scoped to Tab #12 attempts to access Tab #14, the firewall blocks the request with:  
    `CROSS-TAB CONTEXT ACCESS NOT AUTHORIZED` and logs a critical event.

#### 4. `src/core/policies.js` — Policy & Sensitivity Levels Engine
- **Purpose:** Defines prototype sensitivity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), privacy modes (`BALANCED`, `STRICT`, `CUSTOM`), and user-approved per-website policies.
- **Key Functions:** `getPolicyForOrigin()`, `savePolicyForOrigin()`, `resetPolicyForOrigin()`
- **Safety Guard:** Automated guard prevents users from accidentally weakening `CRITICAL` passwords or API keys to `ALLOW`.

#### 5. `src/core/eventLog.js` — Background Security Event Ledger
- **Purpose:** Background-first security logging without spamming the user.
- **Key Functions:** `recordEvent()`, `getEvents()`
- **Tracks:** `CONTEXT_REQUEST`, `DATA_DETECTED`, `DATA_REDACTED`, `DATA_BLOCKED`, `AI_REQUEST_ALLOWED`, and `CROSS_TAB_REQUEST_BLOCKED`.

#### 6. `src/core/evaluationBenchmark.js` — Empirical Detection Metrics
- **Purpose:** Answers the jury's question: *"How do we know your detection actually works?"*
- **Key Function:** `runDetectionBenchmark()`
- **Corpus:** 11 ground-truth elements (5 sensitive, 6 non-sensitive).
- **Calculations:**
  $$\text{Precision} = \frac{TP}{TP + FP}$$
  $$\text{Recall} = \frac{TP}{TP + FN}$$
  $$\text{F1 Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

#### 7. `src/core/vault.js` — Synthetic Local Credential Vault
- **Purpose:** Demonstrates zero-knowledge authentication delegation.
- **Principle:** The remote AI asks to "Login". The local vault populates the password input strictly inside the local browser DOM. The password never travels over the network wire to the AI model.

#### 8. `src/core/executor.js` — Local Browser Action Executor
- **Purpose:** Receives structured commands from the AI (e.g. `{"action": "CLICK", "target": "Login"}`) and simulates authentic user interaction on the DOM with feedback notifications.

#### 9. `src/core/profiler.js` — Empirical Performance Profiler
- **Purpose:** Measures actual execution times via `performance.now()`.
- **Honesty:** Avoids hardcoding fake numbers; records genuine microsecond execution timings (< 1ms client DOM scan).

---

### Mock AI Agent (`src/mockAI/`)

#### `src/mockAI/mockVlmAgent.js`
- Simulates an external Vision-Language Model (e.g. Claude 3.5 Sonnet Computer Use or an ISRO-specific VLM).
- **Key Function:** `processAiTask(sanitizedPayload, userGoal, options)`
- **Behavior:**
  1. Checks if the request attempts cross-tab access outside `contextScope: "current-tab"`. If so, returns `CROSS_TAB_BLOCKED`.
  2. Inspects payload: if firewall is OFF, flags `SECURITY_WARNING` (raw data exposed).
  3. If protected, reasons on sanitized tokens (`[EMAIL]`, `[PASSWORD]`) and returns a clean action: `{"action": "CLICK", "target": "Login"}`.

---

### UI Components (`src/components/`)

1. **`App.jsx`**: Master coordinator connecting multi-tab state, website policies, dynamic telemetry, event logs, and navigation views.
2. **`TopNavbar.jsx`**: Restrained engineering header with active tab scope (`Tab #12 (isro-portal.local)`), privacy mode badge, firewall ON/OFF switch, and `▶ 2-Min Demo Tour` button.
3. **`SimulatedBrowser.jsx`**: Browser chrome with clickable tab headers (Tabs 12, 13, 14), address bar, visual status border (`🟢 AI PRIVACY PROTECTED` / `⚪ PRIVACY FIREWALL OFF`), synthetic profile form, and clickable classification reasoning popups (`ℹ️`).
4. **`FirewallExtension.jsx`**: Compact, background-first docked widget showing active tab scope, privacy mode selector, quick counts (Detected, Blocked, Redacted), and the "Test Cross-Tab Access" button.
5. **`SideBySideView.jsx`**: High-impact split comparison showing Original Local Context on the left vs. Sanitized Context Sent to AI on the right, with format toggling between Text and JSON.
6. **`OutboundGateModal.jsx`**: Wire-level payload inspector confirming zero-leakage and offering a 1-click "Test Cross-Tab Exfiltration" simulation.
7. **`PrivacyReport.jsx`**: Detailed Brave-style report featuring session totals (AI requests, allowed, sanitized, blocked, cross-tab blocks) and a chronological event ledger.
8. **`SettingsView.jsx`**: Clean settings panel with Global Data Rules, per-website policy editor (`[Save Policy]`, `[Reset Website Policy]`), and background event log viewer.
9. **`EvaluationView.jsx`**: Live benchmark runner displaying Confusion Matrix counts (TP, FP, TN, FN), Precision, Recall, F1 score, and the ISRO SIH26171 rubric map.
10. **`PresentationMode.jsx`**: 9-step automated 2-minute demonstration overlay with auto-advance and step timers.
11. **`ArchitectureFlow.jsx`**: 7-stage visual pipeline diagram mapping directly to the 6 ISRO SIH requirements.

---

### Standalone Chrome Extension (`extension/`)

The repository includes a complete, unpackable Google Chrome Extension (Manifest V3):
- **`manifest.json`**: Configures permissions (`activeTab`, `storage`, `scripting`) and registers content scripts and background service worker.
- **`content.js` & `content.css`**: Injects the subtle green protection border (`🟢 AI PRIVACY PROTECTED`) and inspects tab DOM.
- **`popup.html` & `popup.js`**: Clean extension popup with master toggle and quick telemetry counters.
- **`background.js`**: Service worker managing badge status (`ON`/`OFF`).

---

## 5. Data Flow: Step-by-Step Execution Lifecycle

Here is what happens under the hood when a user asks an AI agent:  
*"Find the Login button and log me in."*

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Presenter
    participant Browser as Local Browser (DOM)
    participant Detector as Sensitivity Engine
    participant Sanitizer as Sanitizer Engine
    participant Gate as Outbound Privacy Gate
    participant AI as Remote Mock VLM
    participant Vault as Local Credential Vault
    participant Executor as Browser Executor

    User->>Browser: Opens Profile Page (Tab #12)
    Browser->>Detector: Extracts DOM nodes & attributes
    Detector->>Detector: Evaluates signals (type, label, regex, policy)
    Detector-->>Sanitizer: Returns structured records (CRITICAL, HIGH, etc.)
    
    User->>Gate: Triggers Agent Task: "Log me in"
    Gate->>Gate: Verifies Tab Scope (Tab #12 === Active Tab)
    Sanitizer->>Gate: Generates Wire Payload ([PASSWORD], [EMAIL], [Login])
    Gate->>AI: Transmits Sanitized JSON (Zero raw secrets)
    
    AI->>AI: Parses layout semantics & identifies button [Login]
    AI-->>Executor: Emits Action: {"action": "CLICK", "target": "Login"}
    
    Executor->>Vault: Delegates credential fill on-device
    Vault-->>Browser: Populates password field locally (No network egress)
    Executor->>Browser: Dispatches CLICK event on [Login] button
    Browser-->>User: Displays authentication success feedback!
```

---

## 6. Evaluation Rubric & Benchmark Methodology

Our benchmark suite (`src/core/evaluationBenchmark.js`) executes directly on an 11-element synthetic test corpus:

### Benchmark Corpus Breakdown:
- **Sensitive Elements (5 Ground Truth):**
  1. `#user-password` (`input[type=password]`) → Classified as `CRITICAL`
  2. `#user-email` (`input[type=email]`) → Classified as `HIGH`
  3. `#user-phone` (`input[type=tel]`) → Classified as `HIGH`
  4. `#user-fullname` (`input[name=fullname]`) → Classified as `MEDIUM`
  5. `#user-api-key` (`DEMO_API_KEY_*`) → Classified as `CRITICAL`
- **Non-Sensitive Elements (6 Ground Truth):**
  6. `#btn-login` (Button) → `LOW (ALLOW)`
  7. `#btn-view-report` (Button) → `LOW (ALLOW)`
  8. `#btn-download-report` (Button) → `LOW (ALLOW)`
  9. `#heading-dashboard` (Heading) → `LOW (ALLOW)`
  10. `#nav-telemetry` (Anchor Link) → `LOW (ALLOW)`
  11. `#footer-notice` (Footer text) → `LOW (ALLOW)`

### Confusion Matrix Results:
- **True Positives (TP):** 5 (All sensitive items detected)
- **False Positives (FP):** 0 (No normal buttons or links incorrectly flagged)
- **True Negatives (TN):** 6 (All normal UI elements allowed)
- **False Negatives (FN):** 0 (Zero sensitive items missed)
- **Precision:** $\frac{5}{5 + 0} = 100\%$
- **Recall:** $\frac{5}{5 + 0} = 100\%$
- **F1 Score:** $2 \times \frac{1.0 \times 1.0}{1.0 + 1.0} = 100\%$

---

## 7. How to Run, Test, and Verify the Project

### 1. Verification Test Suite
Run the automated test suite in PowerShell:
```powershell
cd e:\SIH
node scripts/verify.mjs
```
**Output:** All 12 test suites pass with green checkmarks.

### 2. Start the Interactive Demo Studio
```powershell
npm run dev
```
Open **`http://localhost:3000`** in Google Chrome or Microsoft Edge.

### 3. Build for Production
```powershell
npm run build
```
Vite bundles all assets in ~3 seconds with zero errors.

### 4. Load the Chrome Extension Unpacked
1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked** and select `e:\SIH\extension`.

---

## 8. SIH Hackathon Pitch & Presentation Script (Under 2 Minutes)

When presenting to ISRO judges, follow this concise script:

```text
"Respected Judges, we are presenting AI Privacy Firewall for ISRO Problem Statement SIH26171:
'On-device Visual Perception for Light-weight Browser Agents.'

[Point to Screen]
As autonomous browser agents take over web navigation, they demand full view of the DOM.
If an agent sends raw screenshots or HTML to a cloud VLM, user passwords, confidential telemetry,
and PII leak over the wire.

Our solution establishes a trusted, zero-leakage local privacy boundary right on the user's machine.

[Click: '▶ 2-Min Demo Tour']
Watch our 7-stage architectural pipeline in real-time:
1. The firewall activates an on-device protective perimeter.
2. The user sees their confidential profile normally.
3. Our Sensitivity Engine evaluates DOM types, labels, and regex in under 1 millisecond.
4. It classifies items into LOW, MEDIUM, HIGH, and CRITICAL with explicit confidence scores.
5. Our Sanitizer preserves the button layout and structure, but redacts secrets into tokens:
   [NAME], [EMAIL], [PASSWORD], and [SECRET].
6. [Show Side-by-Side Diff] The remote AI sees this clean semantic representation.
7. The external AI model reasons on the sanitized tokens and commands: CLICK 'Login'.
8. Our local browser executor delegates password entry to the Local Vault and clicks the button.
   Zero raw credentials ever left the device!

[Demonstrate Killer Feature: Multi-Tab Isolation]
Notice our browser tabs: Tab 12 is ISRO Portal, Tab 14 is Bank.
When an AI agent tries to snoop across tabs, our firewall instantly blocks it:
'CROSS-TAB CONTEXT ACCESS NOT AUTHORIZED'.

[Show Evaluation Tab]
We evaluated our classifier on an 11-element ground truth corpus:
100% precision, 100% recall, zero leakage, and sub-millisecond latency.

AI Privacy Firewall delivers the privacy perimeter needed for the next generation of browser agents.
Thank you!"
```

---

## 9. Technical Honesty: Current Prototype vs. Future Roadmap

To maintain academic and competitive integrity during SIH evaluation, be transparent about what is built today versus our roadmap:

### What Is Genuinely Implemented Today (MVP):
- Multi-signal sensitivity classification (DOM input types, labels, IDs, regex patterns, website policies)
- Structured sensitivity records with confidence scores and multi-factor reasons
- Semantic-preserving token sanitization (`[NAME]`, `[EMAIL]`, `[PASSWORD]`, `[SECRET]`)
- Multi-tab browser isolation simulation and cross-tab request interception
- User-approved per-website privacy policy editor with local storage
- Synthetic ground-truth evaluation benchmark calculating live TP/FP/TN/FN, Precision, Recall, and F1
- Background security event ledger and detailed Brave-style privacy report
- Live performance profiling using `performance.now()` (< 1ms client DOM scan time)
- Synthetic Local Credential Vault demonstrating zero-knowledge auth delegation

### Future Production Roadmap (Post-Hackathon):
- **WebGPU-Accelerated Lightweight Vision Model:** Integrating ONNX Runtime Web and quantized MobileViT / Florence-2 models directly inside the browser extension to perform spatial visual perception on raw HTML5 `<canvas>` and screenshots when DOM access is restricted.
- **Enterprise Central Policy Distribution:** Syncing website privacy policies via enterprise MDM or organizational PKI certificates.
- **100% Synthetic Data Policy:** All sample names, emails, passwords, and tokens used in this demo (`Vrushabh Tonge`, `DemoPassword123`, `DEMO_API_KEY_123456`) are synthetic test strings created strictly for demonstration.
