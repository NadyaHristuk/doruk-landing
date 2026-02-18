import { useEffect, useRef } from 'react';

const rightCoef = (100 + 0.078) / 100;
const leftCoef = (100 - 0.74) / 100; //0.7317

/**
 * @param {string} containerSelector - Селектор контейнера, який містить SVG.
 * @param {string[]} svgSelectors - Масив селекторів SVG елементів.
 * @param {number} offset - Зміщення кола відносно шляху.
 * @param {number} reverseOffset - Зміщення кола відносно шляху для другого SVG
 */
const useCircleOnPath = (
  containerSelector,
  svgSelectors,
  offset,
  reverseOffset
) => {
  const pathsRef = useRef([]);
  const circlesRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const initAnimation = () => {
      containerRef.current = document.querySelector(containerSelector);

      if (!containerRef.current) {
        console.error('Container not found');
        return;
      }

      pathsRef.current = svgSelectors.map((selector) => {
        const svg = document.querySelector(selector);
        return svg ? svg.querySelector('path') : null;
      });

      if (!pathsRef.current.every((path) => path)) {
        console.error('Paths not found');
        return;
      }

      circlesRef.current = svgSelectors.map((selector) => {
        const svg = document.querySelector(selector);
        return svg ? svg.querySelector('circle') : null;
      });

      if (!circlesRef.current.every((circle) => circle)) {
        console.error('Circles not found');
        return;
      }

      const isReverseNeeded = svgSelectors.length > 1;

      pathsRef.current.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
      });

      const updateCirclePosition = () => {
        const scrollY = containerRef.current.scrollTop || window.pageYOffset;
        const maxScrollY = containerRef.current.scrollHeight;

        pathsRef.current.forEach((path, index) => {
          const length = path.getTotalLength();
          const leftOffset = length * leftCoef;
          const rightOffset = length * rightCoef - length;
          const scroll = scrollY / maxScrollY;
          let distance = length;

          circlesRef.current[
            index
          ].style.offsetPath = `path('${path.getAttribute('d')}')`;

          if (isReverseNeeded) {
            distance = leftOffset + reverseOffset + scroll * 100;
          } else {
            const tempDistance = length - scroll * 100 + rightOffset;

            if (tempDistance > leftOffset) {
              distance = tempDistance;
            } else {
              distance = leftOffset + offset;
            }
          }

          circlesRef.current[index].style.offsetDistance = `${distance}%`;
        });
      };

      window.addEventListener('scroll', updateCirclePosition);
      updateCirclePosition();
      return () => window.removeEventListener('scroll', updateCirclePosition);
    };

    return initAnimation();
  }, [containerSelector, svgSelectors, offset, reverseOffset]);
};

export default useCircleOnPath;
