// 📄 Google Sheets CSV publicado
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";

const contenedor = document.getElementById("calendario");

// Fecha de hoy en formato YYYY-MM-DD (local)
const ahora = new Date();
const hoy = 
  ahora.getFullYear() + "-" +
  String(ahora.getMonth() + 1).padStart(2, "0") + "-" +
  String(ahora.getDate()).padStart(2, "0");

fetch(CSV_URL)
  .then(res => res.text())
  .then(texto => {
    const filas = texto.trim().split("\n");
    const datos = filas.slice(1); // quitar encabezados

    const dias = {};

    datos.forEach(linea => {
      if (!linea) return; // salto vacío
      const columnas = linea.split(",");

      const fechaTexto = columnas[0].trim();
      const fechaISO = columnas[1].trim();
      const equipos = columnas[2].trim();
      const hora = columnas[3].trim();
      const canal = columnas[4] ? columnas[4].trim() : "";

      if (!dias[fechaISO]) {
        dias[fechaISO] = {
          fechaTexto,
          fechaISO,
          juegos: []
        };
      }

      dias[fechaISO].juegos.push({
        equipos,
        hora,
        canal
      });
    });

    // Ordenar días por fecha ISO
    const diasOrdenados = Object.values(dias).sort((a, b) => {
      return a.fechaISO.localeCompare(b.fechaISO);
    });

    diasOrdenados.forEach(dia => {
      const divFecha = document.createElement("div");
      divFecha.className = "fecha";

      // 🟧 Resaltar si es HOY
      if (dia.fechaISO === hoy) {
        divFecha.classList.add("hoy");
      }

      const titulo = document.createElement("h2");
      titulo.textContent = "📅 " + dia.fechaTexto;
      divFecha.appendChild(titulo);

      dia.juegos.forEach(j => {
        const divPartido = document.createElement("div");
        divPartido.className = "partido";

        divPartido.innerHTML = `
          <div class="equipos">${j.equipos}</div>
          <div class="detalle">⏰ ${j.hora} &nbsp;&nbsp; 📺 ${j.canal}</div>
        `;

        divFecha.appendChild(divPartido);
      });

      contenedor.appendChild(divFecha);
    });
  })
  .catch(error => {
    console.error("Error cargando calendario:", error);
    contenedor.innerHTML = "<p>Error cargando el calendario.</p>";
  });
