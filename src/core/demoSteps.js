/**
 * AI Privacy Firewall — 2-Minute Demo Presentation Steps
 * ISRO Problem Statement SIH26171
 * 
 * Preserves the 9-stage demonstration flow for SIH hackathon evaluation.
 */

export const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Firewall Activated (Local Boundary Active)",
    description: "The AI Privacy Firewall is toggled ON. A solid green status badge indicates active client-side interception and isolation.",
    actionName: "Activate Protection",
    view: "studio",
    protected: true,
    highlights: false
  },
  {
    step: 2,
    title: "2. Webpage Loaded with Sensitive Profile Data",
    description: "The user views their confidential operator profile (Name, Email, Phone, Password, and API Key) normally in their browser DOM.",
    actionName: "Inspect Raw DOM",
    view: "studio",
    protected: true,
    highlights: false
  },
  {
    step: 3,
    title: "3. Multi-Signal Sensitivity Classification",
    description: "On-device engine evaluates DOM input types, field labels, regex patterns, and website policy, computing explicit confidence scores.",
    actionName: "Run Classification",
    view: "studio",
    protected: true,
    highlights: false
  },
  {
    step: 4,
    title: "4. Visual Sensitivity Tags Rendered",
    description: "Elements are tagged with structured sensitivity levels: CRITICAL (99%) → BLOCK, HIGH (98%) → REDACT, MEDIUM (92%) → REDACT.",
    actionName: "Render Visual Overlays",
    view: "studio",
    protected: true,
    highlights: true
  },
  {
    step: 5,
    title: "5. Semantic-Preserving Sanitization Engine",
    description: "Sensitive values are replaced with [NAME], [EMAIL], [PASSWORD], [SECRET], preserving button actions and layout structure for AI agents.",
    actionName: "Sanitize Context",
    view: "studio",
    protected: true,
    highlights: true
  },
  {
    step: 6,
    title: "6. Original vs. Sanitized Comparison",
    description: "Side-by-side view confirms: Left shows raw user DOM; Right shows sanitized wire context dispatched to the remote AI.",
    actionName: "Open Comparison View",
    view: "comparison",
    protected: true,
    highlights: true
  },
  {
    step: 7,
    title: "7. Outbound Privacy Gate Interception",
    description: "Autonomous agent requests context scoped to Tab #12. The Outbound Gate intercepts the transmission, verifying zero secret leakage.",
    actionName: "Intercept Wire Payload",
    view: "studio",
    protected: true,
    highlights: true
  },
  {
    step: 8,
    title: "8. Remote AI Reasons on Safe Semantics",
    description: "The remote mock VLM parses [EMAIL], [PASSWORD], and [Login]. It understands the goal and returns an action: {\"action\": \"CLICK\", \"target\": \"Login\"}.",
    actionName: "Execute AI Reasoning",
    view: "studio",
    protected: true,
    highlights: true
  },
  {
    step: 9,
    title: "9. Local Browser Execution & Detailed Privacy Report",
    description: "Local browser safely clicks the button and vault resolves credentials locally. Full Privacy Report tallies protected items and cross-tab blocks.",
    actionName: "Audit Privacy Report",
    view: "report",
    protected: true,
    highlights: true
  }
];
