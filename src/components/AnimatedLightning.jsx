import React from "react";

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

const DEFAULT_D = "M140,520 L340,120 L620,340 L840,120";

// ── Calculate euclidean length of an SVG path string (M/L only) ──

const AnimatedLightning = ({
    highlightPaths,
    preserveAspectRatio = "xMidYMid meet",
    viewBox = "0 0 1000 1000",
    speed = 25,
    orbSize = 4,
}) => {
    return (
        <svg
            preserveAspectRatio={preserveAspectRatio}
            className="animated-lightning"
            viewBox={viewBox}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <radialGradient id="orbGradient" r="55%">
                    <stop offset="0%" stop-color="#fffdf7" stop-opacity="1" />
                    <stop offset="20%" stop-color="#fff6d8" stop-opacity="1" />
                    <stop offset="40%" stop-color="#ffe6a3" stop-opacity="1" />
                    <stop offset="65%" stop-color="#ffd26a" stop-opacity="1" />
                    <stop offset="85%" stop-color="#d4af37" stop-opacity="1" />
                    <stop offset="100%" stop-color="#b8860b" stop-opacity="0" />
                </radialGradient>
                Алексей Юрьевич Яковлев, [26.02.26 15:15]
                <filter
                    id="orb-glow"
                    x="-200%"
                    y="-200%"
                    width="500%"
                    height="500%"
                >
                    <feGaussianBlur stdDeviation="3" result="blur1" />
                    <feGaussianBlur stdDeviation="8" result="blur2" />
                    <feGaussianBlur stdDeviation="14" result="blur3" />
                    <feMerge>
                        <feMergeNode in="blur3" />
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <mask id="hardMask" maskUnits="userSpaceOnUse">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                        x="250.5"
                        y="175"
                        width="3.5"
                        height="20"
                        fill="black"
                        transform="rotate(-8 250.5 175)"
                    />
                </mask>
            </defs>
            <g mask="url(#hardMask)">
                <circle
                    key={`orb`}
                    r={orbSize}
                    fill="url(#orbGradient)"
                    //fill="red"
                    filter="url(#orb-glow)"
                    cx="0"
                    cy="0"
                >
                    <animateMotion
                        path={highlightPaths}
                        dur={`${speed}s`}
                        repeatCount="indefinite"
                        calcMode="linear"
                    />
                    <animateTransform
                        dur={`${speed}s`}
                        begin="0s"
                        repeatCount="indefinite"
                        attributeName="transform"
                        type="scale"
                        keyTimes="0;0.005;
                                      0.24;0.245;
                                      0.260;0.266;
                                      0.266;0.274;
                                      0.295;0.301;
                                      0.301;0.312;
                                      0.347;0.359;
                                      0.485;0.49;
                                      0.512;0.520;
                                     0.995;1"
                        values="0;1;
                                    1;0;
                                    0;0.8;
                                    0.8;0;
                                    0;0.8;
                                    0.8;0;
                                    0;1;
                                    1;0;
                                    0;1;
                                    1;0"
                        calcMode="linear"
                    />
                </circle>
            </g>
        </svg>
    );
};

export default AnimatedLightning;
