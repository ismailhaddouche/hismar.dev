import * as CharacterBase from './CharacterBase';
import type { CharacterColors, CharacterState } from './CharacterBase';

interface Point { x: number; y: number }
type Quad = [Point, Point, Point, Point];

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
    destroyCurrent = createHelpAnimationInstance(container);
  };

  function createHelpAnimationInstance(container: HTMLElement) {
    let isSolving = true;
    let lastCursor: Point | null = null;
    let lastInteractionTs: number | null = null;
    let solveBlend = 1;

    const cleanup = CharacterBase.init(container, {
      drawAfter(state) {
        drawRubikRig(state, solveBlend);
      },
      getMood({ W, H, frame, mx, my }) {
        const pointer = lastCursor ?? { x: mx ?? W / 2, y: my ?? H / 2 };
        const phase = getRubikPhase(frame);
        if (isSolving) {
          if (phase.kind === 'thinking') {
            return {
              focus: 0.75,
              gaze: { x: W / 2 + 18, y: H * 0.32 },
              browLift: -1.8,
              browCurve: 4.2,
              browFurrow: 1,
              sweat: 0,
            };
          }
          return {
            focus: 0.9,
            gaze: { x: W / 2, y: H * 0.66 },
            browLift: -1,
            browCurve: 5,
            browFurrow: 0.65,
            sweat: 0,
          };
        }
        return { focus: 0.08, gaze: pointer, sweat: 0 };
      },
      onFrame({ mx, my }) {
        if (lastCursor && typeof mx === 'number' && typeof my === 'number') {
          const deltaMove = Math.abs(mx - lastCursor.x) + Math.abs(my - lastCursor.y);
          if (deltaMove > 1.2) {
            isSolving = false;
            lastInteractionTs = Date.now();
          } else {
            const since = lastInteractionTs ? Date.now() - lastInteractionTs : Infinity;
            if (since >= 1200) isSolving = true;
          }
        }
        if (typeof mx === 'number' && typeof my === 'number') lastCursor = { x: mx, y: my };
        if (!lastInteractionTs) lastInteractionTs = Date.now();
        if (!lastCursor) lastCursor = { x: 100, y: 100 };

        if (!isSolving) {
          const since = lastInteractionTs ? Date.now() - lastInteractionTs : 0;
          if (since >= 1200) isSolving = true;
        }

        const target = isSolving ? 1 : 0;
        solveBlend += (target - solveBlend) * 0.08;
      },
    });

    return cleanup;
  }

  function drawRubikRig(state: CharacterState, blend = 1) {
    const { ctx, W, tiltX, tiltY, frame, C } = state;
    const cx = W ? W / 2 : 100;
    const cy = 80;
    const ox = tiltX * 0.5;
    const oy = tiltY * 0.3;
    const torsoY = cy + oy + 42;
    const drop = (1 - blend) * 28;
    const pcx = cx + ox;
    const pcy = torsoY + 24 + drop * 0.35;
    const phase = getRubikPhase(frame);
    const turn = phase.kind === 'turn' ? easeInOut(phase.progress) : 0;

    const cubeSize = 34;
    const bob = Math.sin(frame * 0.045) * 1.2 * blend;
    const twist = phase.kind === 'turn'
      ? Math.sin(turn * Math.PI) * (phase.index === 1 ? 0.38 : phase.index === 2 ? -0.34 : 0.28)
      : 0;
    const cubeCenter = { x: pcx + twist * 7, y: pcy + bob };

    const leftShoulder = { x: cx + ox - 32, y: torsoY + 2 };
    const rightShoulder = { x: cx + ox + 32, y: torsoY + 2 };
    const leftHand = {
      x: cubeCenter.x - 23 - Math.sin(turn * Math.PI) * 2.5 * blend,
      y: cubeCenter.y + 10 + (phase.kind === 'turn' && phase.index === 2 ? -2.5 * Math.sin(turn * Math.PI) : 0),
    };
    const rightHand = {
      x: cubeCenter.x + 23 + Math.sin(turn * Math.PI) * 2.5 * blend,
      y: cubeCenter.y + 10 + (phase.kind === 'turn' && phase.index === 1 ? -3 * Math.sin(turn * Math.PI) : 0),
    };
    const leftElbow = { x: leftShoulder.x - 14 - drop * 0.12, y: torsoY + 29 + drop * 0.45 };
    const rightElbow = { x: rightShoulder.x + 14 + drop * 0.12, y: torsoY + 29 + drop * 0.45 };

    ctx.save();
    ctx.globalAlpha = 0.25 + 0.75 * blend;
    drawArmStroke(ctx, C, leftShoulder, leftElbow, leftHand);
    drawArmStroke(ctx, C, rightShoulder, rightElbow, rightHand);

    drawRubikCube(ctx, cubeCenter.x, cubeCenter.y, cubeSize, frame, phase, blend);

    drawHand(ctx, C, leftHand, -0.25);
    drawHand(ctx, C, rightHand, 0.25);
    drawShoulderCaps(ctx, C, leftShoulder, rightShoulder);
    ctx.restore();
  }

  function drawRubikCube(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    frame: number,
    phase: RubikPhase,
    blend: number
  ) {
    const progress = phase.kind === 'turn' ? easeInOut(phase.progress) : 0;
    const sideShift = phase.kind === 'turn' ? Math.sin(progress * Math.PI) * 3 : 0;
    const angle = Math.sin(frame * 0.025) * 0.08 + (phase.kind === 'turn' ? (progress - 0.5) * 0.1 : 0);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha *= blend;

    const half = size / 2;
    const depth = 9;
    const skew = 7;

    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(0, half + 8, half + 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const front: Quad = [
      { x: -half, y: -half },
      { x: half, y: -half },
      { x: half, y: half },
      { x: -half, y: half },
    ];
    const top: Quad = [
      { x: -half, y: -half },
      { x: -half + skew, y: -half - depth },
      { x: half + skew, y: -half - depth },
      { x: half, y: -half },
    ];
    const side: Quad = [
      { x: half, y: -half },
      { x: half + skew, y: -half - depth },
      { x: half + skew, y: half - depth },
      { x: half, y: half },
    ];

    drawCubeFace(ctx, top, ['#ffffff', '#ffd43b', '#ff6b35'], phase, 0, sideShift);
    drawCubeFace(ctx, side, ['#2f9e44', '#228be6', '#ff6b35'], phase, 1, sideShift);
    drawCubeFace(ctx, front, ['#e03131', '#ffffff', '#ffd43b'], phase, 2, sideShift);

    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 1.4;
    [top, side, front].forEach((poly) => {
      const [first, second, third, fourth] = poly;
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(second.x, second.y);
      ctx.lineTo(third.x, third.y);
      ctx.lineTo(fourth.x, fourth.y);
      ctx.closePath();
      ctx.stroke();
    });

    if (phase.kind === 'turn') {
      ctx.strokeStyle = `rgba(255,255,255,${0.25 + 0.25 * Math.sin(progress * Math.PI)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      const r = half + 5 + phase.index * 1.5;
      ctx.arc(0, 0, r, -Math.PI * 0.15, Math.PI * (0.75 + progress * 0.5));
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawCubeFace(
    ctx: CanvasRenderingContext2D,
    poly: Quad,
    palette: string[],
    phase: RubikPhase,
    faceIndex: number,
    sideShift: number
  ) {
    const active = phase.kind === 'turn' && phase.index === faceIndex;
    const rows = 3;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < rows; col++) {
        const u0 = col / rows;
        const u1 = (col + 1) / rows;
        const v0 = row / rows;
        const v1 = (row + 1) / rows;
        const wobble = active && (faceIndex === 0 ? row === 0 : faceIndex === 1 ? col === 2 : row === 1)
          ? sideShift
          : 0;
        const p1 = bilerp(poly, u0, v0, wobble);
        const p2 = bilerp(poly, u1, v0, wobble);
        const p3 = bilerp(poly, u1, v1, wobble);
        const p4 = bilerp(poly, u0, v1, wobble);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fillStyle = palette[(row + col + faceIndex) % palette.length] ?? '#ffffff';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function bilerp(poly: Quad, u: number, v: number, wobble: number): Point {
    const top = {
      x: poly[0].x + (poly[1].x - poly[0].x) * u,
      y: poly[0].y + (poly[1].y - poly[0].y) * u,
    };
    const bottom = {
      x: poly[3].x + (poly[2].x - poly[3].x) * u,
      y: poly[3].y + (poly[2].y - poly[3].y) * u,
    };
    return {
      x: top.x + (bottom.x - top.x) * v + wobble,
      y: top.y + (bottom.y - top.y) * v - wobble * 0.18,
    };
  }

  function drawArmStroke(ctx: CanvasRenderingContext2D, C: CharacterColors, shoulder: Point, elbow: Point, hand: Point) {
    ctx.save();
    ctx.strokeStyle = C.skin;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
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
    ctx.ellipse(0, 0, 6.4, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.skinHi;
    ctx.beginPath();
    ctx.ellipse(-1.8, -1.4, 2, 1.2, 0, 0, Math.PI * 2);
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

  restart();
  resetTimer = setInterval(restart, 10000);

  return masterCleanup;
}

type RubikPhase =
  | { kind: 'turn'; index: 0 | 1 | 2; progress: number }
  | { kind: 'thinking'; progress: number };

function getRubikPhase(frame: number): RubikPhase {
  const cycle = 300;
  const t = frame % cycle;
  const turnDuration = 62;
  const pause = 10;
  const firstEnd = turnDuration;
  const secondStart = firstEnd + pause;
  const secondEnd = secondStart + turnDuration;
  const thirdStart = secondEnd + pause;
  const thirdEnd = thirdStart + turnDuration;

  if (t < firstEnd) return { kind: 'turn', index: 0, progress: t / turnDuration };
  if (t < secondStart) return { kind: 'turn', index: 0, progress: 1 };
  if (t < secondEnd) return { kind: 'turn', index: 1, progress: (t - secondStart) / turnDuration };
  if (t < thirdStart) return { kind: 'turn', index: 1, progress: 1 };
  if (t < thirdEnd) return { kind: 'turn', index: 2, progress: (t - thirdStart) / turnDuration };
  return { kind: 'thinking', progress: (t - thirdEnd) / (cycle - thirdEnd) };
}

function easeInOut(t: number): number {
  const p = Math.max(0, Math.min(1, t));
  return p * p * (3 - 2 * p);
}
