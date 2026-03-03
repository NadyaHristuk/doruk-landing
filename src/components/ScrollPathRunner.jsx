import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMobile from '../hooks/useMobile';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ScrollPathRunner = ({
  offsetStart = 0,
  offsetEnd = 0,
  config,
  direction = 'ltr',
  trigger,
  start,
  end,
  scrub = 0.6
}) => {
  const svgRef = useRef(null);
  const circleRef = useRef(null);
  const pathRef = useRef(null);
  const isMobile = useMobile(768);
  const activeConfig = isMobile ? config.mobile : config.desktop;
  const pathData = activeConfig.path.replace(/[zZ]\s*$/, '');

  useGSAP(
    () => {
      const pathEl = pathRef.current;
      const circleEl = circleRef.current;
      if (!pathEl || !circleEl) return;

      const totalLength = pathEl.getTotalLength();

      const prefersReduce =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // RTL: circle travels from end of path → start  (right-top → left-bottom)
      // LTR: circle travels from start of path → end  (left-top → right-bottom)
      const from = direction === 'rtl' ? 1 - offsetStart : offsetStart;
      const to = direction === 'rtl' ? offsetEnd : 1 - offsetEnd;

      const placeAt = (t) => {
        const clamped = Math.min(Math.max(t, 0), 1);
        const point = pathEl.getPointAtLength(clamped * totalLength);
        circleEl.setAttribute('cx', point.x);
        circleEl.setAttribute('cy', point.y);
      };

      // Set initial position and make visible
      placeAt(from);
      circleEl.style.visibility = 'visible';

      if (prefersReduce) return;

      // Resolve trigger element: explicit prop > parent of SVG > SVG itself
      const triggerEl =
        (typeof trigger === 'string' ? document.querySelector(trigger) : trigger) ||
        svgRef.current?.parentElement ||
        svgRef.current;

      // Proxy object: GSAP tweens proxy.t from 0→1,
      // we linearly map it to path position from→to
      const proxy = { t: 0 };

      gsap.to(proxy, {
        t: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          start: start || 'top bottom',
          end: end || 'bottom top',
          scrub,
          invalidateOnRefresh: true
        },
        onUpdate() {
          placeAt(from + (to - from) * proxy.t);
        }
      });
    },
    {
      scope: svgRef,
      dependencies: [
        direction,
        offsetStart,
        offsetEnd,
        trigger,
        start,
        end,
        scrub,
        isMobile
      ]
    }
  );

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={activeConfig.viewBox}
      className="svg-line"
    >
      <g>
        <path ref={pathRef} fill="#f6b823" d={pathData} />
        <circle
          ref={circleRef}
          r="13.5"
          fill="#f6b823"
          style={{ visibility: 'hidden' }}
        />
      </g>
    </svg>
  );
};

export default ScrollPathRunner;
