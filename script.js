let adminActivo = false;

// MENU CLICK
function toggleMenu(e){
  e.stopPropagation();
  document.getElementById("dropdownMenu").classList.toggle("show");
}

document.addEventListener("click", ()=>{
  document.getElementById("dropdownMenu")?.classList.remove("show");
});

function activarAdmin() {
  let mail = prompt("Ingresá tu mail de administrador:");

  if (mail && mail.toLowerCase().trim() === "genarobriigante741@gmail.com") {
    adminActivo = true;
    localStorage.setItem("admin", "true");
    alert("Modo admin activado");
    render();
    mostrarPanelAdmin();
  } else {
    adminActivo = false;
    localStorage.removeItem("admin");
    alert("No autorizado");
    ocultarPanelAdmin();
  }
}

function cerrarAdmin() {
  adminActivo = false;
  localStorage.removeItem("admin");
  render();
  ocultarPanelAdmin();
}

function mostrarPanelAdmin() {
  if (!adminActivo) return;
  let panel = document.getElementById("panelAdmin");
  if (panel) panel.style.display = "block";
}

function ocultarPanelAdmin() {
  let panel = document.getElementById("panelAdmin");
  if (panel) panel.style.display = "none";
}

let categorias = JSON.parse(localStorage.getItem("categorias")) || [];
let productos = JSON.parse(localStorage.getItem("productos")) || [];

function guardar() {
  localStorage.setItem("categorias", JSON.stringify(categorias));
  localStorage.setItem("productos", JSON.stringify(productos));
}

function fileToBase64(file) {
  return new Promise((res) => {
    let reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}

function crearCategoria() {
  if(!adminActivo) return alert("No autorizado");
  let n = document.getElementById("nuevaCategoria")?.value;
  if (!n) return;
  categorias.push(n);
  guardar();
  render();
}

function eliminarCategoria() {
  if(!adminActivo) return alert("No autorizado");
  let c = document.getElementById("eliminarCategoria")?.value;
  categorias = categorias.filter(x => x !== c);
  productos = productos.filter(p => p.categoria !== c);
  guardar();
  render();
}

async function crearProducto() {
  if(!adminActivo) return alert("No autorizado");

  let f1 = document.getElementById("foto1")?.files[0];
  let f2 = document.getElementById("foto2")?.files[0];

  if (!f1 || !f2) return alert("Faltan imágenes");

  let img1 = await fileToBase64(f1);
  let img2 = await fileToBase64(f2);

  let prod = {
    nombre: document.getElementById("nombre")?.value,
    precio: Number(document.getElementById("precio")?.value),
    descripcion: document.getElementById("descripcion")?.value,
    categoria: document.getElementById("categoriaSelect")?.value,
    estacion: document.getElementById("estacion")?.value,
    foto1: img1,
    foto2: img2,
    descuento: 0
  };

  productos.push(prod);
  guardar();
  render();
}

function eliminarProducto() {
  if(!adminActivo) return alert("No autorizado");
  let n = document.getElementById("eliminarProducto")?.value;
  productos = productos.filter(p => p.nombre !== n);
  guardar();
  render();
}

function flipCard(card) {
  document.querySelectorAll(".flip-card").forEach(c => {
    if (c !== card) c.classList.remove("flipped");
  });

  card.classList.toggle("flipped");
}

function filtrarEstacion(estacion) {
  render(document.getElementById("busqueda")?.value || "", estacion);
}

function render(filtro = "", estacionFiltro = "") {

  let cont = document.getElementById("categorias");
  if (!cont) return;

  cont.innerHTML = "";

  let catSel = document.getElementById("categoriaSelect");
  let elimCat = document.getElementById("eliminarCategoria");
  let elimProd = document.getElementById("eliminarProducto");

  if (catSel) catSel.innerHTML = "";
  if (elimCat) elimCat.innerHTML = "";
  if (elimProd) elimProd.innerHTML = "";

  categorias.forEach(cat => {

    if (catSel) catSel.add(new Option(cat, cat));
    if (elimCat) elimCat.add(new Option(cat, cat));

    let div = document.createElement("div");
    div.innerHTML = `<h2>${cat}</h2>`;

    let prods = document.createElement("div");
    prods.className = "productos";

    productos
      .filter(p =>
        p.categoria === cat &&
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) &&
        (estacionFiltro === "" || p.estacion === estacionFiltro)
      )
      .forEach(p => {

        if (elimProd) elimProd.add(new Option(p.nombre, p.nombre));

        let card = document.createElement("div");
        card.className = "producto";

        card.innerHTML = `
          <div class="flip-card" onclick="flipCard(this)">
            <div class="flip-inner">

              <div class="flip-front">
                <img src="${p.foto1}">
              </div>

              <div class="flip-back">
                <img src="${p.foto2}">
              </div>

            </div>
          </div>

          <h4>${p.nombre}</h4>
          <p>$${p.precio}</p>

          <a href="producto.html?nombre=${encodeURIComponent(p.nombre)}">Ver</a>
        `;

        prods.appendChild(card);
      });

    div.appendChild(prods);
    cont.appendChild(div);
  });

  if (adminActivo) {
    mostrarPanelAdmin();
  } else {
    ocultarPanelAdmin();
  }
}

let buscador = document.getElementById("busqueda");
if (buscador) {
  buscador.addEventListener("input", e => {
    render(e.target.value);
  });
}

render();