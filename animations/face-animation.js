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

        // Gaming state → while the mouse is idle, the avatar plays. When the mouse moves, it stops.
        let isGaming = true;
        let idleFrames = 0;
        let lastCursor = null;
        let gamingBlend = 1; // 1 = playing console, 0 = tracking cursor attentively

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
            drawOverCharacter(state) {
                drawConsoleRig(state, gamingBlend);
            },
            drawAfter({ ctx, C }) {
                bursts = bursts.filter(b => b.life > 0);
                bursts.forEach(b => {
                    b.x += b.vx; b.y += b.vy; b.vy += 0.06; b.vx *= 0.99; b.life -= b.dec;
                    ctx.save(); ctx.globalAlpha = b.life;
                    ctx.beginPath(); ctx.arc(b.x, b.y, b.sz * b.life, 0, Math.PI * 2);
                    ctx.fillStyle = C.neon; ctx.fill(); ctx.restore();
                });
            },
            onFrame({ mx, my }) {
                if (lastCursor) {
                    const delta = Math.abs(mx - lastCursor.x) + Math.abs(my - lastCursor.y);
                    if (delta > 1.2) {
                        isGaming = false;
                        idleFrames = 0;
                    } else {
                        idleFrames++;
                        if (idleFrames > 120) {
                            isGaming = true;
                        }
                    }
                }
                lastCursor = { mx, my };
                const target = isGaming ? 1 : 0;
                gamingBlend += (target - gamingBlend) * 0.08;
            }
        });
    }
};

function drawConsoleRig({ ctx, cx, cy, ox, oy, C }, blend = 1) {
    const torsoY = cy + oy + 42;
    const drop = (1 - blend) * 32;
    const switchCenterX = cx + ox;
    const switchCenterY = torsoY + 18 + drop * 0.35;
    const switchWidth = 94;
    const switchHeight = 28;

    // Draw the Nintendo Switch style handheld
    ctx.save();
    ctx.globalAlpha = 0.2 + 0.8 * blend;
    const bodyX = switchCenterX - switchWidth / 2;
    const bodyY = switchCenterY - switchHeight / 2;
    roundedRect(ctx, bodyX, bodyY, switchWidth, switchHeight, 12);
    ctx.fillStyle = '#0f141f';
    ctx.fill();

    // Screen
    ctx.fillStyle = '#111826';
    roundedRect(ctx, bodyX + 10, bodyY + 5, switchWidth - 20, switchHeight - 10, 6);
    ctx.fill();

    // Joy-Cons
    ctx.fillStyle = '#ff476c';
    roundedRect(ctx, bodyX, bodyY + 1, 16, switchHeight - 2, 8);
    ctx.fill();
    ctx.fillStyle = '#24c0ff';
    roundedRect(ctx, bodyX + switchWidth - 16, bodyY + 1, 16, switchHeight - 2, 8);
    ctx.fill();

    // Buttons
    ctx.fillStyle = '#1c2333';
    ctx.beginPath(); ctx.arc(bodyX + 6, bodyY + switchHeight / 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(bodyX + switchWidth - 6, bodyY + switchHeight / 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    const leftShoulder = { x: cx + ox - 38, y: torsoY };
    const rightShoulder = { x: cx + ox + 38, y: torsoY };
    const leftHand = {
        x: switchCenterX - 26 + drop * 0.25,
        y: switchCenterY + 8 + drop * 0.6
    };
    const rightHand = {
        x: switchCenterX + 26 - drop * 0.25,
        y: switchCenterY + 8 + drop * 0.6
    };
    const leftElbow = {
        x: leftShoulder.x - 18 - drop * 0.2,
        y: torsoY + 28 + drop * 0.5
    };
    const rightElbow = {
        x: rightShoulder.x + 18 + drop * 0.2,
        y: torsoY + 28 + drop * 0.5
    };

    drawArm(ctx, C, leftShoulder, leftElbow, leftHand, blend);
    drawArm(ctx, C, rightShoulder, rightElbow, rightHand, blend);
}

function drawArm(ctx, C, shoulder, elbow, hand, blend) {
    ctx.save();
    ctx.strokeStyle = C.skin;
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.55 + 0.45 * blend;
    ctx.beginPath();
    ctx.moveTo(shoulder.x, shoulder.y);
    ctx.quadraticCurveTo(elbow.x, elbow.y, hand.x, hand.y);
    ctx.stroke();

    // Hand
    ctx.fillStyle = C.skin;
    ctx.beginPath();
    ctx.ellipse(hand.x, hand.y, 7, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
