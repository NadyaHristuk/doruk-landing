import { useEffect, useState } from "react";

const startValue = -350;
const endValue = -50;

const useTitleAnimation = ref => {
    const [progress, setProgress] = useState(startValue);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let rafId = 0;
        let ticking = false;

        const update = () => {
            ticking = false;
            if (!ref.current) return;

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
