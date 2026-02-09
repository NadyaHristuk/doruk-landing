import { useRef } from 'react';
// hooks
import { useTitleAnimation } from '../hooks';
// components
import AnimatedPathFollower from '../components/AnimatedPathFollower';
// config
import { translate, svgConfig } from '../config';
// assets
import jpgBg from '../assets/jpg/our-benefits/benefits-bg.jpg';
import jpgBgWebp from '../assets/webp/our-benefits/benefits-bg.webp';

const TitleBlock = ({ children, icon }) => {
  return (
    <li className="title-block">
      <div className="circle" aria-hidden="true">
        <i className={icon} aria-hidden="true" />
      </div>
      <div className="text">{children}</div>
    </li>
  );
};

const OurBenefits = ({ lang }) => {
  const entryRef = useRef(null),
    containerRef = useRef(null),
    progress = useTitleAnimation(entryRef);

  return (
    <div className="our-benefits">
      <div className="backgrounds">
        <div className="top" ref={entryRef}>
          <h2
            className="animated-title"
            style={{
              transform: `translateX(${progress}%)`
            }}
          >
            {translate('ourBenefits.title', lang)}
          </h2>
        </div>

        <div className="bottom">
          <div className="background-a" ref={containerRef}>
            <AnimatedPathFollower
              container={containerRef.current}
              direction="rtl"
              offsetStart={1.2}
              config={svgConfig.ourBenefits}
            />
          </div>
          <div className="background-b" aria-hidden="true" />
        </div>
      </div>

      <div className="content">
        <div className="content-center">
          <div className="svg-background">
            <picture>
              <source type="image/webp" srcSet={jpgBgWebp} />
              <img
                className="masked"
                src={jpgBg}
                width="1380"
                height="920"
                loading="lazy"
                alt=""
                role="presentation"
                aria-hidden="true"
              />
            </picture>
          </div>
        </div>
        <ul
          className="content-around"
          role="list"
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
        >
          <TitleBlock icon="icon-our-benefits-office-remote">
            <h3 className="first-line truncate">
              {translate('ourBenefits.topLeft.line1', lang)}
            </h3>
            <p className="second-line truncate">
              <span>{translate('ourBenefits.topLeft.line2', lang)}</span>
            </p>
          </TitleBlock>

          <TitleBlock icon="icon-our-benefits-insurance">
            <h3 className="first-line truncate">
              {translate('ourBenefits.centerLeft.line1', lang)}
            </h3>
            <p className="second-line truncate">
              {translate('ourBenefits.centerLeft.line2prefix', lang)}
              <span>
                {translate('ourBenefits.centerLeft.line2suffix', lang)}
              </span>
            </p>
          </TitleBlock>

          <TitleBlock icon="icon-our-benefits-team">
            <h3 className="first-line truncate">
              {translate('ourBenefits.bottom.line1', lang)}
            </h3>
            <p className="second-line truncate">
              <span>{translate('ourBenefits.bottom.line2', lang)}</span>
            </p>
          </TitleBlock>

          <TitleBlock icon="icon-our-benefits-lunch-office">
            <h3 className="first-line truncate">
              <span>{translate('ourBenefits.topRight.line1prefix', lang)}</span>
              {translate('ourBenefits.topRight.line1', lang)}
            </h3>
            <p className="second-line truncate">
              {translate('ourBenefits.topRight.line2', lang)}
            </p>
          </TitleBlock>

          <TitleBlock icon="icon-our-benefits-playing-zone">
            <h3 className="first-line truncate">
              <span>
                {translate('ourBenefits.centerRight.line1prefix', lang)}
              </span>
              {translate('ourBenefits.centerRight.line1', lang)}
            </h3>
            <p className="second-line truncate">
              {translate('ourBenefits.centerRight.line2', lang)}
            </p>
          </TitleBlock>
        </ul>
      </div>
    </div>
  );
};

export default OurBenefits;
