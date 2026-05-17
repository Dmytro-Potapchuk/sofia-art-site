import React from 'react';
import { Language } from '../../i18n/translations';
import { useLanguage } from '../../context/LanguageContext';
import styles from './LanguageToggle.module.css';

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  const setLang = (lang: Language) => () => setLanguage(lang);

  return (
    <div className={styles.group} role="group" aria-label="Language">
      <button
        type="button"
        className={`${styles.btn} ${language === 'pl' ? styles.btnActive : ''}`}
        onClick={setLang('pl')}
        aria-pressed={language === 'pl'}
      >
        {t('langPl')}
      </button>
      <button
        type="button"
        className={`${styles.btn} ${language === 'en' ? styles.btnActive : ''}`}
        onClick={setLang('en')}
        aria-pressed={language === 'en'}
      >
        {t('langEn')}
      </button>
    </div>
  );
};

export { LanguageToggle };
