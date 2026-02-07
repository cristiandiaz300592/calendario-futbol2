const contenedor = document.getElementById("calendario");

// URL CSV publicada de Google Sheets
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";

// Fecha de hoy
const hoy = new Date().toISOString().slice(0, 10);

fetch(CSV_URL)
  .then(res => res.text())
  .then(texto => {
    const filas = texto.split("\n").slice(1); // saltar encabezado
    const fechas = {};

    filas.forEach(fila => {
      if (!fila.trim()) return;

      const columnas = fila.split(",");

      const fechaISO = columnas[0]?.trim();
      const fechaTexto = columnas[1]?.trim();
      const partido = columnas[2]?.trim();
      const hora = columnas[3]?.trim();
      const canal = columnas[4]?.trim();

      if (!fechas[fechaISO]) {
        fechas[fechaISO] = {
          fechaTexto,
          juegos: []
        };
      }

      fechas[fechaISO].juegos.push({
        equipos: partido,
        hora,
        canal
      });
    });

    Object.keys(fechas).forEach(fechaISO => {
      const dia = fechas[fechaISO];

      const divFecha = document.createElement("div");
      divFecha.className = "fecha";

      if (fechaISO === hoy) {
        divFecha.classList.add("hoy");
      }

      const h2 = document.createElement("h2");
      h2.textContent = "📅 " + dia.fechaTexto;
      divFecha.appendChild(h2);

      dia.juegos.forEach(juego => {
        const divPartido = document.createElement("div");
        divPartido.className = "partido";
        divPartido.innerHTML = `
          <div class="equipos">${juego.equipos}</div>
          <div class="detalle">⏰ ${juego.hora} &nbsp;&nbsp; 📺 ${juego.canal}</div>
        `;
        divFecha.appendChild(divPartido);
      });

      contenedor.appendChild(divFecha);
    });

    console.log("Calendario cargado correctamente");
  })
  .catch(err => {
    console.error("Error cargando CSV:", err);
  });


