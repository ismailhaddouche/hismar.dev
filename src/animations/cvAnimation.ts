import * as CharacterBase from './CharacterBase';
import type { CharacterColors, CharacterState } from './CharacterBase';

type Point = { x: number; y: number };

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
    destroyCurrent = createCvAnimationInstance(container);
  };

  function createCvAnimationInstance(container: HTMLElement) {
    let isAdjusting = true;
    let lastCursor: Point | null = null;
    let lastInteractionTs: number | null = null;
    let adjustBlend = 1;

    const cleanup = CharacterBase.init(container, {
      drawAfter(state) {
        drawTieRig(state, adjustBlend);
        drawGlasses(state);
      },
      getMood({ W, H, frame, mx, my }) {
        const pointer = lastCursor ?? { x: mx ?? W / 2, y: my ?? H / 2 };
        if (isAdjusting) {
          const motion = getCvMotion(frame);
          const isSeriousPause = motion.phase === 'serious';
          return {
            focus: isSeriousPause ? 0.92 : 0.82,
            gaze: isSeriousPause ? { x: W / 2, y: H * 0.46 } : { x: W / 2, y: H * 0.56 },
            browLift: isSeriousPause ? -2.2 : -1.5,
            browCurve: isSeriousPause ? 3.4 : 4.2,
            browFurrow: isSeriousPause ? 1.2 : 0.9,
            sweat: 0,
          };
        }
        return { focus: 0.08, gaze: pointer, sweat: 0 };
      },
      onFrame({ mx, my }) {
        if (lastCursor && typeof mx === 'number' && typeof my === 'number') {
          const deltaMove = Math.abs(mx - lastCursor.x) + Math.abs(my - lastCursor.y);
          if (deltaMove > 1.2) {
            isAdjusting = false;
            lastInteractionTs = Date.now();
          } else {
            const since = lastInteractionTs ? Date.now() - lastInteractionTs : Infinity;
            if (since >= 1200) isAdjusting = true;
          }
        }
        if (typeof mx === 'number' && typeof my === 'number') lastCursor = { x: mx, y: my };
        if (!lastInteractionTs) lastInteractionTs = Date.now();
        if (!lastCursor) lastCursor = { x: 100, y: 100 };

        if (!isAdjusting) {
          const since = lastInteractionTs ? Date.now() - lastInteractionTs : 0;
          if (since >= 1200) isAdjusting = true;
        }

        const target = isAdjusting ? 1 : 0;
        adjustBlend += (target - adjustBlend) * 0.08;
      },
    });

    return cleanup;
  }

  function drawGlasses(state: CharacterState) {
    const { ctx, W, tiltX, tiltY } = state;
    const cx = W ? W / 2 : 100;
    const cy = 80;
    const ox = tiltX * 0.5;
    const oy = tiltY * 0.3;
    const gy = cy + oy - 5;
    const gcx = cx + ox;

    ctx.save();
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    roundedRect(ctx, gcx - 23, gy - 7, 18, 14, 4);
    ctx.stroke();
    ctx.fillStyle = 'rgba(210, 235, 255, 0.1)';
    ctx.fill();

    roundedRect(ctx, gcx + 5, gy - 7, 18, 14, 4);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(gcx - 5, gy);
    ctx.lineTo(gcx + 5, gy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(gcx - 23, gy - 2);
    ctx.lineTo(gcx - 29, gy - 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gcx + 23, gy - 2);
    ctx.lineTo(gcx + 29, gy - 5);
    ctx.stroke();
    ctx.restore();
  }

  function drawTieRig(state: CharacterState, blend = 1) {
    const { ctx, W, tiltX, tiltY, frame, C } = state;
    const cx = W ? W / 2 : 100;
    const cy = 80;
    const ox = tiltX * 0.5;
    const oy = tiltY * 0.3;
    const torsoY = cy + oy + 42;
    const drop = (1 - blend) * 26;
    const center = cx + ox;
    const knotY = torsoY + 10 + drop * 0.25;
    const motion = getCvMotion(frame);
    const { armLift, pullLeft, pullRight, settle } = motion;
    const knotShift = (pullRight - pullLeft) * 2.8 * blend;
    const tieLift = (pullLeft + pullRight) * 1.7 * blend - settle * 0.8 * blend;

    ctx.save();
    ctx.globalAlpha = 0.22 + 0.78 * blend;

    drawTie(ctx, center + knotShift, knotY - tieLift, blend);

    const leftShoulder = { x: cx + ox - 32, y: torsoY + 2 };
    const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
    const leftTieHand = {
      x: center - 12 - pullLeft * 4 + pullRight * 1.5,
      y: knotY + 5 - pullLeft * 4 + drop * 0.25,
    };
    const rightTieHand = {
      x: center + 12 + pullRight * 4 - pullLeft * 1.5,
      y: knotY + 5 - pullRight * 4 + drop * 0.25,
    };
    const leftRestHand = { x: center - 50 - drop * 0.1, y: torsoY + 61 + drop * 0.3 };
    const rightRestHand = { x: center + 50 + drop * 0.1, y: torsoY + 61 + drop * 0.3 };
    const leftHand = mixPoint(leftRestHand, leftTieHand, armLift * blend);
    const rightHand = mixPoint(rightRestHand, rightTieHand, armLift * blend);

    const leftTieElbow = { x: leftShoulder.x - 13 - drop * 0.12, y: torsoY + 28 + drop * 0.4 };
    const rightTieElbow = { x: rightShoulder.x + 13 + drop * 0.12, y: torsoY + 28 + drop * 0.4 };
    const leftRestElbow = { x: leftShoulder.x - 20 - drop * 0.08, y: torsoY + 45 + drop * 0.35 };
    const rightRestElbow = { x: rightShoulder.x + 20 + drop * 0.08, y: torsoY + 45 + drop * 0.35 };
    const leftElbow = mixPoint(leftRestElbow, leftTieElbow, armLift * blend);
    const rightElbow = mixPoint(rightRestElbow, rightTieElbow, armLift * blend);

    drawArm(ctx, C, leftShoulder, leftElbow, leftHand, blend);
    drawArm(ctx, C, rightShoulder, rightElbow, rightHand, blend);
    drawHand(ctx, C, leftHand, -0.45 * armLift - 0.15 * (1 - armLift));
    drawHand(ctx, C, rightHand, 0.45 * armLift + 0.15 * (1 - armLift));
    drawShoulderCaps(ctx, C, leftShoulder, rightShoulder);

    ctx.restore();
  }

  function drawTie(ctx: CanvasRenderingContext2D, x: number, y: number, blend: number) {
    ctx.save();
    ctx.fillStyle = '#6c1d2f';
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x + 10, y);
    ctx.lineTo(x + 4, y + 9);
    ctx.lineTo(x - 4, y + 9);
    ctx.lineTo(x - 10, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const tieBottom = y + 60 * blend;
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 9);
    ctx.lineTo(x + 5, y + 9);
    ctx.lineTo(x + 11, tieBottom - 5);
    ctx.lineTo(x, tieBottom + 6);
    ctx.lineTo(x - 11, tieBottom - 5);
    ctx.closePath();
    ctx.fillStyle = '#9b1c31';
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 13);
    ctx.lineTo(x + 5, tieBottom - 12);
    ctx.stroke();
    ctx.restore();
  }

  function drawArm(
    ctx: CanvasRenderingContext2D,
    C: CharacterColors,
    shoulder: Point,
    elbow: Point,
    hand: Point,
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
    ctx.restore();
  }

  function drawHand(ctx: CanvasRenderingContext2D, C: CharacterColors, hand: Point, rotation: number) {
    ctx.save();
    ctx.translate(hand.x, hand.y);
    ctx.rotate(rotation);
    ctx.fillStyle = C.skin;
    ctx.beginPath();
    ctx.ellipse(0, 0, 6.3, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.skinHi;
    ctx.beginPath();
    ctx.ellipse(-1.7, -1.4, 2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawShoulderCaps(ctx: CanvasRenderingContext2D, C: CharacterColors, left: Point, right: Point) {
    ctx.fillStyle = C.shirt;
    [left, right].forEach((shoulder) => {
      ctx.beginPath();
      ctx.arc(shoulder.x, shoulder.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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
  }

  restart();
  resetTimer = setInterval(restart, 10000);

  return masterCleanup;
}

type CvMotion = {
  phase: 'raise' | 'adjust' | 'lower' | 'serious';
  armLift: number;
  pullLeft: number;
  pullRight: number;
  settle: number;
};

function getCvMotion(frame: number): CvMotion {
  const cycle = 280;
  const t = frame % cycle;

  if (t < 45) {
    return {
      phase: 'raise',
      armLift: easeInOut(t / 45),
      pullLeft: 0,
      pullRight: 0,
      settle: 0,
    };
  }

  if (t < 145) {
    const local = t - 45;
    const pullLeft = local < 36 ? easeInOut(local / 36) : local < 56 ? 1 - easeInOut((local - 36) / 20) : 0;
    const pullRight = local >= 52 && local < 88
      ? easeInOut((local - 52) / 36)
      : local >= 88
        ? 1 - easeInOut(Math.min((local - 88) / 12, 1))
        : 0;

    return {
      phase: 'adjust',
      armLift: 1,
      pullLeft,
      pullRight,
      settle: Math.sin(Math.min(local / 100, 1) * Math.PI) * 0.35,
    };
  }

  if (t < 190) {
    const progress = easeInOut((t - 145) / 45);
    return {
      phase: 'lower',
      armLift: 1 - progress,
      pullLeft: 0,
      pullRight: 0,
      settle: Math.sin(progress * Math.PI),
    };
  }

  return {
    phase: 'serious',
    armLift: 0,
    pullLeft: 0,
    pullRight: 0,
    settle: 0,
  };
}

function mixPoint(from: Point, to: Point, amount: number): Point {
  const t = Math.max(0, Math.min(1, amount));
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

function easeInOut(t: number): number {
  const p = Math.max(0, Math.min(1, t));
  return p * p * (3 - 2 * p);
}
