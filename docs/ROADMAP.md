# ROADMAP — PedalTest Studio

## Inception ✅ (2026-06-11)

- Brain dump → brief → design direction → specyfikacja funkcjonalna → MoSCoW
  (sesja `/od-pomyslu-do-promptu`; artefakty: `01-pomysl.md` … `07-initial-prompt.md`).
- Decyzja pivotowa: MVP **bez** warstwy hardware (portal odsłuchowy).

## MVP — Core Value ✅ (2026-06-11/12)

- [x] U1 Katalog kostek (karuzela; 8 kostek: 4 overdrive, 4 fuzz)
- [x] U2 Podstrona kostki — grafika + animowane gałki read-only (pozycje per model)
- [x] U3/U4 Odtwarzanie i przełączanie nagrań (ten sam riff, ustawienia 2/6/9)
- [x] U5 Belka sklepów z linkami afiliacyjnymi (producent pierwszy, zliczanie kliknięć)
- [x] A1/A2 Ścieżka admina „od kuchni" (`app/data/pedals.json` + pliki; bez zmian w kodzie)
- [x] A3 Anonimowe statystyki (`/stats.html`, `GET /api/stats`, zero PII)
- [x] Redesign: szata „Knobyfier" (Oswald/Inter, zieleń #2e7d32), wierne grafiki kostek,
      logo producenta, rozwijany opis „więcej"

## V1.1 — Advanced (planowane)

- [ ] Prawdziwe treści: nagrania riffu przez fizyczne kostki + oficjalne zdjęcia (ścieżka A1/A2)
- [ ] U12 Tryb porównania dwóch kostek (A/B) — wspólne parametry, przełączanie jednym kliknięciem
- [ ] U13 Ankieta NPS po sesji odsłuchowej
- [ ] SEO + meta/OG dla podstron kostek (udostępnianie linków)
- [ ] Deploy publiczny (hosting + domena)

## Future Backlog (V2+ — większe moduły, świadomie odłożone)

- [ ] U6 Konta użytkowników (potrzebne dopiero ze slotami)
- [ ] U7 Rezerwacja slotów w kalendarzu (1 fizyczna kostka = 1 user naraz)
- [ ] U8 Płatności / „ukradnij slot" (30 min / 20 PLN; freemium)
- [ ] U9 Live sterowanie fizyczną kostką (wirtualne gałki → MIDI → rig → stream audio)
- [ ] U10 Upload własnego suchego śladu gitary
- [ ] U11 Granie na żywo z podpiętą gitarą (najpóźniej — latencja)
- [ ] A4 Panel admina w UI (katalog, kalendarz, finanse, statystyki)
- [ ] Konsultacja prawna: nazwy/grafiki produktów, model „wypożyczalni" brzmienia

> Architektura danych już dziś wspiera V2: gałki są encjami z wartościami (nie zaszyte
> w obrazkach), więc live MIDI i sloty nie wymagają przebudowy fundamentów.
