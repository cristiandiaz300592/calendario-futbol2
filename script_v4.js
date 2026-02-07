const contenedor = document.getElementById("calendario");
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";

fetch(CSV_URL)
  .then(res => res.text())
  .then(texto => {
    const filas = texto.split("\n").slice(1);
    const fechas = {};

    filas.forEach(fila => {
      if (!fila.trim()) return;

      const columnas = fila.split(",");

      const fecha = columnas[0];
      const partido = columnas[1];
      const hora = columnas[2];
      const canal = columnas[3];

      if (!fechas[fecha]) fechas[fecha] = [];

      fechas[fecha].push({ partido, hora, canal });
    });

    Object.keys(fechas).forEach(fecha => {
      const divFecha = document.createElement("div");
      divFecha.className = "fecha";

      const h2 = document.createElement("h2");
      h2.textContent = "📅 " + fecha;
      divFecha.appendChild(h2);

      fechas[fecha].forEach(p => {
        const div = document.createElement("div");
        div.className = "partido";
        div.innerHTML = `
          <div class="equipos">${p.partido}</div>
          <div class="detalle">⏰ ${p.hora} &nbsp; 📺 ${p.canal}</div>
        `;
        divFecha.appendChild(div);
      });

      contenedor.appendChild(divFecha);
    });
  });



