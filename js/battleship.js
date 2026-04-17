let seleccionando = false;
let clicked_td;
let unclicked_td;
let celdasSeleccionadas = [];
window.onload = iniciar;
function iniciar() {
    let table = createTable(10, 10, true);
    let menu = document.getElementById("menu");
    menu.appendChild(table);
    let center = document.createElement("center");
    menu.appendChild(center);
    let button = document.createElement("button");
    button.setAttribute("popovertarget", "menu");
    button.setAttribute("popovertargetaction", "hide");
    button.innerHTML = "Listo";
    button.style.marginTop = "20px";
    center.appendChild(button);
}

function createTable(columns, rows, withCoordinates) { // x horizontal y vertical
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    for (let y = 0; x < columns; y++) {
        let tr = document.createElement("tr");
        for (let x = 0; y < rows; x++) {
            let td = document.createElement("td");
            td.id = xyToCoordinates(x, y, true);
            td.style.width = "25px";
            td.style.height = "25px";
            td.addEventListener("mouseup", cambiarColor)
            td.addEventListener("mousedown", seleccionandoCeldas);
            td.addEventListener("mouseover", celdaSeleccionada);
            
            let txt = document.createTextNode("");
            td.appendChild(txt);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.style.borderCollapse = "collapse";
    table.setAttribute("border", "2");
    table.appendChild(tbody);
    return table;
}

function cambiarColor() {
    seleccionando = false;
    unclicked_td = this;
    unclicked_td.style.backgroundColor = "blue";
    clicked_td.style.backgroundColor = "blue";
}

function seleccionandoCeldas() {
    seleccionando = true;
    this.style.backgroundColor = "blue";
    clicked_td = this;
}

function celdaSeleccionada() {
    if (seleccionando) {
        if (this.style.backgroundColor == "" || this.style.backgroundColor == "cyan") {
            queCeldasEstanSeleccionadas(this);
        }
    }
}

function queCeldasEstanSeleccionadas(last_td) {
    for (let x = 0; x < 10; x++) { // table length
        for (let y = 0; y < 10; y++) { // tr length
            if (document.getElementById(xyToCoordinates(x, y, true)).style.backgroundColor == "cyan") {
                document.getElementById(xyToCoordinates(x, y, true)).style.backgroundColor = "";
            }
        }
    }
    let clicked_td_coords = [clicked_td.id.slice(1) - 1, clicked_td.id[0].charCodeAt(0) - 65];
    let last_td_coords = [last_td.id.slice(1) - 1, last_td.id[0].charCodeAt(0) - 65];
    if (clicked_td_coords[0] == last_td_coords[0]) {
        celdasSeleccionadas = [];
        for (let i = clicked_td_coords[1]; i != last_td_coords[1];) {
            let actual_td = document.getElementById(xyToCoordinates(clicked_td_coords[0], i, true));
            if (clicked_td_coords[1] < last_td_coords[1]) {
                i++;
                if (actual_td.style.backgroundColor == "") {
                    actual_td.style.backgroundColor = "cyan";
                    celdasSeleccionadas.push(actual_td);
                }
            } else {
                i--;
                if (actual_td.style.backgroundColor == "") {
                    actual_td.style.backgroundColor = "cyan";
                    celdasSeleccionadas.push(actual_td);
                }
            }
        }
    } else if (clicked_td_coords[1] == last_td_coords[1]) {
        celdasSeleccionadas = [];
        for (let i = clicked_td_coords[0]; i != last_td_coords[0];) {
            let actual_td = document.getElementById(xyToCoordinates(i, clicked_td_coords[1], true));
            if (clicked_td_coords[0] < last_td_coords[0]) {
                i++;
                if (actual_td.style.backgroundColor == "") {
                    actual_td.style.backgroundColor = "cyan";
                    celdasSeleccionadas.push(actual_td);
                }
            } else {
                i--;
                if (actual_td.style.backgroundColor == "") {
                    actual_td.style.backgroundColor = "cyan";
                    celdasSeleccionadas.push(actual_td);
                }
            }
        }
        celdasSeleccionadas.push(last_td);
    } else {
        celdasSeleccionadas = [];
    }
    console.log(celdasSeleccionadas);
}

function xyToCoordinates(x, y, reverseOrder) {
    let xCoordinate = x + 1;
    let yCoordinate = String.fromCharCode(65 + y);
    if (reverseOrder)
        return yCoordinate + xCoordinate;
    return xCoordinate + yCoordinate;
}

/*
COSAS QUE ARREGLAR:

ESTAN REVERTIDAS LAS COORDS? DONT ASK ME HOW - SEMI IMPORTANTE
Esto es al mandarle a la funcion xyToCoordinates si swapeo la x y la y funca bien xd
ESTA 1 DETRAS LO DE PONER EN CELESTE - IMPORTANTE
y quiza que el ultimo que hoverees sea en si azul? total ya de porsi tiene delay de 1


cursor: not-allowed;
en el popup quiero que el jugador escoja su posicion de los barcos
y tambien la dificultad de a AI con un desplegable
el desplegable marca el % de random de hacer el mejor movimiento
el mejor movimiento siempre sera la posicion donde poniendo todas las posiciones de barcos hay mas probabilidad


*/
/*
<button popovertarget="menu">Abrir Popup</button>
<div id="menu" popover>
  <h2>¡Hola!</h2>
  <p>Este es un ejemplo de popup nativo.</p>
  <button popovertarget="menu" popovertargetaction="hide">Cerrar</button>
</div>

<style>
[popover] {
    border: 2px solid #333;
    border-radius: 8px;
    padding: 20px;
    margin: auto;
}

[popover]::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
HACER BUSCAMINAS
*/