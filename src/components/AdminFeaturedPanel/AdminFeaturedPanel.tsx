import React, { useState } from 'react';
import { useArtworks } from '../../context/ArtworksContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedArtwork } from '../../i18n/artworkText';
import { Image } from '../types';
import styles from './AdminFeaturedPanel.module.css';

const AdminFeaturedPanel: React.FC = () => {
  const { language, t } = useLanguage();
  const { isAdmin } = useAuth();
  const { images, featuredId, setFeaturedImage } = useArtworks();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAdmin || images.length === 0) return null;

  const handleSelect = async (image: Image) => {
    if (image.id === featuredId || savingId) return;

    setSavingId(image.id);
    setError(null);
    setSuccess(false);

    try {
      await setFeaturedImage(image.id);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('adminFeaturedError')
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className={styles.panel} aria-label={t('adminFeaturedTitle')}>
      <header className={styles.header}>
        <span className="section-label">{t('heroFeatured')}</span>
        <h3 className={styles.heading}>{t('adminFeaturedTitle')}</h3>
        <p className={styles.hint}>{t('adminFeaturedHint')}</p>
      </header>

      <div className={styles.grid} role="list">
        {images.map((image) => {
          const { title } = getLocalizedArtwork(image, language);
          const isFeatured = image.id === featuredId;
          const isSaving = savingId === image.id;

          return (
            <button
              key={image.id}
              type="button"
              role="listitem"
              className={`${styles.card} ${isFeatured ? styles.cardFeatured : ''}`}
              onClick={() => void handleSelect(image)}
              disabled={Boolean(savingId)}
              aria-pressed={isFeatured}
              aria-label={`${title}${isFeatured ? ` — ${t('adminFeaturedCurrent')}` : ''}`}
            >
              <span className={styles.thumbWrap}>
                <img
                  src={image.url}
                  alt=""
                  className={styles.thumb}
                  loading="lazy"
                />
                {isFeatured && (
                  <span className={styles.badge}>{t('adminFeaturedCurrent')}</span>
                )}
                {isSaving && (
                  <span className={styles.saving}>{t('adminFeaturedSaving')}</span>
                )}
              </span>
              <span className={styles.title}>{title}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className={styles.success} role="status">
          {t('adminFeaturedSuccess')}
        </p>
      )}
    </section>
  );
};

export { AdminFeaturedPanel };
