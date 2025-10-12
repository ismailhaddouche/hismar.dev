/**
 * ANIMACIÓN DE CARA PIXELADA CON PALABRAS CAYENDO
 */
window.animations_skills_animation_js = {
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
        const bumpColor = '#ff0000';

        let pupilX = 1;
        let pupilY = 1;
        let isBlinking = false;
        let idleTimer;
        let isIdle = false;
        let timeToNextBlink = Math.random() * 200 + 100;
        let blinkDuration = 10;

        const words = ["push", "var", "print", "<div>", "align", "merge", "null", "CORS", "regex", "z-index", "TypeError"];
        let fallingWords = [];

        let bump = { x: -1, y: -1, timer: 0 };
        let isHit = false;
        let hitTimer = 0;

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

            // Chichón
            if (bump.timer > 0) {
                drawPixel(bump.x, bump.y, bumpColor);
                drawPixel(bump.x + 1, bump.y, bumpColor);
                drawPixel(bump.x, bump.y + 1, bumpColor);
            }

            if (isHit) {
                // Ojos cerrados
                for (let x = 0; x < 3; x++) drawPixel(14 + x, 16, pupilColor);
                for (let x = 0; x < 3; x++) drawPixel(24 + x, 16, pupilColor);

                // Frente arrugada
                for (let x = 0; x < 4; x++) drawPixel(16 + x, 10, pupilColor);
                for (let x = 0; x < 3; x++) drawPixel(22 + x, 11, pupilColor);
            } else if (!isBlinking) {
                // Ojos normales
                for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) drawPixel(14 + x, 15 + y, eyeBackgroundColor);
                drawPixel(14 + pupilX, 15 + pupilY, pupilColor);
                for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) drawPixel(24 + x, 15 + y, eyeBackgroundColor);
                drawPixel(24 + pupilX, 15 + pupilY, pupilColor);
            }
        };

        const createWord = () => {
            const word = {
                text: words[Math.floor(Math.random() * words.length)],
                x: Math.random() * (size - 50) + 25,
                y: -20,
                speed: Math.random() * 0.5 + 0.2
            };
            fallingWords.push(word);
        };

        const drawWords = () => {
            ctx.font = "12px 'Press Start 2P', monospace";
            fallingWords.forEach(word => {
                ctx.fillStyle = '#888888'; // rockColor
                ctx.fillText(word.text, word.x, word.y);
            });
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

            // Animación de las palabras
            if (Math.random() < 0.02 && fallingWords.length < 5) {
                createWord();
            }

            fallingWords.forEach((word, index) => {
                word.y += word.speed;

                // Collision detection with face
                if (word.y > 20 && word.y < 40 && word.x > 40 && word.x < 160) {
                    isHit = true;
                    hitTimer = 50; // Duración del estado "golpeado"
                    bump.x = (word.x / pixelSize) - 2;
                    bump.y = 1;
                    bump.timer = 100; // Duración del chichón
                    fallingWords.splice(index, 1);
                }


                if (word.y > size) {
                    fallingWords.splice(index, 1);
                }
            });


            if (hitTimer > 0) {
                hitTimer--;
            } else {
                isHit = false;
            }

            if (bump.timer > 0) {
                bump.timer--;
            }

            drawFace();
            drawWords();
            requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeyPress);
        idleTimer = setTimeout(() => { isIdle = true; }, 3000);

        animate();

        container._cleanup = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyPress);
            clearTimeout(idleTimer);
        };
    }
};