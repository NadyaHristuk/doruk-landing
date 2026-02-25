import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// hooks
import { useMobile, useTitleAnimation } from "../hooks";
// components
import AnimatedPathFollower from "../components/AnimatedPathFollower";
// config
import { translate, svgConfig, aboutContent } from "../config";
// assets
import SvgDotsLeft from "../assets/svg/animations/about-dots-left.svg?react";
import SvgDotsRight from "../assets/svg/animations/about-dots-right.svg?react";
import aboutBgSmall from "../assets/svg/bg/about-bg-small.svg";
import { useMatrixDots } from "../hooks/useMatrixDots";

const AUTOPLAY_HOLD_MS = 3200;
const SLIDE_ANIMATION_SEC = 0.8;
const AUTOPLAY_ENABLED = true;
const TEMP_PAUSE_WHO_SLIDER = false;

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
    const containerRef = useRef(null);
    const entryRef = useRef(null);
    const sliderRef = useRef(null);
    const disableDots = useMobile(769);
    const progress = useTitleAnimation(entryRef);
    const title = `${translate("about.title", lang) || ""}`;
    const titleChars = Array.from(title);
    const titleInitial = titleChars[0] || "";
    const titleRest = titleChars.slice(1).join("");

    // Matrix dots animation
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
        if (TEMP_PAUSE_WHO_SLIDER) return;

        const originalCount = aboutContent.length;
        const count = originalCount;
        const slider = sliderRef.current;
        const sectionEl = document.querySelector("#who-we-are");
        if (!slider || !sectionEl || count <= 1) return;
        const panels = Array.from(
            slider.querySelectorAll(".who-we-are__panel"),
        );
        const panelLayers = panels.map((panel) => ({
            textBlock: panel.querySelector(".who-we-are__text-block"),
            imageLayers: panel.querySelector(".who-we-are__image"),
            imageNode: panel.querySelector(
                ".who-we-are__image .who-we-are__image-masked",
            ),
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

        const currentPanelWidth = () =>
            slider.clientWidth || window.innerWidth || 1;

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
                const ease = immediate ? "none" : "power2.out";
                const staggerDelay = immediate ? 0 : 0.2;

                if (panelLayer.imageLayers) {
                    gsap.to(panelLayer.imageLayers, {
                        "--who-image-layer-progress": isActive ? 1 : 0,
                        duration,
                        delay: isActive ? staggerDelay : 0,
                        ease,
                        overwrite: true,
                    });
                }

                if (panelLayer.textBlock) {
                    gsap.to(panelLayer.textBlock, {
                        "--who-layer-substrate-progress": isActive ? 1 : 0,
                        duration,
                        delay: isActive ? staggerDelay * 2 : 0,
                        ease,
                        overwrite: true,
                    });
                    gsap.to(panelLayer.textBlock, {
                        "--who-layer-after-progress": isActive ? 1 : 0,
                        duration,
                        delay: isActive ? staggerDelay * 3 : 0,
                        ease,
                        overwrite: "auto",
                    });
                    gsap.to(panelLayer.textBlock, {
                        "--who-layer-before-progress": isActive ? 1 : 0,
                        duration,
                        delay: isActive ? staggerDelay * 4 : 0,
                        ease,
                        overwrite: "auto",
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
                ease: immediate ? "none" : "power2.out",
                overwrite: true,
                onComplete: () => {
                    if (activeIndex !== count) return;
                    activeIndex = 0;
                    gsap.set(slider, { scrollLeft: 0 });
                    animatePanelState(0, true);
                },
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
            if (!AUTOPLAY_ENABLED) return;
            isAutoPlaying = true;
            scheduleNextAutoplayStep();
        };

        const onResize = () => {
            goToSlide(activeIndex, { immediate: true });
            ScrollTrigger.refresh();
        };

        const trigger = ScrollTrigger.create({
            trigger: sectionEl,
            start: "top 80%",
            end: "bottom top",
            onEnter: () => {
                triggerActive = true;
                gsap.fromTo(
                    slider,
                    { autoAlpha: 0, y: 36 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.75,
                        ease: "power2.out",
                        overwrite: true,
                    },
                );
                startAutoplay();
            },
            onEnterBack: () => {
                triggerActive = true;
                gsap.fromTo(
                    slider,
                    { autoAlpha: 0, y: 24 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.55,
                        ease: "power2.out",
                        overwrite: true,
                    },
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
            },
        });

        gsap.set(slider, { autoAlpha: 0, y: 36 });
        goToSlide(0, { immediate: true });
        window.addEventListener("resize", onResize);

        return () => {
            stopAutoplay();
            if (slideTween) slideTween.kill();
            window.removeEventListener("resize", onResize);
            trigger.kill();
        };
    }, []);

    return (
        <>
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

            <div className="who-we-are__backgrounds">
                <div className="who-we-are__bg-line" ref={containerRef}>
                    <AnimatedPathFollower
                        container={containerRef.current}
                        direction="rtl"
                        scrub={0.8}
                        offsetStart={0.12}
                        config={svgConfig.about}
                    />
                </div>
                {!disableDots && (
                    <div className="who-we-are__background-stripes">
                        <SvgDotsLeft className="who-we-are__dots--left" />
                        <SvgDotsRight className="who-we-are__dots--right" />
                    </div>
                )}
            </div>

            <div
                className={`who-we-are__slider ${TEMP_PAUSE_WHO_SLIDER ? "who-we-are__slider--paused" : ""}`}
                role="region"
                aria-label={translate("about.title", lang)}
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
