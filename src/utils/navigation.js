
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export const scrollToSection = (sectionId, options = {}) => {
  const { duration = 0.5, onComplete } = options;
  
  gsap.to(window, {
    duration,
    scrollTo: `#${sectionId}`,
    ease: 'power2.out',
    onComplete
  });
};

export const getSectionLabel = (menu, lang, id) => {
  const item = menu.find((m) => m.id === id);
  return item?.title?.[lang] ?? id;
};
