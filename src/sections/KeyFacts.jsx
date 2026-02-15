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

const {
  logos,
  hoverOffset,
  mobileRadius,
  desktopRadius,
  radiusMultiplier,
  firstCircleMaxItemCount
} = keyFactsConfig;

const getDistance = (x1, y1, x2, y2) => {
  const Vx = x2 - x1;
  const Vy = y2 - y1;
  return Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2));
};

const getDestPoint = (x1, y1, x2, y2, displacement = hoverOffset) => {
  const Vmod = getDistance(x1, y1, x2, y2);
  const dx = displacement * ((x2 - x1) / Vmod);
  const dy = displacement * ((y2 - y1) / Vmod);
  return { destX: x2 + dx, destY: y2 + dy };
};

const KeyFacts = ({ lang }) => {
  const entryRef = useRef(null),
    containerARef = useRef(null),
    containerBRef = useRef(null),
    [items, setItems] = useState([]),
    [radius, setRadius] = useState(desktopRadius),
    [isMobile, setIsMobile] = useState(false),
    [isLowPower, setIsLowPower] = useState(false),
    progress = useTitleAnimation(entryRef);

  useEffect(() => {
    let calculated = [];

    if (logos.length <= firstCircleMaxItemCount) {
      calculated = logos.map((item, index) => {
        const angle = index * (360 / logos.length) * (Math.PI / 180);
        return {
          ...item,
          circle: 'first',
          startX: radius * Math.cos(angle),
          startY: radius * Math.sin(angle),
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)
        };
      });
    } else {
      const remainingItems = logos.length - firstCircleMaxItemCount;

      calculated = logos
        .slice(0, firstCircleMaxItemCount)
        .map((item, index) => {
          const angle =
            index * (360 / firstCircleMaxItemCount) * (Math.PI / 180);
          return {
            ...item,
            circle: 'first',
            startX: radius * Math.cos(angle),
            startY: radius * Math.sin(angle),
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
          };
        });

      calculated = [
        ...calculated,
        ...logos.slice(firstCircleMaxItemCount).map((item, index) => {
          const angle = index * (360 / remainingItems) * (Math.PI / 180);
          return {
            ...item,
            circle: 'second',
            startX: radius * radiusMultiplier * Math.cos(angle),
            startY: radius * radiusMultiplier * Math.sin(angle),
            x: radius * radiusMultiplier * Math.cos(angle),
            y: radius * radiusMultiplier * Math.sin(angle)
          };
        })
      ];
    }

    setItems(calculated);
  }, [radius]);

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
    setRadius(isMobileDevice ? mobileRadius : desktopRadius);
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
    // Disable hover on mobile or low-power devices for performance
    if (isMobile || isLowPower) return;
    setItems((prevItems) => {
      const hoveredItem = prevItems.find((item) => item.id === id);
      if (!hoveredItem) return prevItems;

      let nearestItems = [];

      if (hoveredItem.circle === 'first') {
        nearestItems = prevItems
          .filter((item) => item.circle === 'second')
          .map((item) => ({
            ...item,
            distance: getDistance(hoveredItem.x, hoveredItem.y, item.x, item.y)
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 2);
      }

      return prevItems.map((item) => {
        if (item.id === id) {
          const { destX, destY } = getDestPoint(0, 0, item.x, item.y);
          return {
            ...item,
            x: destX,
            y: destY,
            nearests: nearestItems.map((n) => n.id)
          };
        } else if (
          hoveredItem.circle === 'first' &&
          nearestItems.some((n) => n.id === item.id)
        ) {
          const { destX, destY } = getDestPoint(
            hoveredItem.x,
            hoveredItem.y,
            item.x,
            item.y,
            hoverOffset
          );
          return {
            ...item,
            x: destX,
            y: destY
          };
        }
        return item;
      });
    });
  };

  const handleMouseLeave = () => {
    // Disable hover on mobile or low-power devices for performance
    if (isMobile || isLowPower) return;
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        x: item.startX,
        y: item.startY,
        nearests: undefined
      }))
    );
  };

  return (
    <div className="key-facts">
      <header className="key-facts__header" ref={entryRef}>
        <h2
          className="animated-title"
          style={{ transform: `translateX(${progress}%)` }}
        >
          {translate('keyFacts.title', lang)}
        </h2>
      </header>
      <div className="key-facts__bg">
        <div className="key-facts__bg-upper">
          <div className="key-facts__path-upper" ref={containerARef}>
            <AnimatedPathFollower
              container={containerARef.current}
              offsetStart={0.4}
              config={svgConfig.keyFacts.a}
            />
          </div>
          <div className="key-facts__pattern-upper" />
        </div>
        <div className="key-facts__bg-lower">
          <div className="key-facts__path-lower" ref={containerBRef}>
            <AnimatedPathFollower
              container={containerBRef.current}
              direction="rtl"
              offsetStart={1.1}
              config={svgConfig.keyFacts.b}
            />
          </div>
          <div className="key-facts__pattern-lower" />
          <div className="key-facts__pattern-mobile" />
        </div>
      </div>

      <div className="key-facts__content">
        <div className="key-facts__block key-facts__block--logos">
          <p className="key-facts__text">{translate('keyFacts.text.1', lang)}</p>
          <div className="key-facts__orbits">
            {['first', 'second'].map((circleType) => (
              <div
                key={circleType}
                className="key-facts__orbit"
              >
                {items
                  .filter((item) => item.circle === circleType)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="key-facts__logo"
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={() => handleMouseLeave(item.id)}
                      style={{
                        transform: `translate(calc(${
                          item.x / 10
                        }rem - 50%), calc(${
                          item.y / 10
                        }rem - 50%)) rotate(-45deg)`
                      }}
                    >
                      <img src={item.src} width="256" height="256" loading="lazy" alt={item.alt} />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
        <div className="key-facts__block key-facts__block--photo">
          <div className="key-facts__watermark" />
          <p className="key-facts__text">{translate('keyFacts.text.2', lang)}</p>
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
        </div>
        <div className="key-facts__block key-facts__block--card">
          <div className="key-facts__watermark" />
          <p className="key-facts__text">{translate('keyFacts.text.3', lang)}</p>
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
