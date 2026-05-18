import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedArtwork } from '../../i18n/artworkText';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { ArtworkCopy, Image } from '../types';
import styles from './AdminEditArtworkModal.module.css';

interface AdminEditArtworkModalProps {
  image: Image | null;
  onClose: () => void;
  onSave: (id: string, data: ArtworkCopy) => Promise<void>;
}

const emptyCopy = (): ArtworkCopy => ({
  titleEn: '',
  titlePl: '',
  descriptionEn: '',
  descriptionPl: '',
});

const AdminEditArtworkModal: React.FC<AdminEditArtworkModalProps> = ({
  image,
  onClose,
  onSave,
}) => {
  const { language, t } = useLanguage();
  const open = Boolean(image);
  const [copy, setCopy] = useState<ArtworkCopy>(emptyCopy);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backdropPointerDown = useRef(false);

  useBodyScrollLock(open);
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (image) {
      setCopy({
        titleEn: image.titleEn,
        titlePl: image.titlePl,
        descriptionEn: image.descriptionEn,
        descriptionPl: image.descriptionPl,
      });
      setError(null);
      setSubmitting(false);
    }
  }, [image]);

  if (!open || !image) return null;

  const preview = getLocalizedArtwork(image, language);

  const handleBackdropPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    backdropPointerDown.current = event.target === event.currentTarget;
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      event.target === event.currentTarget &&
      backdropPointerDown.current
    ) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSave(image.id, copy);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminEditError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onPointerDown={handleBackdropPointerDown}
      onClick={handleBackdropClick}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-artwork-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dialogHeader}>
          <div className={styles.titleBlock}>
            <h2 id="edit-artwork-title" className={styles.title}>
              {t('adminEditTitle')}
            </h2>
            <p className={styles.subtitle}>{preview.title}</p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={submitting}
            aria-label={t('modalClose')}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
          <label className={styles.label}>
            {t('adminTitleEn')}
            <input
              className={styles.input}
              value={copy.titleEn}
              onChange={(e) =>
                setCopy((prev) => ({ ...prev, titleEn: e.target.value }))
              }
              required
              disabled={submitting}
            />
          </label>

          <label className={styles.label}>
            {t('adminTitlePl')}
            <input
              className={styles.input}
              value={copy.titlePl}
              onChange={(e) =>
                setCopy((prev) => ({ ...prev, titlePl: e.target.value }))
              }
              required
              disabled={submitting}
            />
          </label>

          <label className={styles.label}>
            {t('adminDescriptionEn')}
            <textarea
              className={styles.textarea}
              value={copy.descriptionEn}
              onChange={(e) =>
                setCopy((prev) => ({ ...prev, descriptionEn: e.target.value }))
              }
              rows={4}
              disabled={submitting}
            />
          </label>

          <label className={styles.label}>
            {t('adminDescriptionPl')}
            <textarea
              className={styles.textarea}
              value={copy.descriptionPl}
              onChange={(e) =>
                setCopy((prev) => ({ ...prev, descriptionPl: e.target.value }))
              }
              rows={4}
              disabled={submitting}
            />
          </label>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onClose}
              disabled={submitting}
            >
              {t('authCancel')}
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? t('adminSaving') : t('adminSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { AdminEditArtworkModal };
