let seleccionando = false;
let clicked_td;
let unclicked_td;
let celdasSeleccionadas = [];
let colocandoCeldas = false;
//let colorDefault = "#e3f2fd";
let colorDefault = "rgb(227, 242, 253)";
let barcosPorColocar = [2, 3, 3, 4, 5];
window.onload = iniciar;
function iniciar() {
    let popup = document.getElementById("popup");
    popup.addEventListener("click", crearContenidoPopup);
}

function crearContenidoPopup() {
    let table = createTable(10, 10, true);
    let menu = document.getElementById("menu");
    //console.log(menu);
    menu.innerHTML = "";
    menu.appendChild(table);
    let center = document.createElement("center");
    menu.appendChild(center);
    let button = document.createElement("button");
    //button.setAttribute("popovertarget", "menu");
    //button.setAttribute("popovertargetaction", "hide");
    button.innerHTML = "Reiniciar";
    button.style.marginTop = "20px";
    center.appendChild(button);
    button.addEventListener("click", function() {
        menu.removeChild(table);
        table = createTable(10, 10, true);
        menu.appendChild(table);
        menu.appendChild(center);
        barcosPorColocar = [2, 3, 3, 4, 5];
    });
}

function createTable(columns, rows, withCoordinates) { // x horizontal y vertical
    let table = document.createElement("table");
    table.addEventListener("dragstart", (e) => {
        e.preventDefault();
    });
    let tbody = document.createElement("tbody");
    for (let y = 0; y < columns; y++) {
        let tr = document.createElement("tr");
        for (let x = 0; x < rows; x++) {
            let td = document.createElement("td");
            td.id = xyToCoordinates(x, y, true);
            td.style.width = "25px";
            td.style.height = "25px";
            td.style.backgroundColor = colorDefault;
            td.style.cursor = "pointer";
            //td.style.borderRadius = "4px";
            //td.style.border = "1px solid #FFFFFF";
            td.addEventListener("mouseup", cambiarColor);
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
    //table.style.borderSpacing = "0";
    //table.setAttribute("border", "0");
    table.appendChild(tbody);
    return table;
}

function cambiarColor() {
    if (!colocandoCeldas && seleccionando) {
        seleccionando = false;
        if (celdasSeleccionadas.length != 0) {
            colocandoCeldas = true;
            barcosPorColocar.splice(barcosPorColocar.indexOf(celdasSeleccionadas.length + 1), 1);
            setTimeout(poniendoBarco, 50);
        } else {
            clicked_td.style.backgroundColor = colorDefault;
        }
    }
}

function poniendoBarco() {
    if (celdasSeleccionadas.length > 0) {
        if (document.getElementById(celdasSeleccionadas[0]).style.backgroundColor != "red") {
            document.getElementById(celdasSeleccionadas[0]).style.backgroundColor = "blue";
        } else {
            document.getElementById(celdasSeleccionadas[0]).style.backgroundColor = colorDefault;
        }
        celdasSeleccionadas.shift();
        setTimeout(poniendoBarco, 75);
    } else {
        colocandoCeldas = false;
    }
}

function seleccionandoCeldas() {
    if (!colocandoCeldas && barcosPorColocar.length != 0 && this.style.backgroundColor != "blue") {
        if (seleccionando) {
            clicked_td.style.backgroundColor = colorDefault;
            removerCeldasCyan();
        }
        seleccionando = true;
        clicked_td = this;
        clicked_td.style.backgroundColor = "blue";
    }   
}

function celdaSeleccionada() {
    if (seleccionando && !colocandoCeldas) {
        queCeldasEstanSeleccionadas(this);
    }
}

function removerCeldasCyan() {
    for (let i = 0; i < celdasSeleccionadas.length; i++) {
        document.getElementById(celdasSeleccionadas[i]).style.backgroundColor = colorDefault;
    }
    celdasSeleccionadas = [];
}

function queCeldasEstanSeleccionadas(last_td) {
    removerCeldasCyan();
    let clicked_td_coords = [clicked_td.id.slice(1) - 1, clicked_td.id[0].charCodeAt(0) - 65];
    let last_td_coords = [last_td.id.slice(1) - 1, last_td.id[0].charCodeAt(0) - 65];
    deMomentoSinNombre(clicked_td_coords, last_td_coords, true);
    deMomentoSinNombre(clicked_td_coords, last_td_coords, false);
}

function deMomentoSinNombre(td_coords_1, td_coords_2, boolean) {
    let num1 = 0, num2 = 1;
    if (!boolean) {
        [num1, num2] = [num2, num1];
    }
    if (td_coords_1[num1] == td_coords_2[num1]) {
        for (let i = td_coords_1[num2]; i != td_coords_2[num2];) {
            if (td_coords_1[num2] < td_coords_2[num2]) {
                i++;
            } else {
                i--;
            }
            let actual_td = document.getElementById(xyToCoordinates(td_coords_1[num1], i, boolean));
            if (actual_td.style.backgroundColor == colorDefault) {
                actual_td.style.backgroundColor = "cyan";
                celdasSeleccionadas.push(actual_td.id);
            } else {
                break;
            }
        }
        if (celdasSeleccionadas.length != 0 && celdasSeleccionadas.length + 1 != barcosPorColocar[barcosPorColocar.indexOf(celdasSeleccionadas.length + 1)]) {
            document.getElementById(celdasSeleccionadas[celdasSeleccionadas.length - 1]).style.backgroundColor = "red";
            //document.getElementById(celdasSeleccionadas.pop());
        }
    }
}

function xyToCoordinates(x, y, reverseOrder) {
    if (reverseOrder) {
        [x, y] = [y, x];
    }
    let xCoordinate = String.fromCharCode(65 + x);
    let yCoordinate = y + 1;
    return xCoordinate + yCoordinate;
}

/*

nuevoBarco.length suena mejor cambiar la variable celdasSeleccionadas a eso
newShip en ingles obviamente
y hacer una funcion 
ENCIMA ESTA VARIABLE NO SE PORQUE DECIDI PUSHEAR SOLO LA ID???
MAKES NO SENSE
*/



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
if (clicked_td_coords[0] == last_td_coords[0]) {
        for (let i = clicked_td_coords[1]; i != last_td_coords[1];) {
            if (clicked_td_coords[1] < last_td_coords[1]) {
                i++;
            } else {
                i--;
            }
            let actual_td = document.getElementById(xyToCoordinates(clicked_td_coords[0], i, true));
            if (celdasSeleccionadas.length + 2 != barcosPorColocar[barcosPorColocar.indexOf(celdasSeleccionadas.length + 2)] || actual_td.style.backgroundColor == "blue") {
                break;
            } else if (actual_td.style.backgroundColor == colorDefault) {
                actual_td.style.backgroundColor = "cyan";
                celdasSeleccionadas.push(actual_td.id);
            }
        }
    } else if (clicked_td_coords[1] == last_td_coords[1]) {
        for (let i = clicked_td_coords[0]; i != last_td_coords[0];) {
            if (clicked_td_coords[0] < last_td_coords[0]) {
                i++;
            } else {
                i--;
            }
            let actual_td = document.getElementById(xyToCoordinates(i, clicked_td_coords[1], true));
            if (celdasSeleccionadas.length + 2 != barcosPorColocar[barcosPorColocar.indexOf(celdasSeleccionadas.length + 2)] || actual_td.style.backgroundColor == "blue") {

                break;
            } else if (actual_td.style.backgroundColor == colorDefault) {
                actual_td.style.backgroundColor = "cyan";
                celdasSeleccionadas.push(actual_td.id);
            }
        }
    }
*/