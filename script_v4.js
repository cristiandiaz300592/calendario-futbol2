console.log("JS cargado correctamente");

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSwAjG8iObcMS7Zwum05QM61k6on31_lCsxA4UFWx6nvTiA1BfA1_loV1Mc0N6mHAxEYXjO_ukKSgw/pub?gid=0&single=true&output=csv";

const contenedor = document.getElementById("calendario");

fetch(URL)
  .then(response => response.text())
  .then(texto => {
    console.log("CSV recibido");
    console.log(texto);

    const lineas = texto.trim().split("\n");
    const encabezados = lineas.shift().split(",");

    console.log("Encabezados:", encabezados);

    lineas.forEach(linea => {
      const columnas = linea.split(",");

      const div = document.createElement("div");
      div.className = "partido";
      div.innerHTML = `
        <div class="equipos">${columnas[1]}</div>
        <div class="detalle">⏰ ${columnas[2]} &nbsp;&nbsp; 📺 ${columnas[3]}</div>
      `;

      contenedor.appendChild(div);
    });
  })
  .catch(error => {
    console.error("Error al cargar CSV:", error);
  });


