import { useState } from 'react';
import { langs, defaultLang } from '../config';
import logo from '../assets/png/home/logo.png';
import logoWebp from '../assets/webp/home/logo.webp';

const HeroHeader = ({ lang, setLang }) => {
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="hero__header">
      <a
        className="hero__header-logo"
        href="#hero"
        aria-label="Go to hero section"
        onClick={(e) => e.preventDefault()}
      >
        <picture>
          <source type="image/webp" srcSet={logoWebp} />
          <img src={logo} width="215" height="40" alt="" aria-hidden="true" />
        </picture>
      </a>
      <nav
        className={`hero__header-lang hero__header-lang--mobile ${
          langOpen ? 'hero__header-lang--open' : ''
        }`}
        aria-label="Language selector"
      >
        <div className="hero__header-lang-indicator" aria-hidden="true" />
        <ul className="hero__header-lang-list" role="list">
          {langs.map((item) => (
            <li key={item}>
              <button
                type="button"
                className={`hero__header-lang-btn ${
                  lang === item ? 'hero__header-lang-btn--active' : ''
                }`}
                aria-pressed={lang === item}
                aria-label={`Switch language to ${item}`}
                tabIndex={langOpen ? 0 : -1}
                onClick={() => {
                  if (langOpen) {
                    setLang(item);
                    setLangOpen(false);
                  }
                }}
              >
                {langOpen ? item : lang}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="hero__header-lang" aria-label="Language selector">
        <ul className="hero__header-lang-list" role="list">
          {langs.map((item) => (
            <li key={item}>
              <button
                type="button"
                className={`hero__header-lang-btn ${
                  lang === item ? 'hero__header-lang-btn--active' : ''
                }`}
                aria-pressed={lang === item}
                aria-label={`Switch language to ${item}`}
                onClick={() => setLang(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default HeroHeader;
