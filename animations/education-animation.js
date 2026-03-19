/**
 * ANIMACIÓN EDUCATION - Retrato Interactivo Flotante
 * Personaje con gafas enfocado en un libro del cual pasa páginas.
 * Usa CharacterBase para el personaje compartido.
 */
window.animations_education_animation_js = {
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
            destroyCurrent = createEducationAnimationInstance(container);
            container._cleanup = masterCleanup;
        };

        restart();
        resetTimer = setInterval(restart, 10000);
    }
};

function createEducationAnimationInstance(container) {
    let isReading = true;
    let lastCursor = null;
    let lastInteractionTs = null;
    let readingBlend = 1; // 1 = leyendo, 0 = mirando al cursor
    let lastFrameTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    window.CharacterBase.init(container, {
        drawAfter(state) {
            drawStaticGlasses(state);
            drawBookRig(state, readingBlend);
        },
        getMood({ W, H, mx, my }) {
            const pointer = lastCursor || { x: mx ?? W / 2, y: my ?? H / 2 };
            if (isReading) {
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
                        isReading = false;
                        lastInteractionTs = Date.now();
                    } else {
                        const since = lastInteractionTs ? Date.now() - lastInteractionTs : Infinity;
                        if (since >= 1200) {
                            isReading = true;
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

            if (!isReading) {
                const since = lastInteractionTs ? Date.now() - lastInteractionTs : 0;
                if (since >= 1200) {
                    isReading = true;
                }
            }

            const target = isReading ? 1 : 0;
            readingBlend += (target - readingBlend) * 0.08;
        }
    });

    const baseCleanup = container._cleanup;
    return () => {
        if (baseCleanup) {
            baseCleanup();
        }
    };
}

function drawStaticGlasses(state) {
    const { ctx, W, tiltX, tiltY } = state;
    const cx = W ? W / 2 : 100;
    const cy = 80;
    const ox = tiltX * 0.5;
    const oy = tiltY * 0.3;

    // A diferencia de experience, estas gafas siempre están puestas en la cara
    const gy = cy + oy - 5;
    const gcx = cx + ox;
    ctx.save();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Función de ayuda local
    const rRect = (x, y, w, h, r) => {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
    };

    ctx.beginPath(); rRect(gcx - 22, gy - 6, 18, 14, 4); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
    
    ctx.beginPath(); rRect(gcx + 4, gy - 6, 18, 14, 4); ctx.stroke(); ctx.fill();
    
    ctx.beginPath(); ctx.moveTo(gcx - 4, gy); ctx.lineTo(gcx + 4, gy); ctx.stroke();
    
    ctx.beginPath(); ctx.moveTo(gcx - 22, gy - 2); ctx.lineTo(gcx - 28, gy - 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gcx + 22, gy - 2); ctx.lineTo(gcx + 28, gy - 5); ctx.stroke();

    ctx.restore();
}

function drawBookRig(state, blend = 1) {
    const { ctx, W, tiltX, tiltY, frame, C } = state;
    const cx = W ? W / 2 : 100;
    const cy = 80;
    const ox = tiltX * 0.5;
    const oy = tiltY * 0.3;

    const torsoY = cy + oy + 42;
    const drop   = (1 - blend) * 28;
    const pcx    = cx + ox;
    const pcy    = torsoY + 50 + drop * 0.35; // Libro más abajo (más lejos visualmente)

    // Geometría unificada (Trapecio del libro abierto, un pelín más pequeño por la distancia)
    const botW = 85, topW = 70, H = 24;
    const TL = { x: pcx - topW / 2, y: pcy - H / 2 };
    const TR = { x: pcx + topW / 2, y: pcy - H / 2 };
    const BL = { x: pcx - botW / 2, y: pcy + H / 2 };
    const BR = { x: pcx + botW / 2, y: pcy + H / 2 };

    // Función interpoladora de perspectiva horizontal
    const topX = f => TL.x + (TR.x - TL.x) * f;
    const botX = f => BL.x + (BR.x - BL.x) * f;
    const topY = TL.y, botY = BL.y;

    ctx.save();
    ctx.globalAlpha = 0.2 + 0.8 * blend;

    // Tapa dura (Cubierta inferior oscura)
    ctx.fillStyle = '#2b2a33'; 
    ctx.beginPath();
    ctx.moveTo(TL.x - 3, TL.y + 2);
    ctx.lineTo(TR.x + 3, TR.y + 2);
    ctx.lineTo(BR.x + 3, BR.y + 3);
    ctx.lineTo(BL.x - 3, BL.y + 3);
    ctx.fill();

    // Bloque Izquierdo
    ctx.fillStyle = '#f5e0c3'; // Papel viejo/cálido
    ctx.beginPath();
    ctx.moveTo(topX(0), topY); ctx.lineTo(topX(0.5), topY);
    ctx.lineTo(botX(0.5), botY); ctx.lineTo(botX(0), botY); ctx.fill();
    
    // Sombra del interior izquierdo
    ctx.fillStyle = '#e5d0b3';
    ctx.beginPath();
    ctx.moveTo(topX(0.48), topY); ctx.lineTo(topX(0.5), topY);
    ctx.lineTo(botX(0.5), botY); ctx.lineTo(botX(0.48), botY); ctx.fill();

    // Bloque Derecho
    ctx.fillStyle = '#f5e0c3';
    ctx.beginPath();
    ctx.moveTo(topX(0.5), topY); ctx.lineTo(topX(1), topY);
    ctx.lineTo(botX(1), botY); ctx.lineTo(botX(0.5), botY); ctx.fill();

    // Lomo central profundo
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(topX(0.5), topY); ctx.lineTo(botX(0.5), botY); ctx.stroke();

    // ── Animación de pasar hoja (Page Turn) ──
    const turnCycle = 240; // 4 segundos a 60fps
    const t = frame % turnCycle;
    const turnDuration = 40; // frames de la pasada de página
    let turnP = null;
    
    if (t > (turnCycle - turnDuration)) {
        turnP = (t - (turnCycle - turnDuration)) / turnDuration; // 0 to 1
    }

    if (turnP !== null && blend > 0.8) {
        ctx.fillStyle = '#f0d8bd';
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 0.5;

        // La hoja vuela de f=1 (derecha) hacia f=0 (izquierda)
        const fCurve = 1 - turnP; 
        const lift = Math.sin(turnP * Math.PI) * 16; // Elevación parabólica 16px

        // Transposición completa sobre el ancho
        const cornerTopX = topX(fCurve);
        const cornerBotX = botX(fCurve);

        const turnTL = { x: topX(0.5), y: topY };
        const turnBL = { x: botX(0.5), y: botY };
        const turnTR = { x: cornerTopX, y: topY - lift * 0.6 };
        const turnBR = { x: cornerBotX, y: botY - lift };

        ctx.beginPath();
        ctx.moveTo(turnTL.x, turnTL.y);
        ctx.lineTo(turnTR.x, turnTR.y);
        ctx.lineTo(turnBR.x, turnBR.y);
        ctx.lineTo(turnBL.x, turnBL.y);
        ctx.fill();
        ctx.stroke();
    }
    
    // Texturas sutiles (líneas) simulando párrafos
    ctx.strokeStyle = `rgba(0,0,0,${0.1 + 0.1 * blend})`;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    for (let r = 0.15; r < 0.9; r += 0.18) {
        // Párrafo Izquierdo
        let lx1 = topX(0.08) * (1-r) + botX(0.08) * r;
        let lx2 = topX(0.42) * (1-r) + botX(0.42) * r;
        let y = topY * (1-r) + botY * r;
        ctx.beginPath(); ctx.moveTo(lx1, y); ctx.lineTo(lx2, y); ctx.stroke();
        
        // Párrafo Derecho
        let rx1 = topX(0.58) * (1-r) + botX(0.58) * r;
        let rx2 = topX(0.92) * (1-r) + botX(0.92) * r;
        ctx.beginPath(); ctx.moveTo(rx1, y); ctx.lineTo(rx2, y); ctx.stroke();
    }

    ctx.restore();

    // ── Brazos ──
    const leftShoulder  = { x: cx + ox - 32, y: torsoY + 2 };
    const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
    
    const leftHand = { x: BL.x - 4, y: BL.y - 2 };
    let rightHandP = { x: BR.x + 4, y: BR.y - 2 };
    
    // La mano derecha acompaña la hoja físicamente si se está pasando
    if (turnP !== null && blend > 0.8) {
        const fCurve = 1 - turnP;
        const lift = Math.sin(turnP * Math.PI) * 16;
        if (fCurve >= 0.5) {
            // Mitad 1: Mano acompaña desde derecha al centro, subiendo
            rightHandP = { x: botX(fCurve) + 6, y: botY - lift + 2 };
        } else {
            // Mitad 2: Cae devolviendo rápido al costado
            const returnP = Math.max(0, Math.min(1, (turnP - 0.5) * 2)); 
            const midX = botX(0.5) + 6;
            const midY = botY - 16 + 2;
            rightHandP = {
                x: midX + (BR.x + 4 - midX) * returnP,
                y: midY + (BR.y - 2 - midY) * returnP
            };
        }
    }
    
    const rightHand = {
        x: rightHandP.x * blend + (BR.x + 4) * (1-blend),
        y: rightHandP.y * blend + (BR.y - 2) * (1-blend)
    };
    
    // Codos más adelantados para estirar el brazo hasta el libro
    const leftElbow  = { x: leftShoulder.x - 16 - drop*0.15, y: torsoY + 45 + drop*0.45 };
    const rightElbow = { x: rightShoulder.x + 16 + drop*0.15, y: torsoY + 45 + drop*0.45 };

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
