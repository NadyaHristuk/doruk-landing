import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// components
import AnimatedPathFollower from '../components/AnimatedPathFollower.jsx';
import HeroHeader from '../components/HeroHeader.jsx';
import HeroBackground from '../components/HeroBackground.jsx';
import HeroGrid from '../components/HeroGrid.jsx';
// config
import { translate, svgConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = ({ lang, setLang }) => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const titleLeftRef = useRef(null);
  const titleRightRef = useRef(null);

  // Title intro animation (appear from sides into fixed positions)
  useGSAP(
    () => {
      const prefersReduce =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReduce) {
        if (heroRef.current) {
          heroRef.current.classList.add('hero--intro');
        }

        const introTl = gsap.timeline({
          defaults: { duration: 1.8, ease: 'power2.inOut' },
          onComplete: () => {
            if (heroRef.current) {
              heroRef.current.classList.remove('hero--intro');
            }
          }
        });

        if (titleLeftRef.current) {
          introTl.fromTo(
            titleLeftRef.current,
            { x: '-20vw', opacity: 0 },
            { x: 0, opacity: 1, clearProps: 'transform,opacity' },
            0
          );
        }

        if (titleRightRef.current) {
          introTl.fromTo(
            titleRightRef.current,
            { x: '20vw', opacity: 0 },
            { x: 0, opacity: 1, clearProps: 'transform,opacity' },
            0
          );
        }
      } else if (heroRef.current) {
        heroRef.current.classList.remove('hero--intro');
      }
    },
    { scope: heroRef }
  );

  return (
    <div className="hero" ref={heroRef}>
      <HeroHeader lang={lang} setLang={setLang} />
      <HeroBackground />
      <div className="hero__bg-line" ref={containerRef} aria-hidden="true">
        <AnimatedPathFollower
          container={containerRef.current}
          direction="rtl"
          offsetStart={1.1}
          config={svgConfig.home}
        />
      </div>
      <div className="hero__stage">
        <HeroGrid />
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__title-left" ref={titleLeftRef}>
              {translate('home.title.left', lang)}
            </span>
            <span className="hero__title-right" ref={titleRightRef}>
              {translate('home.title.right', lang)}
            </span>
          </h1>
          <h2 className="hero__subtitle">
            <span className="hero__subtitle-pixelify">{translate('home.subtitle.text', lang).charAt(0)}</span>
            <span className="hero__subtitle-source">{translate('home.subtitle.text', lang).slice(1)}</span>
            <span className="hero__subtitle-pixelify hero__subtitle-pixelify--end">{translate('home.subtitle.end', lang)}</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
