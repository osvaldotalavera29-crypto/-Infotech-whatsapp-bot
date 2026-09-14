// claudeClient.js
// Llama a la API de Claude para responder preguntas frecuentes usando
// la información del negocio como contexto.

const Anthropic = require("@anthropic-ai/sdk");
const businessData = require("./businessData");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildSystemPrompt() {
  const cursosTexto = businessData.cursos
    .map(
      (c) =>
        `- ${c.nombre} | Duración: ${c.duracion} | Precio: ${c.precio} | Modalidad: ${c.modalidad} | ${c.descripcion}`
    )
    .join("\n");

  const sedesTexto = businessData.sedes
    .map(
      (s) =>
        `- ${s.nombre}: ${s.direccion} | Tel: ${s.telefono} | Horario: ${s.horario}`
    )
    .join("\n");

  return `Sos el asistente virtual de WhatsApp de ${businessData.nombreNegocio}, un instituto de capacitación en informática en Guairá, Paraguay.

Respondé siempre en español, de forma breve, clara y amable (máximo 4-5 líneas por mensaje, este es un chat de WhatsApp).

INFORMACIÓN DE CURSOS:
${cursosTexto}

INFORMACIÓN DE SEDES:
${sedesTexto}

DIFERENCIAL: ${businessData.mensajeDiferencial}

Reglas:
- Si preguntan por un curso, dales duración, precio y modalidad.
- Si preguntan por sedes, dales dirección/horario de la sede que corresponda o todas si no especifican.
- Si el usuario muestra intención de inscribirse (dice "quiero inscribirme", "anotame", "quiero anotarme", etc.), respondé confirmando que vas a iniciar el proceso de inscripción, sin inventar pasos — el sistema se encarga de continuar el flujo automáticamente.
- Si no sabés algo con certeza, decí que vas a confirmarlo con el equipo de Infotech y no inventes datos.
- No respondas temas que no sean sobre Infotech Technology, sus cursos o servicios.`;
}

async function responderFAQ(mensajeUsuario, historial = []) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 400,
    system: buildSystemPrompt(),
    messages: [
      ...historial,
      { role: "user", content: mensajeUsuario },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "Disculpá, no pude procesar tu mensaje. ¿Podés reformularlo?";
}

module.exports = { responderFAQ };
