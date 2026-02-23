import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

const AnimatedPathFollower = ({
  offsetStart = 0,
  offsetEnd = 0,
  container,
  config,
  direction = 'ltr',
  trigger,
  start,
  end,
  scrub = 0.6
}) => {
  const circleRef = useRef(null),
    pathRef = useRef(null),
    [isMobile, setIsMobile] = useState(false);

  useGSAP(
    () => {
      if (!circleRef.current || !pathRef.current) return;

      const pathEl = pathRef.current;
      const prefersReduce =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const deviceMemory = typeof navigator !== 'undefined' ? navigator.deviceMemory || 4 : 4;
      const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
      const isLowPower = deviceMemory <= 4 || cores <= 4;
      const disableMotion = prefersReduce || isLowPower;

      const startPos = direction === 'ltr' ? offsetStart : 1 + offsetStart;
      gsap.set(circleRef.current, {
        motionPath: {
          path: pathEl,
          align: pathEl,
          autoRotate: false,
          alignOrigin: [0.5, 0.5],
          start: startPos
        }
      });

      if (disableMotion) return;

      gsap.to(circleRef.current, {
        scrollTrigger: {
          trigger: trigger || container,
          start: start || 'top bottom',
          end: end || 'bottom top',
          scrub
        },
        motionPath: {
          path: pathEl,
          align: pathEl,
          autoRotate: false,
          alignOrigin: [0.5, 0.5],
          start: direction === 'ltr' ? offsetStart : 1 + offsetStart,
          end: direction === 'ltr' ? 1 + offsetEnd : 0
        }
      });
    },
    {
      scope: container,
      dependencies: [
        direction,
        offsetStart,
        offsetEnd,
        container,
        trigger,
        start,
        end,
        scrub
      ]
    }
  );

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={isMobile ? config.mobile.viewBox : config.desktop.viewBox}
      className="svg-line"
    >
      <g>
        <path
          ref={pathRef}
          fill="#f6b823"
          d={isMobile ? config.mobile.path : config.desktop.path}
        />
        <circle ref={circleRef} r="13.5" fill="#f6b823" />
      </g>
    </svg>
  );
};

export default AnimatedPathFollower;
