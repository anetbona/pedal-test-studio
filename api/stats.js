// GET /api/stats — agregaty per kostka / nagranie / sklep (A3, bez PII)
// Wersja serverless (demo na Vercelu): czyta zdarzenia z /tmp — dane demo.
// Logika agregacji 1:1 z app/server.js.
const fs = require('fs');

const EVENTS_FILE = '/tmp/events.ndjson';

module.exports = (req, res) => {
  let raw = '';
  try { raw = fs.readFileSync(EVENTS_FILE, 'utf8'); } catch { /* brak pliku = zero zdarzeń */ }
  const events = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    try { events.push(JSON.parse(line)); } catch { /* pomiń uszkodzoną linię */ }
  }
  const stats = {
    totals: { plays: 0, affiliateClicks: 0 },
    playsPerPedal: {},
    playsPerRecording: {},
    clicksPerPedal: {},
    clicksPerStore: {},
  };
  for (const ev of events) {
    if (ev.type === 'play') {
      stats.totals.plays++;
      stats.playsPerPedal[ev.pedalId] = (stats.playsPerPedal[ev.pedalId] || 0) + 1;
      if (ev.recordingId) stats.playsPerRecording[ev.recordingId] = (stats.playsPerRecording[ev.recordingId] || 0) + 1;
    } else if (ev.type === 'affiliate_click') {
      stats.totals.affiliateClicks++;
      stats.clicksPerPedal[ev.pedalId] = (stats.clicksPerPedal[ev.pedalId] || 0) + 1;
      if (ev.store) stats.clicksPerStore[ev.store] = (stats.clicksPerStore[ev.store] || 0) + 1;
    }
  }
  res.status(200).json(stats);
};

