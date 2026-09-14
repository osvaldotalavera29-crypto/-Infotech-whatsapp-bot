// businessData.js
// Toda la información de Infotech Technology que el bot usa para responder.
// Editá este archivo cuando cambien precios, horarios o cursos.

module.exports = {
  nombreNegocio: "Infotech Technology",

  sedes: [
    {
      nombre: "Sede Central",
      direccion: "Completar dirección",
      telefono: "Completar teléfono",
      horario: "Lunes a viernes 8:00 - 18:00",
    },
    {
      nombre: "Sede Norte",
      direccion: "Completar dirección",
      telefono: "Completar teléfono",
      horario: "Lunes a viernes 8:00 - 18:00",
    },
    {
      nombre: "Sede Sur",
      direccion: "Completar dirección",
      telefono: "Completar teléfono",
      horario: "Lunes a viernes 8:00 - 18:00",
    },
    {
      nombre: "Sede Villarrica",
      direccion: "Completar dirección",
      telefono: "Completar teléfono",
      horario: "Lunes a viernes 8:00 - 18:00",
    },
  ],

  cursos: [
    {
      nombre: "Operador en Informática",
      duracion: "Completar (ej: 12 meses)",
      precio: "Completar",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Formación base en el uso de computadoras y herramientas de oficina.",
    },
    {
      nombre: "Diseño Gráfico",
      duracion: "Completar",
      precio: "Completar",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Herramientas de diseño visual y edición gráfica.",
    },
    {
      nombre: "Diseño Web",
      duracion: "Completar",
      precio: "Completar",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Creación de sitios web desde cero.",
    },
    {
      nombre: "Marketing Digital",
      duracion: "Completar",
      precio: "Completar",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Estrategias de redes sociales, publicidad online y contenido.",
    },
    {
      nombre: "Técnico en Informática",
      duracion: "Completar",
      precio: "Completar",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Mantenimiento, reparación y soporte de equipos.",
    },
    {
      nombre: "Cajero Computarizado",
      duracion: "Completar",
      precio: "Completar",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Manejo de sistemas de caja y facturación.",
    },
  ],

  // Todos los cursos incluyen un módulo de uso de Inteligencia Artificial.
  mensajeDiferencial:
    "Todos nuestros cursos incluyen un módulo de Inteligencia Artificial aplicada.",
};
