# Brief: PedalTest Studio (nazwa robocza)

Data: 2026-06-11

## 1. Nazwa projektu

**PedalTest Studio** (robocza — do zmiany w każdej chwili). Platforma online do testowania prawdziwych, fizycznych efektów gitarowych przed zakupem.

## 2. Problem

Gitarzysta-hobbysta nie ma dziś realnej możliwości przetestowania kostki przed zakupem. Nagrania na YouTube są robione przez profesjonalistów, na topowym sprzęcie i często podkręcane w postprodukcji — brzmią nieskazitelnie, ale nie mówią nic o tym, jak kostka zabrzmi „naprawdę". Sklepy stacjonarne nie zawsze dają możliwość testów (a często nie ma ich w okolicy). Istniejące rozwiązania online to statyczne sample w konkretnych ustawieniach — nie da się pokręcić gałkami i porównać brzmienia.

## 3. User persona

**Hobbysta-amator gitarzysta**, który kupuje kostki rozważnie i chce porównać brzmienie między producentami — co dla JEGO ucha brzmi lepiej — zanim wyda pieniądze. Dziś radzi sobie oglądając demo na YouTube (nieskazitelne, niereprezentatywne) albo jadąc do sklepu stacjonarnego (jeśli w ogóle ma taki w zasięgu i jeśli sklep pozwala testować).

**Kto NIE jest userem:** profesjonalni gitarzyści — nie szkoda im pieniędzy na nowy sprzęt, a dodatkowo korzystają z modelerów gitarowych. Świadomie ich wykluczamy.

## 4. Propozycja wartości

Jedyne miejsce, gdzie online kręcisz gałkami **prawdziwej, fizycznej kostki** (nie symulacji!) i słyszysz jej rzeczywiste brzmienie na żywo — zanim ją kupisz. Porównujesz overdrive'y różnych producentów własnym uchem, a gdy coś Ci się spodoba, kupujesz przez link afiliacyjny.

## 5. Kluczowe funkcje

- **Katalog kostek** — 5–10 efektów na start: fuzz i overdrive (najczęściej wybierane jako pierwsze), różni producenci tego samego typu efektu, żeby dało się porównywać.
- **Wirtualne gałki sterujące fizyczną kostką** — user porusza potencjometrami w przeglądarce, sterowanie trafia przez MIDI do fizycznego riga (kostka → mikser → wyjście), a przetworzone audio wraca do usera.
- **Odsłuch na gotowych samplach** — wbudowane nagrania suchej gitary puszczane przez kostkę; user słyszy efekt zmian ustawień.
- **Kalendarz rezerwacji slotów** — jedna fizyczna kostka może być używana przez jednego usera naraz, więc testowanie odbywa się w rezerwowanych slotach czasowych.
- **Konta użytkowników** — rejestracja, żeby gromadzić użytkowników i statystyki korzystania (czas per user, per kostka).
- **Model freemium „na kawę"** — pierwsze sloty / minuty testowania gratis (np. 15 min), kolejne rezerwacje płatne (np. 5 USD za godzinę).
- **Ankieta NPS** — krótkie pytanie po zakończeniu sesji testowej.
- **Linki afiliacyjne** — przy każdej kostce link do zakupu (sklep / strona producenta, commission fee).

## 6. Czym to NIE JEST

- **Nie jest symulacją ani pluginem cyfrowym** — brzmienie pochodzi z prawdziwego hardware'u; to kluczowy wyróżnik.
- **Nie jest narzędziem dla pro-userów** — wykluczamy zawodowców i użytkowników modelerów.
- **W MVP nie ma uploadu własnego śladu gitary** — to etap 2; na start gotowe sample.
- **W MVP nie ma grania na żywo z podpiętą gitarą** — to etap 3 (temat latencji).
- **W MVP nie ma signal chains** — łączenie wielu efektów w łańcuch przyjdzie później; na start pojedyncza kostka.
- **Nie jest sklepem** — nie prowadzimy sprzedaży ani magazynu; monetyzacja przez afiliację i płatne minuty.

## 7. Success criteria

- **Przyrost zarejestrowanych użytkowników** miesiąc do miesiąca (pierwszy miesiąc: promocja MVP).
- **Zaangażowanie:** czas korzystania per użytkownik i per kostka; odsetek użytkowników powracających.
- **NPS** z ankiety po sesji testowej.
- **Monetyzacja:** ilu użytkowników płaci za minuty powyżej darmowego limitu (5 USD/h); pierwsze 2–3 partnerstwa z producentami kostek w pierwszym miesiącu.

## 8. Inspiracje / referencje

Brak bezpośrednich wzorców — anty-wzorzec to statyczne demo na YouTube i strony z samplami w sztywnych ustawieniach. Pomysł celowo robi to, czego one nie potrafią: interaktywne gałki + prawdziwy hardware.

---

## ⚠️ Tematy do rozstrzygnięcia w spec (Krok 4)

- **Współbieżność: ROZSTRZYGNIĘTE** — jedna fizyczna kostka = jeden user naraz; testowanie w rezerwowanych slotach z kalendarza (pierwsze gratis, kolejne płatne).
- **Granica systemu:** co buduje Replit (webapp: konta, katalog, kalendarz, UI gałek, płatności, statystyki, NPS), a co jest po stronie fizycznego riga (audio/MIDI backend) — i jak się komunikują.
- **Płatności w MVP:** od razu czy najpierw tylko darmowe sloty?
- **Nota prawna (do konsultacji z prawnikiem):** model opiera się na fizycznym sprzęcie (jak wypożyczalnia/studio), nie na emulacji — co omija temat licencji na brzmienie; nazwy produktów w celach opisowych to z reguły dozwolone użycie nominatywne. Partnerstwa z producentami zamykają temat.
