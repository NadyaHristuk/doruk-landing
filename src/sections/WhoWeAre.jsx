import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// hooks
import { useTitleAnimation } from '../hooks';
// components
import AnimatedPathFollower from '../components/AnimatedPathFollower';
// config
import { translate, svgConfig, aboutContent } from '../config';
// assets
import SvgDotsLeft from '../assets/svg/animations/about-dots-left.svg?react';
import SvgDotsRight from '../assets/svg/animations/about-dots-right.svg?react';
import aboutBgSmall from '../assets/svg/bg/about-bg-small.svg';

// Panel content component
const WhoWeAreContent = ({ item, lang }) => {
  const titleId = `${item.id}-title`;
  const layoutClass =
    item.layout === 'mirrored' ? 'layout-mirrored' : 'layout-default';
  return (
    <article className="who-we-are-panel" aria-labelledby={titleId}>
      <div className={`content ${layoutClass}`}>
        <div className="content-image">
          <picture>
            <source type="image/webp" srcSet={item.bgWebp} />
            <img
              className="masked"
              src={item.bg}
              width="1040"
              height="559"
              loading="lazy"
              alt=""
              role="presentation"
              aria-hidden="true"
            />
          </picture>
          <div className="title-block">
            <div className="circle">
              <i className="icon-about-arrow" />
            </div>
            <h3 className="first-line truncate" id={titleId}>
              <span className="glow-wrapper">
                {translate(item.titleStart, lang)}
              </span>
              {translate(item.title, lang)}
            </h3>
            <p className="second-line truncate">
              {translate(item.titleEnd, lang)}
            </p>
          </div>
        </div>
        <div className="content-text">
          <div className="text-block">
            <img
              className="text-substrate"
              src={aboutBgSmall}
              alt=""
              aria-hidden="true"
              role="presentation"
            />
            <p className="text">{translate(item.text, lang)}</p>
          </div>
        </div>
      </div>
    </article>
  );
};
import { useMatrixDots } from '../hooks/useMatrixDots';

const WhoWeAre = ({ lang }) => {
  const containerRef = useRef(null);
  const entryRef = useRef(null);
  const sliderRef = useRef(null);
  const progress = useTitleAnimation(entryRef);
  useMatrixDots({
    sectionId: '#who-we-are',
    bucketSize: 40, // Увеличиваем размер столбца (больше пикселей = меньше столбцов)
    minTailLength: 3,
    maxTailLength: 7,
    minHeadOpacity: 0.7,
    maxHeadOpacity: 0.9,
    baseOpacity: 0.1, // Менее заметный фон
    minDuration: 3000,
    maxDuration: 5000
  });

  useEffect(() => {
    const count = aboutContent.length;
    const slider = sliderRef.current;
    const sectionEl = document.querySelector('#who-we-are');
    if (!slider || !sectionEl || count <= 1) return;

    const panelWidth = slider.clientWidth; // ~100vw
    const maxScroll = panelWidth * (count - 1);

    // Vertical pinned scroll drives horizontal slider
    const scrollAnim = gsap.to(slider, { scrollLeft: maxScroll, ease: 'none' });

    const trigger = ScrollTrigger.create({
      trigger: entryRef.current,
      pin: sectionEl,
      pinType: 'transform', // Использует CSS transform вместо position:fixed — производительнее
      start: 'top top', // Изменено с 'top 19' - pin начинается когда секция достигает верха
      end: `+=${maxScroll}`,
      scrub: true,
      anticipatePin: 1, // Предотвращает рывок при активации pin
      markers: false,
      animation: scrollAnim
    });

    // Animate project SVG substrate + text when panel enters
    const panels = Array.from(slider.querySelectorAll('.who-we-are-panel'));
    panels.forEach((panel) => {
      const textBlock = panel.querySelector('.text-block');
      const imageLayers = panel.querySelector('.content-image');
      const imageNode = panel.querySelector('.content-image .masked');

      if (textBlock) {
        gsap.fromTo(
          textBlock,
          {
            '--who-layer-before-progress': 0,
            '--who-layer-after-progress': 0,
            '--who-layer-substrate-progress': 0
          },
          {
            '--who-layer-before-progress': 1,
            '--who-layer-after-progress': 1,
            '--who-layer-substrate-progress': 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollAnim,
              start: 'left center',
              end: 'right center',
              scrub: true
            }
          }
        );
      }

      if (imageLayers) {
        gsap.fromTo(
          imageLayers,
          { '--who-image-layer-progress': 0 },
          {
            '--who-image-layer-progress': 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollAnim,
              start: 'left center',
              end: 'right center',
              scrub: true
            }
          }
        );
      }

      if (imageNode) {
        gsap.fromTo(
          imageNode,
          { y: 10, scale: 0.995 },
          {
            y: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollAnim,
              start: 'left center',
              end: 'right center',
              scrub: true
            }
          }
        );
      }
    });

    return () => {
      trigger.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars && t.vars.containerAnimation === scrollAnim) t.kill();
      });
    };
  }, []);

  return (
    <>
      {/* Section header - отдельно от фонов */}
      <header className="section-header" ref={entryRef}>
        <h2
          className="animated-title"
          style={{ transform: `translateX(${progress}%)` }}
        >
          {translate('about.title', lang)}
        </h2>
      </header>

      {/* Фоновые элементы */}
      <div className="backgrounds">
        <div className="background-line" ref={containerRef}>
          <AnimatedPathFollower
            container={containerRef.current}
            trigger={entryRef.current}
            start={'top top'}
            end={(() => {
              const slider = sliderRef.current;
              const count = aboutContent.length;
              if (!slider || count <= 1) return 'bottom top';
              const panelWidth = slider.clientWidth;
              const maxScroll = panelWidth * (count - 1);
              return `+=${maxScroll}`;
            })()}
            scrub={true}
            offsetStart={0}
            config={svgConfig.about}
          />
        </div>
        <div className="background-dots">
          <SvgDotsLeft className="about-svg-dots-left" />
          <SvgDotsRight className="about-svg-dots-right" />
        </div>
      </div>

      {/* Слайдер с контентом */}
      <div
        className="who-we-are-slider"
        role="region"
        aria-label={translate('about.title', lang)}
        ref={sliderRef}
      >
        {aboutContent.map((item) => (
          <WhoWeAreContent item={item} lang={lang} key={item.id} />
        ))}
      </div>
    </>
  );
};

export default WhoWeAre;
