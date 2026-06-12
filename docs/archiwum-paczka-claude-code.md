# [ARCHIWUM] PedalTest Studio — paczka do Claude Code

> Oryginalna treść README z Kroku 7 sesji `/od-pomyslu-do-promptu` (2026-06-11).
> Zachowana jako archiwum — MVP zostało zbudowane, więc instrukcja „jak zacząć"
> jest już nieaktualna. Aktualny README: [`../README.md`](../README.md).

Status: ✅ GOTOWE
Data: 2026-06-11

## Pliki w tym folderze

- **`07-initial-prompt.md`** — to wklejasz do Claude Code jako pierwszy prompt
- **`04-spec.md`** — PRD, jedyne źródło prawdy o funkcjonalności (user stories z acceptance criteria, flows, reguły, encje, priorytety P0/P1/V2)
- **`03-design-source.md`** — design.md w stylu Apple (z getdesign.md) — źródło stylu wizualnego
- `01-pomysl.md`, `02-brief.md`, `03-design.md` — dokumenty robocze sesji
- `02-brief.html`, `04-spec.html`, `05-mvp-decision.html` — podgląd w przeglądarce
- `_STATUS.md` — stan sesji (do kontynuacji skillem `/od-pomyslu-do-promptu`)

## Jak zacząć w Claude Code

1. Utwórz folder projektu i skopiuj do niego `04-spec.md`, `03-design-source.md` oraz `07-initial-prompt.md` (najlepiej do `docs/`)
2. Uruchom Claude Code w folderze projektu
3. Wklej zawartość `07-initial-prompt.md` jako pierwszy prompt (lub napisz: „przeczytaj docs/07-initial-prompt.md i zbuduj MVP zgodnie z nim")
4. Claude Code zapisze referencje w `CLAUDE.md` i zbuduje MVP zgodnie ze spec
5. Po MVP dorzucaj funkcje V2 iteracyjnie: „dodaj U12 — tryb porównania A/B, patrz docs/04-spec.md sekcja U12"

## MVP w skrócie

Otwarty portal odsłuchowy: katalog kostek (fuzz/overdrive) → konfigurator ze zdjęciem i animowanymi gałkami → nagrania tego samego riffu w różnych ustawieniach (2/6/9) → banner afiliacyjny → anonimowe statystyki. Bez kont, płatności i hardware'u — to późniejsze etapy (opisane w spec jako V2).
