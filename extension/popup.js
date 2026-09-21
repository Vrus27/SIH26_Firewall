document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleSwitch');
  const statusLabel = document.getElementById('statusLabel');
  const protVal = document.getElementById('protVal');
  const openStudioBtn = document.getElementById('openStudioBtn');

  // Load saved state
  chrome.storage.local.get(['firewallActive'], (res) => {
    const active = res.firewallActive !== undefined ? res.firewallActive : true;
    toggle.checked = active;
    updateUI(active);
  });

  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.local.set({ firewallActive: isEnabled });
    updateUI(isEnabled);

    // Update active badge
    chrome.action.setBadgeText({ text: isEnabled ? 'ON' : 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: isEnabled ? '#10b981' : '#64748b' });

    // Inform content script in active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'SET_PROTECTION', enabled: isEnabled });
      }
    });
  });

  openStudioBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' });
  });

  function updateUI(active) {
    if (active) {
      statusLabel.textContent = '🟢 ACTIVE (ON)';
      statusLabel.className = 'status-text';
      protVal.textContent = 'ON';
      protVal.style.color = '#34d399';
    } else {
      statusLabel.textContent = '⚪ DISABLED (OFF)';
      statusLabel.className = 'status-text off';
      protVal.textContent = 'OFF';
      protVal.style.color = '#94a3b8';
    }
  }
});
