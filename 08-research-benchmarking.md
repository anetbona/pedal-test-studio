# Research rynkowy i benchmarking konkurencji — PedalTest Studio

> Dokument analityczny. Data: 2026-06-13.
> Bazuje na materiałach projektu (`01-pomysl.md`, `02-brief.md`, `docs/STRATEGY.md`, `docs/PRD.md`, `docs/ROADMAP.md`) oraz na desk researchu rynkowym (czerwiec 2026).
> Powiązane: [`09-business-model-canvas.md`](09-business-model-canvas.md), [`10-value-proposition-canvas.md`](10-value-proposition-canvas.md).

---

## 1. Streszczenie zarządcze (TL;DR)

PedalTest Studio rozwiązuje realny, dobrze udokumentowany problem: gitarzysta-hobbysta nie ma jak rzetelnie ocenić brzmienia kostki przed zakupem. Dema na YouTube są niereprezentatywne, sklepów stacjonarnych z opcją testów jest coraz mniej, a strony z samplami pokazują brzmienie w sztywnych ustawieniach. Problem jest prawdziwy i powtarzalny — to dobra wiadomość.

Zła wiadomość jest taka, że **pomysł nie jest pusty na rynku**. Dwa rozwiązania robią już niemal dokładnie to, co PedalTest planuje na dwóch swoich kluczowych etapach:

- **Loopy Demos** robi to, co MVP PedalTest — interaktywne odsłuchy z przełączaniem ustawień gałek (reamp + nagrane „przejścia" potencjometrów).
- **Thomann Stompenberg FX** robi to, co „wizja docelowa" PedalTest — prawdziwy, fizyczny hardware sterowany zdalnie przez przeglądarkę, za darmo, na 200+ kostkach, z grą na żywo (latencja do 200 ms). Jest własnością Thomanna, czyli największego sklepu muzycznego w Europie.

To nie przekreśla pomysłu, ale **radykalnie zmienia jego pozycjonowanie**. Przewagą PedalTest nie może być „jako jedyni kręcimy gałkami prawdziwej kostki online" — bo to już istnieje i jest darmowe, finansowane przez giganta. Przewaga musi być węższa i ostrzejsza: **kuratorowane, uczciwe porównania dla początkującego hobbysty, który nie chce 200 kostek, tylko chce zrozumieć różnicę między pięcioma overdrive'ami i kupić jeden.** Decyzyjność zamiast katalogu.

Najtrudniejszy element to monetyzacja. Afiliacja na sprzęcie fizycznym płaci bardzo mało (Reverb ~1% na produktach fizycznych, Sweetwater rozliczane per klik ~$0,07), więc model „afiliacja + płatne minuty" wymaga albo ogromnego ruchu, albo partnerstw producenckich, albo zupełnie innego strumienia przychodów.

---

## 2. Problem i jego walidacja

Założenie produktu — że dema na YouTube są niereprezentatywne — **potwierdza się w opiniach użytkowników**, niezależnie od materiałów projektu.

Na forach gitarowych (Telecaster Guitar Forum, Ultimate Guitar) regularnie wraca skarga: gitarzysta kupuje kostkę na podstawie demo na YouTube, ustawia gałki dokładnie tak jak w nagraniu — i nie uzyskuje tego samego brzmienia. Powody są strukturalne: inny wzmacniacz, inna gitara, inny gracz, inne ręce, a często też podkręcenie w postprodukcji. Pojawiają się relacje osób, które kupowały, sprzedawały i znów kupowały tę samą kostkę, nie mogąc dojść do brzmienia z demo.

To jest dokładnie ten ból, który PedalTest adresuje. **Persona i problem są trafne.** Pytanie nie brzmi „czy problem istnieje", tylko „czy nasze rozwiązanie jest wyraźnie lepsze od tego, co już rozwiązuje ten ból za darmo".

### Wielkość rynku

Globalny rynek efektów gitarowych to ok. **3,8 mld USD w 2025 r.**, z prognozą wzrostu do ok. 4,6–4,8 mld USD w 2029 r. (CAGR ~4–6%). Napędzają go domowe studia nagraniowe, treści edukacyjne dla muzyków i wzrost sprzedaży gitar. Rynek jest zdrowy i rosnący, ale **dojrzały i rozdrobniony** — to nie jest dziewicza przestrzeń, lecz arena z mocnymi graczami contentowymi i e-commerce'owymi.

---

## 3. Krajobraz konkurencyjny

Konkurencja dzieli się na pięć kategorii. Żadna z nich nie jest „pusta" — każdą część problemu ktoś już obsługuje.

### A. Interaktywne odsłuchy na prawdziwym hardware (bezpośredni konkurent wizji docelowej)

**Thomann Stompenberg FX** — najgroźniejszy konkurent. Thomann fizycznie rozbiera kostki, mierzy działanie potencjometrów i przełączników, zastępuje je sterowaniem cyfrowym i umieszcza kostki w racku w swojej centrali. Użytkownik z przeglądarki steruje **prawdziwym sprzętem**. Dostępne: 14 pętli wzorcowych (9 gitara, 5 bas), upload własnej pętli, **gra na żywo z latencją do 200 ms**, 5 symulacji kolumn (IR Celestion) i własne IR. Ponad 200 kostek topowych marek (JHS, TC Electronic, Boss, Revv, Walrus). Usługa jest **darmowa**, a monetyzacją jest sprzedaż sprzętu w sklepie Thomann.

To jest dokładnie etap U9 z roadmapy PedalTest (wirtualne gałki → MIDI → rig → stream audio), tyle że już wdrożony, na masową skalę, przez podmiot z nieporównywalnym budżetem i katalogiem.

### B. Interaktywne odsłuchy na nagraniach (bezpośredni konkurent MVP)

**Loopy Demos** — robi dokładnie to, co MVP PedalTest. Ślad DI wychodzi z interfejsu, przez reamp box, przez kostkę i wraca do interfejsu; nagrywane są „przejścia gałek" (knob sweeps) — kilka pozycji jednego potencjometru przy stałych pozostałych. Użytkownik kręci gałką i słyszy zmianę natychmiast. Dochodzą posty blogowe z porównaniami podobnych kostek „back-to-back". Współpracuje z producentami kostek. To dojrzała, lubiana realizacja tej samej idei co PedalTest MVP — z przewagą realnych nagrań (nie syntezowanego riffu) i contentu redakcyjnego.

**TonePedia** — porównywarka sprzętu (gitary, wzmacniacze, kostki) z odsłuchem zestawień obok siebie.

### C. Wizualne planery pedalboardów (bez dźwięku)

**Pedal Playground** i **PedalboardPlanner.com** — pozwalają układać wirtualny pedalboard (przeciąganie kostek, planowanie sygnału), ale **nie grają dźwiękiem**. To narzędzia planistyczne, nie odsłuchowe. Pokazują jednak, że ludzie chętnie korzystają z wizualnych, interaktywnych narzędzi „okołozakupowych".

### D. Emulacje programowe (anty-wzorzec wg briefu, ale realny substytut)

**AmpliTube / IK Multimedia, Neural DSP, Line 6 Helix Native, Positive Grid** — software'owe modele sprzętu z opcją „try before you buy" (np. AmpliTube: demo każdego modelu przez 72 h, 400+ modeli). PedalTest świadomie się od nich odcina („to nie symulacja"), ale dla użytkownika one **rozwiązują podobny ból** — sprawdzenie brzmienia bez kupowania fizycznej kostki. Co więcej, część hobbystów po przetestowaniu w ogóle nie kupuje hardware'u, tylko zostaje przy pluginie.

### E. Wypożyczalnie fizycznych kostek (model „Netflix dla kostek")

**Pedal Genie (USA)** — subskrypcja $34,95/mies., 2000+ kostek od 130+ producentów, wysyłka pocztą, brak opłat za zwłokę, zniżka przy zakupie testowanej kostki. **Tonebuddy → The Pedal Club (UK)** — £30/mies. lub £300/rok, 500+ kostek, jedna kostka miesięcznie, 10% zniżki przy zakupie (ale kupujesz nową sztukę, nie testowaną). To jedyny model, który daje **fizyczny kontakt z kostką** — co dla wielu gitarzystów jest jedyną w pełni wiarygodną formą testu (czuć przełącznik, grać na żywo na własnym wzmacniaczu).

---

## 4. Benchmarking — tabela porównawcza

| Rozwiązanie | Co robi | Model biznesowy | Mocne strony | Słabe strony |
|---|---|---|---|---|
| **Thomann Stompenberg FX** | Zdalne sterowanie prawdziwym hardware'em online; pętle + upload + gra na żywo (≤200 ms) | Darmowe; monetyzacja = sprzedaż sprzętu w Thomann | Prawdziwy hardware, 200+ kostek, gra na żywo, IR kolumn, marka i katalog giganta, za darmo | Latencja do 200 ms; część kostek brzmi słabo na wzorcowych riffach; bywają awarie/niedostępność; przytłaczający wybór dla nowicjusza |
| **Loopy Demos** | Interaktywne odsłuchy z przełączaniem gałek (reamp + knob sweeps) | Współprace z producentami; content/marketing | Realne nagrania, uczciwe „sweepy", content porównawczy, dopracowany UX | Brak grania na żywo; ograniczony katalog; zależność od współprac z markami |
| **TonePedia** | Porównywarka sprzętu obok siebie | Afiliacja / leady | Szeroki zakres sprzętu, porównania A/B | Mniej „interaktywne kręcenie", bardziej baza |
| **Pedal Playground / PedalboardPlanner** | Wizualny planer pedalboardu (bez dźwięku) | Afiliacja / sklep (ProGuitarShop) | Prosty, popularny, świetny do planowania | Brak dźwięku — nie rozwiązuje testu brzmienia |
| **AmpliTube / Neural DSP / ToneX** | Software'owe modele sprzętu, demo 72 h | Sprzedaż licencji / a la carte | Ogromne katalogi, realne „try before buy", granie na żywo bez sprzętu | To symulacja, nie hardware; część userów zostaje przy pluginie zamiast kupić kostkę |
| **Pedal Genie (US) / The Pedal Club (UK)** | Wypożyczalnia fizycznych kostek pocztą | Subskrypcja (~$35 / £30 mies.) + sprzedaż ze zniżką | Pełny fizyczny test na własnym sprzęcie; ogromny katalog; zniżka na zakup | Koszt miesięczny; logistyka i zwroty; popularne nowości „wiecznie wypożyczone"; geograficznie ograniczone |
| **Dema YouTube / That Pedal Show / JHS** | Wideo-dema | Reklamy, sponsoringi, afiliacja | Darmowe, ogromny zasięg, zaufanie do twórców | Niereprezentatywne (inny sprzęt/gracz/postprodukcja); brak interakcji; sztywne ustawienia |
| **Sklep stacjonarny** | Fizyczny test na miejscu | Sprzedaż | Pełny realny test, doradztwo | Często brak w okolicy; nie zawsze pozwalają testować; presja sprzedażowa |
| **PedalTest Studio (MVP)** | Interaktywny odsłuch nagrań (1 riff, ustawienia 2/6/9) + belka afiliacyjna | Afiliacja (docelowo + płatne minuty na rigu) | Otwarty, zero tarcia, uczciwe porównanie (ten sam riff), kuratorowany wybór | Syntezowany riff (nie realne nagranie); mały katalog; pokrywa się z Loopy Demos; słaba ekonomia afiliacji |

---

## 5. Analiza modeli biznesowych konkurencji (mocne i słabe strony)

**Model „darmowo, bo jesteśmy sklepem" (Thomann Stompenberg).** Najsilniejszy ekonomicznie: narzędzie nie musi zarabiać samo, bo jest lejkiem sprzedażowym dla sklepu z marżą na sprzęcie. Słabość: wymaga posiadania sklepu/marży i ogromnego kapitału na rig setek kostek. Dla niezależnego startupu **niemożliwy do skopiowania** bez zaplecza e-commerce.

**Model „współprace z producentami" (Loopy Demos).** Producent płaci/dostarcza kostkę za profesjonalne, interaktywne demo. Silne: niski koszt sprzętu (kostki od marek), wbudowany kanał dystrybucji (marka udostępnia demo). Słabe: zależność od woli producentów, ryzyko utraty niezależności i wiarygodności („skoro marka płaci, czy demo jest uczciwe?").

**Model afiliacyjny (większość porównywarek).** Prosty, skalowalny, bez magazynu. Słaby punkt: **stawki na sprzęcie fizycznym są niskie** — Reverb ~1% na produktach fizycznych (10% tylko na cyfrowych), Sweetwater rozlicza per klik (~$0,07) lub do 8% w oknie 30 dni. Przy średniej kostce ~600–1200 zł i prowizji 1–5% to ~6–60 zł od zakupu — i to tylko od tych, którzy faktycznie kupią. Model wymaga **dużej skali ruchu** i wysokiej konwersji, żeby się spiąć.

**Model subskrypcyjny / wypożyczalnia (Pedal Genie, The Pedal Club).** Powtarzalny przychód, jasna wartość (fizyczny test). Słabe: kapitałochłonny (trzeba kupić 500–2000 kostek), logistyka i zwroty, ryzyko zniszczeń, „popularne nowości wiecznie wypożyczone". Ograniczony geograficznie (wysyłka).

**Model treściowy (YouTube).** Reklamy + sponsoringi + afiliacja. Skalowalny, ale to inny biznes (produkcja wideo, budowa zasięgu, osobowość twórcy) niż narzędzie webowe.

---

## 6. Mocne i słabe strony pomysłu PedalTest Studio (SWOT)

### Mocne strony (Strengths)

- **Trafny, zwalidowany problem** i ostro zdefiniowana persona (hobbysta, świadome wykluczenie pro/modelerów).
- **Uczciwość porównania** — ten sam riff przez różne kostki w tych samych ustawieniach (2/6/9). To realna przewaga nad chaotycznym YouTube.
- **Zero tarcia** — otwarty portal bez kont, logowania i paywalla przed pierwszym dźwiękiem. Niska bariera wejścia.
- **Architektura gotowa na rozwój** — gałki jako encje z wartościami (nie zaszyte w obrazku), więc live MIDI i sloty nie wymagają przebudowy fundamentów.
- **Niski koszt startu** — zero-dependency, znikomy hosting; MVP już zbudowane i działa.
- **Kuratorstwo** — mały, przemyślany katalog (4 overdrive + 4 fuzz) to potencjalna zaleta dla nowicjusza zagubionego w 200+ kostkach Stompenberga.

### Słabe strony (Weaknesses)

- **Syntezowany riff zamiast realnego nagrania** — to podważa cały rdzeń wartości („usłysz, jak brzmi NAPRAWDĘ"). Użytkownik usłyszy syntezę, nie prawdziwą kostkę. To największa słabość MVP.
- **Pokrycie z Loopy Demos** — MVP nie wnosi nic, czego Loopy Demos już nie robi lepiej (realne nagrania, content, dopracowany UX).
- **Słaba ekonomia afiliacji** na sprzęcie fizycznym (patrz rozdz. 5).
- **Mały katalog** — 8 kostek vs 200+ (Stompenberg) i 2000+ (Pedal Genie).
- **Brak grania na żywo i uploadu w MVP** — czyli brak tego, co najbardziej różnicuje (Stompenberg już to ma).
- **Ryzyko prawne / wizerunkowe** przy nazwach i grafikach kostek bez umów z producentami (do potwierdzenia z prawnikiem; użycie nominatywne zwykle dozwolone, ale partnerstwa zamykają temat).

### Szanse (Opportunities)

- **Nisza „decyzyjna dla początkującego"** — nikt nie robi dobrze prostego, kuratorowanego „pomożemy ci wybrać PIERWSZY overdrive". Stompenberg jest dla zaawansowanych i przytłacza wyborem.
- **Treść porównawcza pod SEO** („Tube Screamer vs Blues Driver dla początkującego") — wysoka intencja zakupowa, niski koszt produkcji.
- **Rynek PL / CEE** — większość rozwiązań jest anglojęzyczna i US/UK-centryczna; lokalny content i lokalne sklepy afiliacyjne to luka.
- **Partnerstwa z mniejszymi/boutique producentami**, którym zależy na ekspozycji i nie mają zasięgu w dużych platformach.
- **Edukacja** — „co robi która gałka", słowniczek brzmień — przyciąga dokładnie personę-nowicjusza.

### Zagrożenia (Threats)

- **Thomann Stompenberg FX** — gigant robi „wizję docelową" za darmo. Bezpośrednie starcie na tym polu jest przegrane.
- **Loopy Demos** — robi MVP lepiej i ma relacje z markami.
- **Trend w stronę software'u** (Neural DSP, ToneX) — część przyszłych hobbystów w ogóle nie kupi fizycznej kostki.
- **Zależność od programów afiliacyjnych** — zmiana stawek/regulaminu przez Reverb/Sweetwater/Thomann wywraca przychody.
- **Bariera treści** — wiarygodne, realne nagrania setek kostek to ogromny, ciągły koszt produkcji (i/lub kapitał na rig).

---

## 7. Kierunki rozwoju (gdzie iść)

1. **Przejść z syntezy na realne nagrania — to priorytet zero.** Bez prawdziwego dźwięku kostki produkt nie dotrzymuje obietnicy. Zacznij od kilku kostek nagranych realnie (reamp jak Loopy Demos), niż od dużego katalogu syntezy. Lepiej 5 prawdziwych niż 50 fałszywych.

2. **Zawęzić pozycjonowanie do „przewodnika decyzyjnego dla początkującego".** Nie „katalog wszystkiego", tylko „pomożemy ci wybrać pierwszy overdrive/fuzz". Tryb porównania A/B dwóch kostek (U12 z roadmapy) jest tu kluczowy — to twój najmocniejszy, brakujący w MVP feature. Przesuń go w priorytecie do góry.

3. **Postawić na treść porównawczą i SEO.** Strony typu „TS9 vs OCD vs Blues Driver — który pierwszy overdrive" łapią ruch o wysokiej intencji zakupowej i napędzają afiliację. To tańsze niż rig i skaluje się.

4. **Wejść w rynek PL/CEE jako pierwszy.** Lokalny język, lokalne sklepy afiliacyjne (np. polskie sklepy gitarowe), lokalne społeczności. Globalni gracze tu nie sięgają.

5. **Budować partnerstwa z boutique/mniejszymi producentami**, nie ścigać się o Boss/Ibanez z Thomannem. Mniejsze marki chętniej dadzą kostki i content za ekspozycję.

6. **Warstwa edukacyjna** — „co robi Tone, co robi Gain", glosariusz brzmień, krótkie wyjaśnienia przy każdej kostce. To pogłębia wartość dla persony i buduje zaufanie/SEO.

7. **Monetyzację dywersyfikować** poza czystą afiliację: płatne partnerstwa producenckie (promowane demo), ewentualnie później model premium (zapis presetów, większy katalog).

---

## 8. W co NIE iść (anty-rekomendacje)

1. **Nie ścigaj się ze Stompenbergiem na „prawdziwy hardware online za darmo".** Etap U9 (rig z setkami kostek sterowany zdalnie) to walka kapitałowa z największym sklepem w Europie, który już to ma i oddaje za darmo. To nie jest pole, na którym startup wygra. Jeśli kiedykolwiek robić rig — to wąski, tematyczny, niszowy (np. wyłącznie boutique fuzze), nie „wszystko".

2. **Nie skaluj katalogu syntezowanych nagrań.** Każda kolejna syntezowana kostka pogłębia rozbieżność między obietnicą („prawdziwe brzmienie") a produktem. Skalowanie tego, co nie spełnia obietnicy, to skalowanie problemu.

3. **Nie buduj uploadu własnego śladu i grania na żywo zbyt wcześnie.** To kosztowne (DSP, latencja, infrastruktura audio) i już istnieje u Stompenberga oraz w pluginach. To nie jest twój wyróżnik.

4. **Nie wchodź w model wypożyczalni fizycznej** (Pedal Genie). Wymaga dużego kapitału na zapas kostek, logistyki, obsługi zwrotów i zniszczeń — zupełnie inny biznes, kapitałochłonny, z cienką marżą.

5. **Nie opieraj przychodów wyłącznie na afiliacji sprzętu fizycznego.** Stawki są zbyt niskie (~1% Reverb), by utrzymać produkt bez ogromnej skali. Afiliacja może być dodatkiem, nie fundamentem.

6. **Nie celuj w profesjonalistów.** Słusznie wykluczeni w briefie — kupują bez bólu i używają modelerów. Rozmywanie persony osłabiłoby jedyną przewagę (fokus na nowicjuszu).

7. **Nie używaj nazw/grafik producentów bez weryfikacji prawnej**, jeśli skala urośnie. Na małą skalę użycie nominatywne zwykle jest bezpieczne, ale przy monetyzacji i ekspozycji marek warto domknąć temat umowami lub konsultacją.

---

## 9. Wnioski

Problem jest realny, persona trafna, a MVP technicznie sprawne i tanie. Ale pomysł w obecnej formie stoi między dwoma silniejszymi rozwiązaniami: Loopy Demos (lepsze MVP) i Thomann Stompenberg FX (gotowa „wizja docelowa", za darmo, od giganta). Droga naprzód nie wiedzie przez „robienie tego samego, ale też" — tylko przez **zawężenie**: realne nagrania zamiast syntezy, fokus na decyzję początkującego (porównanie A/B + edukacja), rynek PL/CEE jako przyczółek i partnerstwa z mniejszymi markami. Monetyzacja afiliacyjna powinna być traktowana jako dodatek, a nie fundament — fundamentem jest zaufanie i decyzyjność dostarczone wąsko zdefiniowanej personie.

---

## Źródła

- [Thomann Stompenberg FX — MusicTech](https://musictech.com/news/gear/thomann-stompenberg-fx/)
- [Thomann Stompenberg FX — Guitar.com](https://guitar.com/news/gear-news/thomann-stompenberg-fx-demo-pedals-free/)
- [Thomann Stompenberg FX — MusicRadar](https://www.musicradar.com/news/test-guitar-effects-pedals-from-the-comfort-of-your-home-with-thomanns-stompenberg-fx-online-app)
- [Stompenberg FX — Thomann Blog (Speaker Sim Update)](https://www.thomann.de/blog/en/gear/stompenberg-fx-speaker-simulator-update/)
- [Stompenberg FX — diystompboxes forum](https://www.diystompboxes.com/smfforum/index.php?topic=121788.0)
- [Loopy Demos](https://loopydemos.com/)
- [Loopy Demos — About](https://loopydemos.com/about)
- [TonePedia](https://www.tonepedia.com/)
- [Pedal Playground](https://pedalplayground.com/)
- [PedalboardPlanner.com — Sweetwater InSync](https://www.sweetwater.com/insync/cool-site-pedalboardplannercom/)
- [AmpliTube Custom Shop — IK Multimedia](https://www.ikmultimedia.com/products/amplitube5cs/)
- [Pedal Genie — Distortion Pedal HQ review](http://distortionpedalhq.com/pedal-genie-review/)
- [Pedal Genie vs Tonebuddy — Guitar Pedal X](https://www.guitarpedalx.com/news/news/try-before-you-buy-makes-uss-pedal-genie-and-uks-tonebuddy-essential-resources-for-many-pedal-fans)
- [Tonebuddy → The Pedal Club — Guitar Pedal X](https://www.guitarpedalx.com/news/gpx-blog/the-uk-now-has-its-own-pedal-rental-subscription-service-tonebuddy---how-does-it-compare-to-the-industry-standard-pedal-genie)
- [Pedały nie brzmią jak na YouTube — Telecaster Guitar Forum](https://www.tdpri.com/threads/pedals-that-dont-sound-as-good-as-youtube-demos-make-them-sound.1006983/)
- [Co gitarzyści krytykują w demach YouTube — Ultimate Guitar](https://www.ultimate-guitar.com/forum/showthread.php?t=826038)
- [Reverb / Sweetwater i inne programy afiliacyjne — Commission Academy](https://commission.academy/blog/best-musical-instrument-affiliate-programs/)
- [Sweetwater Affiliate Program — FlexOffers](https://www.flexoffers.com/affiliate-programs/sweetwater-sound-affiliate-program/)
- [Guitar Pedals Global Market Report 2025 — Research and Markets](https://www.researchandmarkets.com/reports/6009292/guitar-pedals-global-market-report)
- [Guitar Effects Pedals Market — Cognitive Market Research](https://www.cognitivemarketresearch.com/guitar-effects-pedals-market-report)
