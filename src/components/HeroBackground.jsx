import AnimatedLightning from "./AnimatedLightning.jsx";
import ParticleJellyfish from "./ParticleJellyfish.jsx";

const HeroBackground = () => {
    return (
        <div className="hero__bg" aria-hidden="true">
            <div className="hero__bg-box" aria-hidden="true">
                <div className="hero__bg-rocks" aria-hidden="true" />
                <div className="hero__bg-lightning" aria-hidden="true">
                    <AnimatedLightning
                        highlightPaths={[
                            `M73.5 295 
                        L92.5 127
                        L284 283.1
                        L237 309.1                      
                        L135 226.5
                        L344 151
                        L307 307
                        `,
                        ]}
                        viewBox="0 0 615 415"
                    />
                </div>
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
