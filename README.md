# PedalTest Studio

Otwarty portal odsłuchowy dla gitarzystów: usłysz, jak naprawdę brzmi kostka (efekt
gitarowy), zanim ją kupisz. Ten sam riff suchej gitary nagrany w różnych ustawieniach
gałek (2/6/9) — klikasz nagranie, słyszysz brzmienie, a animowane gałki na grafice kostki
ustawiają się dokładnie tak, jak przy nagraniu. Gdy coś zagra — kupujesz przez link
afiliacyjny.

> Wizja docelowa: wirtualne gałki sterujące przez MIDI **prawdziwym, fizycznym
> hardware'em** (nie symulacją). MVP świadomie pomija warstwę hardware —
> patrz [docs/ROADMAP.md](docs/ROADMAP.md).

## Szybki start

Wymagania: **Node.js ≥ 20** (bez `npm install` — projekt nie ma żadnych zależności).

```bash
node app/scripts/generate-seed.js   # jednorazowo: dane startowe (katalog, grafiki, audio)
node app/server.js                  # → http://localhost:4321
```

- Aplikacja: <http://localhost:4321>
- Statystyki (admin): <http://localhost:4321/stats.html>

Testy:

```bash
node --test "tests/**/*.test.js"
```

## Stos technologiczny

| Warstwa | Technologia |
|---------|-------------|
| Backend | czysty Node.js (`node:http`) — statyka + JSON API, zero zależności |
| Frontend | vanilla JS (ES modules), HTML, CSS; fonty Google (Oswald + Inter) |
| Dane | `app/data/pedals.json` (katalog), WAV (nagrania), NDJSON (zdarzenia, zero PII) |
| Dane startowe | generator: synteza riffu (Karplus–Strong) + DSP per ustawienie gałek, grafiki kostek SVG |
| Testy / CI | wbudowany `node:test`, GitHub Actions |

## Struktura repozytorium

```
├── app/                   # aplikacja (kod źródłowy)
│   ├── server.js          #   serwer HTTP + API (pedals / events / stats)
│   ├── public/            #   frontend (SPA z hash-routingiem) + grafiki
│   ├── data/              #   katalog kostek + nagrania + log zdarzeń
│   ├── scripts/           #   generator danych startowych
│   └── README-admin.md    #   ścieżka admina: dodawanie kostek/nagrań bez zmian w kodzie
├── docs/                  # dokumentacja produktowa (PM/UX)
│   ├── PRD.md             #   wymagania produktu (skrót; pełny PRD: 04-spec.md)
│   ├── STRATEGY.md        #   Business Model Canvas + Value Proposition Canvas
│   ├── ROADMAP.md         #   Inception → MVP → V1.1 → Future Backlog
│   ├── UX_ARCHITECTURE.md #   architektura informacji, user flows, design system, WCAG
│   └── TESTING_STRATEGY.md#   strategia testów: automaty, UAT, checklista QA
├── tests/                 # testy (integration; unit/e2e w backlogu)
├── 01-pomysl.md … 07-initial-prompt.md, _STATUS.md   # discovery (sesja od-pomysłu-do-promptu)
└── .github/               # CI, szablony PR i issues
```

## Dokumentacja

- **Źródło prawdy o funkcjonalności:** [04-spec.md](04-spec.md) (user stories
  z acceptance criteria, flows, reguły biznesowe, priorytety P0/P1/V2)
- [docs/PRD.md](docs/PRD.md) · [docs/STRATEGY.md](docs/STRATEGY.md) ·
  [docs/ROADMAP.md](docs/ROADMAP.md) · [docs/UX_ARCHITECTURE.md](docs/UX_ARCHITECTURE.md) ·
  [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md)
- Historia zmian: [CHANGELOG.md](CHANGELOG.md)

## Treści

Obecne nagrania i grafiki to **wygenerowane placeholdery** (syntezowany riff przez DSP,
wektorowe grafiki kostek wzorowane na oryginałach). Docelowo admin podmienia je na
prawdziwe nagrania i zdjęcia ścieżką opisaną w [app/README-admin.md](app/README-admin.md) —
bez zmian w kodzie.

Uwaga: `node app/scripts/generate-seed.js` nadpisuje `app/data/pedals.json` — uruchamiaj
ponownie tylko, żeby zresetować katalog do stanu początkowego.
