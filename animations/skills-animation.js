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
        w: 78,
        h: 46,
        x: cx + ox - 39,
        y: cy + oy + 42 + bob + lookBlend * 3
    };

    const shouldersY = cy + oy + 32;
    const leftShoulder = { x: cx + ox - 32, y: shouldersY };
    const rightShoulder = { x: cx + ox + 32, y: shouldersY };
    const elbowLift = shouldersY + (book.y - shouldersY) * (0.55 + 0.15 * readBlend);
    const elbowReach = 18 + readBlend * 8;

    drawReadingArm(
        ctx,
        C,
        leftShoulder,
        {
            x: leftShoulder.x - elbowReach,
            y: elbowLift
        },
        {
            x: book.x + 13,
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
            x: book.x + book.w - 13,
            y: book.y + book.h - 6
        }
    );

    drawBook(ctx, book, readBlend);
}

function drawBook(ctx, book, readBlend) {
    ctx.save();
    const { x, y, w, h } = book;
    const gradient = ctx.createLinearGradient(x, y, x, y + h);
    gradient.addColorStop(0, '#1e2f44');
    gradient.addColorStop(1, '#0f1724');
    ctx.fillStyle = gradient;
    roundedRect(ctx, x, y, w, h, 10);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(247,198,93,0.95)';
    roundedRect(ctx, x, y, w, h, 10);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + 8);
    ctx.lineTo(x + w / 2, y + h - 8);
    ctx.stroke();

    ctx.fillStyle = '#f7c65d';
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JAVA', x + w / 2, y + h / 2 + 2);

    ctx.globalAlpha = 0.18 + readBlend * 0.3;
    ctx.fillStyle = '#fce19a';
    ctx.fillRect(x + 8, y + h - 6, w - 16, 4);
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
