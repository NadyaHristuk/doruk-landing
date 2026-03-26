import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SVG_PATH =
    "M 2087,0 C 1861,232 1727,472 1366,451 1005,430 1217,868 839,681 461,494 554,1157 8,925 -56,898 0,1177 -22,1223 148,1403 426,1175 709,1350 1041,1555 1132,1777 1563,1578 1994,1379 2273,1346 2504,1402 c 231,56 621,595 974,222 354,-373 817,-501 1310,-98 493,403 507,-307 988,373 8,197 72,345 44,539 -178,286 -531,389 -831,293 -380,-100 -559,370 -902,270 -126,-64 -408,-298 -323,-12 l 45,552 c 535,-177 729,778 1904,256 C 5982,3726 6353,5060 5247,4778 c -380,-71 -637,271 -942,420 -201,79 -784,-145 -662,31 146,216 262,481 537,560 418,113 562,-94 842,226 210,249 551,370 867,272 22,57 16,136 16,195";

const MOBILE_SVG_PATH =
    "m 399,481 c -23,-21 -48,-44 -80,-50 -30,-2 -54,21 -69,45 -15,23 -33,46 -58,58 -25,10 -52,-2 -69,-20 -16,-14 -35,-31 -57,-26 -27,8 -37,39 -62,51 -4,3 -11,3 -11,8 l -14,303 c 0,-24 15,58 51,76 36,18 94,11 127,11 33,0 84,0 138,25 54,25 99,58 117,54 L 397,1136 c 3,72 -33,145 -46,162 -12,17 -29,48 -68,48 -39,0 -76,-35 -117,-23 -40,12 -52,49 -84,71 -33,23 -51,20 -65,30 -14,10 -17,18 -26,29 L -10,1790 c 0,0 42,8 72,22 30,14 58,41 80,64 22,23 45,47 61,61 16,14 19,19 57,36 28,9 55,13 98,9 41,-6 62,-25 68,-27 l 20,237 c 3,75 -12,151 -22,178 -11,27 -48,93 -88,93 -40,0 -88,-48 -113,-72 -25,-24 -39,-53 -84,-50 -46,3 -57,95 -122,119 -64,24 -37,172 -46,184 L -45,2884 c 2,24 2,46 20,68 18,22 12,30 56,40 44,10 122,-15 156,15 35,29 27,67 39,115 12,47 30,79 68,104 37,25 83,7 113,0 30,-7 30,-14 30,-14 l -36,533 c 3,73 -34,147 -46,164 -12,17 -29,48 -69,48 -39,0 -77,-35 -118,-23 -41,12 -52,49 -86,72 -33,23 -52,20 -66,30 -14,10 -17,18 -26,29 l 7,349 c 0,0 38,7 66,21 28,13 53,38 73,59 21,21 41,43 56,56 14,12 18,18 53,33 26,8 51,11 90,8 38,-5 57,-23 62,-25";

const SvgLine = () => {
    const wrapperRef = useRef(null);
    const pathRef = useRef(null);
    const pathMobileRef = useRef(null);

    useEffect(() => {
        const pathEl = pathRef.current;
        const pathMobileEl = pathMobileRef.current;
        if (!pathEl || !pathMobileEl) return;

        const pathLength = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = pathLength;
        pathEl.style.strokeDashoffset = pathLength;
        pathEl.setAttribute("data-ready", "true");

        const pathLengthMobile = pathMobileEl.getTotalLength();
        pathMobileEl.style.strokeDasharray = pathLengthMobile;
        pathMobileEl.style.strokeDashoffset = pathLengthMobile;
        pathMobileEl.setAttribute("data-ready", "true");

        let pinStart = 0;
        let maxX = 0;
        let totalScroll = 0;

        function computeZones() {
            const section = document.querySelector("#who-we-are");
            const track = section?.querySelector(".who-we-are__track");

            const whoST = ScrollTrigger.getAll().find(
                (st) => st.trigger === section,
            );
            pinStart = whoST ? whoST.start : (section?.offsetTop ?? 0);

            const isDesktop = window.innerWidth >= 1280;
            maxX =
                isDesktop && track
                    ? Math.max(track.scrollWidth - window.innerWidth, 0)
                    : 0;

            totalScroll = ScrollTrigger.maxScroll(window);

            // On mobile (non-desktop), set overlay height to match actual page height
            // so the SVG path covers the full scroll range (not a fixed 600vh estimate)
            const wrapper = wrapperRef.current;
            if (wrapper && !isDesktop) {
                wrapper.style.height = (totalScroll + window.innerHeight) + 'px';
            }
        }

        function getVisualProgress(scrollY) {
            const vh = window.innerHeight;
            const pinEnd = pinStart + maxX;
            const visualTotal = totalScroll - maxX + vh;

            if (visualTotal <= 0) return 0;

            if (scrollY <= pinStart) {
                // Zone 1: before WhoWeAre (linear 1:1)
                return scrollY / visualTotal;
            } else if (maxX > 0 && scrollY < pinEnd) {
                // Zone 2: WhoWeAre pin period (compressed to 1vh)
                const whoP = (scrollY - pinStart) / Math.max(maxX, 1);
                return (pinStart / visualTotal) + whoP * (vh / visualTotal);
            } else {
                // Zone 3: after WhoWeAre (linear 1:1)
                const zone2end = (pinStart + vh) / visualTotal;
                const restVirtual = totalScroll - pinEnd;
                const restP =
                    restVirtual > 0
                        ? (scrollY - pinEnd) / restVirtual
                        : 1;
                return zone2end + restP * (1 - zone2end);
            }
        }

        let currentOffset = pathLength;
        let currentOffsetMobile = pathLengthMobile;
        const getScroll = ScrollTrigger.getScrollFunc(window);

        // RAF ticker with lerp smoothing (scrub: 1 equivalent)
        function onTick(_time, deltaTime) {
            const scrollY = getScroll();
            const vp = Math.min(Math.max(getVisualProgress(scrollY), 0), 1);

            // lerp factor: exp decay gives ~scrub:1 feel at 60fps
            const lerpFactor = 1 - Math.exp((-deltaTime / 1000) * 6);

            const targetOffset = pathLength * (1 - vp);
            currentOffset += (targetOffset - currentOffset) * lerpFactor;
            pathEl.style.strokeDashoffset = currentOffset;

            const targetOffsetMobile = pathLengthMobile * (1 - vp);
            currentOffsetMobile +=
                (targetOffsetMobile - currentOffsetMobile) * lerpFactor;
            pathMobileEl.style.strokeDashoffset = currentOffsetMobile;
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
                className="svg-line-overlay__desktop"
                viewBox="0 0 5760 6480"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
            >
                <path ref={pathRef} d={SVG_PATH} data-ready="false" />
            </svg>
            <svg
                className="svg-line-overlay__mobile"
                viewBox="0 0 390 5064"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
            >
                <path
                    ref={pathMobileRef}
                    d={MOBILE_SVG_PATH}
                    data-ready="false"
                />
            </svg>
        </div>
    );
};

export default SvgLine;
