import { menu } from "../config";
import { scrollToSection } from "../utils/navigation";

export const Nav = ({
    isMobileMenu = false,
    activeSection,
    lang,
    onMenuClose,
    setActiveSection,
}) => {
    const handleNavigate = (id) => {
        if (isMobileMenu && onMenuClose) {
            onMenuClose();
        }

        scrollToSection(id, {
            onComplete: () => setActiveSection?.(id),
        });
    };

    return (
        <nav className="nav" aria-label="Section navigation">
            <ul className="nav__list" role="list">
                {menu.map((item) => (
                    <li
                        key={item.id}
                        className={`nav__item ${
                            activeSection === item.id ? "nav__item--active" : ""
                        }`}
                    >
                        <button
                            className="nav__link"
                            type="button"
                            aria-current={
                                activeSection === item.id ? "page" : undefined
                            }
                            onClick={() => handleNavigate(item.id)}
                        >
                            {isMobileMenu ? (
                                item.title[lang]
                            ) : (
                                <i
                                    className={`${item.icon} nav__icon`}
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
