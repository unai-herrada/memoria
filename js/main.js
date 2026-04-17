let numCartas = 16;
if (numCartas % 2 != 0) {
    numCartas--;
}
let numParejasCartas = numCartas / 2;
let cartasMostradas = [];
let parejasEncontradas = 0;
let tiempo;
let ganaste;
let perdiste;
let puntos;
let cartasDesapareciendo;
let ordenDesaparicion;
let msDesaparecer = 250;
window.onload = iniciar;
function iniciar() {
    let guia = document.getElementById("guia");
    guia.style.visibility = "hidden";
    let butStart = document.getElementById("butStart");
    butStart.addEventListener("click", start);
    let butGuia = document.getElementById("butGuia");
    butGuia.addEventListener("click", mostrarGuia);
    let contador = document.getElementById("contador");
    let imagenes = document.getElementById("imagenes");
    let maxCartasPorWidth = Math.floor((window.innerWidth + 4) / 204);
    let generarCartas = '<svg width="' + (maxCartasPorWidth * 204 - 4) + '" height="' + (Math.ceil(numCartas / maxCartasPorWidth) * 350 + Math.floor(numCartas / maxCartasPorWidth) * 4) + '">';
    for (let i = 0; i < numCartas; i++) {
        generarCartas += '<rect id="carta' + i + '" x="' + ((i * 200 + i * 4) - Math.floor(i / maxCartasPorWidth) * (maxCartasPorWidth * 200 + maxCartasPorWidth * 4)) + '" y="' + (Math.floor(i / maxCartasPorWidth) * 350 + Math.floor(i / maxCartasPorWidth) * 4) + '" width="200" height="350" fill="rgb(0, 0, 0)"/>';
    }
    generarCartas += '</svg>';
    imagenes.innerHTML = generarCartas;
}

function start() {
    tiempo = 25;
    puntos = tiempo + 1;
    ganaste = false;
    perdiste = false;
    cartasMostradas = [];
    butStart.style.visibility = "hidden";
    butGuia.style.visibility = "hidden";
    imagenes.style.visibility = "visible";
    guia.style.visibility = "hidden";
    guia.innerHTML = "";
    contador.innerHTML = tiempo;
    setTimeout(tiempoRestante, 0);
    let coloresSelecionados = [];
    for (let i = 0; i < numParejasCartas; i++) {
        let rgb = "rgb(" + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ", " + Math.floor(Math.random() * 256) + ")";
        if (rgb == "rgb(0, 0, 0)") {
            i--;
        } else {
            coloresSelecionados.push(rgb);
            coloresSelecionados.push(rgb);
        }
    }
    for (let i = coloresSelecionados.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [coloresSelecionados[i], coloresSelecionados[j]] = [coloresSelecionados[j], coloresSelecionados[i]];
    }
    for (let i = 0; i < numCartas; i++) {
        let carta = document.getElementById("carta" + i);
        carta.dataset.color = coloresSelecionados[i];
        carta.addEventListener("click", mostrarCarta);
    }
}

function mostrarGuia() {
    butGuia.style.visibility = "hidden";
    let imagenes = document.getElementById("imagenes");
    imagenes.style.visibility = "hidden";
    guia.style.visibility = "visible";
    guia.innerHTML = "<h1>Instrucciones:</h1>\n<h3>Para inciar el juego pulse el botón que esta más arriba.\n<br>Al darle al botón se le podran dar click a las cartas por parejas\n<br>Si encuentras la pareja de una carta se quedaran descubiertas\n<br>Descubre todas las parejas para parar el tiempo y ganar el juego\n<br>Si el tiempo se agota perderás la partida\n<br>Recuerda darle a volver a jugar cuando acabes para iniciar otra partida\n<br>Puedes ganar puntos si encuentras todas las parejas pero también hay una galleta oculta :D</h3>"
}

function mostrarCarta() {
    if (this.getAttribute("fill") != "rgb(0, 0, 0)" && !ganaste && !perdiste) {
       return;
    }
    if (!perdiste && !ganaste) {
        switch(cartasMostradas.length - parejasEncontradas * 2) {
            case 0:
                cartasMostradas.push(this);
                this.setAttribute("fill", this.dataset.color);
                break;
            case 1:
                if (cartasMostradas[cartasMostradas.length - 1].id != this.id) {
                    cartasMostradas.push(this);
                    this.setAttribute("fill", this.dataset.color);
                    if (cartasMostradas[cartasMostradas.length - 2].getAttribute("fill") == cartasMostradas[cartasMostradas.length - 1].getAttribute("fill")) {
                        parejasEncontradas++;
                        if (parejasEncontradas == numParejasCartas) {
                            ganaste = true;
                            setTimeout(juegoFinalizado, 3000);
                        }
                    } else {
                        setTimeout(esconderCartas, 1000);
                    }
                } else {
                    return;
                }
                break;
            default:
                return;
        }
    } else if (!cartasDesapareciendo) {
        if (this.getAttribute("fill") == "rgb(0, 0, 0)") {
            this.setAttribute("fill", this.dataset.color);
        } else {
            this.setAttribute("fill", "rgb(0, 0, 0)");
        }
    }
}

function esconderCartas() {
    cartasMostradas[cartasMostradas.length - 2].setAttribute("fill", "rgb(0, 0, 0)");
    cartasMostradas[cartasMostradas.length - 1].setAttribute("fill", "rgb(0, 0, 0)");
    cartasMostradas.splice(-2, 2);
}

function juegoFinalizado() {
    setTimeout(desaparecerCartas(msDesaparecer), 0);
    setTimeout(reseteandoJuego, msDesaparecer * numCartas + msDesaparecer)
}

function reseteandoJuego() {
    cartasDesapareciendo = false;
    parejasEncontradas = 0;
    butStart.innerHTML = "<h1>Volver a jugar</h1>";
    butStart.style.visibility = "visible";
    butGuia.style.visibility = "visible";
}

function desaparecerCartas() {
    if (!cartasDesapareciendo) {
        cartasDesapareciendo = true;
        ordenDesaparicion = [];
        for (let i = 0; i < numCartas; i++) {
            ordenDesaparicion.push(i);
        }
        for (let i = ordenDesaparicion.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [ordenDesaparicion[i], ordenDesaparicion[j]] = [ordenDesaparicion[j], ordenDesaparicion[i]];
        }
    }
    if (ordenDesaparicion.length > 0) {
        let carta = document.getElementById("carta" + ordenDesaparicion[ordenDesaparicion.length - 1]);
        ordenDesaparicion.splice(-1, 1);
        carta.setAttribute("fill", "rgb(0, 0, 0)");
        setTimeout(desaparecerCartas, msDesaparecer);
    }
}

function tiempoRestante() {
    if (!ganaste) {
        if (tiempo >= 0) {
            contador.innerHTML = tiempo;
            tiempo--;
            puntos--;
        } else {
            contador.innerHTML = "Perdiste, se ha acabado el tiempo.";
            perdiste = true;
            juegoFinalizado();
        }
        if (!perdiste) {
            setTimeout(tiempoRestante, 1000);
        }
    } else {
        if (puntos == 1) {
            contador.innerHTML = "Ganaste, con " + puntos + " punto.";
        } else if (puntos == 0) {
            contador.innerHTML = "Ganaste, pero no conseguiste ningún punto AUN ASI te dejo una galleta 🍪.";
        } else {
            contador.innerHTML = "Ganaste, con " + puntos + " puntos.";
        }   
    }
}