// notificaciones.js
// Envía un aviso al dueño (email y/o WhatsApp) cada vez que se completa
// una inscripción a través del bot.

const nodemailer = require("nodemailer");
const twilio = require("twilio");

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail", // Cambiar si usás otro proveedor de email
      auth: {
        user: process.env.NOTIFY_EMAIL_USER,
        pass: process.env.NOTIFY_EMAIL_PASS, // Usar una "contraseña de aplicación" de Gmail
      },
      tls: {
        // Evita el error "self-signed certificate in certificate chain" que
        // ocurre en algunos Windows/antivirus al validar la cadena de certificados.
        rejectUnauthorized: false,
      },
    });
  }
  return transporter;
}

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

  await getTransporter().sendMail({
    from: process.env.NOTIFY_EMAIL_USER,
    to: process.env.OWNER_EMAIL,
    subject: `Nueva inscripción: ${nombre} - ${curso}`,
    html,
  });
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
    process.env.OWNER_EMAIL ? enviarEmailInscripcion(inscripcion) : Promise.resolve(),
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
