const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv&t=" +
  Date.now();

const contenedor = document.getElementById("calendario");

// fecha de hoy
const hoy = new Date();
const hoyDia = hoy.getDate();
const hoyMes = hoy.toLocaleString("es-CL", { month: "long" }).toLowerCase();

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let char of text) {
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(value.trim());
      value = "";
    } else if (char === "\n" && !insideQuotes) {
      row.push(value.trim());
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  return rows;
}

fetch(CSV_URL)
  .then(r => r.text())
  .then(text => {
    const filas = parseCSV(text);
    const encabezados = filas.shift();

    const iFecha = encabezados.indexOf("Fecha");
    const iEquipos = encabezados.indexOf("Equipos");
    const iHora = encabezados.indexOf("Hora");
    const iCanal = encabezados.indexOf("Canal");

    const porFecha = {};

    filas.forEach(f => {
      if (!f[iFecha]) return;

      const fecha = f[iFecha].trim();

      if (!porFecha[fecha]) {
        porFecha[fecha] = { fecha, juegos: [] };
      }

      porFecha[fecha].juegos.push({
        equipos: f[iEquipos],
        hora: f[iHora],
        canal: f[iCanal]
      });
    });

    Object.values(porFecha).forEach(dia => {
      const divFecha = document.createElement("div");
      divFecha.className = "fecha";

      const fechaLower = dia.fecha.toLowerCase();
      if (fechaLower.includes(hoyDia) && fechaLower.includes(hoyMes)) {
        divFecha.classList.add("hoy");
      }

      const h2 = document.createElement("h2");
      h2.textContent = "📅 " + dia.fecha;
      divFecha.appendChild(h2);

      dia.juegos.forEach(j => {
        const div = document.createElement("div");
        div.className = "partido";
        div.innerHTML = `
          <div class="equipos">${j.equipos}</div>
          <div class="detalle">⏰ ${j.hora} &nbsp;&nbsp; 📺 ${j.canal}</div>
        `;
        divFecha.appendChild(div);
      });

      contenedor.appendChild(divFecha);
    });
  });

      dia.juegos.forEach(juego => {
        const div =


