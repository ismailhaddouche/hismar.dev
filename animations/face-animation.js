
/**
 * ANIMACIÓN DE CARA PIXELADA - Para comando About
 */
window.animations_face_animation_js = {
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

        let pupilX = 1;
        let pupilY = 1;
        let isBlinking = false;
        let idleTimer;
        let isIdle = false;
        let timeToNextBlink = Math.random() * 200 + 100; // Tiempo aleatorio para el próximo parpadeo
        let blinkDuration = 10; // Duración del parpadeo

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
                        timeToNextBlink = Math.random() * 300 + 200; // Tiempo más largo entre parpadeos
                    }
                } else {
                    timeToNextBlink--;
                    if (timeToNextBlink <= 0) {
                        isBlinking = true;
                        blinkDuration = 5; // Duración corta del parpadeo
                    }
                }
            } else {
                isBlinking = false;
            }

            drawFace();
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
