import * as CharacterBase from './CharacterBase';
import type { CharacterColors, CharacterState } from './CharacterBase';

export function init(container: HTMLElement): () => void {
  let destroyCurrent: (() => void) | null = null;
  let resetTimer: ReturnType<typeof setInterval> | null = null;

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
    if (destroyCurrent) destroyCurrent();
    destroyCurrent = createSkillsAnimationInstance(container);
  };

  function createSkillsAnimationInstance(container: HTMLElement) {
    let isDrinking = true;
    let lastCursor: { x: number; y: number } | null = null;
    let lastInteractionTs: number | null = null;
    let coffeeBlend = 1;
    let lastFrameTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    void lastFrameTime;

    const cleanup = CharacterBase.init(container, {
      drawAfter(state) {
        drawCoffeeRig(state, coffeeBlend);
      },
      getMood({ W, H, mx, my }) {
        const pointer = lastCursor ?? { x: mx ?? W / 2, y: my ?? H / 2 };
        if (isDrinking) {
          return { focus: 0.85, gaze: { x: W / 2, y: H * 0.62 }, sweat: 0 };
        }
        return { focus: 0.08, gaze: pointer, sweat: 0 };
      },
      onFrame({ mx, my }) {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        void now;
        lastFrameTime = now;

        if (lastCursor && typeof mx === 'number' && typeof my === 'number') {
          const deltaMove = Math.abs(mx - lastCursor.x) + Math.abs(my - lastCursor.y);
          if (deltaMove > 1.2) {
            isDrinking = false;
            lastInteractionTs = Date.now();
          } else {
            const since = lastInteractionTs ? Date.now() - lastInteractionTs : Infinity;
            if (since >= 1200) isDrinking = true;
          }
        }
        if (typeof mx === 'number' && typeof my === 'number') lastCursor = { x: mx, y: my };
        if (!lastInteractionTs) lastInteractionTs = Date.now();
        if (!lastCursor) lastCursor = { x: 100, y: 100 };

        if (!isDrinking) {
          const since = lastInteractionTs ? Date.now() - lastInteractionTs : 0;
          if (since >= 1200) isDrinking = true;
        }

        const target = isDrinking ? 1 : 0;
        coffeeBlend += (target - coffeeBlend) * 0.08;
      },
    });

    return cleanup;
  }

  function drawCoffeeRig(state: CharacterState, blend = 1) {
    const { ctx, W, tiltX, tiltY, frame, C } = state;
    const cx = W ? W / 2 : 100;
    const cy = 80;
    const ox = tiltX * 0.5;
    const oy = tiltY * 0.3;
    const torsoY = cy + oy + 42;
    const drop = (1 - blend) * 28;
    const pcx = cx + ox;

    const cycle = 160;
    const t = frame % cycle;
    let drinkPhase = 0;
    if (t < 35) drinkPhase = t / 35;
    else if (t < 65) drinkPhase = 1;
    else if (t < 100) drinkPhase = 1 - (t - 65) / 35;
    else drinkPhase = 0;

    const smoothPhase = drinkPhase * drinkPhase * (3 - 2 * drinkPhase);
    const upY = 40;
    const downY = 60;
    const mugYTarget = cy + oy + downY - (downY - upY) * smoothPhase;
    const mugYLap = torsoY + 28;
    const pcy = mugYLap + drop * 0.35 - (mugYLap - mugYTarget) * blend;

    ctx.save();

    if (blend > 0.1) {
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * blend})`;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      for (let i = -1; i <= 1; i++) {
        const phase = (frame + i * 60) % 200;
        const h = phase * 0.45;
        const sw = Math.sin((frame + i * 30) * 0.04) * 7;
        ctx.globalAlpha = Math.max(0, 1 - h / 90);
        ctx.beginPath();
        ctx.moveTo(pcx + i * 8 + sw * 0.2, pcy - 12 - h * 0.2);
        ctx.quadraticCurveTo(pcx + i * 12 + sw, pcy - 12 - h * 0.6, pcx + i * 8 - sw, pcy - 12 - h);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.globalAlpha = 0.2 + 0.8 * blend;

    if (blend < 1) {
      ctx.fillStyle = `rgba(0,0,0,${0.15 * (1 - blend)})`;
      ctx.beginPath();
      ctx.ellipse(pcx, pcy + 14 + drop * 0.2, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = '#cdd6f4';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(pcx + 14, pcy + 0.5, 10, -Math.PI / 2.5, Math.PI / 2.5);
    ctx.stroke();

    ctx.fillStyle = '#cdd6f4';
    ctx.beginPath();
    ctx.ellipse(pcx, pcy + 11, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(pcx - 15, pcy - 12, 30, 23);

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(pcx, pcy + 11, 15, 5, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(pcx + 6, pcy - 12, 10, 30);
    ctx.restore();

    ctx.fillStyle = '#b4befe';
    ctx.beginPath();
    ctx.ellipse(pcx, pcy - 12, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3a2012';
    ctx.beginPath();
    ctx.ellipse(pcx, pcy - 11.5, 13, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const leftShoulder = { x: cx + ox - 32, y: torsoY + 2 };
    const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
    const leftHand = { x: pcx - 13, y: pcy + 6 };
    const rightHand = { x: pcx + 19, y: pcy + 2 };
    const armDrop = (mugYLap - pcy) * 0.4;
    const leftElbow = { x: leftShoulder.x - 16 - drop * 0.15, y: torsoY + 28 - armDrop + drop * 0.45 };
    const rightElbow = { x: rightShoulder.x + 16 + drop * 0.15, y: torsoY + 28 - armDrop + drop * 0.45 };

    drawArm(ctx, C, leftShoulder, leftElbow, leftHand, blend);
    drawArm(ctx, C, rightShoulder, rightElbow, rightHand, blend);

    ctx.restore();
  }

  function drawArm(
    ctx: CanvasRenderingContext2D,
    C: CharacterColors,
    shoulder: { x: number; y: number },
    elbow: { x: number; y: number },
    hand: { x: number; y: number },
    blend: number
  ) {
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

  return masterCleanup;
}
