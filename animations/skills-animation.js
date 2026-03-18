/**
 * ANIMACIÓN SKILLS - Estudio concentrado con libro de Java.
 * El personaje sólo levanta la mirada hacia el cursor si detecta movimiento o clic.
 */
window.animations_skills_animation_js = {
    init(container) {
        const W = 200;
        const ATTENTION_MAX = 140;
        let attentionTimer = 0;
        let prevPointer = null;

        const markAttention = () => {
            attentionTimer = ATTENTION_MAX;
        };

        window.CharacterBase.init(container, {
            extraColors: {
                bg: '#07090f',
                shirt: '#1a2433',
                shirtDk: '#121925',
                neon: '#f7c65d',
                neonDk: '#f08c3b'
            },
            onClick() {
                markAttention();
            },
            onFrame({ mx, my }) {
                if (prevPointer) {
                    const dx = mx - prevPointer.x;
                    const dy = my - prevPointer.y;
                    if (Math.abs(dx) > 0.8 || Math.abs(dy) > 0.8) {
                        markAttention();
                    }
                }
                prevPointer = { x: mx, y: my };
                if (attentionTimer > 0) {
                    attentionTimer--;
                }
            },
            drawBefore({ ctx, W, H, frame }) {
                drawStudyBackdrop(ctx, W, H, frame);
            },
            drawAfter(state) {
                const focusBlend = Math.max(0, Math.min(1, attentionTimer / ATTENTION_MAX));
                drawBookScene(state, focusBlend);
            },
            getMood({ smx, smy, W, H }) {
                const focusBlend = Math.max(0, Math.min(1, attentionTimer / ATTENTION_MAX));
                if (focusBlend > 0) {
                    return {
                        focus: 0.65,
                        gaze: { x: smx, y: smy },
                        browLift: -1,
                        browCurve: 6,
                        browFurrow: 0.7
                    };
                }
                return {
                    focus: 0.92,
                    gaze: { x: W / 2, y: 125 },
                    browLift: -3.5,
                    browCurve: 11,
                    browFurrow: 1.4
                };
            }
        });
    }
};

function drawStudyBackdrop(ctx, W, H, frame) {
    ctx.save();
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#05060b');
    gradient.addColorStop(1, '#0f1724');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(247,198,93,0.08)';
    ctx.lineWidth = 1;
    const offset = (frame * 0.7) % 20;
    for (let y = -20; y < H + 20; y += 14) {
        const lineY = y + offset;
        ctx.beginPath();
        ctx.moveTo(24, lineY);
        ctx.lineTo(W - 24, lineY);
        ctx.stroke();
    }

    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.arc(W / 2, 210, 140, 0, Math.PI, true);
    ctx.fillStyle = '#f7c65d';
    ctx.fill();
    ctx.restore();
}

function drawBookScene(state, focusBlend) {
    const { ctx, W, frame, tiltX, tiltY, C } = state;
    const cx = W / 2;
    const cy = 80;
    const ox = tiltX * 0.5;
    const oy = tiltY * 0.3;
    const lookBlend = Math.max(0, Math.min(1, focusBlend));
    const readBlend = 1 - lookBlend;
    const bob = Math.sin(frame / 40) * 1.4 * readBlend;

    const book = {
        w: 92,
        h: 52,
        x: cx + ox - 46,
        y: cy + oy + 48 + bob + lookBlend * 3
    };

    const shouldersY = cy + oy + 56;
    const leftShoulder = { x: cx + ox - 32, y: shouldersY };
    const rightShoulder = { x: cx + ox + 32, y: shouldersY };
    const elbowLift = shouldersY + (book.y - shouldersY) * (0.6 + 0.18 * readBlend);
    const elbowReach = 24 + readBlend * 10;

    drawReadingArm(
        ctx,
        C,
        leftShoulder,
        {
            x: leftShoulder.x - elbowReach,
            y: elbowLift
        },
        {
            x: book.x + 18,
            y: book.y + book.h - 6
        }
    );

    drawReadingArm(
        ctx,
        C,
        rightShoulder,
        {
            x: rightShoulder.x + elbowReach,
            y: elbowLift
        },
        {
            x: book.x + book.w - 18,
            y: book.y + book.h - 6
        }
    );

    drawBook(ctx, book, readBlend);
}

function drawBook(ctx, book, readBlend) {
    ctx.save();
    const { x, y, w, h } = book;
    const spine = x + w / 2;
    const spread = 22;

    // Shadow drop
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(spine, y + h + 6, w * 0.6, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Covers
    const coverGradient = ctx.createLinearGradient(x, y - spread, x, y + h);
    coverGradient.addColorStop(0, '#2a3f60');
    coverGradient.addColorStop(1, '#0c1522');
    ctx.fillStyle = coverGradient;
    ctx.strokeStyle = '#f7c65d';
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    ctx.moveTo(spine, y + h + spread);
    ctx.lineTo(x + 6, y + h - 6);
    ctx.lineTo(x, y + 4);
    ctx.lineTo(spine - 10, y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(spine, y + h + spread);
    ctx.lineTo(x + w - 6, y + h - 6);
    ctx.lineTo(x + w, y + 4);
    ctx.lineTo(spine + 10, y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pages
    ctx.fillStyle = '#f5e4c3';
    ctx.beginPath();
    ctx.moveTo(spine, y + h + spread - 3);
    ctx.lineTo(spine - 10, y + 12);
    ctx.lineTo(spine, y + 2);
    ctx.lineTo(spine + 10, y + 12);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1.2;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(spine + i * 3, y + h + spread - 3);
        ctx.lineTo(spine + i * 4, y + 12);
        ctx.stroke();
    }

    // Spine detail
    ctx.fillStyle = '#f7c65d';
    ctx.fillRect(spine - 6, y + h / 3, 12, 6);
    ctx.fillRect(spine - 6, y + h / 3 + 13, 12, 5);

    // Title badge
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JAVA', spine, y + h / 1.8);

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#fce19a';
    ctx.beginPath();
    ctx.moveTo(x + 10, y + h - 12);
    ctx.lineTo(spine - 8, y + h + spread - 8);
    ctx.quadraticCurveTo(spine - 4, y + h + spread - 2, spine - 12, y + h - 18);
    ctx.lineTo(x + 8, y + h - 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawReadingArm(ctx, C, shoulder, elbow, hand) {
    ctx.save();
    ctx.strokeStyle = C.skin;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(shoulder.x, shoulder.y);
    ctx.quadraticCurveTo(elbow.x, elbow.y, hand.x, hand.y);
    ctx.stroke();

    ctx.fillStyle = C.skin;
    ctx.beginPath();
    ctx.ellipse(hand.x, hand.y, 6, 5.1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = C.shirt;
    ctx.beginPath();
    ctx.arc(shoulder.x, shoulder.y, 6, 0, Math.PI * 2);
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
