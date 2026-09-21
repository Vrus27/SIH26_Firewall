/**
 * AI Privacy Firewall — Content Script
 * ISRO Problem Statement SIH26171
 * 
 * Enforces visual protection indicator and client-side DOM inspection.
 */

let isProtected = true;
let bannerElement = null;

// Initialize state
chrome.storage.local.get(['firewallActive'], (result) => {
  isProtected = result.firewallActive !== undefined ? result.firewallActive : true;
  updateProtectionIndicator(isProtected);
});

// Listen for messages from extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SET_PROTECTION') {
    isProtected = request.enabled;
    updateProtectionIndicator(isProtected);
    sendResponse({ status: 'OK', isProtected });
  } else if (request.action === 'GET_DOM_AUDIT') {
    const audit = inspectCurrentPageDom();
    sendResponse({ status: 'OK', audit, isProtected });
  }
  return true;
});

function updateProtectionIndicator(active) {
  if (active) {
    document.documentElement.classList.add('ai-privacy-protected-border');
    if (!bannerElement) {
      bannerElement = document.createElement('div');
      bannerElement.className = 'ai-privacy-badge-banner';
      bannerElement.innerHTML = '🟢 AI PRIVACY PROTECTED';
      document.body.appendChild(bannerElement);
    }
  } else {
    document.documentElement.classList.remove('ai-privacy-protected-border');
    if (bannerElement) {
      bannerElement.remove();
      bannerElement = null;
    }
  }
}

function inspectCurrentPageDom() {
  const detections = [];
  const passwords = document.querySelectorAll('input[type="password"]');
  const emails = document.querySelectorAll('input[type="email"]');
  const tels = document.querySelectorAll('input[type="tel"]');

  passwords.forEach((el, idx) => {
    detections.push({ type: 'password', selector: `input[type="password"]:nth-of-type(${idx + 1})`, action: 'BLOCK' });
  });

  emails.forEach((el, idx) => {
    detections.push({ type: 'email', selector: `input[type="email"]:nth-of-type(${idx + 1})`, action: 'REDACT' });
  });

  tels.forEach((el, idx) => {
    detections.push({ type: 'phone', selector: `input[type="tel"]:nth-of-type(${idx + 1})`, action: 'REDACT' });
  });

  return {
    url: window.location.href,
    title: document.title,
    detections,
    count: detections.length
  };
}
