const partidos = [
  {
    fecha: "Viernes 6 de febrero",
    juegos: [
      {
        equipos: "Audax Italiano vs Universidad de Concepcion",
        hora: "20:00",
        canal: "TNT Sports"
      },
     
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

