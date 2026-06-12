// Animowane gałki nakładane na zdjęcie kostki (U2/U3).
// Pozycje (x, y, size) to ułamki względem zdjęcia — definiowane per kostka w danych.
// Gałki są read-only w MVP: animują się do wartości wybranego nagrania.

const ROTATION_RANGE = 270; // -135° (wartość 0) … +135° (wartość 10)

export function renderKnobs(container, knobs) {
  container.querySelectorAll('.knob').forEach((el) => el.remove());
  const elements = new Map(); // knobId -> { dial, valueEl }

  for (const knob of knobs) {
    const el = document.createElement('div');
    el.className = 'knob';
    el.style.left = `${knob.x * 100}%`;
    el.style.top = `${knob.y * 100}%`;
    el.style.width = `${knob.size * 100}%`;

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
    elements.set(knob.id, { knob, dial, valueEl });
  }

  return {
    // płynna animacja do pozycji nagrania (CSS transition na transform)
    setValues(knobValues) {
      for (const [id, { knob, dial, valueEl }] of elements) {
        const value = knobValues[id];
        if (value === undefined) continue;
        const t = (value - knob.min) / (knob.max - knob.min);
        const angle = -ROTATION_RANGE / 2 + t * ROTATION_RANGE;
        dial.style.transform = `rotate(${angle}deg)`;
        valueEl.textContent = value;
      }
    },
  };
}
