/**
 * ANIMACIÓN SKILLS - Matrix rain de fondo + bursts de símbolos
 * Usa CharacterBase para el personaje compartido.
 */
window.animations_skills_animation_js = {
    init(container) {
        const W = 200, H = 200;
        const cols = 18;
        const drops = Array.from({ length: cols }, (_, i) => ({
            x: i * (W / cols),
            y: Math.random() * -H,
            speed: 0.3 + Math.random() * 1.2,
            chars: Array.from({ length: 4 + Math.random() * 6 }, () => String.fromCharCode(48 + Math.round(Math.random())))
        }));
        let bursts = [];

        window.CharacterBase.init(container, {
            onClick({ W }) {
                bursts = [];
                for (let i = 0; i < 14; i++) {
                    const a = Math.random() * Math.PI * 2;
                    const sp = 1.5 + Math.random() * 3.5;
                    bursts.push({
                        x: W / 2, y: 78, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                        life: 1, dec: 0.013 + Math.random() * 0.015,
                        ch: String.fromCharCode(48 + Math.round(Math.random()))
                    });
                }
            },
            drawBefore({ ctx, W, H, frame }) {
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                drops.forEach(d => {
                    d.y += d.speed;
                    if (d.y > H + d.chars.length * 10) {
                        d.y = Math.random() * -50 - d.chars.length * 10;
                        d.speed = 0.3 + Math.random() * 1.2;
                    }
                    if (Math.random() < 0.04) {
                        d.chars[Math.floor(Math.random() * d.chars.length)] = String.fromCharCode(48 + Math.round(Math.random()));
                    }
                    d.chars.forEach((ch, idx) => {
                        const cy = d.y - idx * 10;
                        if (cy > 0 && cy < H + 10) {
                            ctx.fillStyle = idx === 0 ? '#fff' : (idx < 2 ? '#39ff14' : '#1b8c0b');
                            ctx.globalAlpha = Math.max(0, 1 - (idx / d.chars.length));
                            ctx.fillText(ch, d.x + (W / cols) / 2, cy);
                        }
                    });
                });
                ctx.globalAlpha = 1;
                ctx.textAlign = 'start';
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
