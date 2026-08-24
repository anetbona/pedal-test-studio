// Interaktywne gałki na grafice kostki (U2/U3 + rozszerzenie: kręcenie).
// Pozycje (x, y, size) to ułamki względem grafiki — definiowane per kostka w danych.
//
// Gałką można kręcić (przeciągnięcie w pionie lub strzałki na klawiaturze).
// Po puszczeniu wartość przyciąga się do najbliższego NAGRANEGO ustawienia
// (opts.availableValues) i wywołuje opts.onChange — konfigurator odtwarza
// wtedy pasujące nagranie. Kliknięcie nagrania nadal animuje gałki jak dotąd.

import { t } from './i18n.js';

const ROTATION_RANGE = 270; // -135° (wartość 0) … +135° (wartość 10)

// sprzątanie nasłuchów układu etykiet z poprzednio wyrenderowanej kostki
let detachLayout = null;

export function renderKnobs(container, knobs, opts = {}) {
  const availableValues = opts.availableValues || {};
  const onChange = opts.onChange || (() => {});

  container.querySelectorAll('.knob').forEach((el) => el.remove());
  const elements = new Map(); // knobId -> { knob, el, dial, valueEl, committed }

  for (const knob of knobs) {
    const el = document.createElement('div');
    el.className = 'knob';
    el.style.left = `${knob.x * 100}%`;
    el.style.top = `${knob.y * 100}%`;
    el.style.width = `${knob.size * 100}%`;
    el.tabIndex = 0;
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', `${knob.label} — ${t('knob.aria')}`);
    el.setAttribute('aria-valuemin', String(knob.min));
    el.setAttribute('aria-valuemax', String(knob.max));

    const dial = document.createElement('div');
    dial.className = 'knob-dial';
    const indicator = document.createElement('div');
    indicator.className = 'knob-indicator';
    dial.appendChild(indicator);

    const meta = document.createElement('div');
    meta.className = 'knob-meta';
    const valueEl = document.createElement('span');
    valueEl.className = 'knob-value';
    valueEl.textContent = '–';
    meta.append(`${knob.label} `, valueEl);

    el.append(dial, meta);
    container.appendChild(el);

    const state = { knob, el, dial, valueEl, committed: knob.min };
    elements.set(knob.id, state);
    attachInteraction(state, availableValues[knob.id], onChange);
  }

  function show(state, value) {
    const { knob, dial, valueEl, el } = state;
    const tt = (value - knob.min) / (knob.max - knob.min);
    const angle = -ROTATION_RANGE / 2 + tt * ROTATION_RANGE;
    dial.style.transform = `rotate(${angle}deg)`;
    valueEl.textContent = Math.round(value * 10) / 10;
    el.setAttribute('aria-valuenow', String(Math.round(value)));
  }

  function attachInteraction(state, avail, changed) {
    const { el, knob, dial, valueEl } = state;
    const values = (avail && avail.length ? [...avail] : null)?.sort((a, b) => a - b);

    const snap = (v) => {
      if (!values) return Math.round(Math.max(knob.min, Math.min(knob.max, v)));
      let best = values[0];
      for (const cand of values) if (Math.abs(cand - v) < Math.abs(best - v)) best = cand;
      return best;
    };

    const commit = (v) => {
      const snapped = snap(v);
      const moved = snapped !== state.committed;
      state.committed = snapped;
      show(state, snapped);
      if (moved) changed(knob.id, snapped);
    };

    // obrót jak prawdziwą gałką: łapiesz i kręcisz wokół osi (mysz / dotyk).
    // Zapadki: przekroczenie połowy drogi do kolejnego nagranego ustawienia
    // od razu je "łapie" (commit → gra nowe ustawienie bez puszczania gałki).
    let dragging = false;
    let center = null;

    const pointerDeg = (e) => {
      const dx = e.clientX - center.x;
      const dy = e.clientY - center.y;
      // 0° na godzinie 12, zgodnie z ruchem wskazówek; zakres gałki: -135°…+135°
      const deg = Math.atan2(dx, -dy) * (180 / Math.PI);
      return Math.max(-ROTATION_RANGE / 2, Math.min(ROTATION_RANGE / 2, deg));
    };
    const degToValue = (deg) =>
      knob.min + ((deg + ROTATION_RANGE / 2) / ROTATION_RANGE) * (knob.max - knob.min);

    el.addEventListener('pointerdown', (e) => {
      dragging = true;
      const r = dial.getBoundingClientRect();
      center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      el.setPointerCapture(e.pointerId);
      dial.style.transition = 'none'; // wskaźnik podąża 1:1 za palcem/kursorem
      e.preventDefault();
    });
    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const deg = pointerDeg(e);
      dial.style.transform = `rotate(${deg}deg)`;
      const snapped = snap(degToValue(deg));
      valueEl.textContent = snapped;
      el.setAttribute('aria-valuenow', String(snapped));
      if (snapped !== state.committed) {
        state.committed = snapped;
        changed(knob.id, snapped); // zapadka złapana → gra nowe ustawienie
      }
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      dial.style.transition = '';
      show(state, state.committed); // wskaźnik dojeżdża płynnie do zapadki
    };
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);

    // klawiatura: strzałki przechodzą do sąsiedniego nagranego ustawienia
    el.addEventListener('keydown', (e) => {
      const dir = (e.key === 'ArrowUp' || e.key === 'ArrowRight') ? 1
        : (e.key === 'ArrowDown' || e.key === 'ArrowLeft') ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      if (values) {
        const idx = values.indexOf(state.committed);
        const next = values[Math.max(0, Math.min(values.length - 1, (idx === -1 ? 0 : idx) + dir))];
        commit(next);
      } else {
        commit(state.committed + dir);
      }
    });
  }

  // Etykiety gałek nie mogą na siebie nachodzić — przy małej grafice kostki
  // sąsiednie podpisy są szersze niż odstęp gałek, więc kolidujące trafiają
  // do kolejnych „poziomów" pod spodem (min. 2 px przerwy).
  const LABEL_GAP = 2;
  let layoutQueued = false;

  function layoutLabels() {
    layoutQueued = false;
    const width = container.getBoundingClientRect().width;
    if (!width) return;
    // podpisy skalują się z grafiką (mniejsza kostka → mniejszy tekst)
    const fs = Math.max(9, Math.min(11, width * 0.028));
    container.style.setProperty('--knob-label-fs', `${fs.toFixed(1)}px`);

    const metas = [...elements.values()].map((s) => s.el.querySelector('.knob-meta'));
    metas.forEach((m) => { m.style.transform = ''; });

    const items = metas
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter((it) => it.r.width > 0)
      .sort((a, b) => a.r.left - b.r.left);

    const laneRightEdge = []; // prawa krawędź ostatniej etykiety w danym poziomie
    for (const it of items) {
      let lane = 0;
      while (laneRightEdge[lane] !== undefined && it.r.left < laneRightEdge[lane] + LABEL_GAP) lane++;
      laneRightEdge[lane] = it.r.right;
      if (lane > 0) it.el.style.transform = `translateY(${lane * (it.r.height + LABEL_GAP)}px)`;
    }
  }

  // setTimeout, nie rAF — rAF nie odpala w karcie w tle, a układ etykiet
  // musi być policzony także wtedy (inaczej po powrocie widać nachodzące podpisy)
  function scheduleLayout() {
    if (layoutQueued) return;
    layoutQueued = true;
    setTimeout(layoutLabels, 0);
  }

  scheduleLayout();
  // grafika kostki może dojechać później (lazy) i zmienia rozmiar przy resize okna
  const img = container.querySelector('img');
  if (img && !img.complete) img.addEventListener('load', scheduleLayout, { once: true });

  detachLayout?.(); // sprzątanie po poprzedniej kostce
  const onResize = () => scheduleLayout();
  window.addEventListener('resize', onResize);
  const ro = window.ResizeObserver ? new ResizeObserver(scheduleLayout) : null;
  ro?.observe(container);
  detachLayout = () => {
    window.removeEventListener('resize', onResize);
    ro?.disconnect();
    detachLayout = null;
  };

  return {
    // ustawia gałki (np. po kliknięciu nagrania) — płynna animacja przez CSS transition
    setValues(knobValues) {
      for (const [id, state] of elements) {
        const value = knobValues[id];
        if (value === undefined) continue;
        state.committed = value;
        show(state, value);
      }
      scheduleLayout(); // zmiana wartości może zmienić szerokość etykiety
    },
  };
}
