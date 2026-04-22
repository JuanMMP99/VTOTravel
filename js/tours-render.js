// ============================================================
//  VTO Travel — Renderizado de Tarjetas de Tours
// ============================================================

/**
 * Genera el HTML de una tarjeta de tour
 * @param {Object} tour - Objeto de tour desde tours-data.js
 * @param {number} index - Índice para animación
 */
function crearTarjetaTour(tour, index) {
  const card = document.createElement('article');
  card.className = 'tour-card';
  card.setAttribute('data-tags', tour.tags.join(','));
  card.style.animationDelay = `${index * 0.06}s`;

  const lugaresHTML = tour.lugares
    .map(l => `<li>${l}</li>`)
    .join('');

  const incluyeHTML = tour.incluye
    .map(i => `<li>${i}</li>`)
    .join('');

  const tagsHTML = tour.tags
    .map(t => `<span class="tag">${t}</span>`)
    .join('');

  card.innerHTML = `
    <div class="tour-card__header" style="background: linear-gradient(140deg, ${tour.color}dd, ${tour.color}99);">
      <span class="tour-card__ruta-badge">Ruta ${tour.id}</span>
      <h2 class="tour-card__nombre">${tour.nombre}</h2>
      <p class="tour-card__subtitulo">${tour.subtitulo}</p>
      <span class="tour-card__horario">⏱ ${tour.horario}</span>
    </div>

    <div class="tour-card__body">
      <p class="tour-card__descripcion">"${tour.descripcion}"</p>

      <div class="tour-card__lugares">
        <h4>Visitaremos</h4>
        <ul>${lugaresHTML}</ul>
      </div>

      <div class="tour-card__incluye">
        <h4>Incluye</h4>
        <ul>${incluyeHTML}</ul>
      </div>

      <div class="tour-card__tags">${tagsHTML}</div>
    </div>

    <div class="tour-card__footer">
      <div class="tour-card__precio">
        <span class="tour-card__precio-monto">$${tour.precio}</span>
        <span class="tour-card__precio-label">MXN por persona*</span>
      </div>
      <button
        class="btn btn--reservar"
        onclick="abrirFormulario(${tour.id})"
        aria-label="Reservar ${tour.nombre}"
      >
        Reservar →
      </button>
    </div>
  `;

  return card;
}

/**
 * Renderiza todos los tours en el contenedor
 * @param {Array} tours - Array de tours a mostrar
 */
function renderizarTours(tours) {
  const grid = document.getElementById('tours-grid');
  grid.innerHTML = '';

  if (tours.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--gris-texto);">
        <div style="font-size:3rem; margin-bottom:12px;">🔍</div>
        <p>No se encontraron tours con ese filtro.</p>
      </div>
    `;
    return;
  }

  tours.forEach((tour, i) => {
    grid.appendChild(crearTarjetaTour(tour, i));
  });
}

/**
 * Inicializa los filtros de categoría
 */
function inicializarFiltros() {
  const container = document.getElementById('filtros-container');

  // Recolectar todas las tags únicas
  const todasTags = new Set();
  TOURS.forEach(t => t.tags.forEach(tag => todasTags.add(tag)));

  // Botón "Todos"
  const btnTodos = document.createElement('button');
  btnTodos.className = 'filtro-btn activo';
  btnTodos.textContent = 'Todos';
  btnTodos.dataset.filtro = 'todos';
  container.appendChild(btnTodos);

  // Botones por tag
  todasTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filtro-btn';
    btn.textContent = tag;
    btn.dataset.filtro = tag;
    container.appendChild(btn);
  });

  // Eventos de clic
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.filtro-btn');
    if (!btn) return;

    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');

    const filtro = btn.dataset.filtro;
    const filtrados = filtro === 'todos'
      ? TOURS
      : TOURS.filter(t => t.tags.includes(filtro));

    renderizarTours(filtrados);
  });
}
