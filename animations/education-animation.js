/**
 * ANIMACIÓN EDUCATION - Mismo personaje del About
 * + Birrete de graduación encima de la cabeza
 * + Borla con péndulo físico (sigue ratón)
 * + Confeti cayendo con gravedad y viento (ratón = viento)
 * + Clic = ráfaga de confeti dorado
 */
window.animations_education_animation_js = {
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
            cap: '#111', capTop: '#1a1a1a',
            tassel: '#39ff14', tasselBright: '#6fff6f'
        };

        // Confetti particles
        const confetti = Array.from({ length: 35 }, () => ({
            x: Math.random() * W,
            y: Math.random() * -H,
            vx: (Math.random() - 0.5) * 0.8,
            vy: 0.4 + Math.random() * 1.2,
            w: 3 + Math.random() * 4,
            h: 2 + Math.random() * 3,
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.08,
            color: ['#ff3366', '#33ccff', '#ffdd33', '#ff9933', '#66ff66', '#cc66ff', '#39ff14'][Math.floor(Math.random() * 7)],
            gravity: 0.015 + Math.random() * 0.015
        }));

        let fireworks = [];
        let mx = W / 2, my = H / 2, smx = mx, smy = my;
        let frame = 0, animId = null;
        let tiltX = 0, tiltY = 0, tVx = 0, tVy = 0;
        let blink = false, blinkT = 90 + Math.random() * 80, blinkF = 0;
        let smile = false, smileT = 0;

        // Tassel pendulum
        let tasselAngle = 0, tasselVel = 0;

        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            mx = e.clientX - r.left;
            my = e.clientY - r.top;
        };
        const onClick = () => {
            smile = true; smileT = 100;

            // Limpiar los fuegos artificiales anteriores para evitar colapsos por acumulación
            fireworks = [];

            // Gold firework burst
            for (let i = 0; i < 30; i++) {
                const a = Math.random() * Math.PI * 2;
                const sp = 1.5 + Math.random() * 4;
                fireworks.push({
                    x: W / 2, y: 40, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    life: 1, dec: 0.012 + Math.random() * 0.016,
                    sz: 2 + Math.random() * 3,
                    color: Math.random() > 0.3 ? C.neon : C.neonDk
                });
            }
        };

        // ── THEMED EFFECTS ──
        const drawConfetti = () => {
            const windX = (mx - W / 2) * 0.012;
            confetti.forEach(c => {
                c.vy += c.gravity;
                c.vx += windX * 0.008;
                c.vx *= 0.99;
                c.x += c.vx;
                c.y += c.vy;
                c.rot += c.rotV;

                if (c.y > H + 10) {
                    c.y = -10 - Math.random() * 30;
                    c.x = Math.random() * W;
                    c.vy = 0.4 + Math.random() * 1;
                    c.vx = (Math.random() - 0.5) * 0.8;
                }
                if (c.x < -10) c.x = W + 10;
                if (c.x > W + 10) c.x = -10;

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate(c.rot);
                ctx.fillStyle = c.color;
                const w3d = c.w * Math.abs(Math.cos(c.rot + frame * 0.02));
                ctx.fillRect(-w3d / 2, -c.h / 2, Math.max(w3d, 1), c.h);
                ctx.restore();
            });
        };

        const drawFireworks = () => {
            fireworks = fireworks.filter(f => f.life > 0);
            fireworks.forEach(f => {
                f.x += f.vx; f.y += f.vy;
                f.vy += 0.05; f.vx *= 0.98;
                f.life -= f.dec;
                if (f.life <= 0) return; // Prevent negative values crashing the canvas
                ctx.save();
                ctx.globalAlpha = Math.max(0, f.life);
                ctx.beginPath();
                ctx.arc(f.x, f.y, Math.max(0, f.sz * f.life), 0, Math.PI * 2);
                ctx.fillStyle = f.color; ctx.fill();
                ctx.restore();
            });
        };

        const drawGlow = () => {
            const gl = ctx.createRadialGradient(W / 2, 50, 8, W / 2, 50, 90);
            gl.addColorStop(0, 'rgba(57,255,20,0.04)');
            gl.addColorStop(1, 'transparent');
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, W, H);
        };

        // ── DRAW CHARACTER (identical to About) + GRADUATION CAP on top ──
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

            // ── GRADUATION CAP (on top of hair) ──
            const capCx = cx + ox;
            const capCy = cy + oy - 38;
            // Cap base
            ctx.beginPath();
            ctx.ellipse(capCx, capCy + 5, 32, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = C.cap; ctx.fill();
            ctx.fillRect(capCx - 32, capCy - 1, 64, 7);
            // Mortarboard top
            ctx.beginPath();
            ctx.moveTo(capCx - 38, capCy);
            ctx.lineTo(capCx, capCy - 12);
            ctx.lineTo(capCx + 38, capCy);
            ctx.lineTo(capCx, capCy + 5);
            ctx.closePath();
            ctx.fillStyle = C.capTop; ctx.fill();
            ctx.strokeStyle = '#333'; ctx.lineWidth = 0.5; ctx.stroke();
            // Button
            ctx.beginPath(); ctx.arc(capCx, capCy - 3, 3, 0, Math.PI * 2);
            ctx.fillStyle = C.tassel; ctx.fill();

            // Tassel string running across the top to the right side
            const anchorX = capCx + 34;
            const anchorY = capCy + 1;
            ctx.beginPath();
            ctx.moveTo(capCx, capCy - 3);
            ctx.lineTo(anchorX, anchorY);
            ctx.strokeStyle = C.tassel; ctx.lineWidth = 1.5; ctx.stroke();

            // Tassel with pendulum physics (hanging from the side)
            const windX = (mx - W / 2) * 0.003;
            // Add a small constant bias to make it hang slightly outward
            const springF = -tasselAngle * 0.06;
            const dampF = -tasselVel * 0.12;
            tasselVel += springF + dampF + windX * 0.02;
            tasselAngle += tasselVel;

            const tLen = 14; // Shorter pendulum to stay proportional
            const tx = anchorX + Math.sin(tasselAngle) * tLen;
            const ty = anchorY + Math.cos(tasselAngle) * tLen;
            ctx.beginPath();
            ctx.moveTo(anchorX, anchorY);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = C.tassel; ctx.lineWidth = 1.5; ctx.stroke();

            // Tassel knot
            ctx.beginPath(); ctx.arc(tx, ty, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = C.tassel; ctx.fill();
            // Threads
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.moveTo(tx, ty + 2);
                ctx.lineTo(tx + i * 1.8, ty + 7 + Math.sin(frame * 0.05 + i) * 1.5);
                ctx.strokeStyle = C.tasselBright; ctx.lineWidth = 0.8; ctx.stroke();
            }

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
            drawConfetti();     // Behind character
            drawCharacter();    // Character + cap on top
            drawFireworks();    // In front

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
