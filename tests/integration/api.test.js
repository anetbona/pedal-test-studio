// Testy integracyjne API PedalTest Studio (node:test, zero zależności).
// Serwer startuje jako proces potomny na losowym porcie, z odizolowanym
// logiem zdarzeń (PEDALTEST_EVENTS_FILE), żeby nie zaśmiecać produkcyjnych statystyk.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SERVER = path.join(__dirname, '..', '..', 'app', 'server.js');
const PORT = 4900 + Math.floor(Math.random() * 100);
const BASE = `http://127.0.0.1:${PORT}`;

let child;
let eventsFile;

before(async () => {
  eventsFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pedaltest-')), 'events.ndjson');
  child = spawn(process.execPath, [SERVER], {
    env: { ...process.env, PORT: String(PORT), PEDALTEST_EVENTS_FILE: eventsFile },
    stdio: 'ignore',
  });
  // czekaj aż serwer zacznie odpowiadać (max ~5 s)
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`${BASE}/api/pedals`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error('serwer nie wystartował');
});

after(() => {
  if (child) child.kill();
});

test('GET /api/pedals zwraca katalog z kompletem encji', async () => {
  const res = await fetch(`${BASE}/api/pedals`);
  assert.equal(res.status, 200);
  const pedals = await res.json();
  assert.ok(Array.isArray(pedals) && pedals.length >= 1, 'katalog nie może być pusty');

  for (const p of pedals) {
    assert.ok(p.id && p.name && p.manufacturer, `kostka ${p.id}: brak danych podstawowych`);
    assert.ok(['fuzz', 'overdrive'].includes(p.type), `kostka ${p.id}: typ musi być fuzz/overdrive`);
    assert.ok(p.knobs.length >= 3 && p.knobs.length <= 4, `kostka ${p.id}: 3–4 gałki (spec U2)`);
    assert.ok(p.recordings.length > 0, `kostka ${p.id}: brak nagrań`);
    // reguła biznesowa: sklep producenta pierwszy
    const first = [...p.affiliateLinks].sort((a, b) => a.order - b.order)[0];
    assert.match(first.store, /producent/i, `kostka ${p.id}: pierwszy link musi być producenta`);
    // wartości gałek nagrań w skali 0–10
    for (const rec of p.recordings) {
      for (const v of Object.values(rec.knobValues)) {
        assert.ok(v >= 0 && v <= 10, `kostka ${p.id}: wartość gałki poza skalą 0–10`);
      }
    }
  }
});

test('POST /api/events przyjmuje poprawne zdarzenia i odrzuca śmieci', async () => {
  const ok = await fetch(`${BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'play', pedalId: 'test-pedal', recordingId: 'test-rec' }),
  });
  assert.equal(ok.status, 201);

  const badType = await fetch(`${BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'hack', pedalId: 'x' }),
  });
  assert.equal(badType.status, 400);

  const badJson = await fetch(`${BASE}/api/events`, { method: 'POST', body: 'nie-json' });
  assert.equal(badJson.status, 400);
});

test('GET /api/stats agreguje zdarzenia per kostka/nagranie/sklep bez PII', async () => {
  await fetch(`${BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'affiliate_click', pedalId: 'test-pedal', store: 'Sweetwater' }),
  });

  const res = await fetch(`${BASE}/api/stats`);
  assert.equal(res.status, 200);
  const stats = await res.json();
  assert.ok(stats.totals.plays >= 1);
  assert.ok(stats.totals.affiliateClicks >= 1);
  assert.equal(stats.playsPerPedal['test-pedal'], 1);
  assert.equal(stats.playsPerRecording['test-rec'], 1);
  assert.equal(stats.clicksPerStore['Sweetwater'], 1);

  // zero PII w surowym logu zdarzeń
  const raw = fs.readFileSync(eventsFile, 'utf8');
  for (const line of raw.trim().split('\n')) {
    const keys = Object.keys(JSON.parse(line)).sort();
    for (const k of keys) {
      assert.ok(['ts', 'type', 'pedalId', 'recordingId', 'store'].includes(k), `niedozwolone pole: ${k}`);
    }
  }
});

test('statyka jest serwowana, a wyjście poza katalog bazowy zablokowane', async () => {
  const index = await fetch(`${BASE}/`);
  assert.equal(index.status, 200);
  assert.match(await index.text(), /PedalTest Studio/);

  const traversal = await fetch(`${BASE}/audio/..%2F..%2Fserver.js`);
  assert.ok([403, 404].includes(traversal.status), 'path traversal musi być zablokowany');
});
