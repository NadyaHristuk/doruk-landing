
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

    const sections = [
      { id: 'hero', start: 'top top', end: 'bottom top' },
      { id: 'who-we-are', start: 'clamp(top bottom)', end: 'clamp(bottom bottom)' },
      { id: 'key-facts', start: 'clamp(top bottom)', end: 'clamp(bottom bottom)' },
      { id: 'our-benefits', start: 'clamp(top bottom)', end: 'clamp(bottom bottom)' },
      { id: 'keep-in-touch', start: 'clamp(top bottom)', end: 'clamp(bottom bottom)' }
    ];

    const triggers = sections.map(section =>
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: section.start,
        end: section.end,
        markers: false,
        onEnter: () => onSectionChange(section.id),
        onEnterBack: () => onSectionChange(section.id),
        onUpdate: (self) => updateProgress(self.progress * 100)
      })
    );

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [containerRef, onSectionChange, onProgress]);
};
