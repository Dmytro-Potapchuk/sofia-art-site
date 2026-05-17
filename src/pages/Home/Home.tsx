import React from 'react';
import { useLocation } from 'react-router-dom';
import { Gallery } from '../../components/Gallery';
import { ContactSection } from '../../components/ContactSection/ContactSection';
import { ScrollLink } from '../../components/ScrollLink/ScrollLink';
import { useLanguage } from '../../context/LanguageContext';
import { AdminArtworkPanel } from '../../components/AdminArtworkPanel/AdminArtworkPanel';
import { useArtworks } from '../../context/ArtworksContext';
import styles from './Home.module.css';

const Home = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { images } = useArtworks();
  const heroImage = images[0];

  if (!heroImage) {
    return null;
  }

  return (
    <>
      <section className={styles.hero}>
        <span className={styles.heroGlow} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>{t('heroEyebrow')}</span>
            <h1 className={styles.title}>
              {t('heroTitle')} <em>{t('heroTitleEm')}</em> {t('heroTitleEnd')}
            </h1>
            <p className={styles.lead}>{t('heroLead')}</p>
            <div className={styles.heroActions}>
              <ScrollLink to="/#collection" className="btn btn--primary">
                {t('heroCtaCollection')}
              </ScrollLink>
              <ScrollLink to="/#contact" className="btn btn--ghost">
                {t('heroCtaContact')}
              </ScrollLink>
            </div>
          </div>

          <figure className={styles.heroVisual}>
            <img
              src={heroImage.url}
              alt={heroImage.title}
              className={styles.heroImage}
            />
            <figcaption className={styles.heroCaption}>
              {t('heroFeatured')} — {heroImage.title}
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="collection" className={styles.collection}>
        <div className="container">
          <header className={styles.collectionHeader}>
            <span className="section-label">{t('collectionLabel')}</span>
            <h2 className={styles.collectionTitle}>{t('collectionTitle')}</h2>
            <p className={styles.collectionSubtitle}>
              {t('collectionSubtitle')}
            </p>
          </header>
          <AdminArtworkPanel />
          <Gallery key={location.search} images={images} />
        </div>
      </section>

      <ContactSection />
    </>
  );
};

export { Home };
