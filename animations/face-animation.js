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
        getMood({ W, H, mx, my }) {
            const pointer = lastCursor || { x: mx ?? W / 2, y: my ?? H / 2 };
            if (isGaming) {
                return {
                    focus: 0.85,
                    gaze: { x: W / 2, y: H * 0.62 },
                    sweat: 1
                };
            }
            return {
                focus: 0.08,
                gaze: pointer,
                sweat: 0
            };
        },
        onFrame({ mx, my }) {
            const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
            const delta = now - lastFrameTime;
            lastFrameTime = now;

            if (lastCursor) {
                if (typeof mx === 'number' && typeof my === 'number') {
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
            }
            if (typeof mx === 'number' && typeof my === 'number') {
                lastCursor = { x: mx, y: my };
            }
            if (!lastInteractionTs) {
                lastInteractionTs = Date.now();
            }

            if (!lastCursor) {
                lastCursor = { x: 100, y: 100 };
            }

            if (!isGaming) {
                const since = lastInteractionTs ? Date.now() - lastInteractionTs : 0;
                if (since >= 1000) {
                    isGaming = true;
                }
            }

            const target = isGaming ? 1 : 0;
            gamingBlend += (target - gamingBlend) * 0.08;

            if (isGaming) {
                tapClock += delta;
                if (tapClock >= 200) {
                    tapClock = tapClock % 200;
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
    const drop = (1 - blend) * 28;
    const switchCenterX = cx + ox;
    const switchCenterY = torsoY + 14 + drop * 0.35;
    const switchWidth = 78;
    const switchHeight = 22;

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
    roundedRect(ctx, bodyX + 9, bodyY + 4, switchWidth - 18, switchHeight - 8, 6);
    ctx.fill();

    const leftGlow = tapPulse.left * blend;
    const rightGlow = tapPulse.right * blend;

    // Joy-Cons
    ctx.fillStyle = '#ff476c';
    roundedRect(ctx, bodyX, bodyY + 1, 16, switchHeight - 2, 8);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 120, 150, ${0.15 + leftGlow * 0.5})`;
    roundedRect(ctx, bodyX + 2, bodyY + 3, 11, switchHeight - 6, 6);
    ctx.fill();

    ctx.fillStyle = '#24c0ff';
    roundedRect(ctx, bodyX + switchWidth - 16, bodyY + 1, 16, switchHeight - 2, 8);
    ctx.fill();
    ctx.fillStyle = `rgba(100, 210, 255, ${0.15 + rightGlow * 0.5})`;
    roundedRect(ctx, bodyX + switchWidth - 13, bodyY + 3, 11, switchHeight - 6, 6);
    ctx.fill();

    // Buttons (tap flicker)
    ctx.fillStyle = '#1c2333';
    ctx.beginPath(); ctx.arc(bodyX + 6, bodyY + switchHeight / 2, 3 + leftGlow, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(bodyX + switchWidth - 6, bodyY + switchHeight / 2, 3 + rightGlow, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    const leftShoulder = { x: cx + ox - 32, y: torsoY + 2 };
    const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
    const leftHand = {
        x: switchCenterX - 22 + drop * 0.2,
        y: switchCenterY + 6 + drop * 0.55 + leftGlow * 4
    };
    const rightHand = {
        x: switchCenterX + 22 - drop * 0.2,
        y: switchCenterY + 6 + drop * 0.55 + rightGlow * 4
    };
    const leftElbow = {
        x: leftShoulder.x - 20 - drop * 0.15,
        y: torsoY + 20 + drop * 0.45
    };
    const rightElbow = {
        x: rightShoulder.x + 20 + drop * 0.15,
        y: torsoY + 20 + drop * 0.45
    };

    drawArm(ctx, C, leftShoulder, leftElbow, leftHand, blend);
    drawArm(ctx, C, rightShoulder, rightElbow, rightHand, blend);
}

function drawArm(ctx, C, shoulder, elbow, hand, blend) {
    ctx.save();
    ctx.strokeStyle = C.shirt;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.35 + 0.35 * blend;
    ctx.beginPath();
    ctx.moveTo(shoulder.x, shoulder.y);
    ctx.quadraticCurveTo(shoulder.x + (elbow.x - shoulder.x) * 0.4, shoulder.y + 8, elbow.x, elbow.y);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = C.skin;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.55 + 0.45 * blend;
    ctx.beginPath();
    ctx.moveTo(shoulder.x, shoulder.y + 1);
    ctx.quadraticCurveTo(elbow.x, elbow.y, hand.x, hand.y);
    ctx.stroke();

    ctx.fillStyle = C.skin;
    ctx.beginPath();
    ctx.ellipse(hand.x, hand.y, 6.3, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = C.shirt;
    ctx.globalAlpha = 1;
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
