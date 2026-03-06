import { useEffect, useRef } from "react";
import { gsap } from "gsap";
// hooks
import { useMobile, useTitleAnimation } from "../hooks";
// config
import { translate, aboutContent } from "../config";
// assets
import SvgDotsLeft from "../assets/svg/animations/about-dots-left.svg?react";
import SvgDotsRight from "../assets/svg/animations/about-dots-right.svg?react";
import aboutBgSmall from "../assets/svg/bg/about-bg-small.svg";
import { useMatrixDots } from "../hooks/useMatrixDots";

// Panel content component
const WhoWeAreContent = ({ item, lang, idSuffix = "", hidden = false }) => {
    const titleId = `${item.id}-title${idSuffix}`;
    const layoutClass =
        item.layout === "mirrored"
            ? "who-we-are__panel--mirrored"
            : "who-we-are__panel--default";
    return (
        <article
            className={`who-we-are__panel ${layoutClass}`}
            aria-labelledby={titleId}
            aria-hidden={hidden ? "true" : undefined}
        >
            <div className="who-we-are__image">
                <img
                    className="who-we-are__image-masked"
                    src={item.bg}
                    width="798"
                    height="496"
                    loading="lazy"
                    alt=""
                    role="presentation"
                    aria-hidden="true"
                />
            </div>
            <div className="who-we-are__info">
                <div className="who-we-are__title-block">
                    <div className="who-we-are__title-circle">
                        <i className="icon-about-arrow" />
                    </div>
                    <h3
                        className="who-we-are__title-line who-we-are__title-line--first"
                        id={titleId}
                    >
                        <span className="who-we-are__title-glow">
                            {translate(item.titleStart, lang)}
                        </span>
                        {translate(item.title, lang)}
                    </h3>
                    <p className="who-we-are__title-line who-we-are__title-line--second">
                        {translate(item.titleEnd, lang)}
                    </p>
                </div>
                <div className="who-we-are__text-block">
                    <img
                        className="who-we-are__text-substrate"
                        src={aboutBgSmall}
                        alt=""
                        aria-hidden="true"
                        role="presentation"
                    />
                    <p className="who-we-are__text-content">
                        {translate(item.text, lang)}
                    </p>
                </div>
            </div>
        </article>
    );
};

const WhoWeAre = ({ lang }) => {
    const entryRef = useRef(null);
    const trackRef = useRef(null);
    const disableDots = useMobile(769);
    const progress = useTitleAnimation(entryRef);
    const title = `${translate("about.title", lang) || ""}`;
    const titleChars = Array.from(title);
    const titleInitial = titleChars[0] || "";
    const titleRest = titleChars.slice(1).join("");

    useMatrixDots({
        sectionId: "#who-we-are",
        svgSelector: ".who-we-are__dots--left",
        bucketSize: 40,
        minTailLength: 5,
        maxTailLength: 12,
        minHeadOpacity: 0.9,
        maxHeadOpacity: 1.0,
        baseOpacity: 0.05,
        minDuration: 6000,
        maxDuration: 12000,
    });

    useMatrixDots({
        sectionId: "#who-we-are",
        svgSelector: ".who-we-are__dots--right",
        bucketSize: 40,
        minTailLength: 5,
        maxTailLength: 12,
        minHeadOpacity: 0.9,
        maxHeadOpacity: 1.0,
        baseOpacity: 0.05,
        minDuration: 6000,
        maxDuration: 12000,
    });

    useEffect(() => {
        const section = document.querySelector("#who-we-are");
        const track = trackRef.current;
        const overlay = document.querySelector(".svg-line-overlay");
        if (!section || !track) return;

        const ctx = gsap.context(() => {
            const maxX = () => Math.max(track.scrollWidth - window.innerWidth, 0);
            const panels = Array.from(track.querySelectorAll(".who-we-are__panel"));

            gsap.to(track, {
                x: () => -maxX(),
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    pin: true,
                    scrub: true,
                    end: () => `+=${maxX()}`,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        // During horizontal scroll: move overlay left with track and down to compensate for pin
                        const offset = self.progress * maxX();
                        if (overlay) {
                            gsap.set(overlay, { x: -offset, y: offset });
                        }

                        // Update panel layer visibility based on scroll progress
                        const panelWidth = window.innerWidth;
                        const trackOffset = offset;
                        const activeIndex = Math.round(trackOffset / panelWidth);

                        panels.forEach((panel, index) => {
                            const isActive = index === activeIndex;
                            const imageLayer = panel.querySelector(".who-we-are__image");
                            const textBlock = panel.querySelector(".who-we-are__text-block");

                            if (imageLayer) {
                                gsap.to(imageLayer, {
                                    "--who-image-layer-progress": isActive ? 1 : 0,
                                    duration: 0.55,
                                    ease: "power2.out",
                                    overwrite: "auto",
                                });
                            }

                            if (textBlock) {
                                gsap.to(textBlock, {
                                    "--who-layer-substrate-progress": isActive ? 1 : 0,
                                    duration: 0.55,
                                    ease: "power2.out",
                                    overwrite: "auto",
                                });
                                gsap.to(textBlock, {
                                    "--who-layer-before-progress": isActive ? 1 : 0,
                                    duration: 0.55,
                                    ease: "power2.out",
                                    overwrite: "auto",
                                });
                                gsap.to(textBlock, {
                                    "--who-layer-after-progress": isActive ? 1 : 0,
                                    duration: 0.55,
                                    ease: "power2.out",
                                    overwrite: "auto",
                                });
                            }
                        });
                    },
                    onLeave: (self) => {
                        // When exiting section: maintain final Y offset (= total scroll distance consumed by pin)
                        if (overlay) {
                            gsap.set(overlay, { y: maxX() });
                        }
                    },
                    onLeaveBack: () => {
                        // When scrolling back up into section from below: reset to no Y offset
                        if (overlay) {
                            gsap.set(overlay, { y: 0 });
                        }
                    },
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <div className="who-we-are__backgrounds">
                {!disableDots && (
                    <div className="who-we-are__background-stripes">
                        <SvgDotsLeft className="who-we-are__dots--left" />
                        <SvgDotsRight className="who-we-are__dots--right" />
                    </div>
                )}
            </div>

            <div className="who-we-are__inner">
                <header className="who-we-are__header" ref={entryRef}>
                    <h2
                        className="animated-title"
                        aria-label={title}
                        style={{ transform: `translateX(${progress}%)` }}
                    >
                        <span className="animated-title__cap">{titleInitial}</span>
                        <span className="animated-title__text">{titleRest}</span>
                    </h2>
                </header>

                <div
                    className="who-we-are__track"
                    role="region"
                    aria-label={translate("about.title", lang)}
                    ref={trackRef}
                >
                    {aboutContent.map((item) => (
                        <WhoWeAreContent item={item} lang={lang} key={item.id} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default WhoWeAre;
