chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'pubClicked') {
    // Attendre 2 secondes puis fermer le dernier onglet ouvert
    setTimeout(async () => {
      const tabs = await chrome.tabs.query({});
      // Fermer tous les onglets qui ne sont pas streamflix
      tabs.forEach(tab => {
        if (!tab.url.includes('streamflix.mom')) {
          chrome.tabs.remove(tab.id);
        }
      });
    }, 2000);
  }
});