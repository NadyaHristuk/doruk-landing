import { useEffect, useRef, useState } from "react";
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
            aria-hidden={hidden ? "true" : "false"}
        >
            <div className="who-we-are__image">
                <picture>
                    <source type="image/webp" srcSet={item.bgWebp} />
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
                </picture>
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
    const isMobileLayout = useMobile(1280);
    const progress = useTitleAnimation(entryRef);
    const title = `${translate("about.title", lang) || ""}`;
    const titleChars = Array.from(title);
    const titleInitial = titleChars[0] || "";
    const titleRest = titleChars.slice(1).join("");

    const [activePanel, setActivePanel] = useState(0);

    // Landscape phones should use GSAP desktop scroll, not mobile buttons
    const [isLandscapePhone, setIsLandscapePhone] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.innerHeight <= 500 && window.innerWidth > window.innerHeight && window.innerWidth >= 769;
    });

    useEffect(() => {
        const check = () => {
            setIsLandscapePhone(window.innerHeight <= 500 && window.innerWidth > window.innerHeight && window.innerWidth >= 769);
        };
        window.addEventListener("resize", check);
        window.addEventListener("orientationchange", check);
        return () => {
            window.removeEventListener("resize", check);
            window.removeEventListener("orientationchange", check);
        };
    }, []);

    const useMobileNav = isMobileLayout && !isLandscapePhone;

    // On mobile: update image layer visibility when active panel changes
    useEffect(() => {
        if (!useMobileNav) return;

        const panels = document.querySelectorAll(".who-we-are__panel");
        panels.forEach((panel, index) => {
            const isActive = index === activePanel;

            // Set aria-hidden attribute for accessibility and CSS selectors
            panel.setAttribute("aria-hidden", isActive ? "false" : "true");

            const imageLayer = panel.querySelector(".who-we-are__image");
            const textBlock = panel.querySelector(".who-we-are__text-block");

            if (imageLayer) {
                imageLayer.style.setProperty("--who-image-layer-progress", isActive ? "1" : "0");
            }

            if (textBlock) {
                textBlock.style.setProperty("--who-layer-substrate-progress", isActive ? "1" : "0");
                textBlock.style.setProperty("--who-layer-before-progress", isActive ? "1" : "0");
                textBlock.style.setProperty("--who-layer-after-progress", isActive ? "1" : "0");
            }
        });
    }, [activePanel, useMobileNav]);

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

        // Skip GSAP animation on mobile — use button/dot navigation instead
        if (useMobileNav) {
            // Reset track position for mobile
            gsap.set(track, { x: 0 });
            return;
        }

        const ctx = gsap.context(() => {
            const panels = Array.from(track.querySelectorAll(".who-we-are__panel"));
            const maxX = () => Math.max(track.scrollWidth - window.innerWidth, 0);

            gsap.to(track, {
                x: () => -maxX(),
                ease: "none",
                force3D: true,
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    pin: true,
                    scrub: true,
                    end: () => `+=${maxX()}`,
                    anticipatePin: 0,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const offset = self.progress * maxX();
                        if (overlay) {
                            gsap.set(overlay, { x: -offset, y: offset });
                        }

                        const panelWidth = window.innerWidth;
                        const activeIndex = Math.round(offset / panelWidth);

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
                    onLeave: () => {
                        if (overlay) {
                            gsap.set(overlay, { x: -maxX(), y: maxX() });
                        }
                    },
                    onLeaveBack: () => {
                        if (overlay) {
                            gsap.set(overlay, { x: 0, y: 0 });
                        }
                    },
                },
            });
        });

        return () => ctx.revert();
    }, [useMobileNav]);

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
                    data-active-panel={activePanel}
                >
                    {aboutContent.map((item) => (
                        <WhoWeAreContent
                            item={item}
                            lang={lang}
                            key={item.id}
                        />
                    ))}
                </div>

                {/* Mobile navigation: prev/next + dots */}
                {useMobileNav && (
                    <div className="who-we-are__mobile-nav">
                        <button
                            type="button"
                            className="who-we-are__nav-btn who-we-are__nav-btn--prev"
                            onClick={() => setActivePanel((p) => (p - 1 + aboutContent.length) % aboutContent.length)}
                            aria-label="Previous panel"
                        >
                            ←
                        </button>

                        <div className="who-we-are__dots">
                            {aboutContent.map((_, idx) => (
                                <button
                                    type="button"
                                    key={idx}
                                    className={`who-we-are__dot ${idx === activePanel ? "who-we-are__dot--active" : ""}`}
                                    onClick={() => setActivePanel(idx)}
                                    aria-label={`Panel ${idx + 1}`}
                                    aria-current={idx === activePanel ? "page" : undefined}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            className="who-we-are__nav-btn who-we-are__nav-btn--next"
                            onClick={() => setActivePanel((p) => (p + 1) % aboutContent.length)}
                            aria-label="Next panel"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default WhoWeAre;
