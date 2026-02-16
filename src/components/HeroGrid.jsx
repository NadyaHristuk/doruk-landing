import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroGrid = () => {
  const gridRef = useRef(null);
  const gridItem1Ref = useRef(null);
  const gridItem2Ref = useRef(null);
  const gridItem3Ref = useRef(null);
  const gridItem4Ref = useRef(null);
  const gridItem5Ref = useRef(null);
  const gridCol1Ref = useRef(null);
  const gridCol2Ref = useRef(null);
  const gridCol3Ref = useRef(null);
  const gridCol4Ref = useRef(null);
  const gridCol5Ref = useRef(null);

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

      tl.from(
        [gridItem1Ref.current, gridItem3Ref.current, gridItem5Ref.current],
        { x: '-100vw', opacity: 0 },
        0
      )
        .from(
          [gridItem2Ref.current, gridItem4Ref.current],
          { x: '100vw', opacity: 0 },
          0
        )
        .from(
          [gridCol1Ref.current, gridCol3Ref.current, gridCol5Ref.current],
          { y: '-100vh', opacity: 0 },
          0.2
        )
        .from(
          [gridCol2Ref.current, gridCol4Ref.current],
          { y: '100vh', opacity: 0 },
          0.2
        );
    },
    { scope: gridRef }
  );

  return (
    <div className="hero__grid" ref={gridRef} aria-hidden="true">
      <div className="hero__grid-row">
        <div className="hero__grid-item" ref={gridItem1Ref} />
        <div className="hero__grid-item" ref={gridItem2Ref} />
        <div className="hero__grid-item" ref={gridItem3Ref} />
        <div className="hero__grid-item" ref={gridItem4Ref} />
        <div className="hero__grid-item" ref={gridItem5Ref} />
      </div>
      <div className="hero__grid-col">
        <div className="hero__grid-item" ref={gridCol1Ref} />
        <div className="hero__grid-item" ref={gridCol2Ref} />
        <div className="hero__grid-item" ref={gridCol3Ref} />
        <div className="hero__grid-item" ref={gridCol4Ref} />
        <div className="hero__grid-item" ref={gridCol5Ref} />
      </div>
    </div>
  );
};

export default HeroGrid;
