/**
 * ANIMACIÓN PROJECTS - Ventanas flotantes, partículas de código y glow
 * Usa CharacterBase para el personaje compartido.
 */
window.animations_projects_animation_js = {
    init(container) {
        const W = 200, H = 200;
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
        const windows = [
            { x: 12, y: 15, w: 38, h: 26, op: 0.12 },
            { x: 150, y: 22, w: 35, h: 22, op: 0.1 },
            { x: 5, y: 150, w: 32, h: 20, op: 0.08 },
            { x: 160, y: 145, w: 30, h: 24, op: 0.1 }
        ];
        let bursts = [];

        window.CharacterBase.init(container, {
            onClick({ W }) {
                bursts = [];
                for (let i = 0; i < 12; i++) {
                    const a = Math.random() * Math.PI * 2;
                    const sp = 1 + Math.random() * 3.5;
                    bursts.push({
                        x: W / 2, y: 78, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                        life: 1, dec: 0.012 + Math.random() * 0.016,
                        ch: symbols[Math.floor(Math.random() * symbols.length)]
                    });
                }
            },
            drawBefore({ ctx, W, H, frame, smx, smy, C }) {
                // Floating windows
                windows.forEach(w => {
                    const bobY = w.y + Math.sin(frame * 0.015 + w.x) * 3;
                    ctx.save();
                    ctx.globalAlpha = w.op;
                    ctx.strokeStyle = C.neon;
                    ctx.lineWidth = 0.8;
                    ctx.strokeRect(w.x, bobY, w.w, w.h);
                    ctx.fillStyle = C.neon;
                    ctx.fillRect(w.x, bobY, w.w, 5);
                    const lineColors = ['#39ff1440', '#39ff1425', '#39ff1430'];
                    for (let i = 0; i < 3; i++) {
                        const lw = 8 + Math.random() * (w.w - 14);
                        ctx.fillStyle = lineColors[i % 3];
                        ctx.fillRect(w.x + 3, bobY + 8 + i * 5, lw, 2);
                    }
                    ctx.restore();
                });
                // Code particles
                codeParticles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.x += Math.sin(frame * 0.008 + p.y * 0.03) * 0.2;
                    if (p.y < -15) { p.y = H + 10; p.x = Math.random() * W; p.ch = symbols[Math.floor(Math.random() * symbols.length)]; }
                    if (p.x < -10) p.x = W + 10;
                    if (p.x > W + 10) p.x = -10;
                    ctx.save();
                    ctx.globalAlpha = p.op;
                    ctx.fillStyle = C.neon;
                    ctx.font = `${p.sz}px 'Courier New', monospace`;
                    ctx.fillText(p.ch, p.x, p.y);
                    ctx.restore();
                });
                // Screen glow
                const gx = W / 2 + (smx - W / 2) * 0.15;
                const gy = 70 + (smy - H / 2) * 0.1;
                const gl = ctx.createRadialGradient(gx, gy, 5, gx, gy, 100);
                gl.addColorStop(0, 'rgba(57,255,20,0.04)');
                gl.addColorStop(0.5, 'rgba(57,255,20,0.015)');
                gl.addColorStop(1, 'transparent');
                ctx.fillStyle = gl;
                ctx.fillRect(0, 0, W, H);
            },
            drawAfter({ ctx, C }) {
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
            }
        });
    }
};
