// inscripcionFlow.js
// Maneja el flujo conversacional de inscripción: nombre -> curso -> sede -> confirmación.
// El estado se guarda en memoria por número de teléfono. Si el servidor se
// reinicia, las inscripciones en curso se pierden (aceptable para este alcance).

const businessData = require("./businessData");
const { notificarNuevaInscripcion } = require("./notificaciones");

// phone -> { paso, datos }
const estados = new Map();

const FRASES_INICIO = [
  "quiero inscribirme",
  "quiero anotarme",
  "anotame",
  "me quiero inscribir",
  "como me inscribo",
  "cómo me inscribo",
  "quiero inscribirme a un curso",
];

function esInicioInscripcion(mensaje) {
  const m = mensaje.toLowerCase();
  return FRASES_INICIO.some((f) => m.includes(f));
}

function estaEnFlujo(telefono) {
  return estados.has(telefono);
}

function listaCursos() {
  return businessData.cursos.map((c, i) => `${i + 1}. ${c.nombre}`).join("\n");
}

function listaSedes() {
  return businessData.sedes.map((s, i) => `${i + 1}. ${s.nombre}`).join("\n");
}

function iniciar(telefono) {
  estados.set(telefono, { paso: "nombre", datos: { telefono } });
  return "¡Genial! Vamos a inscribirte 📝\n¿Cuál es tu nombre completo?";
}

// Devuelve el siguiente mensaje del bot, o null si el flujo terminó
// y hay que volver a pasar el control a las respuestas normales de FAQ.
async function procesarPaso(telefono, mensaje) {
  const estado = estados.get(telefono);
  if (!estado) return null;

  if (estado.paso === "nombre") {
    estado.datos.nombre = mensaje.trim();
    estado.paso = "curso";
    return `Gracias, ${estado.datos.nombre}. ¿A qué curso te querés inscribir?\n${listaCursos()}`;
  }

  if (estado.paso === "curso") {
    const idx = parseInt(mensaje.trim(), 10) - 1;
    const curso = businessData.cursos[idx];
    estado.datos.curso = curso ? curso.nombre : mensaje.trim();
    estado.paso = "sede";
    return `Perfecto. ¿En qué sede preferís cursar?\n${listaSedes()}`;
  }

  if (estado.paso === "sede") {
    const idx = parseInt(mensaje.trim(), 10) - 1;
    const sede = businessData.sedes[idx];
    estado.datos.sede = sede ? sede.nombre : mensaje.trim();
    estado.paso = "confirmar";
    return (
      `Confirmá tus datos:\n` +
      `Nombre: ${estado.datos.nombre}\n` +
      `Curso: ${estado.datos.curso}\n` +
      `Sede: ${estado.datos.sede}\n\n` +
      `Respondé *sí* para confirmar o *no* para cancelar.`
    );
  }

  if (estado.paso === "confirmar") {
    const respuesta = mensaje.trim().toLowerCase();
    estados.delete(telefono);

    if (respuesta.startsWith("s")) {
      await notificarNuevaInscripcion(estado.datos);
      return "¡Listo! Tu inscripción fue registrada ✅. En breve te contactamos desde Infotech Technology para confirmar el pago y los detalles.";
    }
    return "Sin problema, cancelé la inscripción. Si querés empezar de nuevo, escribime cuando quieras.";
  }

  // Estado desconocido: limpiar
  estados.delete(telefono);
  return null;
}

module.exports = {
  esInicioInscripcion,
  estaEnFlujo,
  iniciar,
  procesarPaso,
};
