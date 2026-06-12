# PRD — PedalTest Studio

> Skondensowany Product Requirements Document. Pełne user stories z acceptance criteria
> (GIVEN/WHEN/THEN), reguły biznesowe i encje danych: [`../04-spec.md`](../04-spec.md)
> (jedyne źródło prawdy o funkcjonalności).

## 1. Problem

Gitarzysta-hobbysta nie ma realnej możliwości przetestowania kostki (efektu gitarowego)
przed zakupem:

- nagrania na YouTube są robione przez profesjonalistów na topowym sprzęcie i podkręcane
  w postprodukcji — brzmią nieskazitelnie, ale niereprezentatywnie,
- sklepy stacjonarne nie zawsze istnieją w okolicy i nie zawsze pozwalają testować,
- istniejące strony z samplami pokazują brzmienie w sztywnych, pojedynczych ustawieniach —
  nie da się „pokręcić gałkami" i porównać.

## 2. Grupa docelowa

**Hobbysta-amator gitarzysta** — kupuje kostki rozważnie, chce porównać brzmienie między
producentami własnym uchem, zanim wyda pieniądze.

**Świadomie wykluczeni:** profesjonaliści (kupują bez bólu, używają modelerów).

## 3. Propozycja wartości

Jedyne miejsce, gdzie odsłuchujesz **ten sam riff** suchej gitary przez różne kostki
w **różnych ustawieniach gałek** (2/6/9) — i widzisz te ustawienia na animowanych gałkach
naniesionych na grafikę kostki. Gdy coś Ci zagra, kupujesz przez link afiliacyjny.

Wizja docelowa (poza MVP): wirtualne gałki sterują przez MIDI **prawdziwym, fizycznym
hardware'em**, a audio wraca streamem — nie symulacją.

## 4. Zakres MVP (zaimplementowany)

| ID | User story | Priorytet |
|----|-----------|-----------|
| U1 | Przeglądanie katalogu kostek (karuzela) | P0 |
| U2 | Konfigurator kostki (grafika + animowane gałki read-only) | P0 |
| U3 | Odtwarzanie nagrania z animacją gałek | P0 |
| U4 | Przełączanie nagrań (porównanie ustawień) | P0 |
| U5 | Przejście do zakupu (belka sklepów z linkami afiliacyjnymi) | P0 |
| A1 | Dodawanie kostki do katalogu („od kuchni", bez panelu) | P0 |
| A2 | Dodawanie nagrań z pozycjami gałek | P0 |
| A3 | Anonimowe statystyki użycia (bez PII) | P1 |

Poza MVP (backlog → [`ROADMAP.md`](ROADMAP.md)): konta, rezerwacje slotów, płatności,
live MIDI, upload własnego śladu, granie na żywo, porównanie A/B, NPS, panel admina.

## 5. Kluczowe reguły biznesowe

1. Jeden riff per kostka — wszystkie nagrania to ten sam riff w różnych ustawieniach.
2. Wartości gałek w nagraniach: 2 / 6 / 9 (skala 0–10).
3. Gałki w MVP są read-only — animują się do ustawień nagrania.
4. Belka sklepów widoczna od razu; sklep producenta zawsze pierwszy.
5. Linki afiliacyjne otwierają się w nowej karcie; każde kliknięcie jest zliczane.
6. Portal w pełni otwarty: bez kont, logowania, limitów i płatności.
7. Statystyki w 100% anonimowe — żadnych danych osobowych.

## 6. Sukces projektu (KPI)

- **Zaangażowanie:** liczba odtworzeń per kostka/nagranie; użytkownicy powracający.
- **Monetyzacja:** kliknięcia w linki afiliacyjne per sklep; 2–3 partnerstwa
  z producentami w pierwszym miesiącu (dane z A3 jako argument w rozmowach).
- **Jakość:** scenariusz akceptacyjny end-to-end przechodzi na desktopie i mobile
  ([`TESTING_STRATEGY.md`](TESTING_STRATEGY.md)).
- **Operacyjność:** admin dodaje kostkę z nagraniami bez zmian w kodzie (ścieżka A1/A2).

## 7. Dokumenty powiązane

- [`../04-spec.md`](../04-spec.md) — pełna specyfikacja funkcjonalna (źródło prawdy)
- [`../02-brief.md`](../02-brief.md) — brief produktu
- [`../01-pomysl.md`](../01-pomysl.md) — pierwotny brain dump
- [`STRATEGY.md`](STRATEGY.md), [`ROADMAP.md`](ROADMAP.md),
  [`UX_ARCHITECTURE.md`](UX_ARCHITECTURE.md), [`TESTING_STRATEGY.md`](TESTING_STRATEGY.md)
