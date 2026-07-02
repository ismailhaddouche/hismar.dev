import * as CharacterBase from './CharacterBase';
import type { CharacterColors, OverState } from './CharacterBase';

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
    destroyCurrent = createAnimationInstance(container);
  };

  function createAnimationInstance(container: HTMLElement) {
    let isGaming = true;
    let lastCursor: { x: number; y: number } | null = null;
    let lastInteractionTs: number | null = null;
    let gamingBlend = 1;
    const tapPulse = { left: 0, right: 0 };
    let tapSide: 'left' | 'right' = 'left';
    let tapClock = 0;
    let lastFrameTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const cleanup = CharacterBase.init(container, {
      drawOverCharacter(state) {
        drawTie(state.ctx, state.cx, state.cy, state.ox, state.oy);
        drawKeyboardRig(state, gamingBlend, tapPulse);
      },
      drawAfter(state) {
        drawGlasses(state.ctx, state.W / 2, 80, state.tiltX * 0.5, state.tiltY * 0.3, gamingBlend);
      },
      getMood({ W, H, mx, my }) {
        const pointer = lastCursor ?? { x: mx ?? W / 2, y: my ?? H / 2 };
        if (isGaming) {
          return { focus: 0.85, gaze: { x: W / 2, y: H * 0.62 }, sweat: 1 };
        }
        return { focus: 0.08, gaze: pointer, sweat: 0 };
      },
      onFrame({ mx, my }) {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const delta = now - lastFrameTime;
        lastFrameTime = now;

        if (lastCursor && typeof mx === 'number' && typeof my === 'number') {
          const deltaMove = Math.abs(mx - lastCursor.x) + Math.abs(my - lastCursor.y);
          if (deltaMove > 1.2) {
            isGaming = false;
            lastInteractionTs = Date.now();
          } else {
            const since = lastInteractionTs ? Date.now() - lastInteractionTs : Infinity;
            if (since >= 1200) isGaming = true;
          }
        }
        if (typeof mx === 'number' && typeof my === 'number') lastCursor = { x: mx, y: my };
        if (!lastInteractionTs) lastInteractionTs = Date.now();
        if (!lastCursor) lastCursor = { x: 100, y: 100 };

        if (!isGaming) {
          const since = lastInteractionTs ? Date.now() - lastInteractionTs : 0;
          if (since >= 1200) isGaming = true;
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
      },
    });

    return cleanup;
  }

  function drawKeyboardRig(
    { ctx, cx, cy, ox, oy, C }: OverState,
    blend = 1,
    tapPulse = { left: 0, right: 0 }
  ) {
    const torsoY = cy + oy + 42;
    const drop = (1 - blend) * 28;
    const pcx = cx + ox;
    const pcy = torsoY + 26 + drop * 0.35;

    const botW = 75;
    const topW = 61;
    const H = 21;

    const TL = { x: pcx - topW / 2, y: pcy - H / 2 };
    const TR = { x: pcx + topW / 2, y: pcy - H / 2 };
    const BL = { x: pcx - botW / 2, y: pcy + H / 2 };
    const BR = { x: pcx + botW / 2, y: pcy + H / 2 };

    ctx.save();
    ctx.globalAlpha = 0.2 + 0.8 * blend;

    ctx.fillStyle = '#171920';
    ctx.beginPath();
    ctx.moveTo(TL.x, TL.y);
    ctx.lineTo(TR.x, TR.y);
    ctx.lineTo(BR.x, BR.y);
    ctx.lineTo(BL.x, BL.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#282b36';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pcx, BL.y);
    ctx.quadraticCurveTo(pcx - 5, BL.y + 10, pcx + 10, BL.y + 25);
    ctx.strokeStyle = '#4b5263';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#22252e';
    for (let r = 0; r < 5; r++) {
      const fY1 = (r + 0.15) / 5;
      const fY2 = (r + 0.85) / 5;
      const y1 = TL.y + (BL.y - TL.y) * fY1;
      const y2 = TL.y + (BL.y - TL.y) * fY2;
      const rowW1 = topW + (botW - topW) * fY1;
      const rowW2 = topW + (botW - topW) * fY2;

      for (let c = 0; c < 14; c++) {
        if (r === 4 && c > 3 && c < 10) {
          if (c === 4) {
            c = 9;
            continue;
          }
        }
        const fX1 = c / 14 + 0.01;
        const fX2 = c === 9 && r === 4 ? 10 / 14 - 0.01 : (c + 1) / 14 - 0.01;
        const x1_top = pcx - rowW1 / 2 + rowW1 * fX1;
        const x2_top = pcx - rowW1 / 2 + rowW1 * fX2;
        const x1_bot = pcx - rowW2 / 2 + rowW2 * fX1;
        const x2_bot = pcx - rowW2 / 2 + rowW2 * fX2;
        ctx.beginPath();
        ctx.moveTo(x1_top, y1);
        ctx.lineTo(x2_top, y1);
        ctx.lineTo(x2_bot, y2);
        ctx.lineTo(x1_bot, y2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 235, 124, 0.4)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    ctx.fillStyle = 'rgba(56, 235, 124, 0.12)';
    ctx.beginPath();
    ctx.moveTo(TL.x, TL.y);
    ctx.lineTo(TR.x, TR.y);
    ctx.lineTo(TR.x, TR.y + 3);
    ctx.lineTo(TL.x, TL.y + 3);
    ctx.fill();

    ctx.restore();

    const leftShoulder = { x: cx + ox - 32, y: torsoY + 2 };
    const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
    const leftGlow = tapPulse.left * blend;
    const rightGlow = tapPulse.right * blend;

    const leftHandTargetX = pcx - 16;
    const leftHandTargetY = pcy + 4 - leftGlow * 3;
    const rightHandTargetX = pcx + 16;
    const rightHandTargetY = pcy + 4 - rightGlow * 3;

    const leftHand = { x: leftHandTargetX, y: leftHandTargetY };
    const glassesY = (cy + oy - 5) * blend + (cy + oy + 42) * (1 - blend);
    const targetChestX = cx + ox + 14;
    const rightHand = {
      x: rightHandTargetX * blend + targetChestX * (1 - blend),
      y: rightHandTargetY * blend + glassesY * (1 - blend),
    };

    const leftElbow = { x: leftShoulder.x - 18 - drop * 0.15, y: torsoY + 32 + drop * 0.45 };
    const rightElbow = { x: rightShoulder.x + 18 + drop * 0.15, y: torsoY + 32 + drop * 0.45 };

    drawArm(ctx, C, leftShoulder, leftElbow, leftHand, blend);
    drawArm(ctx, C, rightShoulder, rightElbow, rightHand, blend);
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

  function drawTie(ctx: CanvasRenderingContext2D, cx: number, cy: number, ox: number, oy: number) {
    const pcx = cx + ox;
    const pcy = cy + oy;
    ctx.save();
    ctx.fillStyle = '#b32424';
    ctx.beginPath();
    ctx.moveTo(pcx - 4, pcy + 36);
    ctx.lineTo(pcx + 4, pcy + 36);
    ctx.lineTo(pcx + 3, pcy + 42);
    ctx.lineTo(pcx - 3, pcy + 42);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pcx - 3, pcy + 42);
    ctx.lineTo(pcx + 3, pcy + 42);
    ctx.lineTo(pcx + 5, pcy + 69);
    ctx.lineTo(pcx, pcy + 79);
    ctx.lineTo(pcx - 5, pcy + 69);
    ctx.fill();
    ctx.restore();
  }

  function drawGlasses(ctx: CanvasRenderingContext2D, cx: number, cy: number, ox: number, oy: number, blend: number) {
    const gy = (cy + oy - 5) * blend + (cy + oy + 42) * (1 - blend);
    const gcx = cx + ox;
    ctx.save();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    roundedRect(gcx - 22, gy - 6, 18, 14, 4);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();

    roundedRect(gcx + 4, gy - 6, 18, 14, 4);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(gcx - 4, gy);
    ctx.lineTo(gcx + 4, gy);
    ctx.stroke();

    ctx.globalAlpha = Math.max(0, blend * 2 - 1);
    ctx.beginPath();
    ctx.moveTo(gcx - 22, gy - 2);
    ctx.lineTo(gcx - 28, gy - 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gcx + 22, gy - 2);
    ctx.lineTo(gcx + 28, gy - 5);
    ctx.stroke();
    ctx.restore();
  }

  restart();
  resetTimer = setInterval(restart, 10000);

  return masterCleanup;
}
