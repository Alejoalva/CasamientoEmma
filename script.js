const cfg = window.WEDDING_CONFIG || {};
const $ = (id) => document.getElementById(id);

function setText(id, value) { const el = $(id); if (el && value) el.textContent = value; }
setText("hero-date", cfg.dateLabel);
setText("event-date", cfg.dateLabel);
setText("event-time", cfg.timeLabel);
setText("venue-name", cfg.venueName);
setText("venue-address", cfg.venueAddress);
setText("alias", cfg.giftAlias);
setText("rsvp-deadline", cfg.rsvpDeadline);
setText("footer-date", cfg.dateLabel);
if ($("map-link") && cfg.mapsUrl) $("map-link").href = cfg.mapsUrl;

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
  Object.entries(values).forEach(([id, value]) => setText(id, String(value).padStart(2, "0")));
}
updateCountdown();
setInterval(updateCountdown, 1000);

$("copy-alias")?.addEventListener("click", async () => {
  const alias = cfg.giftAlias || "";
  const status = $("copy-status");
  try {
    await navigator.clipboard.writeText(alias);
    status.textContent = "¡Alias copiado!";
  } catch {
    status.textContent = "No se pudo copiar automáticamente. Seleccioná el alias.";
  }
});

$("rsvp-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = $("form-status");
  const button = $("submit-rsvp");
  if (!form.reportValidity()) return;
  if (!cfg.appsScriptUrl || cfg.appsScriptUrl.includes("PEGAR_URL")) {
    status.textContent = "La confirmación todavía no está configurada. Escribinos para confirmar.";
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  const payload = {
    nombre: data.nombre.trim(),
    telefono: (data.telefono || "").trim(),
    asistencia: data.asistencia,
    acompanantes: (data.acompanantes || "").trim(),
    comentarios: (data.comentarios || "").trim(),
    fechaEnvio: new Date().toISOString(),
    pagina: window.location.href
  };
  button.disabled = true;
  button.textContent = "Enviando...";
  status.textContent = "";
  try {
    // Apps Script responde con redirecciones CORS; no necesitamos leer el cuerpo.
    await fetch(cfg.appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams(payload).toString()
    });
    status.textContent = "¡Gracias! Tu respuesta fue enviada. ❤️";
    form.reset();
  } catch (error) {
    status.textContent = "No pudimos enviar la respuesta. Probá nuevamente o contactanos.";
  } finally {
    button.disabled = false;
    button.textContent = "Enviar confirmación";
  }
});
