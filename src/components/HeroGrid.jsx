import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeroGrid1 from '../assets/svg/hero-grid-1.svg?react';
import HeroGrid2 from '../assets/svg/hero-grid-2.svg?react';
import HeroGrid3 from '../assets/svg/hero-grid-3.svg?react';
import HeroGrid4 from '../assets/svg/hero-grid-4.svg?react';
import HeroGrid5 from '../assets/svg/hero-grid-5.svg?react';
import HeroGrid6 from '../assets/svg/hero-grid-6.svg?react';
import HeroGrid7 from '../assets/svg/hero-grid-7.svg?react';
import HeroGrid8 from '../assets/svg/hero-grid-8.svg?react';

gsap.registerPlugin(ScrollTrigger);

const HeroGrid = () => {
  const gridRef = useRef(null);
  const itemsRef = useRef([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { duration: 1.5, ease: 'power3.out' },
        scrollTrigger: {
          trigger: '#hero',
          start: 'top 80%',
          toggleActions: 'play none restart none'
        }
      });

      // Animate horizontal items (1, 2, 5, 6, 8)
      tl.from(
        [itemsRef.current[0], itemsRef.current[1], itemsRef.current[4], itemsRef.current[5], itemsRef.current[7]],
        { x: '-100vw', opacity: 0 },
        0
      );

      // Animate vertical items (3, 4, 7)
      tl.from(
        [itemsRef.current[2], itemsRef.current[3], itemsRef.current[6]],
        { y: '-100vh', opacity: 0 },
        0.2
      );
    },
    { scope: gridRef }
  );

  const gridItems = [
    HeroGrid1, HeroGrid2, HeroGrid3, HeroGrid4, 
    HeroGrid5, HeroGrid6, HeroGrid7, HeroGrid8
  ];

  return (
    <div className="hero__grid" ref={gridRef} aria-hidden="true">
      {gridItems.map((Component, index) => (
        <div 
          key={index} 
          className={`hero__grid-item hero__grid-item--${index + 1}`}
          ref={el => itemsRef.current[index] = el}
        >
          <Component />
        </div>
      ))}
    </div>
  );
};

export default HeroGrid;
