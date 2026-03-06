import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global SVG line overlay spanning the entire landing page.
 * A single dynamic path is generated across sections and shifted during
 * WhoWeAre horizontal scroll, so one continuous line replaces section lines.
 */
const SvgLine = () => {
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  // Original path from design
  const originalPathD = `M 2087,0 C 1861,232 1727,472 1366,451 1005,430 1217,868 839,681 461,494 554,1157 8,925 -56,898 0,1177 -22,1223 148,1403 426,1175 709,1350 1041,1555 1132,1777 1563,1578 1994,1379 2273,1346 2504,1402 c 231,56 621,595 974,222 354,-373 817,-501 1310,-98 493,403 507,-307 988,373 8,197 72,345 44,539 -178,286 -531,389 -831,293 -380,-100 -559,370 -902,270 -126,-64 -408,-298 -323,-12 l 45,552 c 535,-177 729,778 1904,256 C 5982,3726 6353,5060 5247,4778 c -380,-71 -637,271 -942,420 -201,79 -784,-145 -662,31 146,216 262,481 537,560 418,113 562,-94 842,226 210,249 551,370 867,272 22,57 16,136 16,195`;

  const toFixed = (n) => Number(n).toFixed(2);

  // Scale path from original dimensions to target dimensions
  function scalePath(pathD, fromWidth, fromHeight, toWidth, toHeight) {
    const scaleX = toWidth / fromWidth;
    const scaleY = toHeight / fromHeight;

    let result = "";
    let i = 0;

    while (i < pathD.length) {
      const char = pathD[i];

      if (/[MmCcLlSsQqAaHhVvZz]/.test(char)) {
        result += char;
        i++;

        const cmd = char;

        // Parse coordinates for this command
        let coordCount = 0;
        switch (cmd.toLowerCase()) {
          case "m":
          case "l":
            coordCount = 2;
            break;
          case "h":
          case "v":
            coordCount = 1;
            break;
          case "c":
            coordCount = 6;
            break;
          case "s":
          case "q":
            coordCount = 4;
            break;
          case "a":
            coordCount = 7;
            break;
          case "z":
            coordCount = 0;
            break;
        }

        // Parse and scale coordinates
        for (let j = 0; j < coordCount; j++) {
          // Skip whitespace and commas
          while (i < pathD.length && /[\s,]/.test(pathD[i])) i++;

          // Parse number
          const numStart = i;
          if (pathD[i] === "-") i++;
          while (i < pathD.length && /[\d.]/.test(pathD[i])) i++;

          const numStr = pathD.substring(numStart, i);
          const num = parseFloat(numStr);

          // Determine if this is X or Y and scale accordingly
          const isY = j % 2 === 1;
          const scale = isY ? scaleY : scaleX;
          const scaled = toFixed(num * scale);

          result += scaled;
          if (j < coordCount - 1) result += " ";
        }
      } else {
        result += char;
        i++;
      }
    }

    return result;
  }

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const lineSvg = svgRef.current;
    const linePath = pathRef.current;
    const content = document.getElementById("smooth-content");
    if (!wrapper || !lineSvg || !linePath || !content) return;

    function syncLayout() {
      const track = document.querySelector(".who-we-are__track");
      const vw = window.innerWidth;
      const fallbackTrackWidth = vw * 3;
      const shiftX = Math.max((track?.scrollWidth || fallbackTrackWidth) - vw, 0);
      const overlayWidth = Math.max(vw * 3, shiftX + vw);

      wrapper.style.height = `${content.scrollHeight}px`;
      wrapper.style.width = `${overlayWidth}px`;

      // Scale original path to current dimensions (5760×6480 is design source)
      const scaledPath = scalePath(originalPathD, 5760, 6480, overlayWidth, content.scrollHeight);

      lineSvg.setAttribute("viewBox", `0 0 ${overlayWidth} ${content.scrollHeight}`);
      linePath.setAttribute("d", scaledPath);
    }

    // Wait for GSAP to create pin spacers, then sync
    ScrollTrigger.addEventListener("refresh", syncLayout);
    const raf1 = requestAnimationFrame(syncLayout);
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(syncLayout));
    const tid = setTimeout(syncLayout, 450);
    window.addEventListener("resize", syncLayout);

    // Shift overlay left during horizontal scroll
    const ctx = gsap.context(() => {
      const shiftAmount = () => {
        const liveTrack = document.querySelector(".who-we-are__track");
        const base = liveTrack?.scrollWidth || window.innerWidth * 3;
        return Math.max(base - window.innerWidth, 0);
      };

      gsap.to(wrapper, {
        x: () => -shiftAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: "#who-we-are",
          start: "top top",
          end: () => `+=${shiftAmount()}`,
          scrub: 1,
        },
      });
    });

    return () => {
      ctx.revert();
      clearTimeout(tid);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", syncLayout);
      ScrollTrigger.removeEventListener("refresh", syncLayout);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="svg-line-overlay" aria-hidden="true">
      <svg
        ref={svgRef}
        className="svg-line svg-line--global"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        <path ref={pathRef} className="svg-line__path" />
      </svg>
    </div>
  );
};

export default SvgLine;
