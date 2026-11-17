# Invitación digital — Marina & Alejandro

Sitio estático para GitHub Pages. Incluye galería de fotos, cuenta regresiva, ubicación, alias bancario y formulario RSVP conectado a Google Sheets mediante Google Apps Script.

## 1. Personalizar contenido

Editar `config.js`:
- `eventDateISO`, `dateLabel`, `timeLabel`
- `venueName`, `venueAddress`, `mapsUrl`
- `giftAlias`, `rsvpDeadline`
- `appsScriptUrl` (se configura en el paso 3)

Cambiar los textos de portada si quieren otra frase o nombres.

## 2. Agregar fotografías

Copiar sus fotos a `assets/` con estos nombres:
- `foto-portada.jpg` — imagen de fondo de portada
- `foto-principal.jpg` — foto principal
- `foto-1.jpg`, `foto-2.jpg`, `foto-3.jpg` — galería

Recomendación: JPG/WebP optimizados para web, lado largo de 1600 px aprox. No suban fotos privadas si prefieren que la invitación no sea pública: GitHub Pages publica el contenido para cualquiera que tenga el enlace.

## 3. Configurar confirmaciones en Google Sheets

1. Crear una planilla nueva en Google Sheets.
2. Copiar el ID que aparece entre `/d/` y `/edit` en la URL.
3. Abrir **Extensiones > Apps Script** y pegar el contenido de `Code.gs`.
4. En Apps Script, abrir **Configuración del proyecto > Propiedades del script** y agregar:
   - `SPREADSHEET_ID`: ID de la planilla.
   - `NOTIFY_EMAIL`: correo para recibir avisos (opcional).
5. Presionar **Implementar > Nueva implementación > Aplicación web**:
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**.
6. Autorizar los permisos solicitados y copiar la URL que termina en `/exec`.
7. Pegar esa URL en `appsScriptUrl` dentro de `config.js`.
8. Hacer una prueba real y verificar que la fila aparezca en la pestaña `Confirmaciones`.

El formulario guarda los datos en la planilla automáticamente. El aviso por correo es opcional.

### Aviso automático por WhatsApp (opcional)

Para que Apps Script envíe un WhatsApp automáticamente a ustedes, hace falta una cuenta de WhatsApp Business Platform/Meta, un número habilitado y una plantilla de mensaje aprobada. En Propiedades del script agregar:
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_RECIPIENT` (número receptor en formato internacional, sin +)
- `WHATSAPP_TEMPLATE_NAME` (plantilla aprobada con tres variables de texto: nombre, asistencia, acompañantes)

El token queda guardado del lado de Apps Script, nunca en GitHub ni en el navegador. Si no se configuran estas propiedades, la planilla sigue registrando confirmaciones normalmente.

**Importante:** el sitio estático no puede enviar mensajes de WhatsApp por sí solo. La integración automática requiere la API oficial y su configuración. Para evitar falsas confirmaciones, probar también el caso de error y revisar la planilla.

## 4. Publicar en GitHub Pages

1. Crear un repositorio público nuevo en GitHub.
2. Subir `index.html`, `styles.css`, `script.js`, `config.js`, `Code.gs`, `README.md` y la carpeta `assets`.
3. Ir a **Settings > Pages**.
4. En **Build and deployment**, elegir **Deploy from a branch**.
5. Seleccionar `main` y `/ (root)`, guardar.
6. Esperar la publicación y abrir la URL que informa GitHub Pages.

## 5. Antes de compartir

- Reemplazar todos los textos entre corchetes / valores de ejemplo.
- Confirmar que fecha, hora y mapa sean correctos.
- Probar el formulario desde un celular y revisar Google Sheets.
- Confirmar que el alias se copie correctamente.
- Compartir el enlace/QR solo cuando esté todo revisado.

## Privacidad

GitHub Pages es un sitio público. El enlace no es una contraseña. Los datos del RSVP se envían a la planilla configurada y al correo opcional. Limiten el acceso a la planilla a quienes deban organizar el evento.
