import AnimatedLightning from "./AnimatedLightning.jsx";
import ParticleJellyfish from "./ParticleJellyfish.jsx";

const HeroBackground = () => {
    return (
        <div className="hero__bg" aria-hidden="true">
            <div className="hero__bg-rocks" aria-hidden="true" > 
            <div className="hero__bg-lightning" aria-hidden="true">
                <AnimatedLightning
                    highlightPaths={[
                        `M73.5 295 
                        L92.5 127
                        L148 171.7
                        M159.5 183.1
                        L167.5 189.1
                        M189.5 207.1
                        L195.5 211.1
                        M231.5 241.1
                        L284 283.1
                        L237 309.1
                        L229 303.7
                        M209 288
                        L135 226.5
                        L344 151
                        L307.5 303.1
                        `,
                    ]}
                    viewBox="0 0 615 415"
                /></div>
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
