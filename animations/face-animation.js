/**
 * ANIMACIÓN ABOUT - Retrato Interactivo Flotante
 * Partículas orbitales neon y explosión al clic.
 * Usa CharacterBase para el personaje compartido.
 */
window.animations_face_animation_js = {
    init(container) {
        const orbs = Array.from({ length: 22 }, () => ({
            a: Math.random() * Math.PI * 2,
            r: 58 + Math.random() * 30,
            sp: 0.004 + Math.random() * 0.009,
            sz: 1 + Math.random() * 2.5,
            op: 0.25 + Math.random() * 0.45,
            ph: Math.random() * Math.PI * 2
        }));
        let bursts = [];

        window.CharacterBase.init(container, {
            onClick({ W }) {
                bursts = [];
                for (let i = 0; i < 18; i++) {
                    const a = Math.random() * Math.PI * 2;
                    const sp = 1.5 + Math.random() * 4;
                    bursts.push({
                        x: W / 2, y: 78, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                        life: 1, dec: 0.012 + Math.random() * 0.018, sz: 2 + Math.random() * 3
                    });
                }
            },
            drawBefore({ ctx, W, frame }) {
                orbs.forEach(p => {
                    p.a += p.sp;
                    const br = Math.sin(frame * 0.03 + p.ph) * 6;
                    const px = W / 2 + Math.cos(p.a) * (p.r + br);
                    const py = 75 + Math.sin(p.a) * (p.r * 0.55 + br);
                    const fo = p.op * (0.35 + 0.65 * Math.sin(frame * 0.04 + p.ph));
                    ctx.beginPath(); ctx.arc(px, py, p.sz, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(57,255,20,${fo})`; ctx.fill();
                });
            },
            drawAfter({ ctx, C }) {
                bursts = bursts.filter(b => b.life > 0);
                bursts.forEach(b => {
                    b.x += b.vx; b.y += b.vy; b.vy += 0.06; b.vx *= 0.99; b.life -= b.dec;
                    ctx.save(); ctx.globalAlpha = b.life;
                    ctx.beginPath(); ctx.arc(b.x, b.y, b.sz * b.life, 0, Math.PI * 2);
                    ctx.fillStyle = C.neon; ctx.fill(); ctx.restore();
                });
            }
        });
    }
};
