// PedalTest Studio — routing (hash) między katalogiem a podstroną kostki + i18n.

import { renderCatalog } from './catalog.js';
import { renderConfigurator, stopPlayback } from './configurator.js';
import { t, setLang, applyStatic, onLangChange } from './i18n.js';

let pedals = [];

const viewCatalog = document.getElementById('view-catalog');
const viewPedal = document.getElementById('view-pedal');

function route() {
  const match = location.hash.match(/^#\/pedal\/([\w-]+)$/);
  const pedal = match ? pedals.find((p) => p.id === match[1]) : null;

  stopPlayback();
  // podstrona kostki ma własny wariant nawigacji/stopki
  document.body.classList.toggle('pedal-view', !!pedal);
  if (pedal) {
    renderConfigurator(pedal);
    viewCatalog.hidden = true;
    viewPedal.hidden = false;
    window.scrollTo({ top: 0 });
    document.title = `${pedal.manufacturer} ${pedal.name} — PedalTest Studio`;
  } else {
    viewCatalog.hidden = false;
    viewPedal.hidden = true;
    document.title = t('doc.title');
  }
}

async function init() {
  applyStatic(); // EN jako wersja bazowa; wybór zapamiętany w localStorage
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  onLangChange(() => route()); // przerysowuje bieżący widok w nowym języku

  try {
    const res = await fetch('/api/pedals');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    pedals = await res.json();
  } catch (err) {
    document.querySelector('.catalog-hint').textContent = t('catalog.error');
    viewCatalog.hidden = false;
    return;
  }
  renderCatalog(pedals);
  window.addEventListener('hashchange', route);
  route();
}

init();
