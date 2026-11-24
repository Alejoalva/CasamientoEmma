# Invitación digital — Marina & Alejandro

Sitio estático para publicar en GitHub Pages. Incluye fotografías, cuenta regresiva, ceremonia, fiesta, mapas, alias bancario y formulario de confirmación (RSVP) conectado a Google Sheets mediante Google Apps Script.

## Datos ya cargados

- **Fecha:** sábado 13 de febrero de 2027.
- **Ceremonia:** 20:00 hs — Iglesia María Madre de la Iglesia, Alejandro Vitale 55, Ingeniero Pablo Nogués.
- **Celebración:** 21:30 hs — La Casona de Capece, Av. Presidente Perón 918, San Fernando.
- **Alias para regalos:** `mar.caceres14`.
- **Confirmar asistencia hasta:** 19 de diciembre de 2026.

Las tres fotografías recibidas ya están incorporadas en `assets/`.

## 1. Configurar las confirmaciones en Google Sheets

El formulario está preparado, pero para que registre respuestas hay que conectarlo a una planilla propia:

1. Crear una planilla nueva en Google Sheets.
2. Copiar el ID que aparece entre `/d/` y `/edit` en la URL.
3. Abrir **Extensiones > Apps Script** y pegar el contenido de `Code.gs`.
4. En **Configuración del proyecto > Propiedades del script**, agregar `SPREADSHEET_ID` con el ID de la planilla. `NOTIFY_EMAIL` es opcional.
5. Presionar **Implementar > Nueva implementación > Aplicación web**. Elegir **Ejecutar como: Yo** y **Quién tiene acceso: Cualquier persona**.
6. Autorizar los permisos y copiar la URL que termina en `/exec`.
7. Abrir `config.js` y reemplazar `PEGAR_URL_WEB_APP_AQUI` por esa URL.
8. Hacer una prueba desde el celular y verificar que la respuesta aparezca en la pestaña `Confirmaciones`.

El formulario registra nombre, teléfono, asistencia, acompañantes y comentarios. El aviso por correo es opcional.

### Aviso automático por WhatsApp (opcional)

Para recibir además una notificación por WhatsApp hace falta WhatsApp Business Platform/Meta, un número habilitado y una plantilla aprobada. En Propiedades del script se deben configurar `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_RECIPIENT` y `WHATSAPP_TEMPLATE_NAME`. Sin esas credenciales, el registro en Sheets sigue funcionando normalmente.

## 2. Publicar en GitHub Pages

1. Crear un repositorio público nuevo en GitHub.
2. Subir `index.html`, `styles.css`, `script.js`, `config.js`, `Code.gs`, `README.md` y la carpeta `assets`.
3. Ir a **Settings > Pages**.
4. En **Build and deployment**, elegir **Deploy from a branch**.
5. Seleccionar `main` y `/ (root)`, y guardar.
6. Esperar la publicación y abrir la URL que informa GitHub Pages.

## 3. Antes de compartir

- Configurar la URL de Apps Script en `config.js`.
- Probar ambos enlaces de mapas.
- Probar el formulario desde un celular y revisar la planilla.
- Verificar que el alias se copie correctamente.

## Privacidad

GitHub Pages publica el sitio para cualquiera que tenga el enlace. Las respuestas del formulario se guardan en la planilla configurada. Limiten el acceso a la planilla a quienes deban organizar el evento.
