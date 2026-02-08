const contenedor = document.getElementById("calendario");

// 👉 Fecha de hoy en el MISMO formato de la planilla
const hoy = new Date();
const opciones = { weekday: "long", day: "numeric", month: "long" };
const hoyTexto = hoy
  .toLocaleDateString("es-CL", opciones)
  .replace(",", "")
  .replace(/^\w/, c => c.toUpperCase());

function cargarDivision(url, nombreDivision) {
  return fetch(url)
    .then(res => res.text())
    .then(texto => {
      const lineas = texto.trim().split("\n");
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

Promise.all([
  cargarDivision(CSV_A, "Primera A"),
  cargarDivision(CSV_B, "Primera B")
]).then(divisiones => {
  contenedor.innerHTML = "";

  divisiones.forEach(div => {
    const titulo = document.createElement("h1");
    titulo.textContent = div.nombreDivision;
    titulo.style.marginTop = "32px";
    contenedor.appendChild(titulo);

    Object.keys(div.fechas).forEach(fecha => {
      const divFecha = document.createElement("div");
      divFecha.className = "fecha";

      // 🔶 Destacar día de hoy
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

  console.log("Calendario Primera A + Primera B cargado");
}).catch(err => {
  console.error("Error cargando calendarios:", err);
  contenedor.innerHTML = "<p>Error cargando el calendario</p>";
});



