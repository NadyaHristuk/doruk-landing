import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SVG_PATH =
    "M 2087,0 C 1861,232 1727,472 1366,451 1005,430 1217,868 839,681 461,494 554,1157 8,925 -56,898 0,1177 -22,1223 148,1403 426,1175 709,1350 1041,1555 1132,1777 1563,1578 1994,1379 2273,1346 2504,1402 c 231,56 621,595 974,222 354,-373 817,-501 1310,-98 493,403 507,-307 988,373 8,197 72,345 44,539 -178,286 -531,389 -831,293 -380,-100 -559,370 -902,270 -126,-64 -408,-298 -323,-12 l 45,552 c 535,-177 729,778 1904,256 C 5982,3726 6353,5060 5247,4778 c -380,-71 -637,271 -942,420 -201,79 -784,-145 -662,31 146,216 262,481 537,560 418,113 562,-94 842,226 210,249 551,370 867,272 22,57 16,136 16,195";

const SvgLine = () => {
    const wrapperRef = useRef(null);
    const pathRef = useRef(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const pathEl = pathRef.current;
        const content = document.getElementById("smooth-content");
        if (!wrapper || !pathEl || !content) return;

        // Draw line progressively over entire page scroll (GSAP scrub)
        const length = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = length;
        pathEl.style.strokeDashoffset = length;

        const ctx = gsap.context(() => {
            // Draw line progressively over entire page scroll
            gsap.to(pathEl, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: content,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                },
            });
            // Overlay shift is handled by WhoWeAre.jsx onUpdate callback
        });

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div ref={wrapperRef} className="svg-line-overlay" aria-hidden="true">
            <svg
                viewBox="0 0 5760 6480"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
            >
                <path ref={pathRef} d={SVG_PATH} />
            </svg>
        </div>
    );
};

export default SvgLine;
