# Changelog

Wszystkie istotne zmiany w projekcie są dokumentowane w tym pliku.
Format zgodny z [Keep a Changelog](https://keepachangelog.com/pl/1.1.0/),
wersjonowanie zgodne z [SemVer](https://semver.org/lang/pl/).

## [Unreleased]

### Planowane
- Prawdziwe nagrania i zdjęcia kostek (zamiast generowanych placeholderów)
- U12 porównanie A/B, U13 ankieta NPS — patrz [docs/ROADMAP.md](docs/ROADMAP.md)

## [0.4.1] — 2026-08-24

### Fixed
- **Podpisy gałek nie nachodzą na siebie** — rozmiar tekstu skaluje się z grafiką
  kostki, a kolidujące podpisy trafiają do kolejnych poziomów z zachowaniem
  min. 2 px odstępu (przeliczane po renderze, przy zmianie okna i wartości).
- **Nadmiar czarnego tła przy niskich oknach** (< 600 px) i w układzie
  jednokolumnowym: podgląd nie rozciąga się już do wysokości panelu, tylko
  otacza kostkę marginesem z progu 600 px; przy niskich oknach dodatkowo
  „przykleja się" do góry przy przewijaniu listy nagrań.
- Serwer deweloperski wysyła `no-store` dla JS/CSS/HTML — koniec z podglądem
  starej wersji podczas pracy lokalnej (audio nadal cache'owane, ma `?v=N`).

### Changed
- Kręcenie gałką przy wyciszonym odtwarzaczu **od razu włącza dźwięk**
  (tak samo jak Play) — wcześniej zmieniało tylko ustawienie.

## [0.4.0] — 2026-08-21

### Added
- **Transport play/stop** w panelu kostki — zatrzymanie i wznowienie odsłuchu
  w dowolnym momencie (ikona ▶/■, dostępna z klawiatury).

### Changed
- **Riff gra w pętli** i jest 2× dłuższy (~10,2 s, dwie frazy): można kręcić
  gałkami dowolnie długo i cały czas słyszeć zmiany brzmienia. Pętla jest
  bezszwowa (zawinięcie wybrzmienia na początek + pre-roll filtra, bez fade'ów).
- Kręcenie gałką w trakcie grania przełącza ustawienie **od tej samej pozycji
  riffu** — dźwięk nie startuje od nowa. Po zatrzymaniu kręcenie zmienia
  ustawienie bez wznawiania dźwięku (decyzja usera o ciszy jest respektowana).
- **Katalog jako siatka** zamiast karuzeli — wszystkie kostki widoczne naraz,
  bez przewijania w bok; kompaktowe hero i karty.
- **Kostka mieści się w widoku** przy wysokości okna ≥ 600 px (bez przewijania
  strony); rośnie z oknem do 820 px i powyżej ok. 1060 px wysokości okna
  zostaje w stałym rozmiarze. Poniżej 600 px strona przewija się jak dotąd.
- Pasek sklepów ograniczony do **3 pozycji**: producent + Thomann + Sweetwater
  (docelowo linki afiliacyjne).

### Fixed
- Nagrania mają wersję w URL (`?v=N`) — po zmianie brzmienia przeglądarki nie
  odtwarzają już starych plików z cache.

## [0.3.0] — 2026-08-20

### Fixed
- **Dźwięk w demo na Vercelu**: nagrania WAV przeniesione do `app/public/audio/`
  i dodane do repo (wcześniej ignorowane — statyczny hosting nie miał plików audio).
- **Linki sklepów** zweryfikowane i poprawione: Ibanez → strona modelu Tube Screamer,
  Fulltone i Wampler → strony główne (podstrony 404), GuitarCenter.pl → działający
  URL wyszukiwarki; dodany Thomann (PL).

### Added
- **Interaktywne gałki**: obrót jak prawdziwą gałką (łapiesz i kręcisz wokół osi,
  mysz/dotyk; klawiatura: strzałki; dostępność: role slider, fokus) z „zapadkami"
  na nagranych ustawieniach — złapanie zapadki od razu odtwarza pasujące nagranie,
  a jeśli riff właśnie gra, nowe ustawienie gra dalej od tej samej pozycji
  (płynne porównywanie brzmień bez restartu).
- **Dwujęzyczność EN/PL**: angielski jako wersja bazowa (domyślna), polski przez
  przełącznik EN/PL w nawigacji; opisy kostek w obu językach; wybór zapamiętywany.

### Changed
- Dopracowane grafiki kostek: gradienty obudowy, metaliczne przyciski i śruby,
  poświata LED, detale per model (szyny treadle'a Boss, chrom TS9 itd.).

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
