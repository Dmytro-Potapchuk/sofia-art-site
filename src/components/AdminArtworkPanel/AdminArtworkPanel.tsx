import React, { FormEvent, useId, useRef, useState } from 'react';
import { useArtworks } from '../../context/ArtworksContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArtworkCopy } from '../types';
import styles from './AdminArtworkPanel.module.css';

const IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif';

const emptyCopy = (): ArtworkCopy => ({
  titleEn: '',
  titlePl: '',
  descriptionEn: '',
  descriptionPl: '',
});

const AdminArtworkPanel: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { addImage } = useArtworks();
  const galleryInputId = useId();
  const cameraInputId = useId();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [copy, setCopy] = useState<ArtworkCopy>(emptyCopy);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAdmin) return null;

  const resetForm = () => {
    setCopy(emptyCopy());
    setFile(null);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError(t('adminFileRequired'));
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await addImage({ ...copy, file });
      resetForm();
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('adminUploadError');
      setError(message || t('adminUploadError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.panel} aria-label={t('adminPanelTitle')}>
      <header className={styles.header}>
        <span className="section-label">{t('authRoleAdmin')}</span>
        <h3 className={styles.heading}>{t('adminPanelTitle')}</h3>
        <p className={styles.hint}>{t('adminPanelHint')}</p>
      </header>

      <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="admin-title-en">
              {t('adminTitleEn')}
            </label>
            <input
              id="admin-title-en"
              className={styles.input}
              value={copy.titleEn}
              onChange={(e) =>
                setCopy((prev) => ({ ...prev, titleEn: e.target.value }))
              }
              required
              disabled={submitting}
            />
          </div>
          {/*sdasdadasdwedsfsfrdwa*/}
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="admin-title-pl">
              {t('adminTitlePl')}
            </label>
            <input
              id="admin-title-pl"
              className={styles.input}
              value={copy.titlePl}
              onChange={(e) =>
                setCopy((prev) => ({ ...prev, titlePl: e.target.value }))
              }
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="admin-description-en">
              {t('adminDescriptionEn')}
            </label>
            <textarea
              id="admin-description-en"
              className={styles.textarea}
              value={copy.descriptionEn}
              onChange={(e) =>
                setCopy((prev) => ({ ...prev, descriptionEn: e.target.value }))
              }
              disabled={submitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="admin-description-pl">
              {t('adminDescriptionPl')}
            </label>
            <textarea
              id="admin-description-pl"
              className={styles.textarea}
              value={copy.descriptionPl}
              onChange={(e) =>
                setCopy((prev) => ({ ...prev, descriptionPl: e.target.value }))
              }
              disabled={submitting}
            />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>{t('adminFileLabel')}</span>
          <div className={styles.fileUpload}>
            <input
              ref={galleryInputRef}
              id={galleryInputId}
              className={styles.fileInputHidden}
              type="file"
              accept={IMAGE_ACCEPT}
              onChange={handleFileChange}
              disabled={submitting}
            />
            <input
              ref={cameraInputRef}
              id={cameraInputId}
              className={styles.fileInputHidden}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              disabled={submitting}
            />

            <div className={styles.fileActions}>
              <label
                htmlFor={galleryInputId}
                className={`btn btn--ghost ${styles.fileBtn}`}
              >
                {t('adminFileFromGallery')}
              </label>
              <label
                htmlFor={cameraInputId}
                className={`btn btn--ghost ${styles.fileBtn}`}
              >
                {t('adminFileTakePhoto')}
              </label>
            </div>

            {file ? (
              <p className={styles.fileSelected}>
                <span className={styles.fileSelectedLabel}>
                  {t('adminFileSelected')}:
                </span>{' '}
                {file.name}
              </p>
            ) : (
              <p className={styles.fileHint}>{t('adminFileHint')}</p>
            )}
          </div>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className={styles.success} role="status">
            {t('adminUploadSuccess')}
          </p>
        )}

        <div className={styles.footer}>
          <button
            type="submit"
            className={`btn btn--primary ${styles.submitBtn}`}
            disabled={submitting}
          >
            {submitting ? t('adminUploading') : t('adminUploadBtn')}
          </button>
        </div>
      </form>
    </section>
  );
};

export { AdminArtworkPanel };
