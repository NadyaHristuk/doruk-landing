import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// components
import HeroHeader from '../components/HeroHeader.jsx';
import HeroBackground from '../components/HeroBackground.jsx';
import HeroGrid from '../components/HeroGrid.jsx';
// config
import { translate } from '../config';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = ({ lang, setLang }) => {
  const heroRef = useRef(null);
  const titleLeftRef = useRef(null);
  const titleRightRef = useRef(null);
  const titleLeft = translate('home.title.left', lang);
  const titleRight = translate('home.title.right', lang);
  const subtitleText = translate('home.subtitle.text', lang) || '';
  const subtitleEnd = translate('home.subtitle.end', lang) || '';

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
      <HeroBackground />
      <div className="hero__inner">
      <HeroHeader lang={lang} setLang={setLang} />
      <div className="hero__stage">
        <HeroGrid />
        <div className="hero__content">
          <h1 className="hero__title">
            {titleLeft ? (
              <span className="hero__title-left" ref={titleLeftRef}>
                {titleLeft}
              </span>
            ) : null}
            {titleRight ? (
              <span className="hero__title-right" ref={titleRightRef}>
                {titleRight}
              </span>
            ) : null}
          </h1>
          <h2 className="hero__subtitle">
            {subtitleText ? (
              <span className="hero__subtitle-pixelify">{subtitleText.charAt(0)}</span>
            ) : null}
            {subtitleText.slice(1) ? (
              <span className="hero__subtitle-source">{subtitleText.slice(1)}</span>
            ) : null}
            {subtitleEnd ? (
              <span className="hero__subtitle-pixelify hero__subtitle-pixelify--end">{subtitleEnd}</span>
            ) : null}
          </h2>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HeroSection;
