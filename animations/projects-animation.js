/**
 * ANIMACIÓN PROJECTS - Retrato Interactivo Flotante
 * Personaje pensando en proyectos técnicos.
 * Usa CharacterBase para el personaje compartido.
 */
window.animations_projects_animation_js = {
    init(container) {
        let destroyCurrent = null;
        let resetTimer = null;

        const masterCleanup = () => {
            if (resetTimer) clearInterval(resetTimer);
            if (destroyCurrent) destroyCurrent();
        };

        const restart = () => {
            if (destroyCurrent) destroyCurrent();
            destroyCurrent = createProjectsAnimationInstance(container);
            container._cleanup = masterCleanup;
        };

        restart();
        resetTimer = setInterval(restart, 10000);
    }
};

function createProjectsAnimationInstance(container) {
    let isThinking = true;
    let wasThinking = true;
    let lastCursor = null;
    let lastInteractionTs = null;
    let thinkingBlend = 1; 
    let lastFrameTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    
    let particles = [];

    window.CharacterBase.init(container, {
        drawAfter(state) {
            drawThinkingRig(state, thinkingBlend, particles);
        },
        getMood({ W, H, mx, my }) {
            const pointer = lastCursor || { x: mx ?? W / 2, y: my ?? H / 2 };
            if (isThinking) {
                return {
                    focus: 0.95,
                    gaze: { x: W / 2 + 35, y: H * 0.4 }, // Mirada pensativa arriba a la derecha
                    sweat: 0
                };
            }
            return {
                focus: 0.08,
                gaze: pointer,
                sweat: 0
            };
        },
        onFrame({ mx, my, W, H }) {
            const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
            lastFrameTime = now;

            if (lastCursor) {
                if (typeof mx === 'number' && typeof my === 'number') {
                    const deltaMove = Math.abs(mx - lastCursor.x) + Math.abs(my - lastCursor.y);
                    if (deltaMove > 1.2) {
                        isThinking = false;
                        lastInteractionTs = Date.now();
                    } else {
                        const since = lastInteractionTs ? Date.now() - lastInteractionTs : Infinity;
                        if (since >= 1200) {
                            isThinking = true;
                        }
                    }
                }
            }
            if (typeof mx === 'number' && typeof my === 'number') {
                lastCursor = { x: mx, y: my };
            }
            if (!lastInteractionTs) lastInteractionTs = Date.now();
            if (!lastCursor) lastCursor = { x: 100, y: 100 };
            if (!isThinking) {
                const since = lastInteractionTs ? Date.now() - lastInteractionTs : 0;
                if (since >= 1200) isThinking = true;
            }

            const target = isThinking ? 1 : 0;
            // Blend rápido para que el pop reaccione al instante
            thinkingBlend += (target - thinkingBlend) * 0.2;

            // Explosión de partículas al salir del pensamiento
            if (wasThinking && !isThinking) {
                const cx = W ? W / 2 : 100;
                const bubbleX = cx + 35;
                const bubbleY = 80 - 48; // Ajustado al nuevo centro del bocadillo
                for (let i = 0; i < 20; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 1.5 + Math.random() * 3.5;
                    particles.push({
                        x: bubbleX, y: bubbleY,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 1.0,
                        decay: 0.03 + Math.random() * 0.04
                    });
                }
            }
            wasThinking = isThinking;

            // Actualizar sistema de partículas
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                if (p.life <= 0) particles.splice(i, 1);
            }
        }
    });

    const baseCleanup = container._cleanup;
    return () => {
        if (baseCleanup) baseCleanup();
    };
}

function drawThinkingRig(state, blend, particles) {
    const { ctx, W, tiltX, tiltY, frame, C } = state;
    const cx = W ? W / 2 : 100;
    const cy = 80;
    const ox = tiltX * 0.5;
    const oy = tiltY * 0.3;

    const torsoY = cy + oy + 42;
    const pcx    = cx + ox;
    const pcy    = cy + oy;

    ctx.save();
    
    // ── Partículas (Explosión Popup) ──
    if (particles.length > 0) {
        ctx.save();
        ctx.lineCap = 'round';
        particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.strokeStyle = '#f8fafc'; // Blanca radiante
            ctx.lineWidth = 1.5 + p.life * 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2); // Efecto rastro o motion blur
            ctx.stroke();
        });
        ctx.restore();
    }

    // ── Bocadillo de Cómic (Nube) y Dibujos Internos ──
    const cloudScale = Math.max(0, blend) * 0.75; // Escala reducida un 25%
    const bubbleX = pcx + 35; // Más cerca de la cara (antes 60)
    const bubbleY = pcy - 48; // Más abajo (antes -65)
    
    if (cloudScale > 0.01) {
        ctx.save();
        ctx.translate(bubbleX, bubbleY);
        
        const floatY = Math.sin(frame * 0.05) * 2; // Ligera flotación continua
        ctx.translate(0, floatY);
        ctx.scale(cloudScale, cloudScale);
        
        // Circulitos conectores (desde el personaje a la nube)
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.arc(-35, 35, 7, 0, Math.PI*2); ctx.fill();
        
        // Cuerpo principal de la nube
        ctx.beginPath();
        ctx.arc(-22, -10, 26, 0, Math.PI*2);
        ctx.arc(15, -18, 30, 0, Math.PI*2);
        ctx.arc(42, 5, 22, 0, Math.PI*2);
        ctx.arc(-32, 15, 18, 0, Math.PI*2);
        ctx.arc(10, 22, 26, 0, Math.PI*2);
        ctx.fill();
        
        ctx.save();
        const r1 = frame * 0.03;
        const r2 = -frame * 0.04;
        
        // Polígono azul que gira
        ctx.save();
        ctx.translate(-15, -5);
        ctx.rotate(r1);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for(let i=0; i<3; i++) {
            const a = i * Math.PI * 2 / 3;
            ctx.lineTo(Math.cos(a)*12, Math.sin(a)*12);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        
        // Ejes/cruz técnica girando al revés
        ctx.save();
        ctx.translate(26, -4);
        ctx.rotate(r2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
        ctx.moveTo(0, -10); ctx.lineTo(0, 10);
        ctx.stroke();
        
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(0,0, 3, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        
        // Símbolo </> de código que palpita
        ctx.save();
        ctx.translate(5, 18);
        const pulse = 1 + Math.sin(frame * 0.1) * 0.15;
        ctx.scale(pulse, pulse);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 15px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('</>', 0, 0);
        ctx.restore();
        
        ctx.restore();
        ctx.restore();
    }
    
    // ── Brazos ──
    const leftShoulder  = { x: cx + ox - 32, y: torsoY + 2 };
    const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
    const drop = 1 - blend;
    
    // Brazo izquierdo: Reposa siempre en el regazo
    const leftHand = { x: pcx - 22, y: torsoY + 48 };
    const leftElbow = { x: leftShoulder.x - 16, y: torsoY + 28 };
    
    // Brazo derecho: Interpolado entre la pose pensativa (barbilla) y el regazo
    // En blend=1 está en la barbilla apoyado (cruzado ligeramente hacia la izquierda de su cara)
    const chinTarget = { x: pcx - 8, y: pcy + 22 }; 
    const lapTarget  = { x: pcx + 22, y: torsoY + 48 };
    
    const rightHand = {
        x: chinTarget.x * blend + lapTarget.x * drop,
        y: chinTarget.y * blend + lapTarget.y * drop
    };
    
    // Codo derecho: pegado al cuerpo cuando piensa, suelto cuando reposa
    const rightElbow = {
        x: (rightShoulder.x + 8) * blend + (rightShoulder.x + 16) * drop,
        y: (torsoY + 35) * blend + (torsoY + 28) * drop
    };

    drawArm(ctx, C, leftShoulder,  leftElbow,  leftHand,  1); // Izquierdo siempre igual visible
    drawArm(ctx, C, rightShoulder, rightElbow, rightHand, 1);
    
    ctx.restore();
}

function drawArm(ctx, C, shoulder, elbow, hand, alpha) {
    ctx.save();
    ctx.strokeStyle = C.skin;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.55 + 0.45 * alpha;
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
