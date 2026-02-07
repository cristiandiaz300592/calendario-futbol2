const contenedor = document.getElementById("calendario");

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";

/* 🔧 Normalizar texto: minúsculas + sin tildes */
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/* 📅 Texto del día de hoy (ej: "sabado 7 de febrero") */
const hoy = new Date();
const opciones = { weekday: "long", day: "numeric", month: "long" };

const hoyTexto = normalizarTexto(
  hoy.toLocaleDateString("es-CL", opciones).replace(",", "")
);

console.log("Hoy normalizado:", hoyTexto);

fetch(CSV_URL)
  .then(res => res.text())
  .then(texto => {

    console.log("CSV crudo:", texto.slice(0, 300));

    const lineas = texto.trim().split("\n");
    if (lineas.length <= 1) {
      contenedor.innerHTML = "<p>No hay datos en la planilla</p>";
      return;
    }

    // 👉 Detectar separador automáticamente
    const separador = lineas[0].includes(";") ? ";" : ",";
    console.log("Separador detectado:", separador);

    const filas = lineas.slice(1);
    const fechas = {};

    filas.forEach(fila => {
      if (!fila.trim()) return;

      const cols = fila
        .split(separador)
        .map(c => c.replace(/"/g, "").trim());

      const fecha = cols[0];   // ej: "sábado 7 de febrero"
      const partido = cols[1];
      const hora = cols[2];
      const canal = cols[3];

      if (!fecha || !partido) return;

      if (!fechas[fecha]) fechas[fecha] = [];
      fechas[fecha].push({ partido, hora, canal });
    });

    contenedor.innerHTML = "";

    Object.keys(fechas).forEach(fecha => {
      const divFecha = document.createElement("div");
      divFecha.className = "fecha";

      /* 🔥 COMPARACIÓN NORMALIZADA */
      if (normalizarTexto(fecha) === hoyTexto) {
        divFecha.classList.add("hoy");
      }

      const h2 = document.createElement("h2");
      h2.textContent = "📅 " + fecha;
      divFecha.appendChild(h2);

      fechas[fecha].forEach(p => {
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

    console.log("Calendario renderizado correctamente");
  })
  .catch(err => {
    console.error("Error cargando CSV:", err);
    contenedor.innerHTML = "<p>Error cargando calendario</p>";
  });
