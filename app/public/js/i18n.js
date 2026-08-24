// i18n: angielski jako wersja bazowa (domyślna), polski przełączany w nav.
// Wybór zapamiętywany w localStorage.

const STRINGS = {
  en: {
    'nav.catalog': 'Catalog',
    'hero.eyebrow': 'PedalTest Studio',
    'hero.title': 'Hear the real pedal<br>before you buy.',
    'hero.sub': 'The same riff, different knob settings. Compare pedals with your own ears — no trip to the store.',
    'hero.cta': 'Browse the catalog',
    'catalog.title': 'Pedal catalog',
    'catalog.hint': 'Fuzz and overdrive from different makers. Click a pedal to hear it.',
    'catalog.error': 'Could not load the catalog. Refresh the page or check that the server is running.',
    'preview.back': '‹ Catalog',
    'preview.label': '◇ Pedal preview',
    'preview.hint': 'illustrative image',
    'panel.title': 'Listen to this pedal',
    'step1.title': 'Pedal',
    'step2.title': 'Recordings',
    'step2.hint': 'The riff loops — turn the knobs while it plays and hear the tone change live.',
    'transport.play': 'Play',
    'transport.stop': 'Stop',
    'more': 'more',
    'less': 'less',
    'buybar.label': 'Buy this pedal at:',
    'producerTag': 'official',
    'footer.text': 'PedalTest Studio · a listening room for guitarists · demo recordings',
    'doc.title': 'PedalTest Studio — hear the real pedal before you buy',
    'knob.aria': 'knob — use arrows or drag to change',
  },
  pl: {
    'nav.catalog': 'Katalog',
    'hero.eyebrow': 'PedalTest Studio',
    'hero.title': 'Usłysz prawdziwą kostkę,<br>zanim ją kupisz.',
    'hero.sub': 'Ten sam riff, różne ustawienia gałek. Porównaj brzmienie efektów własnym uchem — bez wycieczki do sklepu.',
    'hero.cta': 'Przeglądaj katalog',
    'catalog.title': 'Katalog kostek',
    'catalog.hint': 'Fuzz i overdrive od różnych producentów. Kliknij kostkę, żeby ją usłyszeć.',
    'catalog.error': 'Nie udało się wczytać katalogu. Odśwież stronę lub sprawdź, czy serwer działa.',
    'preview.back': '‹ Katalog',
    'preview.label': '◇ Podgląd kostki',
    'preview.hint': 'obraz poglądowy',
    'panel.title': 'Posłuchaj tej kostki',
    'step1.title': 'Kostka',
    'step2.title': 'Nagrania',
    'step2.hint': 'Riff gra w pętli — kręć gałkami w trakcie i słuchaj, jak brzmienie zmienia się na żywo.',
    'transport.play': 'Odtwórz',
    'transport.stop': 'Zatrzymaj',
    'more': 'więcej',
    'less': 'mniej',
    'buybar.label': 'Kup ten efekt w:',
    'producerTag': 'producent',
    'footer.text': 'PedalTest Studio · portal odsłuchowy dla gitarzystów · nagrania demonstracyjne',
    'doc.title': 'PedalTest Studio — usłysz prawdziwą kostkę, zanim ją kupisz',
    'knob.aria': 'gałka — zmieniaj strzałkami lub przeciągnięciem',
  },
};

let lang = localStorage.getItem('pts-lang');
if (lang !== 'en' && lang !== 'pl') lang = 'en'; // EN = wersja bazowa

const listeners = [];

export function getLang() { return lang; }

export function t(key) {
  return STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
}

// pola treści w danych mogą być stringiem (stary format) lub { en, pl }
export function localize(field) {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field.en ?? Object.values(field)[0] ?? '';
}

export function setLang(next) {
  if (next !== 'en' && next !== 'pl') return;
  lang = next;
  localStorage.setItem('pts-lang', lang);
  applyStatic();
  for (const cb of listeners) cb(lang);
}

export function onLangChange(cb) { listeners.push(cb); }

// tłumaczy elementy z atrybutem data-i18n (hero.title zawiera <br> — własny słownik, bezpieczny)
export function applyStatic() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}
