let seleccionando = false;
let clicked_td;
let unclicked_td;
let newShip = [];
let colocandoCeldas = false;
let colorDefault = "rgb(227, 242, 253)";
let colorSelected = "rgb(0, 127, 255)";
let barcosDisponibles = [2, 3, 3, 4, 5, 1, 9, 10]; // if suma array > nRows * nColumns evitar ese ultimo barco colocado
let barcosPorColocar = Array.from(barcosDisponibles);
let celdasRojas = [];
let nRows = 10;
let nColumns = 10; //console.log(Math.abs(nColumns).toString().length);
let dragging = false;
let barcos = [];
let grabbed_td;
let grabbed_ship;
let grabbed_ship_copia;
let selectedCells = [];
let ghostShip = [];
let blueCells = [];
let clicked_ship = [];
window.onload = iniciar;
function iniciar() {
    document.addEventListener("contextmenu", event => event.preventDefault());
    let popup = document.getElementById("popup");
    popup.addEventListener("click", crearContenidoPopup);
}

function crearContenidoPopup() {
    //barcosPorColocar = barcos; // bug aunque ponga esto si pones todos los barcos y clikeas fuera del popup y lo abres de vuelta no se reinicia
    let table = createTable(nRows, nColumns);
    let menu = document.getElementById("menu");
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
    if (dragging) {
        dragging = false;
        //barcos.splice(barcos.indexOf(grabbed_ship), 1);
        barcos.push(grabbed_ship);
        newShip = Array.from(grabbed_ship);
        /*
        let makeLightBlue = [];
        for (let i = 0; i < grabbed_ship.length; i++) {
            if (newShip[i].style.backgroundColor == "rgb(0, 181, 255)") {
                makeLightBlue.push(newShip[i]);
            }
        }*/
        //console.log(grabbed_ship);
        /*
        if (newShip.length == 0) {
            grabbed_td.style.backgroundColor = "blue";
        } else {*/
            setTimeout(placingShip, 0, 0); // for now leave it like this
        //}*/
        /*
        for (let i = 0; i < makeLightBlue.length; i++) {
            makeLightBlue[i].style.backgroundColor == "rgb(0, 181, 255)";
        }*/
    } else if ((!colocandoCeldas && seleccionando)/* || dragging*/) {
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
            toggleBorder(barcos[barcos.length - 1], false);
            setTimeout(placingShip, 50, 75);
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

function fixShip(ship) {
    let fixedShip = [];
    ship = ship.slice(0, ship.length - celdasRojas.length);
    if (ship.length != 1 && (parseInt(ship[0].id.slice(1)) > parseInt(ship[1].id.slice(1)) || ship[0].id[0] > ship[1].id[0])) {
        if (isShipVertical(ship)) {
            for (let i = 0; i < ship.length; i++) {
                fixedShip.unshift(ship[i]);
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                fixedShip.unshift(ship[i]);
            }
        }
        return fixedShip;
    }
    return ship;
}

function toggleBorder(ship, putBorders) {
    for (let i = 1; i < ship.length; i++) {
        if (isShipVertical(ship)) {
            if (putBorders) {
                ship[i - 1].style.borderBottom = "1px inset grey";
                ship[i].style.borderTop = "1px inset grey";
            } else {
                ship[i - 1].style.borderBottom = "none";
                ship[i].style.borderTop = "none";
            }
        } else {
            if (putBorders) {
                ship[i - 1].style.borderRight = "1px inset grey";
                ship[i].style.borderLeft = "1px inset grey";
            } else {
                ship[i - 1].style.borderRight = "none";
                ship[i].style.borderLeft = "none";
            }
        }
    }
}

function placingShip(delay) {
    if (newShip.length > 0) {
        if (newShip[0].style.backgroundColor != "red") {
            newShip[0].style.backgroundColor = "blue";
        } else {
            newShip[0].style.backgroundColor = colorDefault;
        }//newShip[0].classList.add("grab"); // grab or move esta divertido quiza futura funcion
        newShip.shift();
        setTimeout(placingShip, delay, delay);
    } else {
        colocandoCeldas = false;
    }
}

function isShipVertical(ship) {
    return ship.length > 1 && ship[0].id[0] < ship[1].id[0];
}

function toggleSelectShip(ship) {
    for (let i = 0; i < ship.length; i++) {
        if (ship[i].style.backgroundColor == "rgb(0, 181, 255)") {
            ship[i].style.backgroundColor = "blue";
        } else if (ship[i].style.backgroundColor == "red") {
            ship[i].style.backgroundColor = "rgb(0, 181, 255)";
        } else if (ship[i].style.backgroundColor != colorSelected) {
            ship[i].style.backgroundColor = colorSelected;
        } else {
            ship[i].style.backgroundColor = colorDefault;
        }
    }
}

function rotateShip(ship, td_position) {
    rotatedShip = [];
    for (let i = 0; i < ship.length; i++) {

    }
}

function getTD(row, column) {
    return document.getElementById(xyToCoordinates(row, column, false));
}

function get_td_from(td, row, column) { // ESTO ESTA MAL SI ES MAS DE 10 MIRAR DESPUES O CON getTD not sure where the problem is
    //get_td_from(getTD(0, 0), 9, 11)
    // no corrige bien esto si se pasa eso es el problema
    // empiezo a dudar si hay error
    let td_coords = getCoords(td);
    td_coords[0] = td_coords[0] + row;
    if (td_coords[0] < 0) {
        td_coords[0] = 0;
    } else if (td_coords[0] >= nRows) {
        td_coords[0] = nRows - 1;
    }
    td_coords[1] = td_coords[1] + column;
    if (td_coords[1] < 0) {
        td_coords[1] = 0;
    } else if (td_coords[1] >= nColumns) {
        td_coords[1] = nColumns - 1;
    }
    return getTD(td_coords[0], td_coords[1]);
}

function seleccionandoCeldas() {
    if (this.style.backgroundColor == "blue") {
        if (event.shiftKey) {
            clicked_ship = getGrabbedShip(this);
            toggleBorder(clicked_ship, true);
            toggleSelectShip(clicked_ship);
            toggleSelectShip(clicked_ship);
            barcosPorColocar.push(clicked_ship.length);
            barcos.splice(barcos.indexOf(clicked_ship), 1);
        } else {//addClassSiblings(this, "grabbing");
            dragging = true;
            grabbed_td = this;
            grabbed_ship = getGrabbedShip(grabbed_td);
            barcos.splice(barcos.indexOf(grabbed_ship), 1);
            grabbed_ship_copia = Array.from(grabbed_ship);
            toggleSelectShip(grabbed_ship);

        }
    } else if (!colocandoCeldas && barcosPorColocar.length != 0 && !dragging && !event.shiftKey) {
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

function tilesOverrided(ship) {
    blueCells = [];
    for (let i = 0; i < ship.length; i++) {
        if (ship[i].style.backgroundColor == "blue") {
            blueCells.push(ship[i]);
        }
    }
    console.log(blueCells);
}

function celdaSeleccionada() {
    if (dragging) {
        newShip = [];
        toggleBorder(grabbed_ship, true);//toggleRedAlert(grabbed_ship);
        toggleSelectShip(grabbed_ship);
        updateGrabbed_td(grabbed_ship_copia, getPositionTD(grabbed_ship_copia, grabbed_td), this);
        let id1;
        let id2;
        let this_td_coords = getCoords(this);
        if (isShipVertical(grabbed_ship_copia)) {
            id1 = document.getElementById(numberToLetter(this_td_coords[0] + 1 - getPositionTD(grabbed_ship_copia, grabbed_td)) + this.id.slice(1));
            id2 = document.getElementById(numberToLetter(this_td_coords[0] + 1 - getPositionTD(grabbed_ship_copia, grabbed_td) + grabbed_ship.length - 1) + this.id.slice(1));
        } else {
            id1 = document.getElementById(this.id[0] + (this_td_coords[1] + 1 - getPositionTD(grabbed_ship_copia, grabbed_td)));
            id2 = document.getElementById(this.id[0] + (this_td_coords[1] + 1 - getPositionTD(grabbed_ship_copia, grabbed_td) + grabbed_ship.length - 1));
        }
        //newShip.push(id1);
        console.log(id1);
        drawLine(getCoords(id1), getCoords(id2), isShipVertical(grabbed_ship_copia));
        grabbed_ship = Array.from(newShip);
        if (id1.style.backgroundColor == "blue") {
            id1.style.backgroundColor = "red"; // o "red"; algo asi esta ocurriendo el bug // "rgb(0, 181, 255)"
        }
        toggleBorder(grabbed_ship, false);//toggleRedAlert(grabbed_ship); // mira las posiciones y pone los border en rojo si algun barco esta sobre otro barco
        toggleSelectShip(grabbed_ship);
    } else if (seleccionando && !colocandoCeldas) {
        removeCyanCells();
        calculateLine(this);
    }
}

function numberToLetter(num) {
    return String.fromCharCode(64 + num);;
}

function updateGrabbed_td(ship, td_position, this_td) {
    let this_td_coords = getCoords(this_td);
    let num = 1;
    let nSize = nColumns;
    if (isShipVertical(ship)) {
        num = 0;
        nSize = nRows;
    }
    if (this_td_coords[num] - td_position < 0) {
        grabbed_td = ship[this_td_coords[num]];
    }
    if (this_td_coords[num] + ship.length - td_position > nSize) {
        grabbed_td = ship[ship.length - nSize + this_td_coords[num]];
    }
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
    //newShip.push(clicked_td);
    newShip = drawLine(getCoords(clicked_td), getCoords(last_td), isShipVertical(fixShip([clicked_td, last_td])));
    for (let i = 0; i < ship.length; i++) {
        if (newShip[i].style.backgroundColor != colorSelected) {
            newShip[i].style.backgroundColor = "cyan";
        }
    }
    for (let i = 0; i < celdasRojas.length; i++) {
        celdasRojas[i].style.backgroundColor = "red";
    }
}

function getCoords(td) {
    return [parseInt(td.id[0].charCodeAt(0) - 65), parseInt(td.id.slice(1) - 1)];
}

function drawLine(td_coords_1, td_coords_2, boolean) {
    //let newShip = []; // quiero que en el futuro newShip no sea una variable global
    newShip.push(document.getElementById(xyToCoordinates(td_coords_1[0], td_coords_1[1], false)));
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
                newShip.push(actual_td);
            } else if (actual_td.style.backgroundColor == "blue" && dragging) {
                actual_td.style.backgroundColor = "red";
                newShip.push(actual_td);
            } else {
                break;
            }
            celdasRojas.push(actual_td);
            if (newShip.length == barcosPorColocar[barcosPorColocar.indexOf(newShip.length)] || dragging) {
                celdasRojas = [];
            }
        }
    }
    return newShip;
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
Tambien hacer algo que si un barco.lenght > que nRows y nColumns eliminar barco de array barcosPorColocar
no se elimina de barcos porque quiza cambia el nRows o nColumns despues
*/

/*
y tambien la dificultad de a AI con un desplegable
el desplegable marca el % de random de hacer el mejor movimiento
el mejor movimiento siempre sera la posicion donde poniendo todas las posiciones de barcos hay mas probabilidad
*/

/*
Okay sigue estando algo raro el tema cuando un ship pasa por encima de otro ship mientras lo arrastro
*/

/*
Quiza toggleBorder necesita una variable llamada override
y de ahi miramos si overrideamos el borde que este en ese momento
YO PENSE QUE LO HABIA ARREGLADO
*/