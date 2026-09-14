# Infotech WhatsApp Bot

Bot de WhatsApp para **Infotech Technology**. Responde preguntas frecuentes sobre cursos, sedes y precios usando la API de Claude, y maneja un flujo de inscripción paso a paso. Cuando alguien completa una inscripción, te llega una notificación por **email y WhatsApp** (no se guarda en ninguna base de datos ni planilla).

## Estructura

```
src/
  businessData.js     -> datos de cursos y sedes (editar acá cuando cambien)
  claudeClient.js      -> llama a la API de Claude para responder FAQ
  inscripcionFlow.js   -> flujo de preguntas: nombre -> curso -> sede -> confirmar
  notificaciones.js    -> envía email/WhatsApp al dueño al completarse una inscripción
  server.js            -> servidor Express + webhook de Twilio
```

## 1. Completar los datos del negocio

Abrí `src/businessData.js` y completá precios, duraciones y direcciones reales (están marcados como "Completar").

## 2. Configurar variables de entorno

Copiá `.env.example` a `.env` y completá:

- `ANTHROPIC_API_KEY`: tu clave de la API de Claude (console.anthropic.com)
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`: desde tu consola de Twilio
- `TWILIO_WHATSAPP_FROM`: el número de WhatsApp de Twilio (sandbox o número aprobado)
- `OWNER_WHATSAPP_NUMBER`: tu número de WhatsApp (con `whatsapp:+595...`) donde querés recibir el aviso de cada inscripción
- `NOTIFY_EMAIL_USER` / `NOTIFY_EMAIL_PASS`: cuenta de Gmail desde la que se manda el aviso. Necesitás generar una **"contraseña de aplicación"** en tu cuenta de Google (no la contraseña normal): https://myaccount.google.com/apppasswords
- `OWNER_EMAIL`: tu email donde querés recibir el aviso

## 3. Instalar dependencias

```bash
npm install
```

## 4. Correr en local

```bash
npm start
```

El webhook queda expuesto en `http://localhost:3000/webhook/whatsapp`.

Para probarlo con Twilio necesitás exponer tu local a internet (por ejemplo con [ngrok](https://ngrok.com/)):

```bash
ngrok http 3000
```

Copiá la URL que te da ngrok + `/webhook/whatsapp` y pegala en la consola de Twilio, en la sección **WhatsApp Sandbox Settings > "When a message comes in"**.

## 5. Desplegar (recomendado: Render)

1. Subí este proyecto a un repositorio de GitHub.
2. En Render, creá un **Web Service** nuevo apuntando a ese repo.
   - Build command: `npm install`
   - Start command: `npm start`
3. Cargá las mismas variables de entorno del `.env` en la sección **Environment** de Render.
4. Una vez desplegado, copiá la URL pública + `/webhook/whatsapp` y configurala en Twilio (igual que con ngrok, pero esta URL es permanente).

> Nota sobre el problema anterior con Render: asegurate de que el `package.json` esté en la **raíz del repositorio** (no dentro de una subcarpeta), o Render no va a encontrar el `start command`. Esta estructura ya está lista así.

## 6. Probar el flujo de inscripción

Escribile al bot algo como "quiero inscribirme" y seguí los pasos. Al confirmar, deberías recibir el email y el mensaje de WhatsApp con los datos.

## Cómo funciona internamente

- Cada mensaje entrante llega al webhook `/webhook/whatsapp`.
- Si el número ya está respondiendo preguntas de una inscripción en curso, se sigue ese flujo (`inscripcionFlow.js`).
- Si el mensaje indica intención de inscribirse ("quiero inscribirme", "anotame", etc.), se inicia el flujo.
- Si no, se trata como una pregunta de FAQ y se responde con la API de Claude, usando los datos de `businessData.js` como contexto.
- El estado de las inscripciones en curso y el historial de conversación se guardan **en memoria** (se pierden si el servidor se reinicia a mitad de una inscripción — aceptable para este volumen de uso).
