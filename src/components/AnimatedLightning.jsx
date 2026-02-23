import React, { useMemo } from 'react';

/*
  AnimatedLightning
  - Glowing orb ("snowball") running along path segments sequentially
  - Uniform velocity: orb moves at the same px/s speed on every segment
  - All animations share the same dur & begin to stay in sync

  Props:
  - highlightPaths?: string[] — orb travels these segments one-by-one
  - viewBox: string — SVG viewBox
  - color: string — orb color
  - speed: number — total cycle duration in seconds (default 25)
  - opacity: number — base stroke opacity (0 = hidden)
  - orbSize: number — radius of the glowing orb
  - basePaths?: string[] — invisible guide paths
  - strokeWidth: number — base stroke width
*/

const DEFAULT_D = 'M140,520 L340,120 L620,340 L840,120';

// ── Calculate euclidean length of an SVG path string (M/L only) ──
function calcPathLength(d) {
  const nums = d.match(/-?\d+\.?\d*/g);
  if (!nums || nums.length < 4) return 0;
  const pts = [];
  for (let i = 0; i < nums.length; i += 2) {
    pts.push({ x: parseFloat(nums[i]), y: parseFloat(nums[i + 1]) });
  }
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

const AnimatedLightning = ({
  d = DEFAULT_D,
  basePaths,
  highlightPaths,
  viewBox = '0 0 1000 1000',
  strokeWidth = 18,
  color = '#FFFFFF',
  speed = 25,
  opacity = 0,
  orbSize = 7
}) => {
  const paths =
    Array.isArray(highlightPaths) && highlightPaths.length > 0
      ? highlightPaths
      : [d];

  const totalDur = speed;

  // Pre-compute segment fractions based on path length
  const segments = useMemo(() => {
    const lengths = paths.map(calcPathLength);
    const totalLen = lengths.reduce((s, l) => s + l, 0);
    let acc = 0;
    return paths.map((seg, idx) => {
      const frac = lengths[idx] / totalLen;
      const start = acc;
      acc += frac;
      return { path: seg, start, end: acc, frac };
    });
  }, [paths]);

  return (
    <svg
      className="animated-lightning"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="orb-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="4.5"
            result="blur1"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="21" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base paths — only rendered if opacity > 0 */}
      {opacity > 0 &&
        Array.isArray(basePaths) &&
        basePaths.length > 0 &&
        basePaths.map((seg, idx) => (
          <path
            key={`b-${idx}`}
            d={seg}
            fill="none"
            stroke={color}
            strokeOpacity={opacity}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

      {/* One orb per segment — all animations use same dur & begin=0 */}
      {segments.map((seg, idx) => {
        const { start, end } = seg;
        const f = (v) => v.toFixed(4);

        // ── keyPoints/keyTimes for animateMotion ──
        // Stay at 0 until start, move 0→1 during start→end, stay at 1 until cycle end
        const motionKeyPoints = `0;0;1;1`;
        const motionKeyTimes = `0;${f(start)};${f(end)};1`;

        // ── opacity: visible only during this segment's slot ──
        const fade = 0.005;
        let opKeyTimes, opValues;
        if (idx === 0) {
          opKeyTimes = `0;${f(end - fade)};${f(end)};1`;
          opValues = '1;1;0;0';
        } else if (idx === segments.length - 1) {
          opKeyTimes = `0;${f(start)};${f(start + fade)};1`;
          opValues = '0;0;1;1';
        } else {
          opKeyTimes = `0;${f(start)};${f(start + fade)};${f(end - fade)};${f(end)};1`;
          opValues = '0;0;1;1;0;0';
        }

        return (
          <circle
            key={`orb-${idx}`}
            r={orbSize}
            fill={color}
            filter="url(#orb-glow)"
            cx="0"
            cy="0"
          >
            <animateMotion
              path={seg.path}
              dur={`${totalDur}s`}
              begin="0s"
              repeatCount="indefinite"
              keyPoints={motionKeyPoints}
              keyTimes={motionKeyTimes}
              calcMode="linear"
            />
            <animate
              attributeName="opacity"
              values={opValues}
              keyTimes={opKeyTimes}
              dur={`${totalDur}s`}
              begin="0s"
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </svg>
  );
};

export default AnimatedLightning;
