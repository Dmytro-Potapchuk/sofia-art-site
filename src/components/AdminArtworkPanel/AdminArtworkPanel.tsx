import React, { FormEvent, useId, useRef, useState } from 'react';
import { useArtworks } from '../../context/ArtworksContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArtworkCopy } from '../types';
import styles from './AdminArtworkPanel.module.css';

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
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [copy, setCopy] = useState<ArtworkCopy>(emptyCopy);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAdmin) return null;

  const resetForm = () => {
    setCopy(emptyCopy());
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <label htmlFor={fileInputId} className={styles.fileDropzone}>
            <input
              ref={fileInputRef}
              id={fileInputId}
              className={styles.fileInputHidden}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
              disabled={submitting}
            />
            <span className={styles.fileDropzoneIcon} aria-hidden="true">
              ↑
            </span>
            <span className={styles.fileDropzoneText}>
              {file ? file.name : t('adminFileChoose')}
            </span>
            <span className={styles.fileDropzoneHint}>{t('adminFileHint')}</span>
          </label>
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
