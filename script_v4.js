const contenedor = document.getElementById("calendario");

// URL CSV publicada de Google Sheets
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";

// Fecha de hoy sin hora
const hoy = new Date();
hoy.setHours(0,0,0,0);

fetch(CSV_URL)
  .then(res => res.text())
  .then(texto => {

    const lineas = texto.trim().split("\n");
    if (lineas.length <= 1) {
      contenedor.innerHTML = "<p>No hay datos en la planilla</p>";
      return;
    }

    const separador = lineas[0].includes(";") ? ";" : ",";
    const filas = lineas.slice(1);
    const fechas = {};

    const meses = {
      enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5,
      julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11
    };

    filas.forEach(fila => {
      if (!fila.trim()) return;

      const cols = fila.split(separador).map(c => c.replace(/"/g, "").trim());
      const fechaTexto = cols[0];
      const partido = cols[1];
      const hora = cols[2];
      const canal = cols[3];

      if (!fechaTexto || !partido) return;

      // Parsear la fecha de la planilla
      const partes = fechaTexto.toLowerCase().split(" "); // ej: ["sábado", "7", "de", "febrero"]
      const dia = parseInt(partes[1]);
      const mes = meses[partes[3]];
      const anio = hoy.getFullYear(); // asumimos este año
      const fechaObj = new Date(anio, mes, dia);
      fechaObj.setHours(0,0,0,0);

      // Filtrar partidos pasados
      if (fechaObj < hoy) return;

      if (!fechas[fechaTexto]) fechas[fechaTexto] = [];
      fechas[fechaTexto].push({ partido, hora, canal, fechaObj });
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
            ${p.canal ? "&nbsp; 📺 " + p.canal : ""}
          </div>
        `;
        divFecha.appendChild(div);
      });

      contenedor.appendChild(divFecha);
    });

    console.log("Calendario actualizado solo con partidos futuros");
  })
  .catch(err => {
    console.error("Error cargando CSV:", err);
    contenedor.innerHTML = "<p>Error cargando calendario</p>";
  });


