import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SVG_PATH =
    "M 2087,0 C 1861,232 1727,472 1366,451 1005,430 1217,868 839,681 461,494 554,1157 8,925 -56,898 0,1177 -22,1223 148,1403 426,1175 709,1350 1041,1555 1132,1777 1563,1578 1994,1379 2273,1346 2504,1402 c 231,56 621,595 974,222 354,-373 817,-501 1310,-98 493,403 507,-307 988,373 8,197 72,345 44,539 -178,286 -531,389 -831,293 -380,-100 -559,370 -902,270 -126,-64 -408,-298 -323,-12 l 45,552 c 535,-177 729,778 1904,256 C 5982,3726 6353,5060 5247,4778 c -380,-71 -637,271 -942,420 -201,79 -784,-145 -662,31 146,216 262,481 537,560 418,113 562,-94 842,226 210,249 551,370 867,272 22,57 16,136 16,195";

const SvgLine = () => {
    const wrapperRef = useRef(null);
    const pathRef = useRef(null);

    useEffect(() => {
        const pathEl = pathRef.current;
        if (!pathEl) return;

        const pathLength = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = pathLength;
        pathEl.style.strokeDashoffset = pathLength;
        pathEl.setAttribute("data-ready", "true");

        let pinStart = 0;
        let maxX = 0;
        let totalScroll = 0;

        // Compute zones: pinStart, maxX, totalScroll
        function computeZones() {
            const section = document.querySelector("#who-we-are");
            const track = section?.querySelector(".who-we-are__track");


            // Get pinStart from WhoWeAre element position
            // pinStart = scroll position when section.top aligns with viewport.top
            if (section) {
                // Get the element's position in the document flow
                // We need to account for any transforms or parent positioning
                let elementTop = 0;
                let element = section;

                // Walk up the DOM to calculate offset, accounting for positioned parents
                while (element && element !== document.body && element !== document.documentElement) {
                    elementTop += element.offsetTop;
                    element = element.offsetParent;
                }

                pinStart = Math.max(elementTop, 0);
            }

            // Get maxX from ScrollTrigger or track width
            // If track is not loaded, calculate from WhoWeAre ST (end - start = pin distance = maxX)
            if (track) {
                const trackScrollWidth = track.scrollWidth;
                const windowWidth = window.innerWidth;
                maxX = Math.max(trackScrollWidth - windowWidth, 0);

            } else if (section) {
                // Fallback: get from WhoWeAre ScrollTrigger (end - start = pin distance)
                const whoST = ScrollTrigger.getAll().find(
                    (st) => st.trigger === section
                );
                if (whoST && whoST.end !== undefined) {
                    maxX = whoST.end - whoST.start;
                } else {
                    maxX = 0;
                }
            } else {
                maxX = 0;
            }

            // Get total scroll distance
            totalScroll = ScrollTrigger.maxScroll(window);

        }

        // Compute visual progress accounting for 3 zones
        function getVisualProgress(scrollY) {
            const pinEnd = pinStart + maxX;
            const restVirtual = totalScroll - pinEnd;

            // Fixed zone allocation for testing
            const zone1end = 0.19;  // Hero: 19%
            const zone2end = 0.39;  // WhoWeAre: 20% (19% + 20% = 39%)
            // Zone 3 (Rest): 61% (remaining)

            if (scrollY <= pinStart) {
                // Zone 1: Hero section - linear progression
                return (scrollY / pinStart) * zone1end;
            } else if (scrollY < pinEnd) {
                // Zone 2: WhoWeAre pin period - map horizontal progress to line progress
                const whoP = (scrollY - pinStart) / Math.max(maxX, 1); // 0→1 as we scroll horizontally
                const zone2size = zone2end - zone1end;
                return zone1end + whoP * zone2size;
            } else {
                // Zone 3: After WhoWeAre - linear progression
                const restProgress = restVirtual > 0 ? (scrollY - pinEnd) / restVirtual : 1;
                return zone2end + restProgress * (1 - zone2end);
            }
        }

        let currentOffset = pathLength;


        // RAF ticker with lerp smoothing (scrub: 1 equivalent)
        function onTick(_time, deltaTime) {
            const scrollY = window.scrollY;
            const vp = Math.min(
                Math.max(getVisualProgress(scrollY), 0),
                1
            );
            const targetOffset = pathLength * (1 - vp);


            // lerp factor: exp decay gives ~scrub:1 feel at 60fps
            const lerpFactor = 1 - Math.exp((-deltaTime / 1000) * 6);
            currentOffset += (targetOffset - currentOffset) * lerpFactor;
            pathEl.style.strokeDashoffset = currentOffset;
        }

        // Register refresh listener and initial compute
        ScrollTrigger.addEventListener("refresh", computeZones);
        computeZones();

        // Start ticker
        gsap.ticker.add(onTick);

        return () => {
            gsap.ticker.remove(onTick);
            ScrollTrigger.removeEventListener("refresh", computeZones);
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
                <path ref={pathRef} d={SVG_PATH} data-ready="false" />
            </svg>
        </div>
    );
};

export default SvgLine;
