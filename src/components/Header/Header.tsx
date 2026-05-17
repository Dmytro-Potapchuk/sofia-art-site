import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollLink } from '../ScrollLink/ScrollLink';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { LanguageToggle } from '../LanguageToggle/LanguageToggle';
import { AuthButton } from '../AuthButton';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { to: '/', label: t('navGallery'), section: '' },
    { to: '/#collection', label: t('navCollection'), section: 'collection' },
    { to: '/#contact', label: t('navContact'), section: 'contact' },
  ];

  const isActive = (section: string) => {
    if (section === '') return location.pathname === '/' && !location.hash;
    return location.hash === `#${section}`;
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          {t('brand')}
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {navItems.map(({ to, label, section }) => (
            <ScrollLink
              key={to}
              to={to}
              className={`${styles.navLink} ${
                isActive(section) ? styles.navLinkActive : ''
              }`}
              onNavigate={closeMenu}
            >
              {label}
            </ScrollLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <LanguageToggle />
          <ThemeToggle />
          <ScrollLink
            to="/#contact"
            className="btn btn--ghost"
            onNavigate={closeMenu}
          >
            {t('navInquire')}
          </ScrollLink>
          <AuthButton />
          <button
            type="button"
            className={`${styles.menuToggle} ${
              menuOpen ? styles.menuToggleOpen : ''
            }`}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        className={`${styles.mobileNav} ${
          menuOpen ? styles.mobileNavOpen : ''
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {navItems.map(({ to, label, section }) => (
          <ScrollLink
            key={to}
            to={to}
            className={`${styles.navLink} ${
              isActive(section) ? styles.navLinkActive : ''
            }`}
            onNavigate={closeMenu}
          >
            {label}
          </ScrollLink>
        ))}
        <div className={styles.mobileControls}>
          <LanguageToggle />
          <ThemeToggle />
          <AuthButton />
        </div>
        <ScrollLink
          to="/#contact"
          className="btn btn--primary"
          onNavigate={closeMenu}
        >
          {t('navInquire')}
        </ScrollLink>
      </nav>
    </header>
  );
};

export { Header };
