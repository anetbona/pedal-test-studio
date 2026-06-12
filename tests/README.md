# Testy

Struktura zgodna z [docs/TESTING_STRATEGY.md](../docs/TESTING_STRATEGY.md):

- `integration/` — testy API przez prawdziwy serwer HTTP (wbudowany `node:test`, zero zależności)
- `unit/` — backlog: logika wyodrębniana z `server.js` przy rozbudowie (TDD)
- `e2e/` — backlog: Playwright dla Flow 1 (desktop + mobile)

Uruchomienie:

```bash
node --test "tests/**/*.test.js"
```

Scenariusze manualne (UAT) i checklista QA przed merge: [docs/TESTING_STRATEGY.md](../docs/TESTING_STRATEGY.md).
