/**
 * ANIMACIÓN EXPERIENCE - Mismo personaje del About
 * + Elemento distintivo: Corbata / Identificación y gafas (opcional)
 * + Lluvia Matrix de fondo (0s y 1s) para representar el trabajo IT y DevOps
 * + Clic = Destello Matrix
 */
window.animations_experience_animation_js = {
    init(container) {
        const canvas = document.createElement('canvas');
        const W = 200, H = 200;
        canvas.width = W;
        canvas.height = H;
        container.innerHTML = '';
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const C = {
            bg: '#151a22',
            skin: '#c8906a', skinSh: '#a0683e', skinHi: '#daa07a',
            hair: '#111', hairDk: '#060606',
            beard: '#0a0a0a',
            eyeW: '#f0ede5', iris: '#1a0e05', pupil: '#050303',
            neon: '#39ff14', neonDk: '#1b8c0b',
            shirt: '#2c3e50', shirtDk: '#1a252f',
            mouth: '#5a2e10',
            tie: '#ff3366', tieDk: '#cc0044',
            matrix: '#0f0'
        };

        // Matrix Rain
        const cols = 20;
        const matrixDrops = Array.from({ length: cols }, (_, i) => ({
            x: i * (W / cols),
            y: Math.random() * -H,
            speed: 0.5 + Math.random() * 1.5,
            chars: Array.from({ length: 5 + Math.random() * 8 }, () => String.fromCharCode(48 + Math.round(Math.random())))
        }));

        let mx = W / 2, my = H / 2, smx = mx, smy = my;
        let frame = 0, animId = null;
        let tiltX = 0, tiltY = 0, tVx = 0, tVy = 0;
        let blink = false, blinkT = 90 + Math.random() * 80, blinkF = 0;
        let smile = false, smileT = 0;
        let flash = 0;

        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            mx = e.clientX - r.left;
            my = e.clientY - r.top;
        };
        const onClick = () => {
            smile = true; smileT = 100;
            flash = 1; // Un frame todo verde brillante
            // Alterar los números
            matrixDrops.forEach(d => {
                d.speed = 3 + Math.random() * 4;
            });
        };

        // ── THEMED EFFECTS ──
        const drawMatrix = () => {
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            matrixDrops.forEach(d => {
                d.y += d.speed;
                if (d.y > H + d.chars.length * 10) {
                    d.y = Math.random() * -50 - d.chars.length * 10;
                    d.speed = 0.5 + Math.random() * 1.5;
                }

                // Cambiar un carácter aleatoriamente de vez en cuando
                if (Math.random() < 0.05) {
                    d.chars[Math.floor(Math.random() * d.chars.length)] = String.fromCharCode(48 + Math.round(Math.random()));
                }

                d.chars.forEach((ch, idx) => {
                    const cy = d.y - idx * 10;
                    if (cy > 0 && cy < H + 10) {
                        ctx.fillStyle = idx === 0 ? '#fff' : (idx < 3 ? '#39ff14' : '#1b8c0b');
                        ctx.globalAlpha = Math.max(0, 1 - (idx / d.chars.length));
                        ctx.fillText(ch, d.x + (W / cols) / 2, cy);
                    }
                });
            });
            ctx.globalAlpha = 1;

            if (flash > 0) {
                ctx.fillStyle = 'rgba(57, 255, 20, ' + flash + ')';
                ctx.fillRect(0, 0, W, H);
                flash -= 0.05;
            }
        };

        const drawGlow = () => {
            const gl = ctx.createRadialGradient(W / 2, 50, 8, W / 2, 50, 90);
            gl.addColorStop(0, 'rgba(57,255,20,0.04)');
            gl.addColorStop(1, 'transparent');
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, W, H);
        };

        // ── DRAW CHARACTER ──
        const drawCharacter = () => {
            const cx = W / 2, cy = 80;
            const ox = tiltX * 0.5, oy = tiltY * 0.3;

            // Glow aura
            const gl = ctx.createRadialGradient(cx, cy - 5, 10, cx, cy - 5, 90);
            gl.addColorStop(0, 'rgba(57,255,20,0.07)');
            gl.addColorStop(1, 'transparent');
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, W, H);

            ctx.fillStyle = C.skinSh;
            ctx.fillRect(cx + ox - 9, cy + oy + 32, 18, 16);
            ctx.beginPath();
            ctx.moveTo(cx + ox - 52, H + 5);
            ctx.quadraticCurveTo(cx + ox - 28, cy + 43, cx + ox - 8, cy + 43);
            ctx.lineTo(cx + ox + 8, cy + 43);
            ctx.quadraticCurveTo(cx + ox + 28, cy + 43, cx + ox + 52, H + 5);
            ctx.fillStyle = C.shirt; ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + ox - 10, cy + oy + 40);
            ctx.lineTo(cx + ox, cy + oy + 48);
            ctx.lineTo(cx + ox + 10, cy + oy + 40);
            ctx.fillStyle = C.shirtDk; ctx.fill();

            // Elemento único Experience: Corbata
            ctx.beginPath();
            ctx.moveTo(cx + ox - 4, cy + oy + 45);
            ctx.lineTo(cx + ox + 4, cy + oy + 45);
            ctx.lineTo(cx + ox + 3, cy + oy + 65);
            ctx.lineTo(cx + ox, cy + oy + 69);
            ctx.lineTo(cx + ox - 3, cy + oy + 65);
            ctx.fillStyle = C.tie; ctx.fill();
            // Sombra corbata
            ctx.beginPath();
            ctx.moveTo(cx + ox, cy + oy + 45);
            ctx.lineTo(cx + ox + 4, cy + oy + 45);
            ctx.lineTo(cx + ox + 3, cy + oy + 65);
            ctx.lineTo(cx + ox, cy + oy + 69);
            ctx.fillStyle = C.tieDk; ctx.fill();

            ctx.beginPath();
            ctx.ellipse(cx + ox + 2, cy + oy + 3, 34, 40, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy, 33, 39, 0, 0, Math.PI * 2);
            ctx.fillStyle = C.skin; ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy, 33, 39, 0, 0, Math.PI * 2);
            const sg = ctx.createLinearGradient(cx + ox - 33, 0, cx + ox + 33, 0);
            sg.addColorStop(0, 'rgba(160,104,62,0.35)');
            sg.addColorStop(0.3, 'transparent');
            sg.addColorStop(0.7, 'transparent');
            sg.addColorStop(1, 'rgba(160,104,62,0.35)');
            ctx.fillStyle = sg; ctx.fill();

            ctx.beginPath(); ctx.ellipse(cx + ox - 33, cy + oy - 2, 5, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = C.skinSh; ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + ox + 33, cy + oy - 2, 5, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = C.skinSh; ctx.fill();

            ctx.beginPath();
            ctx.moveTo(cx + ox - 27, cy + oy + 10);
            ctx.quadraticCurveTo(cx + ox - 30, cy + oy + 27, cx + ox - 12, cy + oy + 36);
            ctx.quadraticCurveTo(cx + ox, cy + oy + 40, cx + ox + 12, cy + oy + 36);
            ctx.quadraticCurveTo(cx + ox + 30, cy + oy + 27, cx + ox + 27, cy + oy + 10);
            ctx.fillStyle = C.beard; ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + ox - 7, cy + oy + 13, 9, 3.5, 0.12, 0, Math.PI);
            ctx.fillStyle = C.hairDk; ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + ox + 7, cy + oy + 13, 9, 3.5, -0.12, 0, Math.PI);
            ctx.fillStyle = C.hairDk; ctx.fill();

            ctx.beginPath(); ctx.ellipse(cx + ox - 32, cy + oy - 10, 7, 18, 0.15, 0, Math.PI * 2);
            ctx.fillStyle = C.hairDk; ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx + ox + 32, cy + oy - 10, 7, 18, -0.15, 0, Math.PI * 2);
            ctx.fillStyle = C.hairDk; ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + ox, cy + oy - 27, 36, 20, 0, Math.PI, 0);
            ctx.fillStyle = C.hair; ctx.fill();
            [[-19, -43, 10], [-6, -47, 12], [8, -45, 10], [19, -41, 9]].forEach(([dx, dy, r]) => {
                ctx.beginPath(); ctx.arc(cx + ox + dx, cy + oy + dy, r, 0, Math.PI * 2);
                ctx.fillStyle = C.hair; ctx.fill();
            });
            ctx.beginPath(); ctx.arc(cx + ox - 8, cy + oy - 44, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#1a1a1a'; ctx.fill();

            // Eyes
            const lex = cx + ox - 12, rex = cx + ox + 12, ey = cy + oy - 5;
            const dx = smx - cx, dy = smy - cy;
            const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const px = (dx / d) * 4, py = (dy / d) * 3;

            if (!blink) {
                ctx.beginPath(); ctx.ellipse(lex, ey, 7.5, 5.5, 0, 0, Math.PI * 2);
                ctx.fillStyle = C.eyeW; ctx.fill();
                ctx.beginPath(); ctx.ellipse(rex, ey, 7.5, 5.5, 0, 0, Math.PI * 2);
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

                // Gafas estilo admin/IT sobre los ojos
                ctx.strokeStyle = '#222'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(lex - 10, ey - 7, 20, 14, 2); ctx.stroke();
                ctx.beginPath(); ctx.roundRect(rex - 10, ey - 7, 20, 14, 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(lex + 10, ey); ctx.lineTo(rex - 10, ey); ctx.stroke(); // Puente

            } else {
                ctx.strokeStyle = C.hairDk; ctx.lineWidth = 2; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(lex - 6, ey); ctx.lineTo(lex + 6, ey); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(rex - 6, ey); ctx.lineTo(rex + 6, ey); ctx.stroke();
            }
            ctx.strokeStyle = C.hairDk; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(lex - 8, ey - 10); ctx.quadraticCurveTo(lex, ey - 14, lex + 8, ey - 10); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rex - 8, ey - 10); ctx.quadraticCurveTo(rex, ey - 14, rex + 8, ey - 10); ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx + ox, cy + oy + 1);
            ctx.lineTo(cx + ox - 3.5, cy + oy + 9);
            ctx.quadraticCurveTo(cx + ox, cy + oy + 11, cx + ox + 3.5, cy + oy + 9);
            ctx.fillStyle = C.skinSh; ctx.fill();

            if (smile) {
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

            drawGlow();
            drawMatrix();       // Matrix rain en vez de confeti
            drawCharacter();    // Character

            animId = requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', onMove);
        canvas.addEventListener('click', onClick);
        animId = requestAnimationFrame(animate);

        container._cleanup = () => {
            if (animId) cancelAnimationFrame(animId);
            document.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('click', onClick);
        };
    }
};
