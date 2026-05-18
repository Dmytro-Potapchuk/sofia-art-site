import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { ScrollLink } from '../ScrollLink/ScrollLink';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { LanguageToggle } from '../LanguageToggle/LanguageToggle';
import { AuthButton } from '../AuthButton';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useBodyScrollLock(menuOpen);
  useEscapeKey(menuOpen, closeMenu);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, location.hash, closeMenu]);

  const navItems = [
    { to: '/', label: t('navGallery'), section: '' },
    { to: '/#collection', label: t('navCollection'), section: 'collection' },
    { to: '/#contact', label: t('navContact'), section: 'contact' },
  ];

  const isActive = (section: string) => {
    if (section === '') return location.pathname === '/' && !location.hash;
    return location.hash === `#${section}`;
  };

  const mobileMenu = (
    <>
      <div
        className={`${styles.backdrop} ${menuOpen ? styles.backdropVisible : ''}`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />
      <nav
        id="mobile-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>{t('brand')}</span>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={closeMenu}
            aria-label={t('navMenuClose')}
          >
            <span className={styles.drawerCloseIcon} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.drawerInner}>
          {navItems.map(({ to, label, section }) => (
            <ScrollLink
              key={to}
              to={to}
              className={`${styles.drawerLink} ${
                isActive(section) ? styles.drawerLinkActive : ''
              }`}
              onNavigate={closeMenu}
            >
              {label}
            </ScrollLink>
          ))}

          <div className={styles.drawerControls}>
            <LanguageToggle />
            <ThemeToggle />
            <AuthButton />
          </div>

          <ScrollLink
            to="/#contact"
            className={`btn btn--primary ${styles.drawerCta}`}
            onNavigate={closeMenu}
          >
            {t('navInquire')}
          </ScrollLink>
        </div>
      </nav>
    </>
  );

  return (
    <header
      className={`${styles.header} ${menuOpen ? styles.headerOpen : ''}`}
    >
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
          <div className={styles.desktopActions}>
            <LanguageToggle />
            <ThemeToggle />
            <ScrollLink
              to="/#contact"
              className={`btn btn--ghost ${styles.inquireBtn}`}
              onNavigate={closeMenu}
            >
              {t('navInquire')}
            </ScrollLink>
            <AuthButton />
          </div>
          <button
            type="button"
            className={`${styles.menuToggle} ${
              menuOpen ? styles.menuToggleOpen : ''
            }`}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            aria-label={menuOpen ? t('navMenuClose') : t('navMenuOpen')}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
          </button>
        </div>
      </div>

      {createPortal(mobileMenu, document.body)}
    </header>
  );
};

export { Header };
