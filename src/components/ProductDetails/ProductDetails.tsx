import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import '../../styles/zoom-overrides.css';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollLink } from '../ScrollLink/ScrollLink';
import { ProductDetailsProps } from '../types';
import styles from './ProductDetails.module.css';

const ProductDetails: React.FC<ProductDetailsProps> = ({ image }) => {
  const { t } = useLanguage();

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.imagePanel}>
            <Zoom>
              <img src={image.url} alt={image.title} />
            </Zoom>
          </div>

          <div className={styles.content}>
            <span className={styles.eyebrow}>{t('detailsEyebrow')}</span>
            <h1 className={styles.title}>{image.title}</h1>
            <p className={styles.description}>{image.description}</p>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductDetails };
