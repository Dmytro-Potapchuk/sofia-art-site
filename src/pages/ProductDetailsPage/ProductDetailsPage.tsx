import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductDetails } from '../../components/ProductDetails';
import { useLanguage } from '../../context/LanguageContext';
import { useArtworks } from '../../context/ArtworksContext';
import { ScrollLink } from '../../components/ScrollLink/ScrollLink';
import styles from './ProductDetailsPage.module.css';

const ProductDetailsPage = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { images } = useArtworks();
  const image = images.find((img) => img.id === id);

  if (!image) {
    return (
      <div className={`container ${styles.notFound}`}>
        <h1 className={styles.notFoundTitle}>{t('notFoundTitle')}</h1>
        <p className={styles.notFoundText}>{t('notFoundText')}</p>
        <ScrollLink to="/" className="btn btn--primary">
          {t('notFoundCta')}
        </ScrollLink>
      </div>
    );
  }

  return <ProductDetails image={image} />;
};

export { ProductDetailsPage };
