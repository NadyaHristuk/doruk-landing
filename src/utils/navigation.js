
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/**
 * Smoothly scrolls to a specific section.
 * @param {string} sectionId - The ID of the section to scroll to.
 * @param {object} options - Optional configuration (duration, onComplete).
 */
export const scrollToSection = (sectionId, options = {}) => {
  const { duration = 0.5, onComplete } = options;
  
  gsap.to(window, {
    duration,
    scrollTo: `#${sectionId}`,
    ease: 'power2.out',
    onComplete
  });
};

/**
 * Retrieves the label for a section based on the current language.
 * @param {Array} menu - The menu configuration array.
 * @param {string} lang - The current language code.
 * @param {string} id - The section ID.
 * @returns {string} The localized title or the ID if not found.
 */
export const getSectionLabel = (menu, lang, id) => {
  const item = menu.find((m) => m.id === id);
  return item?.title?.[lang] ?? id;
};
