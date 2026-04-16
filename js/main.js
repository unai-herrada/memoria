let cartas = ["img/amarillo.png", "img/azul.png", "img/celeste.png", "img/gris.png", "img/lima.png", "img/marron.png", "img/morado.png", "img/naranja.png", "img/rojo.png", "img/rosa.png", "img/verde.png"];
let dorso = "img/negro.png";
let numCartas = 4; // lo puse por si lo quiero expandir
if (numCartas % 2 != 0) {
    numCartas--; // Por si pones un numero impar
}
/*
if (numCartas > cartas.length * 2 - 2) { // no hay mas cartas :C y el menos 2 es por lo de abajo
    numCartas = 20; // antes era 22 porque eso serian todas las cartas pero luego vi que quedaba mal con 22 cartas
}
//*/
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
    /*
    for (let i = 0; i < numCartas; i++) {
        let id = "img" + i;
        let imagen = document.getElementById(id);
        console.log(imagen);
        imagen.src = "img/negro.png";
    }
    //*/// esto era lo que use antes de pensar en lo de abajo
    let imagenes = document.getElementById("imagenes");
    let generarImagenes = "";
    for (let i = 0; i < numCartas; i++) {
        generarImagenes += '<img id="img' + i + '" src="' + dorso + '"></img>\n';
        /*
        if (Math.floor(window.innerWidth / 200) % i + 1 == 0) { // le falta que si por ejemplo es 1600px JUSTO eso daria para 8 parejas pero cada carta tiene un margen de x pixeles
            console.log(Math.floor(window.innerWidth / 200) + " i: " + i);
            generarImagenes += '<br>';
        }*/
        /*
        if (i + 1 == numCartas / 2) {
            generarImagenes += '<br>';
        }//*/
    }
    imagenes.innerHTML = generarImagenes;
    //imagenes.innerHTML += '<center><div style="display: flex; justify-content: center;"><div style="width: 200px; height: 350px; background-color: #000000; border: 2px solid white;"></div><div style="width: 200px; height: 350px; background-color: #000000; border: 2px solid white;"></div><div style="width: 200px; height: 350px; background-color: #000000; border: 2px solid white;"></div><div style="width: 200px; height: 350px; background-color: #000000; border: 2px solid white;"></div></div></center>';
    imagenes.innerHTML += '<svg width="404" height="350"><rect x="0" y="0" width="200" height="350" fill="black"/><rect x="204" y="0" width="200" height="350" fill="red"/></svg>';
}// el svg width y height se calculan de ante mano para hacer todo esto con logica pura
// el x se puede hacer asi, i * 200 + 1 * 4, algo asi no lo he testeado
function start() {
    tiempo = 60;
    puntos = tiempo + 1;
    ganaste = false;
    perdiste = false;
    cartasDesapareciendo = false;
    butStart.style.visibility = "hidden";
    butGuia.style.visibility = "hidden";
    imagenes.style.visibility = "visible";
    guia.style.visibility = "hidden";
    guia.innerHTML = "";
    contador.innerHTML = tiempo;
    setTimeout(tiempoRestante, 0);
    let cartasSelecionadas = [];
    for (let i = 0; i < numCartas / 2; i++) {
        let numero = Math.floor(Math.random() * cartas.length);
        if (!cartasSelecionadas.includes(cartas[numero])) {
            cartasSelecionadas.push(cartas[numero]);
            cartasSelecionadas.push(cartas[numero]);
        } else {
            i--;
        }
    }
    for (let i = cartasSelecionadas.length - 1; i > 0; i--) { // Algoritmo Fisher-Yates
        let j = Math.floor(Math.random() * (i + 1));
        [cartasSelecionadas[i], cartasSelecionadas[j]] = [cartasSelecionadas[j], cartasSelecionadas[i]];
    }
    for (let i = 0; i < numCartas; i++) {
        let imagen = document.getElementById("img" + i);
        imagen.alt = cartasSelecionadas[i];
        imagen.addEventListener("click", mostrarCarta);
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
    if (!this.src.includes("negro.png")) {
        return;
    }
    if (!perdiste) {
    switch(cartasMostradas.length - parejasEncontradas * 2) {
            case 0:
                cartasMostradas.push(this);
                this.src = this.alt;
                break;
            case 1:
                if (cartasMostradas[cartasMostradas.length - 1].id != this.id) {
                    cartasMostradas.push(this);
                    this.src = this.alt;
                    if (cartasMostradas[cartasMostradas.length - 2].src == cartasMostradas[cartasMostradas.length - 1].src) {
                        parejasEncontradas++;
                        if (parejasEncontradas == numCartas / 2) {
                            ganaste = true;
                            setTimeout(juegoFinalizado, 3000);
                        }
                    } else {
                        setTimeout(esconderCartas, 3000); // me parece MUCHO 3 segundos, quiza porque lo testeaba con 10-15 segs
                    }
                } else {
                    return;
                }
                break;
            default:
                return;
        }
    }
}

function esconderCartas() {
    cartasMostradas[cartasMostradas.length - 2].src = dorso;
    cartasMostradas[cartasMostradas.length - 1].src = dorso;
    cartasMostradas.splice(-2, 2);
}

function juegoFinalizado() {
    setTimeout(desaparecerCartas(msDesaparecer), 0);
    setTimeout(reseteandoJuego, msDesaparecer * numCartas + msDesaparecer)
}

function reseteandoJuego() {
    cartasMostradas = [];
    parejasEncontradas = 0;
    butStart.innerHTML = "<h1>Volver a jugar</h1>";
    butStart.style.visibility = "visible";
    butGuia.style.visibility = "visible";
}

function desaparecerCartas() {
    if (!cartasDesapareciendo) {
        ordenDesaparicion = [];
        for (let i = 0; i < numCartas; i++) {
            ordenDesaparicion.push(i);
        }
        for (let i = ordenDesaparicion.length - 1; i > 0; i--) { // Algoritmo Fisher-Yates
            let j = Math.floor(Math.random() * (i + 1));
            [ordenDesaparicion[i], ordenDesaparicion[j]] = [ordenDesaparicion[j], ordenDesaparicion[i]];
        }
    }
    cartasDesapareciendo = true;
    if (ordenDesaparicion.length > 0) {
        let imagen = document.getElementById("img" + ordenDesaparicion[ordenDesaparicion.length - 1]);
        ordenDesaparicion.splice(-1, 1);
        imagen.src = dorso;
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