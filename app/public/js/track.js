// Anonimowe statystyki (A3): tylko typ zdarzenia + kostka/nagranie/sklep. Zero PII.

export function trackPlay(pedalId, recordingId) {
  send({ type: 'play', pedalId, recordingId });
}

export function trackAffiliateClick(pedalId, store) {
  send({ type: 'affiliate_click', pedalId, store });
}

function send(event) {
  const body = JSON.stringify(event);
  // sendBeacon przeżywa nawigację (klik w banner otwiera nową kartę)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/events', new Blob([body], { type: 'application/json' }));
    return;
  }
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => { /* statystyki nigdy nie blokują UX */ });
}
