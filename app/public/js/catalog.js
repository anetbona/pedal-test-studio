// Katalog kostek (U1): przesuwana karuzela — swipe na mobile, strzałki/scroll na desktopie.

export function renderCatalog(pedals) {
  const carousel = document.getElementById('carousel');
  carousel.innerHTML = '';

  for (const pedal of pedals) {
    const card = document.createElement('button');
    card.className = 'pedal-card';
    card.setAttribute('aria-label', `${pedal.manufacturer} ${pedal.name} — otwórz konfigurator`);

    const img = document.createElement('img');
    img.src = pedal.image;
    img.alt = `${pedal.manufacturer} ${pedal.name}`;
    img.loading = 'lazy';

    const name = document.createElement('div');
    name.className = 'card-name';
    name.textContent = pedal.name;

    const manufacturer = document.createElement('div');
    manufacturer.className = 'card-manufacturer';
    manufacturer.textContent = pedal.manufacturer;

    const badge = document.createElement('span');
    badge.className = `type-badge ${pedal.type}`;
    badge.textContent = pedal.type;

    card.append(img, name, manufacturer, badge);
    card.addEventListener('click', () => {
      location.hash = `#/pedal/${pedal.id}`;
    });
    carousel.appendChild(card);
  }

  // strzałki na desktopie
  document.querySelectorAll('.carousel-arrow').forEach((btn) => {
    btn.onclick = () => {
      const dir = Number(btn.dataset.dir);
      carousel.scrollBy({ left: dir * (272 * 2), behavior: 'smooth' });
    };
  });
}
