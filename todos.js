let productos = JSON.parse(localStorage.getItem("productos")) || [];
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];

let filtroTexto = "";
let filtroCategoria = "";
let filtroEstacion = "";

function cargarFiltros(){
  let catSelect = document.getElementById("filtroCategoria");

  catSelect.innerHTML = `<option value="">Todas las categorías</option>`;

  categorias.forEach(c=>{
    let op = document.createElement("option");
    op.value = c;
    op.textContent = c;
    catSelect.appendChild(op);
  });
}

function render() {

  let cont = document.getElementById("lista");
  cont.innerHTML = "";

  productos
    .sort((a,b)=>a.nombre.localeCompare(b.nombre))
    .filter(p =>
      p.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) &&
      (filtroCategoria === "" || p.categoria === filtroCategoria) &&
      (filtroEstacion === "" || p.estacion === filtroEstacion)
    )
    .forEach(p => {

      let card = document.createElement("div");
      card.className = "producto";

      card.innerHTML = `
        <img src="${p.foto1}">
        <h4>${p.nombre}</h4>
        <p>$${p.precio}</p>

        <a href="producto.html?nombre=${encodeURIComponent(p.nombre)}">Ver</a>
      `;

      cont.appendChild(card);
    });
}

document.getElementById("busqueda").addEventListener("input", e => {
  filtroTexto = e.target.value;
  render();
});

document.getElementById("filtroCategoria").addEventListener("change", e=>{
  filtroCategoria = e.target.value;
  render();
});

document.getElementById("filtroEstacion").addEventListener("change", e=>{
  filtroEstacion = e.target.value;
  render();
});

cargarFiltros();
render();