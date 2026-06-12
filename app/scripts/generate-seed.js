#!/usr/bin/env node
/**
 * generate-seed.js — dane startowe PedalTest Studio (MVP)
 *
 * Generuje:
 *  - data/pedals.json          — katalog 8 kostek (Pedal/Knob/Recording/AffiliateLink)
 *  - public/img/<id>.svg       — grafiki kostek odtworzone na wzór oryginałów
 *                                (proporcje, kolorystyka, układ gałek i przycisków)
 *  - public/img/logos/<m>.svg  — logotypy producentów (wordmarki)
 *  - data/audio/<id>/*.wav     — ten sam syntezowany riff przez DSP (ustawienia 2/6/9)
 *
 * Uruchomienie: node app/scripts/generate-seed.js   (zero zależności)
 */

const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(APP_DIR, 'data');
const AUDIO_DIR = path.join(DATA_DIR, 'audio');
const IMG_DIR = path.join(APP_DIR, 'public', 'img');
const LOGO_DIR = path.join(IMG_DIR, 'logos');

const SAMPLE_RATE = 22050;
const F = `-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif`;

// ---------------------------------------------------------------------------
// Elementy wspólne grafik
// ---------------------------------------------------------------------------

function screws(W, H, inset = 26, r = 8) {
  return `<g fill="rgba(0,0,0,0.35)">
    <circle cx="${inset + 14}" cy="${inset + 14}" r="${r}"/><circle cx="${W - inset - 14}" cy="${inset + 14}" r="${r}"/>
    <circle cx="${inset + 14}" cy="${H - inset - 14}" r="${r}"/><circle cx="${W - inset - 14}" cy="${H - inset - 14}" r="${r}"/>
  </g>`;
}

function footswitch(cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r + 9}" fill="rgba(0,0,0,0.28)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#c7c8cc"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="3"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2"/>`;
}

function led(cx, cy, color = '#ff3b30') {
  return `<circle cx="${cx}" cy="${cy}" r="13" fill="rgba(0,0,0,0.35)"/>
  <circle cx="${cx}" cy="${cy}" r="8" fill="${color}"/>`;
}

// gniazda pod animowane gałki (overlay frontendowy ląduje dokładnie w tych miejscach)
function knobSockets(knobs, socketFill) {
  return knobs.map((k) => {
    const r = k.d / 2 + 7;
    return `<circle cx="${k.cx}" cy="${k.cy}" r="${r}" fill="${socketFill}"/>`;
  }).join('\n  ');
}

function body(W, H, fill, rx = 26, stroke = 'rgba(0,0,0,0.3)') {
  return `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="${rx}" fill="${fill}"/>
  <rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="${rx}" fill="none" stroke="${stroke}" stroke-width="3"/>
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" rx="${rx - 6}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>`;
}

// ---------------------------------------------------------------------------
// Definicje kostek — wymiary, układ gałek i grafika wzorowane na oryginałach
// ---------------------------------------------------------------------------

const PEDALS = [
  {
    // Boss compact: gałki na samej górze, duży czarny pedał-treadle, logo BOSS na dole
    id: 'boss-bd-2', name: 'BD-2 Blues Driver', manufacturer: 'Boss', type: 'overdrive',
    W: 460, H: 800,
    knobs: [
      { id: 'level', label: 'Level', role: 'level', cx: 104, cy: 88, d: 78 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 230, cy: 88, d: 78 },
      { id: 'gain', label: 'Gain', role: 'gain', cx: 356, cy: 88, d: 78 },
    ],
    description: 'Klasyczny bluesowy overdrive produkowany nieprzerwanie od 1995 roku. Reaguje na dynamikę gry jak wzmacniacz lampowy — od czystego boostu, przez lekkie podbicie, po kremowy crunch. Świetnie zachowuje charakter gitary i przetworników, dzięki czemu sprawdza się jako efekt „always-on". Ulubieniec bluesa, rocka i indie.',
    producerUrl: 'https://www.boss.info/global/products/bd-2/',
    art(W, H, k) {
      return `${body(W, H, '#2f63d2', 28)}
  ${knobSockets(k, 'rgba(0,0,0,0.30)')}
  ${led(230, 196)}
  <text x="230" y="186" text-anchor="middle" font-family="${F}" font-size="13" letter-spacing="1" fill="rgba(255,255,255,0.7)">CHECK</text>
  <text x="230" y="252" text-anchor="middle" font-family="${F}" font-size="30" font-weight="700" font-style="italic" fill="#ffffff">Blues Driver</text>
  <text x="230" y="282" text-anchor="middle" font-family="${F}" font-size="18" font-weight="600" fill="rgba(255,255,255,0.85)">BD-2</text>
  <!-- srebrny zawias + czarny treadle z ryflami -->
  <rect x="58" y="300" width="344" height="20" rx="8" fill="#aab0b8"/>
  <rect x="60" y="318" width="340" height="356" rx="16" fill="#17181a"/>
  <g stroke="rgba(255,255,255,0.09)" stroke-width="7">
    ${[360, 396, 432, 468, 504, 540, 576, 612].map((y) => `<line x1="84" y1="${y}" x2="376" y2="${y}"/>`).join('')}
  </g>
  <text x="230" y="736" text-anchor="middle" font-family="${F}" font-size="46" font-weight="900" letter-spacing="3" fill="#ffffff">BOSS</text>
  ${screws(W, H)}`;
    },
  },
  {
    // TS9: zielony, Drive/Level u góry, Tone niżej w środku, kwadratowy chromowany przycisk,
    // czarna belka z nazwą, logo Ibanez na dole
    id: 'ibanez-ts9', name: 'TS9 Tube Screamer', manufacturer: 'Ibanez', type: 'overdrive',
    W: 480, H: 800,
    knobs: [
      { id: 'drive', label: 'Drive', role: 'gain', cx: 120, cy: 86, d: 76 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 240, cy: 152, d: 62 },
      { id: 'level', label: 'Level', role: 'level', cx: 360, cy: 86, d: 76 },
    ],
    description: 'Legendarny overdrive z charakterystycznym podbiciem środka pasma — od niego zaczęła się historia „tube screamerów". Idealny do pchania lampowego wzmacniacza w naturalne przesterowanie. Środek przebija się przez miks, a dół pozostaje zwarty i konkretny. Brzmienie znane m.in. z nagrań Steviego Raya Vaughana.',
    producerUrl: 'https://www.ibanez.com/usa/products/detail/ts9_02.html',
    art(W, H, k) {
      return `${body(W, H, '#3fae49', 26)}
  ${knobSockets(k, 'rgba(0,0,0,0.30)')}
  ${led(240, 222)}
  <!-- kwadratowy chromowany przycisk -->
  <rect x="124" y="262" width="232" height="196" rx="14" fill="#cfd2d6"/>
  <rect x="124" y="262" width="232" height="196" rx="14" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>
  <rect x="140" y="278" width="200" height="164" rx="10" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
  <!-- czarna belka z nazwą modelu -->
  <rect x="44" y="498" width="392" height="160" rx="10" fill="#101010"/>
  <text x="72" y="578" font-family="${F}" font-size="58" font-weight="800" fill="#ffffff">TS9</text>
  <text x="72" y="622" font-family="${F}" font-size="23" font-weight="600" letter-spacing="3" fill="#ffffff">TUBE SCREAMER</text>
  <text x="240" y="730" text-anchor="middle" font-family="${F}" font-size="36" font-weight="800" font-style="italic" fill="#101010">Ibanez</text>
  ${screws(W, H)}`;
    },
  },
  {
    // OCD: kremowa obudowa, 3 gałki + mini-przełącznik HP/LP, wielkie "OCD" na froncie
    id: 'fulltone-ocd', name: 'OCD V2', manufacturer: 'Fulltone', type: 'overdrive',
    W: 460, H: 820,
    knobs: [
      { id: 'volume', label: 'Volume', role: 'level', cx: 104, cy: 90, d: 74 },
      { id: 'drive', label: 'Drive', role: 'gain', cx: 230, cy: 90, d: 74 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 356, cy: 90, d: 74 },
    ],
    description: 'Dynamiczny overdrive o wyjątkowo szerokim zakresie gainu — od czystego boostu po brzmienia graniczące z distortion. Przełącznik HP/LP zmienia charakter z transparentnego na bardziej agresywny. Doskonale współpracuje z potencjometrem głośności gitary. Jeden z najczęściej kopiowanych układów ostatnich dekad.',
    producerUrl: 'https://www.fulltone.com/products/ocd',
    art(W, H, k) {
      return `${body(W, H, '#ece4cd', 26)}
  ${knobSockets(k, 'rgba(0,0,0,0.18)')}
  <!-- mini przełącznik HP/LP -->
  <rect x="210" y="158" width="40" height="22" rx="6" fill="#8d9096"/>
  <circle cx="222" cy="169" r="7" fill="#26262a"/>
  <text x="206" y="174" text-anchor="end" font-family="${F}" font-size="14" font-weight="600" fill="#3a3a3a">HP</text>
  <text x="256" y="174" font-family="${F}" font-size="14" font-weight="600" fill="#3a3a3a">LP</text>
  <text x="230" y="296" text-anchor="middle" font-family="${F}" font-size="30" font-weight="700" font-style="italic" fill="#1b1b1b">Fulltone</text>
  <text x="230" y="446" text-anchor="middle" font-family="${F}" font-size="128" font-weight="900" font-style="italic" fill="#141414">OCD</text>
  <text x="230" y="492" text-anchor="middle" font-family="${F}" font-size="17" font-weight="600" letter-spacing="1" fill="#3a3a3a">Obsessive Compulsive Drive</text>
  ${led(140, 600)}
  ${footswitch(230, 668, 52)}
  ${screws(W, H)}`;
    },
  },
  {
    // Soul Food: srebrna obudowa, Volume/Drive u góry, Treble w środku, czerwony napis
    id: 'ehx-soul-food', name: 'Soul Food', manufacturer: 'Electro-Harmonix', type: 'overdrive',
    W: 480, H: 780,
    knobs: [
      { id: 'volume', label: 'Volume', role: 'level', cx: 120, cy: 82, d: 72 },
      { id: 'treble', label: 'Treble', role: 'tone', cx: 240, cy: 150, d: 60 },
      { id: 'drive', label: 'Drive', role: 'gain', cx: 360, cy: 82, d: 72 },
    ],
    description: 'Transparentny overdrive inspirowany legendarnym i niemal niedostępnym Klonem Centaur. Dodaje czystego headroomu i otwartego, dźwięcznego charakteru bez zabarwiania brzmienia gitary. Świetny jako boost przed innym przesterem albo jako delikatny crunch. Ogromna wartość w przystępnej cenie.',
    producerUrl: 'https://www.ehx.com/products/soul-food/',
    art(W, H, k) {
      return `${body(W, H, '#e8e9ec', 24)}
  ${knobSockets(k, 'rgba(0,0,0,0.18)')}
  <text x="240" y="360" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="700" font-style="italic" fill="#c8102e">Soul Food</text>
  <text x="240" y="408" text-anchor="middle" font-family="${F}" font-size="23" font-weight="700" fill="#17171a">electro-harmonix</text>
  ${led(120, 560)}
  ${footswitch(240, 622, 50)}
  ${screws(W, H)}`;
    },
  },
  {
    // Big Muff: duża szeroka srebrna skrzynka, czarna ramka, gałki w trójkącie,
    // napis BIG MUFF + czerwone π
    id: 'ehx-big-muff', name: 'Big Muff Pi', manufacturer: 'Electro-Harmonix', type: 'fuzz',
    W: 620, H: 840,
    knobs: [
      { id: 'volume', label: 'Volume', role: 'level', cx: 150, cy: 120, d: 86 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 310, cy: 204, d: 86 },
      { id: 'sustain', label: 'Sustain', role: 'gain', cx: 470, cy: 120, d: 86 },
    ],
    description: 'Ikona fuzzu produkowana od 1969 roku — gęsta, śpiewająca ściana dźwięku z niemal nieskończonym sustainem. Słychać go na tysiącach nagrań, od Davida Gilmoura po Smashing Pumpkins. Gałka Tone prowadzi od ciemnego, masywnego dołu po tnącą górę. Fuzz, od którego warto zacząć przygodę z tym typem efektu.',
    producerUrl: 'https://www.ehx.com/products/big-muff-pi/',
    art(W, H, k) {
      return `${body(W, H, '#d6d7d9', 20)}
  <rect x="38" y="38" width="${W - 76}" height="${H - 76}" rx="10" fill="none" stroke="#1d1d1f" stroke-width="3"/>
  ${knobSockets(k, 'rgba(0,0,0,0.18)')}
  <text x="310" y="330" text-anchor="middle" font-family="${F}" font-size="27" font-weight="700" fill="#17171a">electro-harmonix</text>
  <text x="310" y="412" text-anchor="middle" font-family="${F}" font-size="66" font-weight="900" letter-spacing="4" fill="#141414">BIG MUFF</text>
  <text x="310" y="540" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="120" font-weight="700" fill="#c8102e">&#960;</text>
  ${footswitch(310, 692, 58)}
  ${screws(W, H, 30, 9)}`;
    },
  },
  {
    // Swollen Pickle: ciemnozielony jumbo fuzz, kremowe napisy
    id: 'way-huge-swollen-pickle', name: 'Swollen Pickle MkIIS', manufacturer: 'Way Huge', type: 'fuzz',
    W: 480, H: 780,
    knobs: [
      { id: 'loudness', label: 'Loudness', role: 'level', cx: 120, cy: 86, d: 70 },
      { id: 'filter', label: 'Filter', role: 'tone', cx: 240, cy: 86, d: 70 },
      { id: 'sustain', label: 'Sustain', role: 'gain', cx: 360, cy: 86, d: 70 },
    ],
    description: 'Masywny jumbo fuzz o ogromnym, ścianowym brzmieniu z potężnym dołem. Filter zamiast klasycznego tone’u pozwala rzeźbić charakter od bagiennego po żyletkowaty. Sustain dorzuca kompresji i ognia bez utraty konturu dźwięku. Pozycja obowiązkowa dla fanów stoner rocka i cięższych brzmień.',
    producerUrl: 'https://www.jimdunlop.com/way-huge-swollen-pickle-jumbo-fuzz-mkiis/',
    art(W, H, k) {
      return `${body(W, H, '#4f7a1f', 24)}
  ${knobSockets(k, 'rgba(0,0,0,0.30)')}
  <text x="240" y="330" text-anchor="middle" font-family="${F}" font-size="52" font-weight="800" font-style="italic" fill="#f2e8c9">Swollen</text>
  <text x="240" y="392" text-anchor="middle" font-family="${F}" font-size="52" font-weight="800" font-style="italic" fill="#f2e8c9">Pickle</text>
  <text x="240" y="432" text-anchor="middle" font-family="${F}" font-size="20" font-weight="600" letter-spacing="3" fill="rgba(242,232,201,0.85)">JUMBO FUZZ MkIIS</text>
  <text x="240" y="486" text-anchor="middle" font-family="${F}" font-size="22" font-weight="800" letter-spacing="4" fill="#f2e8c9">WAY HUGE</text>
  ${led(240, 540)}
  ${footswitch(240, 628, 50)}
  ${screws(W, H)}`;
    },
  },
  {
    // Velvet Fuzz: czarna obudowa, eleganckie białe liternictwo
    id: 'wampler-velvet-fuzz', name: 'Velvet Fuzz', manufacturer: 'Wampler', type: 'fuzz',
    W: 480, H: 800,
    knobs: [
      { id: 'volume', label: 'Volume', role: 'level', cx: 120, cy: 86, d: 70 },
      { id: 'brightness', label: 'Brightness', role: 'tone', cx: 240, cy: 86, d: 70 },
      { id: 'fuzz', label: 'Fuzz', role: 'gain', cx: 360, cy: 86, d: 70 },
    ],
    description: 'Aksamitny fuzz zaprojektowany tak, by brzmieć jak wielki wzmacniacz stackowy na granicy eksplozji. Mniej szorstki niż klasyczne fuzzy — gładki, śpiewający sustain idealny do solówek. Brightness dopasowuje brzmienie zarówno do ciemnych, jak i jasnych wzmacniaczy. Płynna granica między fuzzem a wielkim distortion.',
    producerUrl: 'https://www.wamplerpedals.com/',
    art(W, H, k) {
      return `${body(W, H, '#1d1d20', 24, 'rgba(0,0,0,0.6)')}
  ${knobSockets(k, 'rgba(255,255,255,0.10)')}
  <text x="240" y="386" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="56" font-style="italic" fill="#f4f4f6">Velvet Fuzz</text>
  <text x="240" y="446" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-style="italic" fill="rgba(244,244,246,0.8)">Wampler</text>
  ${led(240, 524, '#9ad1ff')}
  ${footswitch(240, 632, 50)}
  ${screws(W, H)}`;
    },
  },
  {
    // Variac Fuzz: fioletowy MXR, mała typografia, biały blok MXR na dole
    id: 'mxr-variac-fuzz', name: 'Super Badass Variac Fuzz', manufacturer: 'MXR', type: 'fuzz',
    W: 460, H: 800,
    knobs: [
      { id: 'output', label: 'Output', role: 'level', cx: 104, cy: 84, d: 66 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 230, cy: 84, d: 66 },
      { id: 'amount', label: 'Amount', role: 'gain', cx: 356, cy: 84, d: 66 },
    ],
    description: 'Fuzz z kontrolą napięcia zasilania (variac) — od sprężystego, pełnego brzmienia przy 9 V po rozpadające się, bramkujące tekstury przy niższych napięciach. Amount steruje ilością ognia, a Tone okiełznuje górę pasma. Klasyczny krzemowy charakter zamknięty w pancernej obudowie MXR.',
    producerUrl: 'https://www.jimdunlop.com/mxr-super-badass-variac-fuzz/',
    art(W, H, k) {
      return `${body(W, H, '#6f43a8', 22)}
  ${knobSockets(k, 'rgba(0,0,0,0.28)')}
  <text x="230" y="296" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-style="italic" fill="#ffffff">variac fuzz</text>
  <text x="230" y="336" text-anchor="middle" font-family="${F}" font-size="17" font-weight="600" letter-spacing="2" fill="rgba(255,255,255,0.75)">SUPER BADASS</text>
  ${led(230, 392)}
  ${footswitch(230, 510, 50)}
  <rect x="118" y="640" width="224" height="84" rx="12" fill="#ffffff"/>
  <text x="230" y="700" text-anchor="middle" font-family="${F}" font-size="52" font-weight="900" letter-spacing="2" fill="#1d1d1f">MXR</text>
  ${screws(W, H)}`;
    },
  },
];

// ---------------------------------------------------------------------------
// Logotypy producentów (wordmarki) — ciemne, na jasne tło panelu
// ---------------------------------------------------------------------------

const LOGOS = {
  boss: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="64" viewBox="0 0 220 64"><text x="110" y="48" text-anchor="middle" font-family="${F}" font-size="46" font-weight="900" letter-spacing="4" fill="#111111">BOSS</text></svg>`,
  ibanez: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="64" viewBox="0 0 220 64"><text x="110" y="48" text-anchor="middle" font-family="${F}" font-size="44" font-weight="800" font-style="italic" fill="#111111">Ibanez</text></svg>`,
  fulltone: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="64" viewBox="0 0 240 64"><text x="120" y="46" text-anchor="middle" font-family="${F}" font-size="40" font-weight="700" font-style="italic" fill="#111111">Fulltone</text></svg>`,
  'electro-harmonix': `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="64" viewBox="0 0 320 64"><text x="160" y="44" text-anchor="middle" font-family="${F}" font-size="29" font-weight="700" fill="#111111">electro-harmonix</text></svg>`,
  'way-huge': `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="64" viewBox="0 0 240 64"><text x="120" y="46" text-anchor="middle" font-family="${F}" font-size="38" font-weight="900" letter-spacing="3" fill="#111111">WAY HUGE</text></svg>`,
  wampler: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="64" viewBox="0 0 240 64"><text x="120" y="46" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="40" font-style="italic" fill="#111111">Wampler</text></svg>`,
  mxr: `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="64" viewBox="0 0 150 64"><rect x="4" y="6" width="142" height="52" rx="9" fill="#111111"/><text x="75" y="46" text-anchor="middle" font-family="${F}" font-size="34" font-weight="900" letter-spacing="2" fill="#ffffff">MXR</text></svg>`,
};

function manufacturerSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// ---------------------------------------------------------------------------
// Audio: jeden wspólny riff (Karplus–Strong) + DSP kostki (jak w oryginale MVP)
// ---------------------------------------------------------------------------

const KNOB_VALUES = [2, 6, 9];
const FIXED_LEVEL = 6;

const E3 = 164.81, G3 = 196.0, A3 = 220.0, B3 = 246.94, D4 = 293.66, E4 = 329.63;
const RIFF = [
  [E3, 0.0, 1.5, 0.9], [B3, 0.0, 1.5, 0.55],
  [E3, 1.0, 0.5, 0.8],
  [G3, 1.5, 0.5, 0.85],
  [A3, 2.0, 1.0, 0.9], [E4, 2.0, 1.0, 0.5],
  [G3, 3.0, 0.5, 0.8],
  [E3, 3.5, 0.5, 0.8],
  [E3, 4.0, 1.0, 0.9], [B3, 4.0, 1.0, 0.55],
  [D4, 5.0, 0.5, 0.85],
  [B3, 5.5, 0.5, 0.8],
  [A3, 6.0, 1.0, 0.9],
  [E3, 7.0, 2.0, 0.95], [B3, 7.0, 2.0, 0.6], [E4, 7.0, 2.0, 0.4],
];
const BPM = 100;
const TOTAL_BEATS = 9.2;

let seedState = 42;
function rand() {
  seedState = (seedState * 1664525 + 1013904223) >>> 0;
  return seedState / 4294967296;
}

function pluck(freq, durSec, amp) {
  const N = Math.max(2, Math.round(SAMPLE_RATE / freq));
  const buf = new Float32Array(N);
  for (let i = 0; i < N; i++) buf[i] = rand() * 2 - 1;
  const len = Math.round(durSec * SAMPLE_RATE);
  const out = new Float32Array(len);
  const damp = 0.995;
  let idx = 0;
  for (let n = 0; n < len; n++) {
    out[n] = buf[idx] * amp;
    const next = (idx + 1) % N;
    buf[idx] = damp * 0.5 * (buf[idx] + buf[next]);
    idx = next;
  }
  return out;
}

function renderDryRiff() {
  const beatSec = 60 / BPM;
  const total = Math.round(TOTAL_BEATS * beatSec * SAMPLE_RATE);
  const mix = new Float32Array(total);
  for (const [freq, startBeat, durBeats, amp] of RIFF) {
    const start = Math.round(startBeat * beatSec * SAMPLE_RATE);
    const note = pluck(freq, Math.min(durBeats * beatSec * 1.8, 2.4), amp);
    for (let i = 0; i < note.length && start + i < total; i++) mix[start + i] += note[i];
  }
  let peak = 0;
  for (let i = 0; i < total; i++) peak = Math.max(peak, Math.abs(mix[i]));
  const k = 0.5 / (peak || 1);
  for (let i = 0; i < total; i++) mix[i] *= k;
  return mix;
}

function processThroughPedal(dry, type, gain, tone, level) {
  const n = dry.length;
  const out = new Float32Array(n);
  const driveMax = type === 'fuzz' ? 70 : 16;
  const pre = 1 + Math.pow(gain / 10, 1.5) * driveMax;

  for (let i = 0; i < n; i++) {
    const x = dry[i] * pre;
    if (type === 'fuzz') {
      const pos = 1 - Math.exp(-Math.abs(x));
      out[i] = (x >= 0 ? pos : -pos * 0.82);
    } else {
      out[i] = Math.tanh(x);
    }
  }

  const cutoff = 550 * Math.pow(2, (tone / 10) * 3.45);
  const alpha = 1 - Math.exp((-2 * Math.PI * cutoff) / SAMPLE_RATE);
  let y = 0;
  for (let i = 0; i < n; i++) {
    y += alpha * (out[i] - y);
    out[i] = y;
  }

  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  const levelGain = 0.3 + 0.065 * level;
  const k = (0.92 / (peak || 1)) * levelGain;
  for (let i = 0; i < n; i++) out[i] *= k;

  const fade = Math.round(0.01 * SAMPLE_RATE);
  for (let i = 0; i < fade; i++) {
    out[i] *= i / fade;
    out[n - 1 - i] *= i / fade;
  }
  return out;
}

function writeWav(filePath, samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  fs.writeFileSync(filePath, buf);
}

// ---------------------------------------------------------------------------
// Linki afiliacyjne — sklep producenta ZAWSZE pierwszy (reguła biznesowa)
// ---------------------------------------------------------------------------

function affiliateLinks(pedal) {
  const aff = 'aff=pedalteststudio';
  const q = encodeURIComponent(`${pedal.manufacturer} ${pedal.name}`);
  return [
    { store: `${pedal.manufacturer} (producent)`, url: `${pedal.producerUrl}?${aff}`, order: 1 },
    { store: 'Sweetwater', url: `https://www.sweetwater.com/store/search.php?s=${q}&${aff}`, order: 2 },
    { store: 'GuitarCenter.pl', url: `https://guitarcenter.pl/szukaj?q=${q}&${aff}`, order: 3 },
    { store: 'Guitar Center', url: `https://www.guitarcenter.com/search?Ntt=${q}&${aff}`, order: 4 },
  ];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.mkdirSync(LOGO_DIR, { recursive: true });

  for (const [slug, svg] of Object.entries(LOGOS)) {
    fs.writeFileSync(path.join(LOGO_DIR, `${slug}.svg`), svg);
  }

  console.log('Syntezuję suchy riff (Karplus–Strong)…');
  const dry = renderDryRiff();

  const catalog = [];
  for (const pedal of PEDALS) {
    const pedalAudioDir = path.join(AUDIO_DIR, pedal.id);
    fs.mkdirSync(pedalAudioDir, { recursive: true });

    // grafika kostki (na wzór oryginału)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pedal.W}" height="${pedal.H}" viewBox="0 0 ${pedal.W} ${pedal.H}">
  ${pedal.art(pedal.W, pedal.H, pedal.knobs)}
</svg>
`;
    fs.writeFileSync(path.join(IMG_DIR, `${pedal.id}.svg`), svg);

    // gałki: pozycje pikselowe → ułamki względem zdjęcia (frontend nakłada overlay)
    const knobs = pedal.knobs.map((k) => ({
      id: k.id,
      label: k.label,
      role: k.role,
      x: +(k.cx / pedal.W).toFixed(4),
      y: +(k.cy / pedal.H).toFixed(4),
      size: +(k.d / pedal.W).toFixed(4),
      min: 0,
      max: 10,
    }));
    const byRole = {};
    for (const k of pedal.knobs) byRole[k.role] = k;

    const recordings = [];
    for (const g of KNOB_VALUES) {
      for (const t of KNOB_VALUES) {
        const values = {};
        for (const k of pedal.knobs) {
          values[k.id] = k.role === 'gain' ? g : k.role === 'tone' ? t : FIXED_LEVEL;
        }
        const fileName = `${g}-${t}-${FIXED_LEVEL}.wav`;
        const processed = processThroughPedal(dry, pedal.type, g, t, FIXED_LEVEL);
        writeWav(path.join(pedalAudioDir, fileName), processed);
        recordings.push({
          id: `${pedal.id}-g${g}-t${t}-l${FIXED_LEVEL}`,
          file: `/audio/${pedal.id}/${fileName}`,
          label: `${byRole.gain.label} ${g} · ${byRole.tone.label} ${t} · ${byRole.level.label} ${FIXED_LEVEL}`,
          knobValues: values,
        });
      }
    }

    catalog.push({
      id: pedal.id,
      name: pedal.name,
      manufacturer: pedal.manufacturer,
      manufacturerLogo: `/img/logos/${manufacturerSlug(pedal.manufacturer)}.svg`,
      type: pedal.type,
      image: `/img/${pedal.id}.svg`,
      description: pedal.description,
      knobs,
      affiliateLinks: affiliateLinks(pedal),
      recordings,
    });
    console.log(`  ✓ ${pedal.manufacturer} ${pedal.name} (${recordings.length} nagrań)`);
  }

  fs.writeFileSync(path.join(DATA_DIR, 'pedals.json'), JSON.stringify(catalog, null, 2));
  console.log(`\nGotowe: ${catalog.length} kostek + ${Object.keys(LOGOS).length} logotypów → data/pedals.json, public/img/`);
}

main();
