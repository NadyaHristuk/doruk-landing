
import { menu } from '../config';
import { scrollToSection } from '../utils/navigation';

export const Nav = ({ 
  isMobileMenu = false, 
  activeSection, 
  lang, 
  onMenuClose,
  setActiveSection
}) => {
  const handleNavigate = (id) => {
    if (isMobileMenu && onMenuClose) {
      onMenuClose();
    }
    
    scrollToSection(id, {
      onComplete: () => setActiveSection?.(id)
    });
  };

  return (
    <nav className="nav" aria-label="Section navigation">
      <ul className="nav__list" role="list">
        {menu.map((item) => (
          <li
            key={item.id}
            className={`nav__item ${
              activeSection === item.id ? 'nav__item--active' : ''
            }`}
          >
            <div
              className="nav__link"
              role="link"
              tabIndex={0}
              aria-current={activeSection === item.id ? 'page' : undefined}
              onClick={() => handleNavigate(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavigate(item.id);
                }
              }}
            >
              {isMobileMenu ? (
                <span>{item.title[lang]}</span>
              ) : (
                <i className={`${item.icon} nav__icon`} aria-hidden="true" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};
