import HeroStars from "./HeroStars.jsx";
import lightning from "../assets/svg/lightning.svg";

const HeroBackground = () => {
    return (
        <div className="hero__bg" aria-hidden="true">
            <HeroStars className="hero__bg-particles" particleCount={180} />
            <img src={lightning} class="lightning" aria-hidden="true" />
        </div>
    );
};

export default HeroBackground;
