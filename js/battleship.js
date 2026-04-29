let seleccionando = false;
let clicked_td;
let unclicked_td;
let newShip = [];
let colocandoCeldas = false;
//let colorDefault = "#e3f2fd";
let colorDefault = "rgb(227, 242, 253)";
let colorSelected = "rgb(0, 127, 255)";
let barcosDisponibles = [2, 3, 3, 4, 5, 1, 9, 10];
let barcosPorColocar = Array.from(barcosDisponibles);
let celdasRojas = [];
let nRows = 10;
let nColumns = 10;
//console.log(Math.abs(nColumns).toString().length);
let dragging = false;
let barcos = [];
let grabbed_td;
let grabbed_ship;
let selectedCells = [];
let ghostShip = [];
window.onload = iniciar;
function iniciar() {
    let popup = document.getElementById("popup");
    popup.addEventListener("click", crearContenidoPopup);
}

function crearContenidoPopup() {
    //barcosPorColocar = barcos; // bug aunque ponga esto si pones todos los barcos y clikeas fuera del popup y lo abres de vuelta no se reinicia
    let table = createTable(nRows, nColumns);
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
        table = createTable(nRows, nColumns);
        menu.appendChild(table);
        menu.appendChild(center);
        barcosPorColocar = Array.from(barcosDisponibles);
    });
}

function createTable(rows, columns) { // x horizontal y vertical
    let table = document.createElement("table");
    table.addEventListener("dragstart", (e) => {
        e.preventDefault();
    });
    let tbody = document.createElement("tbody");
    //tbody.classList.add("pointer");
    for (let x = 0; x < rows; x++) {
        let tr = document.createElement("tr");
        for (let y = 0; y < columns; y++) {
            let td = document.createElement("td");
            td.id = xyToCoordinates(x, y, false);
            td.style.width = "25px";
            td.style.height = "25px";
            td.style.backgroundColor = colorDefault;
            //td.style.cursor = "pointer";
            //td.style.borderRadius = "4px";
            //td.setAttribute("border", "2px solid black");//td.style.border = "1px solid #FFFFFF";
            td.addEventListener("mouseup", cambiarColor);
            td.addEventListener("mousedown", seleccionandoCeldas);
            td.addEventListener("mouseover", celdaSeleccionada);
            //let txt = document.createTextNode("");
            //td.appendChild(txt);
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
    if ((!colocandoCeldas && seleccionando)/* || dragging*/) {
        seleccionando = false;
        //dragging = false;
        if (newShip.length - celdasRojas.length != 0 && barcosPorColocar.includes(newShip.length - celdasRojas.length)) {
            colocandoCeldas = true;
            barcosPorColocar.splice(barcosPorColocar.indexOf(newShip.length - celdasRojas.length), 1);
            //clicked_td.classList.add("grab");
            /*if (newShip.length > 1) {
                se podria poner aqui y hacer q la funcion reciba la array de una en vez de placingShip
            }*/
            barcos.push(fixShip(newShip));
            toggleBorder(barcos[barcos.length - 1]);
            setTimeout(placingShip, 50);
        } else {
            newShip = [];
            for (let i = 0; i < celdasRojas.length; i++) {
                celdasRojas[i].style.backgroundColor = colorDefault;
            }
            celdasRojas = [];
            clicked_td.style.backgroundColor = colorDefault;
        }
    }
}

function fixShip(shipToFix) {
    let ship = [];
    shipToFix = shipToFix.slice(0, shipToFix.length - celdasRojas.length);
    if (shipToFix.length != 1 && (parseInt(shipToFix[0].id.slice(1)) > parseInt(shipToFix[1].id.slice(1)) || shipToFix[0].id[0] > shipToFix[1].id[0])) {
        if (isShipVertical(shipToFix)) {
            for (let i = 0; i < shipToFix.length; i++) {
                ship.unshift(shipToFix[i]);
            }
        } else {
            for (let i = 0; i < shipToFix.length; i++) {
                ship.unshift(shipToFix[i]);
            }
        }
        return ship;
    }
    return shipToFix;
}

function toggleBorder(ship) {
    for (let i = 1; i < ship.length; i++) {
        if (isShipVertical(ship)) {
            if (getComputedStyle(ship[i - 1]).borderBottomStyle != "none") {
                ship[i - 1].style.borderBottom = "none";
                ship[i].style.borderTop = "none";
            } else {
                ship[i - 1].style.borderBottom = "1px inset grey";
                ship[i].style.borderTop = "1px inset grey";
            }
        } else {
            if (getComputedStyle(ship[i - 1]).borderRightStyle != "none") {
                ship[i - 1].style.borderRight = "none";
                ship[i].style.borderLeft = "none";
            } else {
                ship[i - 1].style.borderRight = "1px inset grey";
                ship[i].style.borderLeft = "1px inset grey";
            }
        }
    }
}

function uniteTDs(td_1, td_2) {
    let sameColumn = newShip[0].id.slice(1) == newShip[1].id.slice(1);
    let lowToHigh = (parseInt(newShip[0].id.slice(1)) < parseInt(newShip[1].id.slice(1)) || (newShip[0].id[0] < newShip[1].id[0] && newShip[0].id.slice(1) == newShip[1].id.slice(1)));
    if (!lowToHigh) {
        [td_1, td_2] = [td_2, td_1];
    }
    if (sameColumn) {
        td_1.style.borderBottom = "none";
        td_2.style.borderTop = "none";
    } else {
        td_1.style.borderRight = "none";
        td_2.style.borderLeft = "none";   
    }
}

function placingShip() {
    if (newShip.length > 0) {
        if (newShip[0].style.backgroundColor != "red") {
            newShip[0].style.backgroundColor = "blue";
            if (newShip.length > 1 && newShip[1].style.backgroundColor != "red") {
                //uniteTDs(newShip[0], newShip[1]);
            }
        } else {
            newShip[0].style.backgroundColor = colorDefault;
        }
        //newShip[0].classList.add("grab"); // grab or move esta divertido quiza futura funcion
        newShip.shift();
        setTimeout(placingShip, 75);
    } else {
        colocandoCeldas = false;
    }
}

function isShipVertical(ship) {
    return ship.length > 1 && ship[0].id[0] < ship[1].id[0];
}

function seleccionandoCeldas() {
    if (this.style.backgroundColor == "blue") {
        grabbed_ship = getGrabbedShip(this);
        toggleBorder(grabbed_ship);
        
        dragging = true;
        grabbed_td = this;
        grabbed_td.style.backgroundColor = colorSelected; // esto deberia de ser TODO el barco
        selectedCells.push(grabbed_td); // lo mismo tambien deberia de ser todo el barco
        //grabbed_ship = getGrabbedShip(grabbed_td);
        //addClassSiblings(this, "grabbing");
        /*//*
        COMO ESTO SE REPITE EN EL HOVER PORQUE NO LLAMAMOS A celdaSeleccionada Y PUNTO asi de una
        */
    } else if (!colocandoCeldas && barcosPorColocar.length != 0 && !dragging) {
        removeCyanCells();
        if (seleccionando) {
            clicked_td.style.backgroundColor = colorDefault;
        }
        seleccionando = true;
        clicked_td = this;
        clicked_td.style.backgroundColor = colorSelected;
        newShip.push(clicked_td);
    }   
}

function celdaSeleccionada() {
    //dragging = false;
    if (dragging) {
        updateGrabbed_td(grabbed_ship, grabbed_td, this);
        /*
        let id1 = getCoords(this);
        let id2 = getCoords(this.nextSibling);
        drawLine(id1, id2, true);
        drawLine(id1, id2, false);
        //*/
        /*
            let clicked_td_coords = getCoords(clicked_td);
            let last_td_coords = getCoords(last_td);
            newShip.push(clicked_td);
            drawLine(clicked_td_coords, last_td_coords, true);
            drawLine(clicked_td_coords, last_td_coords, false);
        */
    } else if (seleccionando && !colocandoCeldas) {
        removeCyanCells();
        calculateLine(this);
    }
}

function updateGrabbed_td(ship, td, this_td) {
    let td_position = getPositionTD(ship, td);
    let this_td_coords = getCoords(this_td);
    if (isShipVertical(ship)) {
        if (this_td_coords[0] - td_position < 0) {
            grabbed_td = ship[this_td_coords[0]];
        }
        if (this_td_coords[0] + ship.length - td_position > 10) {
            grabbed_td = ship[ship.length - nColumns + this_td_coords[0]];
        }
    } else {
        if (this_td_coords[1] - td_position < 0) {
            grabbed_td = ship[this_td_coords[1]];
        }
        if (this_td_coords[1] + ship.length - td_position > 10) {
            grabbed_td = ship[ship.length - nColumns + this_td_coords[1]];
        }
    }
    console.log(grabbed_td);
    //return grabbed_td.id;
}

function getPositionTD(ship, td) {
    for (let i = 0; i < ship.length; i++) {
        if (ship[i] == td) {
            return i;
        }
    }
}

function removeSelectedCells() {
    for (let i = 0; i < selectedCells.length; i++) {
        selectedCells[i].style.backgroundColor = colorDefault;
    }
    selectedCells = [];
}

function getGrabbedShip(grabbed_td) {
    for (let i = 0; i < barcos.length; i++) {
        if (barcos[i].includes(grabbed_td)) {
            return barcos[i];
        }
    }
}

function removeCyanCells() {
    for (let i = 1; i < newShip.length; i++) {
        newShip[i].style.backgroundColor = colorDefault;
    }
    newShip = [];
    for (let i = 0; i < celdasRojas.length; i++) {
        celdasRojas[i].style.backgroundColor = colorDefault;
    }
    celdasRojas = [];
}

function calculateLine(last_td) {
    let clicked_td_coords = getCoords(clicked_td);
    let last_td_coords = getCoords(last_td);
    newShip.push(clicked_td);
    drawLine(clicked_td_coords, last_td_coords, true);
    drawLine(clicked_td_coords, last_td_coords, false);
}

function getCoords(td) {
    return [td.id[0].charCodeAt(0) - 65, td.id.slice(1) - 1];
}

function drawLine(td_coords_1, td_coords_2, boolean) {
    let num1 = 0, num2 = 1;
    if (boolean) {
        [num1, num2] = [num2, num1];
    }
    if (td_coords_1[num1] == td_coords_2[num1]) {
        for (let i = td_coords_1[num2]; i != td_coords_2[num2];) {
            if (td_coords_1[num2] < td_coords_2[num2]) {
                i++; //actual_td.style.borderRight = "none";
            } else {
                i--; //actual_td.style.borderLeft = "none";
            }
            let actual_td = document.getElementById(xyToCoordinates(td_coords_1[num1], i, boolean));
            if (actual_td.style.backgroundColor != "blue") {
                /*if (dragging) {
                    actual_td.style.backgroundColor = colorSelected;
                    selectedCells.push(actual_td);
                } else {*/
                    actual_td.style.backgroundColor = "cyan";
                    newShip.push(actual_td);
                //}
            } else {
                break;
            }
            //if (!dragging) {// en vez de esto hago en el if un || dragging asi clereo las rojas
                celdasRojas.push(actual_td);
                if (newShip.length == barcosPorColocar[barcosPorColocar.indexOf(newShip.length)] || dragging) {
                    celdasRojas = [];
                }
            //} // o un if dragging y hago mi logica de si actual_td = blue push :D
        }
        for (let i = 0; i < celdasRojas.length; i++) {
            celdasRojas[i].style.backgroundColor = "red";
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
    /* esto para coger length de un numero para ponerlo en la id A01
    Math.abs(numero).toString().length
    tambien quiero la logica que cree una vez en el blockblast del excel
    AA...AZ, BA y todo eso
    */
}

/*
BUGGGGG
UNA VEZ QUE YA TENGO EL SHIP DEBO DE LIMPIAR EL CLICKED_TD
PORQUE SINO SE ELIMINA EN EL DRAG AL FINALIZARSE
*/

/*
Añadir boton al menu de que si ya escoge esas posiciones de barcos
y algo que verifice que todos los barcos estan puestos y los guarda en variables
Tambien hacer algo que si un barco.lenght > que nRows y nColumns eliminar barco de array barcosPorColocar
no se elimina de barcos porque quiza cambia el nRows o nColumns despues
y la verificacion de eso se hace despues de que barcosPorColocar = barcos
*/

/*
function addClassSiblings(cell, className) {
    cell.classList.add(className);
    if (cell.previousSibling != null) {
        cell.previousSibling.classList.add(className);
    }
    if (cell.nextSibling != null) {
        cell.nextSibling.classList.add(className);
    }
    if (cell.parentElement.previousSibling != null) {
        if (cell.parentElement.previousSibling.children[cell.id.slice(1) - 1] != null) {
            cell.parentElement.previousSibling.children[cell.id.slice(1) - 1].classList.add(className);
        }
    }
    if (cell.parentElement.nextSibling != null) {
        if (cell.parentElement.nextSibling.children[cell.id.slice(1) - 1] != null) {
            cell.parentElement.nextSibling.children[cell.id.slice(1) - 1].classList.add(className);
        }
    }
}
*/

/*
DISEÑO:
Menu principal con 3 botones en el medio
Jugar online
Partida custom (tambien puede ser con IA o con codigo para meterse)
Jugar offline
En el popup arriba derecha ponemos el boton de help y con el cursor ese de help que existe
y explicamos como poner barcos
https://vibhorjaiswal.github.io/Cursor-Test/
*/

/*
COMO VOY A TENER QUE HACER QUE DOS JUGADORES SE ENFRENTEN ENTRE ELLOS
Sistema ELO
y opcion de partida custom en la que pueden cambiar opciones como barcos etc (no cuenta para ELO)
*/

/*
TAMBIEN QUIERO QUE EN VEZ DE PONER LAS CELLS AUZL DE UNA QUE LAS AÑADO EN ARRAY
Y DESPUES SI ACASO LAS HAGO AZUL

nuevoBarco.length suena mejor cambiar la variable celdasSeleccionadas a eso
newShip en ingles obviamente
y hacer una funcion 
ENCIMA ESTA VARIABLE NO SE PORQUE DECIDI PUSHEAR SOLO LA ID???
MAKES NO SENSE
*/

/*
PUES DEBAJO DE DONDE COLOCAS TUS BARCOS
QUIERO un barco de dos hacia abajo
a la derecha num barcos restantes
y debajo barco de dos hacia la derecha
para hacer cuadrado
quiza encima de eso el nombre del barco o algo
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

    console.log(this.previousSibling);
    console.log(this.nextSibling);
    console.log(this.parentElement.previousSibling.children[this.id.slice(1) - 1]);
    console.log(this.parentElement.nextSibling.children[this.id.slice(1) - 1]);
*/

/*
Lineas que hay que cambiar si clicked_td lo pusheamos en celdasSeleccionadas
82, 84, 99, 100, 101, 103, 105, 177
Lineas que quiza hay que cambiar
88, 93, 121, 141
Linea 153-154 PUSHEAMOS clicked alli es una opcion
PLUS las lineas que afectas colores porque ahora las cells seleccionadas tendran el color: colorSelected
*/

/*
recuerda para darle la vuelta a un numero
1, 10
y lo queremos al reves
maxNum (10) + minNUm(1) - num
si num era 1 ahora es 10
si num era 10 ahora es 1
*/

/*
BUG: CUANDO HAGO UN BARCO CON ERROR Y LO DRAGGEO APARECE DE VUELTA LA CELDA ROJA
*/

/*
dije shift click para eliminar pero y si es para rotar la ficha?
despues la tendras que mover arrastandola con mecanica grabbing
*/

/*
        // TODO ESTO DEBERIA DE ESTAR DENTRO DEL SELECIONANDO !COLOCANDO CELDAS
        // ya que solo se actualizara la posicion final cuando suelte el click
        // y cuando lo suelte esto dejara de funcar
        //addClassSiblings(this, "grabbing");
        /*
        si llega a una esquina como no deberias pushear mas dragged_td se convierte la esquina :D
        moviendo todo asi uno a la izquierda si es que vamos a la derecha

        si posicion es invalida (hay un barco ahi)
        ponemos la casilla que este en la posicion unvalida en rojo 
        luego la devolveremos a azul
        guardando la esta en celdasRojas
        si sueltas el click en posicion unvalida
        vuelve a su posicion original
        por lo tanto areNewCoordsValid es algo que se tiene que chekear para cada cell con un for
        y si no es valido se pone en rojo o se cambia las coords del draggable

        TAMBIEN
        quiero que si haces Shift + Click en un barco lo eliminas y lo puedes volver a colocar despues
        se que esto se puede hacer con lo de event que si un check si tienes presionadas varias teclas
        quiza añadir algo de Ctrl + Z aunque no se si es posible pero deberia de serlo
        *//*
        removeSelectedCells();
        this.style.backgroundColor = colorSelected;
        updateGrabbed_td(grabbed_td, grabbed_ship, this);
        //ghostShip; // quiero usar newShip como nombre para el futuro luego se optimiza esto
        grabbed_td_coords = getCoords(grabbed_td);
        this_coords = getCoords(this);
        drawLine(this_coords, grabbed_td_coords, true);
        drawLine(this_coords, grabbed_td_coords, false);
        /*
        if (true) {
            removeSelectedCells();
            this.style.backgroundColor = colorSelected;
            id1 = getCoords(this);
            id2 = getCoords(this.nextSibling);
            // necesitamos guncion de getLast or whatever
            // getFirst(this, dragged_td, dragged_ship[0]);
            // getLast(this, dragged_td, dragged_ship[dragged_ship.lenght - 1]);
            selectedCells.push(this);
            drawLine(id1, id2, true);// se calcula las cosas
            drawLine(id1, id2, false);
        }*/

            /*
/*
    if (ship.length != 1 && ship[0].id[0] != ship[1].id[0]) {
        console.log(parseInt(this_td.id.slice(1) - 1) + " + " + ship.length + " - " + td_position + " > 10");
        if (parseInt(this_td.id.slice(1) - 1) + ship.length - td_position > 10) {
            console.log("barco out of bounds");
        }
        console.log(parseInt(this_td.id.slice(1) - 1) + " - " + td_position + " < 0");
        if (parseInt(this_td.id.slice(1) - 1) - td_position < 0) {
            console.log("barco out of bounds");
        }
    } else {
        console.log(parseInt(this_td.id.slice(1) - 1) + " + " + ship.length + " - " + td_position + " > 10");
        if (parseInt(this_td.id.slice(1) - 1) + ship.length - td_position > 10) {
            console.log("barco out of bounds");
        }
        console.log(parseInt(this_td.id.slice(1) - 1) + " - " + td_position + " < 0");
        if (parseInt(this_td.id.slice(1) - 1) - td_position < 0) {
            console.log("barco out of bounds");
        }
    }*/
    //console.log(parseInt(this_td.id.slice(1) - 1));
    //console.log(grabbed_td);
    /*if (parseInt(this_td.id.slice(1) - 1) < td_position) {
        grabbed_td = ship[parseInt(this_td.id.slice(1) - 1)]; // esto no es lo que tenia que hacer
        // tengo que hacer que el ship no se vaya a la izq por ejemplo por la diferencia de td_position - parseInt ese
        // incluso si es negativo o positivo funcionaria igualmente
        // 10 - 10 fuck eso no tiene sentido un ship de 10 whatever no voy a pensar eso mucho
        // quiza tan solo que esta funcion devuelva la diferencia esa en vez de mirar si es valido o no, si es valido after all
        // la diferencia seria 0
        // y si no es valida la diferencia lo hara valida y recordemos que las azules se haran rojas
        // simple
        // 
        // claro devolvemos la td_position osea ship[td_position]
        // y en este if es donde actualizamos la posicion para enviarla despues
    }*/
    //console.log(grabbed_td);
    //console.log(td_position);
    //return grabbed_td;