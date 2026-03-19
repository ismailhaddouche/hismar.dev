/**
 * ANIMACIÓN SKILLS - Retrato Interactivo Flotante
 * Personaje bebiendo una taza de café humeante.
 * Usa CharacterBase para el personaje compartido.
 */
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

        restart();
        resetTimer = setInterval(restart, 10000);
    }
};

function createSkillsAnimationInstance(container) {
    let isDrinking = true;
    let lastCursor = null;
    let lastInteractionTs = null;
    let coffeeBlend = 1; // 1 = bebiendo, 0 = mirando al cursor
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
    
    // Ciclo de animación (160 frames a 60fps = ~2.66s)
    const cycle = 160;
    const t = frame % cycle;
    let drinkPhase = 0;
    
    if (t < 35) {
        drinkPhase = t / 35; // subiendo
    } else if (t < 65) {
        drinkPhase = 1; // permanece arriba 0.5s (30 frames)
    } else if (t < 100) {
        drinkPhase = 1 - ((t - 65) / 35); // bajando
    } else {
        drinkPhase = 0; // permanece abajo 1s (60 frames)
    }
    
    // Suavizado polinómico (ease in/out) para movimiento natural
    const smoothPhase = drinkPhase * drinkPhase * (3 - 2 * drinkPhase);
    
    // Alturas de la taza más bajas que antes
    const upY = 40;   // Arriba (bebiendo)
    const downY = 60; // Abajo (esperando)
    
    // Posición interpolada de la taza: fase de beber (blend=1) al regazo (blend=0)
    const mugYTarget = cy + oy + downY - (downY - upY) * smoothPhase;
    const mugYLap = torsoY + 28;     // Posición de reposo (regazo)
    const pcy = mugYLap + drop * 0.35 - (mugYLap - mugYTarget) * blend;  

    ctx.save();
    
    // ── Humo del café (sólo visible si está arriba, se desvanece al bajar) ──
    if (blend > 0.1) {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * blend})`;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        for (let i = -1; i <= 1; i++) {
            const phase = (frame + i * 60) % 200;
            const h = phase * 0.45;
            const sw = Math.sin((frame + i * 30) * 0.04) * 7;
            
            // Si el humo ha subido mucho, se desvanece
            ctx.globalAlpha = Math.max(0, 1 - (h / 90));
            
            ctx.beginPath();
            ctx.moveTo(pcx + i * 8 + sw * 0.2, pcy - 12 - h * 0.2);
            ctx.quadraticCurveTo(pcx + i * 12 + sw, pcy - 12 - h * 0.6, pcx + i * 8 - sw, pcy - 12 - h);
            ctx.stroke();
        }
        ctx.restore();
    }

    ctx.globalAlpha = 0.2 + 0.8 * blend;
    
    // ── Sombra de la taza en el regazo ──
    if (blend < 1) {
        ctx.fillStyle = `rgba(0,0,0,${0.15 * (1 - blend)})`;
        ctx.beginPath();
        ctx.ellipse(pcx, pcy + 14 + drop * 0.2, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // ── Asa de la taza (Derecha) ──
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
    
    // Borde oscurecido lateral (sutil sombreado 2D)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(pcx, pcy + 11, 15, 5, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(pcx + 6, pcy - 12, 10, 30);
    ctx.restore();
    
    // ── Borde superior exterior ──
    ctx.fillStyle = '#b4befe';
    ctx.beginPath();
    ctx.ellipse(pcx, pcy - 12, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // ── Interior de la taza (Café) ──
    ctx.fillStyle = '#3a2012';
    ctx.beginPath();
    ctx.ellipse(pcx, pcy - 11.5, 13, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Brazos ──
    const leftShoulder  = { x: cx + ox - 32, y: torsoY + 2 };
    const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
    
    // Manos sujetando la taza
    const leftHand = { x: pcx - 13, y: pcy + 6 };
    const rightHand = { x: pcx + 19, y: pcy + 2 }; // Sobre el asa
    
    // Codos acompañan el movimiento de la taza
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
