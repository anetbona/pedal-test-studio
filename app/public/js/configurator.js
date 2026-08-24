// Podstrona kostki (U2–U5): podgląd z interaktywnymi gałkami, sekcje 01/02,
// transport play/stop, rozwijany opis (EN/PL), pasek sklepów.
//
// Riff gra w pętli. Kręcenie gałką przenosi odtwarzanie na nagranie o tych
// ustawieniach OD TEJ SAMEJ POZYCJI — dźwięk zmienia się w locie, bez przerwy.
// Gdy odtwarzanie jest zatrzymane, kręcenie tylko wybiera ustawienie (cisza
// zostaje uszanowana aż do naciśnięcia Play).

import { renderKnobs } from './knobs.js';
import { Player } from './player.js';
import { trackPlay, trackAffiliateClick } from './track.js';
import { t, localize } from './i18n.js';

const player = new Player();
let knobControl = null;

export function stopPlayback() {
  player.stop();
}

export function renderConfigurator(pedal) {
  document.getElementById('pedal-name').textContent = pedal.name;
  document.getElementById('pedal-manufacturer').textContent = pedal.manufacturer;
  document.getElementById('pedal-type').textContent = pedal.type;

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

  // nagrane wartości per gałka (do przyciągania przy kręceniu)
  const availableValues = {};
  for (const knob of pedal.knobs) {
    availableValues[knob.id] = [...new Set(pedal.recordings.map((r) => r.knobValues[knob.id]))];
  }

  const rows = new Map(); // recordingId -> { item, icon }
  const currentLabel = document.getElementById('current-recording');
  const transportBtn = document.getElementById('transport-btn');

  const showSelection = (rec) => {
    knobControl.setValues(rec.knobValues);
    currentLabel.textContent = rec.label;
    currentLabel.dataset.recId = rec.id;
  };

  // gałki na grafice — kręcenie wybiera nagranie o najbliższych ustawieniach
  const wrap = document.getElementById('pedal-image-wrap');
  knobControl = renderKnobs(wrap, pedal.knobs, {
    availableValues,
    onChange(knobId, value) {
      const values = currentValues(pedal, currentLabel.dataset.recId);
      values[knobId] = value;
      const rec = pedal.recordings.find((r) =>
        pedal.knobs.every((k) => r.knobValues[k.id] === values[k.id]));
      if (!rec) return;
      // kręcenie gałką zawsze gra: gdy riff leci — przechodzi płynnie od tej samej
      // pozycji, gdy była cisza — startuje tak, jakby nacisnąć Play
      const result = player.switchTo(rec.id, { autoplay: true });
      showSelection(rec);
      if (result === 'started') trackPlay(pedal.id, rec.id);
    },
  });

  renderRecordings(pedal, rows, showSelection, transportBtn, currentLabel);
  renderAffiliateBanner(pedal);

  if (pedal.recordings.length) showSelection(pedal.recordings[0]);
}

function currentValues(pedal, recId) {
  const base = pedal.recordings.find((r) => r.id === recId) || pedal.recordings[0];
  return { ...(base ? base.knobValues : {}) };
}

// opis dłuższy niż 2 linijki zwijany jest do "more"/"więcej"
function renderDescription(pedal) {
  const desc = document.getElementById('pedal-description');
  const toggle = document.getElementById('desc-toggle');
  desc.textContent = localize(pedal.description);
  desc.classList.add('clamped');
  toggle.hidden = true;
  toggle.textContent = t('more');
  toggle.onclick = () => {
    const clamped = desc.classList.toggle('clamped');
    toggle.textContent = clamped ? t('more') : t('less');
  };
  requestAnimationFrame(() => {
    if (desc.scrollHeight > desc.clientHeight + 2) toggle.hidden = false;
  });
}

function renderRecordings(pedal, rows, showSelection, transportBtn, currentLabel) {
  const list = document.getElementById('recording-list');
  list.innerHTML = '';
  player.load(pedal.recordings);

  player.onStateChange = (recordingId, isPlaying) => {
    for (const [id, { item, icon }] of rows) {
      const active = id === recordingId;
      item.classList.toggle('active', active && isPlaying);
      icon.textContent = active && isPlaying ? '❚❚' : '▶';
    }
    transportBtn.textContent = isPlaying ? '■' : '▶';
    transportBtn.classList.toggle('playing', isPlaying);
    transportBtn.setAttribute('aria-label', isPlaying ? t('transport.stop') : t('transport.play'));
  };

  transportBtn.onclick = () => {
    const recId = currentLabel.dataset.recId || pedal.recordings[0]?.id;
    if (!recId) return;
    const result = player.toggle(recId);
    if (result === 'started') trackPlay(pedal.id, recId);
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
      // klik w aktywne nagranie = pauza/wznowienie; w inne = przełączenie i granie
      const result = player.currentId === rec.id
        ? player.toggle(rec.id)
        : player.switchTo(rec.id, { autoplay: true });
      showSelection(rec);
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
  const links = [...(pedal.affiliateLinks || [])].sort((a, b) => a.order - b.order);
  links.forEach((link, i) => {
    const isProducer = link.role === 'producer' || i === 0;
    const a = document.createElement('a');
    a.className = 'affiliate-link' + (isProducer ? ' producer' : '');
    a.href = link.url;
    a.target = '_blank'; // nowa karta (reguła biznesowa)
    a.rel = 'noopener';
    a.textContent = isProducer ? `${link.store} (${t('producerTag')})` : link.store;
    a.addEventListener('click', () => trackAffiliateClick(pedal.id, link.store));
    container.appendChild(a);
  });
}
