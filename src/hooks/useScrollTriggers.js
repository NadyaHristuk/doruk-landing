
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { snapSpeed } from '../config';

gsap.registerPlugin(ScrollTrigger);

export const useScrollTriggers = (containerRef, callbacks, config = {}) => {
  const { onSectionChange, onProgress } = callbacks;
  const { enableHorizontalGsap = false } = config;

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

    // Horizontal Scroll Logic
    const horizontalContainer = document.querySelector('#who-we-are');
    const horizontalSections = gsap.utils.toArray('.who-we-are-panel');
    let scrollTween;

    if (enableHorizontalGsap && horizontalContainer) {
      scrollTween = gsap.to(horizontalSections, {
        xPercent: -100 * (horizontalSections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalContainer,
          pin: true,
          scrub: snapSpeed,
          end: () => '+=' + horizontalContainer.offsetWidth,
          onEnter: () => onSectionChange('who-we-are'),
          onEnterBack: () => onSectionChange('who-we-are'),
          onUpdate: (self) => updateProgress(self.progress * 100)
        }
      });
      // Optionally kill this specific tween/trigger on unmount
    }

    // Creating triggers for other sections
    const sections = [
      { id: 'hero', start: 'top top', end: 'bottom top' },
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
      // Clean up triggers
      triggers.forEach(t => t.kill());
      if (scrollTween) {
        if (scrollTween.scrollTrigger) scrollTween.scrollTrigger.kill();
        scrollTween.kill();
      }
    };
  }, [containerRef, onSectionChange, onProgress, enableHorizontalGsap]);
};
