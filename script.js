// ========================================================
// LÓGICA DEL JUEGO
// ========================================================

const escenario = document.getElementById('escenario');
const jugador = document.getElementById('jugador');
const textoPuntuacion = document.getElementById('puntuacion');

// Variables de estado
let posicionJugador = 180;
let puntuacion = 0;
let balas = [];
let enemigos = [];
let direccionEnemigos = 1; // 1 para derecha, -1 para izquierda
let velocidadEnemigos = 2; // ¡Modificable en futuras ramas!

// 1. Inicializar enemigos
function crearEnemigos() {
    for (let fila = 0; fila < 3; fila++) {
        for (let col = 0; col < 6; col++) {
            const enemigo = document.createElement('div');
            enemigo.classList.add('enemigo');
            // Posicionar en cuadrícula
            enemigo.style.left = (col * 50 + 30) + 'px';
            enemigo.style.top = (fila * 40 + 30) + 'px';
            escenario.appendChild(enemigo);
            enemigos.push(enemigo);
        }
    }
}

// 2. Movimiento del jugador
document.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft' && posicionJugador > 0) {
        posicionJugador -= 15;
    } else if (evento.key === 'ArrowRight' && posicionJugador < 360) { // 400 - 40 de ancho
        posicionJugador += 15;
    } else if (evento.key === ' ') {
        disparar();
    }
    jugador.style.left = posicionJugador + 'px';
});

// 3. Disparar
function disparar() {
    const bala = document.createElement('div');
    bala.classList.add('bala');
    bala.style.left = (posicionJugador + 18) + 'px'; // Centro del jugador
    bala.style.top = '360px'; // Justo encima del jugador
    escenario.appendChild(bala);
    balas.push(bala);
}

// 4. Bucle principal del juego (Se ejecuta cada 30 milisegundos)
function cicloJuego() {
    moverBalas();
    moverEnemigos();
    verificarColisiones();
}

function moverBalas() {
    for (let i = 0; i < balas.length; i++) {
        let bala = balas[i];
        let top = parseInt(bala.style.top);
        
        if (top <= 0) {
            bala.remove();
            balas.splice(i, 1);
        } else {
            bala.style.top = (top - 5) + 'px';
        }
    }
}

function moverEnemigos() {
    let tocarBorde = false;

    // Verificar si algún enemigo toca los bordes
    enemigos.forEach(enemigo => {
        let left = parseInt(enemigo.style.left);
        if (left >= 370 || left <= 0) {
            tocarBorde = true;
        }
    });

    // Cambiar dirección y bajar si tocan el borde
    if (tocarBorde) {
        direccionEnemigos *= -1;
        enemigos.forEach(enemigo => {
            let top = parseInt(enemigo.style.top);
            enemigo.style.top = (top + 20) + 'px';
        });
    }

    // Mover lateralmente
    enemigos.forEach(enemigo => {
        let left = parseInt(enemigo.style.left);
        enemigo.style.left = (left + (velocidadEnemigos * direccionEnemigos)) + 'px';
    });
}

function verificarColisiones() {
    for (let i = 0; i < balas.length; i++) {
        for (let j = 0; j < enemigos.length; j++) {
            let bala = balas[i];
            let enemigo = enemigos[j];

            let rectBala = bala.getBoundingClientRect();
            let rectEnemigo = enemigo.getBoundingClientRect();

            // Lógica simple de colisión de rectángulos
            if (
                rectBala.left < rectEnemigo.right &&
                rectBala.right > rectEnemigo.left &&
                rectBala.top < rectEnemigo.bottom &&
                rectBala.bottom > rectEnemigo.top
            ) {
                // Colisión detectada
                enemigo.remove();
                enemigos.splice(j, 1);
                
                bala.remove();
                balas.splice(i, 1);
                
                puntuacion += 10;
                textoPuntuacion.innerText = puntuacion;
                
                // Salir del bucle interno para evitar errores con los índices
                break; 
            }
        }
    }
}

// Iniciar el juego
crearEnemigos();
setInterval(cicloJuego, 30);