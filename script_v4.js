const contenedor = document.getElementById("calendario");

// URLs CSV Google Sheets
const CSV_A = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";

const CSV_B = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=356969972&single=true&output=csv";

// Fecha de hoy sin hora
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

// Meses
const meses = {
  enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5,
  julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11
};

// ===============================
// Cargar y procesar CSV
// ===============================
function cargarCSV(url, division) {
  return fetch(url)
    .then(res => res.text())
    .then(texto => {
      const lineas = texto.trim().split("\n");
      if (lineas.length <= 1) return [];

      const separador = lineas[0].includes(";") ? ";" : ",";
      const filas = lineas.slice(1);
      const partidos = [];

      filas.forEach(fila => {
        if (!fila.trim()) return;

        const cols = fila.split(separador).map(c => c.replace(/"/g, "").trim());
        const fechaTexto = cols[0];
        const partido = cols[1];
        const hora = cols[2];
        const canal = cols[3];

        if (!fechaTexto || !partido) return;

        // Parsear fecha
        const partes = fechaTexto.toLowerCase().split(" ");
        const dia = parseInt(partes[1]);
        const mes = meses[partes[3]];
        const anio = hoy.getFullYear();

        const fechaObj = new Date(anio, mes, dia);
        fechaObj.setHours(0, 0, 0, 0);

        // ❌ eliminar partidos pasados
        if (fechaObj < hoy) return;

        partidos.push({
          fechaTexto,
          fechaObj,
          partido,
          hora,
          canal,
          division
        });
      });

      return partidos;
    });
}

// ===============================
// Cargar ambas divisiones
// ===============================
Promise.all([
  cargarCSV(CSV_A, "Primera A"),
  cargarCSV(CSV_B, "Primera B")
])
.then(resultados => {

  const todos = [...resultados[0], ...resultados[1]];
  const fechas = {};

  // Agrupar por fecha
  todos.forEach(p => {
    if (!fechas[p.fechaTexto]) fechas[p.fechaTexto] = [];
    fechas[p.fechaTexto].push(p);
  });

  contenedor.innerHTML = "";

  Object.keys(fechas).forEach(fechaTexto => {
    const divFecha = document.createElement("div");
    divFecha.className = "fecha";

    const esHoy = fechas[fechaTexto][0].fechaObj.getTime() === hoy.getTime();
    if (esHoy) divFecha.classList.add("hoy");

    const h2 = document.createElement("h2");
    h2.textContent = "📅 " + fechaTexto;
    divFecha.appendChild(h2);

    fechas[fechaTexto].forEach(p => {
      const div = document.createElement("div");
      div.className = "partido";
      div.innerHTML = `
        <div class="equipos">${p.partido}</div>
        <div class="detalle">
          ${p.hora ? "⏰ " + p.hora : ""}
          ${p.canal ? " 📺 " + p.canal : ""}
          <span style="opacity:.7;"> — ${p.division}</span>
        </div>
      `;
      divFecha.appendChild(div);
    });

    contenedor.appendChild(divFecha);
  });

  console.log("Calendario combinado cargado correctamente");
})
.catch(err => {
  console.error("Error cargando calendario:", err);
  contenedor.innerHTML = "<p>Error cargando calendario</p>";
});


