/**
 * ANIMACIÓN PROJECTS - Mismo personaje del About
 * + Pequeñas ventanas de terminal/código flotando detrás
 * + Partículas de símbolos de código ({ } < > / ;)
 * + Glow azul sutil simulando pantalla
 */
window.animations_projects_animation_js = {
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
            mouth: '#5a2e10'
        };

        // Floating code symbols
        const symbols = ['{', '}', '<', '>', '/>', '()', '=>', '[]', '&&', '||', '!=', '++'];
        const codeParticles = Array.from({ length: 14 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.15 - Math.random() * 0.35,
            ch: symbols[Math.floor(Math.random() * symbols.length)],
            op: 0.06 + Math.random() * 0.12,
            sz: 9 + Math.random() * 5
        }));

        // Mini floating windows
        const windows = [
            { x: 12, y: 15, w: 38, h: 26, op: 0.12 },
            { x: 150, y: 22, w: 35, h: 22, op: 0.1 },
            { x: 5, y: 150, w: 32, h: 20, op: 0.08 },
            { x: 160, y: 145, w: 30, h: 24, op: 0.1 }
        ];

        let mx = W / 2, my = H / 2, smx = mx, smy = my;
        let frame = 0, animId = null;
        let tiltX = 0, tiltY = 0, tVx = 0, tVy = 0;
        let blink = false, blinkT = 90 + Math.random() * 80, blinkF = 0;
        let smile = false, smileT = 0;
        let bursts = [];

        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            mx = e.clientX - r.left;
            my = e.clientY - r.top;
        };
        const onClick = () => {
            smile = true; smileT = 100;
            for (let i = 0; i < 12; i++) {
                const a = Math.random() * Math.PI * 2;
                const sp = 1 + Math.random() * 3.5;
                bursts.push({
                    x: W / 2, y: 78, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    life: 1, dec: 0.012 + Math.random() * 0.016,
                    ch: symbols[Math.floor(Math.random() * symbols.length)]
                });
            }
        };

        // ── THEMED EFFECTS ──
        const drawFloatingWindows = () => {
            windows.forEach(w => {
                const bobY = w.y + Math.sin(frame * 0.015 + w.x) * 3;
                ctx.save();
                ctx.globalAlpha = w.op;
                // Window border
                ctx.strokeStyle = C.neon;
                ctx.lineWidth = 0.8;
                ctx.strokeRect(w.x, bobY, w.w, w.h);
                // Title bar
                ctx.fillStyle = C.neon;
                ctx.fillRect(w.x, bobY, w.w, 5);
                // Fake code lines
                const lineColors = ['#39ff1440', '#39ff1425', '#39ff1430'];
                for (let i = 0; i < 3; i++) {
                    const lw = 8 + Math.random() * (w.w - 14);
                    ctx.fillStyle = lineColors[i % 3];
                    ctx.fillRect(w.x + 3, bobY + 8 + i * 5, lw, 2);
                }
                ctx.restore();
            });
        };

        const drawCodeParticles = () => {
            ctx.font = "9px 'Courier New', monospace";
            codeParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.x += Math.sin(frame * 0.008 + p.y * 0.03) * 0.2;
                if (p.y < -15) {
                    p.y = H + 10;
                    p.x = Math.random() * W;
                    p.ch = symbols[Math.floor(Math.random() * symbols.length)];
                }
                if (p.x < -10) p.x = W + 10;
                if (p.x > W + 10) p.x = -10;
                ctx.save();
                ctx.globalAlpha = p.op;
                ctx.fillStyle = C.neon;
                ctx.font = `${p.sz}px 'Courier New', monospace`;
                ctx.fillText(p.ch, p.x, p.y);
                ctx.restore();
            });
        };

        const drawScreenGlow = () => {
            const gx = W / 2 + (smx - W / 2) * 0.15;
            const gy = 70 + (smy - H / 2) * 0.1;
            const gl = ctx.createRadialGradient(gx, gy, 5, gx, gy, 100);
            gl.addColorStop(0, 'rgba(57,255,20,0.04)');
            gl.addColorStop(0.5, 'rgba(57,255,20,0.015)');
            gl.addColorStop(1, 'transparent');
            ctx.fillStyle = gl;
            ctx.fillRect(0, 0, W, H);
        };

        // ── DRAW CHARACTER (identical to About) ──
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

        const drawBursts = () => {
            bursts = bursts.filter(b => b.life > 0);
            bursts.forEach(b => {
                b.x += b.vx; b.y += b.vy;
                b.vy += 0.04; b.vx *= 0.98;
                b.life -= b.dec;
                ctx.save(); ctx.globalAlpha = b.life;
                ctx.fillStyle = C.neon;
                ctx.font = "11px 'Courier New', monospace";
                ctx.fillText(b.ch, b.x, b.y);
                ctx.restore();
            });
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

            drawFloatingWindows(); // Behind
            drawCodeParticles();   // Behind
            drawScreenGlow();
            drawCharacter();
            drawBursts();          // In front

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
