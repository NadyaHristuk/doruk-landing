import AnimatedLightning from "./AnimatedLightning.jsx";
import ParticleJellyfish from "./ParticleJellyfish.jsx";

const HeroBackground = () => {
    return (
        <div className="hero__bg" aria-hidden="true">
            <div className="hero__bg-rocks" aria-hidden="true" />
            <div className="hero__bg-lightning" aria-hidden="true">
                <AnimatedLightning
                    highlightPaths={[
                        `M9 378 
                        L50 10 
                        L172 112
                        M358 260 
                        L481 364
                        L379 425 
                        L360 410
                        M310 373 
                        L145 236
                        L619 64
                        L533 407
                        `,
                    ]}
                    viewBox="0 0 615 415"
                />
            </div>
            <div
                className="hero__bg-gradient hero__bg-gradient--top"
                aria-hidden="true"
            />
            <div
                className="hero__bg-gradient hero__bg-gradient--bottom"
                aria-hidden="true"
            />
            <div
                className="hero__bg-gradient hero__bg-gradient--right"
                aria-hidden="true"
            />
            <div
                className="hero__bg-gradient hero__bg-gradient--left"
                aria-hidden="true"
            />
            <ParticleJellyfish
                className="hero__bg-particles"
                particleCount={180}
            />
        </div>
    );
};

export default HeroBackground;
