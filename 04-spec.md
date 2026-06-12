# Specyfikacja funkcjonalna: PedalTest Studio

> 🎯 **Ten plik jest GŁÓWNYM PRD** — jedyne źródło prawdy o funkcjonalności tego projektu.
> To plik, który załączysz do Replita jako attachment do `07-initial-prompt.md`.

Data: 2026-06-11 · Priorytety zatwierdzone (MoSCoW, Krok 5)

## 🎯 MVP scope (P0 + P1) — to Replit buduje w pierwszym buildzie

**7 stories Must Have (P0)** — core flow:
- U1 Przeglądanie katalogu kostek
- U2 Konfigurator kostki (zdjęcie + animowane gałki)
- U3 Odtwarzanie nagrania z animacją gałek
- U4 Przełączanie nagrań (porównanie ustawień)
- U5 Przejście do zakupu (banner afiliacyjny)
- A1 Dodawanie kostki do katalogu
- A2 Dodawanie nagrań z pozycjami gałek

**1 story Should Have (P1)** — w MVP buildzie:
- A3 Anonimowe statystyki użycia

## 🔮 V2 backlog (Could + Won't Have) — dorzucamy iteracyjnie w Replit po MVP

- U12 Tryb porównania dwóch kostek A/B (Could)
- U13 Ankieta NPS po sesji (Could)
- U6 Konto użytkownika (Won't)
- U7 Rezerwacja slotu w kalendarzu (Won't)
- U8 Płatny slot / „ukradnij slot" (Won't)
- U9 Sterowanie fizyczną kostką na żywo — MIDI (Won't)
- U10 Upload własnego śladu gitary (Won't)
- U11 Granie na żywo z podpiętą gitarą (Won't)
- A4 Panel admina w UI (Won't)

---

## 1. Role użytkowników

- **Gość (gitarzysta):** każdy odwiedzający — portal w MVP jest w pełni otwarty, bez kont i logowania. Przegląda katalog kostek, odtwarza nagrania, ogląda animację gałek, klika linki afiliacyjne. (Konta pojawią się w późniejszych wersjach razem z rezerwacjami.)
- **Admin (właścicielka):** w MVP zarządza treścią „od kuchni" (bez panelu w UI) — dodaje kostki, nagrania z pozycjami gałek, linki afiliacyjne; ma dostęp do anonimowych statystyk. Panel admina w UI (kalendarz, finanse, statystyki) to późniejsza wersja.

## 2. User stories z acceptance criteria

### U1: Przeglądanie katalogu kostek

**Priorytet:** P0 (Must Have — MVP)

**Jako** gość **chcę** przeglądać przesuwany katalog kostek **żeby** znaleźć efekt, który chcę usłyszeć

- **GIVEN** wchodzę na stronę główną
  **WHEN** strona się załaduje
  **THEN** widzę przesuwany (karuzela/scroll) katalog kostek ze zdjęciem, nazwą, producentem i typem efektu (fuzz / overdrive)
- **GIVEN** katalog jest widoczny
  **WHEN** przesuwam go (swipe na mobile, strzałki/scroll na desktopie)
  **THEN** płynnie przewijam kolejne kostki

### U2: Konfigurator kostki (zdjęcie + animowane gałki)

**Priorytet:** P0 (Must Have — MVP)

**Jako** gość **chcę** otworzyć widok wybranej kostki z jej zdjęciem i gałkami **żeby** zobaczyć ją tak, jakbym miał ją przed sobą

- **GIVEN** widzę katalog
  **WHEN** klikam kostkę
  **THEN** obok/na środku otwiera się konfigurator: duże zdjęcie kostki z nałożonymi animowanymi gałkami (3–4 potencjometry z nazwami, skala 0–10) oraz lista nagrań tej kostki
- **GIVEN** konfigurator jest otwarty
  **WHEN** patrzę na gałki
  **THEN** każda gałka pokazuje aktualną wartość zgodną z wybranym nagraniem

### U3: Odtwarzanie nagrania z animacją gałek

**Priorytet:** P0 (Must Have — MVP)

**Jako** gość **chcę** kliknąć nagranie z listy i usłyszeć kostkę w tych ustawieniach **żeby** ocenić brzmienie własnym uchem

- **GIVEN** konfigurator kostki jest otwarty
  **WHEN** klikam nagranie z listy
  **THEN** nagranie odtwarza się, a gałki na zdjęciu płynnie animują się do pozycji przypisanych temu nagraniu
- **GIVEN** nagranie gra
  **WHEN** klikam pauzę / inne nagranie
  **THEN** dźwięk zatrzymuje się / przełącza na nowe nagranie z nową animacją gałek

### U4: Przełączanie nagrań (porównanie ustawień)

**Priorytet:** P0 (Must Have — MVP)

**Jako** gość **chcę** szybko przełączać się między nagraniami tej samej kostki **żeby** usłyszeć, jak zmiana ustawień zmienia brzmienie tego samego riffu

- **GIVEN** lista nagrań kostki (ten sam riff w różnych ustawieniach)
  **WHEN** klikam kolejne nagrania
  **THEN** słyszę różnicę brzmienia, a gałki za każdym razem pokazują aktualne ustawienia

### U5: Przejście do zakupu (banner afiliacyjny)

**Priorytet:** P0 (Must Have — MVP)

**Jako** gość **chcę** kliknąć banner „Kup ten efekt w..." **żeby** kupić kostkę, która mi się spodobała

- **GIVEN** konfigurator kostki jest otwarty
  **WHEN** patrzę na widok kostki
  **THEN** widzę banner z linkami zakupowymi: sklep producenta jako pierwszy, potem pozostałe sklepy (np. Sweetwater, GuitarCenter.pl, GuitarCenter)
- **GIVEN** banner jest widoczny
  **WHEN** klikam link sklepu
  **THEN** otwiera się strona sklepu w nowej karcie (link afiliacyjny), a kliknięcie zapisuje się w statystykach

### U6: Konto użytkownika

**Priorytet:** V2 (Won't Have w MVP — świadomie odkładamy, NIE BUDUJ TERAZ)

**Jako** gość **chcę** założyć konto **żeby** rezerwować sloty i mieć historię testów

- **GIVEN** portal z włączonymi rezerwacjami
  **WHEN** rejestruję się
  **THEN** mam konto umożliwiające rezerwacje i widoczność własnych statystyk

### U7: Rezerwacja slotu w kalendarzu

**Priorytet:** V2 (Won't Have w MVP — świadomie odkładamy, NIE BUDUJ TERAZ)

**Jako** zalogowany user **chcę** zarezerwować slot czasowy na fizycznej kostce **żeby** mieć ją na wyłączność (1 kostka = 1 user naraz)

- **GIVEN** kalendarz dostępności kostki
  **WHEN** wybieram wolny slot
  **THEN** slot jest zarezerwowany dla mnie (pierwsze sloty gratis, kolejne płatne)

### U8: Płatny slot / „ukradnij slot"

**Priorytet:** V2 (Won't Have w MVP — świadomie odkładamy, NIE BUDUJ TERAZ)

**Jako** user **chcę** zapłacić za natychmiastowy dostęp (np. 30 min za 20 PLN) **żeby** nie czekać na wolny termin

- **GIVEN** kostka zajęta przez usera darmowego
  **WHEN** płacę za slot
  **THEN** kostka zostaje zwolniona i przejęta przeze mnie
- **GIVEN** kostka zajęta przez usera płacącego
  **WHEN** próbuję uzyskać dostęp
  **THEN** widzę komunikat z czasem następnego wolnego okna bezpłatnego i płatnego

### U9: Sterowanie fizyczną kostką na żywo

**Priorytet:** V2 (Won't Have w MVP — wizja docelowa, NIE BUDUJ TERAZ)

**Jako** user **chcę** kręcić wirtualnymi gałkami i słyszeć na żywo prawdziwą kostkę (MIDI → rig → stream audio) **żeby** testować dowolne ustawienia, nie tylko nagrane

- **GIVEN** mam aktywny slot na kostce
  **WHEN** poruszam wirtualną gałką
  **THEN** fizyczny potencjometr zmienia wartość, a ja słyszę zmianę brzmienia w streamie; widzę malejący licznik czasu slotu (np. 5 min), po którym kostka się zwalnia

### U10: Upload własnego śladu gitary

**Priorytet:** V2 (Won't Have w MVP — świadomie odkładamy, NIE BUDUJ TERAZ)

**Jako** user **chcę** wgrać nagranie mojej suchej gitary **żeby** usłyszeć, jak MOJA gra brzmi przez testowaną kostkę

### U11: Granie na żywo z podpiętą gitarą

**Priorytet:** V2 (Won't Have w MVP — najpóźniejszy etap, NIE BUDUJ TERAZ)

**Jako** user **chcę** podpiąć gitarę do komputera i grać przez kostkę na żywo **żeby** testować jak we własnym studio

### U12: Tryb porównania dwóch kostek (A/B)

**Priorytet:** V2 (Could Have — NIE BUDUJ TERAZ, dorzucamy po MVP)

**Jako** user **chcę** porównać dwie kostki obok siebie **żeby** wybrać lepszą dla mojego ucha

- **GIVEN** dwie wybrane kostki (np. dwa overdrive'y różnych producentów)
  **WHEN** używam trybu porównania
  **THEN** mogę zmieniać podobne parametry obu jednocześnie na jednym ekranie i przełączać się między kostkami jednym kliknięciem myszy lub klawiszem

### U13: Ankieta NPS po sesji

**Priorytet:** V2 (Could Have — NIE BUDUJ TERAZ, dorzucamy po MVP)

**Jako** właścicielka **chcę** zbierać NPS po zakończeniu testowania **żeby** mierzyć satysfakcję

### A1: Dodawanie kostki do katalogu

**Priorytet:** P0 (Must Have — MVP)

**Jako** admin **chcę** dodać kostkę (nazwa, producent, typ efektu, zdjęcie z oficjalnej strony, układ 3–4 gałek z nazwami, linki afiliacyjne) **żeby** pojawiła się w katalogu

- **GIVEN** zdjęcie kostki i dane
  **WHEN** dodaję kostkę (w MVP „od kuchni", bez panelu w UI)
  **THEN** aplikacja nakłada na zdjęcie animowane gałki w zdefiniowanych przeze mnie pozycjach i kostka jest widoczna w katalogu

### A2: Dodawanie nagrań z pozycjami gałek

**Priorytet:** P0 (Must Have — MVP)

**Jako** admin **chcę** dodać do kostki zestaw nagrań (ten sam riff w różnych ustawieniach) z przypisanymi pozycjami gałek **żeby** user słyszał i widział ustawienia

- **GIVEN** kostka w katalogu
  **WHEN** dodaję nagranie z metadanymi (wartość każdej gałki, np. 2/6/9)
  **THEN** nagranie pojawia się na liście kostki, a kliknięcie ustawia gałki w te pozycje

### A3: Anonimowe statystyki użycia

**Priorytet:** P1 (Should Have — MVP)

**Jako** admin **chcę** widzieć liczbę odtworzeń per kostka i per nagranie oraz kliknięcia w bannery **żeby** mieć dane do rozmów z producentami

- **GIVEN** użytkownicy korzystają z portalu
  **WHEN** sprawdzam statystyki
  **THEN** widzę odtworzenia i kliknięcia zagregowane per kostka/nagranie/sklep, bez danych osobowych

### A4: Panel admina w UI

**Priorytet:** V2 (Won't Have w MVP — świadomie odkładamy, NIE BUDUJ TERAZ)

**Jako** admin **chcę** mieć panel w aplikacji (zarządzanie katalogiem, kalendarz, finanse, statystyki) **żeby** nie zarządzać „od kuchni"

## 3. User flows

### Flow 1: Core — testowanie kostki (MVP)
1. Gość wchodzi na stronę główną — od razu widzi przesuwany katalog kostek
2. Przewija katalog i klika wybraną kostkę
3. Otwiera się konfigurator: duże zdjęcie kostki z animowanymi gałkami + lista nagrań obok
4. Klika nagranie → słyszy riff w danych ustawieniach, gałki płynnie ustawiają się w pozycje nagrania
5. Klika kolejne nagrania → słyszy ten sam riff w innych ustawieniach, gałki za każdym razem się animują
6. Widzi banner „Kup ten efekt w: [sklep producenta] [Sweetwater] [GuitarCenter.pl] ..." 
7. Klika link → strona sklepu otwiera się w nowej karcie (afiliacja), kliknięcie zliczone w statystykach
8. Wraca do katalogu i testuje kolejną kostkę

### Flow 2: Admin — dodanie kostki (MVP, „od kuchni")
1. Admin przygotowuje: zdjęcie z oficjalnej strony, dane kostki, układ gałek, nagrania riffu w ustawieniach (np. wartości 2/6/9), linki afiliacyjne
2. Dodaje kostkę do systemu (bez panelu w UI — np. przez prosty formularz techniczny / seed danych)
3. Definiuje pozycję i zakres każdej gałki na zdjęciu — aplikacja renderuje animowane gałki na zdjęciu
4. Dodaje nagrania z przypisanymi wartościami gałek
5. Kostka pojawia się w katalogu

### Flow 3: Rezerwacja i konflikt slotów (późniejszy etap)
1. User wybiera kostkę → widzi licznik czasu bieżącej sesji (np. 5 min malejące)
2. Jeśli kostka wolna → zaczyna sesję live (gratis, limit czasu)
3. Jeśli zajęta przez usera darmowego → opcja „ukradnij slot 30 min za 20 PLN" → po płatności kostka natychmiast zwolniona i przejęta
4. Jeśli zajęta przez usera płacącego → komunikat: następny wolny czas bezpłatny za XXX min, następny wolny czas płatny za XXX min

## 4. Reguły biznesowe

- **Jeden riff — wiele ustawień:** wszystkie nagrania danej kostki to ten sam riff suchej gitary, nagrany w różnych ustawieniach gałek — tylko tak da się uczciwie porównywać brzmienie.
- **Wartości gałek w nagraniach:** 2 / 6 / 9 na skali 0–10 (zamiast skrajnych 0/5/10) — przy kostce 3-gałkowej daje to ok. 9 sensownych kombinacji nagrań.
- **Gałki w MVP są „read-only":** animują się do ustawień wybranego nagrania; user nie kręci nimi swobodnie (swobodne kręcenie = późniejszy etap z fizycznym rigiem MIDI).
- **Banner afiliacyjny widoczny od razu** przy otwarciu konfiguratora (opcjonalnie może pojawiać się po ~30 s — w MVP od razu = prościej); kolejność linków: sklep producenta pierwszy, potem pozostałe sklepy.
- **Linki afiliacyjne otwierają się w nowej karcie**, każde kliknięcie jest zliczane.
- **Portal w MVP w pełni otwarty:** bez kont, bez logowania, bez limitów, bez płatności.
- **Statystyki anonimowe:** żadnych danych osobowych — tylko zdarzenia (odtworzenie, kliknięcie) per kostka/nagranie/sklep.
- **Zdjęcia kostek** pochodzą z oficjalnych stron producentów; aplikacja nakłada na nie interaktywne, animowane gałki (pozycje definiuje admin).
- **Późniejszy etap — sloty:** 1 fizyczna kostka = 1 user naraz; darmowa sesja z malejącym licznikiem (np. 5 min); „ukradnij slot" (np. 30 min / 20 PLN) przerywa sesję darmową natychmiast, ale nie przerywa sesji płatnej; przy konflikcie z sesją płatną user widzi czas następnego wolnego okna darmowego i płatnego.

## 5. Onboarding flow

Brak onboardingu — portal jest otwarty, a katalog kostek z konfiguratorem dostępny od razu po wejściu. To świadoma decyzja: zero tarcia przed pierwszym dźwiękiem.

## 6. Encje danych (high-level)

- Pedal (kostka: nazwa, producent, typ efektu, zdjęcie, opis)
- Knob (gałka: nazwa, pozycja na zdjęciu, zakres 0–10)
- Recording (nagranie: plik audio, przypisane wartości gałek)
- AffiliateLink (sklep, URL, kolejność)
- UsageEvent (anonimowe zdarzenie: odtworzenie / kliknięcie bannera)
- *(późniejsze etapy: User, Booking/Slot, Payment, NPSResponse)*

## 7. Scenariusz akceptacyjny MVP (end-to-end)

Na desktopie i mobile: user wchodzi na stronę → przewija katalog → wybiera kostkę → widzi zdjęcie z gałkami → klika nagranie → słyszy dźwięk, a gałki płynnie ustawiają się w pozycje nagrania → przełącza między nagraniami i słyszy/widzi różnicę → klika banner i trafia do sklepu w nowej karcie. Wszystkie odtworzenia i kliknięcia są policzone w statystykach.
