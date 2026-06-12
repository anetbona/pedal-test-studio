// Podstrona kostki (U2–U5): podgląd z animowanymi gałkami, sekcje 01/02,
// rozwijany opis, belka sklepów z linkami afiliacyjnymi.

import { renderKnobs } from './knobs.js';
import { Player } from './player.js';
import { trackPlay, trackAffiliateClick } from './track.js';

const player = new Player();
let knobControl = null;

export function stopPlayback() {
  player.stop();
}

export function renderConfigurator(pedal) {
  document.getElementById('pedal-name').textContent = pedal.name;
  document.getElementById('pedal-manufacturer').textContent = pedal.manufacturer;
  document.getElementById('pedal-type').textContent = pedal.type;

  // logo producenta obok nazwy
  const logo = document.getElementById('pedal-logo');
  if (pedal.manufacturerLogo) {
    logo.src = pedal.manufacturerLogo;
    logo.alt = pedal.manufacturer;
    logo.hidden = false;
  } else {
    logo.hidden = true;
  }

  renderDescription(pedal);

  const img = document.getElementById('pedal-image');
  img.src = pedal.image;
  img.alt = `${pedal.manufacturer} ${pedal.name}`;

  // gałki na zdjęciu — startowo w pozycjach pierwszego nagrania (U2)
  const wrap = document.getElementById('pedal-image-wrap');
  knobControl = renderKnobs(wrap, pedal.knobs);
  if (pedal.recordings.length) {
    knobControl.setValues(pedal.recordings[0].knobValues);
  }

  renderRecordings(pedal);
  renderAffiliateBanner(pedal);
}

// opis dłuższy niż 2 linijki zwijany jest do "więcej"/"mniej"
function renderDescription(pedal) {
  const desc = document.getElementById('pedal-description');
  const toggle = document.getElementById('desc-toggle');
  desc.textContent = pedal.description || '';
  desc.classList.add('clamped');
  toggle.hidden = true;
  toggle.textContent = 'więcej';
  toggle.onclick = () => {
    const clamped = desc.classList.toggle('clamped');
    toggle.textContent = clamped ? 'więcej' : 'mniej';
  };
  // pokaż przełącznik tylko, gdy tekst faktycznie nie mieści się w 2 linijkach
  requestAnimationFrame(() => {
    if (desc.scrollHeight > desc.clientHeight + 2) toggle.hidden = false;
  });
}

function renderRecordings(pedal) {
  const list = document.getElementById('recording-list');
  const currentLabel = document.getElementById('current-recording');
  list.innerHTML = '';
  currentLabel.textContent = '—';
  player.load(pedal.recordings);

  const rows = new Map(); // recordingId -> { item, icon }

  player.onStateChange = (recordingId, isPlaying) => {
    for (const [id, { item, icon }] of rows) {
      const active = id === recordingId;
      item.classList.toggle('active', active && isPlaying);
      icon.textContent = active && isPlaying ? '❚❚' : '▶';
    }
  };

  for (const rec of pedal.recordings) {
    const li = document.createElement('li');
    const item = document.createElement('button');
    item.className = 'recording-item';

    const icon = document.createElement('span');
    icon.className = 'rec-icon';
    icon.textContent = '▶';

    const label = document.createElement('span');
    label.className = 'rec-label';
    label.textContent = rec.label;

    item.append(icon, label);
    item.addEventListener('click', () => {
      const result = player.toggle(rec.id);
      // gałki płynnie animują się do ustawień wybranego nagrania (U3)
      knobControl.setValues(rec.knobValues);
      currentLabel.textContent = rec.label;
      // zliczamy każde rozpoczęte odtworzenie (nie wznowienie po pauzie)
      if (result === 'started') trackPlay(pedal.id, rec.id);
    });

    li.appendChild(item);
    list.appendChild(li);
    rows.set(rec.id, { item, icon });
  }
}

function renderAffiliateBanner(pedal) {
  const container = document.getElementById('affiliate-links');
  container.innerHTML = '';

  // reguła biznesowa: sklep producenta pierwszy, potem pozostałe wg `order`
  const links = [...pedal.affiliateLinks].sort((a, b) => a.order - b.order);
  links.forEach((link, i) => {
    const a = document.createElement('a');
    a.className = 'affiliate-link' + (i === 0 ? ' producer' : '');
    a.href = link.url;
    a.target = '_blank'; // nowa karta (reguła biznesowa)
    a.rel = 'noopener';
    a.textContent = link.store;
    a.addEventListener('click', () => trackAffiliateClick(pedal.id, link.store));
    container.appendChild(a);
  });
}
