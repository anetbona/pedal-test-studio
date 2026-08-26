# PedalTest Studio

Otwarty portal odsłuchowy dla gitarzystów: usłysz, jak naprawdę brzmi kostka (efekt
gitarowy), zanim ją kupisz. Ten sam riff suchej gitary nagrany w różnych ustawieniach
gałek (2/6/9) — klikasz nagranie, słyszysz brzmienie, a animowane gałki na grafice kostki
ustawiają się dokładnie tak, jak przy nagraniu. Gdy coś zagra — kupujesz przez link
afiliacyjny.

> Wizja docelowa: wirtualne gałki sterujące przez MIDI **prawdziwym, fizycznym
> hardware'em** (nie symulacją). MVP świadomie pomija warstwę hardware —
> patrz [docs/ROADMAP.md](docs/ROADMAP.md).

## Live demo

**<https://pedal-test-studio.vercel.app>**

Hosted on Vercel: the frontend, catalog, images and **audio** are served statically from
`app/public` (recordings are committed to the repo, so playback works in the demo), and the
`/api/*` endpoints run as serverless functions ([`api/`](api/) — logic 1:1 with
[`app/server.js`](app/server.js)). The UI is bilingual — **English by default**, Polish via
the EN/PL switch in the nav. Demo note: event stats (`/api/stats`) are stored in ephemeral
instance storage and reset periodically.

PL: Demo działa na Vercelu: frontend, katalog, grafiki i **audio** serwowane są statycznie
z `app/public` (nagrania są w repo, więc odsłuch w demo działa), a endpointy `/api/*` jako
funkcje serverless. Interfejs jest dwujęzyczny — **domyślnie angielski**, polski przez
przełącznik EN/PL w nawigacji. Statystyki zdarzeń resetują się okresowo (pamięć ulotna).

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
| Frontend | vanilla JS (ES modules), HTML, CSS; fonty Google (Oswald + Inter); i18n EN (bazowy) + PL |
| Dane | `app/data/pedals.json` (katalog, opisy EN+PL), WAV w `app/public/audio/` (nagrania), NDJSON (zdarzenia, zero PII) |
| Dane startowe | generator: synteza riffu (Karplus–Strong) + DSP per ustawienie gałek, grafiki kostek SVG |
| Testy / CI | wbudowany `node:test`, GitHub Actions |
| Deploy | Vercel — statyka z `app/public` + funkcje serverless w `api/` |

## Struktura repozytorium

```
├── app/                   # aplikacja (kod źródłowy)
│   ├── server.js          #   serwer HTTP + API (pedals / events / stats)
│   ├── public/            #   frontend (SPA z hash-routingiem) + grafiki
│   ├── data/              #   katalog kostek + nagrania + log zdarzeń
│   ├── scripts/           #   generator danych startowych
│   └── README-admin.md    #   ścieżka admina: dodawanie kostek/nagrań bez zmian w kodzie
├── api/                   # funkcje serverless dla demo na Vercelu (pedals / events / stats)
├── docs/                  # dokumentacja produktowa (PM/UX)
│   ├── PRD.md             #   wymagania produktu (skrót; pełny PRD: 04-spec.md)
│   ├── STRATEGY.md        #   Business Model Canvas + Value Proposition Canvas
│   ├── ROADMAP.md         #   Inception → MVP → V1.1 → Future Backlog
│   ├── UX_ARCHITECTURE.md #   architektura informacji, user flows, design system, WCAG
│   ├── TESTING_STRATEGY.md#   strategia testów: automaty, UAT, checklista QA
│   └── dziennik-projektu.md #  notatki robocze: dziennik decyzji (nie dokumentacja)
├── tests/                 # testy (integration; unit/e2e w backlogu)
├── 01-pomysl.md           # discovery (sesja od-pomysłu-do-promptu), .md + .html:
├── 02-brief.md            #   brief produktu
├── 03-design.md           #   design system (+ 03-design-source.md — źródło z Kroku 3)
├── 04-spec.md             #   specyfikacja: user stories, acceptance criteria, priorytety
├── 05-mvp-decision.html   #   decyzja o zakresie MVP (MoSCoW)
├── 07-initial-prompt.md   #   initial prompt pod Claude Code
├── 08-research-benchmarking.md    # research konkurencji i benchmarking
├── 09-business-model-canvas.md    # Business Model Canvas
├── 10-value-proposition-canvas.md # Value Proposition Canvas
└── .github/               # CI, szablony PR i issues
```

## Dokumentacja

- **Źródło prawdy o funkcjonalności:** [04-spec.md](04-spec.md) (user stories
  z acceptance criteria, flows, reguły biznesowe, priorytety P0/P1/V2)
- [docs/PRD.md](docs/PRD.md) · [docs/STRATEGY.md](docs/STRATEGY.md) ·
  [docs/ROADMAP.md](docs/ROADMAP.md) · [docs/UX_ARCHITECTURE.md](docs/UX_ARCHITECTURE.md) ·
  [docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md)
- Discovery i strategia: [08-research-benchmarking.md](08-research-benchmarking.md) ·
  [09-business-model-canvas.md](09-business-model-canvas.md) ·
  [10-value-proposition-canvas.md](10-value-proposition-canvas.md)
- Dziennik decyzji (notatki robocze): [docs/dziennik-projektu.md](docs/dziennik-projektu.md)
- Historia zmian: [CHANGELOG.md](CHANGELOG.md)

## Licencja

MIT — patrz [LICENSE](LICENSE).

## Treści

Obecne nagrania i grafiki to **wygenerowane placeholdery** (syntezowany riff przez DSP,
wektorowe grafiki kostek wzorowane na oryginałach). Docelowo admin podmienia je na
prawdziwe nagrania i zdjęcia ścieżką opisaną w [app/README-admin.md](app/README-admin.md) —
bez zmian w kodzie.

Uwaga: `node app/scripts/generate-seed.js` nadpisuje `app/data/pedals.json` — uruchamiaj
ponownie tylko, żeby zresetować katalog do stanu początkowego.
