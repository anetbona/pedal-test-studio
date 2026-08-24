// Katalog kostek (U1): siatka — wszystkie kostki widoczne naraz, bez przewijania.

export function renderCatalog(pedals) {
  const grid = document.getElementById('carousel');
  grid.innerHTML = '';

  for (const pedal of pedals) {
    const card = document.createElement('button');
    card.className = 'pedal-card';
    card.setAttribute('aria-label', `${pedal.manufacturer} ${pedal.name}`);

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
    grid.appendChild(card);
  }
}
