# PedalTest Studio

## Kontekst

Buduję webową platformę PedalTest Studio dla gitarzystów-hobbystów, którzy chcą usłyszeć, jak naprawdę brzmi efekt gitarowy (kostka), zanim go kupią. Dziś mają dwie złe opcje: nagrania na YouTube — robione przez profesjonalistów na topowym sprzęcie, często podkręcane w postprodukcji, więc niereprezentatywne — albo wyprawę do sklepu stacjonarnego, który nie zawsze istnieje w okolicy i nie zawsze pozwala testować. Istniejące strony z samplami pokazują brzmienie tylko w sztywnych, pojedynczych ustawieniach — nie da się „pokręcić gałkami" i porównać. Mój target to świadomy amator, który kupuje kostki rozważnie i porównuje brzmienie między producentami; świadomie wykluczam zawodowców (kupują bez bólu, używają modelerów gitarowych).

Kluczowy wyróżnik produktu (wizja docelowa): brzmienie pochodzi z PRAWDZIWEGO fizycznego hardware'u, nie z symulacji cyfrowej. Docelowo user będzie kręcić wirtualnymi gałkami, które przez MIDI sterują fizyczną kostką podpiętą do miksera, a audio wraca streamem. **ALE: MVP, które teraz budujesz, NIE zawiera warstwy hardware.** MVP to elegancki, otwarty portal odsłuchowy: katalog kostek → konfigurator z dużym zdjęciem kostki i animowanymi gałkami → lista nagrań tego samego riffu suchej gitary w różnych ustawieniach → kliknięcie nagrania odtwarza dźwięk, a gałki na zdjęciu płynnie ustawiają się w pozycje tego nagrania → banner afiliacyjny „Kup ten efekt w...". Portal w MVP jest w pełni otwarty: bez kont, logowania, limitów i płatności — zero tarcia przed pierwszym dźwiękiem. Monetyzacja w MVP to wyłącznie linki afiliacyjne. Na start katalog ma 5–10 kostek typu fuzz i overdrive od różnych producentów (treści dodaje admin „od kuchni"). Sukces mierzymy anonimowymi statystykami: odtworzenia per kostka/nagranie i kliknięcia w bannery — to dane do rozmów z producentami o partnerstwach.

---

## Pliki referencyjne — ZAPISZ W PROJEKCIE I REFERUJ NA BIEŻĄCO

**WAŻNE:** Zapisz dołączone pliki w `docs/` w projekcie. Utwórz/zaktualizuj `CLAUDE.md` z sekcją `## Reference docs` z linkami do tych plików.

**Te pliki to Twoja referencja OD TERAZ, nie tylko dla przyszłych iteracji** — sięgaj do nich za każdym razem, gdy budujesz kolejny komponent, ekran czy fragment funkcjonalności. Konsultuj się z nimi zamiast zgadywać.

1. **`04-spec.md` — GŁÓWNY PRD** (źródło prawdy o funkcjonalności). Zawiera:
   - Sekcję „MVP scope" na górze (co budujesz / czego nie)
   - Wszystkie user stories MVP i V2 z acceptance criteria (GIVEN/WHEN/THEN)
   - User flows krok po kroku
   - Reguły biznesowe
   - Encje danych (high-level)
   - Każda story ma jasny priorytet: **P0 (Must Have)**, **P1 (Should Have)**, **V2 (NIE BUDUJ TERAZ)**

2. **`03-design-source.md` — design.md** ze stylem wizualnym (format Google, styl inspirowany Apple). Tokeny kolorów, typografia, komponenty, do's & don'ts.

---

## Stack

Nie narzucam stacka technologicznego — dobierz technologie sensowne dla tej aplikacji na bazie wymagań.

Wskazówki konstrukcyjne:

- **Responsive, desktop i mobile** — scenariusz akceptacyjny (04-spec.md sekcja 7) musi przechodzić na obu.
- **Audio jest sercem produktu** — odtwarzanie plików audio z natychmiastową reakcją na kliknięcie, płynne przełączanie między nagraniami (bez przeładowania strony), pauza/wznowienie.
- **Animowane gałki** — gałki renderowane jako interaktywna warstwa na zdjęciu kostki (pozycje gałek definiowane per kostka w danych); płynna animacja obrotu do wartości nagrania (skala 0–10).
- **Ścieżka treści dla admina** — w MVP bez panelu w UI: wystarczy prosty, techniczny sposób dodawania kostek i nagrań (seed danych / prosty formularz chroniony / pliki konfiguracyjne — wybierz pragmatycznie). Struktura danych: patrz encje w `04-spec.md` sekcja 6.
- **Anonimowe statystyki** — zliczanie zdarzeń (odtworzenie nagrania, kliknięcie bannera) bez żadnych danych osobowych; prosty wgląd dla admina (może być nawet endpoint/zapytanie, bez rozbudowanego UI).
- **Bez auth w MVP** — żadnych kont, logowania, paywalli.

---

## Role użytkowników

- **Gość (gitarzysta)** — jedyna rola w UI; portal w pełni otwarty. Detale w `04-spec.md` sekcja 1.
- **Admin (właścicielka)** — zarządza treścią „od kuchni", bez panelu w UI. Detale w `04-spec.md` sekcja 1.
- (V2) **Zarejestrowany user** — NIE BUDUJ w MVP (pojawi się razem z rezerwacjami slotów).

---

## MVP scope — co BUDUJESZ w pierwszym buildzie

**TO BUDUJESZ — lista user stories MVP. Pełne acceptance criteria (GIVEN/WHEN/THEN) w `04-spec.md` sekcja 2. Implementuj je dosłownie.**

### Gość (5 stories P0 — Must Have)

- **U1 Przeglądanie katalogu kostek** — patrz `04-spec.md` sekcja U1
- **U2 Konfigurator kostki (zdjęcie + animowane gałki)** — patrz `04-spec.md` sekcja U2
- **U3 Odtwarzanie nagrania z animacją gałek** — patrz `04-spec.md` sekcja U3
- **U4 Przełączanie nagrań (porównanie ustawień)** — patrz `04-spec.md` sekcja U4
- **U5 Przejście do zakupu (banner afiliacyjny)** — patrz `04-spec.md` sekcja U5

### Admin (2 stories P0 — Must Have)

- **A1 Dodawanie kostki do katalogu** — patrz `04-spec.md` sekcja A1
- **A2 Dodawanie nagrań z pozycjami gałek** — patrz `04-spec.md` sekcja A2

### Should Have w MVP buildzie (1 story P1)

- **A3 Anonimowe statystyki użycia** — patrz `04-spec.md` sekcja A3

**Łącznie 8 user stories w pierwszym buildzie.**

⚠️ **WAŻNE:** Każda z tych stories MUSI być zaimplementowana zgodnie z acceptance criteria z `04-spec.md`. Nie zgaduj zachowania — sprawdź spec. **User flows (Flow 1–2) w `04-spec.md` sekcja 3 pokazują dokładnie, jak te stories łączą się w ścieżki end-to-end.** Scenariusz akceptacyjny całości: `04-spec.md` sekcja 7.

**Dane startowe:** zaseeduj katalog 5–10 przykładowych kostek (fuzz i overdrive, różni producenci) z placeholderowymi zdjęciami i krótkimi plikami audio, żeby aplikacja od pierwszego uruchomienia wyglądała i działała jak skończony produkt. Admin podmieni treści na prawdziwe ścieżką z A1/A2.

---

## Co NIE BUDUJESZ w MVP — V2 backlog

**ŚWIADOMIE ODKŁADAMY. NIE dodawaj, nawet jeśli pomyślisz, że łatwo dorzucić.** Pełne opisy w `04-spec.md` w sekcjach oznaczonych „V2 — NIE BUDUJ TERAZ".

### Could Have — V2:

- **U12 Tryb porównania dwóch kostek (A/B)** — patrz `04-spec.md` sekcja U12
- **U13 Ankieta NPS po sesji** — patrz `04-spec.md` sekcja U13

### Won't Have — V2/V3 (większe samodzielne moduły):

- **U6 Konto użytkownika** — patrz `04-spec.md` sekcja U6
- **U7 Rezerwacja slotu w kalendarzu** — patrz `04-spec.md` sekcja U7
- **U8 Płatny slot / „ukradnij slot"** — patrz `04-spec.md` sekcja U8
- **U9 Sterowanie fizyczną kostką na żywo (MIDI + stream)** — patrz `04-spec.md` sekcja U9
- **U10 Upload własnego śladu gitary** — patrz `04-spec.md` sekcja U10
- **U11 Granie na żywo z podpiętą gitarą** — patrz `04-spec.md` sekcja U11
- **A4 Panel admina w UI** — patrz `04-spec.md` sekcja A4

Warto jednak projektować dane i architekturę tak, żeby V2 (zwłaszcza U9 — live hardware i U7 — sloty) dało się dołożyć bez przebudowy fundamentów — np. gałki jako encje z wartościami, nie zaszyte w obrazkach.

---

## Design direction

**Styl wizualny opisany jest w dołączonym `03-design-source.md`** (design.md w formacie Google — design system inspirowany Apple). **KONIECZNIE go uwzględnij** — to ścisłe źródło stylu (kolory, fonty, spacing, komponenty). Konsultuj się z nim przy każdym komponencie zamiast wymyślać własne wartości.

Najważniejsze akcenty:

- Sekcje na przemian czarne (`#000000`) i jasnoszare (`#f5f5f7`) — kinowy rytm; kostka prezentowana jak produkt Apple: bohater na jednolitym tle.
- Jedyny akcent kolorystyczny: `#0071e3` (na ciemnym tle linki `#2997ff`) — wyłącznie dla elementów interaktywnych (nagrania, CTA, bannery).
- Typografia SF Pro (z systemowymi fallbackami), ciasne nagłówki (line-height 1.07–1.14), negative letter-spacing.
- Pill CTA (980px radius), glass navigation (`rgba(0,0,0,0.8)` + blur), zero gradientów, tekstur i ciężkich cieni.
- Konfigurator kostki to idealny kandydat na czarną sekcję hero — zdjęcie kostki na czystym tle, animowane gałki jako jedyny żywy element.

---

## Success criteria (MVP)

- Scenariusz akceptacyjny end-to-end (`04-spec.md` sekcja 7) przechodzi na desktopie i mobile: wejście → katalog → kostka → nagranie (dźwięk + animacja gałek) → przełączanie nagrań → klik bannera → sklep w nowej karcie.
- Statystyki działają: każde odtworzenie i kliknięcie bannera jest policzone per kostka/nagranie/sklep, bez danych osobowych.
- Admin jest w stanie dodać nową kostkę z nagraniami i pozycjami gałek bez zmian w kodzie aplikacji (ścieżka A1/A2).

---

## Trzymaj się specyfikacji (KRYTYCZNE)

1. **`04-spec.md` jest źródłem prawdy.** Role, user stories z GIVEN/WHEN/THEN, flows, reguły biznesowe, encje — wszystko tam. Implementuj acceptance criteria dosłownie, nie zgaduj.
2. **Każda story P0/P1 MUSI być zaimplementowana. Story V2 — NIE buduj**, nawet jeśli wygląda na łatwą do dorzucenia. Świadomie odkładamy.
3. **Reguły biznesowe — implementuj WSZYSTKIE** z `04-spec.md` sekcja 4 (m.in. jeden riff na kostkę, wartości gałek 2/6/9, gałki read-only w MVP, kolejność linków afiliacyjnych z producentem na czele, nowa karta + zliczanie kliknięć, brak kont/limitów, statystyki bez PII). Brak choć jednej = bug.
4. **Jeśli coś niejasne — PYTAJ, nie zgaduj.** Lepsza krótka pauza niż rebuild.
5. **Trzymaj się `03-design-source.md`.** Każdy kolor, font i border-radius pochodzi z design.md — NIE wymyślaj własnych wartości.
