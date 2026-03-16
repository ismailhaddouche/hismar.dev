/**
 * ANIMACIÓN EXPERIENCE - Corbata, gafas, matrix rain y flash
 * Usa CharacterBase para el personaje compartido.
 */
window.animations_experience_animation_js = {
    init(container) {
        const W = 200, H = 200;
        const cols = 20;
        const matrixDrops = Array.from({ length: cols }, (_, i) => ({
            x: i * (W / cols),
            y: Math.random() * -H,
            speed: 0.5 + Math.random() * 1.5,
            chars: Array.from({ length: 5 + Math.random() * 8 }, () => String.fromCharCode(48 + Math.round(Math.random())))
        }));
        let flash = 0;

        window.CharacterBase.init(container, {
            extraColors: {
                tie: '#ff3366', tieDk: '#cc0044', matrix: '#0f0'
            },
            onClick() {
                flash = 1;
                matrixDrops.forEach(d => { d.speed = 3 + Math.random() * 4; });
            },
            drawBefore({ ctx, W, H }) {
                // Glow
                const gl = ctx.createRadialGradient(W / 2, 50, 8, W / 2, 50, 90);
                gl.addColorStop(0, 'rgba(57,255,20,0.04)');
                gl.addColorStop(1, 'transparent');
                ctx.fillStyle = gl;
                ctx.fillRect(0, 0, W, H);
                // Matrix rain
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                matrixDrops.forEach(d => {
                    d.y += d.speed;
                    if (d.y > H + d.chars.length * 10) {
                        d.y = Math.random() * -50 - d.chars.length * 10;
                        d.speed = 0.5 + Math.random() * 1.5;
                    }
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
                ctx.textAlign = 'start';
                // Flash
                if (flash > 0) {
                    ctx.fillStyle = 'rgba(57, 255, 20, ' + flash + ')';
                    ctx.fillRect(0, 0, W, H);
                    flash -= 0.05;
                }
            },
            drawOverCharacter({ ctx, cx, cy, ox, oy, C }) {
                // Tie (drawn before head covers it — placed on shirt area)
                ctx.beginPath();
                ctx.moveTo(cx + ox - 4, cy + oy + 45);
                ctx.lineTo(cx + ox + 4, cy + oy + 45);
                ctx.lineTo(cx + ox + 3, cy + oy + 65);
                ctx.lineTo(cx + ox, cy + oy + 69);
                ctx.lineTo(cx + ox - 3, cy + oy + 65);
                ctx.fillStyle = C.tie; ctx.fill();
                ctx.beginPath();
                ctx.moveTo(cx + ox, cy + oy + 45);
                ctx.lineTo(cx + ox + 4, cy + oy + 45);
                ctx.lineTo(cx + ox + 3, cy + oy + 65);
                ctx.lineTo(cx + ox, cy + oy + 69);
                ctx.fillStyle = C.tieDk; ctx.fill();

                // Glasses (over eyes area)
                const lex = cx + ox - 12, rex = cx + ox + 12, ey = cy + oy - 5;
                ctx.strokeStyle = '#222'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(lex - 10, ey - 7, 20, 14, 2); ctx.stroke();
                ctx.beginPath(); ctx.roundRect(rex - 10, ey - 7, 20, 14, 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(lex + 10, ey); ctx.lineTo(rex - 10, ey); ctx.stroke();
            }
        });
    }
};
