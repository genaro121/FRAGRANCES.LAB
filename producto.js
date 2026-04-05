let productos = JSON.parse(localStorage.getItem("productos")) || [];

let params = new URLSearchParams(location.search);
let nombre = params.get("nombre");

let p = productos.find(x => x.nombre === nombre);

let cont = document.getElementById("prod");

if (!p) {
  cont.innerHTML = "Producto no encontrado";
} else {

  let mensaje = encodeURIComponent(
    `Hola! ¿Cómo estás? Quisiera consultar por el perfume ${p.nombre}. Muchas gracias.`
  );

  cont.innerHTML = `
    <div class="detalle">

      <div class="imagenes">
        <img src="${p.foto1}">
        <img src="${p.foto2}">
      </div>

      <div class="info">
        <h1>${p.nombre}</h1>

        <p class="precio">$${p.precio}</p>

        <p class="descripcion">${p.descripcion}</p>

        <a class="btn-wsp" 
           href="https://wa.me/541127650145?text=${mensaje}" 
           target="_blank">
           Consultar por WhatsApp
        </a>

      </div>

    </div>
  `;
}