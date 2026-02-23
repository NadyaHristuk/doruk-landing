import { useState, useRef, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';
import { getSectionLabel } from './utils/navigation';
import { useScrollTriggers } from './hooks/useScrollTriggers';
import { useScrollSmoother } from './hooks/useScrollSmoother';
const HeroSection = lazy(() => import('./sections/HeroSection'));
const WhoWeAre = lazy(() => import('./sections/WhoWeAre'));
const KeyFacts = lazy(() => import('./sections/KeyFacts'));
const OurBenefits = lazy(() => import('./sections/OurBenefits'));
const KeepInTouch = lazy(() => import('./sections/KeepInTouch'));
import { menu } from './config';
import { Nav } from './components/Nav';
import './scss/fonts.css';
import './App.scss';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, ScrollSmoother);

const App = () => {
  const container = useRef(),
    [mobileMenuOpen, setMobileMenuOpen] = useState(false),
    [activeSection, setActiveSection] = useState('hero'),
    [lang, setLang] = useState('en');

  useScrollSmoother(container.current);

  useScrollTriggers(container, {
    onSectionChange: setActiveSection
  });

  return (
    <main ref={container}>
      {mobileMenuOpen && (
        <div className="mobile-menu mobile-menu--opened">
          <div className="mobile-menu__decorations">
            <div className="mobile-menu__rectangles mobile-menu__rectangles--horizontal">
              <div className="mobile-menu__rectangle" />
              <div className="mobile-menu__rectangle" />
              <div className="mobile-menu__rectangle" />
              <div className="mobile-menu__rectangle" />
            </div>
            <div className="mobile-menu__rectangles mobile-menu__rectangles--vertical">
              <div className="mobile-menu__rectangle" />
              <div className="mobile-menu__rectangle" />
              <div className="mobile-menu__rectangle" />
            </div>
          </div>
          <Nav
            isMobileMenu={true}
            activeSection={activeSection}
            lang={lang}
            onMenuClose={() => setMobileMenuOpen(false)}
            setActiveSection={setActiveSection}
          />
        </div>
      )}
      <aside className="sidebar">
        <button
          type="button"
          aria-label="Toggle mobile menu"
          className={`sidebar__toggle ${
            mobileMenuOpen ? 'sidebar__toggle--opened' : ''
          }`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <i className={mobileMenuOpen ? 'icon-close' : 'icon-menu'}></i>
        </button>
        <Nav
          activeSection={activeSection}
          lang={lang}
          setActiveSection={setActiveSection}
        />
      </aside>

      <div id="smooth-content" className="smooth-content">
        <section
          id="hero"
          className="section section--hero"
          aria-label={getSectionLabel(menu, lang, 'hero')}
        >
          <Suspense fallback={
            <div className="section-fallback section-fallback--centered">
              <div className="skeleton-loader" aria-label="Loading content" />
            </div>
          }>
            <HeroSection
              setLang={setLang}
              sectionIsActive={activeSection === 'hero'}
              lang={lang}
            />
          </Suspense>
        </section>
        <section
          id="who-we-are"
          className="section section--who-we-are"
          aria-label={getSectionLabel(menu, lang, 'who-we-are')}
        >
          <Suspense fallback={<div className="section-fallback" />}>
            <WhoWeAre lang={lang} />
          </Suspense>
        </section>
        <section
          id="key-facts"
          className="section section--key-facts"
          aria-label={getSectionLabel(menu, lang, 'key-facts')}
        >
          <Suspense fallback={<div className="section-fallback" />}>
            <KeyFacts lang={lang} />
          </Suspense>
        </section>
        <section
          id="our-benefits"
          className="section section--our-benefits"
          aria-label={getSectionLabel(menu, lang, 'our-benefits')}
        >
          <Suspense fallback={<div className="section-fallback" />}>
            <OurBenefits lang={lang} />
          </Suspense>
        </section>
        <section
          id="keep-in-touch"
          className="section section--keep-in-touch"
          aria-label={getSectionLabel(menu, lang, 'keep-in-touch')}
        >
          <Suspense fallback={<div className="section-fallback" />}>
            <KeepInTouch lang={lang} />
          </Suspense>
        </section>
      </div>
    </main>
  );
};

export default App;
