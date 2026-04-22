// ============================================================
//  VTO Travel — Formulario de Reserva y envío por WhatsApp
// ============================================================

// ── Número de WhatsApp de VTO Travel (con código de país) ──
const WHATSAPP_NUMERO = '529514990142'; // Ajusta si es necesario

// ── Estado actual del tour seleccionado ──
let tourSeleccionado = null;

// ── Abrir modal ──────────────────────────────────────────────
function abrirFormulario(tourId) {
  tourSeleccionado = TOURS.find(t => t.id === tourId);
  if (!tourSeleccionado) return;

  // Actualizar header del modal con color del tour
  const header = document.querySelector('.modal__header');
  header.style.background = `linear-gradient(135deg, ${tourSeleccionado.color}ee, ${tourSeleccionado.color}aa)`;

  // Actualizar resumen
  document.getElementById('resumen-emoji').textContent = tourSeleccionado.emoji;
  document.getElementById('resumen-nombre').textContent = tourSeleccionado.nombre;
  document.getElementById('resumen-subtitulo').textContent =
    `${tourSeleccionado.subtitulo} · ${tourSeleccionado.horario} · $${tourSeleccionado.precio} MXN/persona`;

  // Limpiar formulario
  limpiarFormulario();

  // Mostrar modal
  document.getElementById('modal-overlay').classList.add('activo');
  document.body.style.overflow = 'hidden';

  // Focus al primer campo
  setTimeout(() => document.getElementById('campo-nombre').focus(), 350);
}

// ── Cerrar modal ─────────────────────────────────────────────
function cerrarFormulario() {
  document.getElementById('modal-overlay').classList.remove('activo');
  document.body.style.overflow = '';
  tourSeleccionado = null;
}

// ── Limpiar formulario ────────────────────────────────────────
function limpiarFormulario() {
  document.getElementById('form-reserva').reset();
  document.getElementById('campo-hotel').classList.remove('visible');
  document.querySelectorAll('.form-control.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-msg.visible').forEach(el => el.classList.remove('visible'));
}

// ── Lógica campo hotel / oficina ──────────────────────────────
function manejarRecoleccion() {
  const seleccion = document.querySelector('input[name="recoleccion"]:checked');
  const campoHotel = document.getElementById('campo-hotel');
  if (seleccion && seleccion.value === 'hotel') {
    campoHotel.classList.add('visible');
  } else {
    campoHotel.classList.remove('visible');
    document.getElementById('campo-hotel-nombre').value = '';
  }
}

// ── Validación simple ─────────────────────────────────────────
function validarCampo(id, condicion, mensajeId) {
  const campo = document.getElementById(id);
  const msg = document.getElementById(mensajeId);
  if (!condicion) {
    campo.classList.add('error');
    msg.classList.add('visible');
    return false;
  }
  campo.classList.remove('error');
  msg.classList.remove('visible');
  return true;
}

// ── Enviar por WhatsApp ───────────────────────────────────────
function enviarWhatsApp() {
  if (!tourSeleccionado) return;

  // ─ Recopilar datos ─
  const nombre   = document.getElementById('campo-nombre').value.trim();
  const personas = document.getElementById('campo-personas').value;
  const recOpc   = document.querySelector('input[name="recoleccion"]:checked');
  const pagoOpc  = document.querySelector('input[name="pago"]:checked');
  const hotel    = document.getElementById('campo-hotel-nombre').value.trim();
  const notas    = document.getElementById('campo-notas').value.trim();

  // ─ Validaciones ─
  let valido = true;

  valido = validarCampo(
    'campo-nombre',
    nombre.length >= 2,
    'error-nombre'
  ) && valido;

  valido = validarCampo(
    'campo-personas',
    personas && parseInt(personas) >= 1,
    'error-personas'
  ) && valido;

  if (!recOpc) {
    document.getElementById('error-recoleccion').classList.add('visible');
    valido = false;
  } else {
    document.getElementById('error-recoleccion').classList.remove('visible');
  }

  if (recOpc && recOpc.value === 'hotel') {
    valido = validarCampo(
      'campo-hotel-nombre',
      hotel.length >= 2,
      'error-hotel'
    ) && valido;
  }

  if (!pagoOpc) {
    document.getElementById('error-pago').classList.add('visible');
    valido = false;
  } else {
    document.getElementById('error-pago').classList.remove('visible');
  }

  if (!valido) return;

  // ─ Construir mensaje ─
  const recoleccion = recOpc.value === 'hotel'
    ? `📍 Recolección en hotel/airbnb: ${hotel}`
    : `📍 Llegará a la oficina (Valerio Trujano #206, cerca del Zócalo)`;

  const pago = pagoOpc.value === 'transferencia'
    ? '💳 Pago: Transferencia bancaria'
    : '💵 Pago: Efectivo';

  const notasLinea = notas ? `\n📝 Notas: ${notas}` : '';

  const mensaje = [
    `¡Hola! Me gustaría reservar un tour con VTO Travel 🌟`,
    ``,
    `🗺️ *Tour:* ${tourSeleccionado.nombre} (Ruta ${tourSeleccionado.id})`,
    `   ${tourSeleccionado.subtitulo}`,
    `⏱️ *Horario:* ${tourSeleccionado.horario}`,
    ``,
    `👤 *Nombre:* ${nombre}`,
    `👥 *Personas:* ${personas}`,
    `💰 *Precio estimado:* $${parseInt(personas) * tourSeleccionado.precio} MXN (${personas} × $${tourSeleccionado.precio})`,
    ``,
    recoleccion,
    pago,
    notasLinea,
    ``,
    `¡Gracias! Espero su confirmación 🙏`,
  ].join('\n');

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
  cerrarFormulario();
}

// ── Inicializar eventos del modal ─────────────────────────────
function inicializarModal() {
  // Cerrar al click en overlay
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) cerrarFormulario();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarFormulario();
  });

  // Radio de recolección
  document.querySelectorAll('input[name="recoleccion"]').forEach(radio => {
    radio.addEventListener('change', manejarRecoleccion);
  });

  // Botón WhatsApp
  document.getElementById('btn-whatsapp').addEventListener('click', enviarWhatsApp);
}
