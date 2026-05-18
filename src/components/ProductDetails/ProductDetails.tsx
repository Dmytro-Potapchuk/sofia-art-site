import React, { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import '../../styles/zoom-overrides.css';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedArtwork } from '../../i18n/artworkText';
import { useAuth } from '../../context/AuthContext';
import { useArtworks } from '../../context/ArtworksContext';
import { AdminEditArtworkModal } from '../AdminEditArtworkModal';
import { ScrollLink } from '../ScrollLink/ScrollLink';
import { ProductDetailsProps } from '../types';
import styles from './ProductDetails.module.css';

const ProductDetails: React.FC<ProductDetailsProps> = ({ image }) => {
  const { language, t } = useLanguage();
  const { isAdmin } = useAuth();
  const { updateImage } = useArtworks();
  const [editOpen, setEditOpen] = useState(false);
  const { title, description } = getLocalizedArtwork(image, language);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.imagePanel}>
            <Zoom>
              <img src={image.url} alt={title} />
            </Zoom>
          </div>

          <div className={styles.content}>
            <span className={styles.eyebrow}>{t('detailsEyebrow')}</span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{t('detailsMedium')}</span>
                <span className={styles.metaValue}>
                  {t('detailsMediumValue')}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>
                  {t('detailsAvailability')}
                </span>
                <span className={styles.metaValue}>
                  {t('detailsAvailable')}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <ScrollLink to="/#contact" className="btn btn--primary">
                {t('detailsInquire')}
              </ScrollLink>
              <ScrollLink to="/" className="btn btn--ghost">
                {t('detailsBack')}
              </ScrollLink>
              {isAdmin && (
                <button
                  type="button"
                  className={`btn btn--ghost ${styles.editBtn}`}
                  onClick={() => setEditOpen(true)}
                >
                  {t('adminEdit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AdminEditArtworkModal
        image={editOpen ? image : null}
        onClose={() => setEditOpen(false)}
        onSave={updateImage}
      />
    </div>
  );
};

export { ProductDetails };
