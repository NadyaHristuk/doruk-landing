import AnimatedLightning from './AnimatedLightning.jsx';
import ParticleJellyfish from './ParticleJellyfish.jsx';

const HeroBackground = () => {
  return (
    <div className="hero__bg" aria-hidden="true">
      <div className="hero__bg-rocks" aria-hidden="true" />
      <div className="hero__bg-lightning" aria-hidden="true">
        <AnimatedLightning
          highlightPaths={[
            'M0.5 378.7L48.9 0.9L172.3 101.4',
            'M356.7 241.1L481.2 354.7',
            'M481.2 354.7L371.5 407.9L356.7 392.8',
            'M310.5 362.8L140.7 218.2',
            'M140.8 217.3L274.5 173.8L619.8 49.3L530.5 407.9'
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
      <ParticleJellyfish className="hero__bg-particles" particleCount={180} />
    </div>
  );
};

export default HeroBackground;
