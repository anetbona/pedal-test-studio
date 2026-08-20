// Interaktywne gałki na grafice kostki (U2/U3 + rozszerzenie: kręcenie).
// Pozycje (x, y, size) to ułamki względem grafiki — definiowane per kostka w danych.
//
// Gałką można kręcić (przeciągnięcie w pionie lub strzałki na klawiaturze).
// Po puszczeniu wartość przyciąga się do najbliższego NAGRANEGO ustawienia
// (opts.availableValues) i wywołuje opts.onChange — konfigurator odtwarza
// wtedy pasujące nagranie. Kliknięcie nagrania nadal animuje gałki jak dotąd.

import { t } from './i18n.js';

const ROTATION_RANGE = 270; // -135° (wartość 0) … +135° (wartość 10)

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
    const { el, knob, dial } = state;
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

    // przeciąganie w pionie (mysz / dotyk)
    let dragging = false;
    let startY = 0;
    let startValue = 0;

    el.addEventListener('pointerdown', (e) => {
      dragging = true;
      startY = e.clientY;
      startValue = state.committed;
      el.setPointerCapture(e.pointerId);
      dial.style.transition = 'none'; // podczas przeciągania obrót 1:1, bez animacji
      e.preventDefault();
    });
    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const raw = startValue + (startY - e.clientY) / 16; // 16 px = 1 punkt skali
      const v = Math.max(knob.min, Math.min(knob.max, raw));
      show(state, v);
    });
    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      dial.style.transition = '';
      const raw = startValue + (startY - e.clientY) / 16;
      commit(raw);
    };
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', () => {
      dragging = false;
      dial.style.transition = '';
      show(state, state.committed);
    });

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

  return {
    // ustawia gałki (np. po kliknięciu nagrania) — płynna animacja przez CSS transition
    setValues(knobValues) {
      for (const [id, state] of elements) {
        const value = knobValues[id];
        if (value === undefined) continue;
        state.committed = value;
        show(state, value);
      }
    },
  };
}
