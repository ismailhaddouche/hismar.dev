/**
 * ANIMACIÓN DE CARA PIXELADA - Para comando About
 */
window.animations_projects_animation_js = {
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
        const pupilColor = '#000000'; // Color de la pupila cambiado a negro
        const eyeBagColor = '#d3b894';
        const eyeBagColorDark = '#b89c74';
        const coffeeColor = '#6f4e37';
        const cupColor = '#ffffff';
        const steamColor = '#cccccc';

        let pupilX = 1;
        let pupilY = 1;
        let isBlinking = false;
        let idleTimer;
        let isIdle = false;
        let timeToNextBlink = Math.random() * 200 + 100;
        let blinkDuration = 10;

        let coffeeState = 'idle';
        let coffeeTimer = 300;
        let coffeeCup = { x: 40, y: 25 };
        let drinkTimer = 0;
        let steamFrame = 0;
        let steamTimer = 10;

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

            // Pelo desaliñado
            drawPixel(7, 5, hairColor);
            drawPixel(8, 1, hairColor);
            drawPixel(15, 1, hairColor);
            drawPixel(25, 1, hairColor);
            drawPixel(32, 6, hairColor);

            // Ojeras exageradas
            for (let x = 0; x < 3; x++) drawPixel(14 + x, 18, eyeBagColor);
            for (let x = 0; x < 3; x++) drawPixel(24 + x, 18, eyeBagColor);
            drawPixel(15, 19, eyeBagColorDark);
            drawPixel(25, 19, eyeBagColorDark);

            // Boca cansada (solo si no está bebiendo)
            if (coffeeState !== 'drinking') {
                for (let x = 17; x < 23; x++) drawPixel(x, 22, pupilColor);
            }

            // Ojos
            if (!isBlinking) {
                // Ojo izquierdo
                for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) drawPixel(14 + x, 15 + y, eyeBackgroundColor);
                drawPixel(14 + pupilX, 15 + pupilY, pupilColor);

                // Ojo derecho
                for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) drawPixel(24 + x, 15 + y, eyeBackgroundColor);
                drawPixel(24 + pupilX, 15 + pupilY, pupilColor);
            }
        };

        const drawCoffeeCup = (x, y) => {
            // Taza más grande
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 4; j++) {
                    drawPixel(x + i, y + j, cupColor);
                }
            }
            // Café
            for (let i = 0; i < 5; i++) {
                drawPixel(x + i, y, coffeeColor);
            }
            // Asa
            drawPixel(x + 5, y + 1, cupColor);
            drawPixel(x + 5, y + 2, cupColor);
        };

        const drawSteam = (x, y) => {
            steamTimer--;
            if (steamTimer <= 0) {
                steamFrame = (steamFrame + 1) % 3;
                steamTimer = 10;
            }

            if (steamFrame === 0) {
                drawPixel(x + 1, y - 1, steamColor);
                drawPixel(x + 3, y - 2, steamColor);
            } else if (steamFrame === 1) {
                drawPixel(x + 2, y - 1, steamColor);
                drawPixel(x + 4, y - 2, steamColor);
            } else {
                drawPixel(x + 1, y - 2, steamColor);
                drawPixel(x + 3, y - 1, steamColor);
            }
        };

        const handleMouseMove = (e) => {
            isIdle = false;
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => { isIdle = true; }, 3000);

            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const eyeCenterX = 15.5 * pixelSize;
            const eyeCenterY = 16.5 * pixelSize;

            const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
            pupilX = Math.round(Math.cos(angle) + 1);
            pupilY = Math.round(Math.sin(angle) + 1);
        };

        const handleKeyPress = () => {
            isIdle = false;
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => { isIdle = true; }, 3000);
        };

        const animate = () => {
            if (isIdle) {
                pupilX = 1;
                pupilY = 1;

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

            // Coffee animation logic
            coffeeTimer--;
            if (coffeeTimer <= 0 && coffeeState === 'idle') {
                coffeeState = 'raising';
            }

            if (coffeeState === 'raising') {
                coffeeCup.x -= 1;
                if (coffeeCup.x <= 22) {
                    coffeeCup.x = 22;
                    coffeeState = 'drinking';
                    drinkTimer = 100;
                }
            } else if (coffeeState === 'drinking') {
                drinkTimer--;
                if (drinkTimer <= 0) {
                    coffeeState = 'lowering';
                }
            } else if (coffeeState === 'lowering') {
                coffeeCup.x += 1;
                if (coffeeCup.x >= 40) {
                    coffeeCup.x = 40;
                    coffeeState = 'idle';
                    coffeeTimer = Math.random() * 500 + 300;
                }
            }

            drawFace();
            if (coffeeState !== 'idle') {
                drawCoffeeCup(coffeeCup.x, coffeeCup.y);
                if (coffeeState === 'drinking') {
                    drawSteam(coffeeCup.x, coffeeCup.y);
                }
            }
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