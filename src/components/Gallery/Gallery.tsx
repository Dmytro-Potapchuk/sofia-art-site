import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useArtworks } from '../../context/ArtworksContext';
import { Image } from '../types';
import styles from './Gallery.module.css';

interface GalleryProps {
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { removeImage } = useArtworks();
  const location = useLocation();
  const navigate = useNavigate();
  const [pageSize] = useState<number>(8);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    setCurrentPage(Number.isNaN(page) ? 1 : page);
  }, [location]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.ceil(images.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const displayedImages = images.slice(startIndex, startIndex + pageSize);

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

  const goToPage = (page: number) => {
    navigate({
      pathname: '/',
      search: `?page=${page}`,
      hash: '#collection',
    });
  };

  const handlePageClick = (page: number) => {
    goToPage(page);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.grid}>
        {displayedImages.map((image, index) => (
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
                aria-label={`View ${image.title}`}
              >
                <img
                  src={image.url}
                  alt={image.title}
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
                  {String(startIndex + index + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.title}>{image.title}</h3>
                <p className={styles.description}>{image.description}</p>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={`btn btn--ghost ${styles.cardAction}`}
                    onClick={() => handleDetailsClick(image.id)}
                  >
                    {t('galleryViewDetails')}
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      className={`btn btn--ghost ${styles.deleteBtn}`}
                      onClick={() => void handleDelete(image)}
                    >
                      {t('adminDelete')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Gallery pagination">
          <button
            type="button"
            className={`${styles.pageBtn} ${styles.pageNav}`}
            onClick={handlePrevClick}
            disabled={currentPage === 1}
          >
            {t('galleryPrev')}
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                type="button"
                className={`${styles.pageBtn} ${
                  pageNumber === currentPage ? styles.pageBtnActive : ''
                }`}
                onClick={() => handlePageClick(pageNumber)}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            type="button"
            className={`${styles.pageBtn} ${styles.pageNav}`}
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
          >
            {t('galleryNext')}
          </button>
        </nav>
      )}
    </div>
  );
};

export { Gallery };
