
const cfg = window.WEDDING_CONFIG || {};
const $ = (id) => document.getElementById(id);

// =====================================
// CONFIGURACIÓN DE DATOS DE LA BODA
// =====================================

function setText(id, value) {
  const el = $(id);
  if (el && value) el.textContent = value;
}

setText("hero-date", cfg.dateLabel);
setText("event-date", cfg.dateLabel);
setText("ceremony-time", cfg.ceremonyTime);
setText("ceremony-name", cfg.ceremonyName);
setText("ceremony-address", cfg.ceremonyAddress);
setText("party-time", cfg.partyTime);
setText("party-name", cfg.partyName);
setText("party-address", cfg.partyAddress);
setText("alias", cfg.giftAlias);
setText("rsvp-deadline", cfg.rsvpDeadline);
setText("footer-date", cfg.dateLabel);

if ($("ceremony-map-link") && cfg.ceremonyMapsUrl) {
  $("ceremony-map-link").href = cfg.ceremonyMapsUrl;
}

if ($("party-map-link") && cfg.partyMapsUrl) {
  $("party-map-link").href = cfg.partyMapsUrl;
}

// =====================================
// CUENTA REGRESIVA
// =====================================

function updateCountdown() {
  const target = new Date(cfg.eventDateISO).getTime();

  if (!Number.isFinite(target)) return;

  let diff = Math.max(0, target - Date.now());

  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };

  Object.entries(values).forEach(([id, value]) => {
    setText(id, String(value).padStart(2, "0"));
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =====================================
// COPIAR ALIAS BANCARIO
// =====================================

$("copy-alias")?.addEventListener("click", async () => {
  const alias = cfg.giftAlias || "";
  const status = $("copy-status");

  try {
    await navigator.clipboard.writeText(alias);
    status.textContent = "¡Alias copiado!";
  } catch {
    status.textContent =
      "No se pudo copiar automáticamente. Seleccioná el alias.";
  }
});

// =====================================
// CONFIRMACIÓN DE ASISTENCIA POR WHATSAPP
// =====================================

$("rsvp-form")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = $("form-status");

  if (!form.reportValidity()) return;

  const data = Object.fromEntries(
    new FormData(form).entries()
  );

  const nombre = data.nombre.trim();
  const telefono = (data.telefono || "").trim();
  const asistencia = data.asistencia;
  const acompanantes = (data.acompanantes || "").trim();
  const comentarios = (data.comentarios || "").trim();

  const mensaje = `💍 CONFIRMACIÓN DE ASISTENCIA

Nombre: ${nombre}
Teléfono: ${telefono || "No informado"}
Respuesta: ${asistencia}
Acompañantes: ${acompanantes || "No especificados"}
Comentarios: ${comentarios || "Sin comentarios"}`;

  // Número de WhatsApp para realizar la prueba
  const numero = "5491170648142";

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");

  status.textContent =
    "WhatsApp se abrió con tu confirmación. Revisá el mensaje y presioná Enviar.";
});
