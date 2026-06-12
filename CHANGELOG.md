# Changelog

Wszystkie istotne zmiany w projekcie są dokumentowane w tym pliku.
Format zgodny z [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/),
wersjonowanie zgodne z [SemVer](https://semver.org/lang/pl/).

## [Unreleased]

### Planowane
- Prawdziwe nagrania i zdjęcia kostek (zamiast generowanych placeholderów)
- U12 porównanie A/B, U13 ankieta NPS — patrz [docs/ROADMAP.md](docs/ROADMAP.md)

## [0.2.0] — 2026-06-12

### Changed
- **Redesign całej aplikacji** do szaty „Knobyfier": biel/czerń/zieleń `#2e7d32`,
  nagłówki Oswald (condensed, uppercase), tekst Inter, prostokątne przyciski,
  cienkie obramowania, numerowane sekcje (zastępuje styl Apple z `03-design-source.md`).
- Podstrona kostki: nowy układ — belka nav (góra) / ciemny podgląd (lewa) /
  panel sekcji 01–02 (prawa) / stała belka sklepów (dół).
- Grafiki kostek odtworzone na wzór oryginałów: proporcje obudowy, kolorystyka,
  układ gałek i przycisków per model (Boss compact z treadle, TS9 z chromowanym
  przyciskiem, Big Muff z π itd.).

### Added
- Logo producenta obok nazwy kostki (7 wordmarków SVG).
- Dłuższe opisy kostek zwijane do 2 linijek z przełącznikiem „więcej"/„mniej".
- Etykieta bieżącego nagrania w nagłówku sekcji 02.

## [0.1.0] — 2026-06-11

### Added
- MVP zgodne ze spec (`04-spec.md`): 8 user stories (U1–U5, A1–A3).
- Katalog kostek (karuzela) + konfigurator z animowanymi gałkami read-only.
- Odtwarzacz nagrań (ten sam riff, ustawienia 2/6/9) z animacją gałek.
- Banner afiliacyjny (sklep producenta pierwszy, nowa karta, zliczanie kliknięć).
- Anonimowe statystyki (`/stats.html`, `GET /api/stats`, NDJSON bez PII).
- Generator danych startowych: 8 kostek × 9 nagrań WAV (synteza Karplus–Strong + DSP),
  grafiki SVG.
- Ścieżka admina bez zmian w kodzie (`app/README-admin.md`).
- Zero-dependency: czysty Node.js + vanilla JS (bez `node_modules`).
