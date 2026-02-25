import { useEffect, useState, useRef as useReactRef } from "react";

const MOBILE_BREAKPOINT = 768;
const DESKTOP_START = -350;
const DESKTOP_END = -50;
const MOBILE_START = -300;
const MOBILE_END = 0;

const getAnimValues = () => {
    if (typeof window === 'undefined' || window.innerWidth > MOBILE_BREAKPOINT) {
        return { start: DESKTOP_START, end: DESKTOP_END };
    }
    return { start: MOBILE_START, end: MOBILE_END };
};

const useTitleAnimation = ref => {
    const valuesRef = useReactRef(getAnimValues());
    const [progress, setProgress] = useState(valuesRef.current.start);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let rafId = 0;
        let ticking = false;

        const update = () => {
            ticking = false;
            if (!ref.current) return;

            valuesRef.current = getAnimValues();
            const { start: startValue, end: endValue } = valuesRef.current;

            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const start = windowHeight;
            const end = windowHeight / 2;
            const entryTop = rect.top;

            if (entryTop <= start && entryTop >= end) {
                const localProgress = (start - entryTop) / (start - end);
                const interpolated = startValue + (localProgress * (endValue - startValue));
                setProgress(interpolated);
            } else if (entryTop < end) {
                setProgress(endValue);
            } else if (entryTop > start) {
                setProgress(startValue);
            }
        };

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            rafId = window.requestAnimationFrame(update);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [ ref ]);

    return progress;
}

export default useTitleAnimation
