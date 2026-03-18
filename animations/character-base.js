/**
 * CHARACTER BASE - Módulo compartido para todas las animaciones
 * Contiene: setup de canvas, paleta de colores, física de spring,
 * mouse tracking, drawCharacter(), blink/smile, animation loop y cleanup.
 *
 * Cada animación solo necesita definir sus efectos únicos (background, overlays, etc.)
 */
window.CharacterBase = {

    /**
     * Crea una instancia de animación con el personaje base.
     * @param {HTMLElement} container - Contenedor DOM donde insertar el canvas
     * @param {Object} opts - Opciones de personalización
     * @param {Object} [opts.extraColors] - Colores adicionales para mezclar con la paleta base
     * @param {Function} [opts.drawBefore] - Dibuja efectos detrás del personaje (recibe {ctx, W, H, frame, smx, smy, mx, my, C})
     * @param {Function} [opts.drawAfter] - Dibuja efectos delante del personaje (recibe {ctx, W, H, frame, smx, smy, mx, my, C})
     * @param {Function} [opts.drawOverCharacter] - Dibuja sobre el personaje (gorros, gafas, corbatas) (recibe {ctx, cx, cy, ox, oy, C, frame, smx, smy, mx, my, W, H})
     * @param {Function} [opts.onClick] - Callback adicional al hacer clic (recibe {W, H, C, frame})
     * @param {Function} [opts.onFrame] - Callback cada frame para actualizar estado propio (recibe {frame, mx, my, smx, smy, W, H})
     * @returns {void}
     */
    init(container, opts = {}) {
        const canvas = document.createElement('canvas');
        const W = 200, H = 200;
        canvas.width = W;
        canvas.height = H;
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', 'Animación interactiva del personaje');
        container.innerHTML = '';
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const C = Object.assign({
            bg: '#151a22',
            skin: '#c8906a', skinSh: '#a0683e', skinHi: '#daa07a',
            hair: '#111', hairDk: '#060606',
            beard: '#0a0a0a',
            eyeW: '#f0ede5', iris: '#1a0e05', pupil: '#050303',
            neon: '#39ff14', neonDk: '#1b8c0b',
            shirt: '#2c3e50', shirtDk: '#1a252f',
            mouth: '#5a2e10'
        }, opts.extraColors || {});

        let mx = W / 2, my = H / 2, smx = mx, smy = my;
        let frame = 0, animId = null;
        let tiltX = 0, tiltY = 0, tVx = 0, tVy = 0;
        let blink = false, blinkT = 90 + Math.random() * 80, blinkF = 0;
        let smile = false, smileT = 0;

        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            mx = e.clientX - r.left;
            my = e.clientY - r.top;
        };
        const onTouch = (e) => {
            if (e.touches.length > 0) {
                const r = canvas.getBoundingClientRect();
                mx = e.touches[0].clientX - r.left;
                my = e.touches[0].clientY - r.top;
            }
        };
        const onClick = () => {
            smile = true; smileT = 100;
            if (opts.onClick) {
                opts.onClick({ W, H, C, frame });
            }
        };

        // ── DRAW CHARACTER ──
        const drawCharacter = (mood = {}) => {
            const cx = W / 2, cy = 80;
            const ox = tiltX * 0.5, oy = tiltY * 0.3;
            const focus = Math.min(Math.max(mood.focus || 0, 0), 1);
            const gaze = mood.gaze || { x: smx, y: smy };
            const browLift = typeof mood.browLift === 'number' ? mood.browLift : focus * 3 - 1.5;
            const sweatLevel = Math.max(0, Math.min(1, mood.sweat || 0));

            // Glow aura
            const gl = ctx.createRadialGradient(cx, cy - 5, 10, cx, cy - 5, 90);
            gl.addColorStop(0, 'rgba(57,255,20,0.07)');
            gl.addColorStop(1, 'transparent');
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, W, H);

            // Neck
            ctx.fillStyle = C.skinSh;
            ctx.fillRect(cx + ox - 9, cy + oy + 32, 18, 16);
            // Shoulders / shirt
            ctx.beginPath();
            ctx.moveTo(cx + ox - 52, H + 5);
            ctx.quadraticCurveTo(cx + ox - 28, cy + 43, cx + ox - 8, cy + 43);
            ctx.lineTo(cx + ox + 8, cy + 43);
            ctx.quadraticCurveTo(cx + ox + 28, cy + 43, cx + ox + 52, H + 5);
            ctx.fillStyle = C.shirt; ctx.fill();
            // Collar
            ctx.beginPath();
            ctx.moveTo(cx + ox - 10, cy + oy + 40);
            ctx.lineTo(cx + ox, cy + oy + 48);
            ctx.lineTo(cx + ox + 10, cy + oy + 40);
            ctx.fillStyle = C.shirtDk; ctx.fill();

            // Head shadow
            ctx.beginPath();
            ctx.ellipse(cx + ox + 2, cy + oy + 3, 34, 40, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
            // Head
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy, 33, 39, 0, 0, Math.PI * 2);
            ctx.fillStyle = C.skin; ctx.fill();
            // Head shading
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy, 33, 39, 0, 0, Math.PI * 2);
            const sg = ctx.createLinearGradient(cx + ox - 33, 0, cx + ox + 33, 0);
            sg.addColorStop(0, 'rgba(160,104,62,0.35)');
            sg.addColorStop(0.3, 'transparent');
            sg.addColorStop(0.7, 'transparent');
            sg.addColorStop(1, 'rgba(160,104,62,0.35)');
            ctx.fillStyle = sg; ctx.fill();

            // Ears
            ctx.beginPath(); ctx.ellipse(cx + ox - 33, cy + oy - 2, 5, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = C.skinSh; ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + ox + 33, cy + oy - 2, 5, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = C.skinSh; ctx.fill();

            // Beard
            ctx.beginPath();
            ctx.moveTo(cx + ox - 27, cy + oy + 10);
            ctx.quadraticCurveTo(cx + ox - 30, cy + oy + 27, cx + ox - 12, cy + oy + 36);
            ctx.quadraticCurveTo(cx + ox, cy + oy + 40, cx + ox + 12, cy + oy + 36);
            ctx.quadraticCurveTo(cx + ox + 30, cy + oy + 27, cx + ox + 27, cy + oy + 10);
            ctx.fillStyle = C.beard; ctx.fill();
            // Mustache
            ctx.beginPath();
            ctx.ellipse(cx + ox - 7, cy + oy + 13, 9, 3.5, 0.12, 0, Math.PI);
            ctx.fillStyle = C.hairDk; ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + ox + 7, cy + oy + 13, 9, 3.5, -0.12, 0, Math.PI);
            ctx.fillStyle = C.hairDk; ctx.fill();

            // Side hair
            ctx.beginPath(); ctx.ellipse(cx + ox - 32, cy + oy - 10, 7, 18, 0.15, 0, Math.PI * 2);
            ctx.fillStyle = C.hairDk; ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + ox + 32, cy + oy - 10, 7, 18, -0.15, 0, Math.PI * 2);
            ctx.fillStyle = C.hairDk; ctx.fill();
            // Top hair
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy - 27, 36, 20, 0, Math.PI, 0);
            ctx.fillStyle = C.hair; ctx.fill();
            // Curls
            [[-19, -43, 10], [-6, -47, 12], [8, -45, 10], [19, -41, 9]].forEach(([dx, dy, r]) => {
                ctx.beginPath(); ctx.arc(cx + ox + dx, cy + oy + dy, r, 0, Math.PI * 2);
                ctx.fillStyle = C.hair; ctx.fill();
            });
            ctx.beginPath(); ctx.arc(cx + ox - 8, cy + oy - 44, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#1a1a1a'; ctx.fill();

            // Hook for drawing over character (caps, ties, glasses)
            if (opts.drawOverCharacter) {
                opts.drawOverCharacter({ ctx, cx, cy, ox, oy, C, frame, smx, smy, mx, my, W, H, tiltX, tiltY });
            }

            // Eyes
            const lex = cx + ox - 12, rex = cx + ox + 12, ey = cy + oy - 5;
            const dx = gaze.x - cx, dy = gaze.y - cy;
            const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const px = (dx / d) * 4, py = (dy / d) * 3;
            const eyeOpen = Math.max(2.2, 5.5 - focus * 2.7);

            if (!blink) {
                ctx.beginPath(); ctx.ellipse(lex, ey, 7.5, eyeOpen, 0, 0, Math.PI * 2);
                ctx.fillStyle = C.eyeW; ctx.fill();
                ctx.beginPath(); ctx.ellipse(rex, ey, 7.5, eyeOpen, 0, 0, Math.PI * 2);
                ctx.fillStyle = C.eyeW; ctx.fill();
                ctx.beginPath(); ctx.arc(lex + px, ey + py * 0.5, 3.8, 0, Math.PI * 2);
                ctx.fillStyle = C.iris; ctx.fill();
                ctx.beginPath(); ctx.arc(rex + px, ey + py * 0.5, 3.8, 0, Math.PI * 2);
                ctx.fillStyle = C.iris; ctx.fill();
                ctx.beginPath(); ctx.arc(lex + px, ey + py * 0.5, 2, 0, Math.PI * 2);
                ctx.fillStyle = C.pupil; ctx.fill();
                ctx.beginPath(); ctx.arc(rex + px, ey + py * 0.5, 2, 0, Math.PI * 2);
                ctx.fillStyle = C.pupil; ctx.fill();
                ctx.beginPath(); ctx.arc(lex + px + 2, ey + py * 0.5 - 1.5, 1.3, 0, Math.PI * 2);
                ctx.fillStyle = '#fff'; ctx.fill();
                ctx.beginPath(); ctx.arc(rex + px + 2, ey + py * 0.5 - 1.5, 1.3, 0, Math.PI * 2);
                ctx.fillStyle = '#fff'; ctx.fill();
            } else {
                ctx.strokeStyle = C.hairDk; ctx.lineWidth = 2; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(lex - 6, ey); ctx.lineTo(lex + 6, ey); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(rex - 6, ey); ctx.lineTo(rex + 6, ey); ctx.stroke();
            }
            // Eyebrows
            ctx.strokeStyle = C.hairDk; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(lex - 8, ey - 10 + browLift); ctx.quadraticCurveTo(lex, ey - 14 - browLift * 0.2, lex + 8, ey - 10 + browLift); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rex - 8, ey - 10 + browLift); ctx.quadraticCurveTo(rex, ey - 14 - browLift * 0.2, rex + 8, ey - 10 + browLift); ctx.stroke();

            if (sweatLevel > 0.05) {
                ctx.save();
                ctx.globalAlpha = 0.25 + sweatLevel * 0.35;
                ctx.fillStyle = 'rgba(120, 200, 255, 0.9)';
                const dropX = cx + ox + 20;
                const dropY = cy + oy - 6;
                ctx.beginPath();
                ctx.moveTo(dropX, dropY - 6);
                ctx.quadraticCurveTo(dropX + 5, dropY, dropX, dropY + 8);
                ctx.quadraticCurveTo(dropX - 5, dropY, dropX, dropY - 6);
                ctx.fill();
                ctx.restore();
            }

            // Nose
            ctx.beginPath();
            ctx.moveTo(cx + ox, cy + oy + 1);
            ctx.lineTo(cx + ox - 3.5, cy + oy + 9);
            ctx.quadraticCurveTo(cx + ox, cy + oy + 11, cx + ox + 3.5, cy + oy + 9);
            ctx.fillStyle = C.skinSh; ctx.fill();

            // Mouth
            const focusedMouth = focus > 0.35;
            if (smile && !focusedMouth) {
                ctx.beginPath();
                ctx.moveTo(cx + ox - 9, cy + oy + 18);
                ctx.quadraticCurveTo(cx + ox, cy + oy + 27, cx + ox + 9, cy + oy + 18);
                ctx.quadraticCurveTo(cx + ox, cy + oy + 21, cx + ox - 9, cy + oy + 18);
                ctx.fillStyle = C.mouth; ctx.fill();
                ctx.beginPath();
                ctx.moveTo(cx + ox - 6, cy + oy + 19);
                ctx.quadraticCurveTo(cx + ox, cy + oy + 23, cx + ox + 6, cy + oy + 19);
                ctx.lineTo(cx + ox + 6, cy + oy + 20);
                ctx.quadraticCurveTo(cx + ox, cy + oy + 21, cx + ox - 6, cy + oy + 20);
                ctx.fillStyle = '#fff'; ctx.fill();
            } else if (focusedMouth) {
                ctx.beginPath();
                ctx.moveTo(cx + ox - 10, cy + oy + 19);
                ctx.quadraticCurveTo(cx + ox, cy + oy + 16, cx + ox + 10, cy + oy + 19);
                ctx.strokeStyle = C.mouth;
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(cx + ox - 7, cy + oy + 19);
                ctx.quadraticCurveTo(cx + ox, cy + oy + 23, cx + ox + 7, cy + oy + 19);
                ctx.strokeStyle = C.mouth; ctx.lineWidth = 1.5; ctx.stroke();
            }
        };

        // ── ANIMATION LOOP ──
        const animate = () => {
            frame++;
            ctx.fillStyle = C.bg;
            ctx.fillRect(0, 0, W, H);

            smx += (mx - smx) * 0.07;
            smy += (my - smy) * 0.07;
            tVx = (tVx + ((smx - W / 2) * 0.04 - tiltX) * 0.06) * 0.87;
            tVy = (tVy + ((smy - H / 2) * 0.03 - tiltY) * 0.06) * 0.87;
            tiltX += tVx; tiltY += tVy;

            blinkT--;
            if (blinkT <= 0) { blink = true; blinkF++; if (blinkF > 5) { blink = false; blinkF = 0; blinkT = 70 + Math.random() * 110; if (Math.random() > 0.7) blinkT = 12; } }
            if (smile) { smileT--; if (smileT <= 0) smile = false; }

            if (opts.onFrame) {
                opts.onFrame({ frame, mx, my, smx, smy, W, H });
            }

            const mood = opts.getMood ? (opts.getMood({ frame, mx, my, smx, smy, W, H, tiltX, tiltY }) || {}) : {};
            const state = { ctx, W, H, frame, smx, smy, mx, my, C, mood, tiltX, tiltY };

            if (opts.drawBefore) opts.drawBefore(state);
            drawCharacter(mood);
            if (opts.drawAfter) opts.drawAfter(state);

            animId = requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', onMove);
        canvas.addEventListener('touchmove', onTouch, { passive: true });
        canvas.addEventListener('click', onClick);
        animId = requestAnimationFrame(animate);

        container._cleanup = () => {
            if (animId) cancelAnimationFrame(animId);
            document.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('touchmove', onTouch);
            canvas.removeEventListener('click', onClick);
        };
    }
};
