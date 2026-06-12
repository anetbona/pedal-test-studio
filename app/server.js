#!/usr/bin/env node
/**
 * PedalTest Studio — serwer MVP (zero zależności)
 *
 * Uruchomienie: node app/server.js  →  http://localhost:4321
 *
 * API:
 *   GET  /api/pedals   — katalog kostek (data/pedals.json)
 *   POST /api/events   — anonimowe zdarzenie { type, pedalId, recordingId?, store? }
 *   GET  /api/stats    — agregaty per kostka / nagranie / sklep (A3, bez PII)
 *
 * Statyka: public/ (frontend) + data/audio/ pod /audio/*
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4321;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const AUDIO_DIR = path.join(DATA_DIR, 'audio');
const PEDALS_FILE = path.join(DATA_DIR, 'pedals.json');
// nadpisywalne w testach (izolacja od produkcyjnego logu zdarzeń)
const EVENTS_FILE = process.env.PEDALTEST_EVENTS_FILE || path.join(DATA_DIR, 'events.ndjson');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
};

const EVENT_TYPES = new Set(['play', 'affiliate_click']);

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

// Statyka z ochroną przed wyjściem poza katalog bazowy
function serveStatic(res, baseDir, relPath) {
  const filePath = path.normalize(path.join(baseDir, relPath));
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': ext === '.wav' ? 'public, max-age=3600' : 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function handleEvent(req, res) {
  let body = '';
  let tooBig = false;
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 4096) { tooBig = true; req.destroy(); }
  });
  req.on('end', () => {
    if (tooBig) return;
    let ev;
    try { ev = JSON.parse(body); } catch { return sendJson(res, 400, { error: 'invalid JSON' }); }
    if (!EVENT_TYPES.has(ev.type) || typeof ev.pedalId !== 'string') {
      return sendJson(res, 400, { error: 'invalid event' });
    }
    // Anonimowo: zapisujemy WYŁĄCZNIE typ, kostkę, nagranie/sklep i czas. Zero PII.
    const record = {
      ts: new Date().toISOString(),
      type: ev.type,
      pedalId: String(ev.pedalId).slice(0, 100),
    };
    if (ev.type === 'play' && typeof ev.recordingId === 'string') {
      record.recordingId = ev.recordingId.slice(0, 120);
    }
    if (ev.type === 'affiliate_click' && typeof ev.store === 'string') {
      record.store = ev.store.slice(0, 100);
    }
    fs.appendFile(EVENTS_FILE, JSON.stringify(record) + '\n', (err) => {
      if (err) return sendJson(res, 500, { error: 'write failed' });
      sendJson(res, 201, { ok: true });
    });
  });
}

function handleStats(res) {
  fs.readFile(EVENTS_FILE, 'utf8', (err, raw) => {
    const events = [];
    if (!err && raw) {
      for (const line of raw.split('\n')) {
        if (!line.trim()) continue;
        try { events.push(JSON.parse(line)); } catch { /* pomiń uszkodzoną linię */ }
      }
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
        if (ev.recordingId) {
          stats.playsPerRecording[ev.recordingId] = (stats.playsPerRecording[ev.recordingId] || 0) + 1;
        }
      } else if (ev.type === 'affiliate_click') {
        stats.totals.affiliateClicks++;
        stats.clicksPerPedal[ev.pedalId] = (stats.clicksPerPedal[ev.pedalId] || 0) + 1;
        if (ev.store) stats.clicksPerStore[ev.store] = (stats.clicksPerStore[ev.store] || 0) + 1;
      }
    }
    sendJson(res, 200, stats);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const p = decodeURIComponent(url.pathname);

  if (req.method === 'GET' && p === '/api/pedals') {
    return fs.readFile(PEDALS_FILE, 'utf8', (err, raw) => {
      if (err) return sendJson(res, 500, { error: 'pedals.json missing — uruchom scripts/generate-seed.js' });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(raw);
    });
  }
  if (req.method === 'POST' && p === '/api/events') return handleEvent(req, res);
  if (req.method === 'GET' && p === '/api/stats') return handleStats(res);

  if (req.method === 'GET' || req.method === 'HEAD') {
    if (p.startsWith('/audio/')) return serveStatic(res, AUDIO_DIR, p.slice('/audio/'.length));
    const rel = p === '/' ? 'index.html' : p.slice(1);
    return serveStatic(res, PUBLIC_DIR, rel);
  }

  res.writeHead(405); res.end('Method not allowed');
});

server.listen(PORT, () => {
  console.log(`PedalTest Studio → http://localhost:${PORT}`);
  console.log(`Statystyki (A3)  → http://localhost:${PORT}/stats.html  |  GET /api/stats`);
});
