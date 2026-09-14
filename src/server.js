// server.js
// Servidor principal. Expone el webhook que Twilio llama por cada
// mensaje de WhatsApp recibido.

require("dotenv").config();
const express = require("express");
const { MessagingResponse } = require("twilio").twiml;

const { responderFAQ } = require("./claudeClient");
const inscripcionFlow = require("./inscripcionFlow");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Historial simple de conversación por número (para dar contexto a Claude).
// En memoria: se reinicia si el server se reinicia. Suficiente para FAQ corto.
const historiales = new Map();
const MAX_HISTORIAL = 10;

function agregarAlHistorial(telefono, role, content) {
  const historial = historiales.get(telefono) || [];
  historial.push({ role, content });
  while (historial.length > MAX_HISTORIAL) historial.shift();
  historiales.set(telefono, historial);
  return historial;
}

app.post("/webhook/whatsapp", async (req, res) => {
  const mensajeEntrante = (req.body.Body || "").trim();
  const telefono = req.body.From; // formato: 'whatsapp:+595XXXXXXXXX'

  const twiml = new MessagingResponse();

  try {
    let respuestaTexto;

    if (inscripcionFlow.estaEnFlujo(telefono)) {
      // Ya está en medio de una inscripción: seguimos ese flujo.
      respuestaTexto = await inscripcionFlow.procesarPaso(telefono, mensajeEntrante);
    } else if (inscripcionFlow.esInicioInscripcion(mensajeEntrante)) {
      // El usuario quiere empezar a inscribirse.
      respuestaTexto = inscripcionFlow.iniciar(telefono);
    } else {
      // Pregunta normal de FAQ -> la responde Claude con el contexto del negocio.
      const historial = agregarAlHistorial(telefono, "user", mensajeEntrante);
      respuestaTexto = await responderFAQ(mensajeEntrante, historial.slice(0, -1));
      agregarAlHistorial(telefono, "assistant", respuestaTexto);
    }

    twiml.message(respuestaTexto || "Disculpá, ¿podés reformular tu mensaje?");
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    twiml.message(
      "Tuvimos un problema técnico procesando tu mensaje. Por favor, intentá de nuevo en unos minutos."
    );
  }

  res.type("text/xml").send(twiml.toString());
});

// Endpoint de salud, útil para verificar que el deploy funciona.
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Infotech bot escuchando en el puerto ${PORT}`);
});
