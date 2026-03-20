const contenedor = document.getElementById("calendario");

// 🔗 URLs CSV
const CSV_A = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";
const CSV_B = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=356969972&single=true&output=csv";
const CSV_INT = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=2047754953&single=true&output=csv";
const CSV_NUEVO = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=1979663092&single=true&output=csv";

// 📅 Fecha de hoy
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

// 📅 Mañana
const manana = new Date(hoy);
manana.setDate(hoy.getDate() + 1);

// 📅 Mostrar hasta 2 días hacia adelante
const limite = new Date(hoy);
limite.setDate(hoy.getDate() + 2);
limite.setHours(23, 59, 59, 999);

// 🗓️ Meses
const meses = {
  enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5,
  julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11
};

function obtenerClaseLiga(nombre) {
  const liga = nombre.toLowerCase();

  if (liga.includes("copa de la liga")) return "copaliga"; // 👈 ESTE
  if (liga.includes("champions")) return "champions";
  if (liga.includes("libertadores")) return "libertadores";
  if (liga.includes("premier")) return "premier";
  if (liga.includes("la liga")) return "laliga";
  if (liga.includes("serie a")) return "seriea";

  return "default";
}

function cargarCSV(url, division) {
  return fetch(url)
    .then(r => r.text())
    .then(texto => {
      const lineas = texto.trim().split("\n");
      const sep = lineas[0].includes(";") ? ";" : ",";
      return lineas.slice(1).map(fila => {
        const c = fila.split(sep).map(x => x.replace(/"/g, "").trim());
        return {
          fechaTexto: c[0],
          partido: c[1],
          hora: c[2],
          canal: c[3],
          liga: c[4] ? c[4].trim() : "",
          division
        };
      });
    });
}

Promise.all([
  cargarCSV(CSV_A, "Primera A"),
  cargarCSV(CSV_B, "Primera B"),
  cargarCSV(CSV_INT, "Internacional"),
  cargarCSV(CSV_NUEVO, "Copa de la Liga") // 👈 aquí puedes cambiar el nombre
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
    fechaObj.setHours(0, 0, 0, 0);

    if (fechaObj < hoy || fechaObj > limite) return;

    const clave = fechaObj.getTime();

    if (!fechas[clave]) {
      fechas[clave] = {
        fechaObj,
        fechaTexto: p.fechaTexto.trim(),
        partidos: []
      };
    }

    fechas[clave].partidos.push(p);
  });

  contenedor.innerHTML = "";

  Object.keys(fechas)
    .sort((a, b) => fechas[a].fechaObj - fechas[b].fechaObj)
    .forEach(clave => {

      const grupo = fechas[clave];

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

      if (grupo.fechaObj.getTime() === hoy.getTime()) {
        h2.textContent = "🔥 HOY";
      } 
      else if (grupo.fechaObj.getTime() === manana.getTime()) {
        h2.textContent = "⏳ MAÑANA";
      } 
      else {
        h2.textContent = "📅 " + grupo.fechaTexto;
      }

      divFecha.appendChild(h2);

      grupo.partidos.forEach(p => {

        const div = document.createElement("div");
        div.className = "partido";

        let horaLimite = null;

        // ⏰ Calcular límite (inicio + 2h) si es hoy
        if (grupo.fechaObj.getTime() === hoy.getTime() && p.hora) {

          const [horaPartido, minutoPartido] = p.hora.split(":").map(Number);

          const fechaPartido = new Date(grupo.fechaObj);
          fechaPartido.setHours(horaPartido, minutoPartido, 0, 0);

          fechaPartido.setHours(fechaPartido.getHours() + 2);

          horaLimite = fechaPartido.getTime();

          if (Date.now() > horaLimite) {
            return;
          }

          div.dataset.limite = horaLimite;
        }

        // ⭐ NUEVO FORMATO ESTILO APP
        div.innerHTML = `
          <div class="hora">${p.hora ? p.hora : ""}</div>

          <div>
            <div class="equipos">
              ${p.partido}
              <span class="division ${p.division === "Primera A" ? "a" : p.division === "Primera B" ? "b" : "int"}">
                ${p.division}
              </span>
            </div>

            ${p.liga ? `<div class="liga ${obtenerClaseLiga(p.liga)}">🏆 ${p.liga}</div>` : ""}

            <div class="detalle">
              ${p.canal ? "📺 " + p.canal : ""}
            </div>
          </div>
        `;

        divFecha.appendChild(div);
      });

      contenedor.appendChild(divFecha);
    });

  // 🔄 Eliminación automática sin refrescar
  setInterval(() => {

    document.querySelectorAll(".partido").forEach(partido => {

      const limite = partido.dataset.limite;

      if (limite && Date.now() > Number(limite)) {
        partido.remove();
      }

    });

    document.querySelectorAll(".fecha").forEach(fecha => {
      if (fecha.querySelectorAll(".partido").length === 0) {
        fecha.remove();
      }
    });

  }, 60000);

  console.log("Calendario funcionando con eliminación automática +2 horas");

})

.catch(err => {
  console.error(err);
  contenedor.innerHTML = "<p>Error cargando el calendario</p>";
});
