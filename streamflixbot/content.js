// Signale au background quand un onglet pub est ouvert
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && /ouvrir la pub/i.test(link.textContent)) {
    chrome.runtime.sendMessage({ action: 'pubClicked' });
  }
});