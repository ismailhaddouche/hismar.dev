/**
 * ANIMACIÓN ABOUT - Retrato Interactivo Flotante
 * Partículas orbitales neon y explosión al clic.
 * Usa CharacterBase para el personaje compartido.
 */
window.animations_face_animation_js = {
    init(container) {
        let destroyCurrent = null;
        let resetTimer = null;

        const masterCleanup = () => {
            if (resetTimer) {
                clearInterval(resetTimer);
                resetTimer = null;
            }
            if (destroyCurrent) {
                destroyCurrent();
                destroyCurrent = null;
            }
        };

        const restart = () => {
            if (destroyCurrent) {
                destroyCurrent();
            }
            destroyCurrent = createFaceAnimationInstance(container);
            container._cleanup = masterCleanup;
        };

        restart();
        resetTimer = setInterval(restart, 10000);
    }
};

function createFaceAnimationInstance(container) {
    // Gaming state → while the pointer stays idle, the avatar sigue apretando los botones.
    let isGaming = true;
    let lastCursor = null;
    let lastInteractionTs = null;
    let gamingBlend = 1; // 1 = jugando, 0 = siguiendo el cursor
    let tapPulse = { left: 0, right: 0 };
    let tapSide = 'left';
    let tapClock = 0;
    let lastFrameTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    window.CharacterBase.init(container, {
        drawOverCharacter(state) {
            drawConsoleRig(state, gamingBlend, tapPulse);
        },
        onFrame({ mx, my }) {
            const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
            const delta = now - lastFrameTime;
            lastFrameTime = now;

            if (lastCursor) {
                const deltaMove = Math.abs(mx - lastCursor.x) + Math.abs(my - lastCursor.y);
                if (deltaMove > 1.2) {
                    isGaming = false;
                    lastInteractionTs = Date.now();
                } else {
                    const since = lastInteractionTs ? Date.now() - lastInteractionTs : Infinity;
                    if (since >= 1000) {
                        isGaming = true;
                    }
                }
            }
            lastCursor = { x: mx, y: my };
            if (!lastInteractionTs) {
                lastInteractionTs = Date.now();
            }

            const target = isGaming ? 1 : 0;
            gamingBlend += (target - gamingBlend) * 0.08;

            if (isGaming) {
                tapClock += delta;
                if (tapClock >= 400) {
                    tapClock = tapClock % 400;
                    tapSide = tapSide === 'left' ? 'right' : 'left';
                }
            } else {
                tapClock = 0;
            }

            const leftTarget = isGaming && tapSide === 'left' ? 1 : 0;
            const rightTarget = isGaming && tapSide === 'right' ? 1 : 0;
            tapPulse.left += (leftTarget - tapPulse.left) * 0.25;
            tapPulse.right += (rightTarget - tapPulse.right) * 0.25;
        }
    });

    const baseCleanup = container._cleanup;
    return () => {
        if (baseCleanup) {
            baseCleanup();
        }
    };
}

function drawConsoleRig({ ctx, cx, cy, ox, oy, C }, blend = 1, tapPulse = { left: 0, right: 0 }) {
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

    const leftGlow = tapPulse.left * blend;
    const rightGlow = tapPulse.right * blend;

    // Joy-Cons
    ctx.fillStyle = '#ff476c';
    roundedRect(ctx, bodyX, bodyY + 1, 16, switchHeight - 2, 8);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 120, 150, ${0.15 + leftGlow * 0.5})`;
    roundedRect(ctx, bodyX + 2, bodyY + 4, 12, switchHeight - 8, 6);
    ctx.fill();

    ctx.fillStyle = '#24c0ff';
    roundedRect(ctx, bodyX + switchWidth - 16, bodyY + 1, 16, switchHeight - 2, 8);
    ctx.fill();
    ctx.fillStyle = `rgba(100, 210, 255, ${0.15 + rightGlow * 0.5})`;
    roundedRect(ctx, bodyX + switchWidth - 14, bodyY + 4, 12, switchHeight - 8, 6);
    ctx.fill();

    // Buttons (tap flicker)
    ctx.fillStyle = '#1c2333';
    ctx.beginPath(); ctx.arc(bodyX + 6, bodyY + switchHeight / 2, 3 + leftGlow, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(bodyX + switchWidth - 6, bodyY + switchHeight / 2, 3 + rightGlow, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    const leftShoulder = { x: cx + ox - 38, y: torsoY };
    const rightShoulder = { x: cx + ox + 38, y: torsoY };
    const leftHand = {
        x: switchCenterX - 26 + drop * 0.25,
        y: switchCenterY + 8 + drop * 0.6 + leftGlow * 4
    };
    const rightHand = {
        x: switchCenterX + 26 - drop * 0.25,
        y: switchCenterY + 8 + drop * 0.6 + rightGlow * 4
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
