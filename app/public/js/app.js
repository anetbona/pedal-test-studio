// PedalTest Studio — routing (hash) między katalogiem a konfiguratorem.

import { renderCatalog } from './catalog.js';
import { renderConfigurator, stopPlayback } from './configurator.js';

let pedals = [];

const viewCatalog = document.getElementById('view-catalog');
const viewPedal = document.getElementById('view-pedal');

function route() {
  const match = location.hash.match(/^#\/pedal\/([\w-]+)$/);
  const pedal = match ? pedals.find((p) => p.id === match[1]) : null;

  stopPlayback();
  // podstrona kostki ma własną szatę graficzną (Knobyfier)
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
    document.title = 'PedalTest Studio — usłysz prawdziwą kostkę, zanim ją kupisz';
  }
}

async function init() {
  try {
    const res = await fetch('/api/pedals');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    pedals = await res.json();
  } catch (err) {
    document.querySelector('.catalog-hint').textContent =
      'Nie udało się wczytać katalogu. Odśwież stronę lub sprawdź, czy serwer działa.';
    viewCatalog.hidden = false;
    return;
  }
  renderCatalog(pedals);
  window.addEventListener('hashchange', route);
  route();
}

init();
