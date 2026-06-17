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
    destroyCurrent = createFaceAnimationInstance(container);
  };

  function createFaceAnimationInstance(container: HTMLElement) {
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
        drawConsoleRig(state, gamingBlend, tapPulse);
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

  function drawConsoleRig({ ctx, cx, cy, ox, oy, C }: OverState, blend = 1, tapPulse = { left: 0, right: 0 }) {
    const torsoY = cy + oy + 42;
    const drop = (1 - blend) * 28;
    const pcx = cx + ox;
    const pcy = torsoY + 26 + drop * 0.35;

    const botW = 88;
    const topW = 72;
    const H = 24;

    const TL = { x: pcx - topW / 2, y: pcy - H / 2 };
    const TR = { x: pcx + topW / 2, y: pcy - H / 2 };
    const BL = { x: pcx - botW / 2, y: pcy + H / 2 };
    const BR = { x: pcx + botW / 2, y: pcy + H / 2 };

    const topX = (f: number) => TL.x + (TR.x - TL.x) * f;
    const botX = (f: number) => BL.x + (BR.x - BL.x) * f;
    const topY = TL.y;
    const botY = BL.y;
    const jcW = 0.175;

    ctx.save();
    ctx.globalAlpha = 0.2 + 0.8 * blend;

    ctx.fillStyle = '#0f141f';
    ctx.beginPath();
    ctx.moveTo(topX(jcW), topY);
    ctx.lineTo(topX(1 - jcW), topY);
    ctx.lineTo(botX(1 - jcW), botY);
    ctx.lineTo(botX(jcW), botY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0a1520';
    const scrPad = 0.04;
    ctx.beginPath();
    ctx.moveTo(topX(jcW + scrPad), topY + 3);
    ctx.lineTo(topX(1 - jcW - scrPad), topY + 3);
    ctx.lineTo(botX(1 - jcW - scrPad), botY - 3);
    ctx.lineTo(botX(jcW + scrPad), botY - 3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(100,180,255,0.04)';
    ctx.beginPath();
    ctx.moveTo(topX(jcW + scrPad), topY + 3);
    ctx.lineTo(topX(0.5), topY + 3);
    ctx.lineTo(botX(0.5), botY - 3);
    ctx.lineTo(botX(jcW + scrPad), botY - 3);
    ctx.closePath();
    ctx.fill();

    const leftGlow = tapPulse.left * blend;
    const rightGlow = tapPulse.right * blend;

    ctx.fillStyle = '#ff476c';
    ctx.beginPath();
    ctx.moveTo(topX(0), topY);
    ctx.lineTo(topX(jcW), topY);
    ctx.lineTo(botX(jcW), botY);
    ctx.lineTo(botX(0), botY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = `rgba(255,120,150,${0.1 + leftGlow * 0.55})`;
    ctx.beginPath();
    ctx.moveTo(topX(0.01), topY + 2);
    ctx.lineTo(topX(jcW - 0.01), topY + 2);
    ctx.lineTo(botX(jcW - 0.01), botY - 2);
    ctx.lineTo(botX(0.01), botY - 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = `rgba(30,30,50,${0.6 + leftGlow * 0.4})`;
    ctx.beginPath();
    ctx.arc((topX(jcW * 0.5) + botX(jcW * 0.5)) / 2, (topY + botY) / 2, 4 + leftGlow * 1.5, 0, Math.PI * 2);
    ctx.fill();

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

    ctx.fillStyle = `rgba(30,30,50,${0.6 + rightGlow * 0.4})`;
    ctx.beginPath();
    ctx.arc((topX(1 - jcW * 0.5) + botX(1 - jcW * 0.5)) / 2, (topY + botY) / 2, 4 + rightGlow * 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    const leftShoulder = { x: cx + ox - 32, y: torsoY + 2 };
    const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
    const leftHand = { x: BL.x + 6, y: BL.y - 2 + leftGlow * 3 };
    const rightHand = { x: BR.x - 6, y: BR.y - 2 + rightGlow * 3 };
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

  restart();
  resetTimer = setInterval(restart, 10000);

  return masterCleanup;
}
