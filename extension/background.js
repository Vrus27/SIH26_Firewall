/**
 * AI Privacy Firewall — Background Service Worker
 * ISRO Problem Statement SIH26171
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ firewallActive: true });
  console.log("AI Privacy Firewall extension initialized.");
});

chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
chrome.action.setBadgeText({ text: 'ON' });
