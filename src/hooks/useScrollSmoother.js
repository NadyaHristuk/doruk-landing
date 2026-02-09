
import { useEffect } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollSmoother);

export const useScrollSmoother = (container, debugDisable = false) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: fine)').matches;
    const isDesktopWidth = window.innerWidth >= 1024;
    const deviceMemory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const isLowPower = deviceMemory <= 4 || cores <= 4;
    const enableSmoother =
      !debugDisable && !prefersReduce && !isLowPower && isFinePointer && isDesktopWidth;

    if (!enableSmoother || !container) return;

    let smoother;
    let idleId;
    let timeoutId;
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      smoother = ScrollSmoother.create({
        wrapper: container,
        content: '#smooth-content',
        smooth: 1.0,
        effects: false,
        smoothTouch: 0
      });
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(start, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(start, 0);
    }

    return () => {
      // Clean up if component unmounts - though usually App doesn't unmount
      cancelled = true;
      if (idleId && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
      if (smoother) smoother.kill();
    };
  }, [container, debugDisable]);
};
