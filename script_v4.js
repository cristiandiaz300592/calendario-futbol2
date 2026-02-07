const partidos = [
  {
    fecha: "Viernes 6 de febrero",
    fechaISO: "2026-02-06",
    juegos: [
      {
        equipos: "Audax Italiano vs Universidad de Concepción",
        hora: "20:00",
        canal: "TNT Sports"
      }
    ]
  },
  {
    fecha: "Sábado 7 de febrero",
    fechaISO: "2026-02-07",
    juegos: [
      {
        equipos: "Coquimbo Unido vs Palestino",
        hora: "12:00",
        canal: "TNT Sports"
      },
      {
        equipos: "O'Higgins vs Deportes La Serena",
        hora: "18:00",
        canal: "TNT Sports"
      },
      {
        equipos: "Colo-Colo vs Everton",
        hora: "20:30",
        canal: "TNT Sports"
      }
    ]
  },
  {
    fecha: "Domingo 8 de febrero",
    fechaISO: "2026-02-08",
    juegos: [
      {
        equipos: "Huachipato vs Universidad de Chile",
        hora: "12:00",
        canal: "TNT Sports"
      },
      {
        equipos: "Ñublense vs Deportes Limache",
        hora: "18:00",
        canal: "TNT Sports"
      },
      {
        equipos: "Universidad Católica vs Deportes Concepción",
        hora: "20:30",
        canal: "TNT Sports"
      }
    ]
  },
  {
    fecha: "Lunes 9 de febrero",
    fechaISO: "2026-02-09",
    juegos: [
      {
        equipos: "Unión La Calera vs Cobresal",
        hora: "20:00",
        canal: "TNT Sports"
      }
    ]
  }
];

const contenedor = document.getElementById("calendario");
const hoy = new Date().toISOString().slice(0, 10);

partidos.forEach(dia => {
  const divFecha = document.createElement("div");
  divFecha.className = "fecha";

  // 👉 Resaltar día de hoy
  if (dia.fechaISO === hoy) {
    divFecha.classList.add("hoy");
  }

  const tituloFecha = document.createElement("h2");
  tituloFecha.textContent = "📅 " + dia.fecha;
  divFecha.appendChild(tituloFecha);

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
