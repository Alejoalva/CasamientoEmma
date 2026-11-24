/*
 * BACKEND: Google Apps Script
 * 1) Crear una planilla de Google Sheets.
 * 2) Extensiones > Apps Script. Pegar este archivo.
 * 3) En Configuración del proyecto > Propiedades del script, agregar:
 *    SPREADSHEET_ID = ID de la planilla
 *    NOTIFY_EMAIL = correo de ustedes (opcional)
 * 4) Implementar > Nueva implementación > Aplicación web.
 *    Ejecutar como: Yo. Quién tiene acceso: Cualquier persona.
 * 5) Copiar la URL /exec a config.js.
 */

function doPost(e) {
  try {
    const p = e.parameter || {};
    const ssId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!ssId) throw new Error('Falta configurar SPREADSHEET_ID');
    const ss = SpreadsheetApp.openById(ssId);
    let sheet = ss.getSheetByName('Confirmaciones');
    if (!sheet) {
      sheet = ss.insertSheet('Confirmaciones');
      sheet.appendRow(['Fecha de recepción', 'Nombre', 'Teléfono', 'Asistencia', 'Acompañantes', 'Comentarios', 'Página']);
      sheet.setFrozenRows(1);
    }

    const nombre = String(p.nombre || '').trim().slice(0, 100);
    const asistencia = String(p.asistencia || '').trim();
    if (!nombre || !['Sí, voy', 'No puedo asistir'].includes(asistencia)) {
      throw new Error('Datos obligatorios inválidos');
    }

    const telefono = String(p.telefono || '').slice(0, 30);
    const acompanantes = String(p.acompanantes || '').slice(0, 500);
    const comentarios = String(p.comentarios || '').slice(0, 500);
    const fecha = new Date();
    sheet.appendRow([fecha, safeCell(nombre), safeCell(telefono), asistencia,
                     safeCell(acompanantes), safeCell(comentarios), String(p.pagina || '').slice(0, 500)]);

    const email = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
    if (email) {
      MailApp.sendEmail({
        to: email,
        subject: 'Nueva confirmación de casamiento: ' + nombre,
        body: 'Nombre: ' + nombre + '\nTeléfono: ' + telefono +
              '\nAsistencia: ' + asistencia + '\nAcompañantes: ' + acompanantes +
              '\nComentarios: ' + comentarios
      });
    }

    // Opcional: WhatsApp Cloud API. Requiere credenciales de Meta configuradas
    // en Propiedades del script y una plantilla aprobada por WhatsApp.
    sendWhatsAppNotification_(nombre, telefono, asistencia, acompanantes);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function safeCell(value) {
  const s = String(value || '');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function sendWhatsAppNotification_(nombre, telefono, asistencia, acompanantes) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('WHATSAPP_TOKEN');
  const phoneNumberId = props.getProperty('WHATSAPP_PHONE_NUMBER_ID');
  const recipient = props.getProperty('WHATSAPP_RECIPIENT'); // número de ustedes, formato internacional sin +
  const templateName = props.getProperty('WHATSAPP_TEMPLATE_NAME');
  if (!token || !phoneNumberId || !recipient || !templateName) return;

  const url = 'https://graph.facebook.com/v21.0/' + phoneNumberId + '/messages';
  const body = {
    messaging_product: 'whatsapp',
    to: recipient,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'es_AR' },
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: nombre },
          { type: 'text', text: asistencia },
          { type: 'text', text: acompanantes || 'Sin acompañantes informados' }
        ]
      }]
    }
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  });
}
