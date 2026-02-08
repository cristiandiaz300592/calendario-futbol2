// ===============================
// URLs Google Sheets (CSV)
// ===============================
const CSV_A = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";

const CSV_B = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=356969972&single=true&output=csv";

// ===============================
// Contenedor
// ===============================
const contenedor = document.getElementById("calendario");

// ===============================
// Fecha de hoy (mismo formato planilla)
// ===============================
const hoy = new Date();
const opciones = { weekday: "long", day: "numeric", month: "long" };
const hoyTexto = hoy
  .toLocaleDateString("es-CL", opciones)
  .replace(",", "")
  .replace(/^\w/, c => c.toUpperCase());

// ===============================
// Cargar división desde CSV
// ===============================
function cargarDivision(url, nombreDivision) {
  return fetch(url)
    .then(res => res.text())
    .then(texto => {
      const lineas = texto.trim().split("\n");
      if (lineas.length <= 1) return { nombreDivision, fechas: {} };

      const separador = lineas[0].includes(";") ? ";" : ",";
      const filas = lineas.slice(1);
      const fechas = {};

      filas.forEach(fila => {
        if (!fila.trim()) return;

        const cols = fila
          .split(separador)
          .map(c => c.replace(/"/g, "").trim());

        const fecha = cols[0];
        const partido = cols[1];
        const hora = cols[2];
        const canal = cols[3];

        if (!fecha || !partido) return;

        if (!fechas[fecha]) fechas[fecha] = [];
        fechas[fecha].push({ partido, hora, canal });
      });

      return { nombreDivision, fechas };
    });
}

// ===============================
// Cargar Primera A + Primera B
// ===============================
Promise.all([
  cargarDivision(CSV_A, "Primera A"),
  cargarDivision(CSV_B, "Primera B")
])
.then(divisiones => {
  contenedor.innerHTML = "";

  divisiones.forEach(div => {
    // Título división
    const titulo = document.createElement("h1");
    titulo.textContent = div.nombreDivision;
    titulo.style.marginTop = "32px";
    contenedor.appendChild(titulo);

    Object.keys(div.fechas).forEach(fecha => {
      const divFecha = document.createElement("div");
      divFecha.className = "fecha";

      // 🔶 Destacar HOY
      if (fecha === hoyTexto) {
        divFecha.classList.add("hoy");
      }

      const h2 = document.createElement("h2");
      h2.textContent = "📅 " + fecha;
      divFecha.appendChild(h2);

      div.fechas[fecha].forEach(p => {
        const divPartido = document.createElement("div");
        divPartido.className = "partido";
        divPartido.innerHTML = `
          <div class="equipos">${p.partido}</div>
          <div class="detalle">
            ${p.hora ? "⏰ " + p.hora : ""}
            ${p.canal ? " 📺 " + p.canal : ""}
          </div>
        `;
        divFecha.appendChild(divPartido);
      });

      contenedor.appendChild(divFecha);
    });
  });

  console.log("Calendario Primera A + Primera B cargado correctamente");
})
.catch(err => {
  console.error("Error cargando calendarios:", err);
  contenedor.innerHTML = "<p>Error cargando el calendario</p>";
});


