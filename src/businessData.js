// businessData.js
// Toda la información de Infotech Technology que el bot usa para responder.
// Editá este archivo cuando cambien precios, horarios o cursos.

module.exports = {
  nombreNegocio: "Infotech Technology",

  sedes: [
    {
      nombre: "Sede 9na Línea",
      direccion: "9na Línea Yroysa, Guairá, Paraguay",
      telefono: "0982 925385 / 0987 119183",
      horario: "Jueves, viernes y sábado",
    },
    {
      nombre: "Sede 4ta Línea",
      direccion: "4ta Línea Yroysa, Guairá, Paraguay",
      telefono: "0982 925385 / 0987 119183",
      horario: "Lunes",
    },
    {
      nombre: "Sede Santa Cecilia",
      direccion: "Santa Cecilia, Guairá, Paraguay",
      telefono: "0982 925385 / 0987 119183",
      horario: "Martes y miércoles",
    },
  ],

  cursos: [
    {
      nombre: "Operador en Informática",
      duracion: "12 a 18 meses",
      precio: "₲ 120.000",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Formación base en el uso de computadoras y herramientas de oficina.",
    },
    {
      nombre: "Diseño Gráfico",
      duracion: "12 a 18 meses",
      precio: "₲ 150.000",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Herramientas de diseño visual y edición gráfica.",
    },
    {
      nombre: "Diseño Web",
      duracion: "12 a 18 meses",
      precio: "₲ 150.000",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Creación de sitios web desde cero.",
    },
    {
      nombre: "Marketing Digital",
      duracion: "12 a 18 meses",
      precio: "₲ 130.000",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Estrategias de redes sociales, publicidad online y contenido.",
    },
    {
      nombre: "Técnico en Informática",
      duracion: "12 a 18 meses",
      precio: "₲ 150.000",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Mantenimiento, reparación y soporte de equipos.",
    },
    {
      nombre: "Cajero Computarizado",
      duracion: "12 a 18 meses",
      precio: "₲ 150.000",
      modalidad: "Presencial",
      incluyeIA: true,
      descripcion: "Manejo de sistemas de caja y facturación.",
    },
  ],

  // Todos los cursos incluyen un módulo de uso de Inteligencia Artificial.
  mensajeDiferencial:
    "Todos nuestros cursos incluyen un módulo de Inteligencia Artificial aplicada.",
};
