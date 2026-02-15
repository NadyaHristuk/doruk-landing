import { useState, useRef, lazy, Suspense } from 'react';
// utils
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';
import { getSectionLabel } from './utils/navigation';
// hooks
import { useScrollTriggers } from './hooks/useScrollTriggers';
import { useScrollSmoother } from './hooks/useScrollSmoother';
// components - lazy loaded for code splitting
const HeroSection = lazy(() => import('./sections/HeroSection'));
const WhoWeAre = lazy(() => import('./sections/WhoWeAre'));
const KeyFacts = lazy(() => import('./sections/KeyFacts'));
const OurBenefits = lazy(() => import('./sections/OurBenefits'));
const KeepInTouch = lazy(() => import('./sections/KeepInTouch'));
// config
import { menu } from './config';
// local components
import { Nav } from './components/Nav';
// styles
import './scss/fonts.css';
import './App.scss';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, ScrollSmoother);

/**
 * @see {@link https://gsap.com} for GSAP animation library
 * @see {@link https://gsap.com/resources/React} useGSAP() Hook
 * @see {@link https://gsap.com/docs/v3/Plugins/ScrollTrigger} for ScrollTrigger plugin
 * @see {@link https://gsap.com/docs/v3/Plugins/ScrollToPlugin} for ScrollToPlugin
 * @see {@link https://gsap.com/docs/v3/Plugins/ScrollSmoother} for ScrollSmoother plugin
 */

const App = () => {
  const container = useRef(),
    [mobileMenuOpen, setMobileMenuOpen] = useState(false),
    [activeSection, setActiveSection] = useState('hero'),
    [lang, setLang] = useState('en');

  // Initialize ScrollSmoother
  useScrollSmoother(container.current);

  // Initialize ScrollTriggers for sections
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
            <div style={{ 
              minHeight: '100vh', 
              background: 'var(--color-bg, #1c1c1e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
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
          <Suspense fallback={
            <div style={{ 
              minHeight: '100vh', 
              background: 'var(--color-bg, #1c1c1e)'
            }} />
          }>
            <WhoWeAre lang={lang} />
          </Suspense>
        </section>
        <section
          id="key-facts"
          className="section section--key-facts"
          aria-label={getSectionLabel(menu, lang, 'key-facts')}
        >
          <Suspense fallback={
            <div style={{ 
              minHeight: '100vh', 
              background: 'var(--color-bg, #1c1c1e)'
            }} />
          }>
            <KeyFacts lang={lang} />
          </Suspense>
        </section>
        <section
          id="our-benefits"
          className="section section--our-benefits"
          aria-label={getSectionLabel(menu, lang, 'our-benefits')}
        >
          <Suspense fallback={
            <div style={{ 
              minHeight: '100vh', 
              background: 'var(--color-bg, #1c1c1e)'
            }} />
          }>
            <OurBenefits lang={lang} />
          </Suspense>
        </section>
        <section
          id="keep-in-touch"
          className="section section--keep-in-touch"
          aria-label={getSectionLabel(menu, lang, 'keep-in-touch')}
        >
          <Suspense fallback={
            <div style={{ 
              minHeight: '100vh', 
              background: 'var(--color-bg, #1c1c1e)'
            }} />
          }>
            <KeepInTouch lang={lang} />
          </Suspense>
        </section>
      </div>
    </main>
  );
};

export default App;
