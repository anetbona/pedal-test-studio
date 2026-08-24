#!/usr/bin/env node
/**
 * generate-seed.js — dane startowe PedalTest Studio
 *
 * Generuje:
 *  - data/pedals.json          — katalog 8 kostek (opisy EN+PL, zweryfikowane linki sklepów)
 *  - public/img/<id>.svg       — grafiki kostek odtworzone na wzór oryginałów
 *  - public/img/logos/<m>.svg  — logotypy producentów
 *  - public/audio/<id>/*.wav   — nagrania (w public/, żeby działały też na hostingu
 *                                statycznym, np. Vercel)
 *
 * Uruchomienie: node app/scripts/generate-seed.js   (zero zależności)
 * UWAGA: nadpisuje data/pedals.json.
 */

const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(APP_DIR, 'data');
const AUDIO_DIR = path.join(APP_DIR, 'public', 'audio');
const IMG_DIR = path.join(APP_DIR, 'public', 'img');
const LOGO_DIR = path.join(IMG_DIR, 'logos');

const SAMPLE_RATE = 22050;
const F = `-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif`;

// Wersja nagrań — doklejana do URL-i audio (?v=N). Podbij przy każdej zmianie
// brzmienia/długości próbek, inaczej przeglądarki zagrają stare pliki z cache.
const AUDIO_VERSION = 2;

// ---------------------------------------------------------------------------
// Pomocnicze: kolory i wspólne elementy grafik
// ---------------------------------------------------------------------------

function shade(hex, amt) {
  // amt: -1..1 (ujemne = ciemniej, dodatnie = jaśniej)
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => {
    const x = (n >> v) & 255;
    const t = amt < 0 ? x * (1 + amt) : x + (255 - x) * amt;
    return Math.round(Math.max(0, Math.min(255, t)));
  };
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}

function svgDefs(color) {
  return `<defs>
    <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${shade(color, 0.16)}"/>
      <stop offset="0.45" stop-color="${color}"/>
      <stop offset="1" stop-color="${shade(color, -0.14)}"/>
    </linearGradient>
    <radialGradient id="metal" cx="0.35" cy="0.3" r="0.9">
      <stop offset="0" stop-color="#f4f5f7"/>
      <stop offset="0.6" stop-color="#c3c6cc"/>
      <stop offset="1" stop-color="#8e9299"/>
    </radialGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6f7f9"/>
      <stop offset="0.5" stop-color="#d4d7db"/>
      <stop offset="1" stop-color="#aeb2b8"/>
    </linearGradient>
    <radialGradient id="ledGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ff6a5e"/>
      <stop offset="0.55" stop-color="#e0271b"/>
      <stop offset="1" stop-color="#8e0f07"/>
    </radialGradient>
  </defs>`;
}

function screws(W, H, inset = 26, r = 9) {
  const s = (cx, cy, rot) => `<g transform="rotate(${rot} ${cx} ${cy})">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#metal)" stroke="rgba(0,0,0,0.35)" stroke-width="1.5"/>
    <line x1="${cx - r * 0.62}" y1="${cy}" x2="${cx + r * 0.62}" y2="${cy}" stroke="rgba(0,0,0,0.5)" stroke-width="2.4"/>
  </g>`;
  return s(inset + 14, inset + 14, 20) + s(W - inset - 14, inset + 14, 65)
    + s(inset + 14, H - inset - 14, 80) + s(W - inset - 14, H - inset - 14, 35);
}

function footswitch(cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy + 4}" r="${r + 10}" fill="rgba(0,0,0,0.35)"/>
  <circle cx="${cx}" cy="${cy}" r="${r + 9}" fill="${'#6d7076'}"/>
  <circle cx="${cx}" cy="${cy}" r="${r + 9}" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#metal)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="2.5"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <ellipse cx="${cx - r * 0.3}" cy="${cy - r * 0.38}" rx="${r * 0.42}" ry="${r * 0.24}" fill="rgba(255,255,255,0.35)"/>`;
}

function led(cx, cy, glow = true) {
  return `${glow ? `<circle cx="${cx}" cy="${cy}" r="17" fill="rgba(224,39,27,0.25)"/>` : ''}
  <circle cx="${cx}" cy="${cy}" r="12" fill="#3a3a3c"/>
  <circle cx="${cx}" cy="${cy}" r="8" fill="url(#ledGlow)"/>
  <circle cx="${cx - 2.5}" cy="${cy - 2.5}" r="2.2" fill="rgba(255,255,255,0.75)"/>`;
}

function knobSockets(knobs, socketFill) {
  return knobs.map((k) => {
    const r = k.d / 2 + 8;
    return `<circle cx="${k.cx}" cy="${k.cy}" r="${r}" fill="${socketFill}"/>
  <circle cx="${k.cx}" cy="${k.cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>`;
  }).join('\n  ');
}

function body(W, H, rx = 26, stroke = 'rgba(0,0,0,0.35)') {
  return `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="${rx}" fill="url(#bodyGrad)"/>
  <rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="${rx}" fill="none" stroke="${stroke}" stroke-width="3"/>
  <rect x="19" y="19" width="${W - 38}" height="${H - 38}" rx="${rx - 6}" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>`;
}

// ---------------------------------------------------------------------------
// Definicje kostek — wymiary, układ gałek i grafika wzorowane na oryginałach.
// Opisy dwujęzyczne (EN bazowy + PL). Linki sklepów zweryfikowane 2026-08-20.
// ---------------------------------------------------------------------------

const PEDALS = [
  {
    id: 'boss-bd-2', name: 'BD-2 Blues Driver', manufacturer: 'Boss', type: 'overdrive',
    W: 460, H: 800,
    knobs: [
      { id: 'level', label: 'Level', role: 'level', cx: 104, cy: 88, d: 78 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 230, cy: 88, d: 78 },
      { id: 'gain', label: 'Gain', role: 'gain', cx: 356, cy: 88, d: 78 },
    ],
    description: {
      en: 'A classic blues overdrive in continuous production since 1995. It responds to picking dynamics like a tube amp — from clean boost through light grit to creamy crunch. It preserves the character of your guitar and pickups, which makes it a great always-on pedal. A favourite in blues, rock and indie.',
      pl: 'Klasyczny bluesowy overdrive produkowany nieprzerwanie od 1995 roku. Reaguje na dynamikę gry jak wzmacniacz lampowy — od czystego boostu, przez lekkie podbicie, po kremowy crunch. Świetnie zachowuje charakter gitary i przetworników, dzięki czemu sprawdza się jako efekt „always-on". Ulubieniec bluesa, rocka i indie.',
    },
    producerUrl: 'https://www.boss.info/global/products/bd-2/',
    art(W, H, k) {
      return `${body(W, H, 28)}
  ${knobSockets(k, 'rgba(0,0,0,0.32)')}
  ${led(230, 196)}
  <text x="230" y="176" text-anchor="middle" font-family="${F}" font-size="13" letter-spacing="1.5" fill="rgba(255,255,255,0.75)">CHECK</text>
  <text x="230" y="250" text-anchor="middle" font-family="${F}" font-size="31" font-weight="700" font-style="italic" fill="#ffffff">Blues Driver</text>
  <text x="230" y="280" text-anchor="middle" font-family="${F}" font-size="18" font-weight="600" letter-spacing="1" fill="rgba(255,255,255,0.9)">BD-2</text>
  <!-- zawias + gumowy treadle z ryflami i bocznymi szynami -->
  <rect x="54" y="298" width="352" height="22" rx="9" fill="url(#chrome)" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
  <circle cx="76" cy="309" r="6" fill="rgba(0,0,0,0.35)"/>
  <circle cx="384" cy="309" r="6" fill="rgba(0,0,0,0.35)"/>
  <rect x="56" y="320" width="14" height="352" rx="7" fill="${'#0d0e10'}"/>
  <rect x="390" y="320" width="14" height="352" rx="7" fill="${'#0d0e10'}"/>
  <rect x="66" y="318" width="328" height="356" rx="14" fill="${'#191a1c'}"/>
  <rect x="66" y="318" width="328" height="356" rx="14" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="2"/>
  <g stroke="rgba(255,255,255,0.1)" stroke-width="7" stroke-linecap="round">
    ${[356, 392, 428, 464, 500, 536, 572, 608, 640].map((y) => `<line x1="92" y1="${y}" x2="368" y2="${y}"/>`).join('')}
  </g>
  <text x="230" y="736" text-anchor="middle" font-family="${F}" font-size="47" font-weight="900" letter-spacing="4" fill="#ffffff">BOSS</text>
  ${screws(W, H)}`;
    },
  },
  {
    id: 'ibanez-ts9', name: 'TS9 Tube Screamer', manufacturer: 'Ibanez', type: 'overdrive',
    W: 480, H: 800,
    knobs: [
      { id: 'drive', label: 'Drive', role: 'gain', cx: 120, cy: 86, d: 76 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 240, cy: 152, d: 62 },
      { id: 'level', label: 'Level', role: 'level', cx: 360, cy: 86, d: 76 },
    ],
    description: {
      en: 'The legendary overdrive with its signature mid-range boost — the pedal that started the whole “tube screamer” story. Perfect for pushing a tube amp into natural break-up: the mids cut through the mix while the low end stays tight. The sound behind countless Stevie Ray Vaughan records.',
      pl: 'Legendarny overdrive z charakterystycznym podbiciem środka pasma — od niego zaczęła się historia „tube screamerów". Idealny do pchania lampowego wzmacniacza w naturalne przesterowanie: środek przebija się przez miks, a dół pozostaje zwarty. Brzmienie znane m.in. z nagrań Steviego Raya Vaughana.',
    },
    producerUrl: 'https://www.ibanez.com/usa/products/model/tube_screamer/',
    art(W, H, k) {
      return `${body(W, H, 26)}
  ${knobSockets(k, 'rgba(0,0,0,0.32)')}
  ${led(240, 222)}
  <!-- kwadratowy chromowany przycisk -->
  <rect x="122" y="260" width="236" height="200" rx="14" fill="rgba(0,0,0,0.3)" transform="translate(0 5)"/>
  <rect x="122" y="260" width="236" height="200" rx="14" fill="url(#chrome)"/>
  <rect x="122" y="260" width="236" height="200" rx="14" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="3"/>
  <rect x="138" y="276" width="204" height="168" rx="10" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="2"/>
  <ellipse cx="185" cy="305" rx="52" ry="18" fill="rgba(255,255,255,0.5)"/>
  <!-- czarna belka z nazwą modelu -->
  <rect x="44" y="498" width="392" height="162" rx="10" fill="#101010"/>
  <rect x="44" y="498" width="392" height="162" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <text x="70" y="578" font-family="${F}" font-size="60" font-weight="800" fill="#ffffff">TS9</text>
  <text x="70" y="624" font-family="${F}" font-size="23" font-weight="600" letter-spacing="3.5" fill="#ffffff">TUBE SCREAMER</text>
  <text x="240" y="732" text-anchor="middle" font-family="${F}" font-size="37" font-weight="800" font-style="italic" fill="#0e0e0e">Ibanez</text>
  ${screws(W, H)}`;
    },
  },
  {
    id: 'fulltone-ocd', name: 'OCD V2', manufacturer: 'Fulltone', type: 'overdrive',
    W: 460, H: 820,
    knobs: [
      { id: 'volume', label: 'Volume', role: 'level', cx: 104, cy: 90, d: 74 },
      { id: 'drive', label: 'Drive', role: 'gain', cx: 230, cy: 90, d: 74 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 356, cy: 90, d: 74 },
    ],
    description: {
      en: 'A dynamic overdrive with an unusually wide gain range — from clean boost to nearly-distortion territory. The HP/LP switch flips its character from transparent to more aggressive, and it cleans up beautifully with the guitar volume knob. One of the most copied circuits of recent decades.',
      pl: 'Dynamiczny overdrive o wyjątkowo szerokim zakresie gainu — od czystego boostu po brzmienia graniczące z distortion. Przełącznik HP/LP zmienia charakter z transparentnego na bardziej agresywny, a kostka pięknie czyści się potencjometrem głośności gitary. Jeden z najczęściej kopiowanych układów ostatnich dekad.',
    },
    producerUrl: 'https://www.fulltone.com/',
    art(W, H, k) {
      return `${body(W, H, 26)}
  ${knobSockets(k, 'rgba(0,0,0,0.2)')}
  <!-- mini przełącznik HP/LP -->
  <rect x="206" y="156" width="48" height="26" rx="7" fill="url(#chrome)" stroke="rgba(0,0,0,0.35)" stroke-width="1.5"/>
  <circle cx="220" cy="169" r="8" fill="#26262a"/>
  <text x="198" y="175" text-anchor="end" font-family="${F}" font-size="14" font-weight="600" fill="#4a4a44">HP</text>
  <text x="262" y="175" font-family="${F}" font-size="14" font-weight="600" fill="#4a4a44">LP</text>
  <text x="230" y="298" text-anchor="middle" font-family="${F}" font-size="31" font-weight="700" font-style="italic" fill="#20201c">Fulltone</text>
  <text x="230" y="450" text-anchor="middle" font-family="${F}" font-size="132" font-weight="900" font-style="italic" fill="#161612">OCD</text>
  <text x="230" y="496" text-anchor="middle" font-family="${F}" font-size="17" font-weight="600" letter-spacing="1.2" fill="#44443c">Obsessive Compulsive Drive</text>
  ${led(140, 600)}
  ${footswitch(230, 668, 52)}
  ${screws(W, H)}`;
    },
  },
  {
    id: 'ehx-soul-food', name: 'Soul Food', manufacturer: 'Electro-Harmonix', type: 'overdrive',
    W: 480, H: 780,
    knobs: [
      { id: 'volume', label: 'Volume', role: 'level', cx: 120, cy: 82, d: 72 },
      { id: 'treble', label: 'Treble', role: 'tone', cx: 240, cy: 150, d: 60 },
      { id: 'drive', label: 'Drive', role: 'gain', cx: 360, cy: 82, d: 72 },
    ],
    description: {
      en: 'A transparent overdrive inspired by the legendary, nearly unobtainable Klon Centaur. It adds clean headroom and an open, chiming character without colouring your tone. Great as a boost in front of another drive or as a light crunch on its own. Outstanding value for the money.',
      pl: 'Transparentny overdrive inspirowany legendarnym i niemal niedostępnym Klonem Centaur. Dodaje czystego headroomu i otwartego, dźwięcznego charakteru bez zabarwiania brzmienia gitary. Świetny jako boost przed innym przesterem albo samodzielny, delikatny crunch. Ogromna wartość w przystępnej cenie.',
    },
    producerUrl: 'https://www.ehx.com/products/soul-food/',
    art(W, H, k) {
      return `${body(W, H, 24)}
  ${knobSockets(k, 'rgba(0,0,0,0.2)')}
  <text x="240" y="362" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="60" font-weight="700" font-style="italic" fill="#c8102e">Soul Food</text>
  <text x="240" y="410" text-anchor="middle" font-family="${F}" font-size="24" font-weight="700" letter-spacing="0.5" fill="#17171a">electro-harmonix</text>
  ${led(120, 560)}
  ${footswitch(240, 622, 50)}
  ${screws(W, H)}`;
    },
  },
  {
    id: 'ehx-big-muff', name: 'Big Muff Pi', manufacturer: 'Electro-Harmonix', type: 'fuzz',
    W: 620, H: 840,
    knobs: [
      { id: 'volume', label: 'Volume', role: 'level', cx: 150, cy: 120, d: 86 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 310, cy: 204, d: 86 },
      { id: 'sustain', label: 'Sustain', role: 'gain', cx: 470, cy: 120, d: 86 },
    ],
    description: {
      en: 'The fuzz icon, in production since 1969 — a thick, singing wall of sound with nearly endless sustain. Heard on thousands of records, from David Gilmour to Smashing Pumpkins. The Tone knob sweeps from dark and massive to cutting highs. The perfect fuzz to start your journey with.',
      pl: 'Ikona fuzzu produkowana od 1969 roku — gęsta, śpiewająca ściana dźwięku z niemal nieskończonym sustainem. Słychać go na tysiącach nagrań, od Davida Gilmoura po Smashing Pumpkins. Gałka Tone prowadzi od ciemnego, masywnego dołu po tnącą górę. Fuzz, od którego warto zacząć przygodę z tym typem efektu.',
    },
    producerUrl: 'https://www.ehx.com/products/big-muff-pi/',
    art(W, H, k) {
      return `${body(W, H, 20)}
  <rect x="38" y="38" width="${W - 76}" height="${H - 76}" rx="10" fill="none" stroke="#1d1d1f" stroke-width="3.5"/>
  ${knobSockets(k, 'rgba(0,0,0,0.2)')}
  <text x="310" y="330" text-anchor="middle" font-family="${F}" font-size="28" font-weight="700" letter-spacing="0.5" fill="#17171a">electro-harmonix</text>
  <text x="310" y="414" text-anchor="middle" font-family="${F}" font-size="68" font-weight="900" letter-spacing="5" fill="#141414">BIG MUFF</text>
  <text x="310" y="548" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="126" font-weight="700" fill="#c8102e">&#960;</text>
  ${footswitch(310, 692, 58)}
  ${screws(W, H, 30, 10)}`;
    },
  },
  {
    id: 'way-huge-swollen-pickle', name: 'Swollen Pickle MkIIS', manufacturer: 'Way Huge', type: 'fuzz',
    W: 480, H: 780,
    knobs: [
      { id: 'loudness', label: 'Loudness', role: 'level', cx: 120, cy: 86, d: 70 },
      { id: 'filter', label: 'Filter', role: 'tone', cx: 240, cy: 86, d: 70 },
      { id: 'sustain', label: 'Sustain', role: 'gain', cx: 360, cy: 86, d: 70 },
    ],
    description: {
      en: 'A massive jumbo fuzz with a huge wall-of-sound character and thunderous low end. The Filter control replaces a classic tone knob and sculpts the voice from swampy to razor-sharp, while Sustain adds compression and fire without losing note definition. A must for stoner rock and heavier styles.',
      pl: 'Masywny jumbo fuzz o ogromnym, ścianowym brzmieniu z potężnym dołem. Filter zastępuje klasyczny tone i rzeźbi charakter od bagiennego po żyletkowaty, a Sustain dorzuca kompresji i ognia bez utraty konturu dźwięku. Pozycja obowiązkowa dla fanów stoner rocka i cięższych brzmień.',
    },
    producerUrl: 'https://www.jimdunlop.com/way-huge-swollen-pickle-jumbo-fuzz-mkiis/',
    art(W, H, k) {
      return `${body(W, H, 24)}
  ${knobSockets(k, 'rgba(0,0,0,0.32)')}
  <text x="240" y="330" text-anchor="middle" font-family="${F}" font-size="54" font-weight="800" font-style="italic" fill="#f2e8c9">Swollen</text>
  <text x="240" y="394" text-anchor="middle" font-family="${F}" font-size="54" font-weight="800" font-style="italic" fill="#f2e8c9">Pickle</text>
  <text x="240" y="434" text-anchor="middle" font-family="${F}" font-size="20" font-weight="600" letter-spacing="3.5" fill="rgba(242,232,201,0.88)">JUMBO FUZZ MkIIS</text>
  <text x="240" y="488" text-anchor="middle" font-family="${F}" font-size="23" font-weight="800" letter-spacing="4.5" fill="#f2e8c9">WAY HUGE</text>
  ${led(240, 540)}
  ${footswitch(240, 628, 50)}
  ${screws(W, H)}`;
    },
  },
  {
    id: 'wampler-velvet-fuzz', name: 'Velvet Fuzz', manufacturer: 'Wampler', type: 'fuzz',
    W: 480, H: 800,
    knobs: [
      { id: 'volume', label: 'Volume', role: 'level', cx: 120, cy: 86, d: 70 },
      { id: 'brightness', label: 'Brightness', role: 'tone', cx: 240, cy: 86, d: 70 },
      { id: 'fuzz', label: 'Fuzz', role: 'gain', cx: 360, cy: 86, d: 70 },
    ],
    description: {
      en: 'A velvety fuzz designed to sound like a huge stack amp on the edge of explosion. Smoother than classic fuzzes — a singing, sustaining voice that is perfect for leads. Brightness matches it to dark and bright amps alike. The fluid border between fuzz and one massive distortion.',
      pl: 'Aksamitny fuzz zaprojektowany tak, by brzmieć jak wielki wzmacniacz stackowy na granicy eksplozji. Gładszy niż klasyczne fuzzy — śpiewający sustain idealny do solówek. Brightness dopasowuje brzmienie zarówno do ciemnych, jak i jasnych wzmacniaczy. Płynna granica między fuzzem a wielkim distortion.',
    },
    producerUrl: 'https://www.wamplerpedals.com/',
    art(W, H, k) {
      return `${body(W, H, 24, 'rgba(0,0,0,0.65)')}
  ${knobSockets(k, 'rgba(255,255,255,0.1)')}
  <text x="240" y="388" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-style="italic" fill="#f4f4f6">Velvet Fuzz</text>
  <text x="240" y="448" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-style="italic" fill="rgba(244,244,246,0.82)">Wampler</text>
  ${led(240, 524)}
  ${footswitch(240, 632, 50)}
  ${screws(W, H)}`;
    },
  },
  {
    id: 'mxr-variac-fuzz', name: 'Super Badass Variac Fuzz', manufacturer: 'MXR', type: 'fuzz',
    W: 460, H: 800,
    knobs: [
      { id: 'output', label: 'Output', role: 'level', cx: 104, cy: 84, d: 66 },
      { id: 'tone', label: 'Tone', role: 'tone', cx: 230, cy: 84, d: 66 },
      { id: 'amount', label: 'Amount', role: 'gain', cx: 356, cy: 84, d: 66 },
    ],
    description: {
      en: 'A fuzz with supply-voltage control (variac) — from springy, full voicing at 9 V to collapsing, gated textures at lower voltages. Amount sets the amount of fire and Tone tames the top end. Classic silicon fuzz character in MXR’s tank-like housing.',
      pl: 'Fuzz z kontrolą napięcia zasilania (variac) — od sprężystego, pełnego brzmienia przy 9 V po rozpadające się, bramkujące tekstury przy niższych napięciach. Amount steruje ilością ognia, a Tone okiełznuje górę pasma. Klasyczny krzemowy charakter zamknięty w pancernej obudowie MXR.',
    },
    producerUrl: 'https://www.jimdunlop.com/mxr-super-badass-variac-fuzz/',
    art(W, H, k) {
      return `${body(W, H, 22)}
  ${knobSockets(k, 'rgba(0,0,0,0.3)')}
  <text x="230" y="298" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-style="italic" fill="#ffffff">variac fuzz</text>
  <text x="230" y="338" text-anchor="middle" font-family="${F}" font-size="17" font-weight="600" letter-spacing="2.5" fill="rgba(255,255,255,0.78)">SUPER BADASS</text>
  ${led(230, 392)}
  ${footswitch(230, 510, 50)}
  <rect x="116" y="638" width="228" height="88" rx="12" fill="#ffffff"/>
  <rect x="116" y="638" width="228" height="88" rx="12" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <text x="230" y="700" text-anchor="middle" font-family="${F}" font-size="54" font-weight="900" letter-spacing="2.5" fill="#1d1d1f">MXR</text>
  ${screws(W, H)}`;
    },
  },
];

// ---------------------------------------------------------------------------
// Logotypy producentów (wordmarki)
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
// Audio: jeden wspólny riff (Karplus–Strong) + DSP kostki
// ---------------------------------------------------------------------------

const KNOB_VALUES = [2, 6, 9];
const FIXED_LEVEL = 6;

const E3 = 164.81, G3 = 196.0, A3 = 220.0, B3 = 246.94, D4 = 293.66, E4 = 329.63;

// Riff w dwóch przebiegach (A + wariacja) — dłuższa próbka, żeby dało się kręcić
// gałkami przez dłuższą chwilę i cały czas słyszeć zmiany brzmienia.
const RIFF_A = [
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
  [E3, 7.0, 1.5, 0.95], [B3, 7.0, 1.5, 0.6], [E4, 7.0, 1.5, 0.4],
];
const RIFF_B = [
  [E3, 0.0, 1.0, 0.9], [B3, 0.0, 1.0, 0.55],
  [D4, 1.0, 0.5, 0.85],
  [E4, 1.5, 0.5, 0.8],
  [G3, 2.0, 1.0, 0.9], [D4, 2.0, 1.0, 0.5],
  [A3, 3.0, 0.5, 0.85],
  [G3, 3.5, 0.5, 0.8],
  [E3, 4.0, 0.5, 0.9],
  [G3, 4.5, 0.5, 0.85],
  [A3, 5.0, 1.0, 0.9], [E4, 5.0, 1.0, 0.5],
  [B3, 6.0, 0.5, 0.85],
  [G3, 6.5, 0.5, 0.8],
  [E3, 7.0, 1.5, 0.95], [B3, 7.0, 1.5, 0.6], [G3, 7.0, 1.5, 0.45],
];
const PHRASE_BEATS = 8.5;
const RIFF = [
  ...RIFF_A,
  ...RIFF_B.map(([f, s, d, a]) => [f, s + PHRASE_BEATS, d, a]),
];
const BPM = 100;
// długość pętli (druga fraza kończy się na PHRASE_BEATS * 2) — ok. 10,2 s
const TOTAL_BEATS = PHRASE_BEATS * 2;
// ogon renderowany poza pętlą i zawijany na jej początek (bezszwowe zapętlenie)
const TAIL_BEATS = 2.4;

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

// Zwraca próbkę przygotowaną do BEZSZWOWEGO zapętlenia: wybrzmienie ostatniego
// akordu (ogon poza długością pętli) jest zawijane na początek, więc styk końca
// z początkiem nie daje słyszalnego przeskoku.
function renderDryRiff() {
  const beatSec = 60 / BPM;
  const loopLen = Math.round(TOTAL_BEATS * beatSec * SAMPLE_RATE);
  const tailLen = Math.round(TAIL_BEATS * beatSec * SAMPLE_RATE);
  const buf = new Float32Array(loopLen + tailLen);

  for (const [freq, startBeat, durBeats, amp] of RIFF) {
    const start = Math.round(startBeat * beatSec * SAMPLE_RATE);
    const note = pluck(freq, Math.min(durBeats * beatSec * 1.8, 2.4), amp);
    for (let i = 0; i < note.length && start + i < buf.length; i++) buf[start + i] += note[i];
  }

  // zawinięcie ogona na początek pętli
  const mix = new Float32Array(loopLen);
  mix.set(buf.subarray(0, loopLen));
  for (let i = 0; i < tailLen; i++) mix[i] += buf[loopLen + i];

  let peak = 0;
  for (let i = 0; i < loopLen; i++) peak = Math.max(peak, Math.abs(mix[i]));
  const k = 0.5 / (peak || 1);
  for (let i = 0; i < loopLen; i++) mix[i] *= k;
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
  // pre-roll: pierwszy przebieg tylko po to, by stan filtra na starcie pętli
  // odpowiadał stanowi na jej końcu (inaczej styk pętli daje słyszalny „klik")
  let y = 0;
  for (let i = 0; i < n; i++) y += alpha * (out[i] - y);
  for (let i = 0; i < n; i++) {
    y += alpha * (out[i] - y);
    out[i] = y;
  }

  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  const levelGain = 0.3 + 0.065 * level;
  const k = (0.92 / (peak || 1)) * levelGain;
  for (let i = 0; i < n; i++) out[i] *= k;

  // bez fade-in/out — próbka jest zapętlana (fade tworzyłby dziurę w dźwięku)
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
// Linki sklepów — sklep producenta ZAWSZE pierwszy (reguła biznesowa).
// URL-e zweryfikowane (HTTP 200) 2026-08-20; Sweetwater blokuje boty, działa w przeglądarce.
// ---------------------------------------------------------------------------

function affiliateLinks(pedal) {
  const aff = 'aff=pedalteststudio';
  const q = encodeURIComponent(`${pedal.manufacturer} ${pedal.name}`);
  return [
    // 3 sklepy: producent + dwaj duzi dystrybutorzy (docelowo linki afiliacyjne)
    { store: pedal.manufacturer, role: 'producer', url: `${pedal.producerUrl}?${aff}`, order: 1 },
    { store: 'Thomann', url: `https://www.thomann.de/pl/search_dir.html?sw=${q}&${aff}`, order: 2 },
    { store: 'Sweetwater', url: `https://www.sweetwater.com/store/search.php?s=${q}&${aff}`, order: 3 },
  ];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pedal.W}" height="${pedal.H}" viewBox="0 0 ${pedal.W} ${pedal.H}">
  ${svgDefs(pedal.artColor || bodyColorOf(pedal))}
  ${pedal.art(pedal.W, pedal.H, pedal.knobs)}
</svg>
`;
    fs.writeFileSync(path.join(IMG_DIR, `${pedal.id}.svg`), svg);

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
          file: `/audio/${pedal.id}/${fileName}?v=${AUDIO_VERSION}`,
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
  console.log(`\nGotowe: ${catalog.length} kostek → data/pedals.json, public/img/, public/audio/`);
}

// kolor bazowy do gradientu obudowy — wyciągany z pierwszego rect w art()
function bodyColorOf(pedal) {
  const colors = {
    'boss-bd-2': '#2f63d2',
    'ibanez-ts9': '#3fae49',
    'fulltone-ocd': '#ece4cd',
    'ehx-soul-food': '#e8e9ec',
    'ehx-big-muff': '#d6d7d9',
    'way-huge-swollen-pickle': '#4f7a1f',
    'wampler-velvet-fuzz': '#232326',
    'mxr-variac-fuzz': '#6f43a8',
  };
  return colors[pedal.id] || '#888888';
}

main();
