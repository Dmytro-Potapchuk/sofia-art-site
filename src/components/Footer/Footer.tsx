import React from 'react';
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
} from '../../i18n/translations';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollLink } from '../ScrollLink/ScrollLink';
import styles from './Footer.module.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brandBlock}>
            <p className={styles.brand}>{t('brand')}</p>
            <p className={styles.tagline}>{t('footerTagline')}</p>
          </div>

          <div>
            <p className={styles.columnTitle}>{t('footerNavigate')}</p>
            <nav className={styles.links} aria-label="Footer navigation">
              <ScrollLink to="/" className={styles.link}>
                {t('navGallery')}
              </ScrollLink>
              <ScrollLink to="/#collection" className={styles.link}>
                {t('navCollection')}
              </ScrollLink>
              <ScrollLink to="/#contact" className={styles.link}>
                {t('navContact')}
              </ScrollLink>
            </nav>
          </div>

          <div>
            <p className={styles.columnTitle}>{t('footerStudio')}</p>
            <address className={styles.contactItem}>
              {t('footerAddress')}
              <br />
              <a href={CONTACT_PHONE_HREF} className={styles.link}>
                {CONTACT_PHONE}
              </a>
              <br />
              <a href={CONTACT_EMAIL_HREF} className={styles.link}>
                {CONTACT_EMAIL}
              </a>
            </address>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} {t('brand')}. {t('footerRights')}
          </span>
          <span>{t('footerCrafted')}</span>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
