const contenedor = document.getElementById("calendario");

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";

fetch(CSV_URL)
  .then(res => res.text())
  .then(texto => {
    const filas = texto.split("\n").slice(1);
    const fechas = {};

    filas.forEach(fila => {
      if (!fila.trim()) return;

      const [fechaTexto, partido, hora, canal] = fila.split(",");

      if (!fechas[fechaTexto]) {
        fechas[fechaTexto] = [];
      }

      fechas[fechaTexto].push({
        equipos: partido,
        hora,
        canal
      });
    });

    Object.keys(fechas).forEach(fecha => {
      const divFecha = document.createElement("div");
      divFecha.className = "fecha";

      // 👉 Resaltar si el texto contiene el día de hoy
      const hoyTexto = new Date().toLocaleDateString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long"
      });

      if (fecha.toLowerCase().includes(hoyTexto.split(" ")[0])) {
        divFecha.classList.add("hoy");
      }

      const h2 = document.createElement("h2");
      h2.textContent = "📅 " + fecha;
      divFecha.appendChild(h2);

      fechas[fecha].forEach(juego => {
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

    console.log("Calendario cargado OK");
  })
  .catch(err => console.error(err));

