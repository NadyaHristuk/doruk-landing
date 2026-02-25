import { useRef } from "react";
import { useMobile, useTitleAnimation } from "../hooks";
import { useMatrixDots } from "../hooks/useMatrixDots";
import AnimatedPathFollower from "../components/AnimatedPathFollower";
import { translate, svgConfig } from "../config";
import jpgBg from "../assets/jpg/our-benefits/benefits-bg.jpg";
import jpgBgWebp from "../assets/webp/our-benefits/benefits-bg.webp";
import SvgBenefitsDots from "../assets/svg/animations/benefits-dots.svg?react";

const TitleBlock = ({ children, icon }) => {
    return (
        <li className="our-benefits__item">
            <div className="our-benefits__circle" aria-hidden="true">
                <i className={icon} aria-hidden="true" />
            </div>
            <div className="our-benefits__item-text">{children}</div>
        </li>
    );
};

const OurBenefits = ({ lang }) => {
    const entryRef = useRef(null),
        containerRef = useRef(null),
        disableDots = useMobile(769),
        progress = useTitleAnimation(entryRef);

    useMatrixDots({
        sectionId: "#our-benefits",
        svgSelector: ".our-benefits__dots",
        bucketSize: 40,
        minTailLength: 5,
        maxTailLength: 12,
        minHeadOpacity: 0.9,
        maxHeadOpacity: 1.0,
        baseOpacity: 0.05,
        minDuration: 6000,
        maxDuration: 12000,
    });

    const title = `${translate("ourBenefits.title", lang) || ""}`;
    const titleChars = Array.from(title);
    const titleInitial = titleChars[0] || "";
    const titleRest = titleChars.slice(1).join("");

    return (
        <div className="our-benefits">
            <div className="our-benefits__header" ref={entryRef}>
                <h2
                    className="animated-title"
                    style={{
                        transform: `translateX(${progress}%)`,
                    }}
                    aria-label={title}
                >
                    <span className="animated-title__cap">{titleInitial}</span>
                    <span className="animated-title__text">{titleRest}</span>
                </h2>
            </div>
            <div className="our-benefits__backgrounds">
                <div className="our-benefits__bg">
                    <div className="our-benefits__bg-line" ref={containerRef}>
                        <AnimatedPathFollower
                            container={containerRef.current}
                            direction="rtl"
                            offsetStart={1.2}
                            config={svgConfig.ourBenefits}
                        />
                    </div>
                    {!disableDots && (
                        <div className="our-benefits__bg-dots" aria-hidden="true">
                            <SvgBenefitsDots className="our-benefits__dots" />
                        </div>
                    )}
                </div>
            </div>

            <div className="our-benefits__content">
                <div className="our-benefits__figure">
                    <div className="our-benefits__image-wrap">
                        <picture>
                            <source type="image/webp" srcSet={jpgBgWebp} />
                            <img
                                className="our-benefits__image-masked"
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
                <ul className="our-benefits__list" role="list">
                    <TitleBlock icon="icon-our-benefits-office-remote">
                        <h3 className="our-benefits__item-title truncate">
                            {translate("ourBenefits.topLeft.line1", lang)}
                        </h3>
                        <p className="our-benefits__item-subtitle truncate">
                            <span className="our-benefits__title-glow">
                                {translate("ourBenefits.topLeft.line2", lang)}
                            </span>
                        </p>
                    </TitleBlock>

                    <TitleBlock icon="icon-our-benefits-insurance">
                        <h3 className="our-benefits__item-title truncate">
                            {translate("ourBenefits.centerLeft.line1", lang)}
                        </h3>
                        <p className="our-benefits__item-subtitle truncate">
                            {translate(
                                "ourBenefits.centerLeft.line2prefix",
                                lang,
                            )}
                            <span className="our-benefits__title-glow">
                                {translate(
                                    "ourBenefits.centerLeft.line2suffix",
                                    lang,
                                )}
                            </span>
                        </p>
                    </TitleBlock>

                    <TitleBlock icon="icon-our-benefits-team">
                        <h3 className="our-benefits__item-title truncate">
                            {translate("ourBenefits.bottom.line1", lang)}
                        </h3>
                        <p className="our-benefits__item-subtitle truncate">
                            <span className="our-benefits__title-glow">
                                {translate("ourBenefits.bottom.line2", lang)}
                            </span>
                        </p>
                    </TitleBlock>

                    <TitleBlock icon="icon-our-benefits-lunch-office">
                        <h3 className="our-benefits__item-title truncate">
                            <span className="our-benefits__title-glow">
                                {translate(
                                    "ourBenefits.topRight.line1prefix",
                                    lang,
                                )}
                            </span>
                            {translate("ourBenefits.topRight.line1", lang)}
                        </h3>
                        <p className="our-benefits__item-subtitle truncate">
                            {translate("ourBenefits.topRight.line2", lang)}
                        </p>
                    </TitleBlock>

                    <TitleBlock icon="icon-our-benefits-playing-zone">
                        <h3 className="our-benefits__item-title truncate">
                            <span className="our-benefits__title-glow">
                                {translate(
                                    "ourBenefits.centerRight.line1prefix",
                                    lang,
                                )}
                            </span>
                            {translate("ourBenefits.centerRight.line1", lang)}
                        </h3>
                        <p className="our-benefits__item-subtitle truncate">
                            {translate("ourBenefits.centerRight.line2", lang)}
                        </p>
                    </TitleBlock>
                </ul>
            </div>
        </div>
    );
};

export default OurBenefits;
