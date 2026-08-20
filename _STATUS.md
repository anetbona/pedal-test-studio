---
project_name: "PedalTest Studio (robocza)"
project_slug: "pedal-tester"
date_started: 2026-06-11
current_step: 7
completed_steps: [1, 2, 3, 4, 5, 7]
has_design_md: true
optional_visualizations: []
last_updated: 2026-06-11
---

## Decyzje
- Krok 1: brain dump zapisany. Pomysl: platforma do testowania efektow gitarowych online (wirtualne galki, upload suchego sladu, pozniej signal chain + afiliacja).

- Krok 2: brief zatwierdzany. KLUCZOWE: prawdziwy hardware (kostki + mikser + MIDI), NIE symulacja. MVP: gotowe sample, 5-10 kostek (fuzz/overdrive), konta, freemium 15 min + 5 USD/h, NPS, afiliacja. V2: upload sladu. V3: live z gitara. Target: hobbysta-amator (NIE pro/modelery).

- Krok 3: design.md = Apple z getdesign.md, 1:1 bez modyfikacji. Tokeny: black #000000 / light #f5f5f7, akcent #0071e3 (dark bg links #2997ff), SF Pro, pill CTA, glass nav.

- Krok 4: WAZNY PIVOT - MVP BEZ live hardware! MVP = katalog + konfigurator (zdjecie + animowane galki read-only) + nagrania (1 riff, ustawienia 2/6/9) + banner afiliacyjny + anonimowe statystyki. Otwarty portal, bez kont. Live MIDI/sloty/platnosci/konta/porownanie A/B/NPS = pozniejsze etapy. Stories: U1-U13, A1-A4 w 04-spec.md.

- Krok 5: MoSCoW zatwierdzony. P0: U1-U5, A1, A2. P1: A3. Could/V2: U12, U13. Won't/V2+: U6-U11, A4. 04-spec.md zaktualizowany (MVP scope + priorytety), 04-spec.html z badge'ami, 05-mvp-decision.html gotowy.

- Krok 6: pominiety (user wybral "do promptu").
- Krok 7: paczka gotowa POD CLAUDE CODE (nie Replit - decyzja usera). 07-initial-prompt.md + README.md wygenerowane.
- 2026-06-12: REDESIGN (decyzja usera): grafiki kostek odtworzone na wzór oryginałów (proporcje, kolory, układ gałek per model), logo producenta przy nazwie, opis rozwijany „więcej", podstrona kostki w stylu Knobyfier (biała belka nav / ciemny podgląd po lewej / numerowane sekcje po prawej / belka sklepów na dole, font Oswald+Inter, zieleń #2e7d32).
- 2026-06-12 (cd.): CAŁA APKA ujednolicona do szaty Knobyfier (decyzja usera) — strona główna (hero, katalog, karty), stopka i stats.html. Styl Apple z 03-design-source.md ZASTĄPIONY w implementacji (dokument zostaje jako archiwum decyzji z Kroku 3).
- 2026-06-11: MVP ZBUDOWANE w `app/` (Claude Code). Zero-dependency Node + vanilla JS (bez node_modules — projekt w Google Drive). 8 stories (U1–U5, A1–A3) zaimplementowane i zweryfikowane e2e na desktopie i mobile. Start: `node app/server.js` → localhost:4321. Seed: 8 kostek × 9 nagrań (syntezowany riff, słyszalne różnice ustawień). Ścieżka admina: `app/README-admin.md`. Statystyki: /stats.html + GET /api/stats.

## Notatki agenta
- Granica webapp vs fizyczny rig: w MVP nieistotna (brak riga). Sloty/kradziez slotu (20 PLN/30min) opisane w U7-U9 + Flow 3 jako pozniejsze etapy.
- Otwarte pytania na Krok 2: zrodlo modeli efektow (generyczne vs konkretne kostki), live input vs upload, konta w v1, success criteria.
- 2026-06-12: REPO GITHUB utworzone (skill repozytorium-gh): https://github.com/anetbona/pedal-test-studio (prywatne). Git w folderze projektu (decyzja userki). Dodane: docs/ (PRD, STRATEGY, ROADMAP, UX_ARCHITECTURE, TESTING_STRATEGY), tests/ (integration, node:test), .github/ (CI + szablony PR/issues), CHANGELOG, nowy README (stary -> docs/archiwum-paczka-claude-code.md). CI zielone.
- 2026-08-19: DEPLOY NA VERCELU — **https://pedal-test-studio.vercel.app** (projekt `pedal-test-studio` na koncie Vercel „Aneta's projects", auto-deploy z `main`). Konfiguracja: statyki serwowane z `app/public` (ustawienie Output Directory, bez builda), a trzy endpointy API odtworzone jako funkcje serverless w nowym katalogu `api/` (pedals / events / stats — logika 1:1 z `app/server.js`; events/stats piszą do `/tmp`, więc statystyki w demo są ulotne między instancjami). Zweryfikowane: `/api/pedals` zwraca 8 kostek, POST `/api/events` → 201, `/api/stats` liczy agregaty.
- 2026-08-19: README na GitHubie zaktualizowane — sekcja „Live demo" (EN nad PL, zgodnie z regułą dwujęzycznych opisów) z notkami o wersji demo, `api/` dopisane do struktury, wiersz „Deploy: Vercel" w tabeli stosu. Opis repo zmieniony na dwujęzyczny „EN. · PL: …". Pole Website repo → link do dema (ustawione automatycznie przez integrację Vercel–GitHub).
- 2026-08-19: Projekt podpięty do portfolio: karta „PedalTest Studio" (live) na hubie **https://anetabona.vercel.app** oraz para „live demo · code" w profile README `anetbona/anetbona`. Kontekst huba: projekt [[Portfolio]] (`3-Projects/Portfolio/`).
- 2026-08-19 UWAGA (git): zmiany z tego dnia (katalog `api/`, README, opisy) były commitowane bezpośrednio na GitHubie (web UI) — lokalny klon w tym folderze jest ZA `origin/main`. Przed dalszą pracą lokalną: `git pull`.
- OGRANICZENIA DEMA (do zrobienia): nagrania audio to lokalnie generowane placeholdery i NIE są w repo → w demo odsłuch nie działa (404 na `/audio/*`); do rozważenia: commit wygenerowanego seeda audio albo prawdziwe nagrania ścieżką z `app/README-admin.md`. Statystyki ulotne — jeśli demo ma zbierać realne dane, potrzebny trwały storage (np. Vercel KV/Blob albo Supabase).

- 2026-08-20: FIX VERCEL + UX (decyzje userki): audio przeniesione do app/public/audio i DODANE DO REPO (na Vercelu nie bylo dzwieku); galki INTERAKTYWNE (kręcenie przyciąga do nagranych ustawień 2/6/9 i odtwarza — uchyla regułę read-only z MVP); i18n EN (bazowy, domyslny) + PL z przelacznikiem w nav; opisy kostek EN+PL; linki sklepów zweryfikowane (Ibanez/Fulltone/Wampler poprawione, GuitarCenter.pl dzialajaca wyszukiwarka, dodany Thomann); grafiki kostek dopracowane (gradienty, metal, LED).
