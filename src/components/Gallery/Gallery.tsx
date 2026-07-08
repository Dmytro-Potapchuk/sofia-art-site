import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedArtwork } from '../../i18n/artworkText';
import { useAuth } from '../../context/AuthContext';
import { useArtworks } from '../../context/ArtworksContext';
import { AdminEditArtworkModal } from '../AdminEditArtworkModal';
import { Image } from '../types';
import styles from './Gallery.module.css';

interface GalleryProps {
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const { language, t } = useLanguage();
  const { isAdmin } = useAuth();
  const { removeImage, updateImage } = useArtworks();
  const navigate = useNavigate();
  const [editingImage, setEditingImage] = useState<Image | null>(null);

  const handleDetailsClick = (id: string) => {
    navigate(`/image/${id}`);
  };

  const handleDelete = async (image: Image) => {
    if (!window.confirm(t('adminDeleteConfirm'))) return;

    try {
      await removeImage(image);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : t('adminDeleteError'));
    }
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.grid}>
        {images.map((image, index) => {
          const { title, description } = getLocalizedArtwork(image, language);

          return (
          <article
            key={image.id}
            className={styles.gridItem}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className={styles.card}>
              <button
                type="button"
                className={styles.imageWrap}
                onClick={() => handleDetailsClick(image.id)}
                aria-label={`${t('galleryViewPiece')}: ${title}`}
              >
                <img
                  src={image.url}
                  alt={title}
                  className={styles.image}
                  loading="lazy"
                />
                <span className={styles.imageOverlay}>
                  <span className={styles.viewLabel}>
                    {t('galleryViewPiece')}
                  </span>
                </span>
              </button>
              <div className={styles.body}>
                <span className={styles.index}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={`btn btn--ghost ${styles.cardAction}`}
                    onClick={() => handleDetailsClick(image.id)}
                  >
                    {t('galleryViewDetails')}
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        className={`btn btn--ghost ${styles.editBtn}`}
                        onClick={() => setEditingImage(image)}
                      >
                        {t('adminEdit')}
                      </button>
                      <button
                        type="button"
                        className={`btn btn--ghost ${styles.deleteBtn}`}
                        onClick={() => void handleDelete(image)}
                      >
                        {t('adminDelete')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>
          );
        })}
      </div>

      <AdminEditArtworkModal
        image={editingImage}
        onClose={() => setEditingImage(null)}
        onSave={updateImage}
      />
    </div>
  );
};

export { Gallery };
