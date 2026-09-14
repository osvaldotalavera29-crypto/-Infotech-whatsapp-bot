// notificaciones.js
// Envía un aviso al dueño (email y/o WhatsApp) cada vez que se completa
// una inscripción a través del bot.
//
// El email se envía con la API de Resend (HTTPS) en vez de SMTP tradicional,
// porque Render (plan gratuito) bloquea las conexiones SMTP salientes.

const twilio = require("twilio");

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function enviarEmailInscripcion(inscripcion) {
  const { nombre, telefono, curso, sede } = inscripcion;

  const html = `
    <h2>Nueva inscripción — Infotech Technology</h2>
    <p><b>Nombre:</b> ${nombre}</p>
    <p><b>Teléfono:</b> ${telefono}</p>
    <p><b>Curso de interés:</b> ${curso}</p>
    <p><b>Sede:</b> ${sede}</p>
    <p><i>Recibido automáticamente desde el bot de WhatsApp.</i></p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Infotech Bot <onboarding@resend.dev>",
      to: [process.env.OWNER_EMAIL],
      subject: `Nueva inscripción: ${nombre} - ${curso}`,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend respondió ${response.status}: ${errorBody}`);
  }
}

async function enviarWhatsappInscripcion(inscripcion) {
  const { nombre, telefono, curso, sede } = inscripcion;

  const cuerpo =
    `📋 *Nueva inscripción*\n` +
    `Nombre: ${nombre}\n` +
    `Teléfono: ${telefono}\n` +
    `Curso: ${curso}\n` +
    `Sede: ${sede}`;

  await twilioClient.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM, // ej: 'whatsapp:+14155238886'
    to: process.env.OWNER_WHATSAPP_NUMBER, // ej: 'whatsapp:+595XXXXXXXXX'
    body: cuerpo,
  });
}

async function notificarNuevaInscripcion(inscripcion) {
  const resultados = await Promise.allSettled([
    process.env.RESEND_API_KEY && process.env.OWNER_EMAIL
      ? enviarEmailInscripcion(inscripcion)
      : Promise.resolve(),
    process.env.OWNER_WHATSAPP_NUMBER
      ? enviarWhatsappInscripcion(inscripcion)
      : Promise.resolve(),
  ]);

  resultados.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `Error enviando notificación (${i === 0 ? "email" : "whatsapp"}):`,
        r.reason
      );
    }
  });
}

module.exports = { notificarNuevaInscripcion };
