const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv&t=" + Date.now();

const contenedor = document.getElementById("calendario");

const hoy = new Date();
const hoyDia = hoy.getDate();
const hoyMes = hoy.toLocaleString("es-CL", { month: "long" }).toLowerCase();

fetch(CSV_URL)
  .then(res => res.text())
  .then(data => {
    const filas = data.trim().split("\n").map(f => f.split(","));
    const encabezados = filas.shift();

    const iFecha = encabezados.indexOf("Fecha");
    const iEquipos = encabezados.indexOf("Equipos");
    const iHora = encabezados.indexOf("Hora");
    const iCanal = encabezados.indexOf("Canal");

    const partidosPorDia = {};

    filas.forEach(fila => {
      const fechaTexto = fila[iFecha].trim();

      if (!partidosPorDia[fechaTexto]) {
        partidosPorDia[fechaTexto] = {
          fecha: fechaTexto,
          juegos: []
        };
      }

      partidosPorDia[fechaTexto].juegos.push({
        equipos: fila[iEquipos],
        hora: fila[iHora],
        canal: fila[iCanal]
      });
    });

    Object.values(partidosPorDia).forEach(dia => {
      const divFecha = document.createElement("div");
      divFecha.className = "fecha";

      // 🔥 detectar HOY
      const fechaLower = dia.fecha.toLowerCase();
      if (fechaLower.includes(hoyDia) && fechaLower.includes(hoyMes)) {
        divFecha.classList.add("hoy");
      }

      const h2 = document.createElement("h2");
      h2.textContent = "📅 " + dia.fecha;
      divFecha.appendChild(h2);

      dia.juegos.forEach(juego => {
        const div =

