const contenedor = document.getElementById("calendario");

// 🔗 URLs CSV
const CSV_A = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";
const CSV_B = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=356969972&single=true&output=csv";

// 📅 Fecha de hoy
const hoy = new Date();
hoy.setHours(0,0,0,0);

// 🗓️ Meses
const meses = {
  enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5,
  julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11
};

// 📥 Cargar CSV con división
function cargarCSV(url, division) {
  return fetch(url)
    .then(r => r.text())
    .then(texto => {
      const lineas = texto.trim().split("\n");
      const sep = lineas[0].includes(";") ? ";" : ",";
      return lineas.slice(1).map(fila => {
        const c = fila.split(sep).map(x => x.replace(/"/g,"").trim());
        return {
          fechaTexto: c[0],
          partido: c[1],
          hora: c[2],
          canal: c[3],
          division
        };
      });
    });
}

Promise.all([
  cargarCSV(CSV_A, "Primera A"),
  cargarCSV(CSV_B, "Primera B")
])
.then(data => {

  const partidos = data.flat();
  const fechas = {};

  partidos.forEach(p => {
    if (!p.fechaTexto || !p.partido) return;

    const partes = p.fechaTexto.toLowerCase().split(" ");
    const dia = parseInt(partes[1]);
    const mes = meses[partes[3]];
    const fechaObj = new Date(hoy.getFullYear(), mes, dia);
    fechaObj.setHours(0,0,0,0);

    // ❌ Ocultar partidos pasados
    if (fechaObj < hoy) return;

    if (!fechas[p.fechaTexto]) {
      fechas[p.fechaTexto] = { fechaObj, partidos: [] };
    }

    fechas[p.fechaTexto].partidos.push(p);
  });

  contenedor.innerHTML = "";

  Object.keys(fechas).forEach(fechaTexto => {

    const grupo = fechas[fechaTexto];

    // 🔃 Ordenar por hora
    grupo.partidos.sort((a, b) => {
      if (!a.hora) return 1;
      if (!b.hora) return -1;
      return a.hora.localeCompare(b.hora);
    });

    const divFecha = document.createElement("div");
    divFecha.className = "fecha";

    if (grupo.fechaObj.getTime() === hoy.getTime()) {
      divFecha.classList.add("hoy");
    }

    const h2 = document.createElement("h2");
    h2.textContent = "📅 " + fechaTexto;
    divFecha.appendChild(h2);

    grupo.partidos.forEach(p => {
      const div = document.createElement("div");
      div.className = "partido";
      div.innerHTML = `
        <div class="equipos">
          ${p.partido}
          <span class="division ${p.division === "Primera A" ? "a" : "b"}">
            ${p.division}
          </span>
        </div>
        <div class="detalle">
          ${p.hora ? "⏰ " + p.hora : ""}
          ${p.canal ? " 📺 " + p.canal : ""}
        </div>
      `;
      divFecha.appendChild(div);
    });

    contenedor.appendChild(divFecha);
  });

  console.log("Calendario unificado, ordenado y con división");
})
.catch(err => {
  console.error(err);
  contenedor.innerHTML = "<p>Error cargando el calendario</p>";
});



