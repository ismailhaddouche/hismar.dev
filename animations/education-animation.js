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
        let isBlinking = false;
        let idleTimer;
        let isIdle = false;
        let timeToNextBlink = Math.random() * 200 + 100;
        let blinkDuration = 10;

        let eyeTarget = 'mouse'; // 'mouse' o 'cap'

        let cap = { x: 18, y: 1, rotation: 0, state: 'onHead', verticalSpeed: 0 };
        let capAnimationTimer = 200; // Time to next animation

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
                drawPixel(14 + pupilX, 15 + pupilY, pupilColor);

                // Ojo derecho
                for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) drawPixel(24 + x, 15 + y, eyeBackgroundColor);
                drawPixel(24 + pupilX, 15 + pupilY, pupilColor);
            }
        };

        const drawCap = (x, y) => {
            // Gorro más grande
            for (let i = -6; i < 7; i++) {
                for (let j = -1; j < 1; j++) {
                    drawPixel(x + i, y + j, capColor);
                }
            }
            for (let i = -3; i < 4; i++) {
                for (let j = 1; j < 4; j++) {
                    drawPixel(x + i, y + j, capColor);
                }
            }

            // Borla
            drawPixel(x + 6, y + 1, tasselColor);
            drawPixel(x + 7, y + 2, tasselColor);
            drawPixel(x + 7, y + 3, tasselColor);
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

            // Cap animation logic
            capAnimationTimer--;
            if (capAnimationTimer <= 0 && cap.state === 'onHead') {
                cap.state = 'lifting';
                cap.verticalSpeed = -0.01;
                eyeTarget = 'cap';
            }

            if (cap.state === 'lifting') {
                cap.y += cap.verticalSpeed;
                if (cap.y < -0.5) { // Peak height
                    cap.state = 'landing';
                    cap.verticalSpeed = 0.01;
                }
            } else if (cap.state === 'landing') {
                cap.y += cap.verticalSpeed;
                if (cap.y >= 1) {
                    cap.y = 1;
                    cap.state = 'onHead';
                    capAnimationTimer = Math.random() * 300 + 200;
                    eyeTarget = 'mouse';
                }
            }

            // Eye tracking logic
            if (eyeTarget === 'cap') {
                const capCenterX = (cap.x + 0.5) * pixelSize;
                const capCenterY = (cap.y + 0.5) * pixelSize;
                const eyeCenterX = 15.5 * pixelSize;
                const eyeCenterY = 16.5 * pixelSize;
                const angle = Math.atan2(capCenterY - eyeCenterY, capCenterX - eyeCenterX);
                pupilX = Math.round(Math.cos(angle) + 1);
                pupilY = Math.round(Math.sin(angle) + 1);
            }


            drawFace();
            drawCap(cap.x, cap.y);
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
