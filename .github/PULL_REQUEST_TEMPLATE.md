# Pull Request

## Co się zmieniło?

<!-- Krótki opis zmian: co i dlaczego. -->

## Związane User Story

<!-- np. U3 — Odtwarzanie nagrania z animacją gałek (04-spec.md sekcja 2) lub link do issue. -->

## Checklista UX

- [ ] Scenariusz E2E przeklikany na desktopie (≥1280px) i mobile (≤640px)
- [ ] Zero błędów w konsoli przeglądarki
- [ ] Fokus klawiatury widoczny na nowych elementach interaktywnych; `aria-label`/`alt` ustawione
- [ ] Szata graficzna zgodna z `docs/UX_ARCHITECTURE.md` (zieleń #2e7d32 tylko jako akcent, Oswald/Inter)
- [ ] Komunikaty błędów czytelne dla człowieka (nie tylko dla konsoli)

## Checklista QA

- [ ] `node --test "tests/**/*.test.js"` przechodzi (CI zielone)
- [ ] Reguły biznesowe nienaruszone (`docs/PRD.md` sekcja 5)
- [ ] `CHANGELOG.md` uzupełniony
- [ ] Commity w konwencji Conventional Commits
