# streamflixbot
(function autoCoins() {
  let count = 0;
  let running = true;
  window.stopAutoCoins = () => { running = false; };

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function waitFor(fn, timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = fn();
      if (el) return el;
      await sleep(300);
    }
    return null;
  }

  async function clickCycle() {
    // ÉTAPE 1 : Bouton "Regarder une pub" — sélecteur exact
    const pubBtn = await waitFor(() =>
      Array.from(document.querySelectorAll('button'))
        .find(el => el.className.includes('bg-amber-500/10') && /regarder une pub/i.test(el.textContent))
    );
    if (!pubBtn) { console.warn('[AutoCoins] Bouton pub introuvable'); return; }
    pubBtn.click();
    console.log(`[AutoCoins] ✅ Cycle ${++count} — Clic "Regarder une pub"`);

    // ÉTAPE 2 : Attendre le lien "Ouvrir la pub dans un nouvel onglet"
    const openLink = await waitFor(() =>
      Array.from(document.documentElement.querySelectorAll('a'))
        .find(el => /ouvrir la pub/i.test(el.textContent.trim()))
    , 15000);

    if (!openLink) {
      console.warn('[AutoCoins] Lien introuvable — fermeture modal');
      const closeBtn = Array.from(document.documentElement.querySelectorAll('button'))
        .find(b => b.textContent.trim() === 'Fermer');
      if (closeBtn) closeBtn.click();
      return;
    }

    // Intercepter window.open
    const origOpen = window.open;
    let newTab = null;
    window.open = (...args) => { newTab = origOpen.apply(window, args); return newTab; };

    openLink.click();
    console.log('[AutoCoins] 🔗 Clic "Ouvrir la pub"');
    await sleep(2500);
    window.open = origOpen;

    // ÉTAPE 3 : Fermer le nouvel onglet
    if (newTab && !newTab.closed) {
      newTab.close();
      console.log('[AutoCoins] ❌ Onglet fermé');
    } else {
      console.warn('[AutoCoins] ⚠️ Onglet non fermé — active les popups pour streamflix.mom');
    }

    // ÉTAPE 4 : Fermer le modal
    await sleep(500);
    const closeBtn = Array.from(document.documentElement.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Fermer');
    if (closeBtn) { closeBtn.click(); console.log('[AutoCoins] 🚪 Modal fermé'); }

    await sleep(3000);
  }

  async function loop() {
    console.log('[AutoCoins] 🚀 Démarré — stopAutoCoins() pour arrêter');
    while (running) await clickCycle();
  }

  loop();
})();
