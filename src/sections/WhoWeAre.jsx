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
import { useMatrixDots } from '../hooks/useMatrixDots';

const AUTOPLAY_HOLD_MS = 3200;
const SLIDE_ANIMATION_SEC = 0.8;

const getAboutTitleParts = (lang) => {
  const tokenConfig = translate('about.titleTokens', lang);
  if (tokenConfig && typeof tokenConfig === 'object') {
    const first = `${tokenConfig.first || ''}`.trim();
    const second = `${tokenConfig.second || ''}`.trim();
    const third = `${tokenConfig.third || ''}`.trim();
    if (first) return { first, second, third };
  }

  const fallbackTitle = `${translate('about.title', lang) || ''}`.trim();
  const words = fallbackTitle.split(/\s+/).filter(Boolean);
  return {
    first: words[0] || '',
    second: words[1] || '',
    third: words[2] || ''
  };
};

const splitFirstWord = (word) => {
  const chars = Array.from(`${word || ''}`);
  return {
    initial: chars[0] || '',
    rest: chars.slice(1).join('')
  };
};

// Panel content component
const WhoWeAreContent = ({ item, lang, idSuffix = '', hidden = false }) => {
  const titleId = `${item.id}-title${idSuffix}`;
  const layoutClass =
    item.layout === 'mirrored'
      ? 'who-we-are__content--mirrored'
      : 'who-we-are__content--default';
  return (
    <article
      className="who-we-are__panel"
      aria-labelledby={titleId}
      aria-hidden={hidden ? 'true' : undefined}
    >
      <div className={`who-we-are__content ${layoutClass}`}>
        <div className="who-we-are__image">
          <picture>
            <source type="image/webp" srcSet={item.bgWebp} />
            <img
              className="who-we-are__image-masked"
              src={item.bg}
              width="1040"
              height="559"
              loading="lazy"
              alt=""
              role="presentation"
              aria-hidden="true"
            />
          </picture>
          <div className="who-we-are__title-block">
            <div className="who-we-are__title-circle">
              <i className="icon-about-arrow" />
            </div>
            <h3
              className="who-we-are__title-line who-we-are__title-line--first truncate"
              id={titleId}
            >
              <span className="who-we-are__title-glow">
                {translate(item.titleStart, lang)}
              </span>
              {translate(item.title, lang)}
            </h3>
            <p className="who-we-are__title-line who-we-are__title-line--second truncate">
              {translate(item.titleEnd, lang)}
            </p>
          </div>
        </div>
        <div className="who-we-are__text">
          <div className="who-we-are__text-block">
            <img
              className="who-we-are__text-substrate"
              src={aboutBgSmall}
              alt=""
              aria-hidden="true"
              role="presentation"
            />
            <p className="who-we-are__text-content">{translate(item.text, lang)}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

const WhoWeAre = ({ lang }) => {
  const containerRef = useRef(null);
  const entryRef = useRef(null);
  const sliderRef = useRef(null);
  const progress = useTitleAnimation(entryRef);
  const titleParts = getAboutTitleParts(lang);
  const firstWordParts = splitFirstWord(titleParts.first);
  const ariaTitle = [titleParts.first, titleParts.second, titleParts.third]
    .filter(Boolean)
    .join(' ');

  useMatrixDots({
    sectionId: '#who-we-are',
    svgSelector: '.who-we-are__dots--left, .who-we-are__dots--right',
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
    const originalCount = aboutContent.length;
    const count = originalCount;
    const slider = sliderRef.current;
    const sectionEl = document.querySelector('#who-we-are');
    if (!slider || !sectionEl || count <= 1) return;
    const panels = Array.from(slider.querySelectorAll('.who-we-are__panel'));
    const panelLayers = panels.map((panel) => ({
      textBlock: panel.querySelector('.who-we-are__text-block'),
      imageLayers: panel.querySelector('.who-we-are__image'),
      imageNode: panel.querySelector('.who-we-are__image .who-we-are__image-masked')
    }));

    let activeIndex = 0;
    let slideTween = null;
    let isAutoPlaying = false;
    let autoplayTimer = null;
    let triggerActive = false;

    const clearTimer = (timerId) => {
      if (timerId) window.clearTimeout(timerId);
      return null;
    };

    const currentPanelWidth = () => slider.clientWidth || window.innerWidth || 1;

    const stopAutoplay = () => {
      isAutoPlaying = false;
      autoplayTimer = clearTimer(autoplayTimer);
    };

    const animatePanelState = (index, immediate = false) => {
      const activeLogicalIndex = index % originalCount;
      panelLayers.forEach((panelLayer, panelIndex) => {
        const logicalIndex = panelIndex % originalCount;
        const isActive = logicalIndex === activeLogicalIndex;
        const duration = immediate ? 0 : 0.55;
        const ease = immediate ? 'none' : 'power2.out';

        if (panelLayer.textBlock) {
          gsap.to(panelLayer.textBlock, {
            '--who-layer-before-progress': isActive ? 1 : 0,
            '--who-layer-after-progress': isActive ? 1 : 0,
            '--who-layer-substrate-progress': isActive ? 1 : 0,
            duration,
            ease,
            overwrite: true
          });
        }

        if (panelLayer.imageLayers) {
          gsap.to(panelLayer.imageLayers, {
            '--who-image-layer-progress': isActive ? 1 : 0,
            duration,
            ease,
            overwrite: true
          });
        }

        if (panelLayer.imageNode) {
          gsap.to(panelLayer.imageNode, {
            y: isActive ? 0 : 10,
            scale: isActive ? 1 : 0.995,
            duration,
            ease,
            overwrite: true
          });
        }
      });
    };

    const goToSlide = (targetIndex, options = {}) => {
      const { immediate = false } = options;
      const clampedIndex = Math.max(0, Math.min(targetIndex, count));
      const sameSlide = clampedIndex === activeIndex;
      if (sameSlide && !immediate) return;

      if (slideTween) {
        slideTween.kill();
        slideTween = null;
      }

      activeIndex = clampedIndex;
      animatePanelState(activeIndex, immediate);
      slideTween = gsap.to(slider, {
        scrollLeft: currentPanelWidth() * activeIndex,
        duration: immediate ? 0 : SLIDE_ANIMATION_SEC,
        ease: immediate ? 'none' : 'power2.out',
        overwrite: true,
        onComplete: () => {
          if (activeIndex !== count) return;
          activeIndex = 0;
          gsap.set(slider, { scrollLeft: 0 });
          animatePanelState(0, true);
        }
      });
    };

    const scheduleNextAutoplayStep = () => {
      autoplayTimer = clearTimer(autoplayTimer);
      if (!isAutoPlaying || !triggerActive) {
        stopAutoplay();
        return;
      }

      autoplayTimer = window.setTimeout(() => {
        const nextIndex = activeIndex + 1;
        goToSlide(nextIndex);
        scheduleNextAutoplayStep();
      }, AUTOPLAY_HOLD_MS);
    };

    const startAutoplay = () => {
      isAutoPlaying = true;
      scheduleNextAutoplayStep();
    };

    const onResize = () => {
      goToSlide(activeIndex, { immediate: true });
      ScrollTrigger.refresh();
    };

    const trigger = ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 80%',
      end: 'bottom top',
      markers: false,
      onEnter: () => {
        triggerActive = true;
        gsap.fromTo(
          slider,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out', overwrite: true }
        );
        startAutoplay();
      },
      onEnterBack: () => {
        triggerActive = true;
        gsap.fromTo(
          slider,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', overwrite: true }
        );
        startAutoplay();
      },
      onLeave: () => {
        triggerActive = false;
        stopAutoplay();
      },
      onLeaveBack: () => {
        triggerActive = false;
        stopAutoplay();
      }
    });

    gsap.set(slider, { autoAlpha: 0, y: 36 });
    goToSlide(0, { immediate: true });
    window.addEventListener('resize', onResize);

    return () => {
      stopAutoplay();
      if (slideTween) slideTween.kill();
      window.removeEventListener('resize', onResize);
      trigger.kill();
    };
  }, []);

  return (
    <>
      {/* Section header - отдельно от фонов */}
      <header className="who-we-are__header" ref={entryRef}>
        <h2
          className="animated-title who-we-are__title"
          aria-label={ariaTitle || translate('about.title', lang)}
          style={{ transform: `translateX(${progress}%)` }}
        >
          <span className="who-we-are__title-word who-we-are__title-word--first">
            <span className="who-we-are__title-initial">{firstWordParts.initial}</span>
            <span className="who-we-are__title-rest">{firstWordParts.rest}</span>
          </span>
          {titleParts.second && (
            <span className="who-we-are__title-word who-we-are__title-word--mono">
              {titleParts.second}
            </span>
          )}
          {titleParts.third && (
            <span className="who-we-are__title-word who-we-are__title-word--mono">
              {titleParts.third}
            </span>
          )}
        </h2>
      </header>

      {/* Фоновые элементы */}
      <div className="who-we-are__backgrounds">
        <div className="who-we-are__background-line" ref={containerRef}>
          <AnimatedPathFollower
            container={containerRef.current}
            trigger={entryRef.current}
            start={'top top'}
            end={'bottom top'}
            scrub={true}
            offsetStart={0}
            config={svgConfig.about}
          />
        </div>
        <div className="who-we-are__background-dots">
          <SvgDotsLeft className="who-we-are__dots--left" />
          <SvgDotsRight className="who-we-are__dots--right" />
        </div>
      </div>

      {/* Слайдер с контентом */}
      <div
        className="who-we-are__slider"
        role="region"
        aria-label={translate('about.title', lang)}
        ref={sliderRef}
      >
        {aboutContent.map((item) => (
          <WhoWeAreContent item={item} lang={lang} key={item.id} />
        ))}
        <WhoWeAreContent
          item={aboutContent[0]}
          lang={lang}
          key={`${aboutContent[0].id}-clone`}
          idSuffix="-clone"
          hidden={true}
        />
      </div>
    </>
  );
};

export default WhoWeAre;
