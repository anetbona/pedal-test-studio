# TESTING_STRATEGY — PedalTest Studio

## 1. Testy automatyczne

| Poziom | Lokalizacja | Narzędzie | Zakres |
|--------|-------------|-----------|--------|
| Integration | `tests/integration/` | wbudowany `node:test` | API: katalog, walidacja zdarzeń, agregacja statystyk, bezpieczeństwo ścieżek |
| Unit | `tests/unit/` | `node:test` | backlog — logika wyodrębniana z `server.js` przy rozbudowie |
| E2E | `tests/e2e/` | backlog (Playwright) | Flow 1 w przeglądarce (desktop + mobile) |

Uruchomienie lokalne:

```bash
node app/scripts/generate-seed.js   # jednorazowo (dane startowe)
node --test "tests/**/*.test.js"
```

CI (GitHub Actions, `.github/workflows/ci.yml`): syntax check wszystkich plików JS →
walidacja generatora seedów → testy `node --test`.

## 2. Scenariusze UAT (testy manualne)

Kryteria akceptacyjne per story — pełne GIVEN/WHEN/THEN w [`../04-spec.md`](../04-spec.md) sekcja 2.

| ID | Scenariusz UAT | Oczekiwany rezultat |
|----|----------------|---------------------|
| U1 | Wejdź na stronę główną (desktop i mobile) | Katalog widoczny od razu; przewijanie strzałkami (desktop) i swipe (mobile) działa płynnie; karta = grafika + nazwa + producent + typ |
| U2 | Kliknij kostkę w katalogu | Podstrona: grafika z 3 gałkami (nazwy + wartości 0–10), sekcja 01 z logo producenta, nazwą i opisem, sekcja 02 z listą 9 nagrań |
| U2 | Opis dłuższy niż 2 linijki | Zwinięty z przyciskiem „więcej"; klik rozwija („mniej" zwija) |
| U3 | Kliknij nagranie | Dźwięk startuje natychmiast; gałki płynnie obracają się do ustawień nagrania; pozycja podświetlona na zielono; ikona ❚❚ |
| U3 | Kliknij aktywne nagranie ponownie | Pauza (ikona ▶); kolejny klik wznawia |
| U4 | Klikaj kolejne nagrania | Dźwięk przełącza się bez przeładowania; słychać różnicę brzmienia; gałki i etykieta w nagłówku sekcji 02 aktualizują się |
| U5 | Otwórz podstronę kostki | Belka „KUP TEN EFEKT W:" widoczna od razu (przyklejona do dołu); sklep producenta pierwszy (wypełniony przycisk) |
| U5 | Kliknij sklep | Otwiera się nowa karta; kliknięcie widoczne w statystykach |
| A1 | Dodaj kostkę edytując `app/data/pedals.json` (wg `../app/README-admin.md`) | Po odświeżeniu kostka w katalogu — bez zmian w kodzie i bez restartu |
| A2 | Dodaj nagranie z `knobValues` | Nagranie na liście; klik ustawia gałki w te wartości |
| A3 | Otwórz `/stats.html` po sesji klikania | Sumy + tabele per kostka/nagranie/sklep zgadzają się z wykonanymi akcjami; w `data/events.ndjson` zero danych osobowych |

**Scenariusz akceptacyjny end-to-end** (spec sekcja 7): wejście → katalog → kostka →
nagranie (dźwięk + animacja) → przełączanie → klik sklepu → nowa karta; wszystko policzone.
Musi przejść na desktopie i mobile.

## 3. Checklista QA przed merge do `main`

- [ ] `node --test "tests/**/*.test.js"` przechodzi lokalnie (i CI jest zielone)
- [ ] Scenariusz E2E przeklikany na desktopie (≥1280px) i mobile (≤640px)
- [ ] Zero błędów w konsoli przeglądarki na obu widokach
- [ ] Reguły biznesowe nienaruszone (PRD sekcja 5 — m.in. producent pierwszy, nowa karta, zero PII)
- [ ] Nowe elementy interaktywne: fokus klawiatury widoczny, `aria-label`/`alt` ustawione
- [ ] Szata graficzna zgodna z [`UX_ARCHITECTURE.md`](UX_ARCHITECTURE.md) (zieleń tylko jako akcent, Oswald/Inter)
- [ ] `CHANGELOG.md` uzupełniony (Keep a Changelog), commit w konwencji Conventional Commits
- [ ] Ścieżka admina (A1/A2) nadal działa bez zmian w kodzie
