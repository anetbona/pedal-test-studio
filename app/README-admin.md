# PedalTest Studio — instrukcja admina (A1/A2)

W MVP zarządzasz treścią „od kuchni" — edytujesz pliki, bez panelu w UI i **bez zmian w kodzie**.

## Uruchomienie aplikacji

```bash
node app/server.js
```

Aplikacja: http://localhost:4321 · Statystyki (A3): http://localhost:4321/stats.html

Dane startowe (8 kostek z placeholderami) wygenerowane są skryptem `node app/scripts/generate-seed.js` — uruchamiaj go ponownie tylko, jeśli chcesz zresetować katalog do stanu początkowego (nadpisze `data/pedals.json`!).

## A1 — Dodawanie kostki do katalogu

1. **Zdjęcie**: pobierz zdjęcie kostki z oficjalnej strony producenta (pionowe, np. 600×800 px) i zapisz w `app/public/img/`, np. `moja-kostka.jpg`.
2. **Wpis w katalogu**: otwórz `app/data/pedals.json` i dodaj obiekt na wzór istniejących:

```json
{
  "id": "moja-kostka",
  "name": "Nazwa modelu",
  "manufacturer": "Producent",
  "type": "overdrive",
  "image": "/img/moja-kostka.jpg",
  "description": "Krótki opis brzmienia.",
  "knobs": [
    { "id": "gain", "label": "Gain", "role": "gain", "x": 0.23, "y": 0.20, "size": 0.17, "min": 0, "max": 10 }
  ],
  "affiliateLinks": [
    { "store": "Producent (producent)", "url": "https://…?aff=pedalteststudio", "order": 1 },
    { "store": "Sweetwater", "url": "https://…", "order": 2 }
  ],
  "recordings": []
}
```

3. **Pozycje gałek na zdjęciu** (`x`, `y`, `size`) to ułamki względem zdjęcia:
   - `x: 0.5` = środek szerokości, `y: 0.2` = 20% od góry, `size: 0.17` = średnica gałki to 17% szerokości zdjęcia.
   - Najprościej: otwórz zdjęcie, zmierz piksele środka gałki i podziel przez szerokość/wysokość zdjęcia.
   - Aplikacja nałoży animowane gałki dokładnie w tych miejscach.
4. **Reguły**: `type` to `"fuzz"` albo `"overdrive"`; 3–4 gałki; **sklep producenta zawsze z `order: 1`** (banner pokazuje go pierwszego).
5. Odśwież stronę — kostka jest w katalogu.

## A2 — Dodawanie nagrań z pozycjami gałek

1. Nagraj **ten sam riff** suchej gitary przez kostkę w różnych ustawieniach. Rekomendowane wartości gałek: **2 / 6 / 9** (skala 0–10) — przy 3 gałkach ok. 9 sensownych kombinacji.
2. Pliki audio (WAV lub MP3) zapisz w `app/data/audio/<id-kostki>/`, np. `app/data/audio/moja-kostka/2-6-9.wav`.
3. Do `recordings` kostki w `pedals.json` dodaj wpis per nagranie:

```json
{
  "id": "moja-kostka-g2-t6-l9",
  "file": "/audio/moja-kostka/2-6-9.wav",
  "label": "Gain 2 · Tone 6 · Level 9",
  "knobValues": { "gain": 2, "tone": 6, "level": 9 }
}
```

Klucze w `knobValues` muszą odpowiadać `id` gałek tej kostki — kliknięcie nagrania ustawi gałki dokładnie w te pozycje.

4. Odśwież stronę — nagrania są na liście kostki.

## A3 — Statystyki

- Podgląd: http://localhost:4321/stats.html (odtworzenia per kostka/nagranie, kliknięcia per kostka/sklep).
- Surowy JSON: `GET /api/stats`. Log zdarzeń: `app/data/events.ndjson` (tylko typ zdarzenia + kostka/nagranie/sklep + czas — zero danych osobowych).

## Struktura plików

```
app/
├── server.js          ← serwer (node app/server.js)
├── data/
│   ├── pedals.json    ← KATALOG — tu dodajesz kostki i nagrania
│   ├── audio/<id>/    ← pliki audio nagrań
│   └── events.ndjson  ← log zdarzeń (statystyki)
└── public/img/        ← zdjęcia kostek
```
