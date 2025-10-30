/**
 * ANIMACIÓN DE CARA PIXELADA CON GORRO DE GRADUACIÓN
 */
window.animations_education_animation_js = {
    init(container) {
        this.createPixelatedFace(container);
    },

    createPixelatedFace(container) {
        const canvas = document.createElement('canvas');
        const size = 200;
        const pixelSize = 5;
        canvas.width = size;
        canvas.height = size;
        container.innerHTML = ''; // Limpiar contenedor
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const faceColor = '#f0d2a4';
        const hairColor = '#4a2a0a';
        const eyeBackgroundColor = '#ffffff';
        const pupilColor = '#000000';
        const capColor = '#000000';
        const tasselColor = '#ffd700';

    let pupilX = 1;
    let pupilY = 1;
    // objetivos de la pupila para suavizar movimiento (floats)
    let pupilTargetX = 1;
    let pupilTargetY = 1;
        let isBlinking = false;
        let idleTimer;
        let isIdle = false;
        let timeToNextBlink = Math.random() * 200 + 100;
        let blinkDuration = 10;

    let eyeTarget = 'mouse'; // 'mouse' o 'cap' (seguiremos usando 'mouse' por defecto)

    // cap.rotation controla la inclinación horizontal del gorro (-2..2)
    // Para esta versión dejamos el gorro estático y ligeramente inclinado
    // subimos la coordenada y del gorro para que la parte superior quede visible
    let cap = { x: 18, y: 2, rotation: -0.6 };

        const drawPixel = (x, y, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        };

        const drawFace = () => {
            ctx.clearRect(0, 0, size, size);

            // Pelo y barba
            for (let y = 2; y < 8; y++) for (let x = 8; x < 32; x++) drawPixel(x, y, hairColor);
            for (let y = 25; y < 32; y++) for (let x = 10; x < 30; x++) drawPixel(x, y, hairColor);
            for (let y = 20; y < 25; y++) {
                for (let x = 8; x < 12; x++) drawPixel(x, y, hairColor);
                for (let x = 28; x < 32; x++) drawPixel(x, y, hairColor);
            }
            for (let y = 8; y < 25; y++) for (let x = 10; x < 30; x++) drawPixel(x, y, faceColor);

            // Sonrisa
            for (let x = 16; x < 24; x++) drawPixel(x, 22, pupilColor);
            drawPixel(15, 21, pupilColor);
            drawPixel(24, 21, pupilColor);


            // Ojos
            if (!isBlinking) {
                // Ojo izquierdo
                for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) drawPixel(14 + x, 15 + y, eyeBackgroundColor);
                drawPixel(14 + Math.round(pupilX), 15 + Math.round(pupilY), pupilColor);

                // Ojo derecho
                for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) drawPixel(24 + x, 15 + y, eyeBackgroundColor);
                drawPixel(24 + Math.round(pupilX), 15 + Math.round(pupilY), pupilColor);
            }
        };

    const drawCap = (x, y, rotation = 0) => {
            // Dibujamos el gorro aplicando un pequeño sesgado horizontal por fila
            // rotation: entero -2..2 (negativo = inclina a la izquierda)
            // Para poder dibujar un contorno blanco, primero recopilamos las
            // coordenadas de los píxeles del gorro en un Set, dibujamos el
            // contorno y después rellenamos.
            const pixels = new Set();

            // Parte superior (plana)
            for (let j = -1; j < 1; j++) {
                for (let i = -6; i < 7; i++) {
                    const rowOffset = Math.round((j + 1) * rotation * 0.6);
                    const px = x + i + rowOffset;
                    const py = y + j;
                    pixels.add(px + ',' + py);
                }
            }
            // Cuerpo del gorro (más bajo, aplicamos más sesgo)
            for (let j = 1; j < 4; j++) {
                for (let i = -3; i < 4; i++) {
                    const rowOffset = Math.round(j * rotation * 0.9);
                    const px = x + i + rowOffset;
                    const py = y + j;
                    pixels.add(px + ',' + py);
                }
            }

            // Borla (añadimos a pixels para que el contorno la incluya)
            const tassel1 = [x + 6 + Math.round(rotation * 0.6), y + 1];
            const tassel2 = [x + 7 + Math.round(rotation * 0.8), y + 2];
            const tassel3 = [x + 7 + Math.round(rotation * 0.8), y + 3];
            pixels.add(tassel1[0] + ',' + tassel1[1]);
            pixels.add(tassel2[0] + ',' + tassel2[1]);
            pixels.add(tassel3[0] + ',' + tassel3[1]);

            // Dibujar contorno blanco donde haya píxel de gorro y vecino vacío
            // (pase único para contorno más fino)
            for (const key of pixels) {
                const [px, py] = key.split(',').map(Number);
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const nx = px + dx;
                        const ny = py + dy;
                        const nkey = nx + ',' + ny;
                        if (!pixels.has(nkey)) {
                            // no es parte del gorro: dibujamos contorno blanco
                            drawPixel(nx, ny, '#ffffff');
                        }
                    }
                }
            }

            // Rellenar gorro en color principal (sobre el contorno)
            for (const key of pixels) {
                const [px, py] = key.split(',').map(Number);
                // si coincide con la borla, la dibujaremos después en color tassel
                if ((px === tassel1[0] && py === tassel1[1]) || (px === tassel2[0] && py === tassel2[1]) || (px === tassel3[0] && py === tassel3[1])) continue;
                drawPixel(px, py, capColor);
            }

            // Dibujar borla encima
            drawPixel(tassel1[0], tassel1[1], tasselColor);
            drawPixel(tassel2[0], tassel2[1], tasselColor);
            drawPixel(tassel3[0], tassel3[1], tasselColor);
        }

        const handleMouseMove = (e) => {
            if (eyeTarget !== 'mouse') return;
            isIdle = false;
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => { isIdle = true; }, 3000);

            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const eyeCenterX = 15.5 * pixelSize;
            const eyeCenterY = 16.5 * pixelSize;

            const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
            // Calculamos objetivos de pupila en float para interpolar después
            pupilTargetX = (Math.cos(angle) + 1);
            pupilTargetY = (Math.sin(angle) + 1);
        };

        const handleKeyPress = () => {
            isIdle = false;
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => { isIdle = true; }, 3000);
        };

        const animate = () => {
            if (isIdle) {
                pupilTargetX = 1;
                pupilTargetY = 1;

                if (isBlinking) {
                    blinkDuration--;
                    if (blinkDuration <= 0) {
                        isBlinking = false;
                        timeToNextBlink = Math.random() * 300 + 200;
                    }
                } else {
                    timeToNextBlink--;
                    if (timeToNextBlink <= 0) {
                        isBlinking = true;
                        blinkDuration = 5;
                    }
                }
            } else {
                isBlinking = false;
            }

            // Suavizar movimiento de pupilas interpolando hacia el target
            pupilX += (pupilTargetX - pupilX) * 0.22;
            pupilY += (pupilTargetY - pupilY) * 0.22;


            // Gorra estática: no animamos la inclinación. Mantener rotación fija.

            drawFace();
            drawCap(cap.x, cap.y, cap.rotation);
            requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyPress);
        idleTimer = setTimeout(() => { isIdle = true; }, 3000);

        animate();

        // Limpieza
        container._cleanup = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyPress);
            clearTimeout(idleTimer);
        };
    }
};
