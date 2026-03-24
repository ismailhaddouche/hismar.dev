/**
 * ABOUT ANIMATION - Floating Interactive Portrait
 * Neon orbital particles and a click-triggered burst.
 * Uses CharacterBase for the shared character.
 */
window.animations_about_animation_js = {
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

        function createFaceAnimationInstance(container) {
            // Gaming state → while the pointer stays idle, the avatar keeps pressing the buttons.
            let isGaming = true;
            let lastCursor = null;
            let lastInteractionTs = null;
            let gamingBlend = 1; // 1 = playing, 0 = following the cursor
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
                                if (since >= 1200) {
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
                        if (since >= 1200) {
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
            const drop   = (1 - blend) * 28;
            const pcx    = cx + ox;
            const pcy    = torsoY + 26 + drop * 0.35;

            // ── Unified geometry (same ratio as the book/page) ──
            const botW = 88, topW = 72;   // perspRatio ≈ 0.82
            const H    = 24;

            const TL = { x: pcx - topW / 2, y: pcy - H / 2 };
            const TR = { x: pcx + topW / 2, y: pcy - H / 2 };
            const BL = { x: pcx - botW / 2, y: pcy + H / 2 };
            const BR = { x: pcx + botW / 2, y: pcy + H / 2 };

            // Horizontal lerp: given f∈[0,1], return the corresponding x on top/bottom
            const topX = f => TL.x + (TR.x - TL.x) * f;
            const botX = f => BL.x + (BR.x - BL.x) * f;
            const topY = TL.y, botY = BL.y;

            // Fractions of the total width for each zone
            const jcW = 0.175;  // Joy-Con: 17.5% of the width

            ctx.save();
            ctx.globalAlpha = 0.2 + 0.8 * blend;

            // ── Main body ──
            ctx.fillStyle = '#0f141f';
            ctx.beginPath();
            ctx.moveTo(topX(jcW), topY);
            ctx.lineTo(topX(1 - jcW), topY);
            ctx.lineTo(botX(1 - jcW), botY);
            ctx.lineTo(botX(jcW), botY);
            ctx.closePath();
            ctx.fill();

            // Screen
            const scrPad = 0.04;
            ctx.fillStyle = '#0a1520';
            ctx.beginPath();
            ctx.moveTo(topX(jcW + scrPad), topY + 3);
            ctx.lineTo(topX(1 - jcW - scrPad), topY + 3);
            ctx.lineTo(botX(1 - jcW - scrPad), botY - 3);
            ctx.lineTo(botX(jcW + scrPad), botY - 3);
            ctx.closePath();
            ctx.fill();

            // Screen sheen
            ctx.fillStyle = 'rgba(100,180,255,0.04)';
            ctx.beginPath();
            ctx.moveTo(topX(jcW + scrPad), topY + 3);
            ctx.lineTo(topX(0.5), topY + 3);
            ctx.lineTo(botX(0.5), botY - 3);
            ctx.lineTo(botX(jcW + scrPad), botY - 3);
            ctx.closePath();
            ctx.fill();

            const leftGlow  = tapPulse.left  * blend;
            const rightGlow = tapPulse.right * blend;

            // ── Left Joy-Con (red) ──
            ctx.fillStyle = '#ff476c';
            ctx.beginPath();
            ctx.moveTo(topX(0), topY);
            ctx.lineTo(topX(jcW), topY);
            ctx.lineTo(botX(jcW), botY);
            ctx.lineTo(botX(0), botY);
            ctx.closePath();
            ctx.fill();

            // Left glow
            ctx.fillStyle = `rgba(255,120,150,${0.1 + leftGlow * 0.55})`;
            ctx.beginPath();
            ctx.moveTo(topX(0.01), topY + 2);
            ctx.lineTo(topX(jcW - 0.01), topY + 2);
            ctx.lineTo(botX(jcW - 0.01), botY - 2);
            ctx.lineTo(botX(0.01), botY - 2);
            ctx.closePath();
            ctx.fill();

            // Left analog stick
            ctx.fillStyle = `rgba(30,30,50,${0.6 + leftGlow * 0.4})`;
            ctx.beginPath();
            ctx.arc(
                (topX(jcW * 0.5) + botX(jcW * 0.5)) / 2,
                (topY + botY) / 2,
                4 + leftGlow * 1.5, 0, Math.PI * 2
            );
            ctx.fill();

            // ── Right Joy-Con (blue) ──
            ctx.fillStyle = '#24c0ff';
            ctx.beginPath();
            ctx.moveTo(topX(1 - jcW), topY);
            ctx.lineTo(topX(1), topY);
            ctx.lineTo(botX(1), botY);
            ctx.lineTo(botX(1 - jcW), botY);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = `rgba(100,210,255,${0.1 + rightGlow * 0.55})`;
            ctx.beginPath();
            ctx.moveTo(topX(1 - jcW + 0.01), topY + 2);
            ctx.lineTo(topX(0.99), topY + 2);
            ctx.lineTo(botX(0.99), botY - 2);
            ctx.lineTo(botX(1 - jcW + 0.01), botY - 2);
            ctx.closePath();
            ctx.fill();

            // Right analog stick
            ctx.fillStyle = `rgba(30,30,50,${0.6 + rightGlow * 0.4})`;
            ctx.beginPath();
            ctx.arc(
                (topX(1 - jcW * 0.5) + botX(1 - jcW * 0.5)) / 2,
                (topY + botY) / 2,
                4 + rightGlow * 1.5, 0, Math.PI * 2
            );
            ctx.fill();

            ctx.restore();

            // ── Arms ──
            const leftShoulder  = { x: cx + ox - 32, y: torsoY + 2 };
            const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };

            const leftHand  = { x: BL.x + 6,       y: BL.y - 2 + leftGlow  * 3 };
            const rightHand = { x: BR.x - 6,       y: BR.y - 2 + rightGlow * 3 };
            const leftElbow  = { x: leftShoulder.x  - 18 - drop * 0.15, y: torsoY + 32 + drop * 0.45 };
            const rightElbow = { x: rightShoulder.x + 18 + drop * 0.15, y: torsoY + 32 + drop * 0.45 };

            drawArm(ctx, C, leftShoulder,  leftElbow,  leftHand,  blend);
            drawArm(ctx, C, rightShoulder, rightElbow, rightHand, blend);
        }

        function drawArm(ctx, C, shoulder, elbow, hand, blend) {
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

        restart();
        resetTimer = setInterval(restart, 10000);
    }
};
