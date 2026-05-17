import React, { FormEvent, useState } from 'react';
import { useArtworks } from '../../context/ArtworksContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AdminArtworkPanel.module.css';

const AdminArtworkPanel: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { addImage } = useArtworks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAdmin) return null;

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
      await addImage({ title, description, file });
      setTitle('');
      setDescription('');
      setFile(null);
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
      <h3 className={styles.heading}>{t('adminPanelTitle')}</h3>
      <p className={styles.hint}>{t('adminPanelHint')}</p>

      <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
        <label className={styles.label}>
          {t('adminTitleLabel')}
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          {t('adminDescriptionLabel')}
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <label className={`${styles.label} ${styles.fileField}`}>
          {t('adminFileLabel')}
          <input
            className={styles.fileInput}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{t('adminUploadSuccess')}</p>}

        <div className={styles.submitRow}>
          <button
            type="submit"
            className="btn btn--primary"
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
