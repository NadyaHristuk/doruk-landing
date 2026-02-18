import { useEffect, useState, useRef } from 'react';
// hooks
import { useTitleAnimation } from '../hooks';
// components
import AnimatedPathFollower from '../components/AnimatedPathFollower';
// config
import { keyFactsConfig, translate, svgConfig } from '../config';
// assets
import circleImg from '../assets/jpg/key-facts/key-facts-bg.jpg';
import squareImg from '../assets/png/key-facts/bg-2.png';
import circleImgWebp from '../assets/webp/key-facts/key-facts-bg.webp';
import squareImgWebp from '../assets/webp/key-facts/bg-2.webp';

const { logos, hoverOffset } = keyFactsConfig;

const getDistance = (x1, y1, x2, y2) => {
  const Vx = x2 - x1;
  const Vy = y2 - y1;
  return Math.sqrt(Vx * Vx + Vy * Vy);
};

const KeyFacts = ({ lang }) => {
  const keyFactsTitle = `${translate('keyFacts.title', lang) || ''}`;
  const titleChars = Array.from(keyFactsTitle);
  const titleInitial = titleChars[0] || '';
  const titleRest = titleChars.slice(1).join('');

  const entryRef = useRef(null),
    lineUpperRef = useRef(null),
    lineLowerRef = useRef(null),
    logosRef = useRef(null),
    [displacements, setDisplacements] = useState({}),
    [isMobile, setIsMobile] = useState(false),
    [isLowPower, setIsLowPower] = useState(false),
    progress = useTitleAnimation(entryRef);

  const onResize = () => {
    const isMobileDevice =
      window.innerWidth < 769 ||
      (window.innerWidth < 1025 &&
        (window.innerWidth > window.innerHeight ||
          window.screen.orientation.angle === 90));
    const deviceMemory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const lowPower = deviceMemory < 8 || cores < 6;
    setIsMobile(isMobileDevice);
    setIsLowPower(lowPower);
  };

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const handleMouseEnter = (id) => {
    if (isMobile || isLowPower) return;

    const container = logosRef.current;
    if (!container) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const hovered = logos.find((item) => item.id === id);
    if (!hovered) return;

    const hx = (hovered.left / 100) * w;
    const hy = (hovered.top / 100) * h;

    const newDisplacements = {};
    logos.forEach((item) => {
      if (item.id === id) return;

      const ix = (item.left / 100) * w;
      const iy = (item.top / 100) * h;
      const dist = getDistance(hx, hy, ix, iy);
      if (dist === 0) return;

      const force = hoverOffset * ((Math.max(w, h) * 0.3) / dist);
      const dx = ((ix - hx) / dist) * force;
      const dy = ((iy - hy) / dist) * force;
      newDisplacements[item.id] = { dx, dy };
    });

    setDisplacements(newDisplacements);
  };

  const handleMouseLeave = () => {
    if (isMobile || isLowPower) return;
    setDisplacements({});
  };

  return (
    <div className="key-facts">
      <header className="key-facts__header" ref={entryRef}>
        <h2
          className="animated-title"
          style={{ transform: `translateX(${progress}%)` }}
          aria-label={keyFactsTitle}
        >
          <span className="animated-title__cap">{titleInitial}</span>
          <span className="animated-title__text">{titleRest}</span>
        </h2>
      </header>
      <div className="key-facts__backgrounds">
        <div className="key-facts__bg key-facts__bg--upper">
          {/* <div className="key-facts__bg-art" aria-hidden="true" /> */}
          <div className="key-facts__watermark key-facts__watermark--upper" />
          <div className="key-facts__watermark key-facts__watermark--lower" />
          <div
            className="key-facts__bg-line key-facts__bg-line--upper"
            ref={lineUpperRef}
          >
            <AnimatedPathFollower
              container={lineUpperRef.current}
              direction="rtl"
              offsetStart={0.2}
              scrub={50}
              config={svgConfig.keyFacts.a}
            />
          </div>
          <div className="key-facts__bg-stripes key-facts__bg-stripes--upper" />
        </div>
        <div className="key-facts__bg key-facts__bg--lower">
          <div className="key-facts__watermark" />
          <div
            className="key-facts__bg-line key-facts__bg-line--lower"
            ref={lineLowerRef}
          >
            <AnimatedPathFollower
              container={lineLowerRef.current}
              direction="ltr"
              offsetStart={0.3}
              config={svgConfig.keyFacts.b}
            />
          </div>
          <div className="key-facts__bg-stripes key-facts__bg-stripes--lower key-facts__bg-stripes--lower-left" />
          <div className="key-facts__bg-stripes key-facts__bg-stripes--lower key-facts__bg-stripes--lower-right" />
          <div className="key-facts__bg-stripes key-facts__bg-stripes--mobile" />
        </div>
      </div>

      <div className="key-facts__content">
        <div className="key-facts__block key-facts__block--logos">
          <p className="key-facts__text">
            {translate('keyFacts.text.1', lang)}
          </p>
          <div className="key-facts__logos" ref={logosRef}>
            {logos.map((item) => {
              const d = displacements[item.id];
              return (
                <div
                  key={item.id}
                  className="key-facts__logo"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    left: `${item.left}%`,
                    top: `${item.top}%`,
                    transform: d
                      ? `translate(-50%, -50%) translate(${d.dx}px, ${d.dy}px)`
                      : 'translate(-50%, -50%)'
                  }}
                >
                  <img
                    src={item.src}
                    width="256"
                    height="256"
                    loading="lazy"
                    alt={item.alt}
                    style={{ transform: `rotate(${item.rotation}deg)` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="key-facts__block key-facts__block--photo">
          <div className="key-facts__figure" aria-hidden="true">
            <picture>
              <source type="image/webp" srcSet={circleImgWebp} />
              <img
                src={circleImg}
                width="1480"
                height="1480"
                loading="lazy"
                alt=""
                role="presentation"
                aria-hidden="true"
              />
            </picture>
          </div>
          <p className="key-facts__text">
            {translate('keyFacts.text.2', lang)}
          </p>
        </div>
        <div className="key-facts__block key-facts__block--device">
          <p className="key-facts__text">
            {translate('keyFacts.text.3', lang)}
          </p>
          <div className="key-facts__figure" aria-hidden="true">
            <picture>
              <source type="image/webp" srcSet={squareImgWebp} />
              <img
                src={squareImg}
                width="926"
                height="520"
                loading="lazy"
                alt=""
                role="presentation"
                aria-hidden="true"
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyFacts;
