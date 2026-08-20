# PedalTest Studio — aplikacja (MVP)

Otwarty portal odsłuchowy dla gitarzystów: katalog kostek → konfigurator (zdjęcie + animowane gałki read-only) → nagrania tego samego riffu w różnych ustawieniach → banner afiliacyjny → anonimowe statystyki.

## Reference docs

- [../04-spec.md](../04-spec.md) — **GŁÓWNY PRD**, jedyne źródło prawdy o funkcjonalności (user stories z acceptance criteria, flows, reguły biznesowe, encje, priorytety P0/P1/V2)
- [../03-design-source.md](../03-design-source.md) — design system (styl Apple): kolory, typografia, komponenty, do's & don'ts
- [../07-initial-prompt.md](../07-initial-prompt.md) — initial prompt z kontekstem produktu
- [README-admin.md](README-admin.md) — ścieżka admina A1/A2 (dodawanie kostek i nagrań bez zmian w kodzie)

## Architektura

Zero zależności (bez npm install — projekt leży w folderze Google Drive):

- `server.js` — Node http: statyka + `GET /api/pedals`, `POST /api/events`, `GET /api/stats`
- `data/pedals.json` — katalog (encje Pedal/Knob/Recording/AffiliateLink); edytowany przez admina
- `public/audio/<id>/*.wav` — nagrania (w public/ i w repo — wymagane przez statyczny hosting na Vercelu); `data/events.ndjson` — log zdarzeń (zero PII)
- `public/` — vanilla JS SPA (hash routing): `js/app.js` (routing), `catalog.js` (U1), `configurator.js` (U2–U5), `knobs.js` (interaktywne gałki), `player.js` (audio), `track.js` (zdarzenia), `i18n.js` (EN bazowy + PL, wybór w localStorage)
- `scripts/generate-seed.js` — regeneruje dane startowe (nadpisuje pedals.json!)

Uruchomienie: `node app/server.js` → http://localhost:4321

## Zasady (z PRD — nie łam ich)

- Gałki są **interaktywne** (decyzja userki 2026-08-20): kręcenie (drag/strzałki) przyciąga wartość do najbliższego NAGRANEGO ustawienia i odtwarza pasujące nagranie; klik nagrania animuje gałki jak dotąd. Swobodne kręcenie z dowolnymi wartościami = nadal V2 (fizyczny rig MIDI).
- Jeden riff per kostka, wartości gałek 2/6/9; sklep producenta pierwszy w bannerze; linki w nowej karcie + zliczanie; bez kont/limitów/płatności; statystyki bez PII.
- Stories V2 (U6–U13, A4) — NIE buduj bez wyraźnej decyzji; lista w `../04-spec.md`.
- Design (decyzja usera 2026-06-12, ZASTĘPUJE styl Apple z `../03-design-source.md`): szata wg wzorca „Knobyfier" — biel #fff + czerń #111 + zieleń #2e7d32 (jedyny akcent), nagłówki Oswald (condensed, uppercase, letter-spacing), tekst Inter, prostokątne przyciski (radius 3px, outline 2px lub wypełnione zielenią), cienkie obramowania #e5e5e5, numerowane sekcje (01/02… w zieleni). Podstrona kostki: ciemny podgląd (czarny horyzont + szara podłoga) po lewej, biały panel sekcji po prawej, stała belka sklepów na dole. Grafiki kostek odtwarzają oryginały (definicje per model w `scripts/generate-seed.js`).
