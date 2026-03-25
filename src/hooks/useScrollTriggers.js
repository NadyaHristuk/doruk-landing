import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useScrollTriggers = (containerRef, callbacks) => {
  const { onSectionChange, onProgress } = callbacks;

  useEffect(() => {
    if (!containerRef.current) return;

    let lastProgress = -1;
    let lastUpdate = 0;
    const throttleMs = 50;
    const updateProgress = (progress) => {
      if (typeof onProgress !== 'function') return;
      const now = performance.now();
      const delta = Math.abs(progress - lastProgress);
      if (now - lastUpdate < throttleMs && delta < 0.5) return;
      lastUpdate = now;
      lastProgress = progress;
      onProgress(progress);
    };

    const whoEl = document.querySelector('#who-we-are');
    const whoEnd = () => {
      const pinST = ScrollTrigger.getAll().find(
        t => t.pin && t.trigger === whoEl
      );
      return pinST ? pinST.end : whoEl.offsetTop + whoEl.offsetHeight;
    };

    const sections = [
      { id: 'hero', start: 'top top', end: 'bottom top' },
      { id: 'who-we-are', start: 'top top', end: whoEnd },
      { id: 'key-facts', start: 'top top', end: 'bottom top' },
      { id: 'our-benefits', start: 'top top', end: 'bottom top' },
      { id: 'keep-in-touch', start: 'top top', end: 'bottom top' },
    ];

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: section.start,
        end: section.end,
        markers: false,
        invalidateOnRefresh: true,
        onEnter: () => onSectionChange(section.id),
        onEnterBack: () => onSectionChange(section.id),
        onUpdate: (self) => updateProgress(self.progress * 100)
      })
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [containerRef, onSectionChange, onProgress]);
};
