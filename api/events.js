// POST /api/events — anonimowe zdarzenia { type, pedalId, recordingId?, store? }
// Wersja serverless (demo na Vercelu): zapis do /tmp — dane resetują się między instancjami.
// Logika walidacji 1:1 z app/server.js. Zero PII.
const fs = require('fs');

const EVENTS_FILE = '/tmp/events.ndjson';
const EVENT_TYPES = new Set(['play', 'affiliate_click']);

module.exports = (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const ev = req.body || {};
  if (!EVENT_TYPES.has(ev.type) || typeof ev.pedalId !== 'string') {
    res.status(400).json({ error: 'invalid event' }); return;
  }
  const record = { ts: new Date().toISOString(), type: ev.type, pedalId: String(ev.pedalId).slice(0, 100) };
  if (ev.type === 'play' && typeof ev.recordingId === 'string') record.recordingId = ev.recordingId.slice(0, 120);
  if (ev.type === 'affiliate_click' && typeof ev.store === 'string') record.store = ev.store.slice(0, 100);
  try { fs.appendFileSync(EVENTS_FILE, JSON.stringify(record) + '\n'); }
  catch { res.status(500).json({ error: 'write failed' }); return; }
  res.status(201).json({ ok: true });
};

