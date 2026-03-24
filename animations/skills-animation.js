window.animations_skills_animation_js = {
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
            destroyCurrent = createSkillsAnimationInstance(container);
            container._cleanup = masterCleanup;
        };

        function createSkillsAnimationInstance(container) {
            let isDrinking = true;
            let lastCursor = null;
            let lastInteractionTs = null;
            let coffeeBlend = 1; // 1 = drinking, 0 = tracking the cursor
            let lastFrameTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());

            window.CharacterBase.init(container, {
                drawAfter(state) {
                    drawCoffeeRig(state, coffeeBlend);
                },
                getMood({ W, H, mx, my }) {
                    const pointer = lastCursor || { x: mx ?? W / 2, y: my ?? H / 2 };
                    if (isDrinking) {
                        return {
                            focus: 0.85,
                            gaze: { x: W / 2, y: H * 0.62 },
                            sweat: 0
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
                                isDrinking = false;
                                lastInteractionTs = Date.now();
                            } else {
                                const since = lastInteractionTs ? Date.now() - lastInteractionTs : Infinity;
                                if (since >= 1200) {
                                    isDrinking = true;
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

                    if (!isDrinking) {
                        const since = lastInteractionTs ? Date.now() - lastInteractionTs : 0;
                        if (since >= 1200) {
                            isDrinking = true;
                        }
                    }

                    const target = isDrinking ? 1 : 0;
                    coffeeBlend += (target - coffeeBlend) * 0.08;
                }
            });

            const baseCleanup = container._cleanup;
            return () => {
                if (baseCleanup) {
                    baseCleanup();
                }
            };
        }

        function drawCoffeeRig(state, blend = 1) {
            const { ctx, W, tiltX, tiltY, frame, C } = state;
            const cx = W ? W / 2 : 100;
            const cy = 80;
            const ox = tiltX * 0.5;
            const oy = tiltY * 0.3;

            const torsoY = cy + oy + 42;
            const drop   = (1 - blend) * 28;
            const pcx    = cx + ox;
            
            // Animation cycle (160 frames at 60fps ≈ 2.66s)
            const cycle = 160;
            const t = frame % cycle;
            let drinkPhase = 0;
            
            if (t < 35) {
                drinkPhase = t / 35; // lifting the cup
            } else if (t < 65) {
                drinkPhase = 1; // stays up for 0.5s (30 frames)
            } else if (t < 100) {
                drinkPhase = 1 - ((t - 65) / 35); // lowering the cup
            } else {
                drinkPhase = 0; // stays down for 1s (60 frames)
            }
            
            // Polynomial easing (smooth in/out) for natural motion
            const smoothPhase = drinkPhase * drinkPhase * (3 - 2 * drinkPhase);
            
            // Lower cup heights than before
            const upY = 40;   // Top position (drinking)
            const downY = 60; // Bottom position (waiting)
            
            // Interpolated mug position: drinking phase (blend=1) to lap (blend=0)
            const mugYTarget = cy + oy + downY - (downY - upY) * smoothPhase;
            const mugYLap = torsoY + 28;     // Resting position (lap)
            const pcy = mugYLap + drop * 0.35 - (mugYLap - mugYTarget) * blend;  

            ctx.save();
            
            // ── Coffee steam (only visible when lifted, fades while dropping) ──
            if (blend > 0.1) {
                ctx.save();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * blend})`;
                ctx.lineWidth = 3.5;
                ctx.lineCap = 'round';
                for (let i = -1; i <= 1; i++) {
                    const phase = (frame + i * 60) % 200;
                    const h = phase * 0.45;
                    const sw = Math.sin((frame + i * 30) * 0.04) * 7;
                    
                    // Fade out if the smoke has risen too much
                    ctx.globalAlpha = Math.max(0, 1 - (h / 90));
                    
                    ctx.beginPath();
                    ctx.moveTo(pcx + i * 8 + sw * 0.2, pcy - 12 - h * 0.2);
                    ctx.quadraticCurveTo(pcx + i * 12 + sw, pcy - 12 - h * 0.6, pcx + i * 8 - sw, pcy - 12 - h);
                    ctx.stroke();
                }
                ctx.restore();
            }

            ctx.globalAlpha = 0.2 + 0.8 * blend;
            
            // ── Cup shadow on the lap ──
            if (blend < 1) {
                ctx.fillStyle = `rgba(0,0,0,${0.15 * (1 - blend)})`;
                ctx.beginPath();
                ctx.ellipse(pcx, pcy + 14 + drop * 0.2, 18, 6, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // ── Cup handle (right side) ──
            ctx.strokeStyle = '#cdd6f4'; // Color de la taza
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(pcx + 14, pcy + 0.5, 10, -Math.PI / 2.5, Math.PI / 2.5);
            ctx.stroke();

            // ── Cuerpo de la taza ──
            // Silhouette lower half
            ctx.fillStyle = '#cdd6f4'; 
            ctx.beginPath();
            ctx.ellipse(pcx, pcy + 11, 15, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Middle rect
            ctx.fillRect(pcx - 15, pcy - 12, 30, 23);
            
            // Darkened side edge (subtle 2D shading)
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(pcx, pcy + 11, 15, 5, 0, 0, Math.PI * 2);
            ctx.clip();
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(pcx + 6, pcy - 12, 10, 30);
            ctx.restore();
            
            // ── Outer top rim ──
            ctx.fillStyle = '#b4befe';
            ctx.beginPath();
            ctx.ellipse(pcx, pcy - 12, 15, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // ── Cup interior (coffee) ──
            ctx.fillStyle = '#3a2012';
            ctx.beginPath();
            ctx.ellipse(pcx, pcy - 11.5, 13, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // ── Arms ──
            const leftShoulder  = { x: cx + ox - 32, y: torsoY + 2 };
            const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
            
            // Hands holding the cup
            const leftHand = { x: pcx - 13, y: pcy + 6 };
            const rightHand = { x: pcx + 19, y: pcy + 2 }; // On top of the handle
            
            // Elbows follow the mug movement
            const armDrop = (mugYLap - pcy) * 0.4;
            const leftElbow  = { x: leftShoulder.x - 16 - drop*0.15, y: torsoY + 28 - armDrop + drop*0.45 };
            const rightElbow = { x: rightShoulder.x + 16 + drop*0.15, y: torsoY + 28 - armDrop + drop*0.45 };

            drawArm(ctx, C, leftShoulder,  leftElbow,  leftHand,  blend);
            drawArm(ctx, C, rightShoulder, rightElbow, rightHand, blend);
            
            ctx.restore();
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

        restart();
        resetTimer = setInterval(restart, 10000);
    }
};
