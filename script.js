const partidos = [
  {
    fecha: "Sábado 17 de febrero",
    juegos: [
      {
        equipos: "Colo-Colo vs Cobresal",
        hora: "18:00",
        canal: "TNT Sports"
      },
      {
        equipos: "Unión Española vs Everton",
        hora: "20:30",
        canal: "ESPN"
      }
    ]
  },
  {
    fecha: "Domingo 18 de febrero",
    juegos: [
      {
        equipos: "Universidad de Chile vs Palestino",
        hora: "17:00",
        canal: "TNT Sports"
      }
    ]
  }
];

const contenedor = document.getElementById("calendario");

partidos.forEach(dia => {
  const divFecha = document.createElement("div");
  divFecha.className = "fecha";

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
