/**
 * ANIMACIÓN EDUCATION - Birrete de graduación + confeti + fuegos artificiales
 * Usa CharacterBase para el personaje compartido.
 */
window.animations_education_animation_js = {
    init(container) {
        const W = 200, H = 200;
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
        let tasselAngle = 0, tasselVel = 0;

        window.CharacterBase.init(container, {
            extraColors: {
                cap: '#111', capTop: '#1a1a1a',
                tassel: '#39ff14', tasselBright: '#6fff6f'
            },
            onClick({ W, C }) {
                fireworks = [];
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
            },
            drawBefore({ ctx, W, H, frame, mx }) {
                // Glow
                const gl = ctx.createRadialGradient(W / 2, 50, 8, W / 2, 50, 90);
                gl.addColorStop(0, 'rgba(57,255,20,0.04)');
                gl.addColorStop(1, 'transparent');
                ctx.fillStyle = gl;
                ctx.fillRect(0, 0, W, H);
                // Confetti
                const windX = (mx - W / 2) * 0.012;
                confetti.forEach(c => {
                    c.vy += c.gravity;
                    c.vx += windX * 0.008;
                    c.vx *= 0.99;
                    c.x += c.vx;
                    c.y += c.vy;
                    c.rot += c.rotV;
                    if (c.y > H + 10) { c.y = -10 - Math.random() * 30; c.x = Math.random() * W; c.vy = 0.4 + Math.random() * 1; c.vx = (Math.random() - 0.5) * 0.8; }
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
            },
            drawOverCharacter({ ctx, cx, cy, ox, oy, C, frame, mx, W }) {
                // Graduation cap
                const capCx = cx + ox;
                const capCy = cy + oy - 38;
                ctx.beginPath();
                ctx.ellipse(capCx, capCy + 5, 32, 8, 0, 0, Math.PI * 2);
                ctx.fillStyle = C.cap; ctx.fill();
                ctx.fillRect(capCx - 32, capCy - 1, 64, 7);
                ctx.beginPath();
                ctx.moveTo(capCx - 38, capCy);
                ctx.lineTo(capCx, capCy - 12);
                ctx.lineTo(capCx + 38, capCy);
                ctx.lineTo(capCx, capCy + 5);
                ctx.closePath();
                ctx.fillStyle = C.capTop; ctx.fill();
                ctx.strokeStyle = '#333'; ctx.lineWidth = 0.5; ctx.stroke();
                ctx.beginPath(); ctx.arc(capCx, capCy - 3, 3, 0, Math.PI * 2);
                ctx.fillStyle = C.tassel; ctx.fill();

                const anchorX = capCx + 34;
                const anchorY = capCy + 1;
                ctx.beginPath();
                ctx.moveTo(capCx, capCy - 3);
                ctx.lineTo(anchorX, anchorY);
                ctx.strokeStyle = C.tassel; ctx.lineWidth = 1.5; ctx.stroke();

                // Tassel pendulum
                const windX = (mx - W / 2) * 0.003;
                const springF = -tasselAngle * 0.06;
                const dampF = -tasselVel * 0.12;
                tasselVel += springF + dampF + windX * 0.02;
                tasselAngle += tasselVel;
                const tLen = 14;
                const tx = anchorX + Math.sin(tasselAngle) * tLen;
                const ty = anchorY + Math.cos(tasselAngle) * tLen;
                ctx.beginPath();
                ctx.moveTo(anchorX, anchorY);
                ctx.lineTo(tx, ty);
                ctx.strokeStyle = C.tassel; ctx.lineWidth = 1.5; ctx.stroke();
                ctx.beginPath(); ctx.arc(tx, ty, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = C.tassel; ctx.fill();
                for (let i = -2; i <= 2; i++) {
                    ctx.beginPath();
                    ctx.moveTo(tx, ty + 2);
                    ctx.lineTo(tx + i * 1.8, ty + 7 + Math.sin(frame * 0.05 + i) * 1.5);
                    ctx.strokeStyle = C.tasselBright; ctx.lineWidth = 0.8; ctx.stroke();
                }
            },
            drawAfter({ ctx }) {
                fireworks = fireworks.filter(f => f.life > 0);
                fireworks.forEach(f => {
                    f.x += f.vx; f.y += f.vy;
                    f.vy += 0.05; f.vx *= 0.98;
                    f.life -= f.dec;
                    if (f.life <= 0) return;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, f.life);
                    ctx.beginPath();
                    ctx.arc(f.x, f.y, Math.max(0, f.sz * f.life), 0, Math.PI * 2);
                    ctx.fillStyle = f.color; ctx.fill();
                    ctx.restore();
                });
            }
        });
    }
};
